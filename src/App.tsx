// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './stores/useThemeStore';
import { LoadingPage } from './pages/LoadingPage';
import { ErrorPage } from './pages/ErrorPage';
import { DashboardPage } from './pages/DashboardPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { IdentificationPage } from './pages/IdentificationPage';
import { PaymentSplitPage } from './pages/PaymentSplitPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorModal } from './components/ErrorModal';

function App() {
  const { isDark } = useThemeStore();
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Also apply to body for better coverage
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Manejar errores globales
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setGlobalError('Ha ocurrido un error inesperado. Por favor contacta al mozo.');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setGlobalError('Ha ocurrido un error inesperado. Por favor contacta al mozo.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
          {/* Identification Route - for JWT tokens */}
          <Route path="/:token" element={<IdentificationPage />} />
          
          {/* Error Route (mantener para errores críticos) */}
          <Route path="/error" element={<ErrorPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/:tableId" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/menu/:tableId" 
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/cart/:tableId" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/order-confirmation/:tableId" 
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment-split/:tableId" 
            element={
              <ProtectedRoute>
                <PaymentSplitPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment/:tableId" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/confirmation/:tableId" 
            element={
              <ProtectedRoute>
                <ConfirmationPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to loading with a sample table ID */}
          <Route path="/" element={<Navigate to="/error" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>

        {/* Error Modal Global */}
        {globalError && (
          <ErrorModal
            isOpen={!!globalError}
            onClose={() => setGlobalError(null)}
            title="Error del Sistema"
            message={globalError}
          />
        )}
      </div>
    </Router>
  );
}

export default App;