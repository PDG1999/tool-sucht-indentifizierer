export { ContentLoader } from './content-loader.js';
export { WhiteLabelManager } from './white-label-manager.js';
export { TranslationManager, translationManager } from './translation-manager.js';
export * from './types.js';
export declare const VERSION = "1.0.0";
export declare const BUILD_DATE: string;
export declare const utils: {
    /**
     * Get system status and health check
     */
    getSystemStatus: () => {
        version: string;
        buildDate: string;
        status: string;
        content: {
            totalFiles: number;
            valid: boolean;
            errors: string[];
        };
        cache: {
            contentCacheSize: number;
        };
    };
    /**
     * Clear all caches
     */
    clearAllCaches: () => void;
    /**
     * Validate entire system
     */
    validateSystem: () => {
        content: {
            valid: boolean;
            errors: string[];
        };
        overall: boolean;
    };
};
