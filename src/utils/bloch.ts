export type BlochVector = [number, number, number];

const BLOCH_COLORS = ['#5eead4', '#f472b6', '#7c3aed', '#22d3ee'];

/** Marginal P(|0⟩) for qubit index from computational-basis probabilities. */
function marginalProbabilityZero(probabilities: Record<string, number>, qubitIndex: number): number {
  return Object.entries(probabilities).reduce((sum, [state, prob]) => {
    const bit = state[state.length - 1 - qubitIndex] ?? '0';
    return sum + (bit === '0' ? prob : 0);
  }, 0);
}

/** Bloch Z from probabilities when only diagonal reduced state is available. */
function blochFromProbabilities(probabilities: Record<string, number>, qubitIndex: number): BlochVector {
  const p0 = marginalProbabilityZero(probabilities, qubitIndex);
  const z = Math.min(1, Math.max(-1, p0 - (1 - p0)));
  return [0, 0, z];
}

export function buildBlochQubitStates(
  qubitCount: number,
  probabilitiesAfter: Record<string, number>,
  blochVectorsAfter?: BlochVector[]
) {
  return Array.from({ length: qubitCount }, (_, index) => {
    const label = `q${index}`;
    const hasBackendVector =
      blochVectorsAfter?.[index] !== undefined && blochVectorsAfter[index].length === 3;

    const vector: BlochVector = hasBackendVector
      ? blochVectorsAfter![index]
      : blochFromProbabilities(probabilitiesAfter, index);

    const p0 = marginalProbabilityZero(probabilitiesAfter, index);
    const p1 = Math.max(0, 1 - p0);

    return {
      label,
      probabilityZero: p0,
      probabilityOne: p1,
      vector,
      color: BLOCH_COLORS[index % BLOCH_COLORS.length],
    };
  });
}
