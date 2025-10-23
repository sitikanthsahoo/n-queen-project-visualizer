# AI N-Queens Visualizer

A modern web application that visualizes two different AI algorithms solving the classic N-Queens problem. Built with React (JSX) frontend and Flask backend.

## 🏗️ Architecture

```
N-Queen/
├── backend/                    # Flask Backend Server
│   ├── algorithms/            # AI Algorithm Implementations
│   │   ├── __init__.py       # Algorithm module exports
│   │   ├── backtracking.py   # Backtracking Algorithm
│   │   └── hill_climbing.py  # Hill Climbing Algorithm
│   ├── app.py                # Main Flask Application
│   └── requirements.txt      # Python Dependencies
├── frontend/                  # React Frontend Application
│   ├── src/
│   │   ├── components/       # React Components (JSX)
│   │   │   ├── Chessboard.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── LogPanel.jsx
│   │   │   └── ComparisonPanel.jsx
│   │   ├── App.jsx           # Main React Component
│   │   ├── App.css           # Main Styles
│   │   └── index.js          # React Entry Point
│   ├── package.json          # Node.js Dependencies
│   └── public/               # Static Assets
└── README.md                 # This File
```

## 🔧 Technology Stack

### Backend (Flask)
- **Framework**: Flask with CORS support
- **Algorithms**: 2 AI implementations
  - Backtracking (Depth-first search)
  - Hill Climbing (Heuristic optimization)
- **API**: RESTful endpoints for algorithm execution

### Frontend (React)
- **Framework**: React 18 with JSX syntax
- **UI Library**: Framer Motion for animations
- **Icons**: Lucide React
- **HTTP Client**: Axios for API calls
- **Styling**: CSS with modern animations

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/solve` | Solve N-Queens with specified algorithm |
| GET | `/api/logs` | Get algorithm execution logs |
| POST | `/api/stop` | Stop current algorithm execution |
| GET | `/api/status` | Get current solver status |
| GET | `/api/algorithms` | Get available algorithms |
| GET | `/api/health` | Health check endpoint |

### Example API Call
```javascript
// Solve 8-Queens with backtracking
const response = await axios.post('http://localhost:5000/api/solve', {
  n: 8,
  algorithm: 'backtracking',
  speed: 100
});
```

## 🧠 Algorithms

### 1. Backtracking Algorithm
- **Type**: Depth-first search with constraint checking
- **Guarantee**: Always finds a solution if one exists
- **Best for**: Small to medium boards (N ≤ 12)
- **Time Complexity**: O(N!)

### 2. Hill Climbing Algorithm
- **Type**: Heuristic optimization with local search
- **Guarantee**: May get stuck in local minima
- **Best for**: Medium boards (N ≤ 20)
- **Time Complexity**: O(N² × iterations)

## 🎯 Features

- **Interactive Chessboard**: Visual representation of queen placement
- **Real-time Logging**: Step-by-step algorithm execution logs
- **Algorithm Comparison**: Side-by-side performance metrics
- **Speed Control**: Adjustable animation speed
- **Learn Mode**: Educational explanations and tooltips
- **Responsive Design**: Works on desktop and mobile devices

## 🔄 Data Flow

1. **User Input**: Select board size, algorithm, and speed
2. **Frontend**: Sends POST request to `/api/solve`
3. **Backend**: Creates appropriate solver instance
4. **Algorithm**: Executes and logs progress
5. **API Response**: Returns solution and statistics
6. **Frontend**: Displays solution with animations
7. **Logs**: Real-time updates via `/api/logs` endpoint

## 🛠️ Development

### Backend Development
- Add new algorithms in `backend/algorithms/`
- Update `__init__.py` to export new solvers
- Modify `app.py` to include new algorithm in `get_algorithm_solver()`

### Frontend Development
- Components are in JSX format
- Styling uses CSS with Framer Motion animations
- API calls are centralized in `App.jsx`

## 📊 Performance Notes

- **Backtracking**: Guaranteed solution but exponential time
- **Hill Climbing**: Fast but may not find solution

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure Flask-CORS is installed
2. **Port Conflicts**: Change ports in `app.py` and `package.json`
3. **Module Import Errors**: Check Python path and `__init__.py`

### Debug Mode
- Backend: Set `debug=True` in `app.py`
- Frontend: Use React Developer Tools

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

