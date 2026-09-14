/**
 * ELEMENT 118 — INTERACTIVE PERIODIC TABLE COMPONENT
 * Renders the authoritative 18-column grid with Lanthanide/Actinide series, category colors, and a11y.
 */

class PeriodicTableComponent {
  constructor() {
    this.tableContainer = null;
    this.legendContainer = null;
    this.activeCategoryFilter = null;
    this.focusedAtomicNumber = 1;
    this.elementsMap = new Map();
  }

  init() {
    this.tableContainer = document.getElementById('periodic-table-container');
    this.legendContainer = document.getElementById('periodic-legend-container');

    if (!this.tableContainer || typeof ELEMENTS_DATA === 'undefined') return;

    // Index elements by atomic number for instant lookup
    ELEMENTS_DATA.forEach(el => this.elementsMap.set(el.atomicNumber, el));

    this.renderLegend();
    this.renderTable();
    this.bindKeyboardNavigation();
  }

  renderLegend() {
    if (!this.legendContainer) return;

    const categories = [
      { id: 'alkali-metal', label: 'Alkali metals', color: 'var(--cat-alkali-metal)' },
      { id: 'alkaline-earth', label: 'Alkaline earth metals', color: 'var(--cat-alkaline-earth)' },
      { id: 'transition-metal', label: 'Transition metals', color: 'var(--cat-transition-metal)' },
      { id: 'post-transition', label: 'Post-transition metals', color: 'var(--cat-post-transition)' },
      { id: 'metalloid', label: 'Metalloids', color: 'var(--cat-metalloid)' },
      { id: 'reactive-nonmetal', label: 'Reactive nonmetals', color: 'var(--cat-reactive-nonmetal)' },
      { id: 'noble-gas', label: 'Noble gases', color: 'var(--cat-noble-gas)' },
      { id: 'lanthanide', label: 'Lanthanides', color: 'var(--cat-lanthanide)' },
      { id: 'actinide', label: 'Actinides', color: 'var(--cat-actinide)' },
      { id: 'unknown', label: 'Unknown / Superheavy', color: 'var(--cat-unknown)' }
    ];

    this.legendContainer.innerHTML = `
      <div class="table-legend" role="toolbar" aria-label="Filter Periodic Table by Category">
        <button class="legend-item ${!this.activeCategoryFilter ? 'active' : ''}" data-cat="all">
          <span class="legend-dot" style="background:linear-gradient(135deg, #06b6d4, #8b5cf6);"></span>
          <span>All Categories (118)</span>
        </button>
        ${categories.map(c => `
          <button class="legend-item ${this.activeCategoryFilter === c.id ? 'active' : ''}" data-cat="${c.id}">
            <span class="legend-dot" style="background:${c.color};"></span>
            <span>${c.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    this.legendContainer.querySelectorAll('.legend-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = btn.getAttribute('data-cat');
        if (window.audioService) window.audioService.playClick();
        this.filterByCategory(cat === 'all' ? null : cat);
      });
    });
  }

  filterByCategory(category) {
    this.activeCategoryFilter = category;
    this.renderLegend();
    this.applyFiltering();
  }

  renderTable() {
    if (!this.tableContainer) return;

    let html = `<div class="periodic-grid" role="grid" aria-label="118 Chemical Elements Periodic Table">`;

    // Coordinates mapping for standard IUPAC 18x7 + detached 2 rows
    ELEMENTS_DATA.forEach(el => {
      const z = el.atomicNumber;
      let gridCol, gridRow;

      if (z >= 57 && z <= 71) {
        // Lanthanides (Row 9, Cols 4 to 18)
        gridRow = 9;
        gridCol = z - 57 + 4;
      } else if (z >= 89 && z <= 103) {
        // Actinides (Row 10, Cols 4 to 18)
        gridRow = 10;
        gridCol = z - 89 + 4;
      } else {
        gridRow = el.period;
        gridCol = el.group;
      }

      html += this.buildElementCardHTML(el, gridCol, gridRow);
    });

    // Lanthanides series placeholder indicator in row 6, col 3
    html += `
      <div class="series-placeholder lanthanide" style="grid-column:3; grid-row:6;" title="Lanthanide Series 57-71">
        <span>57-71</span>
        <span style="font-size:0.6rem;">La-Lu</span>
      </div>
    `;

    // Actinides series placeholder indicator in row 7, col 3
    html += `
      <div class="series-placeholder actinide" style="grid-column:3; grid-row:7;" title="Actinide Series 89-103">
        <span>89-103</span>
        <span style="font-size:0.6rem;">Ac-Lr</span>
      </div>
    `;

    // Lanthanide & Actinide row label tags
    html += `
      <div style="grid-column:1/4; grid-row:9; display:flex; align-items:center; justify-content:flex-end; padding-right:1rem; font-size:0.75rem; font-weight:700; color:var(--cat-lanthanide);">
        ★ Lanthanide Series
      </div>
      <div style="grid-column:1/4; grid-row:10; display:flex; align-items:center; justify-content:flex-end; padding-right:1rem; font-size:0.75rem; font-weight:700; color:var(--cat-actinide);">
        ★★ Actinide Series
      </div>
    `;

    html += `</div>`;
    this.tableContainer.innerHTML = html;

    // Attach click events
    this.tableContainer.querySelectorAll('.element-card').forEach(card => {
      card.addEventListener('click', () => {
        const z = parseInt(card.getAttribute('data-z'), 10);
        if (window.audioService) window.audioService.playClick();
        if (window.elementModal) {
          window.elementModal.open(z);
        }
      });
    });
  }

  buildElementCardHTML(el, col, row) {
    const isFav = window.storageService && window.storageService.isFavorite(el.atomicNumber);
    const cleanMass = el.atomicMass.replace(' u', '');

    return `
      <div class="element-card cat-${el.category}" 
           id="elem-card-${el.atomicNumber}"
           data-z="${el.atomicNumber}"
           data-symbol="${el.symbol.toLowerCase()}"
           data-name="${el.name.toLowerCase()}"
           data-cat="${el.category}"
           data-state="${el.state.toLowerCase()}"
           data-group="${el.group}"
           data-period="${el.period}"
           data-block="${el.block}"
           style="grid-column:${col}; grid-row:${row};"
           tabindex="0"
           role="gridcell"
           aria-label="${el.name}, Atomic Number ${el.atomicNumber}, Symbol ${el.symbol}, Category ${el.category}">
        <div class="card-header">
          <span class="card-num">${el.atomicNumber}</span>
          <span class="card-mass-small" title="${el.atomicMass}">${cleanMass}</span>
        </div>
        <div class="card-symbol">${el.symbol}</div>
        <div class="card-name">${el.name}</div>
        ${isFav ? `<div style="position:absolute; bottom:2px; right:4px; font-size:0.6rem; color:#ec4899;">♥</div>` : ''}
      </div>
    `;
  }

  applyFiltering(filterCriteria = {}) {
    // filterCriteria: { query, category, state, group, period, block }
    const cards = this.tableContainer ? this.tableContainer.querySelectorAll('.element-card') : [];
    if (!cards.length) return 0;

    let matchCount = 0;
    const cat = filterCriteria.category || this.activeCategoryFilter;
    const query = (filterCriteria.query || '').trim().toLowerCase();
    const state = filterCriteria.state;
    const group = filterCriteria.group;
    const period = filterCriteria.period;
    const block = filterCriteria.block;

    cards.forEach(card => {
      const z = card.getAttribute('data-z');
      const symbol = card.getAttribute('data-symbol');
      const name = card.getAttribute('data-name');
      const cardCat = card.getAttribute('data-cat');
      const cardState = card.getAttribute('data-state');
      const cardGroup = card.getAttribute('data-group');
      const cardPeriod = card.getAttribute('data-period');
      const cardBlock = card.getAttribute('data-block');

      let matches = true;

      // Category filter
      if (cat && cardCat !== cat) matches = false;

      // State filter
      if (state && cardState !== state.toLowerCase()) matches = false;

      // Group filter
      if (group && cardGroup !== String(group)) matches = false;

      // Period filter
      if (period && cardPeriod !== String(period)) matches = false;

      // Block filter
      if (block && cardBlock !== block.toLowerCase()) matches = false;

      // Search Query
      if (query) {
        const matchZ = z === query;
        const matchSym = symbol === query || symbol.startsWith(query);
        const matchName = name.includes(query);
        if (!matchZ && !matchSym && !matchName) matches = false;
      }

      if (matches) {
        card.classList.remove('dimmed');
        if (query) card.classList.add('highlighted');
        else card.classList.remove('highlighted');
        matchCount++;
      } else {
        card.classList.add('dimmed');
        card.classList.remove('highlighted');
      }
    });

    return matchCount;
  }

  highlightElement(atomicNumber) {
    const card = document.getElementById(`elem-card-${atomicNumber}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      card.classList.add('highlighted');
      setTimeout(() => card.classList.remove('highlighted'), 3000);
    }
  }

  bindKeyboardNavigation() {
    if (!this.tableContainer) return;

    this.tableContainer.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (!active || !active.classList.contains('element-card')) return;

      const currentZ = parseInt(active.getAttribute('data-z'), 10);
      let targetZ = currentZ;

      if (e.key === 'ArrowRight') targetZ = currentZ < 118 ? currentZ + 1 : 1;
      else if (e.key === 'ArrowLeft') targetZ = currentZ > 1 ? currentZ - 1 : 118;
      else if (e.key === 'ArrowDown') targetZ = currentZ + 18 <= 118 ? currentZ + 18 : currentZ;
      else if (e.key === 'ArrowUp') targetZ = currentZ - 18 >= 1 ? currentZ - 18 : currentZ;
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.elementModal) window.elementModal.open(currentZ);
        return;
      }

      if (targetZ !== currentZ) {
        e.preventDefault();
        const targetCard = document.getElementById(`elem-card-${targetZ}`);
        if (targetCard) targetCard.focus();
      }
    });
  }
}

window.periodicTable = new PeriodicTableComponent();
