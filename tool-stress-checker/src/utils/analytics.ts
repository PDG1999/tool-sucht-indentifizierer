import { currentConfig } from '@/config/language';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initializeAnalytics = () => {
  const { gaTrackingId, language } = currentConfig;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Initialize with timestamp
  window.gtag('js', new Date());

  // Configure with tracking ID and language
  window.gtag('config', gaTrackingId, {
    custom_map: {
      language: language,
      currency: currentConfig.currency,
      timezone: currentConfig.timezone
    }
  });

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
  document.head.appendChild(script);

  console.log(`Analytics initialized for ${language.toUpperCase()} with ID: ${gaTrackingId}`);
};

export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      language: currentConfig.language,
      ...parameters
    });
  }
};

// Predefined events for stress test
export const trackStressTestStarted = () => {
  trackEvent('stress_test_started', {
    event_category: 'engagement',
    event_label: 'test_interaction'
  });
};

export const trackStressTestQuestionAnswered = (questionNumber: number) => {
  trackEvent('stress_test_question_answered', {
    event_category: 'engagement',
    event_label: 'test_progress',
    question_number: questionNumber
  });
};

export const trackStressTestCompleted = (score: number, level: string) => {
  trackEvent('stress_test_completed', {
    event_category: 'conversion',
    event_label: 'test_completion',
    stress_score: score,
    stress_level: level
  });
};

export const trackEmailCaptured = (source: string = 'results_page') => {
  trackEvent('email_captured', {
    event_category: 'conversion',
    event_label: 'lead_generation',
    source: source
  });
};

export const trackPdfDownloaded = () => {
  trackEvent('pdf_downloaded', {
    event_category: 'conversion',
    event_label: 'content_download'
  });
};

export const trackUpsellClicked = (product: string) => {
  trackEvent('upsell_clicked', {
    event_category: 'conversion',
    event_label: 'upsell_interaction',
    product: product
  });
};
