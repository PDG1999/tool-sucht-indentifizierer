import React from 'react';
import type { Question, QuestionOption, Language } from '../../types/tool.types';

interface QuestionCardProps {
  question: Question;
  value?: string | number | string[];
  language: Language;
  onChange: (value: string | number | string[]) => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  language,
  onChange,
  className = '',
}) => {
  const questionText = question.text[language];

  const renderInput = () => {
    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-500 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-primary-600"
                  required={question.required}
                />
                <span className="ml-3 text-gray-900">{option.label[language]}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={question.options?.[0]?.value || 0}
              max={question.options?.[question.options.length - 1]?.value || 10}
              value={value as number || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              {question.options?.map((option) => (
                <span key={option.id}>{option.label[language]}</span>
              ))}
            </div>
            <div className="text-center text-2xl font-bold text-primary-600">
              {value || 0}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            rows={4}
            required={question.required}
            placeholder="Ihre Antwort..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{questionText}</h3>
      {renderInput()}
    </div>
  );
};


