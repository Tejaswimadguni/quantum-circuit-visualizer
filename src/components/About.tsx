import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Real Quantum Backend',
    description: 'Every simulation runs through Qiskit with genuine statevector evolution and shot-based results.',
    accent: 'cyan' as const,
  },
  {
    title: 'Execution Playback Engine',
    description: 'Scrub through gates with play, pause, step controls, and automatic timeline synchronization.',
    accent: 'violet' as const,
  },
  {
    title: 'Bloch Sphere Visualizer',
    description: 'See how each qubit state maps onto the Bloch sphere as your circuit executes.',
    accent: 'cyan' as const,
  },
  {
    title: 'State Evolution Analysis',
    description: 'Inspect formatted quantum states before and after every gate in your circuit.',
    accent: 'violet' as const,
  },
  {
    title: 'Probability Tracking',
    description: 'Compare measurement probabilities across steps with clear before/after panels.',
    accent: 'cyan' as const,
  },
  {
    title: 'Interactive Learning Experience',
    description: 'Gate-level explanations and visual feedback designed to make quantum concepts tangible.',
    accent: 'violet' as const,
  },
];

export default function About() {
  return (
    <section id="about" className="section-pad border-t border-slate-800/50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent-violet">About</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Why This Platform?
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            CirQuant bridges visual circuit design with rigorous quantum simulation — so you can build
            intuition without sacrificing correctness.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border border-slate-700/50 bg-surface p-6 shadow-card transition-all ${
                item.accent === 'cyan'
                  ? 'hover:border-accent-cyan/35 hover:shadow-glow'
                  : 'hover:border-accent-violet/35 hover:shadow-glow-violet'
              }`}
            >
              <div
                className={`mb-4 h-1 w-10 rounded-full ${
                  item.accent === 'cyan' ? 'bg-accent-cyan' : 'bg-accent-violet'
                }`}
              />
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap justify-center gap-3"
        >
          {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Flask', 'Qiskit'].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700/80 bg-canvas px-4 py-1.5 text-sm text-muted"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
