import { WhiteLabelConfig, ThemeConfig } from './types.js';
export declare class WhiteLabelManager {
    private static configCache;
    private static themeCache;
    private static basePath;
    private static themePath;
    static loadPartnerConfig(partnerId: string): WhiteLabelConfig;
    static loadDefaultConfig(): WhiteLabelConfig;
    static loadTheme(themeName: string): ThemeConfig;
    static generateCSSVariables(config: WhiteLabelConfig, theme?: ThemeConfig): string;
    static getPartnerDomain(config: WhiteLabelConfig): string;
    static isFeatureEnabled(config: WhiteLabelConfig, feature: keyof WhiteLabelConfig['features']): boolean;
    static createPartnerConfig(partnerId: string, template: 'basic' | 'premium' | 'enterprise'): WhiteLabelConfig;
    static savePartnerConfig(config: WhiteLabelConfig): void;
    static getAllPartners(): string[];
    static getPartnerStats(): {
        partnerId: string;
        tools: number;
        languages: number;
        lastUpdated: string;
    }[];
    private static validateConfig;
    static validateAllConfigs(): {
        valid: boolean;
        errors: string[];
    };
}
