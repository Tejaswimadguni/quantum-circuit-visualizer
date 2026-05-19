import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export default function Modal({ open, title, description, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#07101f]/95 p-8 shadow-[0_0_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Quantum briefing</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 transition hover:text-cyan-200"
              >
                ✕
              </button>
            </div>
            <p className="mt-6 text-slate-300 leading-7">{description}</p>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
