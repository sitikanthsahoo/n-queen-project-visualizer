"""
AI N-Queens Visualizer - Clean Flask Backend
Simple, clean implementation without debug mode
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
from algorithms import BacktrackingSolver, HillClimbingSolver

app = Flask(__name__)
CORS(app)

# Global solver instance
current_solver = None
solver_thread = None

def get_algorithm_solver(algorithm, n):
    """Create the appropriate solver based on algorithm name"""
    if algorithm == 'backtracking':
        return BacktrackingSolver(n)
    elif algorithm == 'hill_climbing':
        return HillClimbingSolver(n)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

@app.route('/api/solve', methods=['POST'])
def solve_nqueens():
    """Solve N-Queens problem with specified algorithm"""
    global current_solver, solver_thread
    
    data = request.json
    n = data.get('n', 8)
    algorithm = data.get('algorithm', 'backtracking')
    
    # Stop any running solver
    if current_solver:
        current_solver.stop()
        if solver_thread and solver_thread.is_alive():
            solver_thread.join(timeout=1)
    
    try:
        # Create new solver
        current_solver = get_algorithm_solver(algorithm, n)
        
        # Run solver
        success, solution, stats = current_solver.solve()
        
        return jsonify({
            'success': success,
            'solution': solution,
            'steps': stats.get('steps', 0),
            'constraint_checks': stats.get('constraint_checks', 0),
            'backtrack_count': stats.get('backtrack_count', 0),
            'generation': stats.get('generation', 0),
            'fitness': stats.get('fitness', 0),
            'time_taken': stats.get('time_taken', 0),
            'algorithm': algorithm,
            'n': n
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Get algorithm logs"""
    global current_solver
    
    if not current_solver:
        return jsonify({'logs': []})
    
    logs = current_solver.get_logs()
    return jsonify({'logs': logs})

@app.route('/api/stop', methods=['POST'])
def stop_solver():
    """Stop the current solver"""
    global current_solver, solver_thread
    
    if current_solver:
        current_solver.stop()
    
    if solver_thread and solver_thread.is_alive():
        solver_thread.join(timeout=1)
    
    return jsonify({'status': 'stopped'})

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current solver status"""
    global current_solver
    
    if not current_solver:
        return jsonify({'running': False})
    
    return jsonify({
        'running': current_solver.is_running,
        'steps': current_solver.steps,
        'generation': getattr(current_solver, 'generation', 0),
        'fitness': getattr(current_solver, 'fitness', 0)
    })

@app.route('/api/algorithms', methods=['GET'])
def get_algorithms():
    """Get available algorithms"""
    return jsonify({
        'algorithms': [
            {
                'value': 'backtracking',
                'name': 'Backtracking',
                'description': 'Depth-first search with constraint checking',
                'icon': '🔍'
            },
            {
                'value': 'hill_climbing',
                'name': 'Hill Climbing',
                'description': 'Heuristic optimization with local search',
                'icon': '🏔️'
            }
        ]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'version': '1.0.0'
    })

# Add this at the top of the file with other imports
import os

# Modify the CORS setup to allow your Vercel frontend domain
CORS(app, origins=["http://localhost:3000", "https://n-queen-implementation.vercel.app/"])

# Modify the last part of the file
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print("🚀 AI N-Queens Backend Server")
    print(f"📡 Running on port: {port}")
    print("🔧 Press Ctrl+C to stop")
    app.run(host='0.0.0.0', port=port)