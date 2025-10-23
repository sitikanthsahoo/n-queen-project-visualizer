import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Target, Zap, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import './LogPanel.css';

const LogPanel = ({ logs, stats, algorithm, learnMode }) => {
  const logEndRef = useRef(null);
  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="log-icon success" />;
      case 'error':
        return <XCircle size={16} className="log-icon error" />;
      case 'trying':
        return <Target size={16} className="log-icon trying" />;
      case 'backtrack':
        return <AlertCircle size={16} className="log-icon backtrack" />;
      case 'conflict':
        return <XCircle size={16} className="log-icon conflict" />;
      case 'move':
        return <Zap size={16} className="log-icon move" />;
      case 'info':
        return <Brain size={16} className="log-icon info" />;
      default:
        return <Brain size={16} className="log-icon default" />;
    }
  };

  const getAlgorithmStats = () => {
    const baseStats = [
      { label: 'Steps Taken', value: stats.steps, icon: <Target size={16} /> },
      { label: 'Time Taken', value: `${stats.timeTaken}s`, icon: <Clock size={16} /> },
      { label: 'Success', value: stats.steps > 0 ? 'Yes' : 'No', icon: <CheckCircle size={16} /> },
    ];

    if (algorithm === 'backtracking') {
      baseStats.push(
        { label: 'Constraint Checks', value: stats.constraintChecks, icon: <Brain size={16} /> },
        { label: 'Backtracks', value: stats.backtrackCount, icon: <TrendingUp size={16} /> }
      );
    } else if (algorithm === 'genetic') {
      baseStats.push(
        { label: 'Generations', value: stats.generation, icon: <TrendingUp size={16} /> },
        { label: 'Fitness', value: stats.fitness, icon: <Target size={16} /> }
      );
    } else if (algorithm === 'hill_climbing') {
      baseStats.push(
        { label: 'Fitness', value: stats.fitness, icon: <Target size={16} /> }
      );
    }

    return baseStats;
  };

  const getAlgorithmExplanation = () => {
    switch (algorithm) {
      case 'backtracking':
        return {
          title: 'Backtracking Algorithm',
          description: 'A depth-first search approach that systematically explores all possible configurations. When a conflict is detected, it backtracks to try alternative solutions.',
          steps: [
            'Place queen in current row',
            'Check for conflicts with previous queens',
            'If no conflict, move to next row',
            'If conflict, backtrack and try next position',
            'Repeat until solution found or all possibilities exhausted'
          ]
        };
      case 'hill_climbing':
        return {
          title: 'Hill Climbing Algorithm',
          description: 'A heuristic optimization technique that starts with a random configuration and iteratively improves it by making local moves that reduce conflicts.',
          steps: [
            'Start with random queen placement',
            'Calculate current number of conflicts',
            'Try moving each queen to reduce conflicts',
            'Accept the move if it improves the situation',
            'Repeat until no improvement possible or solution found'
          ]
        };
      case 'genetic':
        return {
          title: 'Genetic Algorithm',
          description: 'An evolutionary approach that maintains a population of solutions and evolves them through selection, crossover, and mutation operations.',
          steps: [
            'Initialize population of random solutions',
            'Evaluate fitness (conflicts) of each solution',
            'Select best solutions for reproduction',
            'Create new solutions through crossover',
            'Apply random mutations',
            'Repeat until solution found or max generations'
          ]
        };
      default:
        return null;
    }
  };

  const algorithmInfo = getAlgorithmExplanation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="log-panel"
    >
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="title-icon">🧠</span>
          AI Thinking...
        </h3>
        <div className="log-count">
          {logs.length} messages
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <h4 className="stats-title">Performance Metrics</h4>
        <div className="stats-grid">
          {getAlgorithmStats().map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div className="logs-container">
        <div className="logs-header">
          <h4 className="logs-title">Algorithm Execution Log</h4>
          <div className="log-controls">
            <span className="log-status">
              {logs.length > 0 ? 'Active' : 'Waiting'}
            </span>
          </div>
        </div>
        
        <div className="logs-content">
          <AnimatePresence>
            {logs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="no-logs"
              >
                <Brain size={48} className="no-logs-icon" />
                <p>AI is ready to solve the N-Queens problem</p>
                <p className="no-logs-subtitle">Click "Solve with AI" to start</p>
              </motion.div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`log-entry ${log.type}`}
                >
                  <div className="log-content">
                    <div className="log-header">
                      {getLogIcon(log.type)}
                      <span className="log-step">Step {log.step || 0}</span>
                      {log.generation !== undefined && (
                        <span className="log-generation">Gen {log.generation}</span>
                      )}
                    </div>
                    <div className="log-message">{log.message}</div>
                    {log.fitness !== undefined && (
                      <div className="log-fitness">Fitness: {log.fitness}</div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Algorithm Explanation */}
      {learnMode && algorithmInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="algorithm-explanation"
        >
          <h4 className="explanation-title">{algorithmInfo.title}</h4>
          <p className="explanation-description">{algorithmInfo.description}</p>
          <div className="explanation-steps">
            <h5>How it works:</h5>
            <ol>
              {algorithmInfo.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LogPanel;
