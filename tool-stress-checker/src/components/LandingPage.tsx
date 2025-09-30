import React from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '@/hooks/useTranslation';
import { trackStressTestStarted } from '@/utils/analytics';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  const handleStartTest = () => {
    trackStressTestStarted();
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="SAMEBI"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">SAMEBI</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  {t('nav.home')}
                </Link>
                <Link to="/privacy" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  {t('nav.privacy')}
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  {t('nav.terms')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{t('landing.heroTitle')}</span>{' '}
                  <span className="block text-blue-600 xl:inline">{t('landing.heroSubtitle')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {t('landing.heroDescription')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/test"
                      onClick={handleStartTest}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      {t('landing.startTestButton')}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/hero-image.jpg"
            alt="Stress Assessment"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              {t('landing.heroSubtitle')}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.heroTitle')}
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {t('landing.features.scientific')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Basierend auf etablierten psychologischen Bewertungsmethoden und wissenschaftlichen Standards.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {t('landing.features.immediate')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Erhalten Sie Ihre Bewertung und Empfehlungen sofort nach Abschluss des Tests.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {t('landing.features.personalized')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Maßgeschneiderte Empfehlungen basierend auf Ihren individuellen Antworten und Ergebnissen.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {t('landing.features.confidential')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Ihre Daten werden sicher behandelt und niemals an Dritte weitergegeben.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Bereit für Ihren Stress-Test?</span>
            <span className="block text-blue-600">Starten Sie jetzt in nur 5 Minuten.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/test"
                onClick={handleStartTest}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                {t('landing.startTestButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="SAMEBI" />
              <span className="ml-2 text-lg font-semibold text-gray-900">SAMEBI</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
                {t('nav.privacy')}
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-900">
                {t('nav.terms')}
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2024 SAMEBI. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
