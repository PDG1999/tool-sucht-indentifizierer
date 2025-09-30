import { Language } from '@/config/language';

export interface Translations {
  // Meta & SEO
  meta: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
  
  // Navigation & Layout
  nav: {
    home: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
  };
  
  // Landing Page
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    startTestButton: string;
    features: {
      scientific: string;
      immediate: string;
      personalized: string;
      confidential: string;
    };
    testimonials: {
      title: string;
    };
  };
  
  // Stress Test
  test: {
    title: string;
    subtitle: string;
    progress: string;
    question: string;
    nextButton: string;
    backButton: string;
    submitButton: string;
    loading: string;
  };
  
  // Results
  results: {
    title: string;
    subtitle: string;
    score: string;
    level: {
      low: string;
      moderate: string;
      high: string;
      critical: string;
    };
    recommendations: {
      title: string;
      low: string[];
      moderate: string[];
      high: string[];
      critical: string[];
    };
    downloadPdf: string;
    shareResults: string;
  };
  
  // Email Capture
  email: {
    title: string;
    subtitle: string;
    placeholder: string;
    submitButton: string;
    privacy: string;
    benefits: string[];
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    save: string;
    cancel: string;
    continue: string;
    back: string;
    next: string;
    finish: string;
  };
}

const germanTranslations: Translations = {
  meta: {
    title: "Stress-Test | Professionelle Bewertung - SAMEBI",
    description: "Wissenschaftlich validierter Stress-Level Test für Psychologen. Kostenlose Bewertung in 5 Minuten mit personalisierten Empfehlungen.",
    keywords: "stress test, psychologische bewertung, burnout, angst, psychologen deutschland",
    ogTitle: "Kostenloser Stress-Test | SAMEBI",
    ogDescription: "Entdecken Sie Ihr Stress-Level mit unserem wissenschaftlich validierten Test. Sofortige Ergebnisse und personalisierte Empfehlungen."
  },
  nav: {
    home: "Startseite",
    about: "Über uns",
    contact: "Kontakt",
    privacy: "Datenschutz",
    terms: "AGB"
  },
  landing: {
    heroTitle: "Professioneller Stress-Test",
    heroSubtitle: "Wissenschaftlich validiert",
    heroDescription: "Bewerten Sie Ihr Stress-Level in nur 5 Minuten mit unserem professionellen, wissenschaftlich fundierten Test.",
    startTestButton: "Test jetzt starten",
    features: {
      scientific: "Wissenschaftlich validiert",
      immediate: "Sofortige Ergebnisse",
      personalized: "Personalisierte Empfehlungen",
      confidential: "Vollständig vertraulich"
    },
    testimonials: {
      title: "Was unsere Nutzer sagen"
    }
  },
  test: {
    title: "Stress-Level Assessment",
    subtitle: "Beantworten Sie die folgenden Fragen ehrlich",
    progress: "Frage {current} von {total}",
    question: "Frage",
    nextButton: "Weiter",
    backButton: "Zurück",
    submitButton: "Test abschließen",
    loading: "Wird ausgewertet..."
  },
  results: {
    title: "Ihre Stress-Test Ergebnisse",
    subtitle: "Basierend auf Ihren Antworten",
    score: "Ihr Stress-Score",
    level: {
      low: "Niedriger Stress",
      moderate: "Moderater Stress",
      high: "Hoher Stress",
      critical: "Kritischer Stress"
    },
    recommendations: {
      title: "Personalisierte Empfehlungen",
      low: [
        "Behalten Sie Ihre aktuellen Bewältigungsstrategien bei",
        "Regelmäßige Entspannungsübungen zur Prävention",
        "Achten Sie auf eine ausgewogene Work-Life-Balance"
      ],
      moderate: [
        "Implementieren Sie tägliche Stressmanagement-Techniken",
        "Überprüfen Sie Ihre Arbeitsbelastung und Prioritäten",
        "Erwägen Sie professionelle Beratung zur Prävention"
      ],
      high: [
        "Sofortige Maßnahmen zur Stressreduktion erforderlich",
        "Professionelle psychologische Unterstützung empfohlen",
        "Überarbeitung der aktuellen Lebens- und Arbeitssituation"
      ],
      critical: [
        "Dringende professionelle Hilfe erforderlich",
        "Sofortige Entlastung der Stressfaktoren notwendig",
        "Medizinische Abklärung empfohlen"
      ]
    },
    downloadPdf: "PDF-Report herunterladen",
    shareResults: "Ergebnisse teilen"
  },
  email: {
    title: "Detaillierte Analyse erhalten",
    subtitle: "Erhalten Sie eine ausführliche Auswertung und personalisierte Empfehlungen",
    placeholder: "Ihre E-Mail-Adresse",
    submitButton: "Analyse anfordern",
    privacy: "Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.",
    benefits: [
      "Detaillierte Stress-Analyse",
      "Personalisierte Bewältigungsstrategien",
      "Professionelle Empfehlungen",
      "Kostenlose Nachbetreuung"
    ]
  },
  common: {
    loading: "Wird geladen...",
    error: "Ein Fehler ist aufgetreten",
    retry: "Erneut versuchen",
    close: "Schließen",
    save: "Speichern",
    cancel: "Abbrechen",
    continue: "Fortfahren",
    back: "Zurück",
    next: "Weiter",
    finish: "Abschließen"
  }
};

