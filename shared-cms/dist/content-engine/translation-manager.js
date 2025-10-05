import { ContentLoader } from './content-loader.js';
import { WhiteLabelManager } from './white-label-manager.js';
export class TranslationManager {
    static instance;
    currentLanguage = 'es';
    currentTool = 'stress-test';
    currentPartner;
    content;
    partnerConfig;
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TranslationManager();
        }
        return this.instance;
    }
    initialize(toolId, language, partnerId) {
        this.currentTool = toolId;
        this.currentLanguage = language;
        this.currentPartner = partnerId;
        // Load content
        this.content = ContentLoader.loadContent(toolId, language);
        // Load partner config if provided
        if (partnerId) {
            this.partnerConfig = WhiteLabelManager.loadPartnerConfig(partnerId);
            // Validate partner supports this language
            if (!this.partnerConfig.languages.includes(language)) {
                console.warn(`Partner ${partnerId} does not support language ${language}, falling back to default`);
                this.currentLanguage = this.partnerConfig.defaultLanguage;
                this.content = ContentLoader.loadContent(toolId, this.partnerConfig.defaultLanguage);
            }
            // Validate partner supports this tool
            if (!this.partnerConfig.tools.includes(toolId)) {
                throw new Error(`Partner ${partnerId} does not have access to tool ${toolId}`);
            }
        }
    }
    getContent() {
        if (!this.content) {
            throw new Error('TranslationManager not initialized. Call initialize() first.');
        }
        return this.content;
    }
    getPartnerConfig() {
        return this.partnerConfig;
    }
    t(key) {
        if (!this.content) {
            throw new Error('TranslationManager not initialized');
        }
        const keys = key.split('.');
        let value = this.content;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            }
            else {
                console.warn(`Translation key not found: ${key} for ${this.currentTool}-${this.currentLanguage}`);
                return key;
            }
        }
        return typeof value === 'string' ? value : key;
    }
    interpolate(text, values) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return values[key]?.toString() || match;
        });
    }
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    getCurrentTool() {
        return this.currentTool;
    }
    getCurrentPartner() {
        return this.currentPartner;
    }
    switchLanguage(language) {
        // Check if partner supports this language
        if (this.partnerConfig && !this.partnerConfig.languages.includes(language)) {
            throw new Error(`Partner ${this.currentPartner} does not support language ${language}`);
        }
        if (language !== this.currentLanguage) {
            this.currentLanguage = language;
            this.content = ContentLoader.loadContent(this.currentTool, language);
        }
    }
    switchTool(toolId) {
        // Check if partner supports this tool
        if (this.partnerConfig && !this.partnerConfig.tools.includes(toolId)) {
            throw new Error(`Partner ${this.currentPartner} does not have access to tool ${toolId}`);
        }
        if (toolId !== this.currentTool) {
            this.currentTool = toolId;
            this.content = ContentLoader.loadContent(toolId, this.currentLanguage);
        }
    }
    getAvailableLanguages() {
        if (this.partnerConfig) {
            return this.partnerConfig.languages;
        }
        return ContentLoader.getAvailableLanguages();
    }
    getAvailableTools() {
        if (this.partnerConfig) {
            return this.partnerConfig.tools;
        }
        return ContentLoader.getAvailableTools();
    }
    isLanguageSupported(language) {
        return this.getAvailableLanguages().includes(language);
    }
    isToolSupported(toolId) {
        return this.getAvailableTools().includes(toolId);
    }
    getCompanyName() {
        if (this.partnerConfig) {
            return this.partnerConfig.branding.companyName;
        }
        return 'SAMEBI';
    }
    getSupportEmail() {
        if (this.partnerConfig) {
            return this.partnerConfig.contact.email;
        }
        return 'support@samebi.net';
    }
    getDomain() {
        if (this.partnerConfig) {
            return WhiteLabelManager.getPartnerDomain(this.partnerConfig);
        }
        return 'samebi.net';
    }
    getCurrency() {
        if (this.partnerConfig) {
            return this.partnerConfig.pricing.currency;
        }
        return 'EUR';
    }
    getDetailedAnalysisPrice() {
        if (this.partnerConfig) {
            return this.partnerConfig.pricing.detailedAnalysisPrice;
        }
        return '19€';
    }
    getLogo() {
        if (this.partnerConfig) {
            return this.partnerConfig.branding.logo;
        }
        return '/logo.svg';
    }
    getFavicon() {
        if (this.partnerConfig) {
            return this.partnerConfig.branding.favicon;
        }
        return '/favicon.ico';
    }
    getAnalyticsId() {
        if (this.partnerConfig) {
            return this.partnerConfig.analytics.googleAnalytics;
        }
        return undefined;
    }
    isFeatureEnabled(feature) {
        if (this.partnerConfig) {
            return WhiteLabelManager.isFeatureEnabled(this.partnerConfig, feature);
        }
        return true; // Default SAMEBI has all features
    }
    generateMetaTags() {
        const content = this.getContent();
        const domain = this.getDomain();
        return {
            title: content.meta.title,
            description: content.meta.description,
            keywords: content.meta.keywords,
            canonical: `https://${domain}`
        };
    }
    generateStructuredData() {
        const content = this.getContent();
        const companyName = this.getCompanyName();
        const domain = this.getDomain();
        const supportEmail = this.getSupportEmail();
        return {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": `${content.landing.title} | ${companyName}`,
            "description": content.meta.description,
            "url": `https://${domain}`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "inLanguage": this.currentLanguage,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": this.getCurrency()
            },
            "creator": {
                "@type": "Organization",
                "name": companyName,
                "url": `https://${domain}`,
                "contactPoint": {
                    "@type": "ContactPoint",
                    "email": supportEmail,
                    "contactType": "customer service",
                    "availableLanguage": this.getLanguageName()
                }
            },
            "audience": {
                "@type": "Audience",
                "audienceType": this.getAudienceType()
            }
        };
    }
    getLanguageName() {
        const languages = {
            es: 'Spanish',
            de: 'German',
            en: 'English'
        };
        return languages[this.currentLanguage];
    }
    getAudienceType() {
        const audiences = {
            es: 'Psicólogos y profesionales de la salud mental',
            de: 'Psychologen und Fachkräfte im Gesundheitswesen',
            en: 'Psychologists and mental health professionals'
        };
        return audiences[this.currentLanguage];
    }
    reload() {
        if (this.currentTool && this.currentLanguage) {
            this.content = ContentLoader.reloadContent(this.currentTool, this.currentLanguage);
            if (this.currentPartner) {
                // Clear cache and reload partner config
                this.partnerConfig = WhiteLabelManager.loadPartnerConfig(this.currentPartner);
            }
        }
    }
    getStatus() {
        return {
            initialized: !!this.content,
            tool: this.currentTool,
            language: this.currentLanguage,
            partner: this.currentPartner,
            hasContent: !!this.content,
            hasPartnerConfig: !!this.partnerConfig
        };
    }
}
// Export singleton instance
export const translationManager = TranslationManager.getInstance();
