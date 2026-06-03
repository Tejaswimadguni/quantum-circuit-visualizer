import json
import math
import sys
import os
import traceback

ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

from simulation import run_quantum_simulation_with_steps

ALGORITHMS = {
    'Bell': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "CNOT", "control": 0, "target": 1, "column": 1, "qubit": 0},
        {"gate": "MEASURE", "qubit": 0, "column": 2},
        {"gate": "MEASURE", "qubit": 1, "column": 2},
    ],
    'Deutsch': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "H", "qubit": 1, "column": 0},
        {"gate": "CNOT", "control": 0, "target": 1, "column": 1},
        {"gate": "H", "qubit": 0, "column": 2},
        {"gate": "MEASURE", "qubit": 0, "column": 3},
    ],
    'Deutsch-Jozsa': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "H", "qubit": 1, "column": 0},
        {"gate": "X", "qubit": 2, "column": 0},
        {"gate": "H", "qubit": 2, "column": 1},
        {"gate": "CNOT", "control": 0, "target": 2, "column": 2, "qubit": 0},
        {"gate": "CNOT", "control": 1, "target": 2, "column": 3, "qubit": 1},
        {"gate": "H", "qubit": 0, "column": 4},
        {"gate": "H", "qubit": 1, "column": 4},
        {"gate": "MEASURE", "qubit": 0, "column": 5},
        {"gate": "MEASURE", "qubit": 1, "column": 5},
    ],
    'Bernstein-Vazirani': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "H", "qubit": 1, "column": 0},
        {"gate": "X", "qubit": 2, "column": 0},
        {"gate": "H", "qubit": 2, "column": 1},
        {"gate": "CNOT", "control": 0, "target": 2, "column": 2, "qubit": 0},
        {"gate": "CNOT", "control": 1, "target": 2, "column": 3, "qubit": 1},
        {"gate": "H", "qubit": 0, "column": 4},
        {"gate": "H", "qubit": 1, "column": 4},
        {"gate": "MEASURE", "qubit": 0, "column": 5},
        {"gate": "MEASURE", "qubit": 1, "column": 5},
    ],
    'Simon': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "H", "qubit": 1, "column": 0},
        {"gate": "CNOT", "control": 0, "target": 2, "column": 1, "qubit": 0},
        {"gate": "CNOT", "control": 1, "target": 3, "column": 2, "qubit": 1},
        {"gate": "CNOT", "control": 0, "target": 3, "column": 3, "qubit": 0},
        {"gate": "CNOT", "control": 1, "target": 2, "column": 4, "qubit": 1},
        {"gate": "H", "qubit": 0, "column": 5},
        {"gate": "H", "qubit": 1, "column": 5},
        {"gate": "MEASURE", "qubit": 0, "column": 6},
        {"gate": "MEASURE", "qubit": 1, "column": 6},
    ],
    'QFT 2Q': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "CP", "control": 0, "target": 1, "column": 1, "angle": math.pi/2, "qubit": 0},
        {"gate": "H", "qubit": 1, "column": 2},
        {"gate": "MEASURE", "qubit": 0, "column": 3},
        {"gate": "MEASURE", "qubit": 1, "column": 3},
    ],
    'QFT 3Q': [
        {"gate": "H", "qubit": 0, "column": 0},
        {"gate": "CP", "control": 0, "target": 1, "column": 1, "angle": math.pi/2, "qubit": 0},
        {"gate": "CP", "control": 0, "target": 2, "column": 2, "angle": math.pi/4, "qubit": 0},
        {"gate": "H", "qubit": 1, "column": 3},
        {"gate": "CP", "control": 1, "target": 2, "column": 4, "angle": math.pi/2, "qubit": 1},
        {"gate": "H", "qubit": 2, "column": 5},
        {"gate": "MEASURE", "qubit": 0, "column": 6},
        {"gate": "MEASURE", "qubit": 1, "column": 6},
        {"gate": "MEASURE", "qubit": 2, "column": 6},
    ],
}


def main():
    all_ok = True
    for name, payload in ALGORITHMS.items():
        print('\n' + '='*60)
        print('Running:', name)
        try:
            res = run_quantum_simulation_with_steps(payload, shots=256)
            print('  totalSteps=', res.get('totalSteps'))
            last = res['steps'][-1] if res['steps'] else None
            print('  final probs=', res.get('finalProbabilities') or (last and last.get('probabilitiesAfter')))
        except Exception as e:
            print('  EXCEPTION:', repr(e))
            traceback.print_exc()
            all_ok = False
    print('\nDone')
    sys.exit(0 if all_ok else 1)

if __name__ == '__main__':
    main()
