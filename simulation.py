from typing import Any, Dict, List, Tuple

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

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
