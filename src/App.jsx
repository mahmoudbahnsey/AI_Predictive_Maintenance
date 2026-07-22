import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import VoltIQBot from './components/chatbot/VoltIQBot';

import './styles/App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import OperationsPage from './pages/operations/OperationsPage';
import SystemsPage from './pages/systems/SystemsPage';
import AlertsPage from './pages/alerts/AlertsPage';
import ReportsPage from './pages/reports/ReportsPage';
import AiTrainingPage from './pages/ai-training/AiTrainingPage';
import SettingsPage from './pages/settings/SettingsPage';
import UsersPage from './pages/users/UsersPage';
import DataPage from './pages/data/DataPage';

const protectedPages = [
  'system-time',
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/systems"
            element={
              <ProtectedRoute>
                <SystemsPage />
              </ProtectedRoute>
            }
          />





          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/data" element={<DataPage />} />

          <Route
            path="/ai-training"
            element={
              <ProtectedRoute requiredRole="admin">
                <AiTrainingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />


          {protectedPages.map((page) => (
            <Route
              key={page}
              path={`/${page}`}
              element={
                <ProtectedRoute>
                  <OperationsPage page={page} />
                </ProtectedRoute>
              }
            />
          ))}

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Global VoltIQ Bot - automatically handles protected route visibility */}
        <VoltIQBot />
        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
