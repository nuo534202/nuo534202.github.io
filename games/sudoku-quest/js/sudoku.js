class SudokuGenerator {
    constructor() {
        this.grid = [];
        this.solution = [];
    }

    generate(difficulty = 'easy') {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
        
        this._fillDiagonal();
        this._solve(this.grid);
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = this.grid[i][j];
            }
        }
        
        this._removeCells(difficulty);
        
        return {
            puzzle: this.grid.map(row => [...row]),
            solution: this.solution.map(row => [...row])
        };
    }

    _fillDiagonal() {
        for (let i = 0; i < 9; i += 3) {
            this._fillBox(i, i);
        }
    }

    _fillBox(row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!this._isSafeInBox(row, col, num));
                this.grid[row + i][col + j] = num;
            }
        }
    }

    _isSafeInBox(rowStart, colStart, num) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    _isSafe(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    _solve(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    let nums = this._shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (let num of nums) {
                        if (this._isSafe(grid, row, col, num)) {
                            grid[row][col] = num;
                            
                            if (this._solve(grid)) {
                                return true;
                            }
                            
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    _shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    _removeCells(difficulty) {
        let attempts;
        switch (difficulty) {
            case 'easy':
                attempts = 38 + Math.floor(Math.random() * 5);
                break;
            case 'medium':
                attempts = 45 + Math.floor(Math.random() * 6);
                break;
            case 'hard':
                attempts = 53 + Math.floor(Math.random() * 6);
                break;
            default:
                attempts = 40;
        }
        
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            
            if (this.grid[row][col] !== 0) {
                this.grid[row][col] = 0;
                attempts--;
            }
        }
    }

    validate(puzzle, solution) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j] !== 0 && puzzle[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    checkConflicts(grid, row, col, num) {
        let conflicts = [];
        
        for (let x = 0; x < 9; x++) {
            if (x !== col && grid[row][x] === num) {
                conflicts.push({ row: row, col: x });
            }
        }
        
        for (let x = 0; x < 9; x++) {
            if (x !== row && grid[x][col] === num) {
                conflicts.push({ row: x, col: col });
            }
        }
        
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let r = startRow + i;
                let c = startCol + j;
                if ((r !== row || c !== col) && grid[r][c] === num) {
                    conflicts.push({ row: r, col: c });
                }
            }
        }
        
        return conflicts;
    }

    hasUniqueSolution(grid) {
        let tempGrid = grid.map(row => [...row]);
        let solutions = [];
        
        const countSolutions = (g, limit = 2) => {
            let count = 0;
            
            for (let row = 0; row < 9 && count < limit; row++) {
                for (let col = 0; col < 9 && count < limit; col++) {
                    if (g[row][col] === 0) {
                        for (let num = 1; num <= 9 && count < limit; num++) {
                            if (this._isSafe(g, row, col, num)) {
                                g[row][col] = num;
                                count += countSolutions(g, limit);
                                g[row][col] = 0;
                            }
                        }
                        return count;
                    }
                }
            }
            return 1;
        };
        
        let count = countSolutions(tempGrid);
        return count === 1;
    }
}

if (typeof window !== 'undefined') {
    window.SudokuGenerator = SudokuGenerator;
}
