/**
 * ELEMENT 118 — PCS (PROGRESS & CHEMISTRY SCORE) DASHBOARD COMPONENT
 * Central performance tracking hub visualizing genuine user mastery, metrics, streaks, and unlocked achievement badges.
 */

class PCSDashboardComponent {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('pcs-dashboard-container');
    if (!this.container || typeof ACHIEVEMENTS_DATA === 'undefined') return;

    if (window.storageService) {
      window.storageService.subscribe(() => {
        if (window.appRouter && window.appRouter.currentView === 'pcs') {
          this.render();
        }
        this.updateHeaderScore();
      });
    }

    this.render();
    this.updateHeaderScore();
  }

  updateHeaderScore() {
    const pcs = window.storageService ? window.storageService.calculatePCS() : 0;
    const headerEl = document.getElementById('header-pcs-score');
    const homeEl = document.getElementById('home-pcs-score-display');
    if (headerEl) headerEl.textContent = `${pcs}%`;
    if (homeEl) homeEl.textContent = `${pcs}%`;
  }

  render() {
    if (!this.container || !window.storageService) return;

    const state = window.storageService.state;
    const pcs = window.storageService.calculatePCS();
    const circumference = 2 * Math.PI * 70; // ~439.82
    const strokeOffset = circumference * (1 - pcs / 100);

    const explored = state.exploredElements.length;
    const mastered = state.masteredElements.length;
    const topics = state.learningCompletedTopics.length;
    const quizzes = state.quizAttempts;
    const quizAvg = state.averageQuizScore;
    const games = state.gamesCompleted;
    const streak = state.currentStreak;
    const bestStreak = state.bestStreak;
    const flashbackCount = state.flashbackReviewsCompleted;
    const fastMem = state.fastMemoryBest;

    this.container.innerHTML = `
      <div style="max-width:1040px; margin:0 auto;">
        <!-- Header -->
        <div style="margin-bottom:2rem; text-align:center;">
          <div class="badge badge-cyan" style="margin-bottom:0.5rem;">Performance & Progress Center</div>
          <h1 style="font-size:2.4rem; margin:0;">Chemistry Progress Score (PCS)</h1>
          <p style="color:var(--text-secondary); font-size:1rem; max-width:620px; margin:0.5rem auto 0;">
            A unified, scientifically grounded mastery rating calculated dynamically from your actual exploration, quizzes, games, learning topics, and revisions.
          </p>
        </div>

        <!-- Central Score & Gauge Section -->
        <div class="glass-card" style="padding:2.5rem; border-color:var(--border-bright); margin-bottom:2rem; position:relative; overflow:hidden;">
          <div style="display:flex; align-items:center; justify-content:space-around; flex-wrap:wrap; gap:2rem;">
            <!-- Animated SVG Circular Gauge -->
            <div class="pcs-gauge-wrapper">
              <svg class="pcs-gauge-svg" viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="pcsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8" />
                    <stop offset="50%" stop-color="#818cf8" />
                    <stop offset="100%" stop-color="#c084fc" />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="70" class="pcs-gauge-bg" />
                <circle cx="90" cy="90" r="70" class="pcs-gauge-progress" 
                        style="stroke-dasharray:${circumference}; stroke-dashoffset:${strokeOffset};" />
              </svg>
              <div class="pcs-gauge-value">
                <span class="pcs-score-num">${pcs}%</span>
                <span style="font-size:0.75rem; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Overall Score</span>
              </div>
            </div>

            <!-- Score Summary Callout -->
            <div style="max-width:440px; display:flex; flex-direction:column; gap:0.75rem;">
              <div class="badge badge-emerald" style="width:fit-content;">Real-Time Activity Engine</div>
              <h2 style="font-size:1.6rem; margin:0;">
                ${pcs >= 80 ? 'Master Chemist Rank' : (pcs >= 50 ? 'Intermediate Scholar' : (pcs >= 20 ? 'Apprentice Chemist' : 'Initiate Explorer'))}
              </h2>
              <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6; margin:0;">
                Your Chemistry Progress Score measures depth of knowledge across the periodic table, accuracy under test conditions, and commitment to revision.
              </p>
              <div style="display:flex; gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" onclick="window.appRouter.navigate('table')">Explore Table</button>
                <button class="btn btn-secondary btn-sm" onclick="window.appRouter.navigate('quiz')">Take a Quiz</button>
                <button class="btn btn-secondary btn-sm" onclick="window.appRouter.navigate('games')">Play Games</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 8 Detailed Metric Cards Grid -->
        <h2 style="font-size:1.4rem; margin-bottom:1rem;">Activity & Mastery Breakdown</h2>
        <div class="stats-grid" style="margin-bottom:2.5rem;">
          <div class="stat-card">
            <div class="stat-title">Elements Explored</div>
            <div class="stat-value" style="color:var(--accent-cyan);">${explored} <span style="font-size:1rem; color:var(--text-muted);">/ 118</span></div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${Math.round((explored / 118) * 100)}% of periodic table</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Elements Mastered</div>
            <div class="stat-value" style="color:var(--accent-emerald);">${mastered} <span style="font-size:1rem; color:var(--text-muted);">/ 118</span></div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Reinforced via Flashback</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Learning Modules</div>
            <div class="stat-value" style="color:var(--accent-purple);">${topics} <span style="font-size:1rem; color:var(--text-muted);">/ 16</span></div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Core topics verified</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Average Quiz Score</div>
            <div class="stat-value" style="color:var(--accent-amber);">${quizAvg}%</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${quizzes} quiz attempts logged</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Games Completed</div>
            <div class="stat-value" style="color:#38bdf8;">${games}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Symbol, Atomic #, Memory</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Active Learning Streak</div>
            <div class="stat-value" style="color:#fbbf24;">${streak} <span style="font-size:1rem; color:var(--text-muted);">days 🔥</span></div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Personal best: ${bestStreak} days</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Flashback Reviews</div>
            <div class="stat-value" style="color:#34d399;">${flashbackCount}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Weak concepts resolved</div>
          </div>

          <div class="stat-card">
            <div class="stat-title">Fast Memory Best</div>
            <div class="stat-value" style="color:#c084fc;">${fastMem}%</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Rapid visual recall rate</div>
          </div>
        </div>

        <!-- Badges & Achievements Gallery -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h2 style="font-size:1.4rem; margin:0;">Badges & Milestones</h2>
          <span style="font-size:0.85rem; color:var(--text-muted);">
            ${state.unlockedAchievements.length} / ${ACHIEVEMENTS_DATA.length} Unlocked
          </span>
        </div>

        <div class="achievements-grid" style="margin-bottom:2.5rem;">
          ${ACHIEVEMENTS_DATA.map(ach => {
            const isUnlocked = state.unlockedAchievements.includes(ach.id);
            return `
              <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${ach.icon}</div>
                <div>
                  <div style="display:flex; align-items:center; gap:0.4rem;">
                    <strong style="font-size:0.95rem; color:var(--text-primary);">${ach.title}</strong>
                    ${isUnlocked ? '<span style="color:#34d399; font-size:0.75rem;">✓</span>' : '<span style="color:var(--text-muted); font-size:0.75rem;">🔒</span>'}
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.2rem; line-height:1.4;">
                    ${ach.description}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Reset State Safety Control -->
        <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-color:rgba(239, 68, 68, 0.2);">
          <div>
            <h4 style="color:#f87171; margin:0 0 0.25rem;">Data Management</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">Reset student activity history, quiz scores, and achievements.</p>
          </div>
          <button class="btn btn-danger btn-sm" onclick="window.pcsDashboard.confirmReset()">
            ⚠️ Reset All Progress
          </button>
        </div>
      </div>
    `;
  }

  confirmReset() {
    if (confirm("Are you sure you want to reset all your chemistry progress, favorites, and quiz scores? This action cannot be undone.")) {
      if (window.storageService) {
        localStorage.removeItem(window.storageService.STORAGE_KEY);
        window.storageService.state = window.storageService.getDefaultState();
        window.storageService.saveState();
        if (window.audioService) window.audioService.playWrong();
        this.render();
        if (window.periodicTable) window.periodicTable.renderTable();
      }
    }
  }
}

window.pcsDashboard = new PCSDashboardComponent();
