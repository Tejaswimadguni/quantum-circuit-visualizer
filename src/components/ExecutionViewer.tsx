import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaybackControls from './ExecutionViewer/PlaybackControls';
import TimelineView from './ExecutionViewer/TimelineView';
import StepPanel from './ExecutionViewer/StepPanel';
import StatePanel from './ExecutionViewer/StatePanel';
import ProbabilityPanel from './ExecutionViewer/ProbabilityPanel';
import ExplanationPanel from './ExecutionViewer/ExplanationPanel';
import ExecutionReport from './ExecutionViewer/ExecutionReport';
import BlochSphere from './BlochSphere';

export type ExecutionStep = {
  stepNumber: number;
  gate: string;
  qubit?: number;
  control?: number;
  target?: number;
  column: number;
  stateBefore: string;
  stateAfter: string;
  probabilitiesBefore: Record<string, number>;
  probabilitiesAfter: Record<string, number>;
  explanation: string;
};

export type ExecutionData = {
  steps: ExecutionStep[];
  totalSteps: number;
  qubitCount: number;
  gateCount: number;
  circuitDepth: number;
  finalCounts: Record<string, number>;
  finalProbabilities: Record<string, number>;
  executionTime: string;
  circuitEntries?: any[];
};

export default function ExecutionViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const executionData: ExecutionData | null = location.state?.executionData || null;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!executionData) {
      navigate('/simulator');
      return;
    }
  }, [executionData, navigate]);

  // Auto-advance step during playback
  useEffect(() => {
    if (!isPlaying || !executionData) return;

    const delay = 1500 / playbackSpeed; // Milliseconds per step
    const timer = setTimeout(() => {
      if (currentStep < executionData.totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
        setShowReport(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, playbackSpeed, executionData]);

  const currentStepData = useMemo(
    () => executionData?.steps[currentStep] || null,
    [executionData, currentStep]
  );

  const blochStates = useMemo(() => {
    if (!executionData) return [];

    const probs = currentStepData?.probabilitiesAfter || {};
    const qubits = Array.from({ length: executionData.qubitCount }, (_, i) => `q${i}`);

    return qubits.map((label, index) => {
      const p0 = Object.entries(probs).reduce((sum, [state, prob]) => {
        const bit = state[state.length - 1 - index] ?? '0';
        return sum + (bit === '0' ? prob : 0);
      }, 0) || 0.5;

      const p1 = 1 - p0;
      const z = Math.min(1, Math.max(-1, p0 - p1));
      const theta = Math.acos(z);
      const phi = index * 1.7 + Math.PI / 4;

      return {
        label,
        probabilityZero: p0,
        probabilityOne: p1,
        vector: [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), z] as [number, number, number],
        color: ['#5eead4', '#f472b6', '#7c3aed', '#22d3ee'][index % 4],
      };
    });
  }, [executionData, currentStepData]);

  if (!executionData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Loading execution viewer...</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < executionData.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setShowReport(false);
  };

  return (
    <div
      className={`relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,247,228,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(159,125,255,0.14),_transparent_24%),linear-gradient(180deg,_#050816,_#02040f)] text-slate-100 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-50 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          Exit Fullscreen
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 px-6 py-8 max-w-7xl mx-auto"
      >
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Quantum Execution Viewer
            </h1>
            <p className="text-slate-400">
              Step-by-step visualization of your quantum circuit execution
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel - Timeline & Main Execution */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <TimelineView
              steps={executionData.steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />

            {/* Current Step Details */}
            {currentStepData && (
              <StepPanel step={currentStepData} totalSteps={executionData.totalSteps} />
            )}

            {/* State Evolution */}
            {currentStepData && (
              <StatePanel
                stateBefore={currentStepData.stateBefore}
                stateAfter={currentStepData.stateAfter}
              />
            )}
          </div>

          {/* Right Panel - Bloch Sphere & Controls */}
          <div className="space-y-6">
            {/* Bloch Sphere */}
            <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 h-80">
              <div className="h-full">
                <BlochSphere qubitStates={blochStates} loading={false} />
              </div>
            </div>

            {/* Playback Controls */}
            <PlaybackControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={executionData.totalSteps}
              playbackSpeed={playbackSpeed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onReplay={handleReplay}
              onSpeedChange={setPlaybackSpeed}
              onFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
        </div>

        {/* Probability Evolution */}
        {currentStepData && (
          <ProbabilityPanel
            probabilitiesBefore={currentStepData.probabilitiesBefore}
            probabilitiesAfter={currentStepData.probabilitiesAfter}
          />
        )}

        {/* Educational Explanation */}
        {currentStepData && <ExplanationPanel explanation={currentStepData.explanation} />}

        {/* Final Report */}
        <AnimatePresence>
          {showReport && (
            <ExecutionReport
              executionData={executionData}
              onClose={() => setShowReport(false)}
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
