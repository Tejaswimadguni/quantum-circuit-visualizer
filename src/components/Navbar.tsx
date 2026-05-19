import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Simulator', to: '/simulator' },
  { label: 'Features', to: '#features' },
  { label: 'About', to: '#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="sticky top-0 z-30 mx-auto w-full border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-white/5 shadow-glow">
            ⚛
          </div>
          Quantum Visualizer
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition duration-200 ${isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-cyan-200'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition-all duration-200 hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-cyan-100"
          >
            GitHub
          </a>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-300/50 hover:bg-cyan-400/10 lg:hidden"
            onClick={() => setOpen((state) => !state)}
            aria-label="Toggle navigation"
          >
            <span className="text-xl">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#050816]/95 px-6 pb-6">
          <div className="flex flex-col gap-4 py-4">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="text-slate-200 hover:text-cyan-200"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}
