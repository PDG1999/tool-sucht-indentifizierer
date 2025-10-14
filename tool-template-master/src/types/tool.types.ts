// Tool Types - Core Type Definitions for SAMEBI Tools

export type Language = 'de' | 'en' | 'es';

export type ToolType = 'assessment' | 'calculator' | 'quiz' | 'analyzer';

export interface LocalizedString {
  de: string;
  en: string;
  es: string;
}

export interface ToolMetadata {
  title: LocalizedString;
  description: LocalizedString;
  keywords: Record<Language, string[]>;
}

export interface Question {
  id: string;
  text: LocalizedString;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: QuestionOption[];
  validation?: ValidationRule;
  required?: boolean;
}

export interface QuestionOption {
  id: string;
  label: LocalizedString;
  value: number | string;
  score?: number;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'regex' | 'email' | 'required';
  value?: number | string;
  message?: LocalizedString;
}

export interface ScoringConfig {
  type: 'sum' | 'average' | 'weighted' | 'custom';
  thresholds?: ScoreThreshold[];
  formula?: string;
}

export interface ScoreThreshold {
  min: number;
  max: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  label: LocalizedString;
  description: LocalizedString;
  recommendations?: LocalizedString;
}

export interface LeadCaptureConfig {
  enabled: boolean;
  trigger: 'after_completion' | 'before_result' | 'optional';
  incentive?: LocalizedString;
  fields?: LeadField[];
  upsell?: UpsellConfig;
}

export interface LeadField {
  name: string;
  type: 'email' | 'text' | 'tel' | 'checkbox';
  label: LocalizedString;
  required: boolean;
  validation?: ValidationRule;
}

export interface UpsellConfig {
  enabled: boolean;
  product: string;
  price: number;
  currency: string;
  title: LocalizedString;
  description: LocalizedString;
  cta: LocalizedString;
}

export interface AnalyticsConfig {
  trackingId?: string;
  events?: AnalyticsEvent[];
  customDimensions?: Record<string, string>;
}

export interface AnalyticsEvent {
  name: string;
  trigger: 'tool_started' | 'question_answered' | 'tool_completed' | 'lead_captured' | 'result_viewed';
  properties?: Record<string, string | number>;
}

export interface ToolConfig {
  id: string;
  type: ToolType;
  metadata: ToolMetadata;
  questions: Question[];
  scoring: ScoringConfig;
  leadCapture: LeadCaptureConfig;
  analytics?: AnalyticsConfig;
  branding?: BrandingConfig;
}

export interface BrandingConfig {
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  customStyles?: Record<string, string>;
}

// Runtime Types
export interface ToolSession {
  id: string;
  toolId: string;
  language: Language;
  startedAt: Date;
  completedAt?: Date;
  answers: Record<string, Answer>;
  score?: number;
  result?: ToolResult;
}

export interface Answer {
  questionId: string;
  value: string | number | string[];
  answeredAt: Date;
}

export interface ToolResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  description: string;
  recommendations?: string;
}

// API Types
export interface LeadSubmission {
  email: string;
  sourceToolId: string;
  sourceLanguage: Language;
  completionScore: number;
  userData: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

