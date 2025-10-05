import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ScreeningTest from './components/ScreeningTest';
import ShortScreeningTest from './components/ShortScreeningTest';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DashboardLayout from './components/DashboardLayout';
import SupervisorDashboard from './components/SupervisorDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    // Check for authentication
    const authStatus = localStorage.getItem('counselor_authenticated');
    const supervisorStatus = localStorage.getItem('is_supervisor');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    if (supervisorStatus === 'true') {
      setIsSupervisor(true);
    }

    // Update meta tags
    document.title = 'Lebensbalance-Check | SAMEBI Tools';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 
      'Professioneller Lebensbalance-Check für Psychologen. Wissenschaftlich validiertes Screening-Tool mit sofortigen Ergebnissen.'
    );
    
    console.log('Screening Tool initialized');
  }, []);

  const handleLogin = (supervisor = false) => {
    localStorage.setItem('counselor_authenticated', 'true');
    setIsAuthenticated(true);
    if (supervisor) {
      localStorage.setItem('is_supervisor', 'true');
      setIsSupervisor(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('counselor_authenticated');
    localStorage.removeItem('is_supervisor');
    setIsAuthenticated(false);
    setIsSupervisor(false);
  };

  // Login Component
  const LoginComponent = ({ type }: { type: 'counselor' | 'supervisor' }) => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {type === 'supervisor' ? 'Supervisor-Anmeldung' : 'Berater-Anmeldung'}
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Bitte melden Sie sich an, um auf das Dashboard zuzugreifen.
          </p>
          <button
            onClick={() => handleLogin(type === 'supervisor')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Demo-Anmeldung
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo-Modus: Klicken Sie auf "Demo-Anmeldung" für den Zugang
          </p>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<ScreeningTest />} />
          <Route path="/schnellcheck" element={<ShortScreeningTest onUpgrade={() => window.location.href = '/test'} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Counselor Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout} />
              ) : (
                <LoginComponent type="counselor" />
              )
            } 
          />
          
          {/* Supervisor Dashboard */}
          <Route 
            path="/supervisor" 
            element={
              isAuthenticated && isSupervisor ? (
                <SupervisorDashboard />
              ) : (
                <LoginComponent type="supervisor" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
