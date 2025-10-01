import React from 'react';
import { X, AlertTriangle, Phone } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function ErrorModal({ 
  isOpen, 
  onClose, 
  title = 'Error', 
  message 
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Contact Waiter Button */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Contactar al Mozo
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-2xl font-semibold transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}