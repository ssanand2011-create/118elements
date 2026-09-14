/**
 * ELEMENT 118 — CHEMISTRY GAME ZONE ORCHESTRATOR
 * Unified hub managing game selection and the 18-Element Focused vs. Full 118 Mode toggle.
 */

class GameZoneComponent {
  constructor() {
    this.container = null;
    this.currentGame = 'symbol_match'; // 'symbol_match' | 'atomic_number' | 'memory'
    this.mode = 'core18'; // 'core18' | 'full118'
  }

  init() {
    this.container = document.getElementById('game-zone-container');
    if (!this.container) return;

    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    if (window.audioService) window.audioService.playClick();
    if (window.symbolMatchGame) window.symbolMatchGame.setMode(mode);
    if (window.atomicNumberGame) window.atomicNumberGame.setMode(mode);
    this.render();
  }

  selectGame(gameKey) {
    this.currentGame = gameKey;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <!-- Header & Mode Switcher -->
        <div class="game-hub-header">
          <div>
            <div class="badge badge-cyan" style="margin-bottom:0.4rem;">Interactive Chemistry Arcade</div>
            <h1 style="font-size:2rem; margin:0;">Chemistry Game Zone</h1>
          </div>

          <!-- 18-Element vs 118 Full Mode Toggle -->
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary);">Dataset Pool:</span>
            <div class="game-mode-switch">
              <button class="game-mode-btn ${this.mode === 'core18' ? 'active' : ''}" onclick="window.gameZone.setMode('core18')">
                🎯 18 Core Elements (H–Ar)
              </button>
              <button class="game-mode-btn ${this.mode === 'full118' ? 'active' : ''}" onclick="window.gameZone.setMode('full118')">
                🌐 All 118 Elements
              </button>
            </div>
          </div>
        </div>

        <!-- Game Selector Navigation Tabs -->
        <div style="display:flex; gap:0.75rem; margin-bottom:2rem; flex-wrap:wrap;">
          <button class="btn ${this.currentGame === 'symbol_match' ? 'btn-primary' : 'btn-secondary'}" onclick="window.gameZone.selectGame('symbol_match')">
            🔤 Game 1: Symbol Match
          </button>
          <button class="btn ${this.currentGame === 'atomic_number' ? 'btn-primary' : 'btn-secondary'}" onclick="window.gameZone.selectGame('atomic_number')">
            🔢 Game 2: Atomic # Challenge
          </button>
          <button class="btn ${this.currentGame === 'memory' ? 'btn-primary' : 'btn-secondary'}" onclick="window.gameZone.selectGame('memory')">
            🧠 Game 3: Memory Flip Game
          </button>
        </div>

        <!-- Active Game Mount Container -->
        <div id="active-game-mount"></div>
      </div>
    `;

    const mountEl = document.getElementById('active-game-mount');
    if (mountEl) {
      if (this.currentGame === 'symbol_match' && window.symbolMatchGame) {
        window.symbolMatchGame.init(mountEl);
      } else if (this.currentGame === 'atomic_number' && window.atomicNumberGame) {
        window.atomicNumberGame.init(mountEl);
      } else if (this.currentGame === 'memory' && window.memoryGame) {
        window.memoryGame.init(mountEl);
      }
    }
  }
}

window.gameZone = new GameZoneComponent();
