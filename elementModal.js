/**
 * ELEMENT 118 — ELEMENT DEEP-DIVE DETAILS MODAL COMPONENT
 * Comprehensive modal featuring interactive animated SVG Bohr orbitals, verified properties, and action controls.
 */

class ElementModalComponent {
  constructor() {
    this.backdrop = null;
    this.container = null;
    this.currentZ = 1;
    this.activeTab = 'overview';
  }

  init() {
    this.backdrop = document.getElementById('element-modal-backdrop');
    this.container = document.getElementById('element-modal-container');

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

  open(atomicNumber) {
    const z = parseInt(atomicNumber, 10);
    if (!z || z < 1 || z > 118) return;

    this.currentZ = z;
    if (window.storageService) {
      window.storageService.markElementExplored(z);
    }

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

  setTab(tabName) {
    this.activeTab = tabName;
    const tabBtns = this.container.querySelectorAll('.tab-btn');
    const tabContents = this.container.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    tabContents.forEach(content => {
      content.classList.toggle('active', content.getAttribute('data-content') === tabName);
    });
  }

  render() {
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    const el = ELEMENTS_DATA.find(item => item.atomicNumber === this.currentZ);
    if (!el) return;

    const isFav = window.storageService && window.storageService.isFavorite(el.atomicNumber);
    const categoryName = el.category.replace(/-/g, ' ');

    this.container.innerHTML = `
      <!-- Modal Header -->
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:1rem;">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--bg-tertiary); border:2px solid var(--cat-${el.category}); display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:800; color:var(--text-primary);">
            ${el.symbol}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <h2 style="font-size:1.5rem; margin:0;">${el.name}</h2>
              <span class="badge badge-cyan">#${el.atomicNumber}</span>
              <span class="badge" style="background:var(--cat-${el.category}-glow); color:var(--text-primary); border:1px solid var(--cat-${el.category}); font-size:0.7rem;">${categoryName}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">
              Atomic Mass: <strong style="color:var(--text-primary); font-family:var(--font-mono);">${el.atomicMass}</strong> • Period ${el.period}, Group ${el.group}
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="icon-btn" id="modal-fav-btn" title="Toggle Favorite" style="color:${isFav ? '#ec4899' : 'var(--text-secondary)'};">
            ${isFav ? '♥' : '♡'}
          </button>
          <button class="icon-btn" id="modal-compare-btn" title="Compare this element">
            ⚖️
          </button>
          <button class="icon-btn" id="modal-close-btn" title="Close modal" aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Top Section: Interactive Bohr Model & Fast Stats -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; align-items:center;">
          <!-- Animated Bohr SVG Visualizer -->
          <div class="bohr-visualizer">
            ${this.generateBohrModelSVG(el)}
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.75rem; font-family:var(--font-mono); text-align:center;">
              Electron Shells: <strong>${el.electronShells.join(' • ')}</strong>
            </div>
          </div>

          <!-- Quick Atomic Structure Specs -->
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="glass-card" style="padding:1rem; display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; text-align:center;">
              <div>
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Protons</div>
                <div style="font-size:1.25rem; font-weight:800; font-family:var(--font-mono); color:#38bdf8;">${el.protons}</div>
              </div>
              <div>
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Neutrons</div>
                <div style="font-size:1.25rem; font-weight:800; font-family:var(--font-mono); color:#c084fc;">${el.neutrons}</div>
              </div>
              <div>
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Electrons</div>
                <div style="font-size:1.25rem; font-weight:800; font-family:var(--font-mono); color:#34d399;">${el.electrons}</div>
              </div>
            </div>

            <div class="glass-card" style="padding:1rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem;">
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-secondary);">Electron Configuration:</span>
                <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">${el.electronicConfiguration}</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-secondary);">Valence Electrons:</span>
                <span style="font-weight:700;">${el.valenceElectrons}</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-secondary);">Block:</span>
                <span style="font-weight:700; text-transform:uppercase;">${el.block}-block</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-secondary);">Room Temp Phase:</span>
                <span style="font-weight:700;">${el.phaseAtRoomTemperature}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabbed Detailed Navigation -->
        <div>
          <div class="tab-nav">
            <button class="tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📊 Physical Properties</button>
            <button class="tab-btn ${this.activeTab === 'history' ? 'active' : ''}" data-tab="history">📜 History & Discovery</button>
            <button class="tab-btn ${this.activeTab === 'uses' ? 'active' : ''}" data-tab="uses">⚙️ Applications & Uses</button>
            <button class="tab-btn ${this.activeTab === 'facts' ? 'active' : ''}" data-tab="facts">💡 Verified Fun Facts</button>
          </div>

          <!-- Tab 1: Physical Properties -->
          <div class="tab-content ${this.activeTab === 'overview' ? 'active' : ''}" data-content="overview" style="margin-top:1rem;">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
              <div class="glass-card" style="padding:1rem;">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Melting Point</div>
                <div style="font-size:1.05rem; font-weight:700; font-family:var(--font-mono); margin-top:0.25rem;">${el.meltingPoint}</div>
              </div>
              <div class="glass-card" style="padding:1rem;">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Boiling Point</div>
                <div style="font-size:1.05rem; font-weight:700; font-family:var(--font-mono); margin-top:0.25rem;">${el.boilingPoint}</div>
              </div>
              <div class="glass-card" style="padding:1rem;">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Density</div>
                <div style="font-size:1.05rem; font-weight:700; font-family:var(--font-mono); margin-top:0.25rem;">${el.density}</div>
              </div>
              <div class="glass-card" style="padding:1rem;">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Electronegativity (Pauling)</div>
                <div style="font-size:1.05rem; font-weight:700; font-family:var(--font-mono); margin-top:0.25rem;">${el.electronegativity}</div>
              </div>
              <div class="glass-card" style="padding:1rem; grid-column:1/-1;">
                <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Common Oxidation States</div>
                <div style="font-size:1.05rem; font-weight:700; font-family:var(--font-mono); margin-top:0.25rem; color:var(--accent-cyan);">${el.oxidationStates}</div>
              </div>
            </div>
          </div>

          <!-- Tab 2: History -->
          <div class="tab-content ${this.activeTab === 'history' ? 'active' : ''}" data-content="history" style="margin-top:1rem;">
            <div class="glass-card" style="padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                <span style="color:var(--text-secondary);">Discovery Year:</span>
                <span style="font-weight:700; font-family:var(--font-mono); color:var(--accent-amber);">${el.discoveryYear}</span>
              </div>
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                <span style="color:var(--text-secondary);">Discovered By:</span>
                <span style="font-weight:700; text-align:right;">${el.discoveredBy}</span>
              </div>
              <div style="margin-top:0.5rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle); font-size:0.875rem; color:var(--text-secondary);">
                <strong>Scientific Reference:</strong> ${el.dataSource}. ${el.dataNotes || ''}
              </div>
            </div>
          </div>

          <!-- Tab 3: Applications -->
          <div class="tab-content ${this.activeTab === 'uses' ? 'active' : ''}" data-content="uses" style="margin-top:1rem;">
            <div class="glass-card" style="padding:1.25rem;">
              <h4 style="font-size:0.9rem; margin-bottom:0.75rem; color:var(--accent-cyan); text-transform:uppercase;">Primary Industrial & Scientific Applications:</h4>
              <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem;">
                ${el.commonUses.map(use => `<li>${use}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Tab 4: Fun Facts -->
          <div class="tab-content ${this.activeTab === 'facts' ? 'active' : ''}" data-content="facts" style="margin-top:1rem;">
            <div class="glass-card" style="padding:1.25rem;">
              <h4 style="font-size:0.9rem; margin-bottom:0.75rem; color:var(--accent-purple); text-transform:uppercase;">Scientifically Verified Insights:</h4>
              <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem;">
                ${el.funFacts.map(fact => `<li>${fact}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer Action Buttons -->
      <div class="modal-footer">
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" id="modal-prev-btn">← Previous (${el.atomicNumber > 1 ? el.atomicNumber - 1 : 118})</button>
          <button class="btn btn-secondary btn-sm" id="modal-next-btn">Next (${el.atomicNumber < 118 ? el.atomicNumber + 1 : 1}) →</button>
          <button class="btn btn-secondary btn-sm" id="modal-random-btn">🎲 Random</button>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" id="modal-quiz-btn">📝 Quiz this Element</button>
          <button class="btn btn-accent btn-sm" id="modal-learn-btn">📚 Learn More</button>
        </div>
      </div>
    `;

    this.bindEvents(el);
  }

  generateBohrModelSVG(el) {
    const shells = el.electronShells;
    const maxRadius = 100;
    const numShells = shells.length;
    const radiusStep = maxRadius / (numShells + 1);

    let orbitsSVG = '';
    let electronsSVG = '';

    shells.forEach((electronCount, shellIdx) => {
      const radius = 25 + (shellIdx + 1) * radiusStep;
      orbitsSVG += `<circle cx="120" cy="120" r="${radius}" class="bohr-orbit" />`;

      // Distribute electrons along the circle
      for (let i = 0; i < electronCount; i++) {
        const angle = (2 * Math.PI * i) / electronCount;
        const x = 120 + radius * Math.cos(angle);
        const y = 120 + radius * Math.sin(angle);
        electronsSVG += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" class="bohr-electron" />`;
      }
    });

    return `
      <svg class="bohr-svg" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="nucleusGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#8b5cf6" />
          </radialGradient>
        </defs>
        ${orbitsSVG}
        <circle cx="120" cy="120" r="18" class="bohr-nucleus" />
        <text x="120" y="124" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="800" font-family="sans-serif">${el.symbol}</text>
        ${electronsSVG}
      </svg>
    `;
  }

  bindEvents(el) {
    // Close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Tabs
    const tabBtns = this.container.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.audioService) window.audioService.playClick();
        this.setTab(btn.getAttribute('data-tab'));
      });
    });

