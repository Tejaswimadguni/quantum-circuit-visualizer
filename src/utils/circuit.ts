export type CircuitEntry = {
  gate: string;
  qubit: number;
  column: number;
  control?: number;
  target?: number;
};

export type CircuitJson = {
  qubitCount: number;
  gateCount: number;
  circuitDepth: number;
  columns: number;
  entries: CircuitEntry[];
};

export const MAX_COLUMNS = 7;

export const createCircuitEntries = (rows: number): CircuitEntry[] => [];

export const buildGrid = (entries: CircuitEntry[], rows: number, columns = MAX_COLUMNS) => {
  const grid: Array<Array<string | null>> = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => null)
  );

  entries.forEach((entry) => {
    if (entry.qubit < rows && entry.column < columns) {
      grid[entry.qubit][entry.column] = entry.gate;
    }
  });

  return grid;
};

export const getGateCount = (entries: CircuitEntry[]) => entries.length;

export const getCircuitDepth = (entries: CircuitEntry[]) =>
  entries.length === 0 ? 0 : Math.max(...entries.map((entry) => entry.column)) + 1;

export const buildCircuitJson = (
  entries: CircuitEntry[],
  qubitCount: number,
  columns = MAX_COLUMNS
): CircuitJson => ({
  qubitCount,
  gateCount: getGateCount(entries),
  circuitDepth: getCircuitDepth(entries),
  columns,
  entries: entries.map((entry) => ({ ...entry })),
});

export const buildProbabilities = (
  entries: CircuitEntry[],
  qubitCount: number,
  seed: number
) => {
  return Array.from({ length: qubitCount }, (_, qubitIndex) => {
    const rowGateCount = entries.filter((entry) => entry.qubit === qubitIndex).length;
    const depthBonus = entries.some((entry) => entry.column >= 4) ? 6 : 0;
    const rawValue = 46 + rowGateCount * 8 - qubitIndex * 3 + depthBonus + (seed % 6) * 2;
    return {
      label: `q${qubitIndex}`,
      value: Math.min(98, Math.max(10, rawValue)),
    };
  });
};

export const buildStateVector = (entries: CircuitEntry[], seed: number) => {
  const baseValues = [0.72, 0.41, 0.28, 0.18];
  return baseValues.map((value, index) => {
    const gateBonus = entries.length * 0.02;
    const phase = ((seed + index * 3) % 8) * 0.01;
    const finalValue = Math.max(0.05, Math.min(0.98, value + gateBonus - index * 0.02 + phase));
    const imag = Math.min(0.64, 0.1 + index * 0.03 + gateBonus * 0.4 + phase);
    return `${finalValue.toFixed(2)} + ${imag.toFixed(2)}i`;
  });
};

export const buildExecutionStats = (
  entries: CircuitEntry[],
  qubitCount: number,
  circuitDepth: number,
  seed: number
) => {
  const gateCount = getGateCount(entries);
  const time = 220 + gateCount * 16 + circuitDepth * 14 + (seed % 5) * 8;
  const fidelity = Math.min(99, Math.max(72, 86 + gateCount * 0.9 - circuitDepth * 0.7 + (seed % 6)));
  const coherence = Math.min(98, Math.max(48, 60 + qubitCount * 4 - circuitDepth * 1.5 + gateCount * 0.5));
  return {
    executionTime: `${time} ms`,
    fidelity: `${fidelity.toFixed(0)}%`,
    coherence: `${coherence.toFixed(0)}%`,
  };
};

export type DemoCircuit = {
  qubits: string[];
  entries: CircuitEntry[];
};

export const demoCircuits: Record<string, DemoCircuit> = {
  bell: {
    qubits: ['q0', 'q1'],
    entries: [
      { gate: 'H', qubit: 0, column: 0 },
      { gate: 'CNOT', qubit: 1, column: 1 },
    ],
  },
  superposition: {
    qubits: ['q0', 'q1', 'q2'],
    entries: [
      { gate: 'H', qubit: 0, column: 0 },
      { gate: 'H', qubit: 1, column: 0 },
      { gate: 'H', qubit: 2, column: 0 },
    ],
  },
  entanglement: {
    qubits: ['q0', 'q1', 'q2'],
    entries: [
      { gate: 'H', qubit: 0, column: 0 },
      { gate: 'CNOT', qubit: 1, column: 1 },
      { gate: 'CNOT', qubit: 2, column: 2 },
    ],
  },
};
