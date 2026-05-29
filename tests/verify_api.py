"""HTTP API verification against running Flask backend."""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

API = "http://localhost:5000/simulate-with-steps"


def post(entries: list) -> dict:
    body = json.dumps(entries).encode("utf-8")
    req = urllib.request.Request(
        API,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    tests = [
        (
            "H",
            [{"gate": "H", "qubit": 0, "column": 0}],
            lambda r: r["steps"][0]["blochVectorsAfter"][0] == [1.0, 0.0, 0.0],
        ),
        (
            "Bell",
            [
                {"gate": "H", "qubit": 0, "column": 0},
                {"gate": "CNOT", "control": 0, "target": 1, "column": 1},
            ],
            lambda r: r["steps"][-1]["probabilitiesAfter"].get("00") == 0.5
            and r["steps"][-1]["probabilitiesAfter"].get("11") == 0.5,
        ),
    ]

    errors = []
    for name, entries, check in tests:
        try:
            result = post(entries)
        except urllib.error.URLError as exc:
            errors.append(f"{name}: backend not reachable ({exc})")
            continue
        if "executionTime" not in result or result["executionTime"] == "Pending":
            errors.append(f"{name}: missing executionTime")
        if not check(result):
            errors.append(f"{name}: check failed")
        else:
            print(f"API PASS: {name} executionTime={result['executionTime']}")

    if errors:
        for e in errors:
            print(f"API FAIL: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
