export { ContentLoader } from './content-loader.js';
export { WhiteLabelManager } from './white-label-manager.js';
export { TranslationManager, translationManager } from './translation-manager.js';
export * from './types.js';
// Version info
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
// Initialize and preload content on module import
import { ContentLoader } from './content-loader.js';
try {
    ContentLoader.preloadAllContent();
    console.log('🎯 SAMEBI Shared CMS initialized successfully');
    console.log(`📦 Version: ${VERSION}`);
    console.log(`🕒 Build Date: ${BUILD_DATE}`);
}
catch (error) {
    console.error('❌ Failed to initialize SAMEBI Shared CMS:', error);
}
// Export utility functions
export const utils = {
    /**
     * Get system status and health check
     */
    getSystemStatus: () => {
        const contentStats = ContentLoader.getContentStats();
        const contentValidation = ContentLoader.validateAllContent();
        return {
            version: VERSION,
            buildDate: BUILD_DATE,
            status: contentValidation.valid ? 'healthy' : 'error',
            content: {
                totalFiles: contentStats.length,
                valid: contentValidation.valid,
                errors: contentValidation.errors
            },
            cache: {
                contentCacheSize: ContentLoader['contentCache']?.size || 0
            }
        };
    },
    /**
     * Clear all caches
     */
    clearAllCaches: () => {
        ContentLoader.clearCache();
        console.log('🧹 All caches cleared');
    },
    /**
     * Validate entire system
     */
    validateSystem: () => {
        const contentValidation = ContentLoader.validateAllContent();
        return {
            content: contentValidation,
            overall: contentValidation.valid
        };
    }
};
