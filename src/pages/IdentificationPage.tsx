import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function IdentificationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { validateSession, isValidating, error, setTableId } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'nickname'>('nickname');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      return;
    }

    try {
      // Decode JWT to extract table_uuid
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tableId = payload.table_uuid;
        
        if (tableId) {
          setTableId(tableId);
        }
      }

      const isValid = await validateSession(identifier, token);
      
      if (isValid) {
        const tableId = token ? JSON.parse(atob(token.split('.')[1])).table_uuid : 'default';
        navigate(`/dashboard/${tableId}`, { replace: true });
      }
    } catch (decodeError) {
      console.error('Error decoding JWT:', decodeError);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <ErrorMessage
          title="Error de Identificación"
          message={error}
          action={
            <button
              onClick={() => window.location.reload()}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Para continuar, ingresa tu identificación
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Type Selection */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              type="button"
              onClick={() => setIdentifierType('nickname')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                identifierType === 'nickname'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Nickname
            </button>
            <button
              type="button"
              onClick={() => setIdentifierType('email')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                identifierType === 'email'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Email
            </button>
          </div>

          {/* Input Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {identifierType === 'email' ? (
                <Mail className="h-5 w-5 text-gray-400" />
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type={identifierType === 'email' ? 'email' : 'text'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                identifierType === 'email' 
                  ? 'tu@email.com' 
                  : 'Tu nickname'
              }
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={isValidating}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isValidating || !identifier.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isValidating ? (
              <LoadingSpinner size="sm" message="" />
            ) : (
              'Continuar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tu identificación se usará para gestionar tu sesión en la mesa
          </p>
        </div>
      </div>
    </div>
  );
}