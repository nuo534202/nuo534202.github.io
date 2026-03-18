class SudokuGame {
    constructor(sudokuGenerator) {
        this.generator = sudokuGenerator;
        this.currentPuzzle = null;
        this.currentSolution = null;
        this.playerGrid = [];
        this.notes = [];
        this.selectedCell = null;
        this.isNoteMode = false;
        this.errors = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isPaused = false;
        
        this.levelConfig = {
            1: { name: '入门', difficulty: 'easy', puzzles: 10 },
            2: { name: '进阶', difficulty: 'medium', puzzles: 10 },
            3: { name: '熟练', difficulty: 'medium', puzzles: 10 },
            4: { name: '大师', difficulty: 'hard', puzzles: 10 },
            5: { name: '传奇', difficulty: 'hard', puzzles: 10 }
        };
    }

    initGame(level, puzzleIndex = 0) {
        const config = this.levelConfig[level];
        if (!config) return false;
        
        const difficulty = config.difficulty;
        const result = this.generator.generate(difficulty);
        
        this.currentPuzzle = result.puzzle;
        this.currentSolution = result.solution;
        this.playerGrid = result.puzzle.map(row => [...row]);
        
        this.notes = Array(9).fill(null).map(() => 
            Array(9).fill(null).map(() => [])
        );
        
        this.selectedCell = null;
        this.isNoteMode = false;
        this.errors = 0;
        this.startTime = Date.now();
        this.isPaused = false;
        
        return true;
    }

    selectCell(row, col) {
        if (this.currentPuzzle[row][col] !== 0) {
            this.selectedCell = { row, col, isFixed: true };
        } else {
            this.selectedCell = { row, col, isFixed: false };
        }
    }

    clearSelection() {
        this.selectedCell = null;
    }

    inputNumber(num) {
        if (!this.selectedCell || this.selectedCell.isFixed || this.isPaused) return;
        
        const { row, col } = this.selectedCell;
        
        if (this.isNoteMode) {
            if (num === 0) {
                this.notes[row][col] = [];
            } else {
                const idx = this.notes[row][col].indexOf(num);
                if (idx > -1) {
                    this.notes[row][col].splice(idx, 1);
                } else {
                    this.notes[row][col].push(num);
                    this.notes[row][col].sort((a, b) => a - b);
                }
            }
        } else {
            if (num === 0) {
                this.playerGrid[row][col] = 0;
            } else {
                const conflicts = this.generator.checkConflicts(this.playerGrid, row, col, num);
                if (conflicts.length > 0) {
                    this.errors++;
                }
                this.playerGrid[row][col] = num;
                this.notes[row][col] = [];
            }
        }
        
        this._checkCompletion();
    }

    toggleNoteMode() {
        this.isNoteMode = !this.isNoteMode;
    }

    getCellState(row, col) {
        const puzzleValue = this.currentPuzzle[row][col];
        const playerValue = this.playerGrid[row][col];
        const cellNotes = this.notes[row][col];
        
        let isSelected = false;
        let isRelated = false;
        let isSameNumber = false;
        let hasConflict = false;
        
        if (this.selectedCell) {
            const { row: selRow, col: selCol } = this.selectedCell;
            isSelected = (row === selRow && col === selCol);
            
            if (!isSelected) {
                isRelated = (row === selRow || col === selCol || 
                           Math.floor(row/3) === Math.floor(selRow/3) && 
                           Math.floor(col/3) === Math.floor(selCol/3));
                
                const selValue = this.playerGrid[selRow][selCol];
                if (selValue !== 0 && playerValue === selValue) {
                    isSameNumber = true;
                }
            }
            
            if (!this.isNoteMode && playerValue !== 0 && this.currentSolution[row][col] !== playerValue) {
                hasConflict = true;
            }
        }
        
        return {
            puzzleValue,
            playerValue,
            cellNotes,
            isSelected,
            isRelated,
            isSameNumber,
            hasConflict,
            isFixed: puzzleValue !== 0,
            isEmpty: playerValue === 0
        };
    }

    _checkCompletion() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.playerGrid[i][j] === 0) return false;
            }
        }
        
        return this.generator.validate(this.playerGrid, this.currentSolution);
    }

    checkComplete() {
        if (!this._checkCompletion()) return false;
        
        this.stopTimer();
        return true;
    }

    startTimer(callback) {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                callback(elapsed);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    resetCurrentPuzzle() {
        this.playerGrid = this.currentPuzzle.map(row => [...row]);
        this.notes = Array(9).fill(null).map(() => 
            Array(9).fill(null).map(() => [])
        );
        this.selectedCell = null;
        this.errors = 0;
        this.startTime = Date.now();
    }

    getHint() {
        if (!this.selectedCell || this.selectedCell.isFixed) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (this.playerGrid[i][j] !== this.currentSolution[i][j]) {
                        this.selectedCell = { row: i, col: j, isFixed: false };
                        const hintValue = this.currentSolution[i][j];
                        this.playerGrid[i][j] = hintValue;
                        this.notes[i][j] = [];
                        return { row: i, col: j, value: hintValue };
                    }
                }
            }
        } else {
            const { row, col } = this.selectedCell;
            const hintValue = this.currentSolution[row][col];
            this.playerGrid[row][col] = hintValue;
            this.notes[row][col] = [];
            return { row, col, value: hintValue };
        }
        return null;
    }

    getLevelConfig(level) {
        return this.levelConfig[level];
    }

    getAllLevels() {
        return this.levelConfig;
    }
}

if (typeof window !== 'undefined') {
    window.SudokuGame = SudokuGame;
}
