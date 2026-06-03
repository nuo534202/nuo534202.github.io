(function () {
    'use strict';

    // Difficulty configs
    var DIFFICULTIES = {
        beginner:     { rows: 9,  cols: 9,  mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert:       { rows: 16, cols: 30, mines: 99 }
    };

    // Game state
    var difficulty = 'beginner';
    var rows, cols, totalMines;
    var board = [];       // 2D: { mine, revealed, flagged, count }
    var gameOver = false;
    var gameWon = false;
    var firstClick = true;
    var flagMode = false;
    var timer = 0;
    var timerInterval = null;
    var revealedCount = 0;
    var flagCount = 0;

    // DOM refs
    var boardEl = document.getElementById('ms-board');
    var timerEl = document.getElementById('ms-timer');
    var minesEl = document.getElementById('ms-mines');
    var faceEl = document.getElementById('ms-face');
    var resetBtn = document.getElementById('ms-reset');
    var flagToggle = document.getElementById('ms-flag-toggle');
    var helpBtn = document.getElementById('ms-help-btn');
    var helpModal = document.getElementById('ms-help-modal');
    var helpClose = document.getElementById('ms-help-close');
    var resultModal = document.getElementById('ms-result-modal');
    var resultClose = document.getElementById('ms-result-close');
    var resultIcon = document.getElementById('ms-result-icon');
    var resultTitle = document.getElementById('ms-result-title');
    var resultText = document.getElementById('ms-result-text');
    var resultRetry = document.getElementById('ms-result-retry');
    var diffBtns = document.querySelectorAll('.ms-diff-btn');

    // ---- Init ----
    function init() {
        var cfg = DIFFICULTIES[difficulty];
        rows = cfg.rows;
        cols = cfg.cols;
        totalMines = cfg.mines;
        gameOver = false;
        gameWon = false;
        firstClick = true;
        flagMode = false;
        revealedCount = 0;
        flagCount = 0;
        timer = 0;

        stopTimer();
        timerEl.textContent = '000';
        minesEl.textContent = pad3(totalMines);
        faceEl.textContent = '😊';
        flagToggle.classList.remove('active');

        // Build empty board
        board = [];
        for (var r = 0; r < rows; r++) {
            board[r] = [];
            for (var c = 0; c < cols; c++) {
                board[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
            }
        }

        renderBoard();
    }

    // ---- Place mines (after first click) ----
    function placeMines(safeR, safeC) {
        var placed = 0;
        while (placed < totalMines) {
            var r = Math.floor(Math.random() * rows);
            var c = Math.floor(Math.random() * cols);
            // Skip if already a mine or in safe zone (3x3 around first click)
            if (board[r][c].mine) continue;
            if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
            board[r][c].mine = true;
            placed++;
        }
        // Calculate counts
        for (var r2 = 0; r2 < rows; r2++) {
            for (var c2 = 0; c2 < cols; c2++) {
                if (board[r2][c2].mine) continue;
                var cnt = 0;
                forEachNeighbor(r2, c2, function (nr, nc) {
                    if (board[nr][nc].mine) cnt++;
                });
                board[r2][c2].count = cnt;
            }
        }
    }

    // ---- Render board ----
    function renderBoard() {
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var cell = document.createElement('div');
                cell.className = 'ms-cell hidden';
                cell.dataset.row = r;
                cell.dataset.col = c;
                boardEl.appendChild(cell);
            }
        }
    }

    // ---- Update a single cell's appearance ----
    function updateCell(r, c) {
        var idx = r * cols + c;
        var cellEl = boardEl.children[idx];
        var data = board[r][c];

        cellEl.className = 'ms-cell';

        if (data.revealed) {
            cellEl.classList.add('revealed');
            if (data.mine) {
                cellEl.classList.add('mine-exploded');
                cellEl.innerHTML = '<span class="mine-content">💣</span>';
            } else if (data.count > 0) {
                cellEl.classList.add('n' + data.count);
                cellEl.textContent = data.count;
            } else {
                cellEl.textContent = '';
            }
        } else {
            cellEl.classList.add('hidden');
            if (data.flagged) {
                cellEl.classList.add('flagged');
            }
            cellEl.textContent = '';
        }
    }

    // ---- Reveal cell ----
    function reveal(r, c) {
        var data = board[r][c];
        if (data.revealed || data.flagged || gameOver) return;

        if (firstClick) {
            firstClick = false;
            placeMines(r, c);
            startTimer();
        }

        data.revealed = true;
        revealedCount++;

        if (data.mine) {
            // Game over
            gameOver = true;
            faceEl.textContent = '😵';
            stopTimer();
            revealAllMines(r, c);
            showResult(false);
            return;
        }

        updateCell(r, c);

        // Flood fill for empty cells
        if (data.count === 0) {
            forEachNeighbor(r, c, function (nr, nc) {
                reveal(nr, nc);
            });
        }

        checkWin();
    }

    // ---- Chord (click on revealed number) ----
    function chord(r, c) {
        var data = board[r][c];
        if (!data.revealed || data.count === 0 || gameOver) return;

        var adjacentFlags = 0;
        forEachNeighbor(r, c, function (nr, nc) {
            if (board[nr][nc].flagged) adjacentFlags++;
        });

        if (adjacentFlags === data.count) {
            forEachNeighbor(r, c, function (nr, nc) {
                if (!board[nr][nc].flagged && !board[nr][nc].revealed) {
                    reveal(nr, nc);
                }
            });
        }
    }

    // ---- Toggle flag ----
    function toggleFlag(r, c) {
        var data = board[r][c];
        if (data.revealed || gameOver) return;

        if (firstClick) {
            // Don't start timer on flag, but allow flagging
        }

        data.flagged = !data.flagged;
        flagCount += data.flagged ? 1 : -1;
        minesEl.textContent = pad3(totalMines - flagCount);
        updateCell(r, c);
    }

    // ---- Reveal all mines on game over ----
    function revealAllMines(explodedR, explodedC) {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var data = board[r][c];
                var idx = r * cols + c;
                var cellEl = boardEl.children[idx];

                if (data.mine && !data.flagged) {
                    data.revealed = true;
                    cellEl.className = 'ms-cell revealed mine-revealed';
                    cellEl.innerHTML = '<span class="mine-content">💣</span>';
                    if (r === explodedR && c === explodedC) {
                        cellEl.className = 'ms-cell revealed mine-exploded';
                    }
                } else if (!data.mine && data.flagged) {
                    // Wrong flag
                    cellEl.className = 'ms-cell revealed wrong-flag';
                    cellEl.innerHTML = '<span class="mine-content">❌</span>';
                }
            }
        }
    }

    // ---- Check win ----
    function checkWin() {
        if (revealedCount === rows * cols - totalMines) {
            gameOver = true;
            gameWon = true;
            faceEl.textContent = '😎';
            stopTimer();

            // Auto-flag remaining mines
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    if (board[r][c].mine && !board[r][c].flagged) {
                        board[r][c].flagged = true;
                        flagCount++;
                        updateCell(r, c);
                    }
                }
            }
            minesEl.textContent = pad3(0);
            showResult(true);
        }
    }

    // ---- Show result modal ----
    function showResult(won) {
        if (won) {
            resultIcon.textContent = '🎉';
            resultTitle.textContent = '恭喜过关！';
            resultText.textContent = '用时：' + timer + '秒';
        } else {
            resultIcon.textContent = '💥';
            resultTitle.textContent = '踩到地雷了！';
            resultText.textContent = '用时：' + timer + '秒';
        }
        setTimeout(function () {
            resultModal.classList.add('show');
        }, 400);
    }

    // ---- Timer ----
    function startTimer() {
        stopTimer();
        timer = 0;
        timerInterval = setInterval(function () {
            timer++;
            if (timer > 999) timer = 999;
            timerEl.textContent = pad3(timer);
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // ---- Helpers ----
    function forEachNeighbor(r, c, fn) {
        for (var dr = -1; dr <= 1; dr++) {
            for (var dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                var nr = r + dr;
                var nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    fn(nr, nc);
                }
            }
        }
    }

    function pad3(n) {
        var s = String(Math.abs(n));
        while (s.length < 3) s = '0' + s;
        if (n < 0) s = '-' + s.slice(1);
        return s;
    }

    // ---- Event: Board click ----
    boardEl.addEventListener('click', function (e) {
        var cellEl = e.target.closest('.ms-cell');
        if (!cellEl) return;
        var r = parseInt(cellEl.dataset.row, 10);
        var c = parseInt(cellEl.dataset.col, 10);
        var data = board[r][c];

        if (flagMode && !data.revealed) {
            toggleFlag(r, c);
        } else if (data.revealed) {
            chord(r, c);
        } else {
            reveal(r, c);
        }
    });

    // ---- Event: Right click (flag) ----
    boardEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var cellEl = e.target.closest('.ms-cell');
        if (!cellEl) return;
        var r = parseInt(cellEl.dataset.row, 10);
        var c = parseInt(cellEl.dataset.col, 10);
        toggleFlag(r, c);
    });

    // ---- Event: Long press for mobile flagging ----
    var longPressTimer = null;
    var longPressTriggered = false;

    boardEl.addEventListener('touchstart', function (e) {
        var cellEl = e.target.closest('.ms-cell');
        if (!cellEl) return;
        longPressTriggered = false;
        var r = parseInt(cellEl.dataset.row, 10);
        var c = parseInt(cellEl.dataset.col, 10);
        longPressTimer = setTimeout(function () {
            longPressTriggered = true;
            toggleFlag(r, c);
        }, 500);
    }, { passive: true });

    boardEl.addEventListener('touchend', function () {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });

    boardEl.addEventListener('touchmove', function () {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });

    // Prevent click after long press
    boardEl.addEventListener('click', function (e) {
        if (longPressTriggered) {
            e.stopImmediatePropagation();
            longPressTriggered = false;
        }
    }, true);

    // ---- Event: Difficulty buttons ----
    diffBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            diffBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
            init();
        });
    });

    // ---- Event: Reset ----
    resetBtn.addEventListener('click', function () {
        init();
    });

    // ---- Event: Flag mode toggle ----
    flagToggle.addEventListener('click', function () {
        flagMode = !flagMode;
        flagToggle.classList.toggle('active', flagMode);
    });

    // ---- Event: Help modal ----
    helpBtn.addEventListener('click', function () {
        helpModal.classList.add('show');
    });
    helpClose.addEventListener('click', function () {
        helpModal.classList.remove('show');
    });
    helpModal.addEventListener('click', function (e) {
        if (e.target === helpModal) helpModal.classList.remove('show');
    });

    // ---- Event: Result modal ----
    resultClose.addEventListener('click', function () {
        resultModal.classList.remove('show');
    });
    resultModal.addEventListener('click', function (e) {
        if (e.target === resultModal) resultModal.classList.remove('show');
    });
    resultRetry.addEventListener('click', function () {
        resultModal.classList.remove('show');
        init();
    });

    // ---- Nav & footer ----
    document.getElementById('year').textContent = new Date().getFullYear();

    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ---- Start ----
    init();
})();