const englishTranslations: Translations = {
  meta: {
    title: "Stress Test | Professional Assessment - SAMEBI",
    description: "Scientifically validated stress level test for psychologists. Free assessment in 5 minutes with personalized recommendations.",
    keywords: "stress test, psychological assessment, burnout, anxiety, psychologists uk",
    ogTitle: "Free Stress Test | SAMEBI",
    ogDescription: "Discover your stress level with our scientifically validated test. Immediate results and personalized recommendations."
  },
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms"
  },
  landing: {
    heroTitle: "Professional Stress Test",
    heroSubtitle: "Scientifically Validated",
    heroDescription: "Assess your stress level in just 5 minutes with our professional, evidence-based test.",
    startTestButton: "Start Test Now",
    features: {
      scientific: "Scientifically validated",
      immediate: "Immediate results",
      personalized: "Personalized recommendations",
      confidential: "Completely confidential"
    },
    testimonials: {
      title: "What our users say"
    }
  },
  test: {
    title: "Stress Level Assessment",
    subtitle: "Please answer the following questions honestly",
    progress: "Question {current} of {total}",
    question: "Question",
    nextButton: "Next",
    backButton: "Back",
    submitButton: "Complete Test",
    loading: "Analyzing..."
  },
  results: {
    title: "Your Stress Test Results",
    subtitle: "Based on your responses",
    score: "Your Stress Score",
    level: {
      low: "Low Stress",
      moderate: "Moderate Stress",
      high: "High Stress",
      critical: "Critical Stress"
    },
    recommendations: {
      title: "Personalized Recommendations",
      low: [
        "Maintain your current coping strategies",
        "Regular relaxation exercises for prevention",
        "Focus on maintaining work-life balance"
      ],
      moderate: [
        "Implement daily stress management techniques",
        "Review your workload and priorities",
        "Consider professional counseling for prevention"
      ],
      high: [
        "Immediate stress reduction measures required",
        "Professional psychological support recommended",
        "Review of current life and work situation needed"
      ],
      critical: [
        "Urgent professional help required",
        "Immediate relief from stress factors necessary",
        "Medical evaluation recommended"
      ]
    },
    downloadPdf: "Download PDF Report",
    shareResults: "Share Results"
  },
  email: {
    title: "Get Detailed Analysis",
    subtitle: "Receive a comprehensive evaluation and personalized recommendations",
    placeholder: "Your email address",
    submitButton: "Request Analysis",
    privacy: "Your data is treated confidentially and not shared with third parties.",
    benefits: [
      "Detailed stress analysis",
      "Personalized coping strategies",
      "Professional recommendations",
      "Free follow-up support"
    ]
  },
  common: {
    loading: "Loading...",
    error: "An error occurred",
    retry: "Try again",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    back: "Back",
    next: "Next",
    finish: "Finish"
  }
};

