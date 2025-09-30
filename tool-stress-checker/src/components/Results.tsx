import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '@/hooks/useTranslation';

const Results: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('results.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t('results.subtitle')}
          </p>
          
          {/* Placeholder for actual results implementation */}
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Ergebnisse-Implementierung folgt...</p>
            <Link
              to="/email"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {t('results.downloadPdf')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
