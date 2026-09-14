/**
 * ELEMENT 118 — PERSONALIZED FLASHBACK ADAPTIVE REVISION COMPONENT
 * Tracks actual student quiz and game mistakes for targeted reinforcement with zero fake weaknesses.
 */

class FlashbackComponent {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('flashback-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  render() {
    if (!this.container) return;

    const queue = window.storageService ? window.storageService.getFlashbackQueue() : [];

    this.container.innerHTML = `
      <div style="max-width:840px; margin:0 auto;">
        <div style="margin-bottom:2rem;">
          <div class="badge badge-amber" style="margin-bottom:0.5rem;">Adaptive Memory System</div>
          <h1 style="font-size:2rem; margin:0;">Personalized Flashback</h1>
          <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
            Intelligent spaced revision dynamically tracking concepts and elements you struggled with during recent quizzes and games.
          </p>
        </div>

        ${queue.length === 0 ? `
          <div class="glass-card" style="text-align:center; padding:3rem 1.5rem;">
            <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
            <h2 style="font-size:1.6rem; margin-bottom:0.5rem;">No Pending Weaknesses!</h2>
            <p style="color:var(--text-secondary); font-size:0.95rem; max-width:480px; margin:0 auto 1.5rem;">
              You have no queued revision items. Take a 10-question quiz or play a chemistry game, and any missed elements will automatically appear here for personalized reinforcement.
            </p>
            <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="window.appRouter.navigate('quiz')">Take a 10-Q Quiz →</button>
              <button class="btn btn-secondary" onclick="window.appRouter.navigate('games')">Play Chemistry Games →</button>
            </div>
          </div>
        ` : `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="font-size:1rem; font-weight:700; color:var(--accent-amber);">
              ⚡ ${queue.length} Element(s) Requiring Reinforcement
            </div>
            <span style="font-size:0.8rem; color:var(--text-muted);">Marking "I Remember" graduates elements to Mastered</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${queue.map(item => {
              const el = ELEMENTS_DATA.find(e => e.atomicNumber === item.atomicNumber);
              if (!el) return '';
              return `
                <div class="flashback-card">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--bg-tertiary); border:2px solid var(--cat-${el.category}); display:flex; align-items:center; justify-content:center; font-size:1.3rem; font-weight:800;">
                        ${el.symbol}
                      </div>
                      <div>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                          <h3 style="font-size:1.3rem; margin:0;">${el.name}</h3>
                          <span class="badge badge-cyan">#${el.atomicNumber}</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--accent-amber); font-weight:600; margin-top:0.15rem;">
                          ⚠️ ${item.reason}
                        </div>
                      </div>
                    </div>

                    <div style="font-size:0.75rem; color:var(--text-muted);">
                      Reviewed: <strong>${item.reviewCount} time(s)</strong>
                    </div>
                  </div>

                  <!-- Quick Fact Snippet -->
                  <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.9rem; color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.5;">
                    💡 <strong>Quick Fact:</strong> ${el.funFacts[0] || el.commonUses[0]}
                  </div>

                  <!-- Revision Action Buttons -->
                  <div style="display:flex; justify-content:flex-end; gap:0.75rem; flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm" onclick="window.flashback.reviewElement(${el.atomicNumber})">
                      📖 Review Details
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="window.flashback.reviewAgain(${el.atomicNumber})">
                      🔄 Keep in Queue
                    </button>
                    <button class="btn btn-success btn-sm" onclick="window.flashback.resolveRemembered(${el.atomicNumber})">
                      ✓ I Remember Now!
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  reviewElement(z) {
    if (window.audioService) window.audioService.playClick();
    if (window.elementModal) window.elementModal.open(z);
  }

  resolveRemembered(z) {
    if (window.audioService) window.audioService.playMatch();
    if (window.storageService) {
      window.storageService.resolveFlashback(z, true);
    }
    this.render();
  }

  reviewAgain(z) {
    if (window.audioService) window.audioService.playClick();
    if (window.storageService) {
      window.storageService.resolveFlashback(z, false);
    }
    this.render();
  }
}

window.flashback = new FlashbackComponent();
