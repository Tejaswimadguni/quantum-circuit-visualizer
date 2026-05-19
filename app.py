from flask import Flask, jsonify
from flask_cors import CORS

from routes import api


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(api)
    return app


app = create_app()


@app.route('/')
def index():
    """Quick sanity check route for the root URL."""
    return jsonify({"status": "Quantum circuit backend is running."})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
