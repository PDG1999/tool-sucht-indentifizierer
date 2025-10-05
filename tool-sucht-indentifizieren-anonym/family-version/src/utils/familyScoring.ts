/**
 * 🧮 Scoring-System für Angehörigen-Screening
 * 
 * Berechnet Sucht-Risiko basierend auf beobachteten Verhaltensweisen
 */

import { FamilyQuestion } from '../data/familyQuestions';

export interface FamilyScreeningResult {
  // Kategorie-Scores (0-100)
  categoryScores: {
    time: number;
    finance: number;
    emotional: number;
    social: number;
    health: number;
  };
  
  // Sucht-Typ-Scores (0-100)
  addictionScores: {
    gambling: number;
    alcohol: number;
    substances: number;
    shopping: number;
    digital: number;
  };
  
  // Primärer Verdacht
  primarySuspicion: {
    type: 'gambling' | 'alcohol' | 'substances' | 'shopping' | 'digital' | 'none';
    confidence: number; // 0-100
    severity: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  };
  
  // Sekundäre Verdachtsmomente
  secondaryConcerns: string[];
  
  // Verhaltens-Muster
  behaviorPatterns: {
    secretiveness: number; // Heimlichkeit
    denial: number; // Verleugnung
    priorityShift: number; // Prioritätsverschiebung
    socialWithdrawal: number; // Sozialer Rückzug
    financialImpact: number; // Finanzielle Auswirkungen
  };
  
  // Gesamtbewertung
  overallConcernLevel: number; // 0-100
  
  // Empfehlungen
  recommendations: string[];
  
  // Gesprächsleitfaden-Typ
  conversationGuideType: 'gentle' | 'direct' | 'intervention';
}

export function calculateFamilyScreeningResult(
  questions: FamilyQuestion[],
  answers: { [questionId: string]: number }
): FamilyScreeningResult {
  // 1. Kategorie-Scores berechnen
  const categoryScores = calculateCategoryScores(questions, answers);
  
  // 2. Sucht-Typ-Scores berechnen
  const addictionScores = calculateAddictionScores(questions, answers);
  
  // 3. Verhaltens-Muster analysieren
  const behaviorPatterns = analyzeBehaviorPatterns(questions, answers);
  
  // 4. Primären Verdacht ermitteln
  const primarySuspicion = determinePrimarySuspicion(addictionScores, behaviorPatterns);
  
  // 5. Sekundäre Bedenken identifizieren
  const secondaryConcerns = identifySecondaryConcerns(addictionScores, categoryScores);
  
  // 6. Gesamtbesorgnislevel
  const overallConcernLevel = calculateOverallConcern(addictionScores, behaviorPatterns);
  
  // 7. Empfehlungen generieren
  const recommendations = generateRecommendations(primarySuspicion, overallConcernLevel, behaviorPatterns);
  
  // 8. Gesprächsleitfaden-Typ
  const conversationGuideType = determineConversationGuideType(overallConcernLevel, behaviorPatterns);
  
  return {
    categoryScores,
    addictionScores,
    primarySuspicion,
    secondaryConcerns,
    behaviorPatterns,
    overallConcernLevel,
    recommendations,
    conversationGuideType
  };
}

function calculateCategoryScores(
  questions: FamilyQuestion[],
  answers: { [questionId: string]: number }
): { time: number; finance: number; emotional: number; social: number; health: number } {
  const categories = ['time', 'finance', 'emotional', 'social', 'health'] as const;
  const scores: any = {};
  
  categories.forEach(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const totalScore = categoryQuestions.reduce((sum, q) => {
      return sum + (answers[q.id] || 0);
    }, 0);
    const maxScore = categoryQuestions.length * 10;
    scores[category] = Math.round((totalScore / maxScore) * 100);
  });
  
  return scores;
}

function calculateAddictionScores(
  questions: FamilyQuestion[],
  answers: { [questionId: string]: number }
): { gambling: number; alcohol: number; substances: number; shopping: number; digital: number } {
  const addictionTypes = ['gambling', 'alcohol', 'substances', 'shopping', 'digital'] as const;
  const scores: any = {};
  
  addictionTypes.forEach(type => {
    let weightedSum = 0;
    let totalWeight = 0;
    
    questions.forEach(q => {
      const indicator = q.addictionIndicators[type];
      if (indicator) {
        const answerScore = answers[q.id] || 0;
        weightedSum += answerScore * indicator;
        totalWeight += 10 * indicator; // Max score per question is 10
      }
    });
    
    scores[type] = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  });
  
  return scores;
}

