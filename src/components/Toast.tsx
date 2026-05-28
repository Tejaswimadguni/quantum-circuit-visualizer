import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl border border-cyan-400/20 bg-[#07121f]/95 px-5 py-4 text-sm text-slate-100 shadow-[0_0_40px_rgba(79,247,228,0.15)] backdrop-blur-xl"
          role="status"
        >
          <div className="flex items-center justify-between gap-4">
            <span>{message}</span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-slate-400 transition hover:text-cyan-200"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
