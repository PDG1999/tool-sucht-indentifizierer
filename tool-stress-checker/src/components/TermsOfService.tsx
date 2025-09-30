import React from 'react';
import useTranslation from '@/hooks/useTranslation';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('nav.terms')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Nutzungsbedingungen-Implementierung folgt...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
