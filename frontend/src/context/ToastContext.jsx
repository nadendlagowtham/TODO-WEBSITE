import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, addToast, removeToast }}>
      {children}

      {/* Floating Toasts Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Sub-component for individual toast
const ToastCard = ({ message, type, onClose }) => {
  const configs = {
    success: {
      bg: 'bg-brand-success-bg border-brand-success/30',
      text: 'text-brand-success-text',
      icon: CheckCircle2,
      iconColor: 'text-brand-success'
    },
    error: {
      bg: 'bg-brand-error-bg border-brand-error/30',
      text: 'text-brand-error-text',
      icon: AlertCircle,
      iconColor: 'text-brand-error'
    },
    info: {
      bg: 'bg-brand-canvas border-brand-border',
      text: 'text-brand-muted',
      icon: Info,
      iconColor: 'text-brand-primary'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`
      pointer-events-auto flex items-start p-4 bg-white border rounded shadow-soft-xl
      ${config.bg} ${config.text} transition-all duration-300 animate-slideIn
    `}>
      <Icon className={`w-5 h-5 mr-3 shrink-0 ${config.iconColor}`} />
      <div className="flex-1 text-sm font-medium pr-2 break-words">
        {message}
      </div>
      <button
        onClick={onClose}
        className="text-brand-muted hover:text-brand-text focus:outline-none transition-colors ml-2 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
