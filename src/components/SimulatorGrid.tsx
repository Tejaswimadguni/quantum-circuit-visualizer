import { motion } from 'framer-motion';
import { gateAccentClasses } from '../constants/gates';

type SimulatorGridProps = {
  qubits: string[];
  grid: Array<Array<string | null>>;
  selectedCell: { row: number; column: number } | null;
  selectedGate: string | null;
  onCellClick: (row: number, column: number) => void;
  onRowHover: (row: number | null) => void;
  activeRow: number | null;
  gateCount: number;
  executingCell: { row: number; column: number } | null;
};

export default function SimulatorGrid({
  qubits,
  grid,
  selectedCell,
  selectedGate,
  onCellClick,
  onRowHover,
  activeRow,
  gateCount,
  executingCell,
}: SimulatorGridProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#06102f]/90 p-5 shadow-glow">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Quantum timeline</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Circuit grid</h3>
        </div>
        <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-max sm:items-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(79,247,228,0.45)]" />
            {gateCount} gates placed
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Selected gate: <span className="font-semibold text-white">{selectedGate ?? 'None'}</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div className="w-full space-y-4">
          <div className="grid min-w-0 w-full grid-cols-[90px_repeat(7,minmax(0,1fr))] gap-3 px-1 text-xs uppercase tracking-[0.28em] text-slate-500 sm:text-sm">
            <div className="flex items-center justify-center rounded-3xl bg-[#07111e]/90 px-4 py-3">Qubit</div>
            {grid[0].map((_, index) => (
              <div key={index} className="flex items-center justify-center rounded-3xl bg-[#07111e]/90 px-4 py-3">
                {index + 1}
              </div>
            ))}
          </div>

          {grid.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`relative grid grid-cols-[90px_repeat(7,minmax(0,1fr))] gap-3 px-1 ${activeRow === rowIndex ? 'bg-white/5' : ''}`}
              onMouseEnter={() => onRowHover(rowIndex)}
              onMouseLeave={() => onRowHover(null)}
            >
              <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px rounded-full bg-gradient-to-r from-cyan-300/20 via-transparent to-fuchsia-300/20" />
              <motion.span
                className="pointer-events-none absolute top-1/2 h-1 w-28 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300/70 to-transparent opacity-70"
                animate={{ x: ['-20%', '120%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="flex items-center justify-center rounded-3xl bg-[#07111e]/90 px-4 py-3 text-sm font-semibold text-white">
                q{rowIndex}
              </div>
              {row.map((cell, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell.column === colIndex;
                const isExecuting = executingCell?.row === rowIndex && executingCell.column === colIndex;
                const cellAccent = cell ? gateAccentClasses[cell] ?? 'from-cyan-400 to-blue-500' : 'from-white/5 to-white/5';

                return (
                  <motion.button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    animate={isExecuting ? { scale: [1, 1.02, 1] } : undefined}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    className={`group relative overflow-hidden rounded-[1.75rem] border px-3 py-4 text-sm font-semibold transition duration-200 ${
                      cell
                        ? `border-transparent bg-gradient-to-br ${cellAccent} text-cyan-100 shadow-[0_0_24px_rgba(79,247,228,0.18)]`
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-400/10'
                    } ${isSelected ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-[#050816]' : ''} ${isExecuting ? 'border-cyan-300/70 bg-cyan-400/15 shadow-[0_0_28px_rgba(79,247,228,0.24)]' : ''}`}
                    title={cell ? 'Click to remove gate' : selectedGate ? 'Click to place selected gate' : 'Select a gate first'}
                  >
                    {isExecuting && (
                      <span className="absolute inset-0 rounded-[1.75rem] border border-cyan-300/30 bg-cyan-400/10 opacity-90 shadow-[0_0_30px_rgba(79,247,228,0.22)] animate-pulse-slow" />
                    )}
                    <span className="relative z-10 block truncate leading-5">
                      {cell || '+'}
                    </span>
                    {cell && (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-300 to-blue-500 opacity-80" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
