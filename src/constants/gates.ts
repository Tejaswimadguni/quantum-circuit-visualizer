export type GateOption = {
  id: string;
  label: string;
  description: string;
  accent: string;
  details: string;
};

export const gateOptions: GateOption[] = [
  {
    id: 'H',
    label: 'H',
    description: 'Superposition',
    accent: 'cyan',
    details: 'Creates an even superposition of |0⟩ and |1⟩.',
  },
  {
    id: 'X',
    label: 'X',
    description: 'Bit flip',
    accent: 'violet',
    details: 'Flips the qubit state from |0⟩ to |1⟩ and vice versa.',
  },
  {
    id: 'Y',
    label: 'Y',
    description: 'Phase-flip',
    accent: 'pink',
    details: 'Applies a bit flip and a phase shift to the qubit.',
  },
  {
    id: 'Z',
    label: 'Z',
    description: 'Phase gate',
    accent: 'blue',
    details: 'Leaves |0⟩ unchanged while flipping the phase of |1⟩.',
  },
  {
    id: 'CNOT',
    label: 'CNOT',
    description: 'Controlled-X',
    accent: 'teal',
    details: 'Flips the target qubit only when the control qubit is |1⟩.',
  },
  {
    id: 'CZ',
    label: 'CZ',
    description: 'Controlled-Z',
    accent: 'emerald',
    details: 'Applies a Z phase to the target qubit when the control qubit is |1⟩.',
  },
  {
    id: 'SWAP',
    label: 'SWAP',
    description: 'Swap qubits',
    accent: 'rose',
    details: 'Exchanges the states of two qubits.',
  },
  {
    id: 'RZ',
    label: 'RZ',
    description: 'Z rotation',
    accent: 'indigo',
    details: 'Rotates the qubit around the Z axis by a specified angle.',
  },
  {
    id: 'CP',
    label: 'CP',
    description: 'Controlled phase',
    accent: 'lime',
    details: 'Applies a controlled phase rotation between two qubits.',
  },
  {
    id: 'MEASURE',
    label: 'MEASURE',
    description: 'Collapse state',
    accent: 'gold',
    details: 'Projects the qubit into a classical measurement state.',
  },
];

export const gateAccentClasses: Record<string, string> = {
  H: 'from-cyan-400 to-blue-500',
  X: 'from-violet-400 to-fuchsia-500',
  Y: 'from-pink-400 to-rose-500',
  Z: 'from-sky-400 to-cyan-400',
  CNOT: 'from-teal-400 to-cyan-300',
  CZ: 'from-emerald-400 to-lime-500',
  SWAP: 'from-rose-400 to-fuchsia-500',
  RZ: 'from-indigo-400 to-blue-500',
  CP: 'from-lime-400 to-emerald-500',
  MEASURE: 'from-amber-400 to-orange-400',
};
