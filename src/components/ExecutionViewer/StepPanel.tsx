import { motion } from 'framer-motion';
import { ExecutionStep } from '../ExecutionViewer';

interface StepPanelProps {
  step: ExecutionStep;
  totalSteps: number;
}

const getGateInfo = (gate: string) => {
  const info: Record<string, { color: string; icon: string }> = {
    H: { color: 'from-cyan-400 to-cyan-600', icon: '⊕' },
    X: { color: 'from-violet-400 to-violet-600', icon: '✕' },
    Y: { color: 'from-pink-400 to-pink-600', icon: 'Y' },
    Z: { color: 'from-blue-400 to-blue-600', icon: 'Z' },
    CNOT: { color: 'from-teal-400 to-teal-600', icon: '◯' },
    MEASURE: { color: 'from-amber-400 to-amber-600', icon: 'M' },
  };
  return info[gate] || { color: 'from-slate-400 to-slate-600', icon: '?' };
};

export default function StepPanel({ step, totalSteps }: StepPanelProps) {
  const { color, icon } = getGateInfo(step.gate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Gate Display */}
        <div className="flex items-center gap-4">
          <motion.div
            className={`relative w-20 h-20 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
            animate={{
              boxShadow: [
                `0 0 20px rgba(6, 182, 212, 0.3)`,
                `0 0 40px rgba(6, 182, 212, 0.6)`,
                `0 0 20px rgba(6, 182, 212, 0.3)`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">{step.gate}</h3>
            {step.control !== undefined ? (
              <p className="text-sm text-slate-400">
                Control: q{step.control} → Target: q{step.target}
              </p>
            ) : (
              <p className="text-sm text-slate-400">Qubit: q{step.qubit}</p>
            )}
          </div>
        </div>

        {/* Step Info */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Current Step</p>
            <p className="text-3xl font-bold text-cyan-400">
              {step.stepNumber}/{totalSteps}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Column Position</p>
            <p className="text-xl font-semibold text-slate-200">{step.column}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
