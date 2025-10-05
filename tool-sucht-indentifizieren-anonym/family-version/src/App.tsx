import React, { useState } from 'react';
import { FamilyLandingPage } from './components/FamilyLandingPage';
import { FamilyScreeningTest } from './components/FamilyScreeningTest';

function App() {
  const [testStarted, setTestStarted] = useState(false);

  return (
    <div className="min-h-screen">
      {testStarted ? (
        <FamilyScreeningTest />
      ) : (
        <FamilyLandingPage onStartTest={() => setTestStarted(true)} />
      )}
    </div>
  );
}

export default App;

