import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Users, User, CreditCard } from 'lucide-react';
import { apiClient } from '../lib/api';
import { OpenSessionsResponse } from '../types';

export function PaymentSplitPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const [openSessions, setOpenSessions] = useState<OpenSessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOpenSessions();
  }, []);

  const loadOpenSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getOpenSessions();
      setOpenSessions(response);
      
    } catch (error) {
      console.error('Error loading open sessions:', error);
      setError('Error al cargar información de la mesa');
    } finally {
      setLoading(false);
    }
  };

  const handlePayMyOrders = () => {
    navigate(`/payment/${tableId}`, { 
      state: { 
        paymentType: 'individual'
      } 
    });
  };

  const handlePayWholeTable = () => {
    navigate(`/payment/${tableId}`, { 
      state: { 
        paymentType: 'table'
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Opciones de Pago" showBack />
        <LoadingSpinner message="Cargando información de la mesa..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Error" showBack />
        <ErrorMessage
          message={error}
          action={
            <button
              onClick={loadOpenSessions}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Opciones de Pago" showBack />

      <div className="p-4 space-y-6">
        {/* Sessions Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Al parecer hay {openSessions?.open_sessions || 0} personas en la mesa
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ¿Cómo quieren pagar?
          </p>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          {/* Pay Individual Orders */}
          <button
            onClick={handlePayMyOrders}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-lg p-6 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Pagar solo lo mío
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Solo pagarás tus órdenes individuales
                </p>
              </div>
              
              <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Pay Whole Table */}
          <button
            onClick={handlePayWholeTable}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-lg p-6 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
                <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Pagar toda la mesa
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pagarás todas las órdenes pendientes de la mesa
                </p>
              </div>
              
              <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Información:</strong> Si eliges "Pagar solo lo mío", solo verás tus órdenes. 
                Si eliges "Pagar toda la mesa", verás todas las órdenes pendientes de todos los comensales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}