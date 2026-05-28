import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:px-10 lg:px-12">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-circuit-grid opacity-50" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
        
        {/* HERO CONTENT */}
        <div className="flex flex-col items-center text-center gap-10">
          
          {/* TOP BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200 shadow-glow"
          >
            Quantum Computing Platform
          </motion.div>

          {/* MAIN TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl"
          >
            Build, simulate and visualize quantum circuits in real time.
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-3xl text-lg leading-8 text-slate-300"
          >
            Interactive quantum circuit design with live execution playback,
            Bloch sphere visualization, execution analytics and IBM Qiskit
            integration — all in one futuristic interface.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4"
          >
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/simulator');
              }}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 shadow-[0_0_40px_rgba(79,247,228,0.12)] transition duration-200 hover:bg-cyan-400/20"
            >
              Launch Simulator
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/execution');
              }}
              className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-200 hover:border-cyan-300/50 hover:text-cyan-200"
            >
              View Execution Demo
            </motion.button>
          </motion.div>
        </div>

        {/* LIVE EXECUTION PREVIEW */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#071120]/90 p-8 shadow-glow">
          
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,247,228,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(159,125,255,0.12),_transparent_24%)]" />

          <div className="relative flex flex-col gap-8">
            
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/70">
                  Live Quantum Execution
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Real-time circuit visualization
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(79,247,228,0.8)]" />
                Backend Connected
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              
              {/* CIRCUIT PREVIEW */}
              <div className="rounded-[1.5rem] border border-white/10 bg-[#061025]/90 p-6">
                
                <div className="mb-6 flex items-center justify-between">
                  
                  <span className="text-sm uppercase tracking-[0.22em] text-slate-400">
                    Active Circuit
                  </span>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    Running
                  </span>
                </div>

                <div className="space-y-10">
                  
                  {/* q0 */}
                  <div className="flex items-center gap-4">
                    
                    <span className="w-10 text-sm text-slate-400">
                      q0
                    </span>

                    <div className="relative h-[2px] flex-1 bg-white/10">
                      
                      {/* Moving Particle */}
                      <motion.div
                        animate={{ x: [0, 420, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 4,
                          ease: 'linear',
                        }}
                        className="absolute top-[-4px] h-[10px] w-[10px] rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(79,247,228,0.9)]"
                      />

                      {/* H Gate */}
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 12px rgba(79,247,228,0.2)',
                            '0 0 28px rgba(79,247,228,0.6)',
                            '0 0 12px rgba(79,247,228,0.2)',
                          ],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                        className="absolute left-[20%] top-[-18px] flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold text-cyan-100"
                      >
                        H
                      </motion.div>

                      {/* X Gate */}
                      <div className="absolute left-[70%] top-[-18px] flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-sm font-semibold text-violet-100">
                        X
                      </div>
                    </div>
                  </div>

                  {/* q1 */}
                  <div className="flex items-center gap-4">
                    
                    <span className="w-10 text-sm text-slate-400">
                      q1
                    </span>

                    <div className="relative h-[2px] flex-1 bg-white/10">
                      
                      <div className="absolute left-[70%] top-[-18px] flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-sm font-semibold text-violet-100">
                        X
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDE PANELS */}
              <div className="grid gap-4">
                
                {/* STATUS */}
                <div className="rounded-[1.5rem] border border-white/10 bg-[#061025]/90 p-5">
                  
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    System Status
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />

                    <span className="text-lg font-semibold text-emerald-200">
                      Ready to Simulate
                    </span>
                  </div>
                </div>

                {/* ENGINE */}
                <div className="rounded-[1.5rem] border border-white/10 bg-[#061025]/90 p-5">
                  
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Quantum Engine
                  </p>

                  <h4 className="mt-3 text-2xl font-semibold text-cyan-100">
                    IBM Qiskit
                  </h4>
                </div>

                {/* VISUALIZATION */}
                <div className="rounded-[1.5rem] border border-white/10 bg-[#061025]/90 p-5">
                  
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Visualization
                  </p>

                  <h4 className="mt-3 text-2xl font-semibold text-violet-100">
                    Bloch Sphere
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}