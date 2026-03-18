# Sudoku Quest

A fun and engaging web-based Sudoku puzzle game with 5 progressive difficulty levels!

## 🎮 Overview

Sudoku Quest is a classic number logic puzzle game. Players need to fill a 9×9 grid with digits 1-9 so that each row, each column, and each of the nine 3×3 subgrids contain all of the digits from 1 to 9 without repetition.

### Key Features

- **5 Difficulty Levels** - Beginner, Intermediate, Advanced, Expert, Master
- **50 Puzzles** - 10 handcrafted puzzles per level
- **Smart Features** - Note mode, error detection, timer
- **Responsive Design** - Play on desktop or mobile

## 🚀 Quick Start

### Online Play

Visit the deployed version: `https://www.nuo534202/games/sudoku-quest/`

### Run Locally

1. Clone or download the project
2. Open `index.html` in your browser
3. Start playing!

Or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8080
# Visit http://localhost:8080
```

## 📖 How to Play

### Controls

**Desktop**

- Click to select a cell
- Press 1-9 to fill a number
- Delete/Backspace to clear
- Press N for note mode
- Arrow keys to move selection

**Mobile**

- Tap to select a cell
- Tap number buttons to fill
- Note button for note mode
- Clear button to erase

### Rules

1. Each row, column, and 3×3 box must contain all digits 1-9
2. Gray numbers are preset and cannot be changed
3. Highlighted cell is currently selected
4. Red numbers indicate conflicts
5. Complete all puzzles in a level to unlock the next

### Level Difficulty

| Level     | Difficulty | Description                     |
| --------- | ---------- | ------------------------------- |
| Level 1   | ★☆☆        | Beginner, great for learning    |
| Level 2-3 | ★★☆        | Intermediate, requires practice |
| Level 4-5 | ★★★        | Expert, for seasoned players    |

## ❓ FAQ

**Q: Does the game save my progress?**

A: No, the game does not save progress. Each time you enter a level, it starts fresh from the beginning. Exiting the game will clear all your game data.

**Q: Can I use keyboard shortcuts?**

A: Yes! Number keys to fill, Delete to clear, N for note mode, arrow keys to navigate.

**Q: Is it mobile-friendly?**

A: Yes! The game features responsive design for seamless play on both desktop and mobile.

**Q: How do I restart the current puzzle?**

A: Click the "Reset" button to restart the current puzzle.

## 📱 About

- Version: 1.0.0
- License: MIT License
- Tech: Pure HTML5 + CSS3 + JavaScript

Enjoy the game! 🎉
