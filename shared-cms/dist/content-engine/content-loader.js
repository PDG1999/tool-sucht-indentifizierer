import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class ContentLoader {
    static contentCache = new Map();
    static basePath = join(__dirname, '..', 'content', 'tools');
    static loadContent(toolId, language) {
        const cacheKey = `${toolId}-${language}`;
        if (this.contentCache.has(cacheKey)) {
            return this.contentCache.get(cacheKey);
        }
        const contentPath = join(this.basePath, toolId, `${language}.json`);
        if (!existsSync(contentPath)) {
            console.warn(`Content file not found: ${contentPath}, falling back to Spanish`);
            if (language !== 'es') {
                return this.loadContent(toolId, 'es');
            }
            throw new Error(`No content found for ${toolId} in any language`);
        }
        try {
            const contentRaw = readFileSync(contentPath, 'utf-8');
            const content = JSON.parse(contentRaw);
            // Validate content structure
            this.validateContent(content, toolId, language);
            this.contentCache.set(cacheKey, content);
            return content;
        }
        catch (error) {
            console.error(`Error loading content for ${toolId}-${language}:`, error);
            throw new Error(`Failed to load content for ${toolId} in ${language}`);
        }
    }
    static preloadAllContent() {
        const tools = ['stress-test', 'burnout-test', 'personality-test'];
        const languages = ['es', 'de', 'en'];
        for (const tool of tools) {
            for (const language of languages) {
                try {
                    this.loadContent(tool, language);
                    console.log(`✅ Preloaded ${tool}-${language}`);
                }
                catch (error) {
                    console.warn(`⚠️  Failed to preload ${tool}-${language}:`, error);
                }
            }
        }
    }
    static clearCache() {
        this.contentCache.clear();
    }
    static reloadContent(toolId, language) {
        const cacheKey = `${toolId}-${language}`;
        this.contentCache.delete(cacheKey);
        return this.loadContent(toolId, language);
    }
    static validateContent(content, toolId, language) {
        if (!content.toolId || content.toolId !== toolId) {
            throw new Error(`Invalid toolId in content file: expected ${toolId}, got ${content.toolId}`);
        }
        if (!content.version) {
            throw new Error(`Missing version in content file for ${toolId}-${language}`);
        }
        // Validate required sections
        const requiredSections = ['meta', 'nav', 'landing', 'test', 'results', 'common', 'footer'];
        for (const section of requiredSections) {
            if (!content[section]) {
                throw new Error(`Missing required section '${section}' in ${toolId}-${language}`);
            }
        }
        // Validate questions array
        if (!Array.isArray(content.test.questions) || content.test.questions.length === 0) {
            throw new Error(`Invalid or empty questions array in ${toolId}-${language}`);
        }
        // Validate recommendations arrays
        const levels = ['low', 'moderate', 'high', 'critical'];
        for (const level of levels) {
            if (!Array.isArray(content.results.recommendations[level]) ||
                content.results.recommendations[level].length === 0) {
                throw new Error(`Invalid recommendations array for level '${level}' in ${toolId}-${language}`);
            }
        }
    }
    static getAvailableTools() {
        return ['stress-test', 'burnout-test', 'personality-test', 'content-generator', 'rate-calculator', 'location-analyzer'];
    }
    static getAvailableLanguages() {
        return ['es', 'de', 'en'];
    }
    static getContentStats() {
        const stats = [];
        for (const tool of this.getAvailableTools()) {
            for (const language of this.getAvailableLanguages()) {
                const contentPath = join(this.basePath, tool, `${language}.json`);
                if (existsSync(contentPath)) {
                    try {
                        const stat = require('fs').statSync(contentPath);
                        stats.push({
                            tool,
                            language,
                            size: stat.size,
                            lastModified: stat.mtime.toISOString()
                        });
                    }
                    catch (error) {
                        console.warn(`Error getting stats for ${tool}-${language}:`, error);
                    }
                }
            }
        }
        return stats;
    }
    static validateAllContent() {
        const errors = [];
        for (const tool of this.getAvailableTools()) {
            for (const language of this.getAvailableLanguages()) {
                try {
                    this.loadContent(tool, language);
                }
                catch (error) {
                    errors.push(`${tool}-${language}: ${error}`);
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