const spanishTranslations: Translations = {
  meta: {
    title: "Test de Estrés | Evaluación Profesional - SAMEBI",
    description: "Test de estrés científicamente validado para psicólogos. Evaluación gratuita en 5 minutos con recomendaciones personalizadas.",
    keywords: "test estrés, evaluación psicológica, burnout, ansiedad, psicólogos españa",
    ogTitle: "Test de Estrés Gratuito | SAMEBI",
    ogDescription: "Descubre tu nivel de estrés con nuestro test científicamente validado. Resultados inmediatos y recomendaciones personalizadas."
  },
  nav: {
    home: "Inicio",
    about: "Acerca de",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos"
  },
  landing: {
    heroTitle: "Test de Estrés Profesional",
    heroSubtitle: "Científicamente Validado",
    heroDescription: "Evalúa tu nivel de estrés en solo 5 minutos con nuestro test profesional basado en evidencia.",
    startTestButton: "Comenzar Test Ahora",
    features: {
      scientific: "Científicamente validado",
      immediate: "Resultados inmediatos",
      personalized: "Recomendaciones personalizadas",
      confidential: "Completamente confidencial"
    },
    testimonials: {
      title: "Lo que dicen nuestros usuarios"
    }
  },
  test: {
    title: "Evaluación de Nivel de Estrés",
    subtitle: "Por favor responde las siguientes preguntas honestamente",
    progress: "Pregunta {current} de {total}",
    question: "Pregunta",
    nextButton: "Siguiente",
    backButton: "Atrás",
    submitButton: "Completar Test",
    loading: "Analizando..."
  },
  results: {
    title: "Tus Resultados del Test de Estrés",
    subtitle: "Basado en tus respuestas",
    score: "Tu Puntuación de Estrés",
    level: {
      low: "Estrés Bajo",
      moderate: "Estrés Moderado",
      high: "Estrés Alto",
      critical: "Estrés Crítico"
    },
    recommendations: {
      title: "Recomendaciones Personalizadas",
      low: [
        "Mantén tus estrategias actuales de afrontamiento",
        "Ejercicios regulares de relajación para prevención",
        "Enfócate en mantener el equilibrio trabajo-vida"
      ],
      moderate: [
        "Implementa técnicas diarias de manejo del estrés",
        "Revisa tu carga de trabajo y prioridades",
        "Considera asesoramiento profesional para prevención"
      ],
      high: [
        "Se requieren medidas inmediatas de reducción del estrés",
        "Se recomienda apoyo psicológico profesional",
        "Necesaria revisión de la situación actual de vida y trabajo"
      ],
      critical: [
        "Se requiere ayuda profesional urgente",
        "Necesario alivio inmediato de los factores de estrés",
        "Se recomienda evaluación médica"
      ]
    },
    downloadPdf: "Descargar Reporte PDF",
    shareResults: "Compartir Resultados"
  },
  email: {
    title: "Obtener Análisis Detallado",
    subtitle: "Recibe una evaluación completa y recomendaciones personalizadas",
    placeholder: "Tu dirección de email",
    submitButton: "Solicitar Análisis",
    privacy: "Tus datos son tratados confidencialmente y no se comparten con terceros.",
    benefits: [
      "Análisis detallado del estrés",
      "Estrategias personalizadas de afrontamiento",
      "Recomendaciones profesionales",
      "Soporte de seguimiento gratuito"
    ]
  },
  common: {
    loading: "Cargando...",
    error: "Ocurrió un error",
    retry: "Intentar de nuevo",
    close: "Cerrar",
    save: "Guardar",
    cancel: "Cancelar",
    continue: "Continuar",
    back: "Atrás",
    next: "Siguiente",
    finish: "Finalizar"
  }
};

export const translations: Record<Language, Translations> = {
  de: germanTranslations,
  en: englishTranslations,
  es: spanishTranslations
};

export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.es;
};
