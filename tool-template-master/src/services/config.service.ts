import type { ToolConfig } from '../types/tool.types';

class ConfigService {
  private cache: Map<string, ToolConfig> = new Map();

  /**
   * Load tool configuration
   * In production, this would fetch from shared-cms or API
   */
  async loadConfig(toolId: string): Promise<ToolConfig | null> {
    // Check cache first
    if (this.cache.has(toolId)) {
      return this.cache.get(toolId)!;
    }

    try {
      // Try to load from shared-cms (development)
      const response = await fetch(`/configs/${toolId}.json`);
      
      if (!response.ok) {
        console.error(`Failed to load config for ${toolId}`);
        return null;
      }

      const config: ToolConfig = await response.json();
      
      // Validate config
      if (!this.validateConfig(config)) {
        console.error('Invalid tool configuration');
        return null;
      }

      // Cache it
      this.cache.set(toolId, config);
      
      return config;
    } catch (error) {
      console.error('Error loading tool config:', error);
      return null;
    }
  }

  /**
   * Validate tool configuration
   */
  private validateConfig(config: any): config is ToolConfig {
    return (
      config &&
      typeof config.id === 'string' &&
      typeof config.type === 'string' &&
      config.metadata &&
      Array.isArray(config.questions) &&
      config.questions.length > 0 &&
      config.scoring &&
      config.leadCapture
    );
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const configService = new ConfigService();


