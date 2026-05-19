import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const floatingItems = [
  { label: 'H', x: '10%', y: '20%', delay: 0.2 },
  { label: 'X', x: '80%', y: '12%', delay: 0.4 },
  { label: 'CNOT', x: '55%', y: '70%', delay: 0.6 },
  { label: 'π/2', x: '18%', y: '72%', delay: 0.35 },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:px-10 lg:px-12">
      <div className="absolute inset-0 bg-circuit-grid opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200 shadow-glow">
              Futuristic quantum SaaS
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl font-semibold tracking-tight text-white sm:text-6xl"
            >
              Quantum Circuit Visualizer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="max-w-2xl text-lg leading-8 text-slate-300"
            >
              Build, simulate and visualize quantum circuits interactively with a sleek interface designed for developers,
              researchers, and curious learners.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_40px_rgba(79,247,228,0.12)] transition duration-200 hover:bg-cyan-400/20"
                onClick={() => navigate('/simulator')}
              >
                Launch Simulator
              </motion.button>
              <motion.a
                whileHover={{ y: -2 }}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-200 hover:border-cyan-300/50 hover:text-cyan-200"
                href="#about"
              >
                Learn Quantum Basics
              </motion.a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow">
            <div className="absolute inset-y-0 left-0 w-[1px] bg-cyan-400/10" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-[#091227]/95 p-6 shadow-2xl shadow-[#080d1d]/80">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Live Circuit Studio</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-cyan-200">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(79,247,228,0.6)]" />
                  Running
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl border border-cyan-400/10 bg-[#061025]/90 p-4 text-xs uppercase tracking-[0.28em] text-slate-400">
                  Quantum matrix explorer
                </div>
                <div className="grid gap-5 rounded-3xl bg-[#04101f]/95 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Qubit count</span>
                    <span className="text-cyan-200">4</span>
                  </div>
                  <div className="grid gap-3">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="h-2.5 w-full rounded-full bg-white/5">
                          <div className="h-2.5 rounded-full bg-cyan-400" style={{ width: `${70 - idx * 12}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">q{idx}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none relative h-[260px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-4 py-6 shadow-glow sm:px-6 lg:h-[320px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,247,228,0.15),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(159,125,255,0.14),_transparent_22%)]" />
          <div className="relative grid h-full grid-cols-3 gap-4">
            {floatingItems.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.8, ease: 'easeOut' }}
                className="group relative flex items-center justify-center rounded-3xl border border-white/10 bg-[#061026]/90 px-4 py-4 text-center text-sm font-semibold text-slate-100 shadow-glow"
                style={{ left: item.x, top: item.y }}
              >
                <span className="absolute inset-0 rounded-3xl border border-cyan-300/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                {item.label}
              </motion.div>
            ))}
          </div>
          <div className="absolute bottom-4 left-6 flex items-center gap-3 rounded-full border border-cyan-300/20 bg-slate-950/30 px-4 py-2 text-sm text-slate-300 shadow-[0_0_40px_rgba(79,247,228,0.08)]">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(79,247,228,0.6)]" />
            Real-time quantum particle engine
          </div>
        </div>
      </div>
    </section>
  );
}
