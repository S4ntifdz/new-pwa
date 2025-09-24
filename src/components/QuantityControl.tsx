import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  max = 999,
  size = 'md'
}: QuantityControlProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm'
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${sizeClasses[size]} bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:hover:scale-100 shadow-sm`}
      >
        <Minus className={`${iconSize} text-gray-600 dark:text-gray-300`} />
      </button>
      
      <span className="w-10 text-center font-bold text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg py-2">
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${sizeClasses[size]} bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:hover:scale-100 shadow-sm`}
      >
        <Plus className={`${iconSize} text-gray-600 dark:text-gray-300`} />
      </button>
    </div>
  );
}