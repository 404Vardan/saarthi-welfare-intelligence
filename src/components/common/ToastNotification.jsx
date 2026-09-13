import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification System
 * 
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Profile saved successfully', 'success');
 *   showToast('Upload failed', 'error');
 */

const ToastContext = createContext();

const TOAST_DURATION = 5000;
const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

const TOAST_COLORS = {
  success: { bg: 'rgba(34, 139, 34, 0.1)', border: 'rgba(34, 139, 34, 0.3)', text: '#228B22', icon: '#228B22' },
  error: { bg: 'rgba(193, 68, 45, 0.1)', border: 'rgba(193, 68, 45, 0.3)', text: '#C1442D', icon: '#C1442D' },
  warning: { bg: 'rgba(196, 152, 59, 0.1)', border: 'rgba(196, 152, 59, 0.3)', text: '#A07828', icon: '#C4983B' },
  info: { bg: 'rgba(11, 31, 58, 0.06)', border: 'rgba(11, 31, 58, 0.15)', text: '#0B1F3A', icon: '#6B7A8D' }
};

function Toast({ id, message, type = 'info', onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;
  const Icon = TOAST_ICONS[type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: colors.text,
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: isExiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease',
        maxWidth: '420px',
        width: '100%'
      }}
    >
      <Icon size={18} color={colors.icon} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          padding: '2px',
          cursor: 'pointer',
          color: colors.text,
          opacity: 0.6,
          flexShrink: 0
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 'var(--z-toast, 600)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            pointerEvents: 'auto'
          }}
        >
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onDismiss={dismissToast}
            />
          ))}
        </div>
      )}

      {/* Toast Animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not wrapped in ToastProvider
    return { showToast: (msg, type) => console.warn(`[Toast/${type}] ${msg}`) };
  }
  return context;
}
