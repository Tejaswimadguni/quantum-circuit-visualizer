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
  MEASURE: 'from-amber-400 to-orange-400',
};
