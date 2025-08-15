import React, { useState } from 'react';
import { X, Bot, User, ExternalLink } from 'lucide-react';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isLink?: boolean;
  linkUrl?: string;
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const [showOptions, setShowOptions] = useState(true);

  if (!isOpen) return null;

  const addMessage = (text: string, isBot: boolean, isLink?: boolean, linkUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      isLink,
      linkUrl
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    // Add user message
    addMessage(option, false);
    setShowOptions(false);

    // Add bot response after a delay
    setTimeout(() => {
      switch (option) {
        case 'Quiero pedir la cuenta':
          addMessage('Perfecto! Te genero un link de pago para que puedas pagar de forma segura:', true);
          setTimeout(() => {
            addMessage('🔗 Link de Pago Seguro - Toca aquí para pagar', true, true, 'https://ejemplo-pago.com/mesa-123');
          }, 1000);
          break;
        case 'Quiero encargar':
          addMessage('¡Excelente! Te redirijo al menú para que puedas hacer tu pedido. ¿Hay algo específico que te gustaría ordenar?', true);
          break;
        case 'Necesito ayuda':
          addMessage('Estoy aquí para ayudarte. Puedes preguntarme sobre el menú, hacer pedidos, solicitar la cuenta o llamar al mozo. ¿Qué necesitas?', true);
          break;
        case 'Llamar al mozo':
          addMessage('¡Perfecto! He notificado al mozo que necesitas asistencia. Estará contigo en breve.', true);
          break;
        default:
          addMessage('Gracias por tu mensaje. ¿Hay algo más en lo que pueda ayudarte?', true);
      }
      setShowOptions(true);
    }, 1000);
  };

  const quickOptions = [
    'Quiero pedir la cuenta',
    'Quiero encargar',
    'Llamar al mozo',
    'Necesito ayuda'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Asistente Virtual
              </h3>
              <p className="text-xs text-green-500">En línea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot 
                    ? 'bg-orange-100 dark:bg-orange-900/20' 
                    : 'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  {message.isBot ? (
                    <Bot className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.isBot
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {message.isLink ? (
                    <button
                      onClick={() => window.open(message.linkUrl, '_blank')}
                      className="flex items-center gap-2 hover:underline"
                    >
                      {message.text}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Options */}
        {showOptions && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Opciones rápidas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}