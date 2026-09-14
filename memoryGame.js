/**
 * ELEMENT 118 — GAME 3: CARD FLIP MEMORY GAME
 * Card-based memory trainer matching element symbols to names with 6, 12, 18, and 36-card grid modes.
 */

class MemoryGame {
  constructor() {
    this.container = null;
    this.difficulty = 'medium'; // 'easy' (6) | 'medium' (12) | 'hard' (18) | 'expert' (36)
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 6;
    this.moves = 0;
    this.timer = 0;
    this.timerId = null;
    this.isLocked = false;
  }

  init(containerEl) {
    this.container = containerEl;
    this.renderLobby();
  }

  setDifficulty(diff) {
    this.difficulty = diff;
    this.renderLobby();
  }

  getPairsCount() {
    switch (this.difficulty) {
      case 'easy': return 3;    // 6 cards
      case 'medium': return 6;  // 12 cards
      case 'hard': return 9;    // 18 cards
      case 'expert': return 18; // 36 cards (all 18 core elements!)
      default: return 6;
    }
  }

  startSession() {
    this.totalPairs = this.getPairsCount();
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.flippedCards = [];
    this.isLocked = false;

    // Pick unique elements from core 18 (or full 118 if needed)
    const pool = [...ELEMENTS_DATA].filter(el => el.atomicNumber <= (this.totalPairs <= 18 ? 18 : 118));
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, this.totalPairs);

    // Create 2 cards per element (one Symbol card, one Name card)
    const deck = [];
    selected.forEach(el => {
      deck.push({
        id: `${el.atomicNumber}_symbol`,
        atomicNumber: el.atomicNumber,
        type: 'symbol',
        display: el.symbol,
        category: el.category,
        subtext: `#${el.atomicNumber}`
      });
      deck.push({
        id: `${el.atomicNumber}_name`,
        atomicNumber: el.atomicNumber,
        type: 'name',
        display: el.name,
        category: el.category,
        subtext: `Symbol: ${el.symbol}`
      });
    });

