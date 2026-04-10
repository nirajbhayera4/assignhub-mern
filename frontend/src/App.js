import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import CookiePolicy from './pages/CookiePolicy';
import Guidelines from './pages/Guidelines';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import TermsOfService from './pages/TermsOfService';
import PostAssignment from './pages/PostAssignment';
import WorkerDashboard from './pages/WorkerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Navigation from './components/Navigation';
import './App.css';
import './styles/About.css';
import './styles/InfoPage.css';

function AppContent() {
  const [userRole, setUserRole] = useState('worker');

  return (
    <div className="App">
      <Navigation userRole={userRole} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/post-assignment" element={<PostAssignment />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/marketplace" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
