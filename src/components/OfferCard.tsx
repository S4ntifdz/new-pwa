import React from 'react';
import { Offer } from '../types';
import { QuantityControl } from './QuantityControl';
import { useCartStore } from '../stores/useCartStore';
import { Plus, Sparkles, Gift } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const { addOffer, offers, updateOfferQuantity } = useCartStore();
  
  const cartOffer = offers.find(item => item.offer.uuid === offer.uuid);
  const quantity = cartOffer?.quantity || 0;

  const handleAddToCart = () => {
    addOffer(offer, 1);
  };

  const handleIncrease = () => {
    updateOfferQuantity(offer.uuid, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateOfferQuantity(offer.uuid, quantity - 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-red-100 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-red-900/30 rounded-2xl shadow-lg border-2 border-orange-200 dark:border-orange-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative">
      {/* Sparkle decoration */}
      <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800/40 dark:to-red-800/40 flex items-center justify-center relative">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <div className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-2">
            OFERTA ESPECIAL
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              ¡Ahorra hasta 30%!
            </span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-red-400 rounded-full opacity-60"></div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 leading-tight">
            {offer.name}
          </h3>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full">
            <span className="text-xl font-bold">${offer.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Incluye:
          </p>
          <div className="space-y-1">
            {offer.products.map((item, index) => (
              <p key={index} className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                • {item.quantity}x {item.product.name}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ) : (
            <div className="flex items-center gap-2 text-orange-400">
              <span className="text-xs">-</span>
              <span className="w-8 text-center font-semibold">0</span>
              <span className="text-xs">+</span>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Agregar Oferta
          </button>
        </div>
      </div>
    </div>
  );
}