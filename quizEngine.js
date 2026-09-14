/**
 * ELEMENT 118 — 10-QUESTION INTERACTIVE QUIZ ENGINE
 * Runs 10-question timed quizzes, tracks weak topics, and feeds missed elements into Flashback.
 */

class QuizEngineComponent {
  constructor() {
    this.container = null;
    this.state = 'lobby'; // 'lobby' | 'active' | 'results' | 'review'
    this.difficulty = 'medium';
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.startTime = 0;
    this.timeElapsed = 0;
    this.timerId = null;
  }

  init() {
    this.container = document.getElementById('quiz-system-container');
    if (!this.container || typeof QuizBank === 'undefined') return;

    this.render();
  }

  startQuiz(difficulty = 'medium', focusZ = null) {
    this.difficulty = difficulty;
    if (window.quizBank) {
      this.questions = window.quizBank.generateQuiz(difficulty, focusZ);
    }
    this.currentIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.state = 'active';
    this.startTime = Date.now();
    this.timeElapsed = 0;

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const timerEl = document.getElementById('quiz-live-timer');
      if (timerEl) {
        const mins = Math.floor(this.timeElapsed / 60);
        const secs = this.timeElapsed % 60;
        timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);

    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.state === 'lobby') {
      this.renderLobby();
    } else if (this.state === 'active') {
      this.renderActiveQuestion();
    } else if (this.state === 'results') {
      this.renderResults();
    } else if (this.state === 'review') {
      this.renderReview();
    }
  }

  renderLobby() {
    const stats = window.storageService ? window.storageService.state : {};
    const attempts = stats.quizAttempts || 0;
    const avgScore = stats.averageQuizScore || 0;
    const bestScore = stats.bestQuizScore || 0;

    this.container.innerHTML = `
      <div style="max-width:840px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:2rem;">
          <div class="badge badge-cyan" style="margin-bottom:0.75rem;">10-Question Chemistry Challenge</div>
          <h1 style="font-size:2.2rem; margin:0;">Chemistry Mastery Quiz</h1>
          <p style="color:var(--text-secondary); font-size:1rem; max-width:580px; margin:0.5rem auto 0;">
            Test your knowledge across nomenclature, quantum electron configs, periodic trends, and real-world element applications.
          </p>
        </div>

        <!-- Performance Stats Overview Card -->
        <div class="stats-grid" style="margin-bottom:2rem;">
          <div class="stat-card">
            <div class="stat-title">Quizzes Completed</div>
            <div class="stat-value" style="color:var(--accent-cyan);">${attempts}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Average Score</div>
            <div class="stat-value" style="color:var(--accent-purple);">${avgScore}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Highest Score</div>
            <div class="stat-value" style="color:var(--accent-emerald);">${bestScore}%</div>
          </div>
        </div>

        <!-- Difficulty Tier Selector -->
        <div class="glass-card" style="margin-bottom:2rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem;">Select Difficulty Level</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
            <div class="glass-card difficulty-card ${this.difficulty === 'easy' ? 'selected' : ''}" 
                 style="cursor:pointer; padding:1.25rem; border:2px solid ${this.difficulty === 'easy' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
                 onclick="window.quizEngine.setDifficulty('easy')">
              <div style="font-size:1.5rem; margin-bottom:0.4rem;">🌱</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Easy</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Symbols, basic names, and common everyday elements (1–20).</p>
            </div>

            <div class="glass-card difficulty-card ${this.difficulty === 'medium' ? 'selected' : ''}" 
                 style="cursor:pointer; padding:1.25rem; border:2px solid ${this.difficulty === 'medium' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
                 onclick="window.quizEngine.setDifficulty('medium')">
              <div style="font-size:1.5rem; margin-bottom:0.4rem;">⚡</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Medium</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Groups, periods, valence electrons, and electron configurations.</p>
            </div>

            <div class="glass-card difficulty-card ${this.difficulty === 'hard' ? 'selected' : ''}" 
                 style="cursor:pointer; padding:1.25rem; border:2px solid ${this.difficulty === 'hard' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
                 onclick="window.quizEngine.setDifficulty('hard')">
              <div style="font-size:1.5rem; margin-bottom:0.4rem;">🔥</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Hard</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">Transition metals, periodic trends, and oxidation numbers.</p>
            </div>

            <div class="glass-card difficulty-card ${this.difficulty === 'expert' ? 'selected' : ''}" 
                 style="cursor:pointer; padding:1.25rem; border:2px solid ${this.difficulty === 'expert' ? 'var(--accent-cyan)' : 'var(--border-subtle)'};"
                 onclick="window.quizEngine.setDifficulty('expert')">
              <div style="font-size:1.5rem; margin-bottom:0.4rem;">👑</div>
              <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Expert</h4>
              <p style="font-size:0.8rem; color:var(--text-secondary);">All 118 elements, superheavy elements, and quantum nuances.</p>
            </div>
          </div>

          <div style="margin-top:1.75rem; text-align:center;">
            <button class="btn btn-primary btn-lg" onclick="window.quizEngine.startQuiz('${this.difficulty}')" style="padding:1rem 2.5rem; font-size:1.1rem;">
              🚀 Start 10-Question Quiz Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setDifficulty(diff) {
    this.difficulty = diff;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  renderActiveQuestion() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    const progressPct = ((this.currentIndex + 1) / 10) * 100;
    const answered = this.userAnswers[this.currentIndex] !== undefined;
    const userChoice = this.userAnswers[this.currentIndex];

    this.container.innerHTML = `
      <div class="quiz-container">
        <!-- Top Status Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span class="badge badge-cyan" style="text-transform:uppercase;">${this.difficulty} Level</span>
            <span class="badge badge-purple">${q.topic}</span>
          </div>
          <div style="display:flex; align-items:center; gap:1rem; font-family:var(--font-mono); font-weight:700;">
            <span style="color:var(--text-secondary);">Q: <strong style="color:var(--text-primary);">${this.currentIndex + 1} / 10</strong></span>
            <span style="color:var(--accent-cyan);" id="quiz-live-timer">0:00</span>
          </div>
        </div>

        <!-- Visual Progress Bar -->
        <div class="quiz-timer-bar">
          <div class="quiz-timer-progress" style="width:${progressPct}%;"></div>
        </div>

        <!-- Question Prompt -->
        <h2 class="quiz-question-title">${q.question}</h2>

        <!-- Answer Options -->
        <div class="quiz-options">
          ${q.options.map((opt, idx) => {
            let stateClass = '';
            if (answered) {
              if (idx === q.correctIndex) stateClass = 'correct';
              else if (idx === userChoice) stateClass = 'wrong';
            }
            return `
              <button class="quiz-option-btn ${stateClass}" 
                      onclick="window.quizEngine.selectOption(${idx})" 
                      ${answered ? 'disabled' : ''}>
                <span class="mono" style="font-weight:700; width:24px; color:var(--text-muted);">${['A', 'B', 'C', 'D'][idx]}.</span>
                <span style="flex:1;">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation Card (Shown after answering) -->
        ${answered ? `
          <div style="margin-top:1.5rem; padding:1rem 1.25rem; border-radius:var(--radius-md); background:${userChoice === q.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border:1px solid ${userChoice === q.correctIndex ? '#10b981' : '#ef4444'};">
            <div style="font-weight:700; color:${userChoice === q.correctIndex ? '#34d399' : '#f87171'}; margin-bottom:0.25rem;">
              ${userChoice === q.correctIndex ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
            </div>
            <div style="font-size:0.9rem; color:var(--text-primary); line-height:1.5;">${q.explanation}</div>
          </div>

          <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-ghost btn-sm" onclick="window.quizEngine.exitQuiz()">Quit Quiz</button>
            <button class="btn btn-primary" onclick="window.quizEngine.nextQuestion()">
              ${this.currentIndex < 9 ? 'Next Question →' : 'View Final Results 🏆'}
            </button>
          </div>
        ` : `
          <div style="margin-top:1.5rem; display:flex; justify-content:flex-start;">
            <button class="btn btn-ghost btn-sm" onclick="window.quizEngine.exitQuiz()">Quit Quiz</button>
          </div>
        `}
      </div>
    `;
  }

  selectOption(idx) {
    if (this.userAnswers[this.currentIndex] !== undefined) return;

    this.userAnswers[this.currentIndex] = idx;
    const q = this.questions[this.currentIndex];

    if (idx === q.correctIndex) {
      this.score += 1;
      if (window.audioService) window.audioService.playCorrect();
    } else {
      if (window.audioService) window.audioService.playWrong();
    }

    this.render();
  }

  nextQuestion() {
    if (this.currentIndex < 9) {
      this.currentIndex += 1;
      if (window.audioService) window.audioService.playClick();
      this.render();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    if (this.timerId) clearInterval(this.timerId);
    this.state = 'results';

    // Identify missed elements & weaknesses
    const missedElements = [];
    const topicWeaknesses = {};

    this.questions.forEach((q, idx) => {
      const ans = this.userAnswers[idx];
      if (ans !== q.correctIndex) {
        if (q.targetZ) missedElements.push(q.targetZ);
        topicWeaknesses[q.topic] = (topicWeaknesses[q.topic] || 0) + 1;
      }
    });

    // Record result in StorageService
    if (window.storageService) {
      window.storageService.recordQuizResult({
        difficulty: this.difficulty,
        score: this.score,
        total: 10,
        timeSec: this.timeElapsed,
        missedElements: missedElements,
        weaknesses: topicWeaknesses
      });
    }

    if (this.score === 10 && window.audioService) {
      window.audioService.playFanfare();
    } else if (window.audioService) {
      window.audioService.playStreak();
    }

    this.render();
  }

  renderResults() {
    const percentage = Math.round((this.score / 10) * 100);
    const mins = Math.floor(this.timeElapsed / 60);
    const secs = this.timeElapsed % 60;
    const timeFormatted = `${mins}m ${secs}s`;

    let ratingTitle = 'Keep Practicing!';
    let ratingColor = 'var(--text-secondary)';
    if (percentage === 100) {
      ratingTitle = '👑 Absolute Perfection!';
      ratingColor = 'var(--accent-amber)';
    } else if (percentage >= 80) {
      ratingTitle = '🌟 Outstanding Mastery!';
      ratingColor = 'var(--accent-emerald)';
    } else if (percentage >= 60) {
      ratingTitle = '👍 Good Effort!';
      ratingColor = 'var(--accent-cyan)';
    }

    // Collect weaknesses
    const missed = this.questions.filter((q, idx) => this.userAnswers[idx] !== q.correctIndex);

    this.container.innerHTML = `
      <div class="quiz-container" style="text-align:center;">
        <div class="badge badge-cyan" style="margin-bottom:0.75rem;">Quiz Completed</div>
        <h2 style="font-size:2rem; margin:0 0 0.5rem; color:${ratingColor};">${ratingTitle}</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:2rem;">
          You completed the <strong>${this.difficulty} Level</strong> 10-question chemistry challenge in <strong>${timeFormatted}</strong>.
        </p>

        <!-- Large Score Callout -->
        <div style="background:var(--bg-tertiary); border:1px solid var(--border-medium); border-radius:var(--radius-xl); padding:2rem; max-width:360px; margin:0 auto 2rem;">
          <div style="font-size:4rem; font-weight:800; font-family:var(--font-mono); line-height:1; color:var(--accent-cyan);">
            ${percentage}%
          </div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-top:0.5rem;">
            ${this.score} / 10 Questions Correct
          </div>
        </div>

        <!-- Topic Weakness Diagnostics -->
        ${missed.length > 0 ? `
          <div class="glass-card" style="text-align:left; margin-bottom:2rem; background:rgba(15, 23, 42, 0.9);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
              <span style="font-size:1.25rem;">🔍</span>
              <h3 style="font-size:1.1rem; margin:0;">Targeted Review Recommendations</h3>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
              The ${missed.length} missed concept(s) have been automatically queued in your <strong>Personalized Flashback</strong> for revision.
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${missed.map(m => `
                <span class="badge badge-rose" style="font-size:0.75rem; text-transform:none;">
                  #${m.targetZ} • ${m.topic}
                </span>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="glass-card" style="margin-bottom:2rem; background:rgba(16, 185, 129, 0.1); border-color:#10b981;">
            <h3 style="color:#34d399; margin:0 0 0.25rem;">🎯 Flawless Performance!</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">Zero weaknesses detected in this round. You have earned maximum PCS score points!</p>
          </div>
        `}

        <!-- Action Buttons -->
        <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="window.quizEngine.openReview()">🔍 Review All Answers</button>
          <button class="btn btn-primary" onclick="window.quizEngine.startQuiz('${this.difficulty}')">🔄 Retry ${this.difficulty}</button>
          ${this.difficulty !== 'expert' ? `
            <button class="btn btn-accent" onclick="window.quizEngine.startNextLevel()">Next Level ⚡</button>
          ` : ''}
          <button class="btn btn-ghost" onclick="window.quizEngine.exitQuiz()">Exit to Lobby</button>
        </div>
      </div>
    `;
  }

  startNextLevel() {
    const levels = ['easy', 'medium', 'hard', 'expert'];
    const currIdx = levels.indexOf(this.difficulty);
    const nextLevel = levels[Math.min(levels.length - 1, currIdx + 1)];
    this.startQuiz(nextLevel);
  }

  openReview() {
    this.state = 'review';
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  renderReview() {
    this.container.innerHTML = `
      <div style="max-width:800px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div>
            <h2 style="font-size:1.6rem; margin:0;">Detailed Quiz Review</h2>
            <p style="color:var(--text-secondary); font-size:0.85rem; margin:0.25rem 0 0;">Review every question, your selected option, and scientific rationales.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.quizEngine.state='results'; window.quizEngine.render();">
            ← Back to Summary
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${this.questions.map((q, idx) => {
            const userChoice = this.userAnswers[idx];
            const isCorrect = userChoice === q.correctIndex;
            return `
              <div class="glass-card" style="border-left:4px solid ${isCorrect ? '#10b981' : '#ef4444'};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <span class="badge ${isCorrect ? 'badge-emerald' : 'badge-rose'}">
                    ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                  <span style="font-size:0.8rem; color:var(--text-muted); font-family:var(--font-mono);">Question ${idx + 1} of 10</span>
                </div>
                <h3 style="font-size:1.1rem; margin-bottom:0.75rem;">${q.question}</h3>
                <div style="font-size:0.875rem; margin-bottom:0.5rem;">
                  <span style="color:var(--text-secondary);">Your Answer:</span>
                  <strong style="color:${isCorrect ? '#34d399' : '#f87171'}; font-family:var(--font-mono);">${q.options[userChoice] || 'None'}</strong>
                </div>
                ${!isCorrect ? `
                  <div style="font-size:0.875rem; margin-bottom:0.75rem;">
                    <span style="color:var(--text-secondary);">Correct Answer:</span>
                    <strong style="color:#34d399; font-family:var(--font-mono);">${q.options[q.correctIndex]}</strong>
                  </div>
                ` : ''}
                <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm); font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">
                  💡 ${q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  exitQuiz() {
    if (this.timerId) clearInterval(this.timerId);
    this.state = 'lobby';
    if (window.audioService) window.audioService.playClick();
    this.render();
  }
}

window.quizEngine = new QuizEngineComponent();
