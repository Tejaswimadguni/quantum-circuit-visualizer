from typing import Any, Dict, List, Tuple
import time
import numpy as np

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector

SUPPORTED_GATES = {'H', 'X', 'Y', 'Z', 'CNOT', 'MEASURE'}


class SimulationError(Exception):
    """Raised when the input circuit cannot be processed."""


def _validate_entry(entry: Any) -> Dict[str, Any]:
    """Validate a single gate entry and normalize its fields."""
    if not isinstance(entry, dict):
        raise SimulationError('Each entry must be an object with gate details.')

    gate = entry.get('gate')
    if not isinstance(gate, str):
        raise SimulationError('Each entry must include a gate name as a string.')

    gate = gate.strip().upper()
    if gate not in SUPPORTED_GATES:
        raise SimulationError(f'Unsupported gate: {gate}. Supported gates are {sorted(SUPPORTED_GATES)}.')

    column = entry.get('column')
    if not isinstance(column, int) or column < 0:
        raise SimulationError('Each entry must include a non-negative integer column.')

    normalized = {'gate': gate, 'column': column}

    if gate == 'CNOT':
        control = entry.get('control')
        target = entry.get('target')
        if not isinstance(control, int) or not isinstance(target, int):
            raise SimulationError('CNOT entries must include integer control and target fields.')
        if control == target:
            raise SimulationError('CNOT control and target must be different qubits.')
        normalized.update({'control': control, 'target': target})
    else:
        qubit = entry.get('qubit')
        if not isinstance(qubit, int) or qubit < 0:
            raise SimulationError(f'{gate} entries must include a non-negative integer qubit.')
        normalized['qubit'] = qubit

    return normalized


def _get_qubit_count(entries: List[Dict[str, Any]]) -> int:
    """Return the minimum number of qubits required by the circuit."""
    highest_index = 0
    for entry in entries:
        if entry['gate'] == 'CNOT':
            highest_index = max(highest_index, entry['control'], entry['target'])
        else:
            highest_index = max(highest_index, entry['qubit'])
    return highest_index + 1


def build_quantum_circuit(entries: List[Any]) -> QuantumCircuit:
    """Create a Qiskit QuantumCircuit from the provided gate list."""
    normalized_entries = [_validate_entry(entry) for entry in entries]
    normalized_entries.sort(key=lambda item: (item['column'], item.get('qubit', 0), item.get('control', 0)))

    qubit_count = _get_qubit_count(normalized_entries)
    circuit = QuantumCircuit(qubit_count, qubit_count)
    measured_qubits = set()

    for entry in normalized_entries:
        gate = entry['gate']
        if gate == 'CNOT':
            circuit.cx(entry['control'], entry['target'])
        elif gate == 'MEASURE':
            circuit.measure(entry['qubit'], entry['qubit'])
            measured_qubits.add(entry['qubit'])
        elif gate == 'H':
            circuit.h(entry['qubit'])
        elif gate == 'X':
            circuit.x(entry['qubit'])
        elif gate == 'Y':
            circuit.y(entry['qubit'])
        elif gate == 'Z':
            circuit.z(entry['qubit'])

    # Measure all qubits if no explicit measurement was provided or if some qubits are still unmeasured.
    if len(measured_qubits) < qubit_count:
        for qubit_index in range(qubit_count):
            if qubit_index not in measured_qubits:
                circuit.measure(qubit_index, qubit_index)

    return circuit


def run_quantum_simulation(circuit: QuantumCircuit, shots: int = 1024) -> Tuple[Dict[str, int], Dict[str, float]]:
    """Execute the circuit on Qiskit AerSimulator and return counts and probabilities."""
    simulator = AerSimulator()
    compiled = transpile(circuit, simulator)
    job = simulator.run(compiled, shots=shots)
    result = job.result()

    counts = result.get_counts()
    total_counts = sum(counts.values())

    if total_counts == 0:
        raise SimulationError('Simulation returned zero counts. Something went wrong in the circuit.')

    probabilities = {
        state: round(count / total_counts, 4)
        for state, count in counts.items()
    }

    return counts, probabilities


# ============================================================================
# STEP-BY-STEP EXECUTION FUNCTIONS
# ============================================================================


def _get_gate_explanation(gate: str, qubit: int = None, control: int = None, target: int = None) -> str:
    """Generate educational explanation for a quantum gate."""
    explanations = {
        'H': f'Hadamard gate creates a superposition state on qubit {qubit}. It equally combines |0⟩ and |1⟩ states.',
        'X': f'Pauli-X (NOT) gate flips qubit {qubit} from |0⟩ to |1⟩ or vice versa.',
        'Y': f'Pauli-Y gate applies a bit flip and phase shift on qubit {qubit}.',
        'Z': f'Pauli-Z (Phase) gate leaves |0⟩ unchanged and flips the phase of |1⟩ on qubit {qubit}.',
        'CNOT': f'CNOT gate entangles qubits {control} (control) and {target} (target). Flips target when control is |1⟩.',
        'MEASURE': f'Measurement gate collapses qubit {qubit} into a classical bit (0 or 1).',
    }
    return explanations.get(gate, f'Unknown gate: {gate}')


