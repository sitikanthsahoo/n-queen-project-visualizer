import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Target, Zap, Brain } from 'lucide-react';
import './Chessboard.css';

const Chessboard = ({ n, solution, algorithm, isRunning, stats, learnMode }) => {
  const [board, setBoard] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize board
  useEffect(() => {
    const newBoard = Array(n).fill(null).map(() => Array(n).fill(null));
    setBoard(newBoard);
    setCurrentStep(0);
  }, [n]);

  // Update board when solution changes
  useEffect(() => {
    if (solution) {
      setAnimating(true);
      const newBoard = Array(n).fill(null).map(() => Array(n).fill(null));
      
      // Place queens with animation delay
      solution.forEach((col, row) => {
        if (col !== null) {
          setTimeout(() => {
            setBoard(prev => {
              const newBoard = [...prev];
              newBoard[row] = [...newBoard[row]];
              newBoard[row][col] = 'queen';
              return newBoard;
            });
            setCurrentStep(prev => prev + 1);
          }, row * 200);
        }
      });

      setTimeout(() => setAnimating(false), solution.length * 200 + 500);
    } else {
      setBoard(Array(n).fill(null).map(() => Array(n).fill(null)));
      setCurrentStep(0);
    }
  }, [solution, n]);

  const getSquareColor = (row, col) => {
    return (row + col) % 2 === 0 ? '#eeeed2' : '#769656';
  };

  const getQueenIcon = () => {
    switch (algorithm) {
      case 'backtracking':
        return <Target size={24} />;
      case 'hill_climbing':
        return <Zap size={24} />;
      default:
        return <Crown size={24} />;
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'backtracking':
        return 'Systematically explores all possible configurations';
      case 'hill_climbing':
        return 'Moves queens to reduce conflicts step by step';
      default:
        return 'AI solving in progress...';
    }
  };

  const getAnimationStyle = (row, col) => {
    if (board[row][col] === 'queen') {
      return {
        animation: 'queenPlace 0.6s ease-out',
        animationDelay: `${row * 0.1}s`
      };
    }
    return {};
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="chessboard-container"
    >
      {/* Header */}
      <div className="chessboard-header">
        <div className="board-info">
          <h3 className="board-title">
            <span className="board-icon">♛</span>
            {n}×{n} Chessboard
          </h3>
          <p className="algorithm-description">{getAlgorithmDescription()}</p>
        </div>
        
        <div className="board-stats">
          <div className="stat-item">
            <span className="stat-label">Step:</span>
            <span className="stat-value">{currentStep}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Conflicts:</span>
            <span className="stat-value">{stats.fitness || 0}</span>
          </div>
          {algorithm === 'genetic' && (
            <div className="stat-item">
              <span className="stat-label">Generation:</span>
              <span className="stat-value">{stats.generation || 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chessboard */}
      <div className="chessboard-wrapper">
        <div 
          className="chessboard"
          style={{
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`chess-square ${cell ? 'has-queen' : ''}`}
                style={{
                  backgroundColor: getSquareColor(rowIndex, colIndex),
                  ...getAnimationStyle(rowIndex, colIndex)
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {cell === 'queen' && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: rowIndex * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="queen-icon"
                  >
                    {getQueenIcon()}
                  </motion.div>
                )}
                
                {/* Learn mode coordinates */}
                {learnMode && (
                  <div className="square-coordinates">
                    {rowIndex},{colIndex}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Learn mode explanations */}
        {learnMode && (
          <div className="learn-explanations">
            <div className="explanation-card">
              <h4>How it works:</h4>
              <ul>
                <li>Each row must have exactly one queen</li>
                <li>No two queens can be in the same column</li>
                <li>No two queens can be on the same diagonal</li>
                <li>The AI tries different positions and backtracks when conflicts occur</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {isRunning && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / n) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="progress-text">
            {currentStep} of {n} queens placed
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default Chessboard;
