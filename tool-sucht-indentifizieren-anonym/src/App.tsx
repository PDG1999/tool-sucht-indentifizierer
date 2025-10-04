import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScreeningTest from './components/ScreeningTest';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication (in real app, this would check tokens, etc.)
    const authStatus = localStorage.getItem('counselor_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Update meta tags
    document.title = 'Lebensbalance-Check | SAMEBI Tools';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Professioneller Lebensbalance-Check für Psychologen. Wissenschaftlich validiertes Screening-Tool mit sofortigen Ergebnissen.'
    );
    
    console.log('Screening Tool initialized');
  }, []);

  const handleLogin = () => {
    // Simple demo login - in real app, this would be proper authentication
    localStorage.setItem('counselor_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('counselor_authenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<ScreeningTest />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout} />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                      Berater-Anmeldung
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                      Bitte melden Sie sich an, um auf das Dashboard zuzugreifen.
                    </p>
                    <button
                      onClick={handleLogin}
                      className="w-full bg-samebi-600 text-white py-2 px-4 rounded-lg hover:bg-samebi-700 transition-colors"
                    >
                      Demo-Anmeldung
                    </button>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Demo-Modus: Klicken Sie auf "Demo-Anmeldung" für den Zugang
                    </p>
                  </div>
                </div>
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
