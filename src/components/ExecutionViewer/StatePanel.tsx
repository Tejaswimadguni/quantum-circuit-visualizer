import { motion } from 'framer-motion';

interface StatePanelProps {
  stateBefore: string;
  stateAfter: string;
}

export default function StatePanel({ stateBefore, stateAfter }: StatePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold mb-4 text-slate-100">Quantum State Evolution</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Before */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Before Gate Application
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-cyan-300 font-mono break-words leading-relaxed"
          >
            {stateBefore}
          </motion.p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl text-violet-400"
          >
            →
          </motion.div>
        </div>

        {/* State After */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 md:col-span-1 md:row-start-1 md:col-start-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            After Gate Application
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-violet-300 font-mono break-words leading-relaxed"
          >
            {stateAfter}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
