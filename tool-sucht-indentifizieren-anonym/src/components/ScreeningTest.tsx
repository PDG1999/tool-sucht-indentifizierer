import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { questions, sections } from '../data/questions';
import { Response, calculatePublicScores, calculateProfessionalScores, getRecommendations } from '../utils/scoring';
import { testResultsAPI } from '../services/api';
import { getUserSession, TestSessionTracker } from '../utils/tracking';
import { getShuffledQuestions } from '../utils/questionUtils';
import { getTrackingData, TrackingData } from '../utils/geoTracking';

const ScreeningTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isProView, setIsProView] = useState(false);
  const [comeFromShortTest, setComeFromShortTest] = useState(false);
  const [prefilledCount, setPrefilledCount] = useState(0); // Neue State: Anzahl vorausgefüllter Fragen
  const sessionTrackerRef = useRef<TestSessionTracker | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  // Durchmische Fragen einmalig beim Laden - macht es unauffälliger
  const shuffledQuestions = useMemo(() => {
    return getShuffledQuestions(questions, 'interleave');
  }, []);

  // Auto-save progress with debouncing (500ms delay)
  const saveProgress = async (currentResponses: Response[], currentQuestion: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/test-results/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: currentResponses,
          currentQuestion,
          testType: 'full'
        })
      });
      console.log('✅ Progress auto-saved');
    } catch (error) {
      console.warn('⚠️ Progress save failed (non-critical):', error);
    }
  };

  // Debounced save function
  const debouncedSave = (currentResponses: Response[], currentQuestion: number) => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout - only saves if user pauses for 500ms
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(currentResponses, currentQuestion);
    }, 500);
  };

  // Lade vorausgefüllte Antworten vom Kurztest
  useEffect(() => {
    const prefilledResponsesStr = localStorage.getItem('prefilledResponses');
    const fromShortTest = localStorage.getItem('comeFromShortTest');
    
    if (prefilledResponsesStr && fromShortTest === 'true') {
      try {
        const prefilledResponses: Response[] = JSON.parse(prefilledResponsesStr);
        setResponses(prefilledResponses);
        setComeFromShortTest(true);
        setPrefilledCount(prefilledResponses.length);
        
        // Finde die erste unbeantwortete Frage
        const answeredQuestionIds = prefilledResponses.map(r => r.questionId);
        const firstUnansweredIndex = shuffledQuestions.findIndex(
          q => !answeredQuestionIds.includes(q.id)
        );
        
        // Setze currentStep auf die erste unbeantwortete Frage
        if (firstUnansweredIndex !== -1) {
          setCurrentStep(firstUnansweredIndex);
          console.log('Springe zu Frage', firstUnansweredIndex + 1, '(erste unbeantwortete)');
        }
        
        // Lösche die gespeicherten Daten nach dem Laden
        localStorage.removeItem('prefilledResponses');
        localStorage.removeItem('comeFromShortTest');
        
        console.log('Antworten vom Kurztest geladen:', prefilledResponses.length);
      } catch (error) {
        console.error('Fehler beim Laden der vorausgefüllten Antworten:', error);
      }
    }
  }, [shuffledQuestions]);

  // Initialize tracking on component mount
  useEffect(() => {
    const initTracking = async () => {
      const userSession = await getUserSession();
      sessionTrackerRef.current = new TestSessionTracker(userSession);
      sessionTrackerRef.current.startQuestion(shuffledQuestions[0].id);
      
      // Fetch geo & device data immediately
      const tracking = await getTrackingData();
      setTrackingData(tracking);
      console.log('📍 Tracking-Daten erfasst:', tracking);
    };
    
    initTracking();
    
    // Track page unload (user leaves without finishing)
    const handleBeforeUnload = async () => {
      // IMMER speichern, auch bei nur 1 Antwort
      if (sessionTrackerRef.current && !showResults && responses.length > 0) {
        sessionTrackerRef.current.abort(shuffledQuestions[currentStep]?.id || 'unknown');
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // WICHTIG: Speichere Progress sofort (synchron)!
        try {
          const progressData = JSON.stringify({
            sessionId,
            responses,
            currentQuestion: currentStep,
            testType: 'full'
          });
          navigator.sendBeacon(`${API_URL}/test-results/save-progress`, new Blob([progressData], { type: 'application/json' }));
          console.log('✅ Progress beim Verlassen gespeichert');
        } catch (error) {
          console.warn('⚠️ Progress save on exit failed:', error);
        }
        
        // ERWEITERT: Speichere Test SOFORT wenn >= 10 Fragen beantwortet (nicht nur beim Abschluss)
        if (responses.length >= 10) {
          const publicScores = calculatePublicScores(responses);
          const proScores = calculateProfessionalScores(responses);
          const sessionData = sessionTrackerRef.current?.getSession();
          
          try {
            // Map German risk levels to English for API
            const getRiskLevelEN = (score: number): string => {
              if (score >= 70) return 'critical';
              if (score >= 50) return 'high';
              if (score >= 30) return 'moderate';
              return 'low';
            };
            
            // Verwende navigator.sendBeacon für zuverlässige Übertragung beim Verlassen
            const data = JSON.stringify({
              responses: responses.map(r => ({ questionId: r.questionId, answer: r.value })),
              publicScores,
              professionalScores: proScores,
              riskLevel: getRiskLevelEN(proScores.overallRisk),
              primaryConcern: proScores.categories.sort((a, b) => b.score - a.score)[0]?.name || 'Unbekannt',
              aborted: true, // ← Markiere als abgebrochen!
              abortedAtQuestion: currentStep + 1,
              completedQuestions: responses.length,
              sessionData: sessionData ? {
                userSession: sessionData.userSession,
                testSession: sessionData.testSession,
                questionMetrics: sessionData.questionMetrics,
              } : undefined,
              trackingData: trackingData ? {
                geoData: trackingData.geoData,
                deviceData: trackingData.deviceData,
                browserFingerprint: trackingData.browserFingerprint,
                referrer: trackingData.referrer
              } : undefined,
            });
            
            // Verwende sendBeacon - garantiert Übertragung auch bei Page Unload
            const success = navigator.sendBeacon(`${API_URL}/test-results/submit`, new Blob([data], { type: 'application/json' }));
            console.log('🚨 Abgebrochener Test gespeichert:', responses.length, 'Fragen, Success:', success);
          } catch (error) {
            console.error('❌ Fehler beim Speichern des abgebrochenen Tests:', error);
          }
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [responses, currentStep, showResults, shuffledQuestions]);

  // Track question changes
  useEffect(() => {
    if (sessionTrackerRef.current && !showResults) {
      sessionTrackerRef.current.startQuestion(shuffledQuestions[currentStep].id);
    }
  }, [currentStep, showResults, shuffledQuestions]);

  const currentQuestion = shuffledQuestions[currentStep];
  // Progress basiert auf tatsächlich beantworteten Fragen, nicht auf chronologischer Position
  const progress = (responses.length / shuffledQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({ questionId: currentQuestion.id, value });
    setResponses(newResponses);
    
    // Track answer
    if (sessionTrackerRef.current) {
      sessionTrackerRef.current.recordAnswer(currentQuestion.id, value);
    }
  };

  const currentAnswer = responses.find(r => r.questionId === currentQuestion.id)?.value;

  const handleNext = async () => {
    // Auto-save progress before moving to next question
    if (responses.length > 0) {
      debouncedSave(responses, currentStep);
    }
    
    if (currentStep < shuffledQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark test as complete
      if (sessionTrackerRef.current) {
        sessionTrackerRef.current.complete();
      }
      
      // Calculate scores before showing results
      const publicScores = calculatePublicScores(responses);
      const proScores = calculateProfessionalScores(responses);
      
      // Get session data
      const sessionData = sessionTrackerRef.current?.getSession();
      
      // Save to database
      try {
        // Map German risk levels to English for API
        const getRiskLevelEN = (score: number): string => {
          if (score >= 70) return 'critical';
          if (score >= 50) return 'high';
          if (score >= 30) return 'moderate';
          return 'low';
        };
        
        await testResultsAPI.submit({
          responses: responses.map(r => ({ questionId: r.questionId, answer: r.value })),
          publicScores,
          professionalScores: proScores,
          riskLevel: getRiskLevelEN(proScores.overallRisk),
          primaryConcern: proScores.categories.sort((a, b) => b.score - a.score)[0]?.name || 'Unbekannt',
          // Include tracking data
          sessionData: sessionData ? {
            userSession: sessionData.userSession,
            testSession: {
              startTime: sessionData.startTime,
              endTime: sessionData.endTime,
              totalTime: sessionData.totalTime,
              resumeCount: sessionData.resumeCount,
              abortedAt: sessionData.abortedAt,
            },
            questionMetrics: sessionData.questionMetrics,
          } : undefined,
          trackingData: trackingData ? {
            geoData: trackingData.geoData,
            deviceData: trackingData.deviceData,
            browserFingerprint: trackingData.browserFingerprint,
            referrer: trackingData.referrer
          } : undefined,
        });
        console.log('Test-Ergebnisse erfolgreich gespeichert mit Tracking-Daten');
        
        // Clear session after successful submission
        TestSessionTracker.clearSession();
      } catch (error) {
        console.error('Fehler beim Speichern der Test-Ergebnisse:', error);
        // Continue anyway - don't block user from seeing results
      }
      
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTest = () => {
    setShowResults(false);
    setCurrentStep(0);
    setResponses([]);
    setIsProView(false);
  };

  if (showResults) {
    const publicScores = calculatePublicScores(responses);
    const proScores = calculateProfessionalScores(responses);
    const recommendations = getRecommendations(proScores);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {!isProView ? (
            // ÖFFENTLICHE ANSICHT (für Teilnehmer)
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Ihre Lebensbalance-Auswertung
                </h1>
                <p className="text-gray-600">Vielen Dank für Ihre Teilnahme!</p>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Gesamt-Wohlbefinden</span>
                  <span className="text-3xl font-bold text-blue-600">{publicScores.overall}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${publicScores.overall}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { 
                    label: sections.time, 
                    score: publicScores.timeManagement, 
                    icon: '⏰',
                    description: 'Zeitmanagement & Prioritäten'
                  },
                  { 
                    label: sections.finance, 
                    score: publicScores.financialHealth, 
                    icon: '💰',
                    description: 'Finanzielle Gesundheit'
                  },
                  { 
                    label: sections.emotion, 
                    score: publicScores.emotionalHealth, 
                    icon: '❤️',
                    description: 'Emotionale Stabilität'
                  },
                  { 
                    label: sections.social, 
                    score: publicScores.socialConnections, 
                    icon: '👥',
                    description: 'Soziale Verbindungen'
                  },
                  { 
                    label: sections.health, 
                    score: publicScores.physicalHealth, 
                    icon: '💪',
                    description: 'Körperliche Gesundheit'
                  }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">
                        {item.icon} {item.label}
                      </span>
                      <span className="font-bold text-gray-800">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.score >= 70 ? 'bg-green-500' : 
                          item.score >= 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  💡 <strong>Hinweis:</strong> Diese Auswertung gibt Ihnen einen Überblick über Ihre aktuelle Lebensbalance. 
                  Bei Fragen oder wenn Sie Unterstützung wünschen, sprechen Sie gerne mit Ihrem Berater.
                </p>
              </div>
            </div>
          ) : (
            // PROFESSIONELLE ANSICHT (für Berater)
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
              <div className="border-b-4 border-red-500 pb-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <h1 className="text-2xl font-bold text-gray-800">
                    Professionelle Screening-Auswertung
                  </h1>
                </div>
                <p className="text-sm text-gray-600">🔒 Vertraulich - nur für Berater</p>
              </div>

              <div className="mb-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-600">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Gesamt-Risiko Score</span>
                  <span className={`text-4xl font-bold ${
                    proScores.overall > 60 ? 'text-red-600' : 
                    proScores.overall > 40 ? 'text-orange-500' : 
                    'text-green-600'
                  }`}>
                    {proScores.overall}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className={`h-6 rounded-full ${
                      proScores.overall > 60 ? 'bg-red-600' : 
                      proScores.overall > 40 ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${proScores.overall}%` }}
                  />
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-800">
                    Risiko-Level: <span className={`${
                      proScores.riskLevel === 'Kritisch' ? 'text-red-600' : 
                      proScores.riskLevel === 'Hoch' ? 'text-orange-500' : 
                      proScores.riskLevel === 'Mittel' ? 'text-yellow-500' :
                      'text-green-600'
                    }`}>{proScores.riskLevel}</span>
                  </p>
                  <p className="text-gray-700">
                    Primärer Verdacht: <strong>{proScores.primaryConcern}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Konsistenz: {proScores.consistency}% | Confidence: {proScores.confidence}%
                  </p>
                </div>
              </div>

              {/* Neue Suchtrichtung-Analyse */}
              {proScores.addictionDirection && (
                <div className="mb-6 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    🎯 Detaillierte Suchtrichtung-Analyse
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Primäre Suchtrichtung */}
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">Primäre Richtung</span>
                        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                          {proScores.addictionDirection.primary.confidence}% Übereinstimmung
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700 mb-2">
                        {proScores.addictionDirection.primary.type}
                      </p>
                      {proScores.addictionDirection.primary.indicators.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-600 mb-1">Schlüssel-Indikatoren:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {proScores.addictionDirection.primary.indicators.slice(0, 3).map((indicator, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-purple-600">•</span>
                                <span>{indicator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Sekundäre Suchtrichtung (falls vorhanden) */}
                    {proScores.addictionDirection.secondary && (
                      <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">Sekundäre Richtung</span>
                          <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-bold">
                            {proScores.addictionDirection.secondary.confidence}%
                          </span>
                        </div>
                        <p className="text-xl font-bold text-gray-700">
                          {proScores.addictionDirection.secondary.type}
                        </p>
                      </div>
                    )}

                    {/* Muster-Analyse */}
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="font-semibold text-gray-800 mb-3">Suchtmuster-Analyse</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600">Stoffgebunden</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${proScores.addictionDirection.patterns.substanceBased}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700">
                              {proScores.addictionDirection.patterns.substanceBased}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Verhaltensbasiert</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${proScores.addictionDirection.patterns.behavioralBased}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700">
                              {proScores.addictionDirection.patterns.behavioralBased}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {proScores.addictionDirection.patterns.polyaddiction && (
                        <div className="mt-3 p-2 bg-red-100 rounded border border-red-300">
                          <p className="text-xs text-red-800 font-semibold">
                            ⚠️ Polysucht erkannt: Mehrere Suchtproblematiken gleichzeitig vorhanden
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Beschreibung */}
                    {proScores.directionDescription && (
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {proScores.directionDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Kategorie-Breakdown</h2>
                
                {[
                  { label: '🎰 Spielsucht / Glücksspiel', score: proScores.gambling, concern: 'gambling' },
                  { label: '🍷 Alkohol-Missbrauch', score: proScores.alcohol, concern: 'alcohol' },
                  { label: '💊 Substanz-Missbrauch', score: proScores.substances, concern: 'substances' },
                  { label: '🛍️ Kaufsucht', score: proScores.shopping, concern: 'shopping' },
                  { label: '📱 Digital-Sucht', score: proScores.digital, concern: 'digital' }
                ].map((item, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <span className={`font-bold ${
                        item.score > 60 ? 'text-red-600' : 
                        item.score > 40 ? 'text-orange-500' : 
                        'text-gray-600'
                      }`}>
                        {item.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          item.score > 60 ? 'bg-red-600' : 
                          item.score > 40 ? 'bg-orange-500' : 
                          'bg-gray-400'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    {item.score > 40 && (
                      <p className="text-sm text-red-600 mt-2 font-medium">
                        ⚠️ Verdacht - weitere Abklärung empfohlen
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {proScores.overall > 40 && (
                <>
                  {/* Spezifische Empfehlungen basierend auf Suchtrichtung */}
                  {proScores.directionRecommendations && proScores.directionRecommendations.length > 0 && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-4">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        🎯 Spezifische Empfehlungen für {proScores.addictionDirection?.primary.type}
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {proScores.directionRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Allgemeine Empfehlungen */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      Allgemeine nächste Schritte
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-600 mt-1">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
                <p><strong>Hinweis:</strong> Dies ist ein Screening-Tool, keine klinische Diagnose. 
                Die Ergebnisse dienen als Orientierung für das Erstgespräch und weitere Abklärung.</p>
              </div>
            </div>
          )}

          <button
            onClick={resetTest}
            className="w-full mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Neuen Test starten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lebensbalance-Check</h1>
          <p className="text-gray-600">Ein kurzer Check Ihres aktuellen Wohlbefindens</p>
        </div>

        {/* Banner: Antworten vom Kurztest übernommen - nur die ersten 3 Schritte */}
        {comeFromShortTest && currentStep < 3 && prefilledCount > 0 && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">
                  Großartig! Sie machen weiter 🎉
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Ihre {prefilledCount} Antworten vom Schnell-Check wurden übernommen. 
                  Nur noch {shuffledQuestions.length - prefilledCount} Fragen bis zum vollständigen Ergebnis!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              {comeFromShortTest 
                ? `Frage ${responses.length + 1} von ${shuffledQuestions.length}`
                : `Frage ${currentStep + 1} von ${shuffledQuestions.length}`
              }
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Zeige Fortschritt */}
          <div className="flex justify-between items-center mt-2">
            {responses.length > 0 && (
              <p className="text-xs text-gray-500">
                ✓ {responses.length} beantwortet
              </p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              Noch {shuffledQuestions.length - responses.length} offen
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 animate-slide-up">
          <div className="mb-4">
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {sections[currentQuestion.section]}
            </span>
          </div>
          
          <p className="text-xl text-gray-800 mb-8 leading-relaxed">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
          <button
            onClick={handleNext}
            disabled={currentAnswer === undefined}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === questions.length - 1 ? 'Auswertung anzeigen' : 'Weiter'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Ihre Antworten werden vertraulich behandelt
        </p>
      </div>
    </div>
  );
};

export default ScreeningTest;
