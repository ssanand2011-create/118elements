/**
 * ELEMENT 118 — GAME 2: ATOMIC NUMBER CHALLENGE
 * Rapid-fire multiple choice atomic number guessing game with streaks, instant feedback, and timer.
 */

class AtomicNumberGame {
  constructor() {
    this.container = null;
    this.mode = 'core18'; // 'core18' | 'full118'
    this.totalRounds = 10;
    this.currentRound = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.timer = 0;
    this.timerId = null;
    this.currentElement = null;
    this.options = [];
    this.missedElements = [];
    this.isAnswering = false;
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

  startSession() {
    this.currentRound = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.timer = 0;
    this.missedElements = [];

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.timer++;
      const timerEl = document.getElementById('atomic-timer-display');
      if (timerEl) timerEl.textContent = `${this.timer}s`;
    }, 1000);

    if (window.audioService) window.audioService.playClick();
    this.nextRound();
  }

  nextRound() {
    if (this.currentRound >= this.totalRounds) {
      this.finishGame();
      return;
    }

    this.currentRound++;
    this.isAnswering = true;
    const pool = this.getPool();
    this.currentElement = pool[Math.floor(Math.random() * pool.length)];

    // Generate 3 clever distractors
    const correctZ = this.currentElement.atomicNumber;
    const offsets = [-3, -2, -1, 1, 2, 3, 4, -4].filter(off => correctZ + off > 0 && correctZ + off <= (this.mode === 'core18' ? 18 : 118));
    const shuffledOffsets = [...offsets].sort(() => Math.random() - 0.5).slice(0, 3);
    const distractors = shuffledOffsets.map(off => correctZ + off);

    this.options = [correctZ, ...distractors].sort(() => Math.random() - 0.5);
    this.renderQuestion();
  }

  renderLobby() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:720px; margin:0 auto; text-align:center;">
        <div class="badge badge-purple" style="margin-bottom:0.75rem;">Game 2</div>
        <h2 style="font-size:2rem; margin:0 0 0.5rem;">Atomic Number Challenge</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem; max-width:520px; margin:0 auto 1.5rem;">
          Identify the exact atomic number (number of protons) for randomly displayed chemical elements.
        </p>

        <div style="display:flex; justify-content:center; gap:1rem; margin-bottom:2rem; flex-wrap:wrap;">
          <div class="glass-card" style="padding:1rem; min-width:140px;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Dataset</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--accent-cyan); margin-top:0.25rem;">
              ${this.mode === 'core18' ? '18 Core Elements (H–Ar)' : 'All 118 Elements'}
            </div>
          </div>
          <div class="glass-card" style="padding:1rem; min-width:140px;">
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Rounds</div>
            <div style="font-size:1.1rem; font-weight:800; color:var(--accent-purple); margin-top:0.25rem;">10 Questions</div>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" onclick="window.atomicNumberGame.startSession()">
          ▶ Start Atomic Number Challenge
        </button>
      </div>
    `;
  }

  renderQuestion() {
    const el = this.currentElement;

    this.container.innerHTML = `
      <div style="max-width:720px; margin:0 auto;">
        <!-- Status Bar -->
        <div class="game-status-bar">
          <div class="status-metric">
            <span class="metric-label">Timer</span>
            <span class="metric-value" id="atomic-timer-display" style="color:var(--accent-cyan);">${this.timer}s</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Score</span>
            <span class="metric-value">${this.score}</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Streak</span>
            <span class="metric-value" style="color:var(--accent-amber);">${this.streak}🔥</span>
          </div>
          <div class="status-metric">
            <span class="metric-label">Round</span>
            <span class="metric-value" style="color:var(--accent-purple);">${this.currentRound} / ${this.totalRounds}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.atomicNumberGame.renderLobby()">✕ Exit</button>
        </div>

        <!-- Challenge Display Box -->
        <div class="challenge-box">
          <h3 style="font-size:1.3rem; margin:0 0 1rem; color:var(--text-secondary);">What is the Atomic Number of:</h3>

          <div class="challenge-element-display cat-${el.category}">
            <div class="challenge-symbol">${el.symbol}</div>
            <div class="challenge-name">${el.name}</div>
          </div>

          <!-- 4 Multiple Choice Options -->
          <div class="options-grid">
            ${this.options.map(opt => `
              <button class="option-btn" data-val="${opt}" onclick="window.atomicNumberGame.handleChoice(${opt})">
                Z = ${opt}
              </button>
            `).join('')}
          </div>

          <div id="atomic-feedback-msg" style="margin-top:1.25rem; font-size:0.95rem; min-height:24px; font-weight:700;"></div>
        </div>
      </div>
    `;
  }

  handleChoice(selectedZ) {
    if (!this.isAnswering) return;
    this.isAnswering = false;

    const correctZ = this.currentElement.atomicNumber;
    const isCorrect = selectedZ === correctZ;
    const feedbackEl = document.getElementById('atomic-feedback-msg');
    const clickedBtn = this.container.querySelector(`.option-btn[data-val="${selectedZ}"]`);
    const correctBtn = this.container.querySelector(`.option-btn[data-val="${correctZ}"]`);

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.score += 100 + (this.streak * 25);

      if (window.audioService) window.audioService.playCorrect();
      if (clickedBtn) clickedBtn.classList.add('correct');
      if (feedbackEl) {
        feedbackEl.style.color = '#34d399';
        feedbackEl.textContent = `✓ Correct! ${this.currentElement.name} has ${correctZ} protons.`;
      }
    } else {
      this.streak = 0;
      this.missedElements.push(correctZ);

      if (window.audioService) window.audioService.playWrong();
      if (clickedBtn) clickedBtn.classList.add('wrong');
      if (correctBtn) correctBtn.classList.add('correct');
      if (feedbackEl) {
        feedbackEl.style.color = '#f87171';
        feedbackEl.textContent = `✗ Incorrect! ${this.currentElement.name} has atomic number Z = ${correctZ}.`;
      }
    }

    setTimeout(() => {
      this.nextRound();
    }, 1200);
  }

  finishGame() {
    if (this.timerId) clearInterval(this.timerId);
    const accuracy = Math.round((this.correctCount / this.totalRounds) * 100);

    if (window.storageService) {
      window.storageService.recordGameResult({
        type: 'atomic_number',
        difficulty: this.mode,
        score: this.score,
        timeSec: this.timer,
        accuracy: accuracy,
        completed: true,
        won: accuracy >= 70,
        missedElements: Array.from(new Set(this.missedElements))
      });
    }

    if (window.audioService) window.audioService.playFanfare();

    this.container.innerHTML = `
      <div class="glass-card" style="max-width:640px; margin:0 auto; text-align:center;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">🎯</div>
        <div class="badge badge-cyan" style="margin-bottom:0.5rem;">Challenge Completed!</div>
        <h2 style="font-size:1.8rem; margin:0 0 0.5rem;">Atomic Number Mastery</h2>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">
          You scored <strong>${this.correctCount} / 10</strong> in <strong>${this.timer} seconds</strong>.
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
          <button class="btn btn-primary" onclick="window.atomicNumberGame.startSession()">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="window.gameZone.selectGame('memory')">Next Game (Memory Cards) →</button>
        </div>
      </div>
    `;
  }
}

window.atomicNumberGame = new AtomicNumberGame();
