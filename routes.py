from flask import Blueprint, request, jsonify

from simulation import SimulationError, build_quantum_circuit, run_quantum_simulation

api = Blueprint('api', __name__)


@api.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Backend is healthy."})


@api.route('/simulate', methods=['POST'])
def simulate():
    """Run a quantum circuit simulation and return counts and probabilities."""
    if not request.is_json:
        return jsonify({"error": "Request must be application/json."}), 400

    payload = request.get_json()
    if not isinstance(payload, list):
        return jsonify({"error": "Request body must be a JSON array of gate entries."}), 400

    try:
        circuit = build_quantum_circuit(payload)
        counts, probabilities = run_quantum_simulation(circuit)
        return jsonify({"counts": counts, "probabilities": probabilities})
    except SimulationError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as unexpected:
        return jsonify({"error": "Internal server error.", "details": str(unexpected)}), 500
