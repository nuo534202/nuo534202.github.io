(function() {
    'use strict';

    const generator = new SudokuGenerator();
    const game = new SudokuGame(generator);
    const storage = new GameStorage();

    let currentLevel = 1;
    let currentPuzzleIndex = 0;
    let autoSaveInterval = null;
    let isTimerRunning = false;
    let isInitialized = false;

    const routes = {
        welcome: 'welcome',
        levelSelect: 'level-select',
        game: 'game',
        victory: 'victory'
    };

    let currentRoute = routes.welcome;

    function init() {
        try {
            console.log('Initializing Sudoku Quest...');
            
            setupEventListeners();
            setupAutoSave();
            navigateTo(routes.welcome);
            
            isInitialized = true;
            console.log('Initialization complete');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    function navigateTo(route, params = {}) {
        try {
            if (currentRoute === routes.game && route !== routes.game) {
                saveCurrentState();
            }
            
            currentRoute = route;
            hideAllViews();
            
            switch (route) {
                case routes.welcome:
                    showWelcome();
                    break;
                case routes.levelSelect:
                    showLevelSelect();
                    break;
                case routes.game:
                    currentLevel = params.level || 1;
                    currentPuzzleIndex = params.puzzleIndex || 0;
                    startGame(currentLevel, currentPuzzleIndex);
                    break;
                case routes.victory:
                    showVictory(params);
                    break;
            }
            
            window.location.hash = route;
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    function hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    function showWelcome() {
        try {
            const stats = storage.getTotalStats();
            const levelsEl = document.getElementById('stat-levels');
            const puzzlesEl = document.getElementById('stat-puzzles');
            
            if (levelsEl) levelsEl.textContent = stats.completedLevels;
            if (puzzlesEl) puzzlesEl.textContent = stats.totalPuzzles;
            
            const welcomeView = document.getElementById('welcome-view');
            if (welcomeView) {
                welcomeView.classList.add('active');
                console.log('Welcome view activated');
            } else {
                console.error('Welcome view not found');
            }
        } catch (error) {
            console.error('showWelcome error:', error);
        }
    }

    function showLevelSelect() {
        try {
            renderLevelCards();
            const levelSelectView = document.getElementById('level-select-view');
            if (levelSelectView) {
                levelSelectView.classList.add('active');
            }
        } catch (error) {
            console.error('showLevelSelect error:', error);
        }
    }

    function startGame(level, puzzleIndex) {
        try {
            if (isTimerRunning) {
                game.stopTimer();
                isTimerRunning = false;
            }
            
            const savedState = storage.loadPuzzleState(level, puzzleIndex);
            
            if (savedState && savedState.grid && savedState.grid.length === 9) {
                const config = game.getLevelConfig(level);
                const result = generator.generate(config.difficulty);
                
                game.currentPuzzle = result.puzzle;
                game.currentSolution = result.solution;
                game.playerGrid = JSON.parse(JSON.stringify(savedState.grid));
                game.notes = savedState.notes && savedState.notes.length === 9 
                    ? JSON.parse(JSON.stringify(savedState.notes)) 
                    : Array(9).fill(null).map(() => Array(9).fill(null).map(() => []));
                game.errors = savedState.errors || 0;
                game.startTime = Date.now() - ((savedState.time || 0) * 1000);
                game.isNoteMode = false;
                game.selectedCell = null;
            } else {
                const initialized = game.initGame(level, puzzleIndex);
                if (!initialized) {
                    console.error('Failed to initialize game');
                    return;
                }
            }
            
            renderBoard();
            updateInfoPanel();
            
            const gameView = document.getElementById('game-view');
            if (gameView) {
                gameView.classList.add('active');
            }
            
            game.startTimer(updateTimer);
            isTimerRunning = true;
        } catch (error) {
            console.error('startGame error:', error);
        }
    }

    function renderBoard() {
        const board = document.getElementById('sudoku-board');
        board.innerHTML = '';
        
        if (!game.currentPuzzle || !game.playerGrid) {
            console.error('Game not properly initialized');
            return;
        }
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const state = game.getCellState(row, col);
                
                if (state.isFixed) {
                    cell.classList.add('fixed');
                    cell.textContent = state.puzzleValue;
                } else if (state.playerValue !== 0) {
                    cell.textContent = state.playerValue;
                    if (state.hasConflict) {
                        cell.classList.add('error');
                    }
                } else if (state.cellNotes && state.cellNotes.length > 0) {
                    renderNotes(cell, state.cellNotes);
                }
                
                if (state.isSelected) cell.classList.add('selected');
                if (state.isRelated) cell.classList.add('related');
                if (state.isSameNumber) cell.classList.add('same-number');
                
                cell.addEventListener('click', () => selectCell(row, col));
                
                board.appendChild(cell);
            }
        }
        
        updateNoteModeButton();
    }

    function renderNotes(cell, notes) {
        cell.classList.add('has-notes');
        cell.innerHTML = '';
        
        const noteGrid = document.createElement('div');
        noteGrid.className = 'note-cell';
        
        for (let i = 1; i <= 9; i++) {
            const noteSpan = document.createElement('span');
            if (notes.includes(i)) {
                noteSpan.textContent = i;
            }
            noteGrid.appendChild(noteSpan);
        }
        
        cell.appendChild(noteGrid);
    }

    function selectCell(row, col) {
        game.selectCell(row, col);
        renderBoard();
    }

    function inputNumber(num) {
        game.inputNumber(num);
        renderBoard();
        saveCurrentState();
        
        if (game.checkComplete()) {
            handlePuzzleComplete();
        }
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const timerEl = document.getElementById('timer-display');
        if (timerEl) timerEl.textContent = timeStr;
    }

    function updateInfoPanel() {
        const config = game.getLevelConfig(currentLevel);
        
        const levelNameEl = document.getElementById('level-name');
        const puzzleIndexEl = document.getElementById('puzzle-index');
        const errorCountEl = document.getElementById('error-count');
        const difficultyStarsEl = document.getElementById('difficulty-stars');
        
        if (levelNameEl) levelNameEl.textContent = `第${currentLevel}关 - ${config.name}`;
        if (puzzleIndexEl) puzzleIndexEl.textContent = `${currentPuzzleIndex + 1}/${config.puzzles}`;
        if (errorCountEl) errorCountEl.textContent = game.errors;
        
        if (difficultyStarsEl) {
            const difficultyStars = '★'.repeat(getDifficultyStars(config.difficulty)) + 
                                    '☆'.repeat(3 - getDifficultyStars(config.difficulty));
            difficultyStarsEl.textContent = difficultyStars;
        }
    }

    function getDifficultyStars(difficulty) {
        switch (difficulty) {
            case 'easy': return 1;
            case 'medium': return 2;
            case 'hard': return 3;
            default: return 1;
        }
    }

    function updateNoteModeButton() {
        const btn = document.getElementById('note-mode-btn');
        if (btn) {
            if (game.isNoteMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    }

    function toggleNoteMode() {
        game.toggleNoteMode();
        updateNoteModeButton();
    }

    function clearCell() {
        inputNumber(0);
    }

    function handlePuzzleComplete() {
        game.stopTimer();
        isTimerRunning = false;
        
        const time = game.getElapsedTime();
        storage.saveBestTime(currentLevel, currentPuzzleIndex, time);
        
        const config = game.getLevelConfig(currentLevel);
        
        if (currentPuzzleIndex < config.puzzles - 1) {
            showPuzzleCompleteModal(time);
        } else {
            storage.saveLevelProgress(currentLevel, true);
            
            if (currentLevel < 5) {
                storage.saveLevelProgress(currentLevel + 1, false);
            }
            
            navigateTo(routes.victory, { 
                level: currentLevel,
                levelName: config.name,
                time: time
            });
        }
    }

    function showPuzzleCompleteModal(time) {
        const modal = document.getElementById('complete-modal');
        const timeDisplay = document.getElementById('modal-time');
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        if (timeDisplay) timeDisplay.textContent = `${minutes}:${String(secs).padStart(2, '0')}`;
        
        if (modal) modal.classList.add('active');
        
        const nextBtn = document.getElementById('next-puzzle-btn');
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (modal) modal.classList.remove('active');
                storage.clearPuzzleState(currentLevel, currentPuzzleIndex);
                currentPuzzleIndex++;
                navigateTo(routes.game, { 
                    level: currentLevel, 
                    puzzleIndex: currentPuzzleIndex 
                });
            };
        }
        
        const backBtn = document.getElementById('back-to-levels-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                if (modal) modal.classList.remove('active');
                navigateTo(routes.levelSelect);
            };
        }
    }

    function showVictory(params) {
        const victoryView = document.getElementById('victory-view');
        if (victoryView) victoryView.classList.add('active');
        
        const levelEl = document.getElementById('victory-level');
        if (levelEl) levelEl.textContent = params.levelName;
        
        const minutes = Math.floor(params.time / 60);
        const secs = params.time % 60;
        const timeEl = document.getElementById('victory-time');
        if (timeEl) timeEl.textContent = `${minutes}:${String(secs).padStart(2, '0')}`;
        
        const stats = storage.getTotalStats();
        const totalLevelsEl = document.getElementById('total-levels');
        const totalPuzzlesEl = document.getElementById('total-puzzles');
        if (totalLevelsEl) totalLevelsEl.textContent = stats.completedLevels;
        if (totalPuzzlesEl) totalPuzzlesEl.textContent = stats.totalPuzzles;
        
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            if (params.level >= 5) {
                continueBtn.textContent = '返回关卡';
                continueBtn.onclick = () => {
                    navigateTo(routes.levelSelect);
                };
            } else {
                continueBtn.textContent = '下一关';
                continueBtn.onclick = () => {
                    currentLevel = params.level + 1;
                    currentPuzzleIndex = 0;
                    navigateTo(routes.game, { level: currentLevel, puzzleIndex: 0 });
                };
            }
        }
        
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.onclick = () => {
                navigateTo(routes.welcome);
            };
        }
    }

    function renderLevelCards() {
        const container = document.getElementById('level-cards');
        container.innerHTML = '';
        
        const levels = game.getAllLevels();
        const completedLevels = storage.getCompletedLevels();
        
        for (let i = 1; i <= 5; i++) {
            const config = levels[i];
            const isUnlocked = storage.isLevelUnlocked(i);
            const isCompleted = completedLevels.includes(i);
            
            const card = document.createElement('div');
            card.className = 'level-card';
            card.setAttribute('tabindex', isUnlocked ? '0' : '-1');
            if (!isUnlocked) card.classList.add('locked');
            if (isCompleted) card.classList.add('completed');
            
            let stars = '';
            const difficultyStars = getDifficultyStars(config.difficulty);
            for (let s = 0; s < 3; s++) {
                stars += s < difficultyStars ? '★' : '☆';
            }
            
            card.innerHTML = `
                <div class="level-number">${i}</div>
                <div class="level-name">${config.name}</div>
                <div class="level-stars">${stars}</div>
                <div class="level-puzzles">${config.puzzles}题</div>
                ${!isUnlocked ? '<div class="lock-icon">🔒</div>' : ''}
                ${isCompleted ? '<div class="check-icon">✓</div>' : ''}
            `;
            
            if (isUnlocked) {
                card.addEventListener('click', () => {
                    showPuzzleSelect(i, config);
                });
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        showPuzzleSelect(i, config);
                    }
                });
            }
            
            container.appendChild(card);
        }
    }

    function showPuzzleSelect(level, config) {
        const modal = document.getElementById('puzzle-select-modal');
        const title = document.getElementById('puzzle-select-title');
        if (title) title.textContent = `第${level}关 - ${config.name}`;
        
        const grid = document.getElementById('puzzle-grid');
        grid.innerHTML = '';
        
        for (let i = 0; i < config.puzzles; i++) {
            const btn = document.createElement('div');
            btn.className = 'puzzle-btn';
            btn.setAttribute('tabindex', '0');
            
            const bestTime = storage.getBestTime(level, i);
            if (bestTime) {
                const mins = Math.floor(bestTime / 60);
                const secs = bestTime % 60;
                btn.innerHTML = `<span>${i + 1}</span><small>${mins}:${String(secs).padStart(2, '0')}</small>`;
            } else {
                btn.textContent = i + 1;
            }
            
            btn.addEventListener('click', () => {
                if (modal) modal.classList.remove('active');
                navigateTo(routes.game, { level, puzzleIndex: i });
            });
            
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (modal) modal.classList.remove('active');
                    navigateTo(routes.game, { level, puzzleIndex: i });
                }
            });
            
            grid.appendChild(btn);
        }
        
        if (modal) modal.classList.add('active');
        
        const closeBtn = document.getElementById('close-puzzle-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                if (modal) modal.classList.remove('active');
            };
        }
        
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            };
        }
    }

    function resetPuzzle() {
        if (confirm('确定要重置当前题目吗？')) {
            game.resetCurrentPuzzle();
            storage.clearPuzzleState(currentLevel, currentPuzzleIndex);
            renderBoard();
            updateInfoPanel();
        }
    }

    function setupAutoSave() {
        autoSaveInterval = setInterval(() => {
            if (currentRoute === routes.game && game.playerGrid) {
                saveCurrentState();
            }
        }, 30000);
    }

    function saveCurrentState() {
        if (!game.playerGrid || !game.currentPuzzle) return;
        
        try {
            const state = {
                grid: JSON.parse(JSON.stringify(game.playerGrid)),
                notes: JSON.parse(JSON.stringify(game.notes)),
                time: game.getElapsedTime(),
                errors: game.errors
            };
            storage.savePuzzleState(currentLevel, currentPuzzleIndex, state);
        } catch (e) {
            console.error('Error saving state:', e);
        }
    }

    function showHelpModal() {
        console.log('Showing help modal');
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.add('active');
        } else {
            console.error('Help modal not found');
        }
    }

    function hideHelpModal() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.remove('active');
        }
    }

    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            console.log('Start button found');
            startBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start button clicked');
                navigateTo(routes.levelSelect);
            });
        } else {
            console.error('Start button not found');
        }

        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            console.log('Help button found');
            helpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Help button clicked');
                showHelpModal();
            });
        } else {
            console.error('Help button not found');
        }

        const closeHelpBtn = document.getElementById('close-help-btn');
        if (closeHelpBtn) {
            closeHelpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                hideHelpModal();
            });
        }

        const levelsBtn = document.getElementById('levels-btn');
        if (levelsBtn) {
            levelsBtn.addEventListener('click', () => {
                navigateTo(routes.levelSelect);
            });
        }

        const backToWelcome = document.getElementById('back-to-welcome');
        if (backToWelcome) {
            backToWelcome.addEventListener('click', () => {
                navigateTo(routes.welcome);
            });
        }

        const backToLevels = document.getElementById('back-to-levels');
        if (backToLevels) {
            backToLevels.addEventListener('click', () => {
                navigateTo(routes.levelSelect);
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetPuzzle);
        }

        const noteModeBtn = document.getElementById('note-mode-btn');
        if (noteModeBtn) {
            noteModeBtn.addEventListener('click', toggleNoteMode);
        }

        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = parseInt(e.target.dataset.num);
                inputNumber(num);
            });
        });

        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCell);
        }

        document.addEventListener('keydown', (e) => {
            if (currentRoute !== routes.game) return;
            
            if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                inputNumber(parseInt(e.key));
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                clearCell();
            } else if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                toggleNoteMode();
            } else if (e.key >= 'ArrowUp' && e.key <= 'ArrowRight') {
                e.preventDefault();
                handleArrowKey(e.key);
            }
        });

        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target.id === 'help-modal') {
                    hideHelpModal();
                }
            });
        }

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && hash !== currentRoute) {
                currentRoute = hash;
            }
        });

        window.addEventListener('beforeunload', () => {
            if (currentRoute === routes.game) {
                saveCurrentState();
            }
        });
        
        console.log('Event listeners setup complete');
    }

    function handleArrowKey(key) {
        if (!game.selectedCell) {
            selectCell(4, 4);
            return;
        }
        
        let { row, col } = game.selectedCell;
        
        switch (key) {
            case 'ArrowUp': row = Math.max(0, row - 1); break;
            case 'ArrowDown': row = Math.min(8, row + 1); break;
            case 'ArrowLeft': col = Math.max(0, col - 1); break;
            case 'ArrowRight': col = Math.min(8, col + 1); break;
        }
        
        selectCell(row, col);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