function analyzeBehaviorPatterns(
  questions: FamilyQuestion[],
  answers: { [questionId: string]: number }
): {
  secretiveness: number;
  denial: number;
  priorityShift: number;
  socialWithdrawal: number;
  financialImpact: number;
} {
  // Spezifische Fragen für Verhaltensmuster
  const secretivenessQuestions = ['time_3', 'finance_5', 'social_5'];
  const denialQuestions = ['emotional_4', 'emotional_8'];
  const priorityShiftQuestions = ['time_1', 'time_4', 'time_6'];
  const socialWithdrawalQuestions = ['social_1', 'social_4', 'social_6'];
  const financialImpactQuestions = ['finance_1', 'finance_2', 'finance_3', 'finance_6'];
  
  const calculatePatternScore = (questionIds: string[]) => {
    const total = questionIds.reduce((sum, id) => sum + (answers[id] || 0), 0);
    const max = questionIds.length * 10;
    return Math.round((total / max) * 100);
  };
  
  return {
    secretiveness: calculatePatternScore(secretivenessQuestions),
    denial: calculatePatternScore(denialQuestions),
    priorityShift: calculatePatternScore(priorityShiftQuestions),
    socialWithdrawal: calculatePatternScore(socialWithdrawalQuestions),
    financialImpact: calculatePatternScore(financialImpactQuestions)
  };
}

function determinePrimarySuspicion(
  addictionScores: any,
  behaviorPatterns: any
): {
  type: 'gambling' | 'alcohol' | 'substances' | 'shopping' | 'digital' | 'none';
  confidence: number;
  severity: 'none' | 'low' | 'moderate' | 'high' | 'critical';
} {
  // Höchsten Score finden
  const entries = Object.entries(addictionScores) as [string, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [topType, topScore] = sorted[0];
  const [secondType, secondScore] = sorted[1] || [null, 0];
  
  // Confidence basiert auf Abstand zum zweithöchsten Score
  const gap = topScore - secondScore;
  let confidence = Math.min(100, topScore + gap);
  
  // Severity bestimmen
  let severity: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  if (topScore < 20) severity = 'none';
  else if (topScore < 40) severity = 'low';
  else if (topScore < 60) severity = 'moderate';
  else if (topScore < 80) severity = 'high';
  else severity = 'critical';
  
  // Wenn Score zu niedrig, kein Verdacht
  if (topScore < 30) {
    return {
      type: 'none',
      confidence: 0,
      severity: 'none'
    };
  }
  
  return {
    type: topType as any,
    confidence,
    severity
  };
}

function identifySecondaryConcerns(
  addictionScores: any,
  categoryScores: any
): string[] {
  const concerns: string[] = [];
  
  // Sucht-Scores über 40 als sekundäre Bedenken
  Object.entries(addictionScores).forEach(([type, score]) => {
    if (score as number > 40) {
      const labels: any = {
        gambling: 'Spielsucht',
        alcohol: 'Alkoholkonsum',
        substances: 'Substanzgebrauch',
        shopping: 'Kaufverhalten',
        digital: 'Digital-Nutzung'
      };
      concerns.push(labels[type]);
    }
  });
  
  // Kategorie-Scores über 60 als Bedenken
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score as number > 60) {
      const labels: any = {
        time: 'Zeitmanagement und Prioritäten',
        finance: 'Finanzielle Situation',
        emotional: 'Emotionale Stabilität',
        social: 'Soziale Beziehungen',
        health: 'Gesundheit und Alltag'
      };
      concerns.push(labels[category]);
    }
  });
  
  return [...new Set(concerns)]; // Duplikate entfernen
}

function calculateOverallConcern(
  addictionScores: any,
  behaviorPatterns: any
): number {
  // Durchschnitt der Sucht-Scores
  const addictionAvg = Object.values(addictionScores).reduce((a, b) => (a as number) + (b as number), 0) / 5;
  
  // Durchschnitt der Verhaltensmuster
  const behaviorAvg = Object.values(behaviorPatterns).reduce((a, b) => (a as number) + (b as number), 0) / 5;
  
  // Gewichtete Kombination (Sucht-Scores wichtiger)
  return Math.round(addictionAvg * 0.7 + behaviorAvg * 0.3);
}

