import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SelfEmpathyPage from './pages/SelfEmpathyPage';
import SelfEmpathyStep2Page from './pages/SelfEmpathyStep2Page';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/self-empathy" element={<SelfEmpathyPage />} />
          <Route path="/self-empathy/step2" element={<SelfEmpathyStep2Page />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 