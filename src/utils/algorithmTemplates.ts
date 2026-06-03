import { gateOptions } from '../constants/gates';
import type { CircuitEntry } from './circuit';

export type AlgorithmTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredQubits: number;
  entries: CircuitEntry[];
};

const supportedGateIds = new Set(gateOptions.map((gate) => gate.id));

const superposition: AlgorithmTemplate = {
  id: 'superposition',
  name: 'Superposition',
  category: 'Fundamentals',
  description: 'Put multiple qubits into an equal superposition using Hadamard gates.',
  difficulty: 'Beginner',
  requiredQubits: 3,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'H', qubit: 2, column: 0 },
    { gate: 'MEASURE', qubit: 0, column: 1 },
    { gate: 'MEASURE', qubit: 1, column: 1 },
    { gate: 'MEASURE', qubit: 2, column: 1 },
  ],
};

const bellState: AlgorithmTemplate = {
  id: 'bellState',
  name: 'Bell State',
  category: 'Fundamentals',
  description: 'Create a maximally entangled pair of qubits with a Hadamard and CNOT.',
  difficulty: 'Beginner',
  requiredQubits: 2,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 1, column: 1 },
    { gate: 'MEASURE', qubit: 0, column: 2 },
    { gate: 'MEASURE', qubit: 1, column: 2 },
  ],
};

const entanglement: AlgorithmTemplate = {
  id: 'entanglement',
  name: 'Entanglement',
  category: 'Fundamentals',
  description: 'Extend entanglement across three qubits with a GHZ-style circuit.',
  difficulty: 'Beginner',
  requiredQubits: 3,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 1, column: 1 },
    { gate: 'CNOT', qubit: 1, control: 1, target: 2, column: 2 },
    { gate: 'MEASURE', qubit: 0, column: 3 },
    { gate: 'MEASURE', qubit: 1, column: 3 },
    { gate: 'MEASURE', qubit: 2, column: 3 },
  ],
};

const deutsch: AlgorithmTemplate = {
  id: 'deutsch',
  name: 'Deutsch',
  category: 'Algorithms',
  description: 'A toy Deutsch algorithm circuit with a balanced oracle implementation.',
  difficulty: 'Intermediate',
  requiredQubits: 2,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 1, column: 1 },
    { gate: 'H', qubit: 0, column: 2 },
    { gate: 'MEASURE', qubit: 0, column: 3 },
  ],
};

const deutschJozsa: AlgorithmTemplate = {
  id: 'deutschJozsa',
  name: 'Deutsch–Jozsa',
  category: 'Algorithms',
  description: 'A small Deutsch–Jozsa circuit showing a balanced oracle over two input qubits.',
  difficulty: 'Intermediate',
  requiredQubits: 3,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'X', qubit: 2, column: 0 },
    { gate: 'H', qubit: 2, column: 1 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 2, column: 2 },
    { gate: 'CNOT', qubit: 1, control: 1, target: 2, column: 3 },
    { gate: 'H', qubit: 0, column: 4 },
    { gate: 'H', qubit: 1, column: 4 },
    { gate: 'MEASURE', qubit: 0, column: 5 },
    { gate: 'MEASURE', qubit: 1, column: 5 },
  ],
};

const bernsteinVazirani: AlgorithmTemplate = {
  id: 'bernsteinVazirani',
  name: 'Bernstein–Vazirani',
  category: 'Algorithms',
  description: 'A small Bernstein–Vazirani circuit that encodes a secret bit string using CNOTs.',
  difficulty: 'Intermediate',
  requiredQubits: 3,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'X', qubit: 2, column: 0 },
    { gate: 'H', qubit: 2, column: 1 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 2, column: 2 },
    { gate: 'CNOT', qubit: 1, control: 1, target: 2, column: 3 },
    { gate: 'H', qubit: 0, column: 4 },
    { gate: 'H', qubit: 1, column: 4 },
    { gate: 'MEASURE', qubit: 0, column: 5 },
    { gate: 'MEASURE', qubit: 1, column: 5 },
  ],
};

const qft2: AlgorithmTemplate = {
  id: 'qft2',
  name: 'QFT 2Q',
  category: 'Algorithms',
  description: 'A two-qubit Quantum Fourier Transform using controlled phase rotations.',
  difficulty: 'Intermediate',
  requiredQubits: 2,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'CP', qubit: 0, control: 0, target: 1, column: 1, angle: Math.PI / 2 },
    { gate: 'H', qubit: 1, column: 2 },
    { gate: 'MEASURE', qubit: 0, column: 3 },
    { gate: 'MEASURE', qubit: 1, column: 3 },
  ],
};

