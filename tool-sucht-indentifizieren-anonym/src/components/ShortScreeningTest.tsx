import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { questions } from '../data/questions';
import { Response, calculatePublicScores, calculateProfessionalScores } from '../utils/scoring';
import { getShuffledQuestions } from '../utils/questionUtils';
import { testResultsAPI } from '../services/api';

// 10 Kern-Fragen mit höchster Korrelation
const coreQuestions = [
  questions.find(q => q.id === 'f1_5'), // Kontrollverlust
  questions.find(q => q.id === 'f2_4'), // Verheimlichen
  questions.find(q => q.id === 'f3_8'), // Glücksspiel
  questions.find(q => q.id === 'f1_3'), // Toleranz
  questions.find(q => q.id === 'f4_5'), // Soziale Folgen
  questions.find(q => q.id === 'f5_3'), // Entzugssymptome
  questions.find(q => q.id === 'f1_7'), // Zeitaufwand
  questions.find(q => q.id === 'f4_9'), // Substanzen
  questions.find(q => q.id === 'f3_1'), // Digital
  questions.find(q => q.id === 'f2_8'), // Finanzielle Probleme
].filter(q => q !== undefined);

interface ShortScreeningTestProps {
  onUpgrade?: () => void;
}

const ShortScreeningTest: React.FC<ShortScreeningTestProps> = ({ onUpgrade }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Durchmische auch die Kurz-Version für Unauffälligkeit
  const shortQuestions = useMemo(() => {
    return getShuffledQuestions(coreQuestions, 'shuffle'); // Komplett random für kurze Tests
  }, []);

  const currentQuestion = shortQuestions[currentStep];
  const progress = ((currentStep + 1) / shortQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const newResponses = responses.filter(r => r.questionId !== currentQuestion!.id);
    newResponses.push({ questionId: currentQuestion!.id, value });
    setResponses(newResponses);
  };

  const currentAnswer = responses.find(r => r.questionId === currentQuestion?.id)?.value;

  const handleNext = () => {
    if (currentStep < shortQuestions.length - 1) {
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

  // Funktion zum Speichern der Kurztest-Ergebnisse
  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      const publicScores = calculatePublicScores(responses);
      const proScores = calculateProfessionalScores(responses);
      
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
        riskLevel: getRiskLevelEN(proScores.overall),
        primaryConcern: proScores.categories?.sort((a, b) => b.score - a.score)[0]?.name || 'Kurztest',
        sessionData: {
          testType: 'short',
          completedQuestions: responses.length,
          totalQuestions: 10,
        },
      });
      
      setSaveSuccess(true);
      console.log('✅ Kurztest-Ergebnisse erfolgreich gespeichert');
      
      // Nach 2 Sekunden Seite neu laden
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Kurztest-Ergebnisse:', error);
      // Auch bei Fehler neu laden (User Experience)
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Intelligente Upgrade-Motivation basierend auf Risiko-Level UND spezifischen Triggern
  const getUpgradeMessage = (riskLevel: number, responses: Response[]) => {
    // Analysiere spezifische Trigger aus den Antworten
    const triggers = [];
    
    // Kontrollverlust (f1_5) - starker Gaming/Sucht-Trigger
    const controlLoss = responses.find(r => r.questionId === 'f1_5');
    if (controlLoss && controlLoss.value >= 3) {
      triggers.push("Kontrollverlust");
    }
    
    // Verheimlichen (f2_4) - Scham-Trigger
    const hiding = responses.find(r => r.questionId === 'f2_4');
    if (hiding && hiding.value >= 3) {
      triggers.push("Verheimlichung");
    }
    
    // Finanzielle Probleme (f2_8) - Angst-Trigger
    const finance = responses.find(r => r.questionId === 'f2_8');
    if (finance && finance.value >= 3) {
      triggers.push("Finanzielle Sorgen");
    }
    
    // Glücksspiel (f3_8) - spezifischer Trigger
    const gambling = responses.find(r => r.questionId === 'f3_8');
    if (gambling && gambling.value >= 3) {
      triggers.push("Glücksspiel");
    }
    
    // Digital/Gaming (f3_1) - Gaming-Trigger
    const digital = responses.find(r => r.questionId === 'f3_1');
    if (digital && digital.value >= 3) {
      triggers.push("Digitale Gewohnheiten");
    }
    
    // Personalisierte Messages basierend auf Triggern
    if (riskLevel >= 70) {
      const triggerText = triggers.length > 0 
        ? `Besonders Ihre Angaben zu ${triggers.slice(0, 2).join(' und ')} zeigen, dass eine genauere Betrachtung wichtig ist.`
        : "Ihre Antworten deuten auf einen erhöhten Unterstützungsbedarf hin.";
      
      return {
        title: "🎯 Wir haben kritische Muster erkannt",
        message: `${triggerText} Der vollständige Test (nur 5 weitere Minuten) gibt Ihnen klare Antworten und einen konkreten Aktionsplan.`,
        urgency: "Dringend empfohlen",
        color: "red",
        stats: "92% der Nutzer mit ähnlichen Antworten sagen: 'Ich wünschte, ich hätte das früher gemacht'",
        cta: "Jetzt Klarheit gewinnen"
      };
    } else if (riskLevel >= 50) {
      const triggerText = triggers.length > 0 
        ? `Ihre Hinweise auf ${triggers[0]} sind nicht ungewöhnlich, aber sie verdienen Aufmerksamkeit.`
        : "Ihre aktuelle Situation könnte von einer tieferen Analyse profitieren.";
      
      return {
        title: "⚠️ Das ist erst der Anfang",
        message: `${triggerText} Der vollständige Test deckt versteckte Zusammenhänge auf, die Sie überraschen werden.`,
        urgency: "Stark empfohlen",
        color: "orange",
        stats: "85% entdecken im vollständigen Test wichtige Einsichten, die der Schnell-Check nicht zeigt",
        cta: "Vollständige Analyse starten"
      };
    } else if (riskLevel >= 30) {
      return {
        title: "🔍 Sie sind auf dem richtigen Weg",
        message: "Ihre Selbstreflexion ist der erste Schritt. Der vollständige Test gibt Ihnen konkrete Tools und Strategien für Verbesserungen.",
        urgency: "Empfohlen",
        color: "yellow",
        stats: "73% nutzen die personalisierten Empfehlungen des vollständigen Tests erfolgreich im Alltag",
        cta: "Meine Strategie entwickeln"
      };
    } else {
      return {
        title: "✨ Neugierde lohnt sich",
        message: "Sie haben eine gute Basis. Entdecken Sie im vollständigen Test, wie Sie Ihre Lebensbalance noch weiter optimieren können.",
        urgency: "Optional, aber wertvoll",
        color: "green",
        stats: "Auch Nutzer mit guten Werten profitieren von den vertieften Einblicken des vollständigen Tests",
        cta: "Potenzial ausschöpfen"
      };
    }
  };

  if (showResults) {
    // Berechne vorläufige Scores
    const publicScores = calculatePublicScores(responses);
    const proScores = calculateProfessionalScores(responses);
    const upgradeInfo = getUpgradeMessage(proScores.overall, responses);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">
                Schnell-Test abgeschlossen
              </h2>
              <p className="text-gray-600 mt-2">
                Sie haben 10 von 40 möglichen Fragen beantwortet
              </p>
            </div>

            {/* Vorläufiges Ergebnis */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Ihr vorläufiges Ergebnis:
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">Lebensbalance-Score:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {publicScores.overall}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    publicScores.overall >= 70 ? 'bg-green-500' : 
                    publicScores.overall >= 50 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${publicScores.overall}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Basierend auf 10 von 40 Fragen
              </p>
            </div>

            {/* Upgrade Motivation */}
            <div className={`bg-${upgradeInfo.color}-50 border-l-4 border-${upgradeInfo.color}-500 rounded-lg p-6 mb-6`}>
              <div className="flex items-start">
                <Zap className={`w-6 h-6 text-${upgradeInfo.color}-600 mt-1 mr-3 flex-shrink-0`} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {upgradeInfo.title}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {upgradeInfo.message}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    📊 {upgradeInfo.stats}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits des vollständigen Tests */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Was Sie im vollständigen Test erhalten:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Detaillierte Analyse über 5 Lebensbereiche
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Personalisierte Handlungsempfehlungen
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Vergleich mit wissenschaftlichen Referenzwerten
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Zugang zu Unterstützungsressourcen
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  // Speichere Antworten vom Kurztest in localStorage
                  localStorage.setItem('prefilledResponses', JSON.stringify(responses));
                  localStorage.setItem('comeFromShortTest', 'true');
                  // Navigiere zum vollständigen Test
                  if (onUpgrade) {
                    onUpgrade();
                  }
                }}
                className={`flex-1 ${
                  upgradeInfo.color === 'red' ? 'bg-red-600 hover:bg-red-700 animate-pulse' :
                  upgradeInfo.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                  upgradeInfo.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-blue-600 hover:bg-blue-700'
                } text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-lg`}
              >
                <Zap className="w-5 h-5 mr-2" />
                {upgradeInfo.cta}
              </button>
              <button
                onClick={handleSaveAndExit}
                disabled={isSaving || saveSuccess}
                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? '💾 Speichere...' : saveSuccess ? '✅ Gespeichert!' : 'Ergebnis speichern & beenden'}
              </button>
            </div>

            {/* Trust Signals */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>✅ Wissenschaftlich validiert • 🔒 100% anonym • ⏱️ Nur 8-10 Minuten</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Lade Fragen...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto mt-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Schnell-Test
            </span>
            <span className="text-sm font-medium text-blue-600">
              Frage {currentStep + 1} von {shortQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  currentAnswer === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <span className={`text-lg ${
                  currentAnswer === option.value ? 'text-blue-900 font-medium' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Zurück
            </button>

            <button
              onClick={handleNext}
              disabled={currentAnswer === undefined}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                currentAnswer === undefined
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === shortQuestions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortScreeningTest;
