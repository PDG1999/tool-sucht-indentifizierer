/**
 * 🧠 Angehörigen-Fragebogen für Sucht-Screening
 * 
 * Diese Fragen sind speziell für Familie/Freunde entwickelt,
 * die Sorge um eine andere Person haben.
 * 
 * Besonderheiten:
 * - Beobachtungsbasierte Formulierung ("Ich habe beobachtet, dass...")
 * - Fokus auf äußerlich sichtbare Verhaltensänderungen
 * - Keine Konfrontation oder direktes Fragen erforderlich
 * - Deckt alle 5 Sucht-Kategorien ab
 */

export interface FamilyQuestion {
  id: string;
  text: string;
  category: 'time' | 'finance' | 'emotional' | 'social' | 'health';
  addictionIndicators: {
    gambling?: number;
    alcohol?: number;
    substances?: number;
    shopping?: number;
    digital?: number;
  };
  options: {
    text: string;
    score: number;
  }[];
  reverse?: boolean; // Für umgekehrte Bewertung
}

export const familyQuestions: FamilyQuestion[] = [
  // ============= KATEGORIE 1: ZEIT & PRIORITÄTEN (8 Fragen) =============
  {
    id: 'time_1',
    text: 'In den letzten Monaten verbringt diese Person deutlich mehr Zeit mit einer bestimmten Aktivität (z.B. Gaming, Online-Shopping, Alkohol trinken, Glücksspiel).',
    category: 'time',
    addictionIndicators: {
      gambling: 8,
      alcohol: 7,
      substances: 6,
      shopping: 8,
      digital: 9
    },
    options: [
      { text: 'Trifft nicht zu - keine Veränderung bemerkt', score: 0 },
      { text: 'Teilweise - manchmal fällt es auf', score: 3 },
      { text: 'Deutlich - sehr auffällige Veränderung', score: 7 },
      { text: 'Extrem - die Aktivität dominiert das Leben', score: 10 }
    ]
  },
  {
    id: 'time_2',
    text: 'Die Person vernachlässigt wichtige Verpflichtungen (Arbeit, Familie, Haushalt) wegen dieser Aktivität.',
    category: 'time',
    addictionIndicators: {
      gambling: 9,
      alcohol: 8,
      substances: 9,
      shopping: 7,
      digital: 8
    },
    options: [
      { text: 'Nie - erfüllt alle Pflichten zuverlässig', score: 0 },
      { text: 'Selten - vereinzelte Versäumnisse', score: 4 },
      { text: 'Häufig - regelmäßige Vernachlässigung', score: 7 },
      { text: 'Ständig - gravierende Probleme', score: 10 }
    ]
  },
  {
    id: 'time_3',
    text: 'Die Person lügt oder verheimlicht, wie viel Zeit sie mit dieser Aktivität verbringt.',
    category: 'time',
    addictionIndicators: {
      gambling: 9,
      alcohol: 7,
      substances: 8,
      shopping: 8,
      digital: 7
    },
    options: [
      { text: 'Nein - immer ehrlich und offen', score: 0 },
      { text: 'Manchmal - kleine "Notlügen"', score: 5 },
      { text: 'Oft - systematisches Verheimlichen', score: 8 },
      { text: 'Permanent - komplettes Lügengebäude', score: 10 }
    ]
  },
  {
    id: 'time_4',
    text: 'Frühere Hobbys oder Interessen wurden aufgegeben oder stark reduziert.',
    category: 'time',
    addictionIndicators: {
      gambling: 7,
      alcohol: 6,
      substances: 7,
      shopping: 5,
      digital: 8
    },
    options: [
      { text: 'Nein - alle Interessen wie früher', score: 0 },
      { text: 'Ein bisschen - weniger Zeit für Hobbys', score: 3 },
      { text: 'Deutlich - meiste Hobbys aufgegeben', score: 7 },
      { text: 'Vollständig - nur noch eine Sache zählt', score: 10 }
    ]
  },
  {
    id: 'time_5',
    text: 'Die Person ist reizbar oder unruhig, wenn sie die Aktivität nicht ausüben kann.',
    category: 'time',
    addictionIndicators: {
      gambling: 8,
      alcohol: 9,
      substances: 9,
      shopping: 6,
      digital: 8
    },
    options: [
      { text: 'Nie bemerkt - bleibt immer ausgeglichen', score: 0 },
      { text: 'Selten - gelegentlich etwas nervös', score: 4 },
      { text: 'Häufig - deutliche Entzugserscheinungen', score: 8 },
      { text: 'Immer - massive Reizbarkeit ohne die Aktivität', score: 10 }
    ]
  },
  {
    id: 'time_6',
    text: 'Termine und Verabredungen mit Familie/Freunden werden häufig abgesagt oder vergessen.',
    category: 'time',
    addictionIndicators: {
      gambling: 7,
      alcohol: 6,
      substances: 7,
      shopping: 5,
      digital: 7
    },
    options: [
      { text: 'Nie - sehr zuverlässig', score: 0 },
      { text: 'Manchmal - vereinzelte Absagen', score: 3 },
      { text: 'Regelmäßig - häufige Unzuverlässigkeit', score: 7 },
      { text: 'Fast immer - totaler Rückzug', score: 10 }
    ]
  },
  {
    id: 'time_7',
    text: 'Die Person braucht immer mehr von der Aktivität, um zufrieden zu sein (mehr Zeit, mehr Geld, höhere Dosen).',
    category: 'time',
    addictionIndicators: {
      gambling: 9,
      alcohol: 9,
      substances: 10,
      shopping: 8,
      digital: 7
    },
    options: [
      { text: 'Nein - stabiles Niveau', score: 0 },
      { text: 'Leicht - etwas gesteigert', score: 4 },
      { text: 'Deutlich - starke Steigerung', score: 8 },
      { text: 'Extrem - unkontrollierte Eskalation', score: 10 }
    ]
  },
  {
    id: 'time_8',
    text: 'Die Person spricht ständig über diese eine Aktivität oder plant sie gedanklich.',
    category: 'time',
    addictionIndicators: {
      gambling: 7,
      alcohol: 5,
      substances: 6,
      shopping: 7,
      digital: 8
    },
    options: [
      { text: 'Nein - vielfältige Gesprächsthemen', score: 0 },
      { text: 'Manchmal - gelegentlich Thema', score: 3 },
      { text: 'Oft - dominantes Gesprächsthema', score: 7 },
      { text: 'Ständig - kein anderes Thema mehr', score: 10 }
    ]
  },

  // ============= KATEGORIE 2: FINANZEN (8 Fragen) =============
  {
    id: 'finance_1',
    text: 'Die Person gibt deutlich mehr Geld aus als früher für eine bestimmte Sache.',
    category: 'finance',
    addictionIndicators: {
      gambling: 10,
      alcohol: 7,
      substances: 9,
      shopping: 10,
      digital: 6
    },
    options: [
      { text: 'Nein - normale Ausgaben', score: 0 },
      { text: 'Etwas mehr - leicht erhöht', score: 3 },
      { text: 'Deutlich mehr - auffällig erhöht', score: 7 },
      { text: 'Extrem viel - finanzielle Probleme', score: 10 }
    ]
  },
  {
    id: 'finance_2',
    text: 'Es gibt unerklärliche Geldabgänge oder die Person leiht sich häufig Geld.',
    category: 'finance',
    addictionIndicators: {
      gambling: 10,
      alcohol: 6,
      substances: 9,
      shopping: 8,
      digital: 5
    },
    options: [
      { text: 'Nie - finanziell transparent', score: 0 },
      { text: 'Manchmal - gelegentlich unklar', score: 5 },
      { text: 'Häufig - regelmäßige Geldnot', score: 8 },
      { text: 'Ständig - chronische Geldprobleme', score: 10 }
    ]
  },
  {
    id: 'finance_3',
    text: 'Rechnungen werden nicht mehr bezahlt oder Mahnungen kommen.',
    category: 'finance',
    addictionIndicators: {
      gambling: 9,
      alcohol: 7,
      substances: 8,
      shopping: 9,
      digital: 4
    },
    options: [
      { text: 'Nein - alle Rechnungen pünktlich', score: 0 },
      { text: 'Selten - vereinzelte Verzögerungen', score: 4 },
      { text: 'Häufig - regelmäßige Mahnungen', score: 8 },
      { text: 'Massiv - Inkasso oder Gerichtsbescheide', score: 10 }
    ]
  },
  {
    id: 'finance_4',
    text: 'Die Person verkauft persönliche Gegenstände oder leiht sich Geld von mehreren Personen.',
    category: 'finance',
    addictionIndicators: {
      gambling: 10,
      alcohol: 6,
      substances: 10,
      shopping: 5,
      digital: 3
    },
    options: [
      { text: 'Nie - finanziell stabil', score: 0 },
      { text: 'Ein-/zweimal - Ausnahmen', score: 5 },
      { text: 'Mehrfach - auffälliges Muster', score: 8 },
      { text: 'Ständig - verzweifelte Geldbeschaffung', score: 10 }
    ]
  },
  {
    id: 'finance_5',
    text: 'Die Person verheimlicht Ausgaben oder öffnet keine Post mehr.',
    category: 'finance',
    addictionIndicators: {
      gambling: 9,
      alcohol: 5,
      substances: 7,
      shopping: 9,
      digital: 4
    },
    options: [
      { text: 'Nein - vollständig transparent', score: 0 },
      { text: 'Manchmal - kleine Geheimnisse', score: 4 },
      { text: 'Häufig - systematisches Verheimlichen', score: 7 },
      { text: 'Immer - komplette Intransparenz', score: 10 }
    ]
  },
  {
    id: 'finance_6',
    text: 'Gemeinsame Ersparnisse oder Konten sind ohne Erklärung geschrumpft.',
    category: 'finance',
    addictionIndicators: {
      gambling: 10,
      alcohol: 5,
      substances: 8,
      shopping: 9,
      digital: 4
    },
    options: [
      { text: 'Nein - Konten wie erwartet', score: 0 },
      { text: 'Etwas - leichte Abweichungen', score: 5 },
      { text: 'Deutlich - erhebliche Beträge fehlen', score: 8 },
      { text: 'Massiv - katastrophaler finanzieller Schaden', score: 10 }
    ]
  },
  {
    id: 'finance_7',
    text: 'Die Person hat neue Kreditkarten beantragt oder nimmt Kredite auf.',
    category: 'finance',
    addictionIndicators: {
      gambling: 9,
      alcohol: 5,
      substances: 7,
      shopping: 10,
      digital: 3
    },
    options: [
      { text: 'Nein - keine neuen Schulden', score: 0 },
      { text: 'Eine neue Kreditquelle', score: 4 },
      { text: 'Mehrere neue Kredite/Karten', score: 8 },
      { text: 'Massive Verschuldung', score: 10 }
    ]
  },
  {
    id: 'finance_8',
    text: 'Gespräche über Geld führen zu starken emotionalen Reaktionen (Wut, Abwehr, Tränen).',
    category: 'finance',
    addictionIndicators: {
      gambling: 8,
      alcohol: 6,
      substances: 7,
      shopping: 8,
      digital: 5
    },
    options: [
      { text: 'Nein - sachliche Gespräche möglich', score: 0 },
      { text: 'Manchmal - leicht angespannt', score: 3 },
      { text: 'Häufig - starke Abwehrreaktionen', score: 7 },
      { text: 'Immer - Gespräche unmöglich', score: 10 }
    ]
  },

  // ============= KATEGORIE 3: EMOTIONEN & STIMMUNG (8 Fragen) =============
  {
    id: 'emotional_1',
    text: 'Die Person wirkt oft depressiv, ängstlich oder emotional instabil.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 9,
      shopping: 6,
      digital: 6
    },
    options: [
      { text: 'Nein - emotional stabil', score: 0 },
      { text: 'Manchmal - gelegentliche Stimmungstiefs', score: 4 },
      { text: 'Häufig - regelmäßige emotionale Krisen', score: 7 },
      { text: 'Ständig - permanente emotionale Instabilität', score: 10 }
    ]
  },
  {
    id: 'emotional_2',
    text: 'Stimmungsschwankungen sind extrem geworden - von Euphorie bis tiefer Depression.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 9,
      alcohol: 7,
      substances: 9,
      shopping: 7,
      digital: 5
    },
    options: [
      { text: 'Nein - ausgeglichene Stimmung', score: 0 },
      { text: 'Leichte Schwankungen', score: 3 },
      { text: 'Starke Schwankungen', score: 7 },
      { text: 'Extreme Achterbahnfahrt', score: 10 }
    ]
  },
  {
    id: 'emotional_3',
    text: 'Die Person wirkt nur noch "normal", wenn sie die Aktivität ausübt.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 8,
      alcohol: 9,
      substances: 10,
      shopping: 6,
      digital: 7
    },
    options: [
      { text: 'Nein - immer ausgeglichen', score: 0 },
      { text: 'Manchmal - leichte Verbesserung während Aktivität', score: 4 },
      { text: 'Meistens - deutlich besser während Aktivität', score: 8 },
      { text: 'Ausschließlich - nur dann erträglich', score: 10 }
    ]
  },
  {
    id: 'emotional_4',
    text: 'Die Person reagiert aggressiv oder abweisend, wenn man das Thema anspricht.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 8,
      alcohol: 9,
      substances: 9,
      shopping: 7,
      digital: 6
    },
    options: [
      { text: 'Nein - offene Gespräche möglich', score: 0 },
      { text: 'Manchmal defensiv', score: 4 },
      { text: 'Häufig aggressiv/abweisend', score: 7 },
      { text: 'Immer - Gespräche unmöglich', score: 10 }
    ]
  },
  {
    id: 'emotional_5',
    text: 'Schuld- und Schamgefühle sind offensichtlich, aber führen nicht zu Verhaltensänderung.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 8,
      alcohol: 7,
      substances: 8,
      shopping: 7,
      digital: 5
    },
    options: [
      { text: 'Nicht beobachtet', score: 0 },
      { text: 'Manchmal - leichte Schuldgefühle', score: 3 },
      { text: 'Oft - starke Schuldgefühle, aber keine Änderung', score: 7 },
      { text: 'Ständig - lähmende Scham, Teufelskreis', score: 10 }
    ]
  },
  {
    id: 'emotional_6',
    text: 'Die Person scheint das Interesse am Leben verloren zu haben - außer an dieser einen Sache.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 9,
      shopping: 6,
      digital: 8
    },
    options: [
      { text: 'Nein - vielfältige Interessen', score: 0 },
      { text: 'Teilweise - eingeschränkte Interessen', score: 4 },
      { text: 'Deutlich - nur noch eine Sache wichtig', score: 8 },
      { text: 'Total - komplette Gleichgültigkeit sonst', score: 10 }
    ]
  },
  {
    id: 'emotional_7',
    text: 'Ich habe das Gefühl, die Person ist nicht mehr "sie selbst" - die Persönlichkeit hat sich verändert.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 9,
      shopping: 6,
      digital: 7
    },
    options: [
      { text: 'Nein - noch dieselbe Person', score: 0 },
      { text: 'Ein bisschen - kleine Veränderungen', score: 4 },
      { text: 'Deutlich - merkliche Persönlichkeitsveränderung', score: 7 },
      { text: 'Vollständig - wie ein anderer Mensch', score: 10 }
    ]
  },
  {
    id: 'emotional_8',
    text: 'Die Person leugnet das Problem, obwohl die Konsequenzen offensichtlich sind.',
    category: 'emotional',
    addictionIndicators: {
      gambling: 9,
      alcohol: 9,
      substances: 9,
      shopping: 8,
      digital: 7
    },
    options: [
      { text: 'Nein - erkennt Probleme an', score: 0 },
      { text: 'Teilweise - minimiert das Problem', score: 4 },
      { text: 'Stark - vollständige Verleugnung', score: 8 },
      { text: 'Total - realitätsferne Wahrnehmung', score: 10 }
    ]
  },

  // ============= KATEGORIE 4: SOZIALE BEZIEHUNGEN (8 Fragen) =============
  {
    id: 'social_1',
    text: 'Die Person zieht sich von Familie und Freunden zurück.',
    category: 'social',
    addictionIndicators: {
      gambling: 7,
      alcohol: 6,
      substances: 8,
      shopping: 5,
      digital: 8
    },
    options: [
      { text: 'Nein - sozial aktiv wie früher', score: 0 },
      { text: 'Ein bisschen - weniger soziale Aktivitäten', score: 3 },
      { text: 'Deutlich - starker Rückzug', score: 7 },
      { text: 'Total - komplette soziale Isolation', score: 10 }
    ]
  },
  {
    id: 'social_2',
    text: 'Konflikte in der Familie/Partnerschaft haben deutlich zugenommen.',
    category: 'social',
    addictionIndicators: {
      gambling: 8,
      alcohol: 9,
      substances: 8,
      shopping: 7,
      digital: 6
    },
    options: [
      { text: 'Nein - harmonische Beziehungen', score: 0 },
      { text: 'Manchmal - gelegentliche Spannungen', score: 4 },
      { text: 'Häufig - regelmäßige heftige Konflikte', score: 7 },
      { text: 'Ständig - Beziehungen am Zerbrechen', score: 10 }
    ]
  },
  {
    id: 'social_3',
    text: 'Die Person trifft sich mit neuen, zweifelhaften Bekannten oder in fragwürdigen Umgebungen.',
    category: 'social',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 10,
      shopping: 3,
      digital: 4
    },
    options: [
      { text: 'Nein - stabiler Freundeskreis', score: 0 },
      { text: 'Vereinzelt neue Kontakte', score: 4 },
      { text: 'Häufig - bedenkliche neue Umfelder', score: 8 },
      { text: 'Ausschließlich - nur noch "schlechter Umgang"', score: 10 }
    ]
  },
  {
    id: 'social_4',
    text: 'Alte Freunde und verlässliche Kontakte wurden abgebrochen oder gemieden.',
    category: 'social',
    addictionIndicators: {
      gambling: 6,
      alcohol: 7,
      substances: 8,
      shopping: 5,
      digital: 7
    },
    options: [
      { text: 'Nein - alle Freundschaften intakt', score: 0 },
      { text: 'Einige Freundschaften vernachlässigt', score: 3 },
      { text: 'Viele alte Freunde verloren', score: 7 },
      { text: 'Alle alten Kontakte abgebrochen', score: 10 }
    ]
  },
  {
    id: 'social_5',
    text: 'Die Person lügt über ihren Aufenthaltsort oder Aktivitäten.',
    category: 'social',
    addictionIndicators: {
      gambling: 9,
      alcohol: 7,
      substances: 9,
      shopping: 7,
      digital: 6
    },
    options: [
      { text: 'Nie - immer ehrlich', score: 0 },
      { text: 'Manchmal - gelegentliche Ausreden', score: 5 },
      { text: 'Häufig - regelmäßiges Lügen', score: 8 },
      { text: 'Ständig - Lügengebäude als System', score: 10 }
    ]
  },
  {
    id: 'social_6',
    text: 'Familienfeste, Geburtstage oder wichtige Ereignisse werden verpasst oder ignoriert.',
    category: 'social',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 7,
      shopping: 5,
      digital: 7
    },
    options: [
      { text: 'Nie - immer dabei', score: 0 },
      { text: 'Selten - vereinzelte Absagen', score: 3 },
      { text: 'Häufig - regelmäßiges Fernbleiben', score: 7 },
      { text: 'Fast immer - totale Prioritätsverschiebung', score: 10 }
    ]
  },
  {
    id: 'social_7',
    text: 'Die Person ist abwesend oder "nicht präsent", auch wenn physisch anwesend.',
    category: 'social',
    addictionIndicators: {
      gambling: 6,
      alcohol: 5,
      substances: 7,
      shopping: 4,
      digital: 9
    },
    options: [
      { text: 'Nein - voll aufmerksam', score: 0 },
      { text: 'Manchmal - gelegentlich abgelenkt', score: 3 },
      { text: 'Oft - meistens gedanklich woanders', score: 7 },
      { text: 'Immer - mental komplett abwesend', score: 10 }
    ]
  },
  {
    id: 'social_8',
    text: 'Ich traue mich nicht mehr, bestimmte Themen anzusprechen - aus Angst vor der Reaktion.',
    category: 'social',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 8,
      shopping: 6,
      digital: 5
    },
    options: [
      { text: 'Nein - offene Kommunikation', score: 0 },
      { text: 'Bei manchen Themen vorsichtig', score: 4 },
      { text: 'Bei vielen Themen - "auf Eierschalen"', score: 7 },
      { text: 'Bei fast allem - Angst vor Eskalation', score: 10 }
    ]
  },

  // ============= KATEGORIE 5: GESUNDHEIT & ALLTAG (8 Fragen) =============
  {
    id: 'health_1',
    text: 'Das körperliche Erscheinungsbild hat sich verschlechtert (Gewicht, Haut, Pflege).',
    category: 'health',
    addictionIndicators: {
      gambling: 5,
      alcohol: 8,
      substances: 9,
      shopping: 3,
      digital: 6
    },
    options: [
      { text: 'Nein - wie immer gepflegt', score: 0 },
      { text: 'Leicht - kleine Veränderungen', score: 3 },
      { text: 'Deutlich - auffällige Vernachlässigung', score: 7 },
      { text: 'Stark - drastische Verschlechterung', score: 10 }
    ]
  },
  {
    id: 'health_2',
    text: 'Schlafmuster sind gestört - zu wenig Schlaf, unregelmäßiger Rhythmus oder Schlaf zu ungewöhnlichen Zeiten.',
    category: 'health',
    addictionIndicators: {
      gambling: 6,
      alcohol: 7,
      substances: 8,
      shopping: 4,
      digital: 9
    },
    options: [
      { text: 'Nein - gesunder Schlafrhythmus', score: 0 },
      { text: 'Manchmal - gelegentliche Störungen', score: 3 },
      { text: 'Häufig - regelmäßig gestörter Schlaf', score: 7 },
      { text: 'Chronisch - massives Schlafdefizit', score: 10 }
    ]
  },
  {
    id: 'health_3',
    text: 'Essgewohnheiten haben sich verändert - zu viel, zu wenig, unregelmäßig oder ungesund.',
    category: 'health',
    addictionIndicators: {
      gambling: 5,
      alcohol: 6,
      substances: 7,
      shopping: 4,
      digital: 6
    },
    options: [
      { text: 'Nein - normale Ernährung', score: 0 },
      { text: 'Leicht verändert', score: 3 },
      { text: 'Deutlich verändert - ungesund', score: 6 },
      { text: 'Extrem - gesundheitsschädlich', score: 10 }
    ]
  },
  {
    id: 'health_4',
    text: 'Körperliche Symptome sind aufgetreten (Zittern, Schwitzen, Unruhe, Erschöpfung).',
    category: 'health',
    addictionIndicators: {
      gambling: 6,
      alcohol: 9,
      substances: 10,
      shopping: 4,
      digital: 5
    },
    options: [
      { text: 'Nein - körperlich fit', score: 0 },
      { text: 'Leichte Symptome - manchmal', score: 4 },
      { text: 'Deutliche Symptome - häufig', score: 7 },
      { text: 'Schwere Symptome - permanent', score: 10 }
    ]
  },
  {
    id: 'health_5',
    text: 'Arzttermine werden versäumt oder gesundheitliche Probleme ignoriert.',
    category: 'health',
    addictionIndicators: {
      gambling: 6,
      alcohol: 7,
      substances: 8,
      shopping: 4,
      digital: 5
    },
    options: [
      { text: 'Nein - achtet auf Gesundheit', score: 0 },
      { text: 'Manchmal - vereinzelt nachlässig', score: 3 },
      { text: 'Häufig - systematische Vernachlässigung', score: 7 },
      { text: 'Immer - totale Gleichgültigkeit', score: 10 }
    ]
  },
  {
    id: 'health_6',
    text: 'Leistungsfähigkeit bei Arbeit/Schule hat abgenommen - Fehler, Fehlzeiten, schlechte Bewertungen.',
    category: 'health',
    addictionIndicators: {
      gambling: 7,
      alcohol: 8,
      substances: 9,
      shopping: 5,
      digital: 7
    },
    options: [
      { text: 'Nein - normale Leistung', score: 0 },
      { text: 'Leicht vermindert', score: 4 },
      { text: 'Deutlich verschlechtert', score: 7 },
      { text: 'Drastisch - Jobverlust droht/eingetreten', score: 10 }
    ]
  },
  {
    id: 'health_7',
    text: 'Die Person wirkt oft müde, energielos oder "wie gerädert".',
    category: 'health',
    addictionIndicators: {
      gambling: 5,
      alcohol: 7,
      substances: 8,
      shopping: 4,
      digital: 7
    },
    options: [
      { text: 'Nein - energiegeladen', score: 0 },
      { text: 'Manchmal - gelegentlich müde', score: 3 },
      { text: 'Häufig - chronische Erschöpfung', score: 7 },
      { text: 'Ständig - totale Entkräftung', score: 10 }
    ]
  },
  {
    id: 'health_8',
    text: 'Körperhygiene und Selbstpflege werden vernachlässigt.',
    category: 'health',
    addictionIndicators: {
      gambling: 5,
      alcohol: 8,
      substances: 9,
      shopping: 3,
      digital: 6
    },
    options: [
      { text: 'Nein - immer gepflegt', score: 0 },
      { text: 'Manchmal - gelegentlich nachlässig', score: 4 },
      { text: 'Häufig - auffällige Vernachlässigung', score: 7 },
      { text: 'Extrem - massive hygienische Probleme', score: 10 }
    ]
  }
];

// Hilfs-Funktion für Shuffle (später für Anti-Gaming)
export function shuffleQuestions(questions: FamilyQuestion[]): FamilyQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}







