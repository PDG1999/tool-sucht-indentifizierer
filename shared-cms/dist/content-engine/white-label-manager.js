import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class WhiteLabelManager {
    static configCache = new Map();
    static themeCache = new Map();
    // private static licenseCache = new Map<string, LicenseConfig>(); // Reserved for future use
    static basePath = join(__dirname, '..', 'white-label');
    static themePath = join(__dirname, '..', 'themes');
    static loadPartnerConfig(partnerId) {
        if (this.configCache.has(partnerId)) {
            return this.configCache.get(partnerId);
        }
        const configPath = join(this.basePath, 'partners', `${partnerId}.json`);
        if (!existsSync(configPath)) {
            console.warn(`Partner config not found: ${partnerId}, using default`);
            return this.loadDefaultConfig();
        }
        try {
            const configRaw = readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configRaw);
            this.validateConfig(config);
            this.configCache.set(partnerId, config);
            return config;
        }
        catch (error) {
            console.error(`Error loading partner config for ${partnerId}:`, error);
            return this.loadDefaultConfig();
        }
    }
    static loadDefaultConfig() {
        const defaultPath = join(this.basePath, 'default.json');
        try {
            const configRaw = readFileSync(defaultPath, 'utf-8');
            return JSON.parse(configRaw);
        }
        catch (error) {
            console.error('Error loading default config:', error);
            throw new Error('Failed to load default white-label configuration');
        }
    }
    static loadTheme(themeName) {
        if (this.themeCache.has(themeName)) {
            return this.themeCache.get(themeName);
        }
        const themePath = join(this.themePath, themeName, 'theme.json');
        if (!existsSync(themePath)) {
            console.warn(`Theme not found: ${themeName}, using default`);
            return this.loadTheme('default');
        }
        try {
            const themeRaw = readFileSync(themePath, 'utf-8');
            const theme = JSON.parse(themeRaw);
            this.themeCache.set(themeName, theme);
            return theme;
        }
        catch (error) {
            console.error(`Error loading theme ${themeName}:`, error);
            return this.loadTheme('default');
        }
    }
    static generateCSSVariables(config, theme) {
        const colors = config.branding.colors;
        const fonts = config.branding.fonts;
        let css = ':root {\n';
        // Colors
        css += `  --color-primary: ${colors.primary};\n`;
        css += `  --color-secondary: ${colors.secondary};\n`;
        css += `  --color-accent: ${colors.accent};\n`;
        css += `  --color-success: ${colors.success};\n`;
        css += `  --color-warning: ${colors.warning};\n`;
        css += `  --color-error: ${colors.error};\n`;
        // Fonts
        css += `  --font-heading: ${fonts.heading};\n`;
        css += `  --font-body: ${fonts.body};\n`;
        // Theme overrides
        if (theme) {
            css += `  --theme-background: ${theme.colors.background};\n`;
            css += `  --theme-surface: ${theme.colors.surface};\n`;
            css += `  --theme-text: ${theme.colors.text};\n`;
            // Typography
            css += `  --theme-font-heading: ${theme.typography.headingFont};\n`;
            css += `  --theme-font-body: ${theme.typography.bodyFont};\n`;
            // Spacing
            css += `  --spacing-xs: ${theme.spacing.xs};\n`;
            css += `  --spacing-sm: ${theme.spacing.sm};\n`;
            css += `  --spacing-md: ${theme.spacing.md};\n`;
            css += `  --spacing-lg: ${theme.spacing.lg};\n`;
            css += `  --spacing-xl: ${theme.spacing.xl};\n`;
            // Border radius
            css += `  --radius-sm: ${theme.borderRadius.sm};\n`;
            css += `  --radius-md: ${theme.borderRadius.md};\n`;
            css += `  --radius-lg: ${theme.borderRadius.lg};\n`;
            css += `  --radius-full: ${theme.borderRadius.full};\n`;
        }
        css += '}\n';
        return css;
    }
    static getPartnerDomain(config) {
        if (config.domain) {
            return config.domain;
        }
        if (config.subdomain) {
            return `${config.subdomain}.samebi.net`;
        }
        return 'samebi.net';
    }
    static isFeatureEnabled(config, feature) {
        return config.features[feature] || false;
    }
    static createPartnerConfig(partnerId, template) {
        const templatePath = join(this.basePath, 'templates', `${template}.json`);
        try {
            const templateRaw = readFileSync(templatePath, 'utf-8');
            const templateConfig = JSON.parse(templateRaw);
            // Customize for partner
            templateConfig.partnerId = partnerId;
            templateConfig.partnerName = partnerId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return templateConfig;
        }
        catch (error) {
            console.error(`Error creating partner config from template ${template}:`, error);
            throw new Error(`Failed to create partner config from template ${template}`);
        }
    }
    static savePartnerConfig(config) {
        const configPath = join(this.basePath, 'partners', `${config.partnerId}.json`);
        try {
            this.validateConfig(config);
            writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
            this.configCache.set(config.partnerId, config);
            console.log(`✅ Saved partner config: ${config.partnerId}`);
        }
        catch (error) {
            console.error(`Error saving partner config for ${config.partnerId}:`, error);
            throw new Error(`Failed to save partner config for ${config.partnerId}`);
        }
    }
    static getAllPartners() {
        try {
            const partnersDir = join(this.basePath, 'partners');
            if (!existsSync(partnersDir)) {
                return [];
            }
            const files = require('fs').readdirSync(partnersDir);
            return files
                .filter((file) => file.endsWith('.json'))
                .map((file) => file.replace('.json', ''));
        }
        catch (error) {
            console.error('Error reading partners directory:', error);
            return [];
        }
    }
    static getPartnerStats() {
        const partners = this.getAllPartners();
        return partners.map(partnerId => {
            try {
                const config = this.loadPartnerConfig(partnerId);
                const configPath = join(this.basePath, 'partners', `${partnerId}.json`);
                const stat = require('fs').statSync(configPath);
                return {
                    partnerId,
                    tools: config.tools.length,
                    languages: config.languages.length,
                    lastUpdated: stat.mtime.toISOString()
                };
            }
            catch (error) {
                return {
                    partnerId,
                    tools: 0,
                    languages: 0,
                    lastUpdated: 'unknown'
                };
            }
        });
    }
    static validateConfig(config) {
        if (!config.partnerId) {
            throw new Error('Missing partnerId in white-label config');
        }
        if (!config.partnerName) {
            throw new Error('Missing partnerName in white-label config');
        }
        if (!config.branding || !config.branding.companyName) {
            throw new Error('Missing branding information in white-label config');
        }
        if (!config.contact || !config.contact.email) {
            throw new Error('Missing contact information in white-label config');
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(config.contact.email)) {
            throw new Error('Invalid email format in contact information');
        }
        // Validate colors are valid hex codes
        const colorRegex = /^#[0-9A-F]{6}$/i;
        const colors = config.branding.colors;
        for (const [key, value] of Object.entries(colors)) {
            if (!colorRegex.test(value)) {
                throw new Error(`Invalid color format for ${key}: ${value}`);
            }
        }
        // Validate languages
        const validLanguages = ['es', 'de', 'en'];
        for (const lang of config.languages) {
            if (!validLanguages.includes(lang)) {
                throw new Error(`Invalid language: ${lang}`);
            }
        }
        // Validate default language is in languages array
        if (!config.languages.includes(config.defaultLanguage)) {
            throw new Error('Default language must be included in languages array');
        }
    }
    static validateAllConfigs() {
        const errors = [];
        const partners = this.getAllPartners();
        for (const partnerId of partners) {
            try {
                this.loadPartnerConfig(partnerId);
            }
            catch (error) {
                errors.push(`${partnerId}: ${error}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
