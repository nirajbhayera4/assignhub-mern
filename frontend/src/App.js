import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
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
import { isAuthenticated } from './services/auth';
import './App.css';
import './styles/About.css';
import './styles/InfoPage.css';

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}

function AppContent() {
  const [userRole, setUserRole] = useState('worker');
  const location = useLocation();
  const hideNavigation = ['/login', '/register', '/forgot-password'].includes(
    location.pathname
  );

  return (
    <div className="App">
      {!hideNavigation && (
        <Navigation userRole={userRole} setUserRole={setUserRole} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/marketplace" replace />
            ) : (
              <RoleSelection />
            )
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/role-selection"
          element={
            <PublicOnlyRoute>
              <RoleSelection />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-assignment"
          element={
            <ProtectedRoute>
              <PostAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
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
