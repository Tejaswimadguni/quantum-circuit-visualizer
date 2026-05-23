import { motion } from 'framer-motion';
import { ExecutionStep } from '../ExecutionViewer';

interface TimelineViewProps {
  steps: ExecutionStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function TimelineView({ steps, currentStep, onStepClick }: TimelineViewProps) {
  const getGateColor = (gate: string) => {
    const colors: Record<string, string> = {
      H: 'from-cyan-400 to-cyan-600',
      X: 'from-violet-400 to-violet-600',
      Y: 'from-pink-400 to-pink-600',
      Z: 'from-blue-400 to-blue-600',
      CNOT: 'from-teal-400 to-teal-600',
      MEASURE: 'from-amber-400 to-amber-600',
    };
    return colors[gate] || 'from-slate-400 to-slate-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold mb-4 text-slate-100">Execution Timeline</h2>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStepClick(index)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                index === currentStep
                  ? `bg-gradient-to-r ${getGateColor(step.gate)} text-white shadow-lg transform scale-105`
                  : index < currentStep
                    ? 'bg-slate-700/50 text-slate-300 opacity-60'
                    : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {step.gate}
              {step.control !== undefined && (
                <span className="ml-1 text-xs">({step.control},{step.target})</span>
              )}
              {step.qubit !== undefined && step.control === undefined && (
                <span className="ml-1 text-xs">(q{step.qubit})</span>
              )}

              {/* Animation pulse for current step */}
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/20"
                  animate={{
                    opacity: [0.5, 0, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </p>
      </div>
    </motion.div>
  );
}
