import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';
import { apiClient } from '../lib/api';

interface AuthStore extends AuthState {
  setSessionToken: (sessionToken: string) => void;
  setIdentifier: (identifier: string) => void;
  setTableId: (tableId: string) => void;
  setSessionId: (sessionId: string) => void;
  validateSession: (identifier: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  setValidating: (isValidating: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionToken: null,
      isValidating: false,
      error: null,
      tableId: null,
      sessionId: null,
      identifier: null,

      setSessionToken: (sessionToken: string) => {
        apiClient.setSessionToken(sessionToken);
        set({ sessionToken, isAuthenticated: true });
      },

      setIdentifier: (identifier: string) => {
        apiClient.setIdentifier(identifier);
        set({ identifier });
      },

      setTableId: (tableId: string) => {
        set({ tableId });
      },

      setSessionId: (sessionId: string) => {
        set({ sessionId });
      },
validateSession: async (identifier: string, qrToken: string) => {
  set({ isValidating: true, error: null });

  try {
    apiClient.setIdentifier(identifier);

    // Aquí pasamos el QR token
    const response = await apiClient.validateSession(qrToken);

    if (response.valid && response.session_token) {
      apiClient.setSessionToken(response.session_token);
      set({ 
        sessionToken: response.session_token,
        identifier,
        isAuthenticated: true, 
        isValidating: false,
        error: null 
      });
      return true;
    } else {
      set({ 
        sessionToken: null,
        identifier: null,
        isAuthenticated: false, 
        isValidating: false,
        error: 'Sesión inválida o expirada' 
      });
      return false;
    }
  } catch (error) {
    console.error('Session validation error:', error);
    set({ 
      sessionToken: null,
      identifier: null,
      isAuthenticated: false, 
      isValidating: false,
      error: 'Error de conexión con el servidor' 
    });
    return false;
  }
}
,

      logout: () => {
        set({ 
          isAuthenticated: false, 
          sessionToken: null,
          identifier: null,
          tableId: null,
          sessionId: null,
          error: null 
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setValidating: (isValidating: boolean) => {
        set({ isValidating });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        sessionToken: state.sessionToken,
        identifier: state.identifier,
        tableId: state.tableId,
        sessionId: state.sessionId
      }),
    }
  )
);