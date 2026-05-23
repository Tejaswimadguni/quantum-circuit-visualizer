# Quantum Execution Viewer - Setup & Testing Guide

## Quick Start

### 1. Backend Setup

Ensure Python dependencies are installed:
```bash
pip install -r requirements.txt
```

Start the Flask backend:
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

### 2. Frontend Setup

Install frontend dependencies (if not already done):
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

You should see:
```
VITE v[version] ready in [X] ms

➜  Local:   http://localhost:5173/
```

### 3. Testing the Feature

1. **Open the app** in your browser at `http://localhost:5173`
2. **Navigate to Simulator** - Click the simulator link in the navbar
3. **Load a demo circuit** - Click "Bell State" or another demo
4. **Run simulation** - Click "Run Quantum Simulation"
5. **View execution** - Click "View Execution" button (next to Run Simulation)

## What to Expect

### First Time Launch
- The page navigates to `/execution`
- Loads the step-by-step execution data from the backend
- Displays timeline, controls, and visualization panels
- Automatically shows the first step

### Playback Experience
- Press **Play** to auto-advance through gates (1.5 seconds per step at 1x speed)
- Gates highlight in the timeline as they execute
- State panel updates with before/after quantum states
- Probability bars animate to show changes
- Bloch sphere updates for each qubit
- Educational explanation shows for current gate

### Interactive Features
- **Click gates in timeline** to jump to that step
- **Adjust speed** with 0.5x, 1x, 2x, 4x buttons
- **Pause/Resume** playback anytime
- **Use Previous/Next** for single-step navigation
- **Replay** to restart from the beginning
- **Fullscreen mode** for presentation

### Completion
- When all steps finish, an execution report appears
- Shows final probabilities and statistics
- Allows you to replay or close

## Testing Scenarios

### Test 1: Bell State (Entanglement)
1. Load Bell State demo
2. Click View Execution
3. Expected:
   - 2 qubits, 3 gates (H, CNOT, MEASURE)
   - Step 1: H creates superposition (|00⟩ → 0.707|00⟩ + 0.707|10⟩)
   - Step 2: CNOT entangles qubits (creates 0.707|00⟩ + 0.707|11⟩)
   - Step 3: Measurement collapses to either |00⟩ or |11⟩

### Test 2: Superposition
1. Load Superposition demo
2. Click View Execution
3. Expected:
   - Multiple Hadamard gates create 4-state superposition
   - Probabilities should be even across all states
   - Each gate should explain superposition creation

### Test 3: Custom Circuit
1. Build your own circuit with gates
2. Click View Execution
3. Expected:
   - All gates appear in timeline
   - State evolution is logical and correct
   - Educational explanations are accurate

### Test 4: Playback Controls
1. Load any circuit
2. Click View Execution
3. Test:
   - [ ] Play button auto-advances steps
   - [ ] Pause button stops auto-advance
   - [ ] Previous button goes back one step (disabled on step 1)
   - [ ] Next button advances one step (disabled on last step)
   - [ ] Speed buttons change playback speed
   - [ ] Replay button resets to step 1
   - [ ] Clicking timeline gate jumps to that step
   - [ ] Fullscreen button makes fullscreen (esc/exit button to exit)

### Test 5: Responsive Design
1. Load execution viewer
2. Test on different screen sizes:
   - [ ] Desktop (1920px) - 3-column layout
   - [ ] Tablet (768px) - Stacked layout
   - [ ] Mobile (320px) - Full width
   - [ ] Verify all text is readable
   - [ ] Verify buttons are clickable

## Troubleshooting

### "Loading execution viewer..." takes too long
- **Issue**: Backend not running or slow
- **Solution**: Verify Flask backend is running, check network tab in browser DevTools

### "Execution viewer failed" error
- **Issue**: Backend endpoint not found or circuit has no gates
- **Solution**: Ensure /simulate-with-steps endpoint exists, add at least one gate before running

### Gates don't highlight in timeline
- **Issue**: CSS not loading or animation disabled
- **Solution**: Clear browser cache (Ctrl+Shift+Delete), reload page

### Bloch sphere not updating
- **Issue**: Three.js rendering issue or wrong props
- **Solution**: Check browser console for errors, verify GPU acceleration enabled

### Mobile layout broken
- **Issue**: Responsive classes not working
- **Solution**: Clear Tailwind CSS cache, rebuild CSS with `npm run build`

## Performance Testing

### Expected Load Times
- Simulator page load: <500ms
- View Execution click to page load: 1-3 seconds (depends on circuit size)
- Step animation: ~1.5 seconds at 1x speed
- Report display: Instant

### Network Requests
Monitor in browser DevTools Network tab:
- POST /simulate-with-steps: ~1-3 seconds response time
- Response size: ~2-10KB depending on step count

## Browser Developer Tools Tips

### Debug Execution Data
In browser console:
```javascript
// See the execution data in location state
console.log(window.history.state)
```

### Monitor Performance
```javascript
// Check frame rate during playback
// Open Performance tab and record during playback
```

### Check API Response
1. Open DevTools Network tab
2. Click "View Execution"
3. Look for POST request to /simulate-with-steps
4. Click on it and view Response tab to see raw execution data

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Backend unavailable" | Flask not running | Start Flask: `python app.py` |
| View Execution disabled | No gates in circuit | Add at least one gate |
| Step-by-step fails silently | Network error | Check DevTools Network tab |
| Animations janky | GPU issue | Disable browser extensions, close tabs |
| States not updating | Old component props | Force refresh: Ctrl+Shift+R |
| Bloch sphere broken | Three.js error | Check browser console for WebGL errors |

## Feature Checklist

Implementation includes:

- [x] Step-by-step execution viewer page
- [x] Playback controls (play, pause, next, prev, replay, speed)
- [x] Timeline view with clickable gates
- [x] Step counter display
- [x] State evolution panel (before/after)
- [x] Probability evolution visualization
- [x] Educational explanations
- [x] Bloch sphere synchronization
- [x] Execution report modal
- [x] Fullscreen presentation mode
- [x] Backend step-by-step endpoint
- [x] Backend state tracking
- [x] Backend gate explanations
- [x] Responsive design (desktop, tablet, mobile)
- [x] Smooth animations with Framer Motion
- [x] Consistent styling with existing theme
- [x] Error handling
- [x] Toast notifications

## Next Steps

1. **Test locally** - Follow testing scenarios above
2. **Deploy** - Build and deploy following project documentation
3. **Gather feedback** - Get user feedback on experience
4. **Iterate** - Add requested features or improvements
5. **Document** - Update user guides and API docs

## Support

For issues or questions:
1. Check EXECUTION_VIEWER_GUIDE.md for feature documentation
2. Review browser console for error messages
3. Check backend logs for API errors
4. Verify all dependencies are installed

---

**Need Help?**
- Frontend issues: Check src/components/ExecutionViewer.tsx
- Backend issues: Check simulation.py and routes.py
- Styling issues: Check Tailwind CSS classes
- Animation issues: Check Framer Motion transitions
