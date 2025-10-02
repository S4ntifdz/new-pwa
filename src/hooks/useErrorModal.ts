import { useState } from 'react';

export function useErrorModal() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const showError = (message: string) => {
    setErrorModalMessage(message);
    setShowErrorModal(true);
  };

  const hideError = () => {
    setShowErrorModal(false);
    setErrorModalMessage('');
  };

  return {
    showErrorModal,
    errorModalMessage,
    showError,
    hideError
  };
}