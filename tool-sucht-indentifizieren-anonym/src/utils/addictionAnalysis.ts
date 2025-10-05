import { Response, ProfessionalScores } from './scoring';

export interface AddictionDirection {
  primary: string;
  primaryScore: number;
  secondary: string | null;
  secondaryScore: number | null;
  confidence: number;
  indicators: {
    gambling: number;
    substance: number;
    digital: number;
    alcohol: number;
    shopping: number;
  };
  riskPattern: string;
  coMorbidity: boolean;
}

/**
 * Erkennt die Haupt-Suchtrichtung basierend auf den Antworten
 */
export const detectAddictionDirection = (
  responses: Response[], 
  proScores: ProfessionalScores
): AddictionDirection => {
  // Kategorien nach Score sortieren
  const sortedCategories = [...proScores.categories].sort((a, b) => b.score - a.score);
  
  // Primäre und sekundäre Richtung
  const primary = sortedCategories[0];
  const secondary = sortedCategories[1].score > 50 ? sortedCategories[1] : null;
  
  // Spezifische Indikatoren berechnen
  const indicators = {
    gambling: calculateIndicator(responses, ['f3_8', 'f3_9', 'f3_10', 'f2_7']),
    substance: calculateIndicator(responses, ['f4_9', 'f4_10', 'f5_9', 'f5_10']),
    digital: calculateIndicator(responses, ['f1_7', 'f3_1', 'f3_2', 'f4_1']),
    alcohol: calculateIndicator(responses, ['f4_8', 'f5_8', 'f2_8']),
    shopping: calculateIndicator(responses, ['f2_6', 'f2_7', 'f3_7']),
  };
  
  // Risiko-Muster erkennen
  const riskPattern = detectRiskPattern(indicators);
  
  // Ko-Morbidität prüfen
  const coMorbidity = sortedCategories.filter(c => c.score > 50).length > 1;
  
  // Konfidenz berechnen (wie sicher sind wir über die primäre Richtung)
  const confidence = primary.score / 100;
  
  return {
    primary: primary.name,
    primaryScore: primary.score,
    secondary: secondary ? secondary.name : null,
    secondaryScore: secondary ? secondary.score : null,
    confidence,
    indicators,
    riskPattern,
    coMorbidity,
  };
};

/**
 * Berechnet einen spezifischen Indikator basierend auf relevanten Fragen
 */
const calculateIndicator = (responses: Response[], questionIds: string[]): number => {
  const relevantResponses = responses.filter(r => questionIds.includes(r.questionId));
  if (relevantResponses.length === 0) return 0;
  
  const totalScore = relevantResponses.reduce((sum, r) => sum + r.value, 0);
  const maxPossible = relevantResponses.length * 4; // Max value pro Frage ist 4
  
  return Math.round((totalScore / maxPossible) * 100);
};

/**
 * Erkennt spezifische Risiko-Muster basierend auf den Indikatoren
 */
const detectRiskPattern = (indicators: AddictionDirection['indicators']): string => {
  const { gambling, substance, digital, alcohol, shopping } = indicators;
  
  // Mehrfach-Sucht Muster
  if (gambling > 60 && (substance > 40 || alcohol > 40)) {
    return 'Gambling + Substanzmissbrauch (Hohes Risiko)';
  }
  
  if (digital > 70 && substance > 30) {
    return 'Digitale Sucht + Substanzen (Eskapismus-Muster)';
  }
  
  if (alcohol > 50 && substance > 30) {
    return 'Polysubstanz-Missbrauch (Kritisch)';
  }
  
  if (shopping > 60 && gambling > 40) {
    return 'Impulskontroll-Störung (Shopping + Gambling)';
  }
  
  // Einzel-Sucht Muster
  if (digital > 70) {
    return 'Digitale Sucht (Gaming/Social Media)';
  }
  
  if (gambling > 70) {
    return 'Pathologisches Glücksspiel';
  }
  
  if (alcohol > 70) {
    return 'Alkohol-Abhängigkeit';
  }
  
  if (substance > 70) {
    return 'Substanz-Abhängigkeit';
  }
  
  if (shopping > 70) {
    return 'Kaufsucht (Compulsive Buying)';
  }
  
  // Diffuses Muster
  const highScores = Object.values(indicators).filter(v => v > 40).length;
  if (highScores >= 3) {
    return 'Diffuses Suchtmuster (mehrere Bereiche betroffen)';
  }
  
  return 'Einzelner Fokus';
};

/**
 * Generiert eine detaillierte Analyse für Berater
 */
export const generateCounselorReport = (direction: AddictionDirection): string => {
  let report = `🎯 SUCHT-RICHTUNGS-ANALYSE\n\n`;
  
  report += `Primäre Richtung: ${direction.primary} (${direction.primaryScore}%)\n`;
  report += `Konfidenz: ${(direction.confidence * 100).toFixed(0)}%\n\n`;
  
  if (direction.secondary) {
    report += `⚠️ Sekundäre Richtung: ${direction.secondary} (${direction.secondaryScore}%)\n\n`;
  }
  
  report += `📊 KATEGORIE-INDIKATOREN:\n`;
  Object.entries(direction.indicators).forEach(([key, value]) => {
    const emoji = value > 70 ? '🔴' : value > 50 ? '🟠' : value > 30 ? '🟡' : '🟢';
    report += `${emoji} ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}%\n`;
  });
  
  report += `\n🔍 RISIKO-MUSTER:\n${direction.riskPattern}\n\n`;
  
  if (direction.coMorbidity) {
    report += `⚠️ KO-MORBIDITÄT ERKANNT!\n`;
    report += `Mehrere Suchtformen gleichzeitig vorhanden.\n`;
    report += `Empfehlung: Umfassende multimodale Behandlung.\n`;
  }
  
  return report;
};
