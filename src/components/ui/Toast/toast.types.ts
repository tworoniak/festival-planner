export type ToastVariant = 'default' | 'success' | 'danger';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type Toast = {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
  action?: ToastAction; // 👈 add this
};

export type ToastContextValue = {
  push: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};
