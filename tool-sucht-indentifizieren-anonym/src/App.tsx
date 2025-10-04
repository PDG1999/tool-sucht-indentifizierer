import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScreeningTest from '@/components/ScreeningTest';
import LandingPage from '@/components/LandingPage';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';

function App() {
  useEffect(() => {
    // Update meta tags
    document.title = 'Lebensbalance-Check | SAMEBI Tools';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Professioneller Lebensbalance-Check für Psychologen. Wissenschaftlich validiertes Screening-Tool mit sofortigen Ergebnissen.'
    );
    
    console.log('Screening Tool initialized');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<ScreeningTest />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
