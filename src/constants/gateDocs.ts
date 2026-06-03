export type GateDoc = {
  name: string;
  description: string;
  math: string;
  example: string;
  historical?: string;
};

export const GATE_DOCS: Record<string, GateDoc> = {
  H: {
    name: 'Hadamard (H)',
    description: 'Creates an equal superposition between |0⟩ and |1⟩.',
    math: 'H = (1/√2) [[1, 1], [1, -1]]',
    example: 'Apply H on q0 to create a superposition before entangling.',
    historical: 'Introduced as a common one-qubit gate in quantum computing literature.',
  },
  X: {
    name: 'Pauli-X (X)',
    description: 'Bit-flip: swaps |0⟩ and |1⟩.',
    math: 'X = [[0, 1], [1, 0]]',
    example: 'Use X to prepare |1⟩ from |0⟩.',
  },
  Y: {
    name: 'Pauli-Y (Y)',
    description: 'Bit and phase flip combined.',
    math: 'Y = [[0, -i], [i, 0]]',
    example: 'Y applies both phase and bit flips to a qubit.',
  },
  Z: {
    name: 'Pauli-Z (Z)',
    description: 'Phase flip: adds a phase to |1⟩.',
    math: 'Z = [[1, 0], [0, -1]]',
    example: 'Use Z to invert the phase of |1⟩ (conditional phase shifts).',
  },
  CNOT: {
    name: 'Controlled-NOT (CNOT)',
    description: 'Flips the target qubit iff control is |1⟩.',
    math: 'CNOT = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ X',
    example: 'Create entanglement: H on q0 then CNOT(q0 -> q1).',
  },
  RZ: {
    name: 'RZ rotation',
    description: 'Rotate around the Z axis by angle θ.',
    math: 'RZ(θ) = exp(-i θ/2 Z)',
    example: 'Use RZ(π/2) to add a relative phase between basis states.',
  },
  CP: {
    name: 'Controlled-Phase (CP)',
    description: 'Apply a phase on the target controlled by the control qubit.',
    math: 'CP(θ) = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ RZ(θ)',
    example: 'Use CP to build controlled rotations in QFT circuits.',
  },
  MEASURE: {
    name: 'Measure',
    description: 'Project qubit to classical 0 or 1.',
    math: 'Measure in computational basis; non-unitary collapse.',
    example: 'Measure at the end to get classical readout.',
  },
  CZ: {
    name: 'Controlled-Z (CZ)',
    description: 'Apply Z phase to target when control is |1⟩.',
    math: 'CZ = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ Z',
    example: 'Use CZ to add conditional phase between qubits.',
  },
  SWAP: {
    name: 'SWAP',
    description: 'Exchange the quantum states of two qubits.',
    math: 'SWAP = sum_{ab} |ba⟩⟨ab|',
    example: 'Use SWAP to reorder qubit registers when needed.',
  },
};

export default GATE_DOCS;