def _format_statevector(statevector: np.ndarray, precision: int = 3) -> str:
    """Format a statevector into a readable quantum state notation."""
    basis_states = []
    n_qubits = int(np.log2(len(statevector)))

    for i, amplitude in enumerate(statevector):
        if abs(amplitude) > 1e-10:
            state = format(i, f'0{n_qubits}b')
            if abs(amplitude.imag) > 1e-10:
                basis_states.append(f'{amplitude.real:.{precision}f}+{amplitude.imag:.{precision}f}i|{state}⟩')
            else:
                basis_states.append(f'{amplitude.real:.{precision}f}|{state}⟩')

    return ' + '.join(basis_states) if basis_states else '|00⟩'


def _get_probabilities_from_statevector(statevector: np.ndarray) -> Dict[str, float]:
    """Calculate measurement probabilities from a statevector."""
    n_qubits = int(np.log2(len(statevector)))
    probabilities = {}

    for i, amplitude in enumerate(statevector):
        state = format(i, f'0{n_qubits}b')
        prob = abs(amplitude) ** 2
        if prob > 1e-10:
            probabilities[state] = round(prob, 4)

    return probabilities


def _statevector_array(statevector: Any) -> np.ndarray:
    """Normalize Statevector or ndarray to a complex amplitude array."""
    if isinstance(statevector, Statevector):
        return statevector.data
    return np.asarray(statevector, dtype=complex)


def _get_bloch_vectors_from_statevector(statevector: Any, n_qubits: int) -> List[List[float]]:
    """Compute Bloch [x, y, z] for each qubit via partial trace of |ψ⟩⟨ψ|."""
    sv = _statevector_array(statevector)
    dim = len(sv)
    vectors: List[List[float]] = []

    for q in range(n_qubits):
        rho = np.zeros((2, 2), dtype=complex)
        for i in range(dim):
            for j in range(dim):
                other_bits_match = True
                for k in range(n_qubits):
                    if k == q:
                        continue
                    if ((i >> (n_qubits - 1 - k)) & 1) != ((j >> (n_qubits - 1 - k)) & 1):
                        other_bits_match = False
                        break
                if not other_bits_match:
                    continue
                iq = (i >> (n_qubits - 1 - q)) & 1
                jq = (j >> (n_qubits - 1 - q)) & 1
                rho[iq, jq] += sv[i] * np.conj(sv[j])

        x = float(2 * np.real(rho[0, 1]))
        y = float(2 * np.imag(rho[0, 1]))
        z = float(np.real(rho[0, 0] - rho[1, 1]))
        norm = float(np.sqrt(x * x + y * y + z * z))
        if norm > 1e-10:
            x, y, z = x / norm, y / norm, z / norm
        else:
            x, y, z = 0.0, 0.0, 1.0
        vectors.append([round(x, 4), round(y, 4), round(z, 4)])

    return vectors


def _get_bloch_vectors_from_probabilities(probabilities: Dict[str, float], n_qubits: int) -> List[List[float]]:
    """Bloch Z component from measurement probabilities (diagonal reduced state)."""
    vectors: List[List[float]] = []
    for q in range(n_qubits):
        p0 = sum(
            prob for state, prob in probabilities.items()
            if len(state) > q and state[len(state) - 1 - q] == '0'
        )
        p1 = max(0.0, 1.0 - p0)
        z = max(-1.0, min(1.0, p0 - p1))
        vectors.append([0.0, 0.0, round(z, 4)])
    return vectors


def _bloch_vectors_for_step(
    statevector: Any, probabilities: Dict[str, float], n_qubits: int
) -> List[List[float]]:
    """Derive per-qubit Bloch coordinates from statevector or probability data."""
    if isinstance(statevector, (Statevector, np.ndarray)):
        return _get_bloch_vectors_from_statevector(statevector, n_qubits)
    if probabilities:
        return _get_bloch_vectors_from_probabilities(probabilities, n_qubits)
    return [[0.0, 0.0, 1.0] for _ in range(n_qubits)]


