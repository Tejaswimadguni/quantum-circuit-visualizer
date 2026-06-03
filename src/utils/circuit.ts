export type CircuitEntry = {
  gate: string;
  qubit: number;
  column: number;
  control?: number;
  control2?: number;
  target?: number;
  angle?: number;
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

const formatAngleLabel = (angle: number) => {
  if (Number.isInteger(angle)) {
    return angle.toString();
  }
  return angle.toPrecision(3).replace(/(?:\.0+|(?<=\.\d*?)0+)$/, '');
};

export const buildGrid = (entries: CircuitEntry[], rows: number, columns = MAX_COLUMNS) => {
  const grid: Array<Array<string | null>> = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => null)
  );

  entries.forEach((entry) => {
    if (entry.column >= columns) {
      return;
    }

    const label =
      entry.gate === 'RZ' && entry.angle !== undefined
        ? `RZ(${formatAngleLabel(entry.angle)})`
        : entry.gate === 'CP' && entry.angle !== undefined
        ? `CP(${formatAngleLabel(entry.angle)})`
        : entry.gate;

    if (
      (entry.gate === 'CNOT' || entry.gate === 'CZ' || entry.gate === 'SWAP' || entry.gate === 'CP' || entry.gate === 'CCX') &&
      entry.control !== undefined &&
      entry.target !== undefined
    ) {
      if (entry.control < rows) {
        grid[entry.control][entry.column] = label;
      }
      if (entry.control2 !== undefined && entry.control2 < rows) {
        grid[entry.control2][entry.column] = label;
      }
      if (entry.target < rows) {
        grid[entry.target][entry.column] = label;
      }
      return;
    }

    if (entry.qubit < rows) {
      grid[entry.qubit][entry.column] = label;
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

/** Resolve CNOT control/target for API payload (qubit = control wire where gate is placed). */
export const resolveCnotWiring = (
  entry: CircuitEntry,
  qubitCount: number
): { control: number; target: number } => {
  if (entry.control !== undefined && entry.target !== undefined) {
    return { control: entry.control, target: entry.target };
  }
  const control = entry.qubit;
  const target =
    entry.target ?? (control < qubitCount - 1 ? control + 1 : Math.max(0, control - 1));
  return { control, target };
};

export const demoCircuits: Record<string, DemoCircuit> = {
  bell: {
    qubits: ['q0', 'q1'],
    entries: [
      { gate: 'H', qubit: 0, column: 0 },
      { gate: 'CNOT', control: 0, target: 1, column: 1, qubit: 0 },
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
      { gate: 'CNOT', control: 0, target: 1, column: 1, qubit: 0 },
      { gate: 'CNOT', control: 1, target: 2, column: 2, qubit: 1 },
    ],
  },
};
