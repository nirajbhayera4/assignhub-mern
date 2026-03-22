import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import WorkerDashboard from './pages/WorkerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Marketplace from './pages/Marketplace';
import Wallet from './pages/Wallet';
import Navigation from './components/Navigation';
import { isAuthenticated } from './services/auth';
import './App.css';

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AppContent() {
  const [userRole, setUserRole] = useState('worker');
  const location = useLocation();
  const hideNavigation = location.pathname === '/login';

  return (
    <div className="App">
      {!hideNavigation && (
        <Navigation userRole={userRole} setUserRole={setUserRole} />
      )}
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
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
