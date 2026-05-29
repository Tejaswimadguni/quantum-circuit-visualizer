# Quantum Circuit Visualizer — Verification Report

Generated after full root-cause fix and automated test pass.

## Root causes found

| Issue | Root cause | Fix |
|-------|------------|-----|
| **A – State evolution** | Run path used `/simulate` with empty client-built steps | All runs use `/simulate-with-steps`; real `stateBefore`/`stateAfter` from Qiskit |
| **B – CNOT** | Gate wiring was correct; Bloch qubit index was inverted in partial trace | Partial trace uses Qiskit LSB convention `(index >> q) & 1` |
| **C – Bloch Z=1 everywhere** | (1) Wrong qubit bit in partial trace; (2) mixed states defaulted to `(0,0,1)` instead of origin | Fixed indexing; entangled/mixed → `(0,0,0)` + UI label |
| **D – Playback** | `isPlaying` started false | `autoPlay: true` + mount effect |
| **E – Execution time Pending** | Stale React state + fake backend formula | `perf_counter` on backend; pass `executionTime` in navigate state |
| **F – Probability evolution** | Same stub steps as issue A | Per-step `probabilitiesBefore`/`probabilitiesAfter` from statevector |

## Files modified (this pass)

- `simulation.py` — Qiskit-correct Bloch partial trace; mixed-state origin; `blochVectorsBefore`; float JSON probs
- `tests/verify_simulation.py` — Mandatory 4-circuit mathematical suite
- `tests/verify_api.py` — Live HTTP API checks
- `tests/verify_frontend_data.mjs` — Fixture/UI contract validation
- `src/utils/bloch.ts` — Mixed-state labeling
- `tests/fixtures/test1_h.json` — Golden fixture from backend

## Test results (automated, `py -3 tests/verify_simulation.py`)

### TEST 1: H on q0

| Check | Expected | Result |
|-------|----------|--------|
| stateBefore | `1.000\|0⟩` | PASS |
| stateAfter | `0.707\|0⟩ + 0.707\|1⟩` | PASS |
| probabilitiesAfter | 50% / 50% | PASS |
| Bloch q0 | X≈1, Y≈0, Z≈0 → `[1, 0, 0]` | PASS |

### TEST 2: X on q0

| Check | Expected | Result |
|-------|----------|--------|
| stateAfter | `\|1⟩` | PASS |
| P(\|1⟩) | 100% | PASS |
| Bloch q0 | `[0, 0, -1]` | PASS |

### TEST 3: H + CNOT(q0→q1)

| Check | Expected | Result |
|-------|----------|--------|
| After H: Bloch q0 | `[1, 0, 0]` | PASS |
| After H: Bloch q1 | `[0, 0, 1]` | PASS |
| After H: probs | 50% `\|00⟩`, 50% `\|01⟩` | PASS |
| After CNOT: final state | `0.707\|00⟩ + 0.707\|11⟩` | PASS |
| Final probs | 50% `\|00⟩`, 50% `\|11⟩` | PASS |
| After CNOT: Bloch | `[0,0,0]` per qubit (entangled/mixed) | PASS |

### TEST 4: H + CNOT(0,1) + CNOT(1,2) — GHZ

| Check | Expected | Result |
|-------|----------|--------|
| Final state | `0.707\|000⟩ + 0.707\|111⟩` | PASS |
| Final probs | 50% `\|000⟩`, 50% `\|111⟩` | PASS |

## API verification (`py -3 tests/verify_api.py` with Flask on :5000)

```
API PASS: H executionTime=128 ms
API PASS: Bell executionTime=112 ms
```

## Frontend contract (`node tests/verify_frontend_data.mjs`)

```
FRONTEND FIXTURE PASS: test1_h.json matches UI contract
  executionTime: 204 ms
  bloch q0: [ 1, 0, 0 ]
```

## UI mapping verified

- `StatePanel`: `stateBefore` → Before panel; `stateAfter` → After panel (no swap)
- `ProbabilityPanel`: `probabilitiesBefore` / `probabilitiesAfter` per current step
- `ExecutionViewer`: `currentStepData = steps[currentStep]` drives all panels + Bloch
- `PlaybackControls`: displays `executionData.executionTime` (never Pending after success)

## Remaining limitations

1. **Entangled qubits**: Reduced-state Bloch vector is at the origin `(0,0,0)`; UI labels qubits as `(entangled)`. This is correct for maximally mixed single-qubit marginals — not a pure-state Bloch point.
2. **MEASURE steps**: Post-measurement display uses shot histograms, not a collapsed statevector.
3. **Router state**: Refreshing `/execution` loses data (no persistence).
4. **finalCounts** in step simulation include implicit measurement in the final Aer run (sampling noise); step probabilities use exact statevector.

## How to re-run verification

```bash
py -3 tests/verify_simulation.py
py -3 app.py   # separate terminal
py -3 tests/verify_api.py
node tests/verify_frontend_data.mjs
npm run build
```
