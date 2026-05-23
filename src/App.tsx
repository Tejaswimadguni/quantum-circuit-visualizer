import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import SimulatorPage from './components/SimulatorPage';
import ExecutionViewer from './components/ExecutionViewer';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ParticleBackground from './components/ParticleBackground';
import { useMemo, useState } from 'react';

function App() {
  const location = useLocation();
  const [toast, setToast] = useState('');

  const toastProps = useMemo(
    () => ({ message: toast, onDismiss: () => setToast('') }),
    [toast]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,247,228,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(159,125,255,0.14),_transparent_24%),linear-gradient(180deg,_#050816,_#02040f)] text-slate-100">
      <ParticleBackground />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.main
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="relative z-10"
              >
                <Hero />
                <Features />
                <Footer />
              </motion.main>
            }
          />
          <Route
            path="/simulator"
            element={
              <motion.main
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-10"
              >
                <SimulatorPage showToast={setToast} />
                <Footer />
              </motion.main>
            }
          />
          <Route
            path="/execution"
            element={
              <motion.main
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-10"
              >
                <ExecutionViewer />
              </motion.main>
            }
          />
          <Route
            path="*"
            element={<motion.div className="px-6 py-32">Page not found.</motion.div>}
          />
        </Routes>
      </AnimatePresence>
      <Toast {...toastProps} />
    </div>
  );
}

export default App;