def run_quantum_simulation_with_steps(
    entries: List[Dict[str, Any]], shots: int = 1024
) -> Dict[str, Any]:
    """Execute circuit step-by-step, returning execution history and final results."""
    start_time = time.perf_counter()
    normalized_entries = [_validate_entry(entry) for entry in entries]
    normalized_entries.sort(key=lambda item: (item['column'], item.get('qubit', 0), item.get('control', 0)))

    qubit_count = _get_qubit_count(normalized_entries)
    steps = []

    # Initialize with |00...0⟩ state
    current_circuit = QuantumCircuit(qubit_count)
    try:
        current_statevector = Statevector.from_label('0' * qubit_count)
    except Exception:
        current_statevector = np.zeros(2**qubit_count, dtype=complex)
        current_statevector[0] = 1.0

    measured_qubits = set()

    # Execute each gate and track state evolution
    for entry in normalized_entries:
        gate = entry['gate']
        
        # Get state before
        if isinstance(current_statevector, Statevector):
            state_before = _format_statevector(current_statevector.data)
            probs_before = _get_probabilities_from_statevector(current_statevector.data)
        else:
            state_before = _format_statevector(current_statevector)
            probs_before = _get_probabilities_from_statevector(current_statevector)

        # Apply gate
        if gate == 'CNOT':
            current_circuit.cx(entry['control'], entry['target'])
        elif gate == 'MEASURE':
            current_circuit.measure(entry['qubit'], entry['qubit'])
            measured_qubits.add(entry['qubit'])
        elif gate == 'H':
            current_circuit.h(entry['qubit'])
        elif gate == 'X':
            current_circuit.x(entry['qubit'])
        elif gate == 'Y':
            current_circuit.y(entry['qubit'])
        elif gate == 'Z':
            current_circuit.z(entry['qubit'])

        # Compute new statevector (skip for measurements in statevector context)
        if gate != 'MEASURE':
            try:
                current_statevector = Statevector.from_instruction(current_circuit)
            except Exception:
                # Fallback: simulate to get probabilities
                simulator = AerSimulator()
                compiled = transpile(current_circuit, simulator)
                job = simulator.run(compiled, shots=shots)
                result = job.result()
                counts = result.get_counts()
                total = sum(counts.values())

                state_array = np.zeros(2**qubit_count, dtype=complex)
                for state_label, count in counts.items():
                    idx = int(state_label, 2)
                    state_array[idx] = np.sqrt(count / total)

                current_statevector = state_array
        else:
            # For measurement, simulate the circuit
            sim_circuit = current_circuit.copy()
            if len(measured_qubits) < qubit_count:
                for i in range(qubit_count):
                    if i not in measured_qubits:
                        sim_circuit.measure(i, i)

            simulator = AerSimulator()
            compiled = transpile(sim_circuit, simulator)
            job = simulator.run(compiled, shots=shots)
            result = job.result()
            counts = result.get_counts()
            current_statevector = counts  # Store counts for measurement steps

        # Get state after
        if isinstance(current_statevector, Statevector):
            state_after = _format_statevector(current_statevector.data)
            probs_after = _get_probabilities_from_statevector(current_statevector.data)
        elif isinstance(current_statevector, dict):
            total = sum(current_statevector.values())
            state_after = ', '.join(
                [f'{count/total:.3f}|{state}⟩' for state, count in sorted(current_statevector.items())]
            )
            probs_after = {
                state: round(count / total, 4) for state, count in current_statevector.items()
            }
        else:
            state_after = _format_statevector(current_statevector)
            probs_after = _get_probabilities_from_statevector(current_statevector)

        bloch_after = _bloch_vectors_for_step(current_statevector, probs_after, qubit_count)

        # Build step data
        step = {
            'stepNumber': len(steps) + 1,
            'gate': gate,
            'qubit': entry.get('qubit'),
            'control': entry.get('control'),
            'target': entry.get('target'),
            'column': entry['column'],
            'stateBefore': state_before,
            'stateAfter': state_after,
            'probabilitiesBefore': probs_before,
            'probabilitiesAfter': probs_after,
            'blochVectorsAfter': bloch_after,
            'explanation': _get_gate_explanation(
                gate,
                entry.get('qubit'),
                entry.get('control'),
                entry.get('target')
            ),
        }
        steps.append(step)

    # Final simulation for accurate counts
    final_circuit = QuantumCircuit(qubit_count, qubit_count)
    for entry in normalized_entries:
        gate = entry['gate']
        if gate == 'CNOT':
            final_circuit.cx(entry['control'], entry['target'])
        elif gate == 'MEASURE':
            final_circuit.measure(entry['qubit'], entry['qubit'])
        elif gate == 'H':
            final_circuit.h(entry['qubit'])
        elif gate == 'X':
            final_circuit.x(entry['qubit'])
        elif gate == 'Y':
            final_circuit.y(entry['qubit'])
        elif gate == 'Z':
            final_circuit.z(entry['qubit'])

    if len(measured_qubits) < qubit_count:
        for qubit_index in range(qubit_count):
            if qubit_index not in measured_qubits:
                final_circuit.measure(qubit_index, qubit_index)

    simulator = AerSimulator()
    compiled = transpile(final_circuit, simulator)
    job = simulator.run(compiled, shots=shots)
    result = job.result()
    counts = result.get_counts()
    total_counts = sum(counts.values())

    probabilities = {
        state: round(count / total_counts, 4)
        for state, count in counts.items()
    }

    elapsed_ms = round((time.perf_counter() - start_time) * 1000)

    return {
        'steps': steps,
        'totalSteps': len(steps),
        'qubitCount': qubit_count,
        'gateCount': len(normalized_entries),
        'circuitDepth': max([e['column'] for e in normalized_entries]) + 1 if normalized_entries else 0,
        'finalCounts': counts,
        'finalProbabilities': probabilities,
        'executionTimeMs': elapsed_ms,
        'executionTime': f'{elapsed_ms} ms',
    }