    this.cards = deck.sort(() => Math.random() - 0.5);

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.timer++;
      const timerEl = document.getElementById('memory-timer-display');
      if (timerEl) timerEl.textContent = `${this.timer}s`;
    }, 1000);

    if (window.audioService) window.audioService.playClick();
    this.renderGame();
  }

  renderLobby() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:720px; margin:0 auto; text-align:center;">
        <div class="badge badge-emerald" style="margin-bottom:0.75rem;">Game 3</div>
        <h2 style="font-size:2rem; margin:0 0 0.5rem;">Element Memory Match</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem; max-width:520px; margin:0 auto 1.5rem;">
          Exercise your chemical recall by finding matching pairs of element symbols and names beneath flipped cards.
        </p>

        <!-- Difficulty Tier Selector -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem; margin-bottom:2rem;">
          <div class="glass-card difficulty-card ${this.difficulty === 'easy' ? 'selected' : ''}" 
               style="cursor:pointer; padding:1rem; border:2px solid ${this.difficulty === 'easy' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
               onclick="window.memoryGame.setDifficulty('easy')">
            <h4 style="margin:0 0 0.2rem;">Easy</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">6 Cards (3 Pairs)</span>
          </div>

          <div class="glass-card difficulty-card ${this.difficulty === 'medium' ? 'selected' : ''}" 
               style="cursor:pointer; padding:1rem; border:2px solid ${this.difficulty === 'medium' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
               onclick="window.memoryGame.setDifficulty('medium')">
            <h4 style="margin:0 0 0.2rem;">Medium</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">12 Cards (6 Pairs)</span>
          </div>

          <div class="glass-card difficulty-card ${this.difficulty === 'hard' ? 'selected' : ''}" 
               style="cursor:pointer; padding:1rem; border:2px solid ${this.difficulty === 'hard' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
               onclick="window.memoryGame.setDifficulty('hard')">
            <h4 style="margin:0 0 0.2rem;">Hard</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">18 Cards (9 Pairs)</span>
          </div>

          <div class="glass-card difficulty-card ${this.difficulty === 'expert' ? 'selected' : ''}" 
               style="cursor:pointer; padding:1rem; border:2px solid ${this.difficulty === 'expert' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
               onclick="window.memoryGame.setDifficulty('expert')">
            <h4 style="margin:0 0 0.2rem;">Expert</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">36 Cards (18 Pairs)</span>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" onclick="window.memoryGame.startSession()">
          ▶ Start Memory Game
        </button>
      </div>
    `;
  }

  renderGame() {
    const totalCards = this.cards.length;

    this.container.innerHTML = `
      <div style="max-width:920px; margin:0 auto;">
        <!-- Status Bar -->
        <div class="game-status-bar">
          <div class="status-metric">
            <span class="metric-label">Timer</span>
            <span class="metric-value" id="memory-timer-display" style="color:var(--accent-cyan);">${this.timer}s</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Moves</span>
            <span class="metric-value" id="memory-moves-display">${this.moves}</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Matched</span>
            <span class="metric-value" id="memory-pairs-display" style="color:var(--accent-emerald);">${this.matchedPairs} / ${this.totalPairs}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.memoryGame.renderLobby()">✕ Exit</button>
        </div>

        <!-- 3D Card Grid -->
        <div class="memory-grid grid-${totalCards}">
          ${this.cards.map((c, idx) => `
            <div class="memory-card" id="card-${idx}" data-idx="${idx}" onclick="window.memoryGame.flipCard(${idx})">
              <div class="memory-card-front">
                ⚛️
              </div>
              <div class="memory-card-back cat-${c.category}">
                <div style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono);">${c.subtext}</div>
                <div style="font-size:${c.type === 'symbol' ? '1.8rem' : '1rem'}; font-weight:800; margin:0.2rem 0;">${c.display}</div>
                <div style="font-size:0.6rem; color:var(--text-secondary); text-transform:uppercase;">${c.type}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  flipCard(idx) {
    if (this.isLocked) return;
    const cardEl = document.getElementById(`card-${idx}`);
    if (!cardEl || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    if (window.audioService) window.audioService.playClick();
    cardEl.classList.add('flipped');
    this.flippedCards.push({ idx, card: this.cards[idx] });

    if (this.flippedCards.length === 2) {
      this.moves++;
      const movesEl = document.getElementById('memory-moves-display');
      if (movesEl) movesEl.textContent = this.moves;

      const [first, second] = this.flippedCards;
      if (first.card.atomicNumber === second.card.atomicNumber && first.card.type !== second.card.type) {
        // Match!
        this.matchedPairs++;
        const pairsEl = document.getElementById('memory-pairs-display');
        if (pairsEl) pairsEl.textContent = `${this.matchedPairs} / ${this.totalPairs}`;

        if (window.audioService) window.audioService.playMatch();

        document.getElementById(`card-${first.idx}`).classList.add('matched');
        document.getElementById(`card-${second.idx}`).classList.add('matched');
        this.flippedCards = [];

        if (this.matchedPairs === this.totalPairs) {
          this.finishGame();
        }
      } else {
        // Non-match
        this.isLocked = true;
        if (window.audioService) window.audioService.playWrong();

        setTimeout(() => {
          document.getElementById(`card-${first.idx}`).classList.remove('flipped');
          document.getElementById(`card-${second.idx}`).classList.remove('flipped');
          this.flippedCards = [];
          this.isLocked = false;
        }, 1000);
      }
    }
  }

  finishGame() {
    if (this.timerId) clearInterval(this.timerId);

    if (window.storageService) {
      window.storageService.recordGameResult({
        type: 'memory',
        difficulty: this.difficulty,
        score: Math.max(100, 1000 - (this.moves * 15) - (this.timer * 5)),
        timeSec: this.timer,
        accuracy: Math.round((this.totalPairs / Math.max(this.moves, 1)) * 100),
        completed: true,
        won: true,
        missedElements: []
      });
    }

    if (window.audioService) window.audioService.playFanfare();

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:640px; margin:0 auto; text-align:center;">
        <div style="font-size:3.5rem; margin-bottom:0.5rem;">🧠</div>
        <div class="badge badge-emerald" style="margin-bottom:0.5rem;">Memory Master!</div>
        <h2 style="font-size:1.8rem; margin:0 0 0.5rem;">All Pairs Successfully Matched</h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">
          You cleared the <strong>${this.difficulty}</strong> board in <strong>${this.moves} moves</strong> and <strong>${this.timer} seconds</strong>.
        </p>

        <div class="stats-grid" style="margin-bottom:1.5rem;">
          <div class="stat-card">
            <div class="stat-title">Total Moves</div>
            <div class="stat-value" style="color:var(--accent-cyan);">${this.moves}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Time Elapsed</div>
            <div class="stat-value" style="color:var(--accent-purple);">${this.timer}s</div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:0.75rem;">
          <button class="btn btn-primary" onclick="window.memoryGame.startSession()">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="window.gameZone.selectGame('symbol_match')">Play Symbol Match →</button>
        </div>
      </div>
    `;
  }
}

window.memoryGame = new MemoryGame();
