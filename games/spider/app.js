(function () {
    'use strict';

    /* ============================================
       Constants
       ============================================ */
    var SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
    var RANK_LABELS = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    var COLS = 10;
    var FOUNDATION_SIZE = 13; // K..A
    var TOTAL_FOUNDATIONS = 8;

    // Difficulty → which suits appear in the 104-card deck.
    // 1 suit  = 8 sets of 13 spades  (8 × 13 = 104)
    // 2 suits = 4 sets spades + 4 sets hearts  (8 × 13 = 104)
    // 4 suits = 2 sets of each suit   (8 × 13 = 104)
    var DIFFICULTY = {
        1: ['s', 's', 's', 's', 's', 's', 's', 's'],
        2: ['s', 's', 's', 's', 'h', 'h', 'h', 'h'],
        4: ['s', 's', 'h', 'h', 'd', 'd', 'c', 'c']
    };

    /* ============================================
       State
       ============================================ */
    var state = {
        numSuits: 1,
        tableaux: [],       // 10 columns; last index = top of column
        stockDeals: [],     // array of (sub-deal arrays of length 10), top to bottom
        foundations: [],    // array of { suit } for each completed K-A run
        moves: 0,
        timer: 0,
        timerInterval: null,
        started: false,
        history: [],        // snapshots for undo
        selected: null,     // { col, idx } | null
        won: false
    };

    /* ============================================
       DOM
       ============================================ */
    var tableauEl = document.getElementById('sp-tableau');
    var foundationsEl = document.getElementById('sp-foundations-row');
    var stockBtn = document.getElementById('sp-stock');
    var stockCountEl = document.getElementById('sp-stock-count');
    var stockBadgeEl = document.getElementById('sp-stock-badge');
    var timerEl = document.getElementById('sp-timer');
    var movesEl = document.getElementById('sp-moves');
    var foundationsCountEl = document.getElementById('sp-foundations');
    var undoBtn = document.getElementById('sp-undo');
    var newGameBtn = document.getElementById('sp-new-game');
    var helpBtn = document.getElementById('sp-help-btn');
    var helpModal = document.getElementById('sp-help-modal');
    var helpClose = document.getElementById('sp-help-close');
    var resultModal = document.getElementById('sp-result-modal');
    var resultClose = document.getElementById('sp-result-close');
    var resultTitle = document.getElementById('sp-result-title');
    var resultText = document.getElementById('sp-result-text');
    var resultIcon = document.getElementById('sp-result-icon');
    var resultRetry = document.getElementById('sp-result-retry');
    var toastEl = document.getElementById('sp-toast');
    var diffBtns = document.querySelectorAll('.sp-diff-btn');

    /* ============================================
       Card helpers
       ============================================ */
    function rankLabel(r) {
        return RANK_LABELS[r] || String(r);
    }

    function makeCard(suit, rank) {
        return { suit: suit, rank: rank, faceUp: false };
    }

    /* ============================================
       Deck build + shuffle
       ============================================ */
    function buildDeck(numSuits) {
        var sets = DIFFICULTY[numSuits];
        var deck = [];
        for (var i = 0; i < sets.length; i++) {
            for (var r = 1; r <= 13; r++) {
                deck.push(makeCard(sets[i], r));
            }
        }
        return deck;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    /* ============================================
       New game / deal
       ============================================ */
    function newGame() {
        var deck = shuffle(buildDeck(state.numSuits));
        var tableaux = [];
        for (var c = 0; c < COLS; c++) {
            tableaux.push([]);
        }
        // First 4 columns get 6 cards, last 6 get 5 → 4*6 + 6*5 = 54
        var cardIdx = 0;
        // Deal row by row so column tops come up naturally.
        // Rows: 6 rows total (max column height). Last 6 cols skip the 6th row.
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < COLS; col++) {
                if (row === 5 && col >= 4) continue; // cols 4..9 only get 5
                tableaux[col].push(deck[cardIdx++]);
            }
        }
        // Flip the top card of each column face-up
        for (var k = 0; k < COLS; k++) {
            var top = tableaux[k][tableaux[k].length - 1];
            if (top) top.faceUp = true;
        }

        // Remaining 50 cards = 5 stock deals of 10 cards each
        var stockDeals = [];
        for (var d = 0; d < 5; d++) {
            stockDeals.push(deck.slice(cardIdx, cardIdx + 10));
            cardIdx += 10;
        }

        state.tableaux = tableaux;
        state.stockDeals = stockDeals;
        state.foundations = [];
        state.moves = 0;
        state.started = false;
        state.won = false;
        state.selected = null;
        state.history = [];
        state.timer = 0;
        stopTimer();

        renderAll();
    }

    /* ============================================
       Move validation
       ============================================ */

    // Returns true if cards from idx to end of column form a valid
    // descending same-suit run (all face-up).
    function isValidRun(col, idx) {
        var stack = state.tableaux[col];
        if (idx < 0 || idx >= stack.length) return false;
        for (var i = idx; i < stack.length; i++) {
            if (!stack[i].faceUp) return false;
            if (i > idx) {
                var prev = stack[i - 1];
                var cur = stack[i];
                if (prev.suit !== cur.suit) return false;
                if (prev.rank !== cur.rank + 1) return false;
            }
        }
        return true;
    }

    // Can the group (cards at srcCol, srcIdx..end) move onto dstCol?
    function canMoveTo(srcCol, srcIdx, dstCol) {
        if (srcCol === dstCol) return false;
        if (!isValidRun(srcCol, srcIdx)) return false;
        var dst = state.tableaux[dstCol];
        if (dst.length === 0) return true; // empty col accepts any
        var dstTop = dst[dst.length - 1];
        if (!dstTop.faceUp) return false;
        var srcTop = state.tableaux[srcCol][srcIdx];
        return dstTop.rank === srcTop.rank + 1;
    }

    /* ============================================
       Move execution
       ============================================ */
    function snapshot() {
        return JSON.parse(JSON.stringify({
            tableaux: state.tableaux,
            stockDeals: state.stockDeals,
            foundations: state.foundations,
            moves: state.moves
        }));
    }

    function pushHistory() {
        state.history.push(snapshot());
        // Cap history to last 100 moves to bound memory
        if (state.history.length > 100) state.history.shift();
    }

    function undo() {
        if (state.won) return;
        if (state.history.length === 0) {
            showToast('没有可撤销的操作');
            return;
        }
        var prev = state.history.pop();
        state.tableaux = prev.tableaux;
        state.stockDeals = prev.stockDeals;
        state.foundations = prev.foundations;
        state.moves = prev.moves;
        state.selected = null;
        renderAll();
    }

    function applyMove(srcCol, srcIdx, dstCol) {
        if (!canMoveTo(srcCol, srcIdx, dstCol)) return false;
        pushHistory();
        var src = state.tableaux[srcCol];
        var dst = state.tableaux[dstCol];
        var moving = src.splice(srcIdx);
        for (var i = 0; i < moving.length; i++) dst.push(moving[i]);
        // Flip newly exposed card
        if (src.length > 0 && !src[src.length - 1].faceUp) {
            src[src.length - 1].faceUp = true;
        }
        state.moves++;
        startTimer();
        // Mark just-placed for animation: handled via re-render + class
        state.selected = null;
        // Auto-collect any K-A runs
        var collected = autoCollect();
        renderAll(collected);
        checkWin();
        return true;
    }

    /* ============================================
       Auto-collect: scan columns for K..A same-suit runs at the tail.
       Returns array of { col, foundationIndex } for animation.
       ============================================ */
    function autoCollect() {
        var collected = [];
        for (var c = 0; c < COLS; c++) {
            var stack = state.tableaux[c];
            if (stack.length < FOUNDATION_SIZE) continue;
            var start = stack.length - FOUNDATION_SIZE;
            var suit = stack[start].suit;
            // Verify K..A descending same-suit, all face-up
            var ok = stack[start].rank === 13 && stack[start].faceUp;
            for (var i = 0; ok && i < FOUNDATION_SIZE; i++) {
                var card = stack[start + i];
                if (!card.faceUp || card.suit !== suit || card.rank !== 13 - i) {
                    ok = false;
                }
            }
            if (ok) {
                stack.splice(start, FOUNDATION_SIZE);
                var fIdx = state.foundations.length;
                state.foundations.push({ suit: suit });
                collected.push({ col: c, foundationIndex: fIdx });
                // Flip newly exposed card if any
                if (stack.length > 0 && !stack[stack.length - 1].faceUp) {
                    stack[stack.length - 1].faceUp = true;
                }
                // Re-scan this column in case another run is exposed
                c--;
            }
        }
        return collected;
    }

    /* ============================================
       Stock deal
       ============================================ */
    function dealStock() {
        if (state.won) return;
        if (state.stockDeals.length === 0) {
            showToast('已无牌可发');
            return;
        }
        // Rule: cannot deal if any column is empty
        for (var c = 0; c < COLS; c++) {
            if (state.tableaux[c].length === 0) {
                showToast('有空列时不能发牌，请先填满所有列');
                return;
            }
        }
        pushHistory();
        var deal = state.stockDeals.shift();
        for (var i = 0; i < COLS; i++) {
            var card = deal[i];
            card.faceUp = true;
            state.tableaux[i].push(card);
        }
        state.moves++;
        startTimer();
        state.selected = null;
        var collected = autoCollect();
        renderAll(collected);
        checkWin();
    }

    /* ============================================
       Win check
       ============================================ */
    function checkWin() {
        if (state.foundations.length >= TOTAL_FOUNDATIONS) {
            state.won = true;
            stopTimer();
            setTimeout(showWin, 350);
        }
    }

    function showWin() {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = '恭喜过关！';
        resultText.textContent = '用时 ' + state.timer + ' 秒 · 步数 ' + state.moves;
        resultModal.classList.add('show');
    }

    /* ============================================
       Timer
       ============================================ */
    function startTimer() {
        if (state.started) return;
        state.started = true;
        state.timerInterval = setInterval(function () {
            state.timer++;
            if (state.timer > 999) state.timer = 999;
            timerEl.textContent = pad3(state.timer);
        }, 1000);
    }

    function stopTimer() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        state.started = false;
    }

    /* ============================================
       Rendering
       ============================================ */
    function pad3(n) {
        var s = String(Math.abs(n));
        while (s.length < 3) s = '0' + s;
        return s;
    }

    function renderAll(collected) {
        renderStatus();
        renderFoundations(collected);
        renderStock();
        renderTableau(collected);
    }

    function renderStatus() {
        timerEl.textContent = pad3(state.timer);
        movesEl.textContent = pad3(state.moves);
        foundationsCountEl.textContent = String(state.foundations.length);
        undoBtn.disabled = state.history.length === 0 || state.won;
    }

    function renderFoundations(collected) {
        foundationsEl.innerHTML = '';
        for (var i = 0; i < TOTAL_FOUNDATIONS; i++) {
            var slot = document.createElement('div');
            slot.className = 'sp-foundation';
            if (i < state.foundations.length) {
                slot.classList.add('filled');
                var f = state.foundations[i];
                slot.dataset.suit = f.suit;
                slot.classList.add('suit-' + f.suit);
                slot.innerHTML =
                    '<span class="sp-foundation-band"></span>' +
                    '<span class="sp-foundation-suit">' + SUIT_SYMBOLS[f.suit] + '</span>' +
                    '<span class="sp-foundation-rank">K</span>';
            } else {
                slot.textContent = (i + 1);
            }
            foundationsEl.appendChild(slot);
            // Trigger completion animation
            if (collected && collected.length) {
                for (var k = 0; k < collected.length; k++) {
                    if (collected[k].foundationIndex === i) {
                        slot.classList.add('completing');
                    }
                }
            }
        }
    }

    function renderStock() {
        var count = state.stockDeals.length;
        stockCountEl.textContent = String(count);
        stockBtn.disabled = count === 0 || state.won;

        if (stockBadgeEl) {
            stockBadgeEl.classList.toggle('low', count > 0 && count <= 5);
            stockBadgeEl.classList.toggle('empty', count === 0);
            if (count === 0) {
                stockBadgeEl.setAttribute('title', '牌堆已空');
            } else {
                stockBadgeEl.setAttribute('title', String(count) + ' 次发牌剩余');
                stockCountEl.textContent = String(count);
            }
        }
    }

    function renderTableau(collected) {
        tableauEl.innerHTML = '';
        // Build a set of (col, idx) just placed for animation
        var justPlaced = {};
        if (collected && collected.length) {
            // After collection, the "new top" of the affected column animates.
            // Simpler: animate the top card of each affected col.
            for (var i = 0; i < collected.length; i++) {
                justPlaced[collected[i].col] = -1; // marker; we'll light top card
            }
        }
        for (var c = 0; c < COLS; c++) {
            var colEl = document.createElement('div');
            colEl.className = 'sp-col';
            colEl.dataset.col = c;
            var stack = state.tableaux[c];
            if (stack.length === 0) {
                colEl.classList.add('empty');
            }
            for (var i = 0; i < stack.length; i++) {
                var card = stack[i];
                var cardEl = document.createElement('div');
                cardEl.className = 'sp-card';
                cardEl.dataset.col = c;
                cardEl.dataset.idx = i;
                if (card.faceUp) {
                    cardEl.classList.add('face-up', 'suit-' + card.suit);
                    cardEl.dataset.rankLabel = rankLabel(card.rank);
                    cardEl.innerHTML =
                        '<span class="sp-card-rank">' + rankLabel(card.rank) + '</span>' +
                        '<span class="sp-card-suit">' + SUIT_SYMBOLS[card.suit] + '</span>';
                    // Mark movable if it heads a valid run
                    if (isValidRun(c, i)) {
                        cardEl.classList.add('movable');
                    }
                } else {
                    cardEl.classList.add('face-down');
                }
                // Selected state
                if (state.selected && state.selected.col === c && i >= state.selected.idx) {
                    cardEl.classList.add('selected');
                }
                // Just-placed (top card of collected columns)
                if (justPlaced[c] === -1 && i === stack.length - 1 && card.faceUp) {
                    cardEl.classList.add('placed');
                }
                colEl.appendChild(cardEl);
            }
            tableauEl.appendChild(colEl);
        }
    }

    /* ============================================
       Selection + click handling
       ============================================ */
    function onTableauClick(e) {
        if (state.won) return;
        var cardEl = e.target.closest('.sp-card');
        var colEl = e.target.closest('.sp-col');
        if (!colEl) return;
        var col = parseInt(colEl.dataset.col, 10);

        if (cardEl) {
            var idx = parseInt(cardEl.dataset.idx, 10);
            var card = state.tableaux[col][idx];

            // Click on face-down card: ignore (can't select)
            if (!card.faceUp) return;

            // If something is already selected
            if (state.selected) {
                // Same selection → deselect
                if (state.selected.col === col && state.selected.idx === idx) {
                    state.selected = null;
                    renderTableau();
                    return;
                }
                // Click on a card in another column → attempt move onto that column
                if (state.selected.col !== col) {
                    var moved = applyMove(state.selected.col, state.selected.idx, col);
                    if (!moved) {
                        // Move invalid: try to re-select this card if it's movable
                        if (isValidRun(col, idx)) {
                            state.selected = { col: col, idx: idx };
                            renderTableau();
                        } else {
                            showToast('不能移动到此位置');
                        }
                    }
                    return;
                }
                // Same column, different idx: reselect if movable
                if (isValidRun(col, idx)) {
                    state.selected = { col: col, idx: idx };
                    renderTableau();
                }
                return;
            }

            // Nothing selected: try to select this card if it heads a valid run
            if (isValidRun(col, idx)) {
                state.selected = { col: col, idx: idx };
                renderTableau();
            } else if (card.faceUp) {
                showToast('该牌组不是同花色降序连续，无法整体移动');
            }
            return;
        }

        // Click on empty column area (drop target) when a selection exists
        if (state.selected && state.tableaux[col].length === 0) {
            var movedEmpty = applyMove(state.selected.col, state.selected.idx, col);
            if (!movedEmpty) showToast('不能移动到此位置');
        }
    }

    /* ============================================
       Toast
       ============================================ */
    var toastTimer = null;
    function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 1800);
    }

    /* ============================================
       Event bindings
       ============================================ */
    tableauEl.addEventListener('click', onTableauClick);
    stockBtn.addEventListener('click', dealStock);
    undoBtn.addEventListener('click', undo);
    newGameBtn.addEventListener('click', function () {
        if (state.history.length > 0 && !state.won) {
            if (!window.confirm('开始新游戏？当前进度将丢失。')) return;
        }
        newGame();
    });

    diffBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var suits = parseInt(btn.dataset.suits, 10);
            if (suits === state.numSuits && state.history.length === 0) return;
            if (state.history.length > 0 && !state.won) {
                if (!window.confirm('切换难度将开始新游戏，确定？')) return;
            }
            diffBtns.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            state.numSuits = suits;
            newGame();
        });
    });

    helpBtn.addEventListener('click', function () {
        helpModal.classList.add('show');
    });
    helpClose.addEventListener('click', function () {
        helpModal.classList.remove('show');
    });
    helpModal.addEventListener('click', function (e) {
        if (e.target === helpModal) helpModal.classList.remove('show');
    });
    resultClose.addEventListener('click', function () {
        resultModal.classList.remove('show');
    });
    resultModal.addEventListener('click', function (e) {
        if (e.target === resultModal) resultModal.classList.remove('show');
    });
    resultRetry.addEventListener('click', function () {
        resultModal.classList.remove('show');
        newGame();
    });

    // Keyboard shortcuts: U=undo, N=new game, Esc=deselect / close modals
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        var key = e.key.toLowerCase();
        if (key === 'u') {
            undo();
        } else if (key === 'n') {
            if (state.history.length > 0 && !state.won) {
                if (!window.confirm('开始新游戏？当前进度将丢失。')) return;
            }
            newGame();
        } else if (e.key === 'Escape') {
            if (helpModal.classList.contains('show')) helpModal.classList.remove('show');
            if (resultModal.classList.contains('show')) resultModal.classList.remove('show');
            if (state.selected) {
                state.selected = null;
                renderTableau();
            }
        }
    });

    /* ============================================
       Nav + footer (shared boilerplate)
       ============================================ */
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
            if (window.scrollY > 20) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    /* ============================================
       Start
       ============================================ */
    newGame();
})();
