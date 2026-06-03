import React from 'react';

type Props = {
  finalCounts: Record<string, number> | null;
  finalProbabilities: Record<string, number> | null;
};

export default function ExecutionSummaryPanel({ finalCounts, finalProbabilities }: Props) {
  if (!finalCounts || !finalProbabilities) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Execution summary</p>
        <h4 className="mt-2 text-lg font-semibold text-white">No execution yet</h4>
        <p className="mt-2 text-sm text-slate-400">Run the circuit to see final state and measurement results.</p>
      </div>
    );
  }

  const sorted = Object.entries(finalProbabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([state, prob]) => ({ state, prob }));

  const mostLikely = sorted[0];

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#071026]/90 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Execution summary</p>
      <h4 className="mt-2 text-lg font-semibold text-white">Final state & measurements</h4>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Most likely state</p>
          <p className="mt-1 font-semibold text-white">{mostLikely?.state ?? '—'}</p>
          <p className="text-xs text-slate-400">Probability: {(mostLikely?.prob ?? 0) * 100}%</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-sm">
          <p className="text-xs text-slate-400">Measurements (counts)</p>
          <div className="mt-2 space-y-1 text-sm text-slate-300">
            {Object.entries(finalCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([state, count]) => (
                <div key={state} className="flex items-center justify-between">
                  <span>{state}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Probability distribution</p>
        <div className="mt-2 max-h-48 overflow-auto text-sm text-slate-300">
          {sorted.map((s) => (
            <div key={s.state} className="flex items-center justify-between py-1">
              <span className="text-slate-200">{s.state}</span>
              <span className="text-slate-300">{Math.round(s.prob * 10000) / 100}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/5 p-3">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Key takeaway</p>
        <p className="mt-1 text-sm text-slate-300">The distribution above shows the most likely measurement outcomes for this circuit.</p>
      </div>
    </div>
  );
}