const qft3: AlgorithmTemplate = {
  id: 'qft3',
  name: 'QFT 3Q',
  category: 'Algorithms',
  description: 'A three-qubit Quantum Fourier Transform using controlled phase rotations.',
  difficulty: 'Advanced',
  requiredQubits: 3,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'CP', qubit: 0, control: 0, target: 1, column: 1, angle: Math.PI / 2 },
    { gate: 'CP', qubit: 0, control: 0, target: 2, column: 2, angle: Math.PI / 4 },
    { gate: 'H', qubit: 1, column: 3 },
    { gate: 'CP', qubit: 1, control: 1, target: 2, column: 4, angle: Math.PI / 2 },
    { gate: 'H', qubit: 2, column: 5 },
    { gate: 'MEASURE', qubit: 0, column: 6 },
    { gate: 'MEASURE', qubit: 1, column: 6 },
    { gate: 'MEASURE', qubit: 2, column: 6 },
  ],
};

const grover2Q: AlgorithmTemplate = {
  id: 'grover2Q',
  name: 'Grover Search (2Q)',
  category: 'Algorithms',
  description: 'Educational implementation of Grover\'s search algorithm over four states.',
  difficulty: 'Advanced',
  requiredQubits: 2,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'CZ', qubit: 0, control: 0, target: 1, column: 1 },
    { gate: 'H', qubit: 0, column: 2 },
    { gate: 'H', qubit: 1, column: 2 },
    { gate: 'X', qubit: 0, column: 3 },
    { gate: 'X', qubit: 1, column: 3 },
    { gate: 'CZ', qubit: 0, control: 0, target: 1, column: 4 },
    { gate: 'X', qubit: 0, column: 5 },
    { gate: 'X', qubit: 1, column: 5 },
    { gate: 'H', qubit: 0, column: 6 },
    { gate: 'H', qubit: 1, column: 6 },
    { gate: 'MEASURE', qubit: 0, column: 7 },
    { gate: 'MEASURE', qubit: 1, column: 7 },
  ],
};

const simon: AlgorithmTemplate = {
  id: 'simon',
  name: 'Simon',
  category: 'Algorithms',
  description: 'A toy Simon circuit that demonstrates a hidden parity relation with four qubits.',
  difficulty: 'Advanced',
  requiredQubits: 4,
  entries: [
    { gate: 'H', qubit: 0, column: 0 },
    { gate: 'H', qubit: 1, column: 0 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 2, column: 1 },
    { gate: 'CNOT', qubit: 1, control: 1, target: 3, column: 2 },
    { gate: 'CNOT', qubit: 0, control: 0, target: 3, column: 3 },
    { gate: 'CNOT', qubit: 1, control: 1, target: 2, column: 4 },
    { gate: 'H', qubit: 0, column: 5 },
    { gate: 'H', qubit: 1, column: 5 },
    { gate: 'MEASURE', qubit: 0, column: 6 },
    { gate: 'MEASURE', qubit: 1, column: 6 },
  ],
};

export const ALGORITHM_TEMPLATES: Record<string, AlgorithmTemplate> = {
  superposition,
  bellState,
  entanglement,
  deutsch,
  deutschJozsa,
  bernsteinVazirani,
  qft2,
  qft3,
  grover2Q,
  simon,
};

export const validateCircuitEntries = (entries: CircuitEntry[], qubitCount: number): boolean => {
  return entries.every((entry) => {
    if (!supportedGateIds.has(entry.gate)) {
      return false;
    }

    if (!Number.isInteger(entry.qubit) || entry.qubit < 0 || entry.qubit >= qubitCount) {
      return false;
    }

    if (!Number.isInteger(entry.column) || entry.column < 0) {
      return false;
    }

    if (entry.gate === 'CNOT') {
      if (entry.control === undefined || entry.target === undefined) {
        return false;
      }

      if (!Number.isInteger(entry.control) || !Number.isInteger(entry.target)) {
        return false;
      }

      if (entry.control < 0 || entry.control >= qubitCount) {
        return false;
      }

      if (entry.target < 0 || entry.target >= qubitCount) {
        return false;
      }

      if (entry.control === entry.target) {
        return false;
      }

      if (entry.control !== entry.qubit) {
        return false;
      }
    }

    return true;
  });
};
