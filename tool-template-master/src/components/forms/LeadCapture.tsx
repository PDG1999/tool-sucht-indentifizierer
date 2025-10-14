import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  email: z.string().email('validation.email'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'validation.required',
  }),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureProps {
  onSubmit: (email: string) => Promise<void>;
  className?: string;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  onSubmit,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmitForm = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(data.email);
    } catch (err) {
      setError(t('leadCapture.error'));
      console.error('Lead capture error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`card max-w-md mx-auto ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t('leadCapture.title')}
      </h2>
      <p className="text-gray-600 mb-6">{t('leadCapture.subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('leadCapture.emailLabel')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder={t('leadCapture.emailPlaceholder')}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{t(errors.email.message!)}</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            {...register('privacy')}
            type="checkbox"
            id="privacy"
            className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="privacy" className="ml-3 text-sm text-gray-700">
            {t('leadCapture.privacy')}
          </label>
        </div>
        {errors.privacy && (
          <p className="text-sm text-red-600">{t(errors.privacy.message!)}</p>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('leadCapture.sending') : t('leadCapture.submit')}
        </button>
      </form>
    </div>
  );
};

