import { motion } from 'framer-motion';
import { ExecutionData } from '../ExecutionViewer';

interface ExecutionReportProps {
  executionData: ExecutionData;
  onClose: () => void;
  onReplay: () => void;
}

export default function ExecutionReport({
  executionData,
  onClose,
  onReplay,
}: ExecutionReportProps) {
  const topResults = Object.entries(executionData.finalProbabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/90 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
            Execution Complete! ✓
          </h2>
          <p className="text-slate-400">Here's a summary of your quantum circuit execution</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Gates', value: executionData.gateCount },
            { label: 'Circuit Depth', value: executionData.circuitDepth },
            { label: 'Qubits', value: executionData.qubitCount },
            { label: 'Execution Time', value: executionData.executionTime },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-cyan-400">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Measurement Results</h3>
          <div className="space-y-3">
            {topResults.map(([state, prob], idx) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-24">
                  <p className="font-mono text-sm font-bold text-violet-300">|{state}⟩</p>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-end pr-3"
                      initial={{ width: 0 }}
                      animate={{ width: `${prob * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + idx * 0.05 }}
                    >
                      {prob * 100 > 10 && (
                        <span className="text-xs font-bold text-white">{Math.round(prob * 100)}%</span>
                      )}
                    </motion.div>
                  </div>
                </div>
                <div className="w-14 text-right">
                  <p className="font-mono text-sm text-slate-400">{Math.round(prob * 100)}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div variants={itemVariants} className="mb-8 bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
          <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Key Results
          </h4>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Most likely measurement outcome: <span className="font-mono text-cyan-400">{topResults[0]?.[0] || 'N/A'}</span> ({Math.round((topResults[0]?.[1] || 0) * 100)}%)</li>
            <li>• Superposition state: {topResults.length > 1 ? 'Yes ✓' : 'No'}</li>
            <li>• Circuit successfully executed all {executionData.gateCount} gates</li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4"
        >
          <button
            onClick={onReplay}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
          >
            ↻ Replay Execution
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-colors duration-200"
          >
            ✕ Close
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
