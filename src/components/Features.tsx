import { motion } from 'framer-motion';
import { featureCards } from '../data/features';

const accentClasses: Record<string, string> = {
  cyan: 'from-cyan-300/50 to-cyan-500/20',
  violet: 'from-violet-400/50 to-fuchsia-500/15',
  pink: 'from-pink-400/50 to-fuchsia-400/15',
  blue: 'from-sky-400/50 to-cyan-400/15',
  teal: 'from-teal-400/50 to-cyan-300/15',
  gold: 'from-amber-400/40 to-slate-800/15',
};

export default function Features() {
  return (
    <section id="features" className="relative px-6 pb-24 pt-10 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Platform features</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Quantum workflow designed for speed, clarity, and impact.
          </h2>
          <p className="text-base leading-7 text-slate-400">
            Everything you need to design, debug, and analyze quantum circuits in one polished interface.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
            <motion.article
              key={feature.title}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass-card overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_0_40px_rgba(79,247,228,0.08)]"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))` }}
            >
              <div className={`mb-5 h-12 w-12 rounded-3xl bg-gradient-to-br ${accentClasses[feature.accent]} shadow-[0_0_34px_rgba(79,247,228,0.18)]`} />
              <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{feature.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Explore
                <span aria-hidden="true">→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
