"""
Backtracking Algorithm for N-Queens Problem
Clean, human-readable implementation
"""

import time
from typing import List, Tuple, Dict, Any
import queue


class BacktrackingSolver:
    def __init__(self, n):
        self.n = n
        self.board = [None] * n
        self.steps = 0
        self.constraint_checks = 0
        self.backtrack_count = 0
        self.is_running = False
        self.log_queue = queue.Queue()
        self.solution_found = False
        
    def log(self, message, log_type="info"):
        """Add log message to queue"""
        self.log_queue.put({
            "message": message,
            "type": log_type,
            "step": self.steps,
            "generation": 0,
            "fitness": 0
        })
    
    def check_constraints(self, row, col):
        """Check if placing queen at (row, col) violates constraints"""
        self.constraint_checks += 1
        
        for i in range(row):
            c = self.board[i]
            if c is None:
                continue
            
            # Column constraint
            if c == col:
                return False
            
            # Diagonal constraint
            if abs(row - i) == abs(col - c):
                return False
        
        return True
    
    def solve(self):
        """Main backtracking algorithm"""
        self.is_running = True
        self.log('Starting Backtracking Algorithm', 'info')
        self.log(f'Solving {self.n}-Queens problem', 'info')
        
        start_time = time.time()
        
        try:
            success = self._backtrack(0)
            end_time = time.time()
            
            if success:
                self.log('Solution found!', 'success')
                self.solution_found = True
            else:
                self.log('No solution found', 'error')
            
            return success, self.board.copy(), {
                'steps': self.steps,
                'constraint_checks': self.constraint_checks,
                'backtrack_count': self.backtrack_count,
                'time_taken': round(end_time - start_time, 3),
                'algorithm': 'backtracking'
            }
            
        except Exception as e:
            self.log(f'Error: {str(e)}', 'error')
            return False, [], {
                'steps': self.steps,
                'constraint_checks': self.constraint_checks,
                'backtrack_count': self.backtrack_count,
                'time_taken': 0,
                'algorithm': 'backtracking',
                'error': str(e)
            }
        finally:
            self.is_running = False
    
    def _backtrack(self, row):
        """Recursive backtracking function"""
        if not self.is_running:
            return False
            
        # All queens placed successfully
        if row == self.n:
            return True
        
        # Try each column for current row
        for col in range(self.n):
            if not self.is_running:
                return False
            
            self.steps += 1
            
            # Only log every 10th attempt to avoid spam
            if self.steps % 10 == 0 or self.steps < 20:
                self.log(f"🔍Step {self.steps}: Trying Queen at row {row}, col {col}", "trying")
            
            if self.check_constraints(row, col):
                # Place queen
                self.board[row] = col
                self.log(f" Placed Queen {row+1} at row {row}, col {col}", "success")
                
                # Recursively place next queen
                if self._backtrack(row + 1):
                    return True
                
                # Backtrack if no solution found
                self.board[row] = None
                self.backtrack_count += 1
                self.log(f"↩️ Backtracking from row {row}, col {col} (backtrack #{self.backtrack_count})", "backtrack")
            else:
                # Only log conflicts occasionally
                if self.steps % 5 == 0:
                    self.log(f"❌ Conflict at row {row}, col {col}", "conflict")
        
        return False
    
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