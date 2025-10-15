import { useState, useEffect } from 'react';
import { configService } from '../services/config.service';
import type { ToolConfig } from '../types/tool.types';

interface UseToolConfigReturn {
  config: ToolConfig | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to load and manage tool configuration
 */
export const useToolConfig = (toolId: string): UseToolConfigReturn => {
  const [config, setConfig] = useState<ToolConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedConfig = await configService.loadConfig(toolId);

        if (!isMounted) return;

        if (loadedConfig) {
          setConfig(loadedConfig);
        } else {
          setError('Failed to load tool configuration');
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [toolId]);

  return { config, loading, error };
};


