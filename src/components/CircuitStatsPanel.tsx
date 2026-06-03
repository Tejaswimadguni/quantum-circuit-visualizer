import React from 'react';

type Props = {
  qubits: number;
  gateCount: number;
  circuitDepth: number;
  measurements: number;
  entangling: number;
};

export default function CircuitStatsPanel({ qubits, gateCount, circuitDepth, measurements, entangling }: Props) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Circuit statistics</p>
      <h4 className="mt-2 text-lg font-semibold text-white">Overview</h4>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Qubits</p>
          <p className="mt-1 font-semibold text-white">{qubits}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Gate count</p>
          <p className="mt-1 font-semibold text-white">{gateCount}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Circuit depth</p>
          <p className="mt-1 font-semibold text-white">{circuitDepth}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Measurements</p>
          <p className="mt-1 font-semibold text-white">{measurements}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Entangling gates</p>
          <p className="mt-1 font-semibold text-white">{entangling}</p>
        </div>
      </div>
    </div>
  );
}
