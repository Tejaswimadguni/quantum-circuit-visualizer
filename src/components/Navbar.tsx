import { motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const routeLinks = [
  { label: 'Home', to: '/' },
  { label: 'Simulator', to: '/simulator' },
];

const sectionLinks = [
  { label: 'Features', id: 'features' },
  { label: 'About', id: 'about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }

    const ids = sectionLinks.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const scrollToSection = (id: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinkClass = (active: boolean) =>
    `relative px-0.5 py-1 text-sm font-medium transition-colors duration-200 ${
      active ? 'text-accent-cyan' : 'text-muted hover:text-white'
    }`;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-30 border-b border-slate-800/80 bg-canvas/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/30 bg-surface text-accent-cyan">
            <span className="text-lg" aria-hidden>
              ⚛
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">CirQuant</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {routeLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => window.scrollTo(0, 0)}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {link.label}
              {link.to === '/' && location.pathname === '/' && !activeSection && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent-cyan" />
              )}
            </NavLink>
          ))}
          {sectionLinks.map((link) => {
            const active = isHome && activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`${navLinkClass(active)} bg-transparent`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent-cyan" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Tejaswimadguni/quantum-circuit-visualizer"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg border border-slate-700 bg-surface px-4 py-2 text-sm text-muted transition hover:border-accent-cyan/40 hover:text-white sm:inline-flex"
          >
            GitHub
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-surface text-white lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-canvas px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {routeLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="py-2 text-muted hover:text-white"
                onClick={() => {
                  setOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                {link.label}
              </NavLink>
            ))}
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className="py-2 text-left text-muted hover:text-white"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://github.com/Tejaswimadguni/quantum-circuit-visualizer"
              target="_blank"
              rel="noreferrer"
              className="py-2 text-muted hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