function generateRecommendations(
  primarySuspicion: any,
  overallConcernLevel: number,
  behaviorPatterns: any
): string[] {
  const recommendations: string[] = [];
  
  if (overallConcernLevel < 30) {
    recommendations.push('Deine Beobachtungen deuten auf kein akutes Suchtproblem hin.');
    recommendations.push('Bleibe aufmerksam und vertrauensvoll im Gespräch.');
    recommendations.push('Sprich offen über deine gelegentlichen Bedenken.');
  } else if (overallConcernLevel < 50) {
    recommendations.push('Es gibt Anzeichen, die Aufmerksamkeit verdienen.');
    recommendations.push('Suche ein ruhiges, nicht-konfrontatives Gespräch.');
    recommendations.push('Biete deine Unterstützung an, ohne zu drängen.');
    recommendations.push('Informiere dich über lokale Beratungsangebote.');
  } else if (overallConcernLevel < 70) {
    recommendations.push('Die Situation erfordert dringend Aufmerksamkeit.');
    recommendations.push('Kontaktiere eine professionelle Suchtberatungsstelle für Angehörige.');
    recommendations.push('Bereite ein strukturiertes Gespräch vor (siehe Gesprächsleitfaden).');
    recommendations.push('Informiere ggf. weitere Vertrauenspersonen.');
    recommendations.push('Achte auf deine eigene psychische Gesundheit.');
  } else {
    recommendations.push('⚠️ Die Situation ist kritisch - handle jetzt!');
    recommendations.push('Kontaktiere SOFORT eine professionelle Suchtberatung.');
    recommendations.push('Erwäge eine professionell begleitete Intervention.');
    recommendations.push('Suche dir selbst Unterstützung (Al-Anon, Angehörigengruppen).');
    recommendations.push('Im Notfall: Sucht & Drogen Hotline 01805 313 031');
    recommendations.push('Setze klare Grenzen zum Selbstschutz.');
  }
  
  // Spezifische Empfehlungen basierend auf Verhaltensmustern
  if (behaviorPatterns.denial > 70) {
    recommendations.push('Die Person zeigt starke Verleugnung - professionelle Hilfe ist essentiell.');
  }
  
  if (behaviorPatterns.financialImpact > 60) {
    recommendations.push('Schütze deine eigenen Finanzen - keine Geldleihen mehr!');
  }
  
  if (behaviorPatterns.socialWithdrawal > 70) {
    recommendations.push('Die soziale Isolation ist kritisch - versuche den Kontakt zu halten.');
  }
  
  return recommendations;
}

function determineConversationGuideType(
  overallConcernLevel: number,
  behaviorPatterns: any
): 'gentle' | 'direct' | 'intervention' {
  if (overallConcernLevel < 40) {
    return 'gentle';
  } else if (overallConcernLevel < 70 || behaviorPatterns.denial < 60) {
    return 'direct';
  } else {
    return 'intervention';
  }
}

// Hilfsfunktion für Risiko-Level-Text
export function getRiskLevelText(score: number): string {
  if (score < 20) return 'Kein Risiko';
  if (score < 40) return 'Niedriges Risiko';
  if (score < 60) return 'Mittleres Risiko';
  if (score < 80) return 'Hohes Risiko';
  return 'Kritisches Risiko';
}

export function getRiskLevelColor(score: number): string {
  if (score < 20) return 'text-green-600';
  if (score < 40) return 'text-lime-600';
  if (score < 60) return 'text-yellow-600';
  if (score < 80) return 'text-orange-600';
  return 'text-red-600';
}

export function getSeverityBadgeColor(severity: string): string {
  const colors: any = {
    'none': 'bg-green-100 text-green-800',
    'low': 'bg-lime-100 text-lime-800',
    'moderate': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
}

export function getAddictionTypeLabel(type: string): string {
  const labels: any = {
    'gambling': 'Spielsucht',
    'alcohol': 'Alkohol',
    'substances': 'Substanzen',
    'shopping': 'Kaufsucht',
    'digital': 'Digital-Sucht',
    'none': 'Kein deutlicher Verdacht'
  };
  return labels[type] || type;
}

