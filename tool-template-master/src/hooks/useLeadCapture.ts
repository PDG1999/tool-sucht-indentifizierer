import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { LeadSubmission, Language } from '../types/tool.types';

interface UseLeadCaptureReturn {
  submitLead: (
    email: string,
    toolId: string,
    language: Language,
    score: number,
    metadata?: Record<string, unknown>
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook to handle lead capture and submission
 */
export const useLeadCapture = (): UseLeadCaptureReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLead = async (
    email: string,
    toolId: string,
    language: Language,
    score: number,
    metadata?: Record<string, unknown>
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const leadData: LeadSubmission = {
        email,
        sourceToolId: toolId,
        sourceLanguage: language,
        completionScore: score,
        userData: {},
        metadata,
      };

      const response = await apiService.submitLead(leadData);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to submit lead');
      }

      setSuccess(true);

      // Track in analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_captured', {
          tool_id: toolId,
          language,
          score,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitLead,
    loading,
    error,
    success,
  };
};

