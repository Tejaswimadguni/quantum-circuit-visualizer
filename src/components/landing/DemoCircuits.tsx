import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const demos = [
  {
    demoId: 'bell',
    title: 'Bell State',
    description:
      'Creates maximal entanglement between two qubits. The canonical (|00⟩ + |11⟩)/√2 demonstration of quantum correlation.',
    tags: ['2 qubits', 'Entanglement'],
  },
  {
    demoId: 'entanglement',
    title: 'GHZ State',
    description:
      'Generalizes Bell states to three qubits, producing (|000⟩ + |111⟩)/√2 — a multipartite entangled state.',
    tags: ['3 qubits', 'GHZ'],
  },
  {
    demoId: 'superposition',
    title: 'Superposition Demo',
    description:
      'Applies Hadamard gates across qubits to build uniform superposition and explore interference patterns.',
    tags: ['3 qubits', 'Hadamard'],
  },
  {
    demoId: 'bell',
    title: 'Quantum Entanglement',
    description:
      'Explore how Hadamard and CNOT combine to produce correlated measurement outcomes — the foundation of quantum protocols.',
    tags: ['2 qubits', 'Bell pair'],
  },
];

export default function DemoCircuits() {
  const navigate = useNavigate();

  const openDemo = (demoId: string) => {
    navigate(`/simulator?demo=${encodeURIComponent(demoId)}`);
    window.scrollTo(0, 0);
  };

  return (
    <section id="demos" className="section-pad">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">Examples</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Try Popular Quantum Circuits
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Load a curated circuit into the simulator and explore real Qiskit simulation with full execution playback.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {demos.map((demo, index) => (
            <motion.article
              key={`${demo.demoId}-${demo.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col rounded-2xl border border-slate-700/50 bg-surface p-6 shadow-card transition-shadow hover:border-accent-cyan/30 hover:shadow-glow"
            >
              <div className="flex flex-wrap gap-2">
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700/80 bg-canvas px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{demo.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{demo.description}</p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openDemo(demo.demoId)}
                className="mt-6 w-full rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 py-2.5 text-sm font-semibold text-accent-cyan transition-colors hover:bg-accent-cyan/20 sm:w-auto sm:px-6"
              >
                Open in Simulator
              </motion.button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
