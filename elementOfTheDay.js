/**
 * ELEMENT 118 — ELEMENT OF THE DAY COMPONENT
 * Automatically spotlights a scientifically verified element based on the calendar day.
 */

class ElementOfTheDayComponent {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('element-of-the-day-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  getDailyElement() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const atomicNumber = (dayOfYear % 118) + 1;
    return ELEMENTS_DATA.find(el => el.atomicNumber === atomicNumber) || ELEMENTS_DATA[0];
  }

  render() {
    if (!this.container) return;

    const el = this.getDailyElement();
    const categoryName = el.category.replace(/-/g, ' ');

    this.container.innerHTML = `
      <div class="spotlight-card" role="region" aria-label="Element of the Day Spotlight">
        <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:650px; z-index:2;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span class="badge badge-amber">🌟 Element of the Day</span>
            <span class="badge" style="background:var(--cat-${el.category}-glow); color:var(--text-primary); border:1px solid var(--cat-${el.category}); font-size:0.7rem;">${categoryName}</span>
          </div>

          <div style="display:flex; align-items:baseline; gap:0.75rem;">
            <h1 style="font-size:2.4rem; font-weight:800; letter-spacing:-0.02em; margin:0;">${el.name}</h1>
            <span style="font-size:1.5rem; font-family:var(--font-mono); color:var(--accent-cyan); font-weight:700;">#${el.atomicNumber}</span>
          </div>

          <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">
            ${el.funFacts[0] || el.commonUses[0]}
          </p>

          <div style="display:flex; align-items:center; gap:1.5rem; margin-top:0.5rem; flex-wrap:wrap;">
            <div style="font-size:0.85rem;">
              <span style="color:var(--text-muted);">Atomic Mass:</span>
              <strong style="color:var(--text-primary); font-family:var(--font-mono);">${el.atomicMass}</strong>
            </div>
            <div style="font-size:0.85rem;">
              <span style="color:var(--text-muted);">Configuration:</span>
              <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${el.electronicConfiguration}</strong>
            </div>
            <div style="font-size:0.85rem;">
              <span style="color:var(--text-muted);">State at STP:</span>
              <strong style="color:var(--text-primary);">${el.state}</strong>
            </div>
          </div>

          <div style="margin-top:0.75rem;">
            <button class="btn btn-primary" id="spotlight-explore-btn">
              Explore ${el.name} Details →
            </button>
          </div>
        </div>

        <!-- Large Floating Symbol Graphic -->
        <div style="width:130px; height:130px; border-radius:var(--radius-xl); background:var(--bg-tertiary); border:3px solid var(--cat-${el.category}); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 30px var(--cat-${el.category}-glow); flex-shrink:0; z-index:2;">
          <span style="font-size:0.85rem; font-family:var(--font-mono); color:var(--text-secondary);">${el.atomicNumber}</span>
          <span style="font-size:3.5rem; font-weight:800; line-height:1; color:var(--text-primary);">${el.symbol}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${el.state}</span>
        </div>
      </div>
    `;

    const exploreBtn = document.getElementById('spotlight-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        if (window.audioService) window.audioService.playClick();
        if (window.elementModal) window.elementModal.open(el.atomicNumber);
      });
    }
  }
}

window.elementOfTheDay = new ElementOfTheDayComponent();
