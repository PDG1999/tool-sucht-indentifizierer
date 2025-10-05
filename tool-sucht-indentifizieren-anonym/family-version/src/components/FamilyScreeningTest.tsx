import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Heart, AlertCircle, Phone, MessageCircle, BookOpen } from 'lucide-react';
import { familyQuestions, FamilyQuestion, shuffleQuestions } from '../data/familyQuestions';
import { 
  calculateFamilyScreeningResult, 
  FamilyScreeningResult,
  getRiskLevelText,
  getRiskLevelColor,
  getSeverityBadgeColor,
  getAddictionTypeLabel
} from '../utils/familyScoring';

export const FamilyScreeningTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<FamilyScreeningResult | null>(null);
  
  // Optional: Fragen durchmischen für weniger Durchschaubarkeit
  const displayedQuestions = useMemo(() => {
    // Für jetzt: in ursprünglicher Reihenfolge (kann später aktiviert werden)
    return familyQuestions;
    // return shuffleQuestions(familyQuestions); // Uncomment für Shuffle
  }, []);

  const currentQuestion = displayedQuestions[currentStep];
  const progress = Math.round((currentStep / displayedQuestions.length) * 100);
  const isLastQuestion = currentStep === displayedQuestions.length - 1;
  const isFirstQuestion = currentStep === 0;

  // Kategorien für Progress-Anzeige
  const getCategoryName = (category: string) => {
    const names: any = {
      time: 'Zeit & Prioritäten',
      finance: 'Finanzen',
      emotional: 'Emotionen',
      social: 'Soziales',
      health: 'Gesundheit'
    };
    return names[category] || category;
  };

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);
    
    // Auto-advance nach kurzer Verzögerung
    setTimeout(() => {
      if (isLastQuestion) {
        // Test abschließen und Ergebnisse berechnen
        const result = calculateFamilyScreeningResult(displayedQuestions, newAnswers);
        setResults(result);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ergebnis-Ansicht
  if (showResults && results) {
    return <ResultsView results={results} onRestart={handleRestart} />;
  }

  // Test-Ansicht
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header mit Progress */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">Sucht-Check</span>
            </div>
            <div className="text-sm text-gray-600">
              Frage {currentStep + 1} von {displayedQuestions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Kategorie-Indikator */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {getCategoryName(currentQuestion.category)}
          </div>
        </div>
      </div>

      {/* Frage */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Frage-Text */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-relaxed">
              {currentQuestion.text}
            </h2>
            <p className="text-sm text-gray-500">
              Denke an deine Beobachtungen der letzten 6-12 Monate.
            </p>
          </div>

          {/* Antwort-Optionen */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                  answers[currentQuestion.id] === option.score
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                    answers[currentQuestion.id] === option.score
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === option.score && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirstQuestion && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Zurück
              </button>
            )}
            
            {answers[currentQuestion.id] !== undefined && (
              <button
                onClick={() => {
                  if (isLastQuestion) {
                    const result = calculateFamilyScreeningResult(displayedQuestions, answers);
                    setResults(result);
                    setShowResults(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all ml-auto"
              >
                {isLastQuestion ? 'Ergebnis anzeigen' : 'Weiter'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Hilfe-Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Deine Antworten bleiben vollständig anonym und werden nicht gespeichert.</p>
        </div>
      </div>
    </div>
  );
};

// Ergebnis-Komponente
const ResultsView: React.FC<{ results: FamilyScreeningResult; onRestart: () => void }> = ({ 
  results, 
  onRestart 
}) => {
  const [showConversationGuide, setShowConversationGuide] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dein Ergebnis</h1>
              <p className="text-xs text-gray-500">Angehörigen-Screening</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Gesamt-Besorgnislevel */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gesamt-Einschätzung
            </h2>
            <div className="inline-block">
              <div className={`text-6xl font-bold mb-2 ${getRiskLevelColor(results.overallConcernLevel)}`}>
                {results.overallConcernLevel}%
              </div>
              <div className="text-xl text-gray-600">
                {getRiskLevelText(results.overallConcernLevel)}
              </div>
            </div>
          </div>

          {/* Primärer Verdacht */}
          {results.primarySuspicion.type !== 'none' && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-3">Primärer Verdacht:</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-2xl font-bold text-orange-900">
                  {getAddictionTypeLabel(results.primarySuspicion.type)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityBadgeColor(results.primarySuspicion.severity)}`}>
                  {results.primarySuspicion.severity === 'critical' && 'Kritisch'}
                  {results.primarySuspicion.severity === 'high' && 'Hoch'}
                  {results.primarySuspicion.severity === 'moderate' && 'Mittel'}
                  {results.primarySuspicion.severity === 'low' && 'Niedrig'}
                </span>
                <span className="text-sm text-gray-600">
                  Konfidenz: {results.primarySuspicion.confidence}%
                </span>
              </div>
            </div>
          )}

          {/* Empfehlungen */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Was solltest du jetzt tun?
            </h3>
            <ul className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">→</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gesprächsleitfaden Button */}
          <button
            onClick={() => setShowConversationGuide(!showConversationGuide)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            {showConversationGuide ? 'Gesprächsleitfaden ausblenden' : 'Gesprächsleitfaden anzeigen'}
          </button>

          {showConversationGuide && (
            <ConversationGuide type={results.conversationGuideType} primarySuspicion={results.primarySuspicion.type} />
          )}
        </div>

        {/* Detaillierte Scores */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Sucht-Typ-Scores */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4">Risiko-Einschätzung nach Typ</h3>
            <div className="space-y-4">
              {Object.entries(results.addictionScores).map(([type, score]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{getAddictionTypeLabel(type)}</span>
                    <span className={`font-bold ${getRiskLevelColor(score)}`}>{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        score >= 80 ? 'bg-red-600' :
                        score >= 60 ? 'bg-orange-500' :
                        score >= 40 ? 'bg-yellow-500' :
                        score >= 20 ? 'bg-lime-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verhaltens-Muster */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4">Beobachtete Verhaltensmuster</h3>
            <div className="space-y-4">
              {[
                { label: 'Heimlichkeit', value: results.behaviorPatterns.secretiveness },
                { label: 'Verleugnung', value: results.behaviorPatterns.denial },
                { label: 'Prioritätsverschiebung', value: results.behaviorPatterns.priorityShift },
                { label: 'Sozialer Rückzug', value: results.behaviorPatterns.socialWithdrawal },
                { label: 'Finanzielle Auswirkungen', value: results.behaviorPatterns.financialImpact }
              ].map((pattern) => (
                <div key={pattern.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{pattern.label}</span>
                    <span className={`font-bold ${getRiskLevelColor(pattern.value)}`}>{pattern.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        pattern.value >= 80 ? 'bg-red-600' :
                        pattern.value >= 60 ? 'bg-orange-500' :
                        pattern.value >= 40 ? 'bg-yellow-500' :
                        pattern.value >= 20 ? 'bg-lime-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${pattern.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notfall-Kontakte */}
        {results.overallConcernLevel >= 60 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-red-900">
              <Phone className="w-6 h-6" />
              Wichtige Kontakte
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Sucht & Drogen Hotline</p>
                <p className="text-2xl font-bold text-red-600 mb-1">01805 313 031</p>
                <p className="text-sm text-gray-600">24/7 • Anonym • Kostenlos</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">Telefonseelsorge</p>
                <p className="text-2xl font-bold text-red-600 mb-1">0800 111 0 111</p>
                <p className="text-sm text-gray-600">24/7 • Anonym • Kostenlos</p>
              </div>
            </div>
          </div>
        )}

        {/* Aktionen */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 rounded-lg"
          >
            Test erneut durchführen
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg"
          >
            Ergebnis ausdrucken
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">⚠️ Wichtiger Hinweis:</p>
          <p>
            Dieser Test ist eine Orientierungshilfe und ersetzt KEINE professionelle Diagnose. 
            Bei hohem Risiko wende dich bitte an eine Suchtberatungsstelle oder einen Therapeuten.
          </p>
        </div>
      </div>
    </div>
  );
};

// Gesprächsleitfaden-Komponente
const ConversationGuide: React.FC<{ type: string; primarySuspicion: string }> = ({ type, primarySuspicion }) => {
  const guides: any = {
    gentle: {
      title: 'Sanfter Gesprächseinstieg',
      steps: [
        'Wähle einen ruhigen, privaten Moment ohne Zeitdruck',
        'Beginne mit "Ich" und deinen Gefühlen: "Mir ist aufgefallen, dass..."',
        'Sei konkret mit Beispielen: "Letzte Woche hast du..."',
        'Höre aktiv zu - lasse die Person sprechen',
        'Biete Unterstützung an: "Wie kann ich dir helfen?"',
        'Keine Vorwürfe oder Anklagen - bleib liebevoll'
      ]
    },
    direct: {
      title: 'Direktes, klares Gespräch',
      steps: [
        'Plane das Gespräch im Voraus - ggf. mit einer Vertrauensperson',
        'Sei direkt aber respektvoll: "Ich mache mir ernsthafte Sorgen"',
        'Benenne konkrete Beobachtungen und deren Auswirkungen',
        'Erwarte Abwehr - bleib ruhig und beharrlich',
        'Biete konkrete Hilfe an: "Ich habe Informationen über Beratungsstellen"',
        'Setze ggf. Grenzen: "Ich kann nicht länger zusehen"'
      ]
    },
    intervention: {
      title: 'Professionelle Intervention',
      steps: [
        '⚠️ Die Situation ist zu ernst für ein Laien-Gespräch',
        'Kontaktiere SOFORT eine professionelle Suchtberatung',
        'Erwäge eine begleitete Intervention durch Fachpersonal',
        'Sammle mehrere Vertrauenspersonen für gemeinsames Gespräch',
        'Bereite konkrete Behandlungsoptionen vor',
        'WICHTIG: Schütze dich selbst - setze klare Grenzen',
        'Suche dir selbst professionelle Unterstützung (Al-Anon, Therapie)'
      ]
    }
  };

  const guide = guides[type];

  return (
    <div className="bg-purple-50 rounded-lg p-6 mt-4">
      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-purple-600" />
        {guide.title}
      </h4>
      <ol className="space-y-3">
        {guide.steps.map((step: string, index: number) => (
          <li key={index} className="flex gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">{index + 1}.</span>
            <span className="text-gray-700">{step}</span>
          </li>
        ))}
      </ol>
      
      {type === 'intervention' && (
        <div className="mt-6 bg-red-100 border-l-4 border-red-500 p-4">
          <p className="font-bold text-red-900 mb-2">🚨 SOFORT HANDELN:</p>
          <p className="text-red-800">
            Kontaktiere jetzt eine Suchtberatungsstelle und lass dich professionell beraten. 
            Eine Intervention ohne Fachpersonal kann mehr schaden als nutzen.
          </p>
        </div>
      )}
    </div>
  );
};

