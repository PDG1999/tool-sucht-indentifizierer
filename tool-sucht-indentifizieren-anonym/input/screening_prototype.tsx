import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// Typ-Definitionen
interface Question {
  id: string;
  section: string;
  text: string;
  options: { value: number; label: string }[];
  screens: string[];
}

interface Response {
  questionId: string;
  value: number;
}

// Beispiel-Fragen (10 von 40 für Demo)
const questions: Question[] = [
  {
    id: "f1_1",
    section: "time",
    text: "Wie oft kommt es vor, dass Sie länger mit einer Aktivität verbringen, als Sie ursprünglich geplant hatten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["control_loss", "gambling", "all"]
  },
  {
    id: "f1_2",
    section: "time",
    text: "In den letzten 6 Monaten: Wie häufig haben Sie wichtige Termine oder Verpflichtungen wegen anderer Aktivitäten verschoben?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "1-2 Mal" },
      { value: 2, label: "3-5 Mal" },
      { value: 3, label: "6-10 Mal" },
      { value: 4, label: "Mehr als 10 Mal" }
    ],
    screens: ["neglect", "gambling", "all"]
  },
  {
    id: "f1_3",
    section: "time",
    text: "Haben Sie das Gefühl, dass Sie in letzter Zeit mehr Zeit brauchen, um sich entspannt oder zufrieden zu fühlen?",
    options: [
      { value: 0, label: "Überhaupt nicht" },
      { value: 1, label: "Ein wenig" },
      { value: 2, label: "Einigermaßen" },
      { value: 3, label: "Ziemlich" },
      { value: 4, label: "Sehr stark" }
    ],
    screens: ["tolerance", "all"]
  },
  {
    id: "f2_1",
    section: "finance",
    text: "Gibt es Ausgaben in Ihrem Budget, die Sie lieber für sich behalten, statt sie mit Familie/Partner zu besprechen?",
    options: [
      { value: 0, label: "Nein, völlig transparent" },
      { value: 1, label: "Kleinigkeiten manchmal" },
      { value: 2, label: "Ja, einige Dinge" },
      { value: 3, label: "Ja, größere Beträge" },
      { value: 4, label: "Ja, bedeutende Summen" }
    ],
    screens: ["secrecy", "gambling", "shopping"]
  },
  {
    id: "f2_2",
    section: "finance",
    text: "Wie oft kommt es vor, dass Sie Geld ausgeben, obwohl Sie wissen, dass Sie es eigentlich nicht sollten?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Monatlich" },
      { value: 3, label: "Wöchentlich" },
      { value: 4, label: "Mehrmals pro Woche" }
    ],
    screens: ["control_loss", "shopping", "gambling"]
  },
  {
    id: "f2_4",
    section: "finance",
    text: "Wie oft versuchen Sie, einen finanziellen Verlust oder Fehler durch weitere Ausgaben 'wiedergutzumachen'?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Sehr selten" },
      { value: 2, label: "Manchmal" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["chasing", "gambling"]
  },
  {
    id: "f3_1",
    section: "emotion",
    text: "Wenn Sie eine gewohnte Aktivität nicht ausführen können, wie fühlen Sie sich?",
    options: [
      { value: 0, label: "Neutral, kein Problem" },
      { value: 1, label: "Leicht enttäuscht" },
      { value: 2, label: "Unruhig oder gereizt" },
      { value: 3, label: "Stark unruhig" },
      { value: 4, label: "Extrem unwohl" }
    ],
    screens: ["withdrawal", "all"]
  },
  {
    id: "f3_2",
    section: "emotion",
    text: "Nutzen Sie bestimmte Aktivitäten, um sich besser zu fühlen, wenn Sie gestresst oder niedergeschlagen sind?",
    options: [
      { value: 0, label: "Selten, viele Strategien" },
      { value: 1, label: "Manchmal" },
      { value: 2, label: "Oft" },
      { value: 3, label: "Fast immer" },
      { value: 4, label: "Einzige Strategie" }
    ],
    screens: ["emotional_dependency", "all"]
  },
  {
    id: "f4_1",
    section: "social",
    text: "Wie häufig gibt es Meinungsverschiedenheiten mit nahestehenden Personen über Ihre Freizeitgestaltung?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Selten" },
      { value: 2, label: "Gelegentlich" },
      { value: 3, label: "Oft" },
      { value: 4, label: "Sehr oft" }
    ],
    screens: ["conflicts", "all"]
  },
  {
    id: "f5_4",
    section: "health",
    text: "Wie oft konsumieren Sie Substanzen (Alkohol, Medikamente, etc.), um sich zu entspannen oder einzuschlafen?",
    options: [
      { value: 0, label: "Nie" },
      { value: 1, label: "Sehr selten" },
      { value: 2, label: "Gelegentlich" },
      { value: 3, label: "Mehrmals pro Woche" },
      { value: 4, label: "Fast täglich" }
    ],
    screens: ["substance", "alcohol"]
  }
];

// Scoring-Funktionen
function calculatePublicScores(responses: Response[]) {
  const sections = {
    time: [] as number[],
    finance: [] as number[],
    emotion: [] as number[],
    social: [] as number[],
    health: [] as number[]
  };

  responses.forEach(r => {
    const question = questions.find(q => q.id === r.questionId);
    if (question) {
      sections[question.section as keyof typeof sections].push(r.value);
    }
  });

  const calcAvg = (arr: number[]) => {
    if (arr.length === 0) return 100;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.round(100 - (avg * 25));
  };

  return {
    timeManagement: calcAvg(sections.time),
    financialHealth: calcAvg(sections.finance),
    emotionalHealth: calcAvg(sections.emotion),
    socialConnections: calcAvg(sections.social),
    physicalHealth: calcAvg(sections.health),
    overall: Math.round(
      (calcAvg(sections.time) + 
       calcAvg(sections.finance) + 
       calcAvg(sections.emotion) + 
       calcAvg(sections.social) + 
       calcAvg(sections.health)) / 5
    )
  };
}

function calculateProfessionalScores(responses: Response[]) {
  const checkCriteria = (criteria: string[]) => {
    return criteria.reduce((score, qId) => {
      const response = responses.find(r => r.questionId === qId);
      return score + (response && response.value >= 2 ? 25 : 0);
    }, 0);
  };

  const gamblingScore = checkCriteria(['f1_1', 'f1_2', 'f2_1', 'f2_4']);
  const alcoholScore = checkCriteria(['f5_4']);
  const shoppingScore = checkCriteria(['f2_1', 'f2_2']);
  
  const scores = [gamblingScore, alcoholScore, shoppingScore];
  const maxScore = Math.max(...scores);
  
  let primaryConcern = 'Keine';
  if (gamblingScore === maxScore && gamblingScore > 40) primaryConcern = 'Spielsucht';
  else if (alcoholScore === maxScore && alcoholScore > 40) primaryConcern = 'Alkohol';
  else if (shoppingScore === maxScore && shoppingScore > 40) primaryConcern = 'Kaufsucht';

  return {
    gambling: gamblingScore,
    alcohol: alcoholScore,
    shopping: shoppingScore,
    overall: Math.round((gamblingScore + alcoholScore + shoppingScore) / 3),
    primaryConcern,
    riskLevel: maxScore > 60 ? 'Hoch' : maxScore > 40 ? 'Mittel' : 'Niedrig'
  };
}

export default function ScreeningTool() {
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

  if (showResults) {
    const publicScores = calculatePublicScores(responses);
    const proScores = calculateProfessionalScores(responses);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Toggle View Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsProView(!isProView)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
            >
              {isProView ? '👤 Teilnehmer-Ansicht' : '🔒 Berater-Ansicht'}
            </button>
          </div>

          {!isProView ? (
            // ÖFFENTLICHE ANSICHT
            <div className="bg-white rounded-2xl shadow-2xl p-8">
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
                  { label: 'Zeitmanagement & Prioritäten', score: publicScores.timeManagement, icon: '⏰' },
                  { label: 'Finanzielle Gesundheit', score: publicScores.financialHealth, icon: '💰' },
                  { label: 'Emotionale Stabilität', score: publicScores.emotionalHealth, icon: '❤️' },
                  { label: 'Soziale Verbindungen', score: publicScores.socialConnections, icon: '👥' },
                  { label: 'Körperliche Gesundheit', score: publicScores.physicalHealth, icon: '💪' }
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
            // PROFESSIONELLE ANSICHT (nur für Berater)
            <div className="bg-white rounded-2xl shadow-2xl p-8">
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
                      proScores.riskLevel === 'Hoch' ? 'text-red-600' : 
                      proScores.riskLevel === 'Mittel' ? 'text-orange-500' : 
                      'text-green-600'
                    }`}>{proScores.riskLevel}</span>
                  </p>
                  <p className="text-gray-700">
                    Primärer Verdacht: <strong>{proScores.primaryConcern}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Kategorie-Breakdown</h2>
                
                {[
                  { label: '🎰 Spielsucht / Glücksspiel', score: proScores.gambling, concern: 'gambling' },
                  { label: '🍷 Alkohol-Missbrauch', score: proScores.alcohol, concern: 'alcohol' },
                  { label: '🛍️ Kaufsucht', score: proScores.shopping, concern: 'shopping' }
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
                    {item.concern === proScores.primaryConcern && item.score > 40 && (
                      <p className="text-sm text-red-600 mt-2 font-medium">
                        ⚠️ Primärer Verdacht - weitere Abklärung empfohlen
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
                    <li>✓ Gesprächstermin innerhalb von {proScores.overall > 60 ? '48 Stunden' : '1 Woche'} vereinbaren</li>
                    <li>✓ Vertiefende Fragen zu {proScores.primaryConcern} stellen</li>
                    <li>✓ Finanzielle Situation und soziales Umfeld explorieren</li>
                    {proScores.overall > 60 && (
                      <li className="text-red-600 font-semibold">✓ Krisenintervention vorbereiten (Suizidgedanken abklären)</li>
                    )}
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
            onClick={() => {
              setShowResults(false);
              setCurrentStep(0);
              setResponses([]);
              setIsProView(false);
            }}
            className="w-full mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
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
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
          <button
            onClick={handleNext}
            disabled={currentAnswer === undefined}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
}