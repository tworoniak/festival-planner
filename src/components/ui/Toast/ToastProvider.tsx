import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './ToastProvider.module.scss';
import { ToastContext } from './toast.context';
import type { Toast } from './toast.types';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
    for (const timer of timers.current.values()) window.clearTimeout(timer);
    timers.current.clear();
  }, []);

  const push = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = uid();
      const toast: Toast = {
        id,
        variant: t.variant ?? 'default',
        durationMs: t.durationMs ?? 2400,
        title: t.title,
        message: t.message,
      };

      setToasts((prev) => [toast, ...prev].slice(0, 4));

      const timer = window.setTimeout(() => dismiss(id), toast.durationMs);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({ push, dismiss, clear }),
    [push, dismiss, clear],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className={styles.viewport}
        aria-live='polite'
        aria-relevant='additions'
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              styles.toast,
              t.variant === 'success' ? styles.success : '',
              t.variant === 'danger' ? styles.danger : '',
            ].join(' ')}
            role='status'
          >
            <div className={styles.content}>
              {t.title ? <div className={styles.title}>{t.title}</div> : null}
              <div className={styles.message}>{t.message}</div>

              {t.action ? (
                <button
                  type='button'
                  className={styles.action}
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              ) : null}
            </div>

            <button
              type='button'
              className={styles.close}
              onClick={() => dismiss(t.id)}
              aria-label='Dismiss notification'
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
