import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { QuantityControl } from '../components/QuantityControl';
import { useCartStore } from '../stores/useCartStore';
import { Trash2, ShoppingBag, MessageSquare, Receipt } from 'lucide-react';

export function CartPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { 
    items, 
    offers,
    notes, 
    setNotes, 
    updateQuantity, 
    updateOfferQuantity,
    removeItem, 
    removeOffer,
    getSubtotal, 
    getService, 
    getTotal 
  } = useCartStore();

  const subtotal = getSubtotal();
  const service = getService();
  const total = getTotal();

  const handleCallWaiter = async () => {
    // Implementation for calling waiter
  };

  const handleProceedToOrder = () => {
    if (items.length === 0 && offers.length === 0) return;
    navigate(`/order-confirmation/${tableId}`);
  };

  if (items.length === 0 && offers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 pb-24">
        <Header title="Carrito" showBack />
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
              Agrega algunos productos del menú para continuar con tu pedido
            </p>
            <button
              onClick={() => navigate(`/menu/${tableId}`)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explorar Menú
            </button>
          </div>
        </div>
        <BottomNavigation tableId={tableId || ''} onCallWaiter={handleCallWaiter} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-40">
      <Header title="Mi Carrito" showBack />

      <div className="p-6 space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.uuid}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                />
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    ${item.product.price.toFixed(2)} c/u
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.product.uuid, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.product.uuid, item.quantity - 1)}
                    />
                    
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl text-gray-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.uuid)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Cart Offers */}
          {offers.map((item) => (
            <div
              key={item.offer.uuid}
              className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-5 shadow-lg border-2 border-orange-200 dark:border-orange-700 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800/30 dark:to-red-800/30 flex items-center justify-center shadow-md">
                  <span className="text-3xl">🎉</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">
                    {item.offer.name}
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                    ${item.offer.price.toFixed(2)} c/u • Oferta especial
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <QuantityControl
                      quantity={item.quantity}
                      onIncrease={() => updateOfferQuantity(item.offer.uuid, item.quantity + 1)}
                      onDecrease={() => updateOfferQuantity(item.offer.uuid, item.quantity - 1)}
                    />
                    
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl text-orange-900 dark:text-orange-100">
                        ${(item.offer.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeOffer(item.offer.uuid)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-orange-500" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Notas para la cocina
            </h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instrucciones especiales, alergias, preferencias..."
            className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Resumen del Pedido
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
              <span className="text-gray-900 dark:text-white font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Servicio (10%)</span>
              <span className="text-gray-900 dark:text-white font-semibold">${service.toFixed(2)}</span>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button
          onClick={handleProceedToOrder}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center gap-3"
        >
          <Receipt className="w-6 h-6" />
          Confirmar Pedido • ${total.toFixed(2)}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation tableId={tableId || ''} onCallWaiter={handleCallWaiter} />
    </div>
  );
}