/**
 * ELEMENT 118 — RANDOM ELEMENTS GENERATOR COMPONENT
 * Generates unique non-repeating random batches of 1, 5, or 10 elements with interactive spotlights.
 */

class RandomElementsComponent {
  constructor() {
    this.gridContainer = null;
  }

  init() {
    this.gridContainer = document.getElementById('home-random-elements-grid');

    const btn1 = document.getElementById('home-random-1-btn');
    const btn5 = document.getElementById('home-random-5-btn');
    const btn10 = document.getElementById('home-random-10-btn');

    if (btn1) btn1.addEventListener('click', () => this.generate(1));
    if (btn5) btn5.addEventListener('click', () => this.generate(5));
    if (btn10) btn10.addEventListener('click', () => this.generate(10));
  }

  getRandomUniqueElements(count) {
    if (typeof ELEMENTS_DATA === 'undefined') return [];
    const pool = [...ELEMENTS_DATA];
    const results = [];
    const n = Math.min(count, pool.length);

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      results.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return results;
  }

  generate(count) {
    if (window.audioService) window.audioService.playClick();
    const elements = this.getRandomUniqueElements(count);
    if (!elements.length) return;

    if (count === 1) {
      const el = elements[0];
      if (window.elementModal) {
        window.elementModal.open(el.atomicNumber);
      }
      if (window.periodicTable) {
        window.periodicTable.highlightElement(el.atomicNumber);
      }
      return;
    }

    if (!this.gridContainer) return;

    this.gridContainer.innerHTML = `
      <div class="glass-card" style="margin-top:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <div>
            <span class="badge badge-purple" style="margin-bottom:0.4rem;">Random Batch</span>
            <h3 style="font-size:1.2rem; margin:0;">${count} Random Chemical Elements</h3>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('home-random-elements-grid').innerHTML=''">✕ Close</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem;">
          ${elements.map(el => `
            <div class="element-card cat-${el.category}" 
                 style="min-height:110px; cursor:pointer;" 
                 onclick="window.elementModal.open(${el.atomicNumber})">
              <div class="card-header">
                <span class="card-num">#${el.atomicNumber}</span>
                <span class="badge" style="font-size:0.6rem; padding:0.1rem 0.4rem;">${el.category.replace(/-/g, ' ')}</span>
              </div>
              <div class="card-symbol" style="font-size:2rem; margin:0.25rem 0;">${el.symbol}</div>
              <div class="card-name" style="font-weight:700; font-size:0.85rem;">${el.name}</div>
              <div style="font-size:0.65rem; color:var(--text-muted); text-align:center; margin-top:0.25rem;">${el.state} • ${el.atomicMass}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.gridContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

window.randomElements = new RandomElementsComponent();
