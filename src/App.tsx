import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import DemoCircuits from './components/landing/DemoCircuits';
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
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-white">
      <ParticleBackground />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <Hero />
                <Features />
                <DemoCircuits />
                <About />
                <Footer />
              </motion.main>
            }
          />
          <Route
            path="/simulator"
            element={
              <motion.main
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative z-10"
              >
                <ExecutionViewer />
              </motion.main>
            }
          />
          <Route
            path="*"
            element={
              <motion.div className="px-6 py-32 text-center text-muted">Page not found.</motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <Toast {...toastProps} />
    </div>
  );
}

export default App;
