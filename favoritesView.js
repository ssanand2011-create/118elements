/**
 * ELEMENT 118 — FAVORITES COLLECTION COMPONENT
 * Manages the student's saved favorite elements with sorting, quick comparison, and local persistence.
 */

class FavoritesViewComponent {
  constructor() {
    this.container = null;
    this.sortBy = 'atomicNumber'; // 'atomicNumber' | 'name' | 'mass' | 'category'
  }

  init() {
    this.container = document.getElementById('favorites-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  setSort(sortKey) {
    this.sortBy = sortKey;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  getSortedFavorites() {
    if (typeof ELEMENTS_DATA === 'undefined' || !window.storageService) return [];

    const favIds = window.storageService.getFavorites();
    const elements = favIds.map(z => ELEMENTS_DATA.find(el => el.atomicNumber === z)).filter(Boolean);

    return elements.sort((a, b) => {
      if (this.sortBy === 'name') return a.name.localeCompare(b.name);
      if (this.sortBy === 'category') return a.category.localeCompare(b.category);
      if (this.sortBy === 'mass') {
        const massA = parseFloat(a.atomicMass.replace(/[^\d.]/g, '')) || 0;
        const massB = parseFloat(b.atomicMass.replace(/[^\d.]/g, '')) || 0;
        return massA - massB;
      }
      return a.atomicNumber - b.atomicNumber;
    });
  }

  render() {
    if (!this.container) return;

    const favorites = this.getSortedFavorites();

    this.container.innerHTML = `
      <div style="max-width:960px; margin:0 auto;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div>
            <div class="badge badge-rose" style="margin-bottom:0.5rem;">Personal Collection</div>
            <h1 style="font-size:2rem; margin:0;">My Favorite Elements</h1>
            <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
              Your saved chemical elements for quick reference, research, and comparative analysis.
            </p>
          </div>

          ${favorites.length > 0 ? `
            <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
              <!-- Sort Selector -->
              <select class="filter-select" id="fav-sort-select" style="width:auto; padding:0.5rem 0.85rem;" onchange="window.favoritesView.setSort(this.value)">
                <option value="atomicNumber" ${this.sortBy === 'atomicNumber' ? 'selected' : ''}>Sort by Atomic #</option>
                <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Sort by Name (A-Z)</option>
                <option value="mass" ${this.sortBy === 'mass' ? 'selected' : ''}>Sort by Atomic Mass</option>
                <option value="category" ${this.sortBy === 'category' ? 'selected' : ''}>Sort by Category</option>
              </select>

              <button class="btn btn-secondary btn-sm" onclick="window.favoritesView.compareFavorites()">
                ⚖️ Compare Favorites
              </button>
            </div>
          ` : ''}
        </div>

        ${favorites.length === 0 ? `
          <div class="glass-card" style="text-align:center; padding:3.5rem 1.5rem;">
            <div style="font-size:3.5rem; margin-bottom:1rem; color:#ec4899; opacity:0.7;">💖</div>
            <h2 style="font-size:1.6rem; margin-bottom:0.5rem;">No Favorites Saved Yet</h2>
            <p style="color:var(--text-secondary); font-size:0.95rem; max-width:460px; margin:0 auto 1.5rem;">
              Click the ♡ favorite heart icon on any element card or modal to curate your favorite chemical elements here.
            </p>
            <button class="btn btn-primary" onclick="window.appRouter.navigate('table')">
              Explore Periodic Table →
            </button>
          </div>
        ` : `
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.25rem;">
            ${favorites.map(el => `
              <div class="glass-card cat-${el.category}" style="border-left:4px solid var(--cat-${el.category}); padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; gap:1rem;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                      <div style="width:38px; height:38px; border-radius:var(--radius-md); background:var(--bg-tertiary); border:1px solid var(--cat-${el.category}); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem;">
                        ${el.symbol}
                      </div>
                      <div>
                        <h3 style="font-size:1.15rem; margin:0; cursor:pointer;" onclick="window.elementModal.open(${el.atomicNumber})">${el.name}</h3>
                        <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">#${el.atomicNumber} • ${el.atomicMass}</span>
                      </div>
                    </div>
                    <button class="icon-btn btn-sm" style="width:28px; height:28px; color:#ec4899;" onclick="window.favoritesView.removeFav(${el.atomicNumber})" title="Remove from Favorites">
                      ✕
                    </button>
                  </div>

                  <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; margin:0;">
                    ${el.commonUses[0] || el.funFacts[0]}
                  </p>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; pt:0.5rem; border-top:1px solid var(--border-subtle);">
                  <span class="badge" style="background:var(--cat-${el.category}-glow); font-size:0.65rem;">
                    ${el.category.replace(/-/g, ' ')}
                  </span>
                  <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-ghost btn-sm" onclick="window.compareTool.toggleElement(${el.atomicNumber}); window.compareTool.open();" title="Compare">
                      ⚖️ Compare
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.elementModal.open(${el.atomicNumber})">
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  removeFav(z) {
    if (window.storageService) {
      window.storageService.toggleFavorite(z);
      if (window.audioService) window.audioService.playClick();
      this.render();
      if (window.periodicTable) window.periodicTable.renderTable();
    }
  }

  compareFavorites() {
    const favs = window.storageService ? window.storageService.getFavorites() : [];
    if (favs.length === 0) return;

    if (window.compareTool) {
      window.storageService.clearComparison();
      favs.slice(0, 4).forEach(z => window.storageService.toggleComparison(z));
      window.compareTool.open();
    }
  }
}

window.favoritesView = new FavoritesViewComponent();
