import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#00ffff',
        border: '1px solid #00ffff',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
      },
      iconTheme: {
        primary: '#00ffff',
        secondary: '#0f172a',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
      },
      iconTheme: {
        primary: '#ff6b6b',
        secondary: '#0f172a',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#60a5fa',
        border: '1px solid #60a5fa',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)',
      },
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#fbbf24',
        border: '1px solid #fbbf24',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'cyber-toast',
        }}
      />
    </ToastContext.Provider>
  );
};