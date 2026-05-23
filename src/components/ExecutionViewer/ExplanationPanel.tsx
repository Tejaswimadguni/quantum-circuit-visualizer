import { motion } from 'framer-motion';

interface ExplanationPanelProps {
  explanation: string;
}

export default function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-gradient-to-r from-slate-900/40 to-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
            <span className="text-lg font-bold text-white">ℹ</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-100 mb-2">Educational Insight</h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-slate-300 leading-relaxed text-sm md:text-base"
          >
            {explanation}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
