import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { QRModal } from '../components/QRModal';
import { RatingModal } from '../components/RatingModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CreditCard, Building2, DollarSign, QrCode, Smartphone } from 'lucide-react';
import { apiClient } from '../lib/api';
import { ClientUnpaidOrdersResponse, UnpaidOrdersResponse, PaymentResponse } from '../types';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'credit_card' | 'transfer' | 'cash' | 'qr' | 'mercadopago';
}

export function PaymentPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [orders, setOrders] = useState<ClientUnpaidOrdersResponse | UnpaidOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const paymentType = location.state?.paymentType || 'individual'; // 'individual' or 'table'

  React.useEffect(() => {
    loadOrders();
  }, [paymentType, tableId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      let ordersData;
      if (paymentType === 'individual') {
        // Load client's individual orders
        ordersData = await apiClient.getClientUnpaidOrders();
      } else {
        // Load all table orders
        ordersData = await apiClient.getUnpaidOrders(tableId!);
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Efectivo',
      icon: <DollarSign className="w-5 h-5" />,
      type: 'cash'
    },
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      icon: <CreditCard className="w-5 h-5" />,
      type: 'credit_card'
    },
    {
      id: 'transfer',
      name: 'Transferencia',
      icon: <Building2 className="w-5 h-5" />,
      type: 'transfer'
    },
    {
      id: 'qr',
      name: 'QR',
      icon: <QrCode className="w-5 h-5" />,
      type: 'qr'
    },
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      icon: <Smartphone className="w-5 h-5" />,
      type: 'mercadopago'
    }
  ];

  const handlePayment = async () => {
    if (!tableId || !orders) return;
    
    // Special handling for QR payment
    if (selectedPaymentMethod === 'qr') {
      setShowQRModal(true);
      // Still process the payment in the background
    }
    
    setProcessing(true);
    
    try {
      // Create payment with API
      const paymentData = {
        method: selectedPaymentMethod,
        amount: orders.total_amount_owed.toString()
      };

      console.log('Creating payment:', paymentData);
      const response = await apiClient.createPayment(paymentData);
      console.log('Payment created:', response);
      
      setPaymentResponse(response);
      
      // Close QR modal if it was open
      if (showQRModal) {
        setShowQRModal(false);
      }
      
      // Show rating modal
      setShowRatingModal(true);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
      if (showQRModal) {
        setShowQRModal(false);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log('Rating submitted:', { rating, comment });
    
    // Navigate to confirmation
    navigate(`/confirmation/${tableId}`, {
      state: {
        orderNumber: 'PAID-' + Date.now(),
        total: orders?.total_amount_owed,
        paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name,
        paymentResponse,
        rating,
        comment
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Pago" showBack />
        <LoadingSpinner message="Cargando información de pago..." />
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Pago" showBack />
        <div className="p-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            No se encontraron órdenes para pagar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      <Header 
        title={paymentType === 'individual' ? 'Pagar mis órdenes' : 'Pagar toda la mesa'} 
        showBack 
      />

      <div className="p-4 space-y-6">
        {/* Payment Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {paymentType === 'individual' ? 'Pago Individual' : 'Pago de Mesa'}
          </h3>
          
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Mesa {orders.table_number} - {paymentType === 'individual' ? 'Tus órdenes' : 'Órdenes pendientes'}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Total a pagar: ${orders.total_amount_owed.toFixed(2)}
            </p>
          </div>
          
          {/* Order Details */}
          <div className="space-y-3 mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Detalle de órdenes:</h4>
            {orders.orders.flatMap(order => 
              order.order_products.map((item, index) => (
                <div key={`${order.id}-${index}`} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.quantity}x {item.product_details?.name || item.offer_details?.name || 'Producto'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${((item.product_details?.price || item.offer_details?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Método de Pago
          </h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPaymentMethod === method.id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedPaymentMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-gray-700 dark:text-gray-300">
                    {method.icon}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {method.name}
                  </span>
                </div>
                
                {method.type === 'credit_card' && (
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      MC
                    </div>
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      V
                    </div>
                  </div>
                )}
                
                {method.type === 'transfer' && (
                  <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center">
                    $
                  </div>
                )}
                
                {method.type === 'qr' && (
                  <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center">
                    QR
                  </div>
                )}
                
                {method.type === 'mercadopago' && (
                  <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    MP
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando Pago...
            </div>
          ) : (
            `Pagar $${orders.total_amount_owed.toFixed(2)}`
          )}
        </button>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={orders.total_amount_owed}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}