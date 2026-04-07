import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const newToast = { id, message, type, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    return addToast(message, type, duration);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
