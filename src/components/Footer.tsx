import { Link } from 'react-router-dom';

const stack = ['React', 'TypeScript', 'Flask', 'Qiskit'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-surface/50 px-6 py-14 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/30 bg-canvas text-accent-cyan">
                ⚛
              </div>
              <span className="text-lg font-semibold text-white">CirQuant</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              A professional quantum circuit visualizer for building, simulating, and understanding
              quantum algorithms with real Qiskit-powered execution.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white">Navigate</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <Link to="/" className="transition hover:text-accent-cyan">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="transition hover:text-accent-cyan">
                  Simulator
                </Link>
              </li>
              <li>
                <a href="/#features" className="transition hover:text-accent-cyan">
                  Features
                </a>
              </li>
              <li>
                <a href="/#about" className="transition hover:text-accent-cyan">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white">Built with</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-muted">© {year} CirQuant — Quantum Circuit Visualizer. All rights reserved.</p>
          <a
            href="https://github.com/Tejaswimadguni/quantum-circuit-visualizer"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent-cyan transition hover:text-cyan-400"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
}
