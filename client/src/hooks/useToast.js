import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom hook to access toast notifications from anywhere in the app
 * 
 * Example usage:
 * const { showToast } = useToast();
 * showToast('Login successful!', 'success');
 * showToast('Error occurred', 'error', 5000);
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
