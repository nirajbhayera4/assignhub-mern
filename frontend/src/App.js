import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import WorkerDashboard from './pages/WorkerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Marketplace from './pages/Marketplace';
import Wallet from './pages/Wallet';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState('worker');

  return (
    <Router>
      <div className="App">
        <Navigation userRole={userRole} setUserRole={setUserRole} />
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
