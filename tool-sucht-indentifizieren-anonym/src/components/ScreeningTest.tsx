import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Lock, Eye } from 'lucide-react';
import { questions, sections } from '@/data/questions';
import { Response, calculatePublicScores, calculateProfessionalScores, getRecommendations } from '@/utils/scoring';

const ScreeningTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isProView, setIsProView] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion.id);
    newResponses.push({ questionId: currentQuestion.id, value });
    setResponses(newResponses);
  };

  const currentAnswer = responses.find(r => r.questionId === currentQuestion.id)?.value;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
          {/* Toggle View Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsProView(!isProView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isProView 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProView ? (
                <>
                  <Eye className="w-4 h-4" />
                  Teilnehmer-Ansicht
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Berater-Ansicht
                </>
              )}
            </button>
          </div>

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
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Empfohlene nächste Schritte
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

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Frage {currentStep + 1} von {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
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
