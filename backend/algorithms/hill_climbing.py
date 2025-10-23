
import time
import random
from typing import List, Tuple, Dict, Any
import queue
import threading


class HillClimbingSolver:
    def __init__(self, n):
        self.n = n
        self.board = [None] * n
        self.steps = 0
        self.fitness = 0
        self.is_running = False
        self.log_queue = queue.Queue()
        self.solution_found = False
        self.delay = 0.1  # Small delay for visualization
        
    def log(self, message, log_type="info"):
        """Add log message to queue"""
        self.log_queue.put({
            "message": message,
            "type": log_type,
            "step": self.steps,
            "generation": 0,
            "fitness": self.fitness
        })
    
    def count_conflicts(self, board):
        """Count number of conflicts in current board state"""
        conflicts = 0
        for i in range(len(board)):
            if board[i] is None:
                continue
            for j in range(i + 1, len(board)):
                if board[j] is None:
                    continue
                # Column conflict
                if board[i] == board[j]:
                    conflicts += 1
                # Diagonal conflict
                if abs(i - j) == abs(board[i] - board[j]):
                    conflicts += 1
        return conflicts
    
    def solve(self, max_iterations=1000):
        """Main hill climbing algorithm"""
        self.is_running = True
        self.log('Starting Hill Climbing Algorithm', 'info')
        self.log(f'Solving {self.n}-Queens problem', 'info')
        
        start_time = time.time()
        
        try:
            # Initialize with random placement
            self.board = [random.randint(0, self.n - 1) for _ in range(self.n)]
            self.fitness = self.count_conflicts(self.board)
            self.log(f"Initial board with {self.fitness} conflicts", "info")
            
            success = self._hill_climb(max_iterations)
            end_time = time.time()
            
            if success:
                self.log('Solution found!', 'success')
                self.solution_found = True
            else:
                self.log('No solution found - stuck at local minimum', 'error')
            
            return success, self.board.copy(), {
                'steps': self.steps,
                'fitness': self.fitness,
                'time_taken': round(end_time - start_time, 3),
                'algorithm': 'hill_climbing'
            }
            
        except Exception as e:
            self.log(f'Error: {str(e)}', 'error')
            return False, [], {
                'steps': self.steps,
                'fitness': self.fitness,
                'time_taken': 0,
                'algorithm': 'hill_climbing',
                'error': str(e)
            }
        finally:
            self.is_running = False
    
    def _hill_climb(self, max_iterations):
        """Hill climbing main loop"""
        restarts = 0
        total_attempts = 0
        
        for iteration in range(max_iterations):
            if not self.is_running:
                return False
            
            total_attempts += 1
            
            if self.fitness == 0:
                self.log(f" Solution found after {total_attempts} attempts and {restarts} restarts!", "success")
                return True
            
            # Find best move
            best_move = None
            best_fitness = self.fitness
            moves_evaluated = 0
            
            for row in range(self.n):
                for col in range(self.n):
                    if col == self.board[row]:
                        continue
                    
                    moves_evaluated += 1
                    
                    # Try this move
                    old_col = self.board[row]
                    self.board[row] = col
                    new_fitness = self.count_conflicts(self.board)
                    
                    if new_fitness < best_fitness:
                        best_fitness = new_fitness
                        best_move = (row, col)
                    
                    # Restore
                    self.board[row] = old_col
            
            if best_move is None:
                restarts += 1
                self.log(f" Stuck at local minimum (fitness: {self.fitness}) - Restart #{restarts}", "warning")
                # Restart with new random board
                self.board = [random.randint(0, self.n - 1) for _ in range(self.n)]
                self.fitness = self.count_conflicts(self.board)
                self.log(f" New random board with {self.fitness} conflicts", "info")
            else:
                row, col = best_move
                old_col = self.board[row]
                self.board[row] = col
                self.fitness = best_fitness
                self.steps += 1
                self.log(f" Moved Queen from row {row}, col {old_col} to row {row}, col {col} - Conflicts: {self.fitness}", "move")
        
        self.log(f" No solution found after {max_iterations} iterations and {restarts} restarts", "error")
        return self.fitness == 0
    
    def stop(self):
        """Stop the algorithm"""
        self.is_running = False
        self.log('Algorithm stopped', 'info')
    
    def get_logs(self):
        """Get all pending log messages"""
        logs = []
        try:
            while True:
                log = self.log_queue.get_nowait()
                logs.append(log)
        except queue.Empty:
            pass
        return logs