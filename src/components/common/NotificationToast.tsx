import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useGameState, ToastMessage } from '../../context/GameStateContext';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast } = useGameState();

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/80 text-amber-100';
      case 'alert':
        return 'border-rose-500/40 bg-rose-950/80 text-rose-100';
      default:
        return 'border-cyan-500/40 bg-slate-900/90 text-cyan-100';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto p-4 rounded border backdrop-blur-md shadow-2xl flex items-start gap-3 relative overflow-hidden font-mono text-xs ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-70" />
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 pr-4">
              <h4 className="font-semibold tracking-wider uppercase text-sm mb-0.5">
                {toast.title}
              </h4>
              <p className="opacity-90 leading-relaxed font-sans text-xs">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
