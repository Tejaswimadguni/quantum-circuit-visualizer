"""Mathematical verification suite for quantum simulation."""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from simulation import run_quantum_simulation_with_steps  # noqa: E402

TOL = 0.08


def approx(a: float, b: float, tol: float = TOL) -> bool:
    return abs(a - b) <= tol


def norm_bloch(v):
    return math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)


def check_probs(probs: dict, expected: dict, label: str) -> list[str]:
    errors = []
    for state, exp in expected.items():
        got = probs.get(state, 0.0)
        if not approx(got, exp, 0.02):
            errors.append(f"{label}: P(|{state}>) expected {exp}, got {got}")
    return errors


def check_bloch(bloch, qubit: int, exp_x, exp_y, exp_z, label: str) -> list[str]:
    errors = []
    v = bloch[qubit]
    if not (approx(v[0], exp_x) and approx(v[1], exp_y) and approx(v[2], exp_z)):
        errors.append(
            f"{label}: q{qubit} Bloch expected ({exp_x},{exp_y},{exp_z}), got ({v[0]},{v[1]},{v[2]})"
        )
    return errors


def run_test(name: str, entries: list, checks) -> tuple[bool, list[str]]:
    result = run_quantum_simulation_with_steps(entries)
    errors = []
    for check in checks:
        errors.extend(check(result))
    ok = len(errors) == 0
    print(f"\n{'PASS' if ok else 'FAIL'}: {name}")
    if errors:
        for e in errors:
            print(f"  - {e}")
    else:
        step0 = result["steps"][0] if result["steps"] else {}
        print(f"  executionTime={result.get('executionTime')}")
        print(f"  step0 before={step0.get('stateBefore', '').encode('ascii', 'replace').decode()[:60]}")
        print(f"  step0 after={step0.get('stateAfter', '').encode('ascii', 'replace').decode()[:60]}")
        if result["steps"]:
            last = result["steps"][-1]
            print(f"  final after={last.get('stateAfter', '').encode('ascii', 'replace').decode()[:80]}")
            print(f"  final probs={last.get('probabilitiesAfter')}")
            print(f"  final bloch q0={last.get('blochVectorsAfter', [[]])[0]}")
    return ok, errors


def test1_h(check_result):
    r = check_result
    s = r["steps"][0]
    errors = []
    if s["stateBefore"] == s["stateAfter"]:
        errors.append("stateBefore equals stateAfter on H step")
    if "0" not in s["stateBefore"] and "|0" not in s["stateBefore"]:
        errors.append(f"unexpected stateBefore: {s['stateBefore']}")
    probs_b = s["probabilitiesBefore"]
    probs_a = s["probabilitiesAfter"]
    if not approx(probs_b.get("0", probs_b.get("00", 0)), 1.0, 0.02):
        errors.append(f"probs before not |0>: {probs_b}")
    errors.extend(check_probs(probs_a, {"0": 0.5, "1": 0.5}, "after H"))
    errors.extend(check_bloch(s["blochVectorsAfter"], 0, 1.0, 0.0, 0.0, "after H"))
    if s["probabilitiesBefore"] == s["probabilitiesAfter"]:
        errors.append("probabilitiesBefore equals probabilitiesAfter")
    return errors


def test2_x(check_result):
    s = check_result["steps"][0]
    errors = check_probs(s["probabilitiesAfter"], {"1": 1.0}, "after X")
    errors.extend(check_bloch(s["blochVectorsAfter"], 0, 0.0, 0.0, -1.0, "after X"))
    return errors


