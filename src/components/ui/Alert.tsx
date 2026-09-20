import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const styles = {
    success: {
      container: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-300 font-semibold',
    },
    error: {
      container: 'bg-rose-950/50 border-rose-500/40 text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-300 font-semibold',
    },
    warning: {
      container: 'bg-amber-950/50 border-amber-500/40 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-300 font-semibold',
    },
    info: {
      container: 'bg-blue-950/50 border-blue-500/40 text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-300 font-semibold',
    },
  };

  const current = styles[variant];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-4 rounded-xl border ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h5 className={`mb-1 ${current.titleColor}`}>{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
