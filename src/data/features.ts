export type FeatureCard = {
  title: string;
  description: string;
  accent: 'cyan' | 'violet';
  icon: 'simulation' | 'state' | 'bloch' | 'playback' | 'probability' | 'learning';
};

export const featureCards: FeatureCard[] = [
  {
    title: 'Real Quantum Simulation',
    description: 'Run circuits on a real quantum backend powered by IBM Qiskit with accurate statevectors and measurement statistics.',
    accent: 'cyan',
    icon: 'simulation',
  },
  {
    title: 'State Evolution Tracking',
    description: 'Observe quantum states before and after each gate with formatted amplitudes and step-by-step history.',
    accent: 'violet',
    icon: 'state',
  },
  {
    title: 'Bloch Sphere Visualization',
    description: 'Visualize single-qubit transformations on the Bloch sphere as your circuit executes.',
    accent: 'cyan',
    icon: 'bloch',
  },
  {
    title: 'Execution Playback',
    description: 'Play, pause, step forward and backward, and replay every gate in your circuit like a timeline.',
    accent: 'violet',
    icon: 'playback',
  },
  {
    title: 'Probability Analysis',
    description: 'Track probability distributions across execution steps with before-and-after comparisons.',
    accent: 'cyan',
    icon: 'probability',
  },
  {
    title: 'Educational Learning Mode',
    description: 'Understand quantum circuits interactively with gate explanations and visual feedback.',
    accent: 'violet',
    icon: 'learning',
  },
];
