import { motion } from 'framer-motion';

interface ProbabilityPanelProps {
  probabilitiesBefore: Record<string, number>;
  probabilitiesAfter: Record<string, number>;
}

export default function ProbabilityPanel({
  probabilitiesBefore,
  probabilitiesAfter,
}: ProbabilityPanelProps) {
  const sortedBefore = Object.entries(probabilitiesBefore)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const sortedAfter = Object.entries(probabilitiesAfter)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold mb-6 text-slate-100">Probability Evolution</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Before */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Before Execution
          </p>
          <div className="space-y-3">
            {sortedBefore.map(([state, prob], idx) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-20 text-right">
                  <p className="font-mono text-sm font-bold text-cyan-400">|{state}⟩</p>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(prob * 100, 5)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <p className="font-mono text-sm text-slate-400">{Math.round(prob * 100)}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* After */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            After Execution
          </p>
          <div className="space-y-3">
            {sortedAfter.map(([state, prob], idx) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-20 text-right">
                  <p className="font-mono text-sm font-bold text-violet-400">|{state}⟩</p>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(prob * 100, 5)}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <p className="font-mono text-sm text-slate-400">{Math.round(prob * 100)}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
