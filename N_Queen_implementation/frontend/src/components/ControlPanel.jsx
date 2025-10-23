import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, RotateCcw, Info, Zap } from 'lucide-react';
import './ControlPanel.css';

const ControlPanel = ({
  boardSize,
  setBoardSize,
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  isRunning,
  onSolve,
  onStop,
  onReset,
  learnMode
}) => {
  const algorithms = [
    {
      value: 'backtracking',
      label: 'Backtracking',
      description: 'Depth-first search with constraint checking. Always finds a solution but can be slow.',
      icon: '🔍'
    },
    {
      value: 'hill_climbing',
      label: 'Hill Climbing',
      description: 'Heuristic optimization that moves queens to reduce conflicts. Faster but can get stuck.',
      icon: '🏔️'
    }
  ];

  const speedLabels = {
    50: 'Lightning',
    100: 'Fast',
    200: 'Normal',
    500: 'Slow',
    1000: 'Step by Step'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="control-panel"
    >
      <div className="panel-header">
        <h2 className="panel-title">
          <span className="title-icon">⚙️</span>
          N-Queens AI Solver
        </h2>
        {learnMode && (
          <div className="learn-mode-indicator">
            <span className="indicator-icon">🎓</span>
            Learn Mode Active
          </div>
        )}
      </div>

      <div className="controls-section">
        {/* Board Size Control */}
        <div className="control-group">
          <label className="control-label">
            <span className="label-icon">📏</span>
            Board Size (N)
          </label>
          <select
            value={boardSize}
            onChange={(e) => {
              onReset(); // Reset the board first
              setBoardSize(parseInt(e.target.value));
            }}
            disabled={isRunning}
            className="control-select"
          >
            {Array.from({ length: 17 }, (_, i) => i + 4).map(n => (
              <option key={n} value={n}>
                {n}×{n} Board
              </option>
            ))}
          </select>
          {learnMode && (
            <div className="tooltip">
              <Info size={16} />
              <span className="tooltip-text">
                Larger boards are exponentially harder to solve. N=8 is the classic problem size.
              </span>
            </div>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className="control-group">
          <label className="control-label">
            <span className="label-icon">🤖</span>
            AI Algorithm
          </label>
          <div className="algorithm-grid">
            {algorithms.map((algo) => (
              <motion.button
                key={algo.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`algorithm-card ${algorithm === algo.value ? 'selected' : ''}`}
                onClick={() => setAlgorithm(algo.value)}
                disabled={isRunning}
              >
                <div className="algorithm-icon">{algo.icon}</div>
                <div className="algorithm-name">{algo.label}</div>
                {learnMode && (
                  <div className="algorithm-description">{algo.description}</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Speed Control */}
        <div className="control-group">
          <label className="control-label">
            <span className="label-icon">⚡</span>
            Animation Speed
          </label>
          <div className="speed-control">
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isRunning}
              className="speed-slider"
            />
            <div className="speed-labels">
              <span className="speed-label">Lightning</span>
              <span className="speed-value">{speedLabels[speed]}</span>
              <span className="speed-label">Step by Step</span>
            </div>
          </div>
          {learnMode && (
            <div className="tooltip">
              <Info size={16} />
              <span className="tooltip-text">
                Slower speeds help you understand how the algorithm works step by step.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`solve-button ${isRunning ? 'running' : ''}`}
            onClick={isRunning ? onStop : onSolve}
            disabled={false}
          >
            <div className="button-content">
              {isRunning ? (
                <>
                  <Square size={20} />
                  <span>Stop AI</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Solve with AI</span>
                </>
              )}
            </div>
            {isRunning && (
              <div className="button-glow"></div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="reset-button"
            onClick={onReset}
            disabled={isRunning}
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </motion.button>
        </div>

        {/* Algorithm Info */}
        {learnMode && (
          <div className="algorithm-info">
            <h4>How {algorithms.find(a => a.value === algorithm)?.label} Works:</h4>
            <p>{algorithms.find(a => a.value === algorithm)?.description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ControlPanel;
