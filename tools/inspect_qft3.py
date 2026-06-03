import json
import math
import traceback
import sys
import os

# Ensure project root is on sys.path so local modules import correctly
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

from simulation import run_quantum_simulation_with_steps

bell_payload = [
    {"gate": "H", "qubit": 0, "column": 0},
    {"gate": "CNOT", "control": 0, "target": 1, "column": 1, "qubit": 0},
]

qft3_payload = [
    {"gate": "H", "qubit": 0, "column": 0},
    {"gate": "CP", "qubit": 0, "control": 0, "target": 1, "column": 1, "angle": math.pi / 2},
    {"gate": "CP", "qubit": 0, "control": 0, "target": 2, "column": 2, "angle": math.pi / 4},
    {"gate": "H", "qubit": 1, "column": 3},
    {"gate": "CP", "qubit": 1, "control": 1, "target": 2, "column": 4, "angle": math.pi / 2},
    {"gate": "H", "qubit": 2, "column": 5},
    {"gate": "MEASURE", "qubit": 0, "column": 6},
    {"gate": "MEASURE", "qubit": 1, "column": 6},
    {"gate": "MEASURE", "qubit": 2, "column": 6},
]


def validate_entries(entries):
    issues = []
    for i, e in enumerate(entries):
        gate = e.get('gate')
        if gate == 'CP':
            for f in ('control','target','angle'):
                if f not in e:
                    issues.append((i, e, f))
        if gate == 'RZ':
            for f in ('qubit','angle'):
                if f not in e:
                    issues.append((i, e, f))
    return issues


def run_and_capture(entries, name):
    print('='*40)
    print('Payload:', name)
    print(json.dumps(entries, indent=2))
    print('\nValidating required fields...')
    issues = validate_entries(entries)
    if issues:
        print('Validation issues:')
        for idx, entry, field in issues:
            print(f' - Entry index {idx} missing field: {field} -> {entry}')
    else:
        print('All required fields present for CP/RZ entries.')

    try:
        print('\nRunning simulation with steps...')
        res = run_quantum_simulation_with_steps(entries, shots=256)
        print('Simulation returned successfully. summary:')
        print('totalSteps=', res.get('totalSteps'))
    except Exception as ex:
        print('\nException occurred:')
        traceback.print_exc()
        # attempt to extract file and line from traceback
        tb = ex.__traceback__
        while tb.tb_next:
            tb = tb.tb_next
        frame = tb.tb_frame
        print('\nException source file:', frame.f_code.co_filename)
        print('Exception source line:', tb.tb_lineno)


if __name__ == '__main__':
    run_and_capture(bell_payload, 'bell')
    run_and_capture(qft3_payload, 'qft3')