def test3_bell(check_result):
    errors = []
    if check_result["qubitCount"] != 2:
        errors.append(f"expected 2 qubits, got {check_result['qubitCount']}")
    steps = check_result["steps"]
    if len(steps) != 2:
        errors.append(f"expected 2 steps, got {len(steps)}")
    # After H: q0 in |+>, q1 in |0>
    h_step = steps[0]
    errors.extend(check_bloch(h_step["blochVectorsAfter"], 0, 1.0, 0.0, 0.0, "after H q0"))
    errors.extend(check_bloch(h_step["blochVectorsAfter"], 1, 0.0, 0.0, 1.0, "after H q1"))
    errors.extend(check_probs(h_step["probabilitiesAfter"], {"00": 0.5, "01": 0.5}, "after H probs"))
    # After CNOT: entangled — reduced states are mixed (Bloch at origin)
    cnot_step = steps[1]
    for q in range(2):
        v = cnot_step["blochVectorsAfter"][q]
        if norm_bloch(v) > 0.05:
            errors.append(f"after CNOT q{q}: expected mixed Bloch ~0, got {v}")
    last = steps[-1]
    probs = last["probabilitiesAfter"]
    errors.extend(check_probs(probs, {"00": 0.5, "11": 0.5}, "Bell final"))
    after = last["stateAfter"]
    if "00" not in after or "11" not in after:
        errors.append(f"state missing Bell terms: {after}")
    return errors


def test4_ghz(check_result):
    errors = []
    if check_result["qubitCount"] != 3:
        errors.append(f"expected 3 qubits, got {check_result['qubitCount']}")
    last = check_result["steps"][-1]
    probs = last["probabilitiesAfter"]
    errors.extend(check_probs(probs, {"000": 0.5, "111": 0.5}, "GHZ final"))
    return errors


def test_step_evolution(check_result):
    """Each step must differ in at least one of state/probs from previous."""
    errors = []
    steps = check_result["steps"]
    for i, step in enumerate(steps):
        if not step["stateBefore"] or not step["stateAfter"]:
            errors.append(f"step {i}: empty state strings")
        if step["stateBefore"] == step["stateAfter"]:
            errors.append(f"step {i} ({step['gate']}): stateBefore == stateAfter")
        if not step["probabilitiesBefore"] and step["gate"] != "MEASURE":
            errors.append(f"step {i}: empty probabilitiesBefore")
        if not step["probabilitiesAfter"]:
            errors.append(f"step {i}: empty probabilitiesAfter")
    for i in range(1, len(steps)):
        if steps[i]["probabilitiesBefore"] != steps[i - 1]["probabilitiesAfter"]:
            # allow dict compare - should chain
            pb = steps[i]["probabilitiesBefore"]
            pa_prev = steps[i - 1]["probabilitiesAfter"]
            if pb != pa_prev:
                errors.append(f"step {i}: probabilitiesBefore != previous probabilitiesAfter")
    return errors


def main():
    all_ok = True

    ok, _ = run_test(
        "TEST 1: H on q0",
        [{"gate": "H", "qubit": 0, "column": 0}],
        [test1_h, test_step_evolution],
    )
    all_ok &= ok

    ok, _ = run_test(
        "TEST 2: X on q0",
        [{"gate": "X", "qubit": 0, "column": 0}],
        [test2_x, test_step_evolution],
    )
    all_ok &= ok

    ok, _ = run_test(
        "TEST 3: H + CNOT(q0->q1)",
        [
            {"gate": "H", "qubit": 0, "column": 0},
            {"gate": "CNOT", "control": 0, "target": 1, "column": 1},
        ],
        [test3_bell, test_step_evolution],
    )
    all_ok &= ok

    # Bell demo circuit entries (fixed explicit control/target)
    ok, _ = run_test(
        "TEST 3b: Bell demo circuit entries",
        [
            {"gate": "H", "qubit": 0, "column": 0},
            {"gate": "CNOT", "control": 0, "target": 1, "column": 1, "qubit": 0},
        ],
        [test3_bell, test_step_evolution],
    )
    all_ok &= ok

    ok, _ = run_test(
        "TEST 4: H + CNOT(0,1) + CNOT(1,2)",
        [
            {"gate": "H", "qubit": 0, "column": 0},
            {"gate": "CNOT", "control": 0, "target": 1, "column": 1},
            {"gate": "CNOT", "control": 1, "target": 2, "column": 2},
        ],
        [test4_ghz, test_step_evolution],
    )
    all_ok &= ok

    # Dump JSON for test 1 step for frontend parity
    r1 = run_quantum_simulation_with_steps([{"gate": "H", "qubit": 0, "column": 0}])
    out = Path(__file__).parent / "fixtures" / "test1_h.json"
    out.parent.mkdir(exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(r1, f, indent=2)
    print(f"\nWrote fixture: {out}")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
