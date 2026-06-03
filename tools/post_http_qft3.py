import json, math, urllib.request

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

req = urllib.request.Request('http://127.0.0.1:5000/simulate-with-steps',
                             data=json.dumps(qft3_payload).encode('utf-8'),
                             headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        print('STATUS', resp.status)
        print(resp.read().decode())
except Exception as e:
    print('HTTP error:', repr(e))
