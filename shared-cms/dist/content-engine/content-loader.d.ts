import { ToolContent, Language, ToolId } from './types.js';
export declare class ContentLoader {
    private static contentCache;
    private static basePath;
    static loadContent(toolId: ToolId, language: Language): ToolContent;
    static preloadAllContent(): void;
    static clearCache(): void;
    static reloadContent(toolId: ToolId, language: Language): ToolContent;
    private static validateContent;
    static getAvailableTools(): ToolId[];
    static getAvailableLanguages(): Language[];
    static getContentStats(): {
        tool: ToolId;
        language: Language;
        size: number;
        lastModified: string;
    }[];
    static validateAllContent(): {
        valid: boolean;
        errors: string[];
    };
}
