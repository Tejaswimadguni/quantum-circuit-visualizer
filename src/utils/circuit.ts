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
