import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { updateMetaTags } from '@/utils/meta';
import { currentConfig } from '@/config/language';
import useTranslation from '@/hooks/useTranslation';

// Components (to be created)
import LandingPage from '@/components/LandingPage';
import StressTest from '@/components/StressTest';
import Results from '@/components/Results';
import EmailCapture from '@/components/EmailCapture';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    // Update meta tags based on current language
    updateMetaTags();
    
    console.log(`App initialized for language: ${currentConfig.language.toUpperCase()}`);
    console.log(`API URL: ${currentConfig.apiUrl}`);
    console.log(`GA Tracking ID: ${currentConfig.gaTrackingId}`);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<StressTest />} />
          <Route path="/results" element={<Results />} />
          <Route path="/email" element={<EmailCapture />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        
        {/* Language indicator for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded text-sm font-mono">
            {currentConfig.language.toUpperCase()}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
