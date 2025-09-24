import React from 'react';
import { Product } from '../types';
import { QuantityControl } from './QuantityControl';
import { useCartStore } from '../stores/useCartStore';
import { Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity } = useCartStore();
  
  const cartItem = items.find(item => item.product.uuid === product.uuid);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleIncrease = () => {
    updateQuantity(product.uuid, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.uuid, quantity - 1);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-bold text-gray-900 dark:text-white">4.8</span>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ¡Últimos {product.stock}!
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
            {product.name}
          </h3>
          <span className="text-xl font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              max={product.stock}
            />
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs">-</span>
              <span className="w-8 text-center font-semibold">0</span>
              <span className="text-xs">+</span>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}