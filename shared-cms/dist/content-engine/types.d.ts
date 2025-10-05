export type Language = 'es' | 'de' | 'en';
export type ToolId = 'stress-test' | 'burnout-test' | 'personality-test' | 'content-generator' | 'rate-calculator' | 'location-analyzer';
export interface ToolContent {
    toolId: ToolId;
    version: string;
    lastUpdated: string;
    meta: {
        title: string;
        description: string;
        keywords: string;
    };
    nav: {
        home: string;
        test: string;
        results: string;
        contact: string;
        privacy: string;
        terms: string;
    };
    landing: {
        title: string;
        subtitle: string;
        description: string;
        startTest: string;
        features: {
            scientific: string;
            quick: string;
            detailed: string;
            recommendations: string;
        };
        stats: {
            testsCompleted: string;
            psychologists: string;
            accuracy: string;
        };
        testimonials: {
            title: string;
            testimonial1: string;
            testimonial2: string;
            testimonial3: string;
        };
        cta: {
            title: string;
            description: string;
            button: string;
        };
    };
    test: {
        title: string;
        subtitle: string;
        progress: string;
        timeRemaining: string;
        instructions: string;
        scale: {
            never: string;
            rarely: string;
            sometimes: string;
            often: string;
            always: string;
        };
        questions: string[];
        navigation: {
            back: string;
            next: string;
            submit: string;
            loading: string;
        };
    };
    results: {
        title: string;
        score: string;
        levels: {
            low: string;
            moderate: string;
            high: string;
            critical: string;
        };
        interpretations: {
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
        emailCapture: {
            title: string;
            description: string;
            placeholder: string;
            consent: string;
            submit: string;
            privacy: string;
        };
        detailedAnalysis: {
            title: string;
            description: string;
            features: string[];
            price: string;
            cta: string;
        };
        actions: {
            repeatTest: string;
            backHome: string;
        };
    };
    common: {
        loading: string;
        error: string;
        retry: string;
        close: string;
        save: string;
        cancel: string;
    };
    footer: {
        copyright: string;
        developed: string;
        contact: string;
    };
}
export interface WhiteLabelConfig {
    partnerId: string;
    partnerName: string;
    domain: string;
    subdomain?: string;
    branding: {
        companyName: string;
        logo: string;
        favicon: string;
        colors: {
            primary: string;
            secondary: string;
            accent: string;
            success: string;
            warning: string;
            error: string;
        };
        fonts: {
            heading: string;
            body: string;
        };
    };
    contact: {
        email: string;
        phone?: string;
        address?: string;
        website?: string;
    };
    features: {
        whiteLabel: boolean;
        customBranding: boolean;
        customDomain: boolean;
        analytics: boolean;
        apiAccess: boolean;
        multiLanguage: boolean;
        customQuestions: boolean;
    };
    analytics: {
        googleAnalytics?: string;
        facebookPixel?: string;
        customTracking?: string;
    };
    pricing: {
        model: 'free' | 'basic' | 'premium' | 'enterprise';
        detailedAnalysisPrice: string;
        currency: string;
    };
    languages: Language[];
    defaultLanguage: Language;
    tools: ToolId[];
}
export interface ThemeConfig {
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        sizes: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        full: string;
    };
}
export interface LicenseConfig {
    type: 'basic' | 'premium' | 'enterprise' | 'saas';
    price: number;
    currency: string;
    billing: 'one-time' | 'monthly' | 'yearly';
    features: {
        toolsIncluded: ToolId[];
        whiteLabel: boolean;
        customDomain: boolean;
        analytics: boolean;
        apiAccess: boolean;
        support: 'email' | 'priority' | 'dedicated';
        customization: 'basic' | 'advanced' | 'full';
    };
    limits: {
        monthlyTests?: number;
        users?: number;
        domains?: number;
    };
}
export interface PartnerMetrics {
    partnerId: string;
    period: {
        start: string;
        end: string;
    };
    usage: {
        totalTests: number;
        uniqueUsers: number;
        conversionRate: number;
        revenue: number;
    };
    performance: {
        avgLoadTime: number;
        uptime: number;
        errorRate: number;
    };
    tools: {
        toolId: ToolId;
        tests: number;
        conversions: number;
        revenue: number;
    }[];
}
