import { motion } from 'framer-motion';

const highlights = [
  { value: '10+', label: 'Quantum Gates' },
  { value: 'Real-Time', label: 'Execution' },
  { value: 'Qiskit', label: 'Powered' },
  { value: 'Interactive', label: 'Visualization' },
];

export default function PlatformHighlights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
    >
      {highlights.map((item, i) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-700/50 bg-surface/80 px-4 py-3 text-center backdrop-blur-sm"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="text-lg font-semibold text-white sm:text-xl"
          >
            {item.value}
          </motion.p>
          <p className="mt-0.5 text-xs text-muted">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
