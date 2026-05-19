import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-t border-white/10 bg-[#050816]/80 px-6 py-14 sm:px-10 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 text-slate-300">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Quantum Circuit Visualizer</p>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            A polished simulation and learning platform designed for quantum circuit builders and researchers.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            View repository
          </a>
          <div className="rounded-3xl border border-white/10 bg-[#081021]/80 px-5 py-3 text-sm text-slate-300">
            Powered by Qiskit
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
