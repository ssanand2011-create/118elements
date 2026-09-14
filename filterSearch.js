/**
 * ELEMENT 118 — GLOBAL SEARCH & MULTI-FILTER COMPONENT
 * Real-time instant search by name/symbol/atomic# + multi-attribute filter engine.
 */

class FilterSearchComponent {
  constructor() {
    this.container = null;
    this.currentFilters = {
      query: '',
      category: '',
      state: '',
      group: '',
      period: '',
      block: ''
    };
  }

  init() {
    this.container = document.getElementById('filter-search-container');
    if (!this.container) return;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="filter-panel" role="search" aria-label="Search and Filter Elements">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" 
                     id="global-search-input" 
                     class="search-input" 
                     placeholder="Search by name, symbol, or atomic number (e.g. Oxygen, O, 8)..." 
                     aria-label="Search Elements"
                     value="${this.escapeHTML(this.currentFilters.query)}">
              <button class="search-clear-btn ${this.currentFilters.query ? 'visible' : ''}" id="search-clear-btn" aria-label="Clear Search">✕</button>
            </div>
          </div>

          <!-- Quick Controls & Result Counter -->
          <div style="display:flex; align-items:center; gap:1rem;">
            <div id="filter-result-count" style="font-size:0.875rem; font-weight:700; color:var(--accent-cyan); font-family:var(--font-mono);">
              Showing 118 of 118 elements
            </div>
            <button class="btn btn-secondary btn-sm" id="filter-reset-btn">↺ Reset All</button>
          </div>
        </div>

        <!-- Filter Dropdowns Grid -->
        <div class="filter-grid">
          <!-- Category -->
          <div class="filter-group">
            <label class="filter-label" for="filter-category">Category</label>
            <select class="filter-select" id="filter-category">
              <option value="">All Categories</option>
              <option value="alkali-metal" ${this.currentFilters.category === 'alkali-metal' ? 'selected' : ''}>Alkali Metals</option>
              <option value="alkaline-earth" ${this.currentFilters.category === 'alkaline-earth' ? 'selected' : ''}>Alkaline Earth Metals</option>
              <option value="transition-metal" ${this.currentFilters.category === 'transition-metal' ? 'selected' : ''}>Transition Metals</option>
              <option value="post-transition" ${this.currentFilters.category === 'post-transition' ? 'selected' : ''}>Post-Transition Metals</option>
              <option value="metalloid" ${this.currentFilters.category === 'metalloid' ? 'selected' : ''}>Metalloids</option>
              <option value="reactive-nonmetal" ${this.currentFilters.category === 'reactive-nonmetal' ? 'selected' : ''}>Reactive Nonmetals</option>
              <option value="noble-gas" ${this.currentFilters.category === 'noble-gas' ? 'selected' : ''}>Noble Gases</option>
              <option value="lanthanide" ${this.currentFilters.category === 'lanthanide' ? 'selected' : ''}>Lanthanides</option>
              <option value="actinide" ${this.currentFilters.category === 'actinide' ? 'selected' : ''}>Actinides</option>
              <option value="unknown" ${this.currentFilters.category === 'unknown' ? 'selected' : ''}>Unknown / Superheavy</option>
            </select>
          </div>

          <!-- State of Matter -->
          <div class="filter-group">
            <label class="filter-label" for="filter-state">State at STP</label>
            <select class="filter-select" id="filter-state">
              <option value="">All States</option>
              <option value="Gas" ${this.currentFilters.state === 'Gas' ? 'selected' : ''}>Gas</option>
              <option value="Liquid" ${this.currentFilters.state === 'Liquid' ? 'selected' : ''}>Liquid</option>
              <option value="Solid" ${this.currentFilters.state === 'Solid' ? 'selected' : ''}>Solid</option>
              <option value="Unknown" ${this.currentFilters.state === 'Unknown' ? 'selected' : ''}>Unknown / Synthetic</option>
            </select>
          </div>

          <!-- Group -->
          <div class="filter-group">
            <label class="filter-label" for="filter-group">Group (1–18)</label>
            <select class="filter-select" id="filter-group">
              <option value="">All Groups</option>
              ${Array.from({ length: 18 }, (_, i) => i + 1).map(g => `
                <option value="${g}" ${this.currentFilters.group === String(g) ? 'selected' : ''}>Group ${g}</option>
              `).join('')}
              <option value="f-block" ${this.currentFilters.group === 'f-block' ? 'selected' : ''}>f-block (Lanthanides/Actinides)</option>
            </select>
          </div>

          <!-- Period -->
          <div class="filter-group">
            <label class="filter-label" for="filter-period">Period (1–7)</label>
            <select class="filter-select" id="filter-period">
              <option value="">All Periods</option>
              ${Array.from({ length: 7 }, (_, i) => i + 1).map(p => `
                <option value="${p}" ${this.currentFilters.period === String(p) ? 'selected' : ''}>Period ${p}</option>
              `).join('')}
            </select>
          </div>

          <!-- Block -->
          <div class="filter-group">
            <label class="filter-label" for="filter-block">Electron Block</label>
            <select class="filter-select" id="filter-block">
              <option value="">All Blocks</option>
              <option value="s" ${this.currentFilters.block === 's' ? 'selected' : ''}>s-block (Alkali & Alkaline)</option>
              <option value="p" ${this.currentFilters.block === 'p' ? 'selected' : ''}>p-block (Nonmetals, Halogens, Noble)</option>
              <option value="d" ${this.currentFilters.block === 'd' ? 'selected' : ''}>d-block (Transition Metals)</option>
              <option value="f" ${this.currentFilters.block === 'f' ? 'selected' : ''}>f-block (Lanthanides & Actinides)</option>
            </select>
          </div>
        </div>

        <!-- Active Filter Chips Bar -->
        <div class="filter-chips" id="active-filter-chips" style="display:${this.hasActiveFilters() ? 'flex' : 'none'};">
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Active Filters:</span>
          ${this.renderChipsHTML()}
        </div>
      </div>
    `;
  }

  renderChipsHTML() {
    const chips = [];
    if (this.currentFilters.query) {
      chips.push(`<span class="filter-chip">Search: "${this.escapeHTML(this.currentFilters.query)}" <button class="filter-chip-remove" data-clear="query">×</button></span>`);
    }
    if (this.currentFilters.category) {
      chips.push(`<span class="filter-chip">Category: ${this.currentFilters.category} <button class="filter-chip-remove" data-clear="category">×</button></span>`);
    }
    if (this.currentFilters.state) {
      chips.push(`<span class="filter-chip">State: ${this.currentFilters.state} <button class="filter-chip-remove" data-clear="state">×</button></span>`);
    }
    if (this.currentFilters.group) {
      chips.push(`<span class="filter-chip">Group: ${this.currentFilters.group} <button class="filter-chip-remove" data-clear="group">×</button></span>`);
    }
    if (this.currentFilters.period) {
      chips.push(`<span class="filter-chip">Period: ${this.currentFilters.period} <button class="filter-chip-remove" data-clear="period">×</button></span>`);
    }
    if (this.currentFilters.block) {
      chips.push(`<span class="filter-chip">Block: ${this.currentFilters.block}-block <button class="filter-chip-remove" data-clear="block">×</button></span>`);
    }
    return chips.join('');
  }

  hasActiveFilters() {
    return Object.values(this.currentFilters).some(v => v !== '');
  }

  bindEvents() {
    const searchInput = document.getElementById('global-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resetBtn = document.getElementById('filter-reset-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.query = e.target.value;
        if (clearBtn) {
          clearBtn.classList.toggle('visible', !!e.target.value);
        }
        this.apply();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.currentFilters.query = '';
        if (searchInput) searchInput.value = '';
        clearBtn.classList.remove('visible');
        this.apply();
      });
    }

    const dropdowns = ['category', 'state', 'group', 'period', 'block'];
    dropdowns.forEach(field => {
      const select = document.getElementById(`filter-${field}`);
      if (select) {
        select.addEventListener('change', (e) => {
          this.currentFilters[field] = e.target.value;
          this.apply();
        });
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.audioService) window.audioService.playClick();
        this.reset();
      });
    }

    // Chip remove buttons
    const chipsContainer = document.getElementById('active-filter-chips');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-chip-remove')) {
          const field = e.target.getAttribute('data-clear');
          if (field) {
            this.currentFilters[field] = '';
            if (field === 'query' && searchInput) {
              searchInput.value = '';
              if (clearBtn) clearBtn.classList.remove('visible');
            }
            const select = document.getElementById(`filter-${field}`);
            if (select) select.value = '';
            this.apply();
          }
        }
      });
    }
  }

  apply() {
    if (window.periodicTable) {
      const matchCount = window.periodicTable.applyFiltering(this.currentFilters);
      const countEl = document.getElementById('filter-result-count');
      if (countEl) {
        if (matchCount === 0) {
          countEl.innerHTML = `<span style="color:#ef4444;">No matching elements found</span>`;
        } else {
          countEl.textContent = `Showing ${matchCount} of 118 elements`;
        }
      }
    }

    // Update chips
    const chipsContainer = document.getElementById('active-filter-chips');
    if (chipsContainer) {
      chipsContainer.style.display = this.hasActiveFilters() ? 'flex' : 'none';
      chipsContainer.innerHTML = `
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Active Filters:</span>
        ${this.renderChipsHTML()}
      `;
    }
  }

  reset() {
    this.currentFilters = {
      query: '',
      category: '',
      state: '',
      group: '',
      period: '',
      block: ''
    };
    this.render();
    this.bindEvents();
    this.apply();
  }

  setSearchQuery(q) {
    this.currentFilters.query = q;
    const input = document.getElementById('global-search-input');
    if (input) input.value = q;
    this.apply();
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
}

window.filterSearch = new FilterSearchComponent();
