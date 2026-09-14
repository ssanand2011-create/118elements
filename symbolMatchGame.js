/**
 * ELEMENT 118 — GAME 1: ELEMENT SYMBOL MATCH
 * Interactive fast-paced matching game connecting Element Names to Chemical Symbols with combos and streak counters.
 */

class SymbolMatchGame {
  constructor() {
    this.container = null;
    this.mode = 'core18'; // 'core18' | 'full118'
    this.pairsCount = 6;
    this.timer = 0;
    this.timerId = null;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.attempts = 0;
    this.matchedCount = 0;
    this.selectedName = null;
    this.selectedSymbol = null;
    this.currentPairs = [];
    this.missedElements = [];
    this.isGameActive = false;
  }

  init(containerEl) {
    this.container = containerEl;
    this.renderLobby();
  }

  setMode(mode) {
    this.mode = mode;
    this.renderLobby();
  }

  getPool() {
    if (typeof ELEMENTS_DATA === 'undefined') return [];
    if (this.mode === 'core18') {
      return ELEMENTS_DATA.filter(el => el.atomicNumber <= 18);
    }
    return [...ELEMENTS_DATA];
  }

  startRound() {
    const pool = this.getPool();
    // Shuffle and pick pairsCount elements
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    this.currentPairs = shuffled.slice(0, this.pairsCount);
    this.matchedCount = 0;
    this.attempts = 0;
    this.score = 0;
    this.streak = 0;
    this.timer = 0;
    this.missedElements = [];
    this.selectedName = null;
    this.selectedSymbol = null;
    this.isGameActive = true;

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.timer++;
      const timerEl = document.getElementById('match-timer-display');
      if (timerEl) timerEl.textContent = `${this.timer}s`;
    }, 1000);

    if (window.audioService) window.audioService.playClick();
    this.renderGame();
  }

  renderLobby() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:720px; margin:0 auto; text-align:center;">
        <div class="badge badge-cyan" style="margin-bottom:0.75rem;">Game 1</div>
        <h2 style="font-size:2rem; margin:0 0 0.5rem;">Element Symbol Match</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem; max-width:520px; margin:0 auto 1.5rem;">
          Match chemical element names with their corresponding scientific symbols as quickly and accurately as possible.
        </p>

        <div style="display:flex; justify-content:center; gap:1rem; margin-bottom:2rem; flex-wrap:wrap;">
          <div class="glass-card" style="padding:1rem; min-width:140px;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Game Pool</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--accent-cyan); margin-top:0.25rem;">
              ${this.mode === 'core18' ? '18 Core Elements (H–Ar)' : 'All 118 Elements'}
            </div>
          </div>
          <div class="glass-card" style="padding:1rem; min-width:140px;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Round Size</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--accent-purple); margin-top:0.25rem;">6 Pairs</div>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" onclick="window.symbolMatchGame.startRound()">
          ▶ Play Symbol Match
        </button>
      </div>
    `;
  }

  renderGame() {
    const names = [...this.currentPairs].sort(() => Math.random() - 0.5);
    const symbols = [...this.currentPairs].sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div style="max-width:800px; margin:0 auto;">
        <!-- Status Bar -->
        <div class="game-status-bar">
          <div class="status-metric">
            <span class="metric-label">Timer</span>
            <span class="metric-value" id="match-timer-display" style="color:var(--accent-cyan);">0s</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Score</span>
            <span class="metric-value" id="match-score-display">${this.score}</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Streak</span>
            <span class="metric-value" id="match-streak-display" style="color:var(--accent-amber);">${this.streak}🔥</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Matched</span>
            <span class="metric-value" id="match-progress-display" style="color:var(--accent-emerald);">0 / ${this.pairsCount}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.symbolMatchGame.renderLobby()">✕ Exit</button>
        </div>

        <!-- Matching Board (2 Columns) -->
        <div class="match-board">
          <div class="match-column" id="match-names-col">
            ${names.map(el => `
              <div class="match-card match-name-card" data-z="${el.atomicNumber}">
                ${el.name}
              </div>
            `).join('')}
          </div>

          <div class="match-column" id="match-symbols-col">
            ${symbols.map(el => `
              <div class="match-card match-symbol-card" data-z="${el.atomicNumber}">
                <span class="badge" style="font-size:0.65rem; margin-right:0.3rem;">#${el.atomicNumber}</span>
                <strong style="font-size:1.3rem;">${el.symbol}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.bindGameEvents();
  }

  bindGameEvents() {
    const nameCards = this.container.querySelectorAll('.match-name-card');
    const symbolCards = this.container.querySelectorAll('.match-symbol-card');

    nameCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!this.isGameActive || card.classList.contains('matched')) return;
        if (window.audioService) window.audioService.playClick();

        nameCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedName = parseInt(card.getAttribute('data-z'), 10);
        this.checkMatch();
      });
    });

    symbolCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!this.isGameActive || card.classList.contains('matched')) return;
        if (window.audioService) window.audioService.playClick();

        symbolCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedSymbol = parseInt(card.getAttribute('data-z'), 10);
        this.checkMatch();
      });
    });
  }

  checkMatch() {
    if (!this.selectedName || !this.selectedSymbol) return;

    this.attempts++;
    const isCorrect = this.selectedName === this.selectedSymbol;
    const nameCard = this.container.querySelector(`.match-name-card[data-z="${this.selectedName}"]`);
    const symbolCard = this.container.querySelector(`.match-symbol-card[data-z="${this.selectedSymbol}"]`);

    if (isCorrect) {
      this.matchedCount++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      const points = 100 + (this.streak * 20);
      this.score += points;

      if (window.audioService) window.audioService.playMatch();

      if (nameCard) {
        nameCard.classList.remove('selected');
        nameCard.classList.add('matched');
        nameCard.innerHTML = `✓ ${nameCard.textContent.trim()}`;
      }
      if (symbolCard) {
        symbolCard.classList.remove('selected');
        symbolCard.classList.add('matched');
        symbolCard.innerHTML = `✓ ${symbolCard.textContent.trim()}`;
      }

      this.selectedName = null;
      this.selectedSymbol = null;
      this.updateStats();

      if (this.matchedCount === this.pairsCount) {
        this.finishGame();
      }
    } else {
      this.streak = 0;
      this.missedElements.push(this.selectedName);
      this.missedElements.push(this.selectedSymbol);

      if (window.audioService) window.audioService.playWrong();

      if (nameCard) nameCard.classList.add('wrong');
      if (symbolCard) symbolCard.classList.add('wrong');

      setTimeout(() => {
        if (nameCard) {
          nameCard.classList.remove('wrong', 'selected');
        }
        if (symbolCard) {
          symbolCard.classList.remove('wrong', 'selected');
        }
        this.selectedName = null;
        this.selectedSymbol = null;
        this.updateStats();
      }, 500);
    }
  }

  updateStats() {
    const scoreEl = document.getElementById('match-score-display');
    const streakEl = document.getElementById('match-streak-display');
    const progEl = document.getElementById('match-progress-display');

    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = `${this.streak}🔥`;
    if (progEl) progEl.textContent = `${this.matchedCount} / ${this.pairsCount}`;
  }

  finishGame() {
    this.isGameActive = false;
    if (this.timerId) clearInterval(this.timerId);

    const accuracy = Math.round((this.pairsCount / Math.max(this.attempts, 1)) * 100);

    if (window.storageService) {
      window.storageService.recordGameResult({
        type: 'symbol_match',
        difficulty: this.mode,
        score: this.score,
        timeSec: this.timer,
        accuracy: accuracy,
        completed: true,
        won: true,
        missedElements: Array.from(new Set(this.missedElements))
      });
    }

    if (window.audioService) window.audioService.playFanfare();

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:640px; margin:0 auto; text-align:center;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">🎉</div>
        <div class="badge badge-emerald" style="margin-bottom:0.5rem;">Round Complete!</div>
        <h2 style="font-size:1.8rem; margin:0 0 0.5rem;">Symbol Match Victory</h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">
          You successfully matched all 6 element pairs in <strong>${this.timer} seconds</strong>.
        </p>

        <div class="stats-grid" style="margin-bottom:1.5rem;">
          <div class="stat-card">
            <div class="stat-title">Final Score</div>
            <div class="stat-value" style="color:var(--accent-cyan);">${this.score}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Accuracy</div>
            <div class="stat-value" style="color:var(--accent-emerald);">${accuracy}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Best Streak</div>
            <div class="stat-value" style="color:var(--accent-amber);">${this.bestStreak}🔥</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:0.75rem;">
          <button class="btn btn-primary" onclick="window.symbolMatchGame.startRound()">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="window.gameZone.selectGame('atomic_number')">Next Game (Atomic #) →</button>
        </div>
      </div>
    `;
  }
}

window.symbolMatchGame = new SymbolMatchGame();
