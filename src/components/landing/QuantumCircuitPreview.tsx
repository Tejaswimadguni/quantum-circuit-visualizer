import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const columns = [0.12, 0.38, 0.64];

function Gate({
  label,
  left,
  color,
  delay = 0,
}: {
  label: string;
  left: string;
  color: 'cyan' | 'violet';
  delay?: number;
}) {
  const styles =
    color === 'cyan'
      ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.25)]'
      : 'border-accent-violet/40 bg-accent-violet/10 text-accent-violet shadow-[0_0_20px_rgba(139,92,246,0.25)]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border text-xs font-semibold ${styles}`}
      style={{ left }}
    >
      {label}
    </motion.div>
  );
}

function QubitLine({
  label,
  children,
  particleDelay,
}: {
  label: string;
  children?: ReactNode;
  particleDelay: number;
}) {
  return (
    <div className="relative flex items-center gap-4">
      <span className="w-8 shrink-0 font-mono text-xs text-muted">{label}</span>
      <div className="relative h-px flex-1 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700">
        {children}
        <motion.span
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          animate={{ left: ['0%', '92%', '0%'] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particleDelay,
          }}
        />
      </div>
    </div>
  );
}

export default function QuantumCircuitPreview() {
  const [c0, c1, c2] = columns;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-surface p-6 shadow-card lg:p-8"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-violet/10 blur-3xl" />

      <div className="relative mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent-cyan">Live preview</p>
          <p className="mt-1 text-sm text-muted">Bell-state circuit</p>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs text-accent-cyan"
        >
          Simulating
        </motion.span>
      </div>

      <div className="relative space-y-10 py-4">
        <QubitLine label="q0" particleDelay={0}>
          <Gate label="H" left={`${c0 * 100}%`} color="cyan" delay={0.3} />
          <div
            className="absolute top-1/2 z-0 h-16 w-px -translate-y-1/2 bg-accent-violet/50"
            style={{ left: `${c1 * 100}%` }}
          />
        </QubitLine>

        <QubitLine label="q1" particleDelay={0.8}>
          <div
            className="absolute top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${c1 * 100}%` }}
          >
            <span className="h-3 w-3 rounded-full border-2 border-accent-violet bg-surface" />
            <span className="h-14 w-px bg-accent-violet/60" />
            <span className="h-3 w-3 rounded-full border-2 border-accent-violet bg-accent-violet/30" />
          </div>
          <Gate label="⊕" left={`${c1 * 100}%`} color="violet" delay={0.5} />
        </QubitLine>

        <QubitLine label="q2" particleDelay={1.4}>
          <Gate label="X" left={`${c2 * 100}%`} color="violet" delay={0.7} />
        </QubitLine>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-700/50 pt-4">
        {['H', 'X', 'CNOT'].map((g) => (
          <span
            key={g}
            className="rounded-md border border-slate-700/80 bg-canvas/80 px-2.5 py-1 font-mono text-xs text-muted"
          >
            {g}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
