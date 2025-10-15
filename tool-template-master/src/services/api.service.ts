import axios, { AxiosInstance } from 'axios';
import type { ApiResponse, LeadSubmission } from '../types/tool.types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://api.samebi.net',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Submit lead to backend
   */
  async submitLead(data: LeadSubmission): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await this.client.post('/leads', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LEAD_SUBMISSION_FAILED',
          message: 'Failed to submit lead',
          details: { error },
        },
      };
    }
  }

  /**
   * Track tool usage
   */
  async trackUsage(data: {
    toolId: string;
    language: string;
    sessionId: string;
    completionScore?: number;
  }): Promise<void> {
    try {
      await this.client.post('/tool-usage', data);
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  }

  /**
   * Create checkout session (for course purchases)
   */
  async createCheckoutSession(data: {
    email: string;
    priceId: string;
    sourceToolId: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse<{ sessionId: string; checkoutUrl: string }>> {
    try {
      const response = await this.client.post('/checkout/create-session', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CHECKOUT_FAILED',
          message: 'Failed to create checkout session',
          details: { error },
        },
      };
    }
  }
}

export const apiService = new ApiService();


