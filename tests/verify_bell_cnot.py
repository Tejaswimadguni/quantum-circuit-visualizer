"""Bell-state CNOT pipeline verification."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

from simulation import run_quantum_simulation_with_steps

BELL_CORRECT = [
    {"gate": "H", "qubit": 0, "column": 0},
    {"gate": "CNOT", "control": 0, "target": 1, "column": 1},
]

BELL_BROKEN_DEMO = [
    {"gate": "H", "qubit": 0, "column": 0},
    {"gate": "CNOT", "qubit": 1, "column": 1},
]

BELL_FIXED_DEMO = [
    {"gate": "H", "qubit": 0, "column": 0},
    {"gate": "CNOT", "control": 0, "target": 1, "column": 1, "qubit": 0},
]


def simulate_frontend_payload(circuit_entries: list) -> list:
    """Mirror resolveCnotWiring: qubit field = control wire."""
    qubits_len = max(
        max((e.get("qubit", 0) for e in circuit_entries), default=0),
        max((e.get("control", 0) for e in circuit_entries), default=0),
        max((e.get("target", 0) for e in circuit_entries), default=0),
    ) + 1
    payload = []
    for entry in circuit_entries:
        if entry["gate"] == "CNOT":
            if entry.get("control") is not None and entry.get("target") is not None:
                control, target = entry["control"], entry["target"]
            else:
                control = entry["qubit"]
                target = (
                    entry["target"]
                    if entry.get("target") is not None
                    else (control + 1 if control < qubits_len - 1 else max(0, control - 1))
                )
            payload.append(
                {"gate": "CNOT", "control": control, "target": target, "column": entry["column"]}
            )
        else:
            payload.append(
                {"gate": entry["gate"], "qubit": entry["qubit"], "column": entry["column"]}
            )
    return payload


def build_unitary_circuit(entries: list) -> QuantumCircuit:
    n = max(
        max((e.get("qubit", 0) for e in entries), default=0),
        max((e.get("control", 0) for e in entries), default=0),
        max((e.get("target", 0) for e in entries), default=0),
    ) + 1
    qc = QuantumCircuit(n)
    for entry in sorted(entries, key=lambda e: (e["column"], e.get("qubit", 0), e.get("control", 0))):
        if entry["gate"] == "H":
            qc.h(entry["qubit"])
            print(f"  h({entry['qubit']})")
        elif entry["gate"] == "CNOT":
            qc.cx(entry["control"], entry["target"])
            print(f"  cx(control={entry['control']}, target={entry['target']})")
    return qc


def dump_statevector(entries: list, label: str) -> None:
    print(f"\n=== {label} ===")
    print("Qiskit gates:")
    qc = build_unitary_circuit(entries)
    sv = Statevector.from_instruction(qc)
    print("Non-zero amplitudes:")
    for i, amp in enumerate(sv.data):
        if abs(amp) > 1e-10:
            print(f"  |{format(i, f'0{qc.num_qubits}b')}>: {amp.real:.4f}{amp.imag:+.4f}j")


def check_bell(result: dict, label: str) -> bool:
    ok = True
    cnot = result["steps"][-1]
    probs = cnot["probabilitiesAfter"]
    print(f"\n--- {label} ---")
    print(f"CNOT step: control={cnot.get('control')} target={cnot.get('target')}")
    print(f"stateBefore: {cnot['stateBefore'].encode('ascii', 'replace').decode()}")
    print(f"stateAfter:  {cnot['stateAfter'].encode('ascii', 'replace').decode()}")
    print(f"probsAfter:  {probs}")
    if probs.get("00") != 0.5 or probs.get("11") != 0.5:
        print("FAIL: expected 50% |00> and 50% |11>")
        ok = False
    if probs.get("01", 0) > 0.01 or probs.get("10", 0) > 0.01:
        print("FAIL: unexpected |01> or |10>")
        ok = False
    if cnot["stateBefore"] == cnot["stateAfter"]:
        print("FAIL: state unchanged on CNOT step")
        ok = False
    if ok:
        print("PASS")
    return ok


def main() -> int:
    log_lines: list[str] = []

    def log(msg: str) -> None:
        log_lines.append(msg)
        print(msg)

    log("Bell CNOT pipeline verification")
    broken_payload = simulate_frontend_payload(BELL_BROKEN_DEMO)
    fixed_payload = simulate_frontend_payload(BELL_FIXED_DEMO)
    log(f"Broken demo API payload: {json.dumps(broken_payload)}")
    log(f"Fixed demo API payload:   {json.dumps(fixed_payload)}")

    all_ok = True
    dump_statevector(BELL_CORRECT, "Correct: H(q0); CNOT(q0->q1)")
    all_ok &= check_bell(run_quantum_simulation_with_steps(BELL_CORRECT), "API CNOT(0,1)")

    dump_statevector(broken_payload, "Broken demo -> cx(1,0)")
    broken_passes = check_bell(run_quantum_simulation_with_steps(broken_payload), "Broken CNOT(1,0)")
    if broken_passes:
        log("UNEXPECTED: reversed CNOT passed Bell test")
        all_ok = False
    else:
        log("Confirmed: reversed CNOT(1,0) fails Bell check (as expected)")

    dump_statevector(fixed_payload, "Fixed demo -> cx(0,1)")
    all_ok &= check_bell(run_quantum_simulation_with_steps(fixed_payload), "Fixed demo CNOT(0,1)")

    log_path = Path(__file__).parent / "bell_cnot_verification.log"
    log_path.write_text("\n".join(log_lines), encoding="utf-8")
    log(f"Wrote {log_path}")
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
