import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import EmptyState from './EmptyState';
import SimulatorGrid from './SimulatorGrid';
import BlochSphere from './BlochSphere';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { gateOptions } from '../constants/gates';
import {
  buildCircuitJson,
  buildGrid,
  createCircuitEntries,
  demoCircuits,
  getCircuitDepth,
  getGateCount,
  CircuitEntry,
} from '../utils/circuit';

const initialQubits = ['q0', 'q1', 'q2'];
const initialLogs = ['Ready. Select a gate and place it on the grid.'];
const API_BASE_URL = 'http://localhost:5000';

export default function SimulatorPage({ showToast }: { showToast: (message: string) => void }) {
  const [selectedGate, setSelectedGate] = useState<string | null>('H');
  const [selectedCell, setSelectedCell] = useState<{ row: number; column: number } | null>(null);
  const [qubits, setQubits] = useState(initialQubits);
  const [circuitEntries, setCircuitEntries] = useState<CircuitEntry[]>(createCircuitEntries(initialQubits.length));
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [serverCounts, setServerCounts] = useState<Record<string, number> | null>(null);
  const [serverProbabilities, setServerProbabilities] = useState<Record<string, number> | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendStatusMessage, setBackendStatusMessage] = useState('Checking backend...');
  const [requestTimeMs, setRequestTimeMs] = useState<number | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeExecutionStep, setActiveExecutionStep] = useState<number>(-1);
  const [showBlochPanel, setShowBlochPanel] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/health`)
      .then((response) => response.json())
      .then((json) => {
        if (!isMounted) {
          return;
        }

        if (json?.status === 'ok') {
          setBackendConnected(true);
          setBackendStatusMessage('Backend connected');
        } else {
          setBackendConnected(false);
          setBackendStatusMessage('Backend unavailable');
        }
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setBackendConnected(false);
        setBackendStatusMessage('Backend unavailable');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const grid = useMemo(() => buildGrid(circuitEntries, qubits.length), [circuitEntries, qubits.length]);
  const gateCount = useMemo(() => getGateCount(circuitEntries), [circuitEntries]);
  const circuitDepth = useMemo(() => getCircuitDepth(circuitEntries), [circuitEntries]);
  const circuitJson = useMemo(() => buildCircuitJson(circuitEntries, qubits.length), [circuitEntries, qubits.length]);
  const executionSequence = useMemo(
    () => [...circuitEntries].sort((a, b) => a.column - b.column || a.qubit - b.qubit),
    [circuitEntries]
  );
  const activeExecutionGate = executionSequence[activeExecutionStep] ?? null;
  const activeExecutionCell = activeExecutionGate
    ? { row: activeExecutionGate.qubit, column: activeExecutionGate.column }
    : null;
  const probabilityEntries = useMemo(() => {
    if (!serverProbabilities) {
      return [];
    }
    return Object.entries(serverProbabilities)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value: Math.round(value * 100) }));
  }, [serverProbabilities]);
  const measuredStateEntries = useMemo(() => {
    if (!serverCounts) {
      return [];
    }
    return Object.entries(serverCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([state, count]) => ({ state, count }));
  }, [serverCounts]);
  const scientificFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 4,
        notation: 'scientific',
      }),
    []
  );
  const stateVectorEntries = useMemo(
    () =>
      probabilityEntries.slice(0, 4).map((entry) => ({
        state: entry.label,
        amplitude: scientificFormatter.format(entry.value / 100),
      })),
    [probabilityEntries, scientificFormatter]
  );
  const blochStates = useMemo(() => {
    const counts = serverCounts;
    const total = counts ? Object.values(counts).reduce((sum, value) => sum + value, 0) : 0;

    return qubits.map((label, index) => {
      const p0 = counts && total > 0
        ? Object.entries(counts).reduce((sum, [state, value]) => {
            const bit = state[state.length - 1 - index] ?? '0';
            return sum + (bit === '0' ? value : 0);
          }, 0) / total
        : 0.5;

      const p1 = 1 - p0;
      const z = Math.min(1, Math.max(-1, p0 - p1));
      const theta = Math.acos(z);
      const phi = index * 1.7 + Math.PI / 4;

      return {
        label,
        probabilityZero: p0,
        probabilityOne: p1,
        vector: [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), z] as [number, number, number],
        color: ['#5eead4', '#f472b6', '#7c3aed', '#22d3ee'][index % 4],
      };
    });
  }, [serverCounts, qubits]);

  const topProbabilities = probabilityEntries.slice(0, 3);
  const pieChartStyle = useMemo(() => {
    if (!topProbabilities.length) {
      return {};
    }

    const colors = ['rgba(79,247,228,0.92)', 'rgba(159,125,255,0.92)', 'rgba(236,72,153,0.92)', 'rgba(148,163,184,0.24)'];
    let start = 0;
    const segments = topProbabilities.map((entry, index) => {
      const end = start + entry.value;
      const segment = `${colors[index] ?? colors[3]} ${start}% ${end}%`;
      start = end;
      return segment;
    });

    if (start < 100) {
      segments.push(`${colors[3]} ${start}% 100%`);
    }

    return {
      background: `conic-gradient(${segments.join(', ')})`,
    } as Record<string, string>;
  }, [topProbabilities]);

  const executionLabel = isLoading
    ? activeExecutionGate
      ? `Running ${activeExecutionGate.gate} on q${activeExecutionGate.qubit}`
      : 'Warming up quantum engine...'
    : serverCounts
    ? 'Quantum execution complete'
    : 'Awaiting run command';

  useEffect(() => {
    if (!isLoading || executionSequence.length === 0) {
      setActiveExecutionStep(-1);
      return;
    }

    setActiveExecutionStep(0);
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      setActiveExecutionStep((current) => (current + 1 < executionSequence.length ? current + 1 : current));
      if (step >= executionSequence.length) {
        window.clearInterval(interval);
      }
    }, 420);

    return () => {
      window.clearInterval(interval);
    };
  }, [executionSequence.length, isLoading]);

  const executionStats = useMemo(
    () => ({
      executionTime: requestTimeMs !== null ? `${requestTimeMs} ms` : 'Pending',
      qubitCount: qubits.length,
      gateCount,
      backendState: isLoading ? 'Running' : serverCounts ? 'Completed' : 'Ready',
    }),
    [requestTimeMs, qubits.length, gateCount, isLoading, serverCounts]
  );

  const progressValue = isLoading ? 72 : serverCounts ? 100 : 0;

  const pushLog = (message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 8));
  };

  const buildApiPayload = () => {
    return circuitEntries.map((entry) => {
      if (entry.gate === 'CNOT') {
        const control = entry.control ?? entry.qubit;
        const target = entry.target ?? (entry.qubit < qubits.length - 1 ? entry.qubit + 1 : Math.max(0, entry.qubit - 1));
        return {
          gate: 'CNOT',
          control,
          target,
          column: entry.column,
        };
      }

      return {
        gate: entry.gate,
        qubit: entry.qubit,
        column: entry.column,
      };
    });
  };

  const executeBackendSimulation = async () => {
    setServerError(null);
    setServerCounts(null);
    setServerProbabilities(null);
    setRequestTimeMs(null);
    setIsLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildApiPayload()),
      });

      const endTime = performance.now();
      setRequestTimeMs(Math.round(endTime - startTime));

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || 'Backend simulation failed.');
      }

      setServerCounts(json.counts || null);
      setServerProbabilities(json.probabilities || null);
      pushLog('Backend simulation returned successfully.');
      setBackendConnected(true);
      setBackendStatusMessage('Backend connected');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Backend error occurred.';
      setServerError(message);
      pushLog(`Backend simulation error: ${message}`);
      showToast(`Backend simulation failed: ${message}`);
      setBackendConnected(false);
      setBackendStatusMessage('Backend unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCircuitEntries = (entries: CircuitEntry[]) => {
    setCircuitEntries(entries);
    setServerError(null);
    setServerCounts(null);
    setServerProbabilities(null);
    setRequestTimeMs(null);
  };

  const handleGateSelect = (gate: string) => {
    setSelectedGate(gate);
    pushLog(`Selected ${gate} gate.`);
    showToast(`${gate} selected.`);
  };

  const placeOrRemoveGate = (row: number, column: number) => {
    setSelectedCell({ row, column });
    const existing = circuitEntries.find((entry) => entry.qubit === row && entry.column === column);

    if (existing) {
      updateCircuitEntries(circuitEntries.filter((entry) => !(entry.qubit === row && entry.column === column)));
      pushLog(`Removed ${existing.gate} from q${row} column ${column + 1}.`);
      showToast('Gate removed.');
      return;
    }

    if (!selectedGate) {
      showToast('Select a gate first.');
      return;
    }

    if (selectedGate === 'CNOT') {
      if (qubits.length < 2) {
        showToast('CNOT requires at least two qubits.');
        return;
      }

      const target = row < qubits.length - 1 ? row + 1 : row - 1;
      updateCircuitEntries([
        ...circuitEntries,
        {
          gate: 'CNOT',
          qubit: row,
          column,
          control: row,
          target,
        },
      ]);
      pushLog(`Placed CNOT with control q${row} and target q${target} at column ${column + 1}.`);
      showToast('CNOT gate placed.');
      return;
    }

    updateCircuitEntries([...circuitEntries, { gate: selectedGate, qubit: row, column }]);
    pushLog(`Placed ${selectedGate} on q${row} column ${column + 1}.`);
    showToast(`${selectedGate} gate placed.`);
  };

  const handleAddQubit = () => {
    if (qubits.length >= 6) {
      showToast('Maximum qubit limit reached.');
      return;
    }

    const nextQubit = `q${qubits.length}`;
    setQubits((prev) => [...prev, nextQubit]);
    setSelectedCell(null);
    pushLog(`Added ${nextQubit} to the circuit.`);
    showToast(`${nextQubit} added.`);
  };

  const handleRemoveQubit = () => {
    if (qubits.length <= 1) {
      showToast('At least one qubit is required.');
      return;
    }

    const nextLength = qubits.length - 1;
    setQubits((prev) => prev.slice(0, -1));
    updateCircuitEntries(circuitEntries.filter((entry) => entry.qubit < nextLength));
    setSelectedCell((current) => (current && current.row < nextLength ? current : null));
    pushLog('Last qubit removed.');
    showToast('Qubit removed.');
  };

  const handleDemo = (demoName: string) => {
    const demoData = demoCircuits[demoName];
    if (!demoData) {
      return;
    }

    setQubits(demoData.qubits);
    updateCircuitEntries(demoData.entries);
    setSelectedCell(null);
    setSelectedGate('H');
    setModalOpen(false);
    pushLog(`Loaded ${demoName} demo circuit.`);
    showToast(`${demoName.charAt(0).toUpperCase() + demoName.slice(1)} demo loaded.`);
  };

  const runSimulation = async () => {
    if (isLoading) {
      return;
    }

    if (gateCount === 0) {
      showToast('Add at least one gate before simulating.');
      return;
    }

    setModalOpen(true);
    pushLog('Submitting circuit to backend.');
    showToast('Running backend simulation.');
    await executeBackendSimulation();
  };

  const clearSelection = () => {
    setSelectedGate(null);
    setSelectedCell(null);
    pushLog('Selection cleared.');
    showToast('Selection cleared.');
  };

  const deleteSelectedCell = () => {
    if (selectedCell) {
      placeOrRemoveGate(selectedCell.row, selectedCell.column);
    }
  };

  useKeyboardShortcuts({
    selectedCell,
    isSimulating: isLoading,
    onRun: runSimulation,
    onDeselectGate: clearSelection,
    onDeleteCell: deleteSelectedCell,
  });

  return (
    <section className="relative px-6 pb-24 pt-12 sm:px-10 lg:px-12">
      <div className="mx-auto mb-8 max-w-7xl rounded-[2rem] border border-white/10 bg-[#061022]/80 p-6 shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Quantum IDE</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Quantum Circuit Visualizer
            </h1>
            <p className="text-base leading-7 text-slate-400 sm:text-lg">
              Build, simulate, and analyze circuits in a polished frontend experience that feels like a real quantum development platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleDemo('bell')}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              Bell State
            </button>
            <button
              type="button"
              onClick={() => handleDemo('superposition')}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-300/40 hover:bg-violet-500/10"
            >
              Superposition Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemo('entanglement')}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300/40 hover:bg-teal-400/10"
            >
              Entanglement Demo
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-white/10 bg-[#06102f]/95 p-6 shadow-glow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Gate toolbox</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Select an operator</h2>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(79,247,228,0.45)]" />
                  {selectedGate ? `${selectedGate} selected` : 'No gate selected'}
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {gateOptions.map((gate) => (
                  <motion.button
                    key={gate.id}
                    type="button"
                    onClick={() => handleGateSelect(gate.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-[1.75rem] border px-4 py-4 text-left transition ${
                      selectedGate === gate.id
                        ? 'border-cyan-300/80 bg-cyan-400/15 text-cyan-100 shadow-[0_0_30px_rgba(79,247,228,0.16)]'
                        : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-400/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-semibold text-white">{gate.label}</p>
                        <p className="mt-2 text-sm text-slate-400">{gate.description}</p>
                      </div>
                      <span className="rounded-3xl bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
                        {gate.id}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">{gate.details}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#06102f]/95 p-6 shadow-glow">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">IDE controls</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Circuit commands</h2>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#0d1c32]/90 px-4 py-2 text-sm text-slate-300">
                    <span className="font-semibold text-white">Ctrl+R</span> run simulation
                  </div>
                </div>
                <div className="grid gap-4">
                  <button
                    type="button"
                    onClick={handleAddQubit}
                    className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-left text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    Add Qubit
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveQubit}
                    className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                  >
                    Remove Qubit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemo('bell')}
                    className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                  >
                    Load Bell State Demo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#06102f]/95 p-6 shadow-glow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Simulation engine</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Run the circuit</h2>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0d1c32]/90 px-4 py-2 text-sm text-slate-300">
                  <span className={`h-2.5 w-2.5 rounded-full ${backendConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {backendStatusMessage}
                </div>
                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isLoading}
                  className={`w-full rounded-3xl border px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                    isLoading
                      ? 'cursor-not-allowed border-cyan-300/20 bg-cyan-300/20 text-slate-200 opacity-70'
                      : 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(79,247,228,0.22)] hover:shadow-[0_0_45px_rgba(79,247,228,0.28)]'
                  }`}
                >
                  {isLoading ? 'Running Quantum Simulation...' : 'Run Quantum Simulation'}
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-[#081629]/95 p-4 shadow-[inset_0_0_40px_rgba(79,247,228,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Execution timeline</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Live quantum flow</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {executionSequence.length} steps
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-4 rounded-3xl border border-cyan-300/10 bg-[#07111f]/95 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300/10 text-xl font-semibold text-cyan-100 shadow-[0_0_30px_rgba(79,247,228,0.12)]">
                    {activeExecutionGate?.gate ?? '⟳'}
                  </div>
                  <div className="flex-1 text-sm text-slate-300">
                    <p className="font-semibold text-white">{executionLabel}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                      {activeExecutionGate
                        ? `q${activeExecutionGate.qubit} • column ${activeExecutionGate.column + 1}`
                        : 'Preparing circuit matrix'}
                    </p>
                  </div>
                </div>
                <div className="relative mt-4 overflow-hidden rounded-full border border-white/10 bg-white/5 px-1 py-1">
                  <div className="h-2 rounded-full bg-slate-900" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400"
                  />
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Quantum throughput</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#081729]/95 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Latency</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{executionStats.executionTime}</p>
                  </div>
                  <div className="rounded-3xl bg-[#081729]/95 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Engine status</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{executionStats.backendState}</p>
                  </div>
                </div>
              </div>
            </div>
              <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                  <span>Backend progress</span>
                  <span>{isLoading ? 'Pending' : serverCounts ? 'Complete' : 'Ready'}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Execution time</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{executionStats.executionTime}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Qubit count</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{executionStats.qubitCount}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gate count</p>
                <p className="mt-3 text-2xl font-semibold text-white">{executionStats.gateCount}</p>
              </div>
            </div>
          </div>
        <div className="space-y-6">
          <SimulatorGrid
            qubits={qubits}
            grid={grid}
            selectedCell={selectedCell}
            selectedGate={selectedGate}
            onCellClick={placeOrRemoveGate}
            onRowHover={setActiveRow}
            activeRow={activeRow}
            gateCount={gateCount}
            executingCell={activeExecutionCell}
          />

          {gateCount === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Circuit metrics</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Live analytics</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {qubits.length} qubits
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Total gates</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{gateCount}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Circuit depth</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{circuitDepth}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-[1.75rem] border border-white/10 bg-[#07111f]/90 px-4 py-3 text-sm text-slate-300">
                  Bloch sphere panel is currently <span className="font-semibold text-white">{showBlochPanel ? 'expanded' : 'compact'}</span>.
                </div>
                <button
                  type="button"
                  onClick={() => setShowBlochPanel((prev) => !prev)}
                  className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  {showBlochPanel ? 'Compact Bloch view' : 'Expand Bloch view'}
                </button>
              </div>

              {showBlochPanel ? (
                <BlochSphere qubitStates={blochStates} loading={isLoading} />
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Bloch compact mode</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Qubit summary</h3>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                      {qubits.length} qubits
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {blochStates.map((state) => (
                      <div key={state.label} className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{state.label}</span>
                          <span className="text-xs uppercase tracking-[0.28em] text-slate-500">{(state.probabilityZero * 100).toFixed(1)}% |0⟩</span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400"
                            style={{ width: `${Math.round(state.probabilityZero * 100)}%` }}
                          />
                        </div>
                        <div className="mt-4 grid gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>X</span>
                            <span>{state.vector[0].toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Y</span>
                            <span>{state.vector[1].toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Z</span>
                            <span>{state.vector[2].toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">State analytics</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Probability preview</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {probabilityEntries.length} state vectors
                  </span>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.65fr]">
                  <div className="space-y-4">
                    {probabilityEntries.length === 0 ? (
                      <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-6 text-sm text-slate-400">
                        Run the simulation to populate probability data.
                      </div>
                    ) : (
                      probabilityEntries.map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{item.label}</span>
                            <span className="font-semibold text-white">{item.value}%</span>
                          </div>
                          <div className="h-4 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#05111e]/90 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Probability chart</p>
                        <p className="mt-1 text-sm text-slate-400">Top probability distribution</p>
                      </div>
                      <span className="text-xs text-slate-400">Live</span>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                      <div className="relative h-40 w-40 rounded-full border border-white/10" style={pieChartStyle}>
                        <div className="absolute inset-12 flex items-center justify-center rounded-full bg-[#07111f]/95 text-center text-sm font-semibold text-white">
                          {topProbabilities.length ? `${topProbabilities[0].value}%` : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {topProbabilities.map((entry) => (
                        <div key={entry.label} className="flex items-center justify-between text-sm text-slate-300">
                          <span>{entry.label}</span>
                          <span className="font-semibold text-white">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">State vector</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Amplitude signature</h3>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {stateVectorEntries.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-white/10 bg-[#07111f]/90 p-6 text-sm text-slate-400">
                      State vector signature will populate after backend simulation.
                    </div>
                  ) : (
                    stateVectorEntries.map((entry) => (
                      <div key={entry.state} className="rounded-3xl border border-white/10 bg-[#05111e]/90 p-5">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">{entry.state}</div>
                        <div className="mt-3 text-lg font-semibold text-white">{entry.amplitude}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Structured data</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Circuit JSON</h3>
                  </div>
                </div>
                <pre className="mt-6 max-h-72 overflow-auto rounded-3xl border border-white/10 bg-[#05111e]/90 p-4 text-xs text-slate-300">
{JSON.stringify(circuitJson, null, 2)}
                </pre>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#06102e]/95 p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/85">Backend results</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">/simulate response</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {serverCounts ? 'Live' : 'Waiting'}
                  </span>
                </div>
                {serverError ? (
                  <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                    {serverError}
                  </div>
                ) : serverCounts ? (
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Counts</p>
                      <pre className="mt-3 overflow-auto text-xs text-white">{JSON.stringify(serverCounts, null, 2)}</pre>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-[#07111f]/90 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Probabilities</p>
                      <pre className="mt-3 overflow-auto text-xs text-white">{JSON.stringify(serverProbabilities, null, 2)}</pre>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm leading-6 text-slate-400">
                    The backend response will appear here after simulation completes.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Simulation completed"
        description="Your circuit simulation finished successfully. Review the probability output and state vector to continue optimizing your design."
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
