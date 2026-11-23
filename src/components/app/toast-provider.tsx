'use client';
// Kurze Rückmeldungen (Toasts) für Teilnahme, Rückzug und Absage; für Screenreader als Statusmeldung (F-22, F-23, F-18).
import { Check, CircleAlert } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './toast-provider.module.css';

type ToastTone = 'success' | 'error';
type Toast = { id: number; message: string; tone: ToastTone };
type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast>(() => {});
const visibleMilliseconds = 3200;

/**
 * Zeigt Toasts am oberen Rand (mobil) bzw. unten rechts (Desktop).
 * Eingaben: Kinder. Rückgabe: Provider mit Statusregion.
 * Feature: F-22
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const reduceMotion = useReducedMotion();

  const showToast = useCallback<ShowToast>((message, tone = 'success') => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current.slice(-1), { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), visibleMilliseconds);
  }, []);

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.p
              key={toast.id}
              className={styles.toast}
              data-tone={toast.tone}
              initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            >
              {toast.tone === 'success' ? <Check size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}
              {toast.message}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Liefert die Funktion zum Anzeigen eines Toasts.
 * Rückgabe: `(message, tone?) => void`.
 * Feature: F-22
 */
export function useToast(): ShowToast {
  return useContext(ToastContext);
}