    // Favorite Button
    const favBtn = document.getElementById('modal-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (window.storageService) {
          const isNowFav = window.storageService.toggleFavorite(el.atomicNumber);
          if (window.audioService) window.audioService.playMatch();
          favBtn.innerHTML = isNowFav ? '♥' : '♡';
          favBtn.style.color = isNowFav ? '#ec4899' : 'var(--text-secondary)';
          // Refresh table favorite markers
          if (window.periodicTable) window.periodicTable.renderTable();
        }
      });
    }

    // Compare Button
    const compareBtn = document.getElementById('modal-compare-btn');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        if (window.compareTool) {
          window.compareTool.toggleElement(el.atomicNumber);
          window.compareTool.open();
        }
      });
    }

    // Previous & Next Buttons
    const prevBtn = document.getElementById('modal-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prevZ = el.atomicNumber > 1 ? el.atomicNumber - 1 : 118;
        if (window.audioService) window.audioService.playClick();
        this.open(prevZ);
      });
    }

    const nextBtn = document.getElementById('modal-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextZ = el.atomicNumber < 118 ? el.atomicNumber + 1 : 1;
        if (window.audioService) window.audioService.playClick();
        this.open(nextZ);
      });
    }

    // Random Button
    const randomBtn = document.getElementById('modal-random-btn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        let randZ;
        do {
          randZ = Math.floor(Math.random() * 118) + 1;
        } while (randZ === el.atomicNumber && 118 > 1);
        if (window.audioService) window.audioService.playClick();
        this.open(randZ);
      });
    }

    // Quiz Button
    const quizBtn = document.getElementById('modal-quiz-btn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        this.close();
        if (window.appRouter) {
          window.appRouter.navigate('quiz');
          if (window.quizEngine) window.quizEngine.startQuiz('medium', el.atomicNumber);
        }
      });
    }

    // Learn Button
    const learnBtn = document.getElementById('modal-learn-btn');
    if (learnBtn) {
      learnBtn.addEventListener('click', () => {
        this.close();
        if (window.appRouter) {
          window.appRouter.navigate('learn');
        }
      });
    }
  }
}

window.elementModal = new ElementModalComponent();
