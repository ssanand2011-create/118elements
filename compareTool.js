/**
 * ELEMENT 118 — ELEMENT COMPARISON MATRIX COMPONENT
 * Side-by-side comparative analysis of 2 to 4 elements with scientific delta visualization.
 */

class CompareToolComponent {
  constructor() {
    this.backdrop = null;
    this.container = null;
  }

  init() {
    this.backdrop = document.getElementById('compare-modal-backdrop');
    this.container = document.getElementById('compare-modal-container');

    if (!this.backdrop) return;

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.backdrop && this.backdrop.classList.contains('open');
  }

  open() {
    this.render();
    if (this.backdrop) {
      this.backdrop.classList.add('open');
      this.backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('open');
      this.backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  toggleElement(atomicNumber) {
    if (window.storageService) {
      window.storageService.toggleComparison(atomicNumber);
      if (this.isOpen()) this.render();
    }
  }

  render() {
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    const list = window.storageService ? window.storageService.getComparisonList() : [];
    const elements = list.map(z => ELEMENTS_DATA.find(el => el.atomicNumber === z)).filter(Boolean);

    this.container.innerHTML = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="font-size:1.5rem;">⚖️</div>
          <div>
            <h2 style="font-size:1.4rem; margin:0;">Element Comparison Matrix</h2>
            <div style="font-size:0.8rem; color:var(--text-secondary);">Select 2 to 4 elements for scientific side-by-side property comparison</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" id="compare-clear-btn" ${elements.length === 0 ? 'disabled' : ''}>Clear All</button>
          <button class="icon-btn" id="compare-close-btn" aria-label="Close">✕</button>
        </div>
      </div>

      <div class="modal-body">
        <!-- Element Selector Dropdown / Add Bar -->
        <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <label style="font-size:0.875rem; font-weight:700;" for="compare-add-select">Add Element to Compare:</label>
          <select id="compare-add-select" class="filter-select" style="max-width:280px;">
            <option value="">-- Choose an Element (1–118) --</option>
            ${ELEMENTS_DATA.map(el => `
              <option value="${el.atomicNumber}" ${list.includes(el.atomicNumber) ? 'disabled' : ''}>
                ${el.atomicNumber}. ${el.name} (${el.symbol})
              </option>
            `).join('')}
          </select>
          <span style="font-size:0.8rem; color:var(--text-muted);">${elements.length} / 4 elements selected</span>
        </div>

        ${elements.length === 0 ? `
          <div style="text-align:center; padding:3rem 1rem; color:var(--text-secondary);">
            <div style="font-size:3rem; margin-bottom:1rem; opacity:0.6;">⚖️</div>
            <h3 style="margin-bottom:0.5rem;">No Elements in Comparison Matrix</h3>
            <p style="font-size:0.875rem; max-width:400px; margin:0 auto 1.5rem;">Select elements from the dropdown above or click the ⚖️ button on any element card to compare.</p>
            <div style="display:flex; justify-content:center; gap:0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="window.compareTool.loadPresets([1, 8])">Compare Hydrogen & Oxygen</button>
              <button class="btn btn-secondary btn-sm" onclick="window.compareTool.loadPresets([3, 11, 19])">Compare Alkali Metals</button>
            </div>
          </div>
        ` : `
          <div class="compare-table-wrapper">
            <table class="compare-table">
              <thead>
                <tr>
                  <th style="width:200px;">Property</th>
                  ${elements.map(el => `
                    <th style="min-width:180px;">
                      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="cursor:pointer;" onclick="window.compareTool.openElementDetails(${el.atomicNumber})">
                          <span class="badge" style="background:var(--cat-${el.category}-glow); color:var(--text-primary); border:1px solid var(--cat-${el.category}); font-size:0.7rem;">${el.symbol}</span>
                          <strong style="display:block; margin-top:0.25rem; font-size:1rem; color:var(--text-primary);">${el.name}</strong>
                          <span style="font-size:0.75rem; color:var(--text-secondary);">#${el.atomicNumber}</span>
                        </div>
                        <button class="icon-btn btn-sm" style="width:26px; height:26px;" onclick="window.compareTool.removeElement(${el.atomicNumber})" title="Remove">✕</button>
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Category</strong></td>
                  ${elements.map(el => `<td><span class="badge badge-cyan" style="font-size:0.7rem;">${el.category.replace(/-/g, ' ')}</span></td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Standard State (STP)</strong></td>
                  ${elements.map(el => `<td>${el.state}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Atomic Mass</strong></td>
                  ${elements.map(el => `<td style="font-family:var(--font-mono); font-weight:700;">${el.atomicMass}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Group, Period, Block</strong></td>
                  ${elements.map(el => `<td>Group ${el.group}, Period ${el.period} (${el.block}-block)</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Electron Configuration</strong></td>
                  ${elements.map(el => `<td style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-cyan);">${el.electronicConfiguration}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Protons / Electrons</strong></td>
                  ${elements.map(el => `<td style="font-family:var(--font-mono);">${el.protons}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Neutrons</strong></td>
                  ${elements.map(el => `<td style="font-family:var(--font-mono);">${el.neutrons}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Electronegativity (Pauling)</strong></td>
                  ${elements.map(el => {
                    const val = typeof el.electronegativity === 'number' ? el.electronegativity : 'Data not available';
                    return `<td><strong style="color:${typeof el.electronegativity === 'number' ? 'var(--accent-emerald)' : 'var(--text-muted)'};">${val}</strong></td>`;
                  }).join('')}
                </tr>
                <tr>
                  <td><strong>Melting Point</strong></td>
                  ${elements.map(el => `<td style="font-size:0.8rem;">${el.meltingPoint}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Boiling Point</strong></td>
                  ${elements.map(el => `<td style="font-size:0.8rem;">${el.boilingPoint}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Density</strong></td>
                  ${elements.map(el => `<td style="font-size:0.8rem;">${el.density}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Common Oxidation States</strong></td>
                  ${elements.map(el => `<td style="font-family:var(--font-mono);">${el.oxidationStates}</td>`).join('')}
                </tr>
                <tr>
                  <td><strong>Discovery</strong></td>
                  ${elements.map(el => `<td style="font-size:0.8rem;">${el.discoveryYear} (${el.discoveredBy})</td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = document.getElementById('compare-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const clearBtn = document.getElementById('compare-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (window.storageService) window.storageService.clearComparison();
        if (window.audioService) window.audioService.playClick();
        this.render();
      });
    }

    const select = document.getElementById('compare-add-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const z = parseInt(e.target.value, 10);
        if (z) {
          if (window.audioService) window.audioService.playClick();
          this.toggleElement(z);
        }
      });
    }
  }

  loadPresets(atomicNumbers) {
    if (window.storageService) {
      window.storageService.clearComparison();
      atomicNumbers.forEach(z => window.storageService.toggleComparison(z));
      if (window.audioService) window.audioService.playClick();
      this.render();
    }
  }

  removeElement(z) {
    if (window.storageService) {
      window.storageService.toggleComparison(z);
      if (window.audioService) window.audioService.playClick();
      this.render();
    }
  }

  openElementDetails(z) {
    this.close();
    if (window.elementModal) window.elementModal.open(z);
  }
}

window.compareTool = new CompareToolComponent();
