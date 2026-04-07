import React, { useContext } from 'react';
import Toast from './Toast';
import { ToastContext } from '../context/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
