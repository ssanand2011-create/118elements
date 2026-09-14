/**
 * ELEMENT 118 — FAST MEMORY RAPID ELEMENT RECOGNITION TRAINER
 * High-speed visual sequence flash challenge (10, 20, 30 elements) followed by rapid-fire recognition testing.
 */

class FastMemoryComponent {
  constructor() {
    this.container = null;
    this.state = 'lobby'; // 'lobby' | 'countdown' | 'flashing' | 'testing' | 'results'
    this.sequenceLength = 10; // 10 | 20 | 30
    this.sequence = [];
    this.currentFlashIndex = 0;
    this.flashInterval = null;
    this.testQuestions = [];
    this.currentTestIndex = 0;
    this.testScore = 0;
    this.startTime = 0;
    this.timeElapsed = 0;
  }

  init() {
    this.container = document.getElementById('fast-memory-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  setLength(len) {
    this.sequenceLength = len;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  startSequence() {
    if (typeof ELEMENTS_DATA === 'undefined') return;

    const pool = [...ELEMENTS_DATA];
    this.sequence = [...pool].sort(() => Math.random() - 0.5).slice(0, this.sequenceLength);
    this.currentFlashIndex = 0;
    this.state = 'countdown';
    this.render();

    let count = 3;
    const countEl = document.getElementById('fast-countdown-number');
    if (window.audioService) window.audioService.playClick();

    const countTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (countEl) countEl.textContent = count;
        if (window.audioService) window.audioService.playClick();
      } else {
        clearInterval(countTimer);
        this.runFlashingPhase();
      }
    }, 900);
  }

  runFlashingPhase() {
    this.state = 'flashing';
    this.currentFlashIndex = 0;
    this.render();

    this.flashInterval = setInterval(() => {
      this.currentFlashIndex++;
      if (this.currentFlashIndex >= this.sequence.length) {
        clearInterval(this.flashInterval);
        this.startTestingPhase();
      } else {
        if (window.audioService) window.audioService.playClick();
        this.render();
      }
    }, 1300);
  }

  startTestingPhase() {
    this.state = 'testing';
    this.currentTestIndex = 0;
    this.testScore = 0;
    this.startTime = Date.now();

    // Generate 5 verification questions based on the flashed sequence
    const seqSet = new Set(this.sequence.map(el => el.atomicNumber));
    const nonSeq = ELEMENTS_DATA.filter(el => !seqSet.has(el.atomicNumber));

    this.testQuestions = [];
    for (let i = 0; i < 5; i++) {
      const isPresent = Math.random() > 0.5;
      const targetEl = isPresent 
        ? this.sequence[Math.floor(Math.random() * this.sequence.length)]
        : nonSeq[Math.floor(Math.random() * nonSeq.length)];

      this.testQuestions.push({
        element: targetEl,
        wasPresent: isPresent,
        question: `Did <strong>${targetEl.name} (${targetEl.symbol}, #${targetEl.atomicNumber})</strong> appear in the flash sequence?`
      });
    }

    if (window.audioService) window.audioService.playStreak();
    this.render();
  }

  answerQuestion(userSaysYes) {
    const q = this.testQuestions[this.currentTestIndex];
    const isCorrect = (userSaysYes && q.wasPresent) || (!userSaysYes && !q.wasPresent);

    if (isCorrect) {
      this.testScore++;
      if (window.audioService) window.audioService.playCorrect();
    } else {
      if (window.audioService) window.audioService.playWrong();
    }

    this.currentTestIndex++;
    if (this.currentTestIndex >= this.testQuestions.length) {
      this.finishTest();
    } else {
      this.render();
    }
  }

  finishTest() {
    this.timeElapsed = Math.round((Date.now() - this.startTime) / 1000);
    this.state = 'results';

    if (window.storageService) {
      window.storageService.recordFastMemoryScore(this.testScore, this.testQuestions.length, this.timeElapsed);
    }

    if (this.testScore === 5 && window.audioService) {
      window.audioService.playFanfare();
    }

    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.state === 'lobby') {
      const stats = window.storageService ? window.storageService.state : {};
      const best = stats.fastMemoryBest || 0;

      this.container.innerHTML = `
        <div style="max-width:760px; margin:0 auto; text-align:center;">
          <div class="badge badge-cyan" style="margin-bottom:0.75rem;">Rapid Recognition Challenge</div>
          <h1 style="font-size:2.2rem; margin:0 0 0.5rem;">Fast Memory Trainer</h1>
          <p style="color:var(--text-secondary); font-size:0.95rem; max-width:540px; margin:0 auto 1.5rem;">
            Watch a rapid-fire sequence of chemical elements flash on the screen, then test your working memory with instant recognition questions.
          </p>

          <div class="glass-card" style="margin-bottom:2rem; padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span style="font-weight:700; font-size:1rem;">Choose Sequence Length:</span>
              <span style="font-family:var(--font-mono); color:var(--accent-emerald); font-weight:700;">Personal Best: ${best}%</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
              <button class="btn ${this.sequenceLength === 10 ? 'btn-primary' : 'btn-secondary'}" onclick="window.fastMemory.setLength(10)">
                10 Elements (Quick)
              </button>
              <button class="btn ${this.sequenceLength === 20 ? 'btn-primary' : 'btn-secondary'}" onclick="window.fastMemory.setLength(20)">
                20 Elements (Standard)
              </button>
              <button class="btn ${this.sequenceLength === 30 ? 'btn-primary' : 'btn-secondary'}" onclick="window.fastMemory.setLength(30)">
                30 Elements (Master)
              </button>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" onclick="window.fastMemory.startSequence()" style="padding:1rem 2.5rem; font-size:1.1rem;">
            ⚡ Start Flash Sequence
          </button>
        </div>
      `;
    } else if (this.state === 'countdown') {
      this.container.innerHTML = `
        <div style="text-align:center; padding:4rem 1rem;">
          <div class="badge badge-cyan" style="margin-bottom:1rem;">Get Ready!</div>
          <div id="fast-countdown-number" style="font-size:6rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-cyan); line-height:1;">
            3
          </div>
          <p style="color:var(--text-secondary); margin-top:1rem;">Focus your eyes. The elements will flash in rapid succession.</p>
        </div>
      `;
    } else if (this.state === 'flashing') {
      const el = this.sequence[this.currentFlashIndex];
      if (!el) return;

      this.container.innerHTML = `
        <div style="max-width:540px; margin:0 auto; text-align:center;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <span class="badge badge-amber">⚡ Flashing Sequence</span>
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">
              ${this.currentFlashIndex + 1} / ${this.sequence.length}
            </span>
          </div>

          <div class="glass-card cat-${el.category}" style="padding:3rem 2rem; border:2px solid var(--cat-${el.category}); box-shadow:0 0 30px var(--cat-${el.category}-glow); animation:pulse 0.3s ease-out;">
            <div style="font-size:1rem; font-family:var(--font-mono); color:var(--text-secondary); margin-bottom:0.5rem;">
              Atomic Number #${el.atomicNumber}
            </div>
            <div style="font-size:4.5rem; font-weight:800; line-height:1; color:var(--text-primary); margin-bottom:0.5rem;">
              ${el.symbol}
            </div>
            <h2 style="font-size:1.8rem; margin:0 0 0.5rem;">${el.name}</h2>
            <div class="badge" style="background:var(--cat-${el.category}-glow); font-size:0.75rem;">
              ${el.category.replace(/-/g, ' ')}
            </div>
          </div>
        </div>
      `;
    } else if (this.state === 'testing') {
      const q = this.testQuestions[this.currentTestIndex];
      this.container.innerHTML = `
        <div class="glass-card" style="max-width:620px; margin:0 auto; text-align:center; padding:2.5rem 2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <span class="badge badge-purple">Recognition Test</span>
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">
              Question ${this.currentTestIndex + 1} / ${this.testQuestions.length}
            </span>
          </div>

          <h2 style="font-size:1.5rem; line-height:1.5; margin-bottom:2rem;">
            ${q.question}
          </h2>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; max-width:400px; margin:0 auto;">
            <button class="btn btn-success btn-lg" onclick="window.fastMemory.answerQuestion(true)">
              ✓ YES, It Appeared
            </button>
            <button class="btn btn-danger btn-lg" onclick="window.fastMemory.answerQuestion(false)">
              ✕ NO, It Did Not
            </button>
          </div>
        </div>
      `;
    } else if (this.state === 'results') {
      const pct = Math.round((this.testScore / this.testQuestions.length) * 100);
      this.container.innerHTML = `
        <div class="glass-card" style="max-width:620px; margin:0 auto; text-align:center; padding:2.5rem 2rem;">
          <div style="font-size:3.5rem; margin-bottom:0.5rem;">⚡</div>
          <div class="badge badge-emerald" style="margin-bottom:0.5rem;">Speed Memory Score</div>
          <h2 style="font-size:2rem; margin:0 0 1rem;">Recognition Result</h2>

          <div style="background:var(--bg-tertiary); border-radius:var(--radius-xl); padding:2rem; max-width:320px; margin:0 auto 1.5rem;">
            <div style="font-size:3.5rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-cyan);">
              ${pct}%
            </div>
            <div style="font-size:1rem; color:var(--text-secondary); margin-top:0.25rem;">
              ${this.testScore} / ${this.testQuestions.length} Recognized in ${this.timeElapsed}s
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:0.75rem;">
            <button class="btn btn-primary" onclick="window.fastMemory.startSequence()">🔄 Try Again</button>
            <button class="btn btn-secondary" onclick="window.fastMemory.state='lobby'; window.fastMemory.render();">Exit to Lobby</button>
          </div>
        </div>
      `;
    }
  }
}

window.fastMemory = new FastMemoryComponent();
