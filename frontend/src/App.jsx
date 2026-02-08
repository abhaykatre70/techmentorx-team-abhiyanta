import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IndiaMap from './pages/IndiaMap';
import AdminPanel from './pages/AdminPanel';
import DonationsPage from './pages/DonationsPage';
import Analytics from './pages/Analytics';
import NGOsPage from './pages/NGOs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Global Background Animation */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
            <dotlottie-wc
              src="/background-animation.json"
              autoplay
              loop
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="relative z-10">
            <Navbar />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/map" element={
                <ProtectedRoute>
                  <IndiaMap />
                </ProtectedRoute>
              } />

              <Route path="/users" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />

              <Route path="/donations" element={
                <ProtectedRoute>
                  <DonationsPage />
                </ProtectedRoute>
              } />

              <Route path="/ngos" element={
                <ProtectedRoute>
                  <NGOsPage />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
