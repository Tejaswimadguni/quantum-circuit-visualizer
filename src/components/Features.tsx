import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { featureCards } from '../data/features';
import FeatureIcon from './landing/FeatureIcon';

const accentBorder: Record<string, string> = {
  cyan: 'group-hover:border-accent-cyan/40 group-hover:shadow-glow',
  violet: 'group-hover:border-accent-violet/40 group-hover:shadow-glow-violet',
};

const accentIcon: Record<string, string> = {
  cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/25',
  violet: 'text-accent-violet bg-accent-violet/10 border-accent-violet/25',
};

export default function Features() {
  return (
    <section id="features" className="section-pad border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Everything you need to explore quantum circuits
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            From circuit design to step-by-step execution analysis — built for researchers, students, and
            curious builders.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className={`group rounded-2xl border border-slate-700/50 bg-surface p-6 shadow-card transition-all duration-300 ${accentBorder[feature.accent]}`}
            >
              <div
                className={`mb-5 inline-flex rounded-xl border p-3 ${accentIcon[feature.accent]}`}
              >
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/simulator"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan transition hover:text-cyan-400"
          >
            Open the simulator
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
