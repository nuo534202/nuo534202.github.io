class GameStorage {
    constructor() {
        this.storageKey = 'sudoku_progress';
    }

    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save game progress:', e);
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load game progress:', e);
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Failed to clear game progress:', e);
            return false;
        }
    }

    saveProgress(gameState) {
        const existing = this.load() || {};
        existing.gameState = gameState;
        return this.save(existing);
    }

    savePuzzleState(level, puzzleIndex, puzzleData) {
        try {
            const existing = this.load() || {};
            if (!existing.puzzleStates) {
                existing.puzzleStates = {};
            }
            
            const key = `${level}-${puzzleIndex}`;
            existing.puzzleStates[key] = {
                grid: puzzleData.grid,
                notes: puzzleData.notes,
                time: puzzleData.time,
                errors: puzzleData.errors,
                timestamp: Date.now()
            };
            
            console.log('Saving puzzle state:', key, puzzleData);
            const result = this.save(existing);
            console.log('Save result:', result);
            return result;
        } catch (e) {
            console.error('Error saving puzzle state:', e);
            return false;
        }
    }

    loadPuzzleState(level, puzzleIndex) {
        try {
            const existing = this.load();
            if (!existing || !existing.puzzleStates) {
                console.log('No puzzle states found in storage');
                return null;
            }
            
            const key = `${level}-${puzzleIndex}`;
            const state = existing.puzzleStates[key];
            
            if (state && state.grid && state.grid.length === 9) {
                console.log('Found puzzle state for:', key, state);
                return state;
            }
            console.log('No puzzle state found for:', key);
            return null;
        } catch (e) {
            console.error('Error loading puzzle state:', e);
            return null;
        }
    }

    clearPuzzleState(level, puzzleIndex) {
        try {
            const existing = this.load();
            if (!existing || !existing.puzzleStates) return;
            
            const key = `${level}-${puzzleIndex}`;
            delete existing.puzzleStates[key];
            this.save(existing);
        } catch (e) {
            console.error('Error clearing puzzle state:', e);
        }
    }

    saveBestTime(level, puzzleIndex, time) {
        try {
            const existing = this.load() || {};
            if (!existing.bestTimes) {
                existing.bestTimes = {};
            }
            
            const key = `${level}-${puzzleIndex}`;
            if (!existing.bestTimes[key] || time < existing.bestTimes[key]) {
                existing.bestTimes[key] = time;
                return this.save(existing);
            }
            return false;
        } catch (e) {
            console.error('Error saving best time:', e);
            return false;
        }
    }

    getBestTime(level, puzzleIndex) {
        try {
            const existing = this.load();
            if (!existing || !existing.bestTimes) return null;
            
            const key = `${level}-${puzzleIndex}`;
            return existing.bestTimes[key] || null;
        } catch (e) {
            console.error('Error getting best time:', e);
            return null;
        }
    }

    saveLevelProgress(level, completed) {
        try {
            const existing = this.load() || {};
            if (!existing.completedLevels) {
                existing.completedLevels = [];
            }
            
            if (completed && !existing.completedLevels.includes(level)) {
                existing.completedLevels.push(level);
                existing.completedLevels.sort((a, b) => a - b);
            }
            
            existing.currentLevel = level;
            return this.save(existing);
        } catch (e) {
            console.error('Error saving level progress:', e);
            return false;
        }
    }

    getCompletedLevels() {
        try {
            const existing = this.load();
            return existing?.completedLevels || [];
        } catch (e) {
            console.error('Error getting completed levels:', e);
            return [];
        }
    }

    getCurrentLevel() {
        try {
            const existing = this.load();
            return existing?.currentLevel || 1;
        } catch (e) {
            console.error('Error getting current level:', e);
            return 1;
        }
    }

    isLevelUnlocked(level) {
        const completed = this.getCompletedLevels();
        if (level === 1) return true;
        return completed.includes(level - 1);
    }

    isPuzzleCompleted(level, puzzleIndex) {
        const completed = this.getCompletedLevels();
        if (!completed.includes(level)) return false;
        
        const existing = this.load();
        if (!existing || !existing.puzzleStates) return false;
        
        const key = `${level}-${puzzleIndex}`;
        return !!existing.puzzleStates[key];
    }

    getTotalStats() {
        try {
            const existing = this.load();
            const completed = existing?.completedLevels || [];
            
            let totalTime = 0;
            let puzzlesCompleted = 0;
            
            if (existing?.bestTimes) {
                Object.values(existing.bestTimes).forEach(time => {
                    totalTime += time || 0;
                    puzzlesCompleted++;
                });
            }
            
            return {
                completedLevels: completed.length,
                totalPuzzles: puzzlesCompleted,
                totalTime
            };
        } catch (e) {
            console.error('Error getting total stats:', e);
            return { completedLevels: 0, totalPuzzles: 0, totalTime: 0 };
        }
    }
}

if (typeof window !== 'undefined') {
    window.GameStorage = GameStorage;
}
