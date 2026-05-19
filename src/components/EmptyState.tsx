import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300 shadow-[0_0_40px_rgba(79,247,228,0.08)]"
    >
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">Quantum onboarding</p>
        <h3 className="mt-4 text-2xl font-semibold text-white">No gates placed yet</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Select a gate from the toolbox and click any cell in the circuit grid to begin building your quantum workflow.
        </p>
        <div className="mt-6 space-y-3 text-left text-sm text-slate-300">
          <div className="rounded-3xl border border-white/10 bg-[#07111e]/80 p-4">
            <strong className="text-cyan-200">Tip:</strong> H + CNOT makes a Bell state.
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#07111e]/80 p-4">
            <strong className="text-cyan-200">Shortcut:</strong> Press <span className="rounded-full bg-white/5 px-2 py-1 text-xs">Ctrl+R</span> to simulate.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
