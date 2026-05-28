import { motion } from 'framer-motion';

const capabilities = [
  'Unlimited qubit support',
  'Interactive gate placement',
  'Real-time quantum simulation',
  'Execution playback controls',
  'Pause, replay and reverse execution',
  'Bloch sphere visualization',
  'Probability evolution tracking',
  'IBM Qiskit backend integration',
];

export default function About() {
  return (
    <section
      id="about"
      className="relative px-6 pb-28 pt-10 sm:px-10 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">
            About the platform
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Built to simplify quantum computing visualization.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Quantum Visualizer is an interactive quantum computing platform
            designed to make circuit simulation, execution tracking and
            state visualization easier to understand.
          </p>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Users can build quantum circuits visually, simulate them in
            real-time, inspect Bloch sphere rotations, analyze probability
            evolution and replay execution step-by-step through an immersive
            futuristic interface.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/10 bg-[#071120]/90 p-8 shadow-glow"
          >
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/70">
                  Core capabilities
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Everything needed for quantum experimentation.
                </h3>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 sm:flex">
                ⚛
              </div>
            </div>

            {/* CAPABILITIES */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                >
                  <div className="flex items-start gap-3">
                    
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(79,247,228,0.8)]" />

                    <span>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#071120]/90 p-8 shadow-glow"
          >
            
            <p className="text-sm uppercase tracking-[0.28em] text-violet-300/70">
              Why this platform
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-white">
              Designed for interactive learning and visualization.
            </h3>

            <div className="mt-8 space-y-6 text-slate-300">
              
              <p className="leading-8">
                Traditional quantum computing tools can often feel complex
                and inaccessible for beginners.
              </p>

              <p className="leading-8">
                Quantum Visualizer focuses on intuitive circuit design,
                immersive execution playback and futuristic visual feedback
                to make quantum concepts easier to understand.
              </p>

              <p className="leading-8">
                The platform combines modern frontend technologies with
                IBM Qiskit simulation capabilities to create a powerful
                and engaging quantum experimentation environment.
              </p>
            </div>

            {/* TECH STACK */}
            <div className="mt-10 flex flex-wrap gap-3">
              
              {[
                'React',
                'TypeScript',
                'TailwindCSS',
                'Framer Motion',
                'Flask',
                'IBM Qiskit',
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-cyan-100"
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}