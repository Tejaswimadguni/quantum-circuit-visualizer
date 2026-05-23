# Quantum Circuit Visualizer

A modern React + Tailwind + Framer Motion frontend for a quantum circuit simulation product with advanced execution visualization.

## Features

- **Landing page** with hero animations and a futuristic SaaS aesthetic
- **Sticky glassmorphism navbar** with navigation
- **Responsive simulator UI** with interactive gate grid
- **Real-time state vector** and probability charts
- **Quantum Execution Viewer** - Step-by-step visualization of circuit execution
  - Play/pause/next/previous/replay playback controls
  - Speed control (0.5x, 1x, 2x, 4x)
  - Gate-by-gate state evolution tracking
  - Probability evolution visualization
  - Educational explanations for each gate
  - Bloch sphere synchronization
  - Execution timeline with clickable gates
  - Final execution report with statistics
  - Presentation/fullscreen mode
- **Gate placement system** with undo/redo
- **Demo circuits** (Bell State, Superposition, Entanglement)
- **Toast notifications** and modal dialogs
- **Animated transitions** with Framer Motion
- **Tailwind CSS** styling with glassmorphism effects

## Run Locally

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip

### Setup

1. **Install frontend dependencies**
```bash
npm install
```

2. **Install backend dependencies**
```bash
pip install -r requirements.txt
```

3. **Start the backend (Flask)**
```bash
python app.py
```
Backend runs on `http://localhost:5000`

4. **Start the frontend (Vite)**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

5. **Open the app** in your browser at `http://localhost:5173`

## Usage

### Building a Circuit
1. Navigate to the Simulator
2. Select gates from the gate toolbox
3. Click on the circuit grid to place gates
4. Add/remove qubits as needed
5. Load demo circuits for examples

### Running Simulation
1. Click "Run Quantum Simulation" to execute the circuit
2. View results in the panels (state vector, probabilities, Bloch sphere)

### Viewing Execution (NEW!)
1. Click "View Execution" to see step-by-step execution
2. Use playback controls to navigate through gates
3. Watch state evolution and probability changes
4. Read educational explanations
5. View Bloch sphere updates in real-time
6. Press Replay to restart execution

## Project Structure

```
quantum/
├── src/
│   ├── components/
│   │   ├── SimulatorPage.tsx         # Main simulator interface
│   │   ├── ExecutionViewer.tsx       # Step-by-step execution viewer (NEW!)
│   │   ├── ExecutionViewer/          # Execution viewer sub-components
│   │   │   ├── PlaybackControls.tsx
│   │   │   ├── TimelineView.tsx
│   │   │   ├── StepPanel.tsx
│   │   │   ├── StatePanel.tsx
│   │   │   ├── ProbabilityPanel.tsx
│   │   │   ├── ExplanationPanel.tsx
│   │   │   └── ExecutionReport.tsx
│   │   ├── BlochSphere.tsx           # 3D Bloch sphere visualization
│   │   ├── SimulatorGrid.tsx
│   │   ├── Navbar.tsx
│   │   └── ...other components
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── App.tsx
│   └── main.tsx
├── app.py                             # Flask backend
├── simulation.py                      # Quantum simulation engine (with step-by-step)
├── routes.py                          # API endpoints (with /simulate-with-steps)
├── requirements.txt                   # Python dependencies
└── package.json                       # Node.js dependencies
```

## Backend API Endpoints

### `POST /simulate`
Standard quantum circuit simulation
- Returns final probabilities and measurement counts

### `POST /simulate-with-steps` (NEW!)
Step-by-step quantum circuit execution
- Returns execution history with state evolution
- Includes educational explanations for each gate
- Used by the Execution Viewer

## Documentation

- **EXECUTION_VIEWER_GUIDE.md** - Complete feature documentation
- **SETUP_AND_TESTING.md** - Setup instructions and testing guide

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Flask, Flask-CORS
- **Quantum**: Qiskit, Qiskit-Aer
- **Routing**: React Router v6

## Performance

- Simulator page load: <500ms
- Execution viewer load: 1-3 seconds (depending on circuit)
- Smooth 60fps animations
- Responsive on desktop, tablet, and mobile

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Custom gate library
- [ ] Circuit noise simulation
- [ ] Export execution as video
- [ ] Multi-circuit comparison
- [ ] Performance metrics overlay
- [ ] Advanced quantum gates (phase, rotation)
- [ ] Quantum error correction visualization

## Contributing

To contribute improvements:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

---

**Last Updated**: May 2026  
**Version**: 2.0 (with Execution Viewer)
