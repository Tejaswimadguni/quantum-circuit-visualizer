import { useState } from 'react';
import type { AlgorithmTemplate } from '../utils/algorithmTemplates';

type QuantumAlgorithmLibraryProps = {
  algorithms: AlgorithmTemplate[];
  onLoad: (template: AlgorithmTemplate) => void;
};

export default function QuantumAlgorithmLibrary({ algorithms, onLoad }: QuantumAlgorithmLibraryProps) {
  const [selectedId, setSelectedId] = useState<string>(algorithms[0]?.id ?? '');
  const selected = algorithms.find((algorithm) => algorithm.id === selectedId) ?? algorithms[0];

  if (!selected) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#06102f]/95 p-6 shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Algorithm library</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Load a quantum template</h2>
        </div>
        <button
          type="button"
          onClick={() => onLoad(selected)}
          className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Load circuit
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-2">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              type="button"
              onClick={() => setSelectedId(algorithm.id)}
              className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
                selectedId === algorithm.id
                  ? 'border-cyan-300/80 bg-cyan-400/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-400/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">{algorithm.name}</p>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-200">
                  {algorithm.category}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{algorithm.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#071026]/95 p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Selected algorithm</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{selected.name}</h3>
          </div>
          <p className="text-sm leading-6 text-slate-300">{selected.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Difficulty</p>
              <p className="mt-2 font-semibold text-white">{selected.difficulty}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Qubits</p>
              <p className="mt-2 font-semibold text-white">{selected.requiredQubits}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gate count</p>
              <p className="mt-2 font-semibold text-white">{selected.entries.length}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Circuit preview</p>
            <div className="mt-3 space-y-2 max-h-48 overflow-auto pr-2 text-sm text-slate-300">
              {selected.entries.map((entry, index) => (
                <div
                  key={`${entry.gate}-${index}-${entry.qubit}-${entry.column}`}
                  className="rounded-2xl bg-slate-900/80 px-3 py-2"
                >
                  <p>
                    <span className="font-semibold text-white">{entry.gate}</span>
                    {` on q${entry.qubit} at column ${entry.column + 1}`}
                    {entry.gate === 'CNOT' ? ` (ctrl: q${entry.control}, tgt: q${entry.target})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
