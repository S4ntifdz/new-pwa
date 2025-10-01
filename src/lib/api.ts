const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export class ApiClient {
  private sessionToken: string | null = null;
  private identifier: string | null = null;

  setSessionToken(sessionToken: string) {
    this.sessionToken = sessionToken;
  }

  setIdentifier(identifier: string) {
    this.identifier = identifier;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}/api/v1${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    };  

    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    }

    if (this.identifier) {
      headers['x-identifier'] = this.identifier;
    }

    try {
      const response = await fetch(url, {
        ...options,
  headers,
  credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('UNAUTHORIZED');
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      // Get the raw response text first
      const responseText = await response.text();
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const jsonResponse = JSON.parse(responseText);
          return jsonResponse;
        } catch (parseError) {
          throw new Error('Invalid JSON response from server');
        }
      } else {
        // Try to parse as JSON anyway, in case the content-type header is wrong
        try {
          const jsonResponse = JSON.parse(responseText);
          return jsonResponse;
        } catch (parseError) {
          throw new Error(`Server returned non-JSON response: ${responseText}`);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Authentication
async validateSession(token?: string) {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (this.identifier) {
      headers['x-identifier'] = this.identifier;
    }
    return await this.request<{ valid: boolean; session_token: string }>('/validate-jwt', {
      method: 'GET',
      headers,
    });
  } catch (error) {
    console.error('Session validation failed:', error);
    return { valid: false };
  }
}


  // Client orders
  async getClientUnpaidOrders() {
    try {
      return this.request('/orders/client-unpaid-orders');
    } catch (error) {
      console.error('Failed to get client unpaid orders:', error);
      throw error;
    }
  }

  // Open sessions
  async getOpenSessions() {
    try {
      return this.request('/tables/open-sessions');
    } catch (error) {
      console.error('Failed to get open sessions:', error);
      throw error;
    }
  }

  // Tables
  async callWaiter(tableId: string): Promise<{ number: number; calling: boolean }> {
    return this.request(`/tables/call/${tableId}/`, {
      method: 'POST',
    });
  }

  async cancelWaiterCall(): Promise<void> {
    return this.request(`/call-cancel/`, {
      method: 'POST',
    });
  }

  async getUnpaidOrders(tableId: string) {
    return this.request(`/tables/${tableId}/unpaid-orders/`);
  }

  // Menu Categories
  async getMenuCategories() {
    return this.request('/menu-categories/');
  }

  // Products
  async getProducts() {
    return this.request('/products/');
  }

  // Menus
  async getMenus() {
    return this.request('/menus/');
  }

  // Orders
  async getOrders() {
    return this.request('/orders/');
  }

  async createOrder(order: any) {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Payments
  async createPayment(payment: { method: string; amount: string }): Promise<PaymentResponse> {
    return this.request('/payments/', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // Offers
  async getOffers() {
    return this.request('/offers/');
  }
  
  async getConfig() {
    return this.request('/config/');
  }
}

export const apiClient = new ApiClient();