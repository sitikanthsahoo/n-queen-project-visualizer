import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { X, TrendingUp, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import './ComparisonPanel.css';

const ComparisonPanel = ({ data, onClose, onClear }) => {
  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="comparison-panel empty"
      >
        <div className="empty-state">
          <TrendingUp size={48} className="empty-icon" />
          <h3>No Comparison Data</h3>
          <p>Run different algorithms to compare their performance</p>
        </div>
      </motion.div>
    );
  }

  // Prepare data for charts
  const chartData = data.map((item, index) => ({
    algorithm: item.algorithm.charAt(0).toUpperCase() + item.algorithm.slice(1).replace('_', ' '),
    steps: item.steps,
    time: item.time,
    success: item.success ? 1 : 0,
    conflicts: item.conflicts,
    generation: item.generation || 0
  }));

  const getAlgorithmColor = (algorithm) => {
    switch (algorithm.toLowerCase()) {
      case 'backtracking':
        return '#667eea';
      case 'hill climbing':
        return '#e74c3c';
      case 'genetic':
        return '#2ecc71';
      default:
        return '#9b59b6';
    }
  };

  const getSuccessRate = () => {
    const successful = data.filter(item => item.success).length;
    return ((successful / data.length) * 100).toFixed(1);
  };

  const getAverageTime = () => {
    const totalTime = data.reduce((sum, item) => sum + item.time, 0);
    return (totalTime / data.length).toFixed(3);
  };

  const getAverageSteps = () => {
    const totalSteps = data.reduce((sum, item) => sum + item.steps, 0);
    return Math.round(totalSteps / data.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="comparison-panel"
    >
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="title-icon">📊</span>
          Algorithm Performance Comparison
        </h3>
        <div className="panel-controls">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="clear-btn"
            onClick={onClear}
          >
            Clear All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </motion.button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Success Rate</div>
            <div className="summary-value">{getSuccessRate()}%</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Avg Time</div>
            <div className="summary-value">{getAverageTime()}s</div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">
            <Target size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Avg Steps</div>
            <div className="summary-value">{getAverageSteps()}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        {/* Steps Comparison */}
        <div className="chart-section">
          <h4 className="chart-title">Steps to Solution</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="algorithm" 
                  stroke="#a0a0a0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="steps" 
                  fill="#667eea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Comparison */}
        <div className="chart-section">
          <h4 className="chart-title">Execution Time</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="algorithm" 
                  stroke="#a0a0a0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="time" 
                  fill="#e74c3c"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Rate */}
        <div className="chart-section">
          <h4 className="chart-title">Success Rate</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="algorithm" 
                  stroke="#a0a0a0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  fontSize={12}
                  domain={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="success" 
                  fill="#2ecc71"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="results-table">
        <h4 className="table-title">Detailed Results</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Steps</th>
                <th>Time (s)</th>
                <th>Success</th>
                <th>Conflicts</th>
                <th>Generation</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="result-row"
                >
                  <td className="algorithm-cell">
                    <span 
                      className="algorithm-badge"
                      style={{ backgroundColor: getAlgorithmColor(item.algorithm) }}
                    >
                      {item.algorithm.charAt(0).toUpperCase() + item.algorithm.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="number-cell">{item.steps}</td>
                  <td className="number-cell">{item.time.toFixed(3)}</td>
                  <td className="status-cell">
                    {item.success ? (
                      <CheckCircle size={16} className="success-icon" />
                    ) : (
                      <XCircle size={16} className="error-icon" />
                    )}
                  </td>
                  <td className="number-cell">{item.conflicts}</td>
                  <td className="number-cell">{item.generation || '-'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="insights">
        <h4 className="insights-title">Key Insights</h4>
        <div className="insights-content">
          {data.length > 1 && (
            <div className="insight-item">
              <strong>Fastest Algorithm:</strong> {
                data.reduce((fastest, current) => 
                  current.time < fastest.time ? current : fastest
                ).algorithm.charAt(0).toUpperCase() + 
                data.reduce((fastest, current) => 
                  current.time < fastest.time ? current : fastest
                ).algorithm.slice(1).replace('_', ' ')
              }
            </div>
          )}
          {data.length > 1 && (
            <div className="insight-item">
              <strong>Most Efficient:</strong> {
                data.reduce((efficient, current) => 
                  current.steps < efficient.steps ? current : efficient
                ).algorithm.charAt(0).toUpperCase() + 
                data.reduce((efficient, current) => 
                  current.steps < efficient.steps ? current : efficient
                ).algorithm.slice(1).replace('_', ' ')
              }
            </div>
          )}
          <div className="insight-item">
            <strong>Total Runs:</strong> {data.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonPanel;
