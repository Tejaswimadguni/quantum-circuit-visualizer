import { motion } from 'framer-motion';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onFullscreen: () => void;
}

export default function PlaybackControls({
  isPlaying,
  currentStep,
  totalSteps,
  playbackSpeed,
  onPlayPause,
  onPrevious,
  onNext,
  onReplay,
  onSpeedChange,
  onFullscreen,
}: PlaybackControlsProps) {
  const speedOptions = [0.5, 1, 2, 4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-slate-900/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 space-y-4"
    >
      {/* Step Counter */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-1">Current Step</p>
        <p className="text-3xl font-bold text-cyan-400">
          {currentStep + 1} / {totalSteps}
        </p>
      </div>

      {/* Main Controls */}
      <div className="flex gap-2">
        <button
          onClick={onReplay}
          className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition-colors duration-200 flex items-center justify-center gap-1"
          title="Replay"
        >
          <span>↻ Replay</span>
        </button>
        <button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-slate-200 transition-colors duration-200"
          title="Previous"
        >
          ⏮ Prev
        </button>
        <button
          onClick={onPlayPause}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
            isPlaying
              ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/50'
              : 'bg-slate-700/50 hover:bg-slate-600 text-slate-200'
          }`}
        >
          {isPlaying ? (
            <>
              <span>⏸ Pause</span>
            </>
          ) : (
            <>
              <span>▶ Play</span>
            </>
          )}
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-slate-200 transition-colors duration-200"
          title="Next"
        >
          Next ⏭
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400">Playback Speed: {playbackSpeed}x</p>
        <div className="grid grid-cols-4 gap-2">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                playbackSpeed === speed
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900'
                  : 'bg-slate-700/50 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={onFullscreen}
        className="w-full px-3 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition-colors duration-200"
      >
        ⛶ Fullscreen Mode
      </button>
    </motion.div>
  );
}
