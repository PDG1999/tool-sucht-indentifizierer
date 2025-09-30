import { currentConfig } from '@/config/language';
import { getTranslations } from '@/translations';

export const updateMetaTags = () => {
  const translations = getTranslations(currentConfig.language);
  const { meta } = translations;

  // Update document title
  document.title = meta.title;

  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', meta.description);
  }

  // Update meta keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.setAttribute('content', meta.keywords);
  }

  // Update Open Graph title
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (ogTitleMeta) {
    ogTitleMeta.setAttribute('content', meta.ogTitle);
  }

  // Update Open Graph description
  const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
  if (ogDescriptionMeta) {
    ogDescriptionMeta.setAttribute('content', meta.ogDescription);
  }

  // Update Twitter title
  const twitterTitleMeta = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitleMeta) {
    twitterTitleMeta.setAttribute('content', meta.ogTitle);
  }

  // Update Twitter description
  const twitterDescriptionMeta = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescriptionMeta) {
    twitterDescriptionMeta.setAttribute('content', meta.ogDescription);
  }

  // Update HTML lang attribute
  document.documentElement.lang = currentConfig.language;

  // Update structured data
  updateStructuredData();
};

const updateStructuredData = () => {
  const translations = getTranslations(currentConfig.language);
  const { meta } = translations;

  const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
  if (structuredDataScript) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": meta.ogTitle,
      "description": meta.ogDescription,
      "url": window.location.origin,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web Browser",
      "inLanguage": currentConfig.language,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": currentConfig.currency
      },
      "provider": {
        "@type": "Organization",
        "name": "SAMEBI",
        "url": "https://samebi.net"
      }
    };

    structuredDataScript.textContent = JSON.stringify(structuredData);
  }
};
