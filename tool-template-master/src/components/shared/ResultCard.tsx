import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ToolResult } from '../../types/tool.types';

interface ResultCardProps {
  result: ToolResult;
  onDownloadPdf?: () => void;
  onShare?: () => void;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onDownloadPdf,
  onShare,
  className = '',
}) => {
  const { t } = useTranslation();

  const getLevelColor = (level: ToolResult['level']) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className={`card ${className}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {t('result.title')}
      </h2>

      {/* Score */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-primary-600 mb-2">
          {result.score}
        </div>
        <p className="text-gray-600">{t('result.score', { score: result.score })}</p>
      </div>

      {/* Level Badge */}
      <div className="flex justify-center mb-8">
        <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold border-2 ${getLevelColor(result.level)}`}>
          {t(`result.level.${result.level}`)}
        </span>
      </div>

      {/* Result Label & Description */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">{result.label}</h3>
        <p className="text-gray-700 leading-relaxed">{result.description}</p>
      </div>

      {/* Recommendations */}
      {result.recommendations && (
        <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Empfehlungen
          </h4>
          <p className="text-gray-700">{result.recommendations}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onDownloadPdf && (
          <button onClick={onDownloadPdf} className="btn-primary flex-1">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('result.downloadPdf')}
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className="btn-secondary flex-1">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t('result.shareResult')}
          </button>
        )}
      </div>
    </div>
  );
};


