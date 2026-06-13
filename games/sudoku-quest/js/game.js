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
        // 跟踪每个单元格的错误状态，避免重复计数并在修正时递减
        this.cellErrorState = [];
        // 日志开关：测试时打开，生产可关闭
        this.errorLogging = true;

        this.levelConfig = {
            1: { name: '入门', difficulty: 'easy', puzzles: 1 },
            2: { name: '进阶', difficulty: 'medium', puzzles: 1 },
            3: { name: '熟练', difficulty: 'medium', puzzles: 1 },
            4: { name: '大师', difficulty: 'hard', puzzles: 1 },
            5: { name: '传奇', difficulty: 'hard', puzzles: 1 }
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
        // 重置每个单元格的错误状态
        this.cellErrorState = Array(9).fill(null).map(() => Array(9).fill(false));

        this.selectedCell = null;
        this.isNoteMode = false;
        this.errors = 0;
        this.startTime = Date.now();
        this.isPaused = false;

        this._log('initGame', { level, puzzleIndex, errors: this.errors });
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
                // 清除单元格：如果之前是错误，先递减
                this._updateErrorCount(row, col, 0);
                this.playerGrid[row][col] = 0;
            } else {
                // 基于解答判断新值是否正确，按状态转移调整计数
                this._updateErrorCount(row, col, num);
                this.playerGrid[row][col] = num;
                this.notes[row][col] = [];
            }
        }

        this._log('inputNumber', { num, row, col, errors: this.errors });
        this._checkCompletion();
    }

    /**
     * 根据解答更新错误计数。仅在新值"错误"状态变化时修改 this.errors：
     *  之前正确 + 新值错误 => 错误数 +1
     *  之前错误 + 新值正确/清空 => 错误数 -1
     *  之前错误 + 新值仍错误 => 不变（避免重复计数）
     *  之前正确 + 新值正确/清空 => 不变
     */
    _updateErrorCount(row, col, newValue) {
        if (!this.cellErrorState[row]) {
            this.cellErrorState[row] = Array(9).fill(false);
        }
        const prevValue = this.playerGrid[row][col];
        const solutionValue = this.currentSolution[row][col];
        const wasWrong = prevValue !== 0 && prevValue !== solutionValue;
        const isWrong = newValue !== 0 && newValue !== solutionValue;

        if (!wasWrong && isWrong) {
            this.errors++;
            this.cellErrorState[row][col] = true;
            this._log('error++', {
                row, col, prev: prevValue, now: newValue, expected: solutionValue, errors: this.errors
            });
        } else if (wasWrong && !isWrong) {
            // 修正或清空错误
            this.errors = Math.max(0, this.errors - 1);
            this.cellErrorState[row][col] = false;
            this._log('error--', {
                row, col, prev: prevValue, now: newValue, expected: solutionValue, errors: this.errors
            });
        } else if (wasWrong && isWrong) {
            // 替换一个错误为另一个错误，单元格仍在错误状态，不重复计数
            this._log('error-same', {
                row, col, prev: prevValue, now: newValue, expected: solutionValue, errors: this.errors
            });
        }
    }

    _log(event, data) {
        if (!this.errorLogging) return;
        if (typeof console !== 'undefined' && console.log) {
            console.log('[ErrorTracker]', event, JSON.stringify(data));
        }
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
        this.cellErrorState = Array(9).fill(null).map(() => Array(9).fill(false));
        this.selectedCell = null;
        this.errors = 0;
        this.startTime = Date.now();
        this._log('resetCurrentPuzzle', { errors: this.errors });
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
