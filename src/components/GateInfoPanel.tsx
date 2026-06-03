import React from 'react';
import { GATE_DOCS } from '../constants/gateDocs';
import { gateOptions } from '../constants/gates';

type Props = {
  selectedGate: string | null;
  focusedEntry?: { gate: string; qubit?: number; control?: number; target?: number; angle?: number } | null;
};

export default function GateInfoPanel({ selectedGate, focusedEntry }: Props) {
  const gateId = focusedEntry?.gate ?? selectedGate ?? null;
  if (!gateId) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gate information</p>
        <h4 className="mt-2 text-lg font-semibold text-white">No gate selected</h4>
        <p className="mt-2 text-sm text-slate-400">Select a gate or click a placed gate to view details.</p>
      </div>
    );
  }

  const doc = GATE_DOCS[gateId] ?? null;
  const option = gateOptions.find((g) => g.id === gateId);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gate information</p>
      <h4 className="mt-2 text-lg font-semibold text-white">{doc?.name ?? option?.label ?? gateId}</h4>

      <p className="mt-3 text-sm text-slate-300">{doc?.description ?? option?.details}</p>

      {doc?.math && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mathematical effect</p>
          <pre className="mt-1 rounded-2xl bg-slate-900/80 p-3 text-sm text-amber-200">{doc.math}</pre>
        </div>
      )}

      {doc?.example && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Example</p>
          <p className="mt-1 text-sm text-slate-300">{doc.example}</p>
        </div>
      )}
    </div>
  );
}
