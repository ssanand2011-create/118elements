/**
 * ELEMENT 118 — VERIFIED FUN FACTS COMPONENT
 * Interactive explorer featuring scientifically verified trivia and historical facts across all 118 elements.
 */

class FunFactsComponent {
  constructor() {
    this.container = null;
    this.currentIndex = 0;
  }

  init() {
    this.container = document.getElementById('fun-facts-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  nextFact() {
    if (typeof ELEMENTS_DATA === 'undefined') return;
    this.currentIndex = (this.currentIndex + 1) % ELEMENTS_DATA.length;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  prevFact() {
    if (typeof ELEMENTS_DATA === 'undefined') return;
    this.currentIndex = (this.currentIndex - 1 + ELEMENTS_DATA.length) % ELEMENTS_DATA.length;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  randomFact() {
    if (typeof ELEMENTS_DATA === 'undefined') return;
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * ELEMENTS_DATA.length);
    } while (nextIdx === this.currentIndex && ELEMENTS_DATA.length > 1);

    this.currentIndex = nextIdx;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  render() {
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    const el = ELEMENTS_DATA[this.currentIndex];
    const isFav = window.storageService && window.storageService.isFavorite(el.atomicNumber);
    const categoryName = el.category.replace(/-/g, ' ');
    const fact = el.funFacts[0] || el.commonUses[0];

    this.container.innerHTML = `
      <div style="max-width:820px; margin:0 auto;">
        <div style="margin-bottom:2rem; text-align:center;">
          <div class="badge badge-purple" style="margin-bottom:0.5rem;">Verified Chemistry Trivia</div>
          <h1 style="font-size:2rem; margin:0;">Scientific Fun Facts</h1>
          <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
            Discover intriguing, verified scientific insights and historical trivia about all 118 chemical elements.
          </p>
        </div>

        <!-- Fun Fact Spotlight Card -->
        <div class="glass-card" style="padding:2.5rem; border-color:var(--border-bright); position:relative; overflow:hidden; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
              <div style="width:64px; height:64px; border-radius:var(--radius-lg); background:var(--bg-tertiary); border:2px solid var(--cat-${el.category}); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 20px var(--cat-${el.category}-glow);">
                <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-muted);">${el.atomicNumber}</span>
                <span style="font-size:1.8rem; font-weight:800; line-height:1; color:var(--text-primary);">${el.symbol}</span>
              </div>
              <div>
                <h2 style="font-size:1.6rem; margin:0;">${el.name}</h2>
                <div style="display:flex; gap:0.5rem; margin-top:0.25rem;">
                  <span class="badge badge-cyan">#${el.atomicNumber}</span>
                  <span class="badge" style="background:var(--cat-${el.category}-glow);">${categoryName}</span>
                </div>
              </div>
            </div>

            <div style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono);">
              Fact ${this.currentIndex + 1} of 118
            </div>
          </div>

          <!-- Fact Text Callout -->
          <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-lg); border-left:4px solid var(--accent-cyan); margin-bottom:1.5rem;">
            <p style="font-size:1.2rem; line-height:1.6; color:var(--text-primary); margin:0;">
              "${fact}"
            </p>
          </div>

          <!-- Secondary Trivia & Discovery -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; font-size:0.85rem; color:var(--text-secondary);">
            <div>
              <strong>Discovery:</strong> ${el.discoveryYear} (${el.discoveredBy})
            </div>
            <div>
              <strong>Standard State:</strong> ${el.state} (${el.atomicMass})
            </div>
          </div>
        </div>

        <!-- Navigation Controls Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="window.funFacts.prevFact()">← Previous</button>
            <button class="btn btn-secondary" onclick="window.funFacts.nextFact()">Next Fact →</button>
            <button class="btn btn-secondary" onclick="window.funFacts.randomFact()">🎲 Random Fact</button>
          </div>

          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-ghost" id="facts-fav-btn" onclick="window.funFacts.toggleFav(${el.atomicNumber})">
              ${isFav ? '♥ Favorited' : '♡ Add to Favorites'}
            </button>
            <button class="btn btn-primary" onclick="window.elementModal.open(${el.atomicNumber})">
              Explore ${el.name} →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  toggleFav(z) {
    if (window.storageService) {
      window.storageService.toggleFavorite(z);
      if (window.audioService) window.audioService.playMatch();
      this.render();
    }
  }
}

window.funFacts = new FunFactsComponent();
