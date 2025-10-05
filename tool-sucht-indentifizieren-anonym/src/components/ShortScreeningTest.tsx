import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { questions } from '../data/questions';
import { Response, calculatePublicScores, calculateProfessionalScores } from '../utils/scoring';

// 10 Kern-Fragen mit höchster Korrelation
const shortQuestions = [
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

  // Upgrade-Motivation basierend auf Risiko-Level
  const getUpgradeMessage = (riskLevel: number) => {
    if (riskLevel >= 70) {
      return {
        title: "Ihre Situation verdient besondere Aufmerksamkeit",
        message: "Der vollständige Test (40 Fragen) zeigt Ihnen konkrete Schritte für Veränderung und professionelle Unterstützung.",
        urgency: "Dringend empfohlen",
        color: "red",
        stats: "92% der Nutzer mit ähnlichen Antworten profitieren vom vollständigen Test"
      };
    } else if (riskLevel >= 50) {
      return {
        title: "Wir haben wichtige Hinweise erkannt",
        message: "Der vollständige Test hilft Ihnen, Ihre Situation besser zu verstehen und den richtigen Weg zu finden.",
        urgency: "Stark empfohlen",
        color: "orange",
        stats: "85% finden im vollständigen Test neue Einsichten"
      };
    } else if (riskLevel >= 30) {
      return {
        title: "Ihre Antworten deuten auf mögliche Herausforderungen hin",
        message: "Der vollständige Test gibt Ihnen tiefere Einblicke und konkrete Hilfestellungen.",
        urgency: "Empfohlen",
        color: "yellow",
        stats: "73% erhalten personalisierte Empfehlungen im vollständigen Test"
      };
    } else {
      return {
        title: "Sie haben die Basis-Einschätzung abgeschlossen",
        message: "Für ein vollständiges Bild und personalisierte Empfehlungen nutzen Sie den vollständigen Test.",
        urgency: "Optional",
        color: "green",
        stats: "Über 10.000 Nutzer haben bereits den vollständigen Test absolviert"
      };
    }
  };

  if (showResults) {
    // Berechne vorläufige Scores
    const publicScores = calculatePublicScores(responses);
    const proScores = calculateProfessionalScores(responses);
    const upgradeInfo = getUpgradeMessage(proScores.overallRisk);

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
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Lebensbalance-Score:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {publicScores.overallBalance}/100
                </span>
              </div>
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
                onClick={onUpgrade}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Vollständigen Test starten
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ergebnis speichern & beenden
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
