import React from 'react';
import useTranslation from '@/hooks/useTranslation';

const EmailCapture: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('email.title')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('email.subtitle')}
          </p>
          
          {/* Placeholder for actual email capture implementation */}
          <div className="text-center py-8">
            <p className="text-gray-500">Email-Capture-Implementierung folgt...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
