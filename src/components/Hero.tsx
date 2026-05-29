import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuantumCircuitPreview from './landing/QuantumCircuitPreview';
import PlatformHighlights from './landing/PlatformHighlights';

export default function Hero() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden section-pad pb-16 pt-24 lg:pb-24 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute inset-0 bg-circuit-grid bg-grid opacity-40" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl lg:max-w-none">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-accent-cyan/25 bg-accent-cyan/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent-cyan"
          >
            Quantum Computing Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Build, Simulate and Visualize Quantum Circuits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted"
          >
            Real-time quantum simulation powered by Qiskit with state evolution, Bloch sphere visualization
            and interactive execution playback.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/simulator');
              }}
              className="rounded-lg bg-accent-cyan px-6 py-3 text-sm font-semibold text-canvas shadow-glow transition hover:bg-cyan-400"
            >
              Launch Simulator
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToFeatures}
              className="rounded-lg border border-slate-600 bg-surface px-6 py-3 text-sm font-semibold text-white transition hover:border-accent-violet/50 hover:bg-surface/80"
            >
              Explore Features
            </motion.button>
          </motion.div>

          <div className="mt-10">
            <PlatformHighlights />
          </div>
        </div>

        <QuantumCircuitPreview />
      </div>
    </section>
  );
}
