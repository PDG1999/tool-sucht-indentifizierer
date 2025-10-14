import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../components/shared/ProgressBar';
import { QuestionCard } from '../components/shared/QuestionCard';
import { ResultCard } from '../components/shared/ResultCard';
import { LeadCapture } from '../components/forms/LeadCapture';
import type {
  ToolConfig,
  ToolSession,
  Answer,
  ToolResult,
  Language,
} from '../types/tool.types';

interface AssessmentTemplateProps {
  config: ToolConfig;
  language: Language;
  onLeadCapture?: (email: string) => Promise<void>;
  onComplete?: (session: ToolSession) => void;
}

type AssessmentStep = 'questions' | 'lead-capture' | 'result';

export const AssessmentTemplate: React.FC<AssessmentTemplateProps> = ({
  config,
  language,
  onLeadCapture,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [session, setSession] = useState<ToolSession>({
    id: crypto.randomUUID(),
    toolId: config.id,
    language,
    startedAt: new Date(),
    answers: {},
  });
  const [result, setResult] = useState<ToolResult | null>(null);

  const currentQuestion = config.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;
  const totalQuestions = config.questions.length;

  // Calculate score based on scoring config
  const calculateScore = (): ToolResult => {
    let totalScore = 0;
    let maxScore = 0;

    // Sum up scores from answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = config.questions.find((q) => q.id === questionId);
      if (!question) return;

      if (question.type === 'single' || question.type === 'scale') {
        const option = question.options?.find(
          (opt) => opt.value === answer.value
        );
        if (option?.score !== undefined) {
          totalScore += option.score;
        }
      }

      // Calculate max possible score
      const maxQuestionScore = Math.max(
        ...(question.options?.map((opt) => opt.score || 0) || [0])
      );
      maxScore += maxQuestionScore;
    });

    // Normalize to 0-100 scale
    const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Determine level based on thresholds
    const threshold = config.scoring.thresholds?.find(
      (t) => normalizedScore >= t.min && normalizedScore <= t.max
    );

    return {
      score: normalizedScore,
      level: threshold?.level || 'medium',
      label: threshold?.label[language] || '',
      description: threshold?.description[language] || '',
      recommendations: threshold?.recommendations?.[language],
    };
  };

  // Handle answer change
  const handleAnswerChange = (value: string | number | string[]) => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      value,
      answeredAt: new Date(),
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  // Handle next question
  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate result
      const calculatedResult = calculateScore();
      setResult(calculatedResult);

      // Update session
      const completedSession: ToolSession = {
        ...session,
        answers,
        completedAt: new Date(),
        score: calculatedResult.score,
        result: calculatedResult,
      };
      setSession(completedSession);

      // Check if lead capture is enabled
      if (config.leadCapture.enabled && config.leadCapture.trigger === 'before_result') {
        setCurrentStep('lead-capture');
      } else {
        setCurrentStep('result');
        onComplete?.(completedSession);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Handle previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle lead capture
  const handleLeadSubmit = async (email: string) => {
    try {
      await onLeadCapture?.(email);
      setCurrentStep('result');
      
      if (session) {
        onComplete?.(session);
      }
    } catch (error) {
      console.error('Lead capture failed:', error);
      throw error;
    }
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = answers[currentQuestion?.id]?.value !== undefined;

  // Track analytics
  useEffect(() => {
    // Track tool started
    if (config.analytics?.trackingId) {
      // Google Analytics tracking would go here
      console.log('Tool started:', config.id);
    }
  }, [config.id, config.analytics]);

  // Render different steps
  const renderContent = () => {
    switch (currentStep) {
      case 'questions':
        return (
          <div className="max-w-3xl mx-auto">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
              className="mb-8"
            />

            <QuestionCard
              question={currentQuestion}
              value={answers[currentQuestion.id]?.value}
              language={language}
              onChange={handleAnswerChange}
              className="mb-8"
            />

            <div className="flex gap-4">
              {currentQuestionIndex > 0 && (
                <button onClick={handleBack} className="btn-secondary">
                  {t('common.back')}
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentQuestion.required && !isCurrentQuestionAnswered}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastQuestion ? t('common.finish') : t('common.next')}
              </button>
            </div>
          </div>
        );

      case 'lead-capture':
        return (
          <LeadCapture
            onSubmit={handleLeadSubmit}
            className="max-w-lg mx-auto"
          />
        );

      case 'result':
        return result ? (
          <ResultCard
            result={result}
            onDownloadPdf={() => {
              // PDF generation would go here
              console.log('Download PDF:', result);
            }}
            onShare={() => {
              // Share functionality would go here
              console.log('Share result:', result);
            }}
            className="max-w-3xl mx-auto"
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.metadata.title[language]}
          </h1>
          <p className="text-xl text-gray-600">
            {config.metadata.description[language]}
          </p>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

