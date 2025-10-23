import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ControlPanel from './components/ControlPanel.jsx';
import Chessboard from './components/Chessboard.jsx';
import LogPanel from './components/LogPanel.jsx';
import ComparisonPanel from './components/ComparisonPanel.jsx';
import './App.css';

// Replace this line
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [boardSize, setBoardSize] = useState(8);
  const [algorithm, setAlgorithm] = useState('backtracking');
  const [isRunning, setIsRunning] = useState(false);
  const [solution, setSolution] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    steps: 0,
    constraintChecks: 0,
    backtrackCount: 0,
    generation: 0,
    fitness: 0,
    timeTaken: 0
  });
  const [comparisonData, setComparisonData] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [learnMode, setLearnMode] = useState(false);
  const [speed, setSpeed] = useState(100);

  // Add this effect to reset solution when board size changes
  // Delete these lines at the bottom of the file
  // useEffect(() => {
  //   // Reset solution and stats when board size changes
  //   setSolution(null);
  //   setStats({
  //     steps: 0,
  //     constraintChecks: 0,
  //     backtrackCount: 0,
  //     generation: 0,
  //     fitness: 0,
  //     timeTaken: 0
  //   });
  // }, [boardSize]);
  
  // Fetch logs periodically when solving
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE}/api/logs`);
          setLogs(prev => [...prev, ...response.data.logs]);
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const solveNQueens = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setSolution(null);
    setLogs([]);
    setStats({
      steps: 0,
      constraintChecks: 0,
      backtrackCount: 0,
      generation: 0,
      fitness: 0,
      timeTaken: 0
    });

    try {
      const response = await axios.post(`${API_BASE}/api/solve`, {
        n: boardSize,
        algorithm: algorithm,
        speed: speed
      });

      const result = response.data;
      console.log('Solution result:', result);
      setSolution(result.solution);
      setStats({
        steps: result.steps,
        constraintChecks: result.constraint_checks,
        backtrackCount: result.backtrack_count,
        generation: result.generation || 0,
        fitness: result.fitness || 0,
        timeTaken: result.time_taken
      });

      // Add final log
      setLogs(prev => [...prev, {
        message: result.success ? '🎉 Solution found!' : '❌ No solution found',
        type: result.success ? 'success' : 'error',
        step: result.steps
      }]);

    } catch (error) {
      console.error('Error solving N-Queens:', error);
      setLogs(prev => [...prev, {
        message: `❌ Error: ${error.message}`,
        type: 'error',
        step: 0
      }]);
    } finally {
      setIsRunning(false);
    }
  }, [boardSize, algorithm, speed, isRunning]);

  const stopSolving = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/api/stop`);
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping solver:', error);
    }
  }, []);

  const resetBoard = useCallback(() => {
    setSolution(null);
    setLogs([]);
    setStats({
      steps: 0,
      constraintChecks: 0,
      backtrackCount: 0,
      generation: 0,
      fitness: 0,
      timeTaken: 0
    });
    setIsRunning(false);
  }, []);

  const addToComparison = useCallback(() => {
    if (stats.steps > 0) {
      const newData = {
        algorithm,
        steps: stats.steps,
        time: stats.timeTaken,
        success: solution !== null,
        conflicts: stats.fitness,
        generation: stats.generation
      };
      setComparisonData(prev => [...prev, newData]);
    }
  }, [algorithm, stats, solution]);

  const clearComparison = useCallback(() => {
    setComparisonData([]);
    setShowComparison(false);
  }, []);

  return (
    <div className="app">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="app-container"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="app-header"
        >
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">♛</span>
              AI N-Queens Visualizer
            </h1>
            <p className="app-subtitle">
              Interactive educational dashboard for learning AI algorithms
            </p>
          </div>
          <div className="header-controls">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`learn-mode-toggle ${learnMode ? 'active' : ''}`}
              onClick={() => setLearnMode(!learnMode)}
            >
              <span className="toggle-icon">🎓</span>
              Learn Mode
            </motion.button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="left-panel"
          >
            <ControlPanel
              boardSize={boardSize}
              setBoardSize={setBoardSize}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              speed={speed}
              setSpeed={setSpeed}
              isRunning={isRunning}
              onSolve={solveNQueens}
              onStop={stopSolving}
              onReset={resetBoard}
              learnMode={learnMode}
            />
          </motion.div>

          {/* Center Panel - Chessboard */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="center-panel"
          >
            <Chessboard
              n={boardSize}
              solution={solution}
              algorithm={algorithm}
              isRunning={isRunning}
              stats={stats}
              learnMode={learnMode}
            />
          </motion.div>

          {/* Right Panel - Logs */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="right-panel"
          >
            <LogPanel
              logs={logs}
              stats={stats}
              algorithm={algorithm}
              learnMode={learnMode}
            />
          </motion.div>
        </div>

        {/* Bottom Panel - Comparison */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bottom-panel"
            >
              <ComparisonPanel
                data={comparisonData}
                onClose={() => setShowComparison(false)}
                onClear={clearComparison}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Controls */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="comparison-controls"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="comparison-btn"
            onClick={addToComparison}
            disabled={stats.steps === 0}
          >
            📊 Add to Comparison
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="comparison-btn"
            onClick={() => setShowComparison(true)}
            disabled={comparisonData.length === 0}
          >
            📈 View Comparison
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
