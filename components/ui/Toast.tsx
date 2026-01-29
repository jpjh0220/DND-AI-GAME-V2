import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'info';
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const ICONS = {
  success: <CheckCircle size={16} />,
  danger: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const COLORS = {
  success: 'bg-emerald-900/95 border-emerald-700 text-emerald-300',
  danger: 'bg-red-900/95 border-red-700 text-red-300',
  info: 'bg-sky-900/95 border-sky-700 text-sky-300',
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div 
      className={`relative w-full max-w-sm rounded-xl p-3 pl-4 pr-8 flex items-center gap-3 shadow-lg border animate-slide-in-from-bottom backdrop-blur-sm ${COLORS[toast.type]}`}
      role="alert"
    >
      <div className="shrink-0">{ICONS[toast.type]}</div>
      <p className="text-sm font-semibold">{toast.message}</p>
      <button 
        onClick={() => onDismiss(toast.id)} 
        className="absolute top-2 right-2 p-1 rounded-full text-white/50 hover:text-white/80 hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex flex-col items-center gap-2 z-[100]">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};