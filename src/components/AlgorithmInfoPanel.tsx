import React from 'react';
import type { AlgorithmTemplate } from '../utils/algorithmTemplates';

type Props = {
  algorithm: AlgorithmTemplate | null;
};

export default function AlgorithmInfoPanel({ algorithm }: Props) {
  if (!algorithm) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Algorithm info</p>
        <h4 className="mt-2 text-lg font-semibold text-white">No algorithm loaded</h4>
        <p className="mt-2 text-sm text-slate-400">Load an algorithm template to view additional context.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Algorithm info</p>
      <h4 className="mt-2 text-lg font-semibold text-white">{algorithm.name}</h4>
      <p className="mt-2 text-sm text-slate-300">{algorithm.description}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Difficulty</p>
          <p className="mt-1 font-semibold text-white">{algorithm.difficulty}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Qubits</p>
          <p className="mt-1 font-semibold text-white">{algorithm.requiredQubits}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Gate count</p>
          <p className="mt-1 font-semibold text-white">{algorithm.entries.length}</p>
        </div>
      </div>

      {(algorithm as any).historical && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Historical significance</p>
          <p className="mt-1 text-sm text-slate-300">{(algorithm as any).historical}</p>
        </div>
      )}

      {(algorithm as any).applications && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Applications</p>
          <p className="mt-1 text-sm text-slate-300">{(algorithm as any).applications}</p>
        </div>
      )}
    </div>
  );
}
