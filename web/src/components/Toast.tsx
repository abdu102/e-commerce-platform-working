import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (opts: Omit<Toast, 'id'>) => void;
  success: (message: string, opts?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) => void;
  info: (message: string, opts?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) => void;
  warn: (message: string, opts?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) => void;
  error: (message: string, opts?: Partial<Omit<Toast, 'id' | 'type' | 'description'>>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, duration: 2800, ...opts };
    setToasts((ts) => [toast, ...ts]);
    const duration = toast.duration ?? 2800;
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const api = useMemo<ToastContextValue>(() => ({
    show,
    success: (message, opts) => show({ type: 'success', title: message, ...(opts || {}) }),
    info: (message, opts) => show({ type: 'info', title: message, ...(opts || {}) }),
    warn: (message, opts) => show({ type: 'warning', title: message, ...(opts || {}) }),
    error: (message, opts) => show({ type: 'error', title: message, ...(opts || {}) }),
  }), [show]);

  const colorByType: Record<ToastType, string> = {
    success: 'from-emerald-500 to-green-600',
    info: 'from-blue-500 to-indigo-600',
    warning: 'from-amber-500 to-orange-600',
    error: 'from-rose-500 to-red-600',
  };

  const IconByType: Record<ToastType, React.ComponentType<any>> = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
    error: AlertTriangle,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] space-y-3 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = IconByType[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r ${colorByType[t.type]} text-white`}
              >
                <div className="p-4 pr-10 flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div>
                    {t.title && <div className="font-semibold leading-snug">{t.title}</div>}
                    {t.description && <div className="text-sm opacity-90 mt-0.5">{t.description}</div>}
                  </div>
                  <button aria-label="Close" onClick={() => remove(t.id)} className="absolute top-2 right-2/2 translate-x-1/2 md:translate-x-0 md:right-2 rounded-full p-1/5 md:p-1.5 hover:bg-white/10">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -left-10 top-0 h-full w-24 bg-white/10 blur-2xl -skew-x-12" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}


