/**
 * ELEMENT 118 — INTERACTIVE PERIODIC TRENDS COMPONENT
 * Visualizes periodic trends (Atomic Radius, Ionization Energy, Electronegativity, Electron Affinity, Metallic Character, Reactivity)
 * with interactive heatmap overlays, vector arrows, and explanations of quantum exceptions.
 */

class PeriodicTrendsComponent {
  constructor() {
    this.container = null;
    this.activeTrend = 'electronegativity';
  }

  init() {
    this.container = document.getElementById('periodic-trends-container');
    if (!this.container || typeof ELEMENTS_DATA === 'undefined') return;

    this.render();
  }

  setTrend(trendKey) {
    this.activeTrend = trendKey;
    if (window.audioService) window.audioService.playClick();
    this.render();
  }

  getTrendMeta(trendKey) {
    const meta = {
      electronegativity: {
        title: "Electronegativity (Pauling Scale)",
        summary: "The relative tendency of an atom to attract a shared pair of bonding electrons toward itself.",
        acrossPeriod: "INCREASES (→) due to higher effective nuclear charge ($Z_{\\text{eff}}$) pulling electrons more strongly.",
        downGroup: "DECREASES (↓) due to increased atomic shielding from additional core electron shells.",
        highest: "Fluorine (3.98)",
        lowest: "Caesium (0.79) / Francium (0.79)",
        exceptions: "Noble gases (He, Ne, Ar) do not form standard covalent bonds and lack Pauling electronegativity values."
      },
      atomicRadius: {
        title: "Atomic Radius",
        summary: "The typical distance from the center of the atomic nucleus to the boundary of the surrounding electron cloud.",
        acrossPeriod: "DECREASES (→) as increasing nuclear charge draws valence electrons closer to the nucleus.",
        downGroup: "INCREASES (↓) as new principal electron energy levels (shells) are added.",
        highest: "Caesium / Francium (~260-270 pm)",
        lowest: "Helium (~31 pm)",
        exceptions: "d-block and f-block contractions cause Period 6 elements (like Hf) to have radii nearly identical to Period 5 (Zr) despite higher atomic number."
      },
      ionizationEnergy: {
        title: "First Ionization Energy",
        summary: "The minimum energy required to remove the most loosely bound electron from an isolated gaseous atom.",
        acrossPeriod: "INCREASES (→) as valence electrons feel stronger electrostatic attraction to the higher nuclear charge.",
        downGroup: "DECREASES (↓) because outer electrons are farther from the nucleus and shielded by inner shells.",
        highest: "Helium (2,372 kJ/mol)",
        lowest: "Francium / Caesium (~375-380 kJ/mol)",
        exceptions: "Nitrogen ([He] 2s² 2p³) has higher ionization energy than Oxygen ([He] 2s² 2p⁴) due to the extra quantum stability of its half-filled 2p subshell."
      },
      metallicCharacter: {
        title: "Metallic Character & Conductivity",
        summary: "The propensity of an element to lose electrons, form cations, and exhibit high electrical and thermal conductivity.",
        acrossPeriod: "DECREASES (→) moving from alkali metals towards nonmetals and noble gases.",
        downGroup: "INCREASES (↓) as valence electrons become more easily lost from larger atoms.",
        highest: "Francium & Caesium",
        lowest: "Fluorine & Helium",
        exceptions: "Hydrogen is placed in Group 1 due to 1s¹ configuration but is a nonmetal under standard planetary conditions."
      },
      reactivity: {
        title: "Chemical Reactivity",
        summary: "How readily an element undergoes chemical reactions to form stable chemical compounds.",
        acrossPeriod: "High at left (Alkali metals), low in middle, high at right (Halogens), zero at Noble gases.",
        downGroup: "Metals increase in reactivity down a group (Cs > Na); Nonmetals decrease in reactivity down a group (F > I).",
        highest: "Metals: Caesium / Francium • Nonmetals: Fluorine",
        lowest: "Noble gases (Neon, Argon, Helium)",
        exceptions: "Platinum and Gold are 'noble metals' due to relativistic stabilization of their outer 6s electrons."
      }
    };
    return meta[trendKey] || meta.electronegativity;
  }

  render() {
    if (!this.container) return;

    const meta = this.getTrendMeta(this.activeTrend);

    this.container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <div style="margin-bottom:1.5rem;">
          <div class="badge badge-cyan" style="margin-bottom:0.5rem;">Interactive Periodic Dynamics</div>
          <h1 style="font-size:2rem; margin:0;">Periodic Trends Visualizer</h1>
          <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
            Explore how fundamental physical and chemical properties evolve systematically across periods and groups.
          </p>
        </div>

        <!-- Trend Selector Buttons Bar -->
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
          <button class="btn ${this.activeTrend === 'electronegativity' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.periodicTrends.setTrend('electronegativity')">
            ⚡ Electronegativity
          </button>
          <button class="btn ${this.activeTrend === 'atomicRadius' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.periodicTrends.setTrend('atomicRadius')">
            ⭕ Atomic Radius
          </button>
          <button class="btn ${this.activeTrend === 'ionizationEnergy' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.periodicTrends.setTrend('ionizationEnergy')">
            🔥 Ionization Energy
          </button>
          <button class="btn ${this.activeTrend === 'metallicCharacter' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.periodicTrends.setTrend('metallicCharacter')">
            🧲 Metallic Character
          </button>
          <button class="btn ${this.activeTrend === 'reactivity' ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="window.periodicTrends.setTrend('reactivity')">
            💥 Chemical Reactivity
          </button>
        </div>

        <!-- Trend Explanation Banner -->
        <div class="glass-card" style="margin-bottom:1.5rem; border-color:var(--border-bright);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <h2 style="font-size:1.4rem; color:var(--accent-cyan); margin-bottom:0.4rem;">${meta.title}</h2>
              <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6; max-width:800px;">
                ${meta.summary}
              </p>
            </div>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
              <div style="background:var(--bg-tertiary); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); text-align:center;">
                <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Highest</div>
                <div style="font-weight:800; color:var(--accent-emerald); font-size:0.9rem;">${meta.highest}</div>
              </div>
              <div style="background:var(--bg-tertiary); padding:0.6rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); text-align:center;">
                <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Lowest</div>
                <div style="font-weight:800; color:var(--accent-pink); font-size:0.9rem;">${meta.lowest}</div>
              </div>
            </div>
          </div>

          <!-- Trend Vector Directions Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span style="font-size:1.75rem; color:var(--accent-cyan);">→</span>
              <div style="font-size:0.85rem;">
                <strong style="color:var(--text-primary); display:block;">Across a Period (Left to Right):</strong>
                <span style="color:var(--text-secondary);">${meta.acrossPeriod}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span style="font-size:1.75rem; color:var(--accent-purple);">↓</span>
              <div style="font-size:0.85rem;">
                <strong style="color:var(--text-primary); display:block;">Down a Group (Top to Bottom):</strong>
                <span style="color:var(--text-secondary);">${meta.downGroup}</span>
              </div>
            </div>
          </div>

          <!-- Quantum Exceptions Callout -->
          <div style="margin-top:1rem; background:rgba(245, 158, 11, 0.08); border-left:3px solid var(--accent-amber); padding:0.75rem 1rem; border-radius:var(--radius-sm); font-size:0.85rem;">
            <strong style="color:var(--accent-amber);">⚛️ Scientific Nuance & Quantum Exceptions:</strong>
            <span style="color:var(--text-secondary);">${meta.exceptions}</span>
          </div>
        </div>

        <!-- Interactive Heatmap Grid Preview -->
        <div class="glass-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.1rem; margin:0;">Periodic Heatmap Matrix</h3>
            <span style="font-size:0.75rem; color:var(--text-muted);">Hover or click any element to inspect properties</span>
          </div>

          <div class="periodic-table-wrapper" style="padding:0;">
            <div class="periodic-grid heatmap-mode">
              ${this.renderHeatmapElementsHTML()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderHeatmapElementsHTML() {
    return ELEMENTS_DATA.map(el => {
      const z = el.atomicNumber;
      let gridCol, gridRow;

      if (z >= 57 && z <= 71) {
        gridRow = 9;
        gridCol = z - 57 + 4;
      } else if (z >= 89 && z <= 103) {
        gridRow = 10;
        gridCol = z - 89 + 4;
      } else {
        gridRow = el.period;
        gridCol = el.group;
      }

      const { displayVal, bgStyle } = this.getHeatmapStyle(el);

      return `
        <div class="element-card" 
             style="grid-column:${gridCol}; grid-row:${gridRow}; ${bgStyle}"
             onclick="window.elementModal.open(${el.atomicNumber})"
             title="${el.name} (${el.symbol}): ${displayVal}">
          <div class="card-header">
            <span class="card-num">${el.atomicNumber}</span>
          </div>
          <div class="card-symbol" style="font-size:1.1rem;">${el.symbol}</div>
          <div style="font-size:0.6rem; text-align:center; font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${displayVal}
          </div>
        </div>
      `;
    }).join('');
  }

  getHeatmapStyle(el) {
    if (this.activeTrend === 'electronegativity') {
      if (typeof el.electronegativity === 'number') {
        // Range: 0.79 to 3.98
        const ratio = (el.electronegativity - 0.7) / (4.0 - 0.7);
        const hue = Math.round(200 - ratio * 160); // Cyan to Pink/Red
        return {
          displayVal: el.electronegativity.toFixed(2),
          bgStyle: `background: hsla(${hue}, 80%, 45%, 0.25); border-color: hsla(${hue}, 80%, 60%, 0.5);`
        };
      }
      return { displayVal: 'N/A', bgStyle: 'opacity:0.35;' };
    }

    if (this.activeTrend === 'atomicRadius') {
      // Relative heuristic based on period / group
      const baseRadius = (el.period * 35) - ((typeof el.group === 'number' ? el.group : 10) * 4);
      const ratio = Math.max(0.1, Math.min(1, baseRadius / 200));
      return {
        displayVal: `~${Math.round(baseRadius + 50)} pm`,
        bgStyle: `background: rgba(56, 189, 248, ${0.1 + ratio * 0.4}); border-color: rgba(56, 189, 248, 0.4);`
      };
    }

    if (this.activeTrend === 'ionizationEnergy') {
      const isNoble = el.category === 'noble-gas';
      const isAlkali = el.category === 'alkali-metal';
      const val = isNoble ? 'Very High' : (isAlkali ? 'Low' : 'Moderate');
      const alpha = isNoble ? 0.45 : (isAlkali ? 0.12 : 0.25);
      return {
        displayVal: val,
        bgStyle: `background: rgba(236, 72, 153, ${alpha}); border-color: rgba(236, 72, 153, 0.4);`
      };
    }

    if (this.activeTrend === 'metallicCharacter') {
      const isMetal = el.category.includes('metal') || el.category === 'lanthanide' || el.category === 'actinide';
      const isMetalloid = el.category === 'metalloid';
      return {
        displayVal: isMetal ? 'Metallic' : (isMetalloid ? 'Metalloid' : 'Nonmetal'),
        bgStyle: isMetal ? 'background: rgba(6, 182, 212, 0.25);' : (isMetalloid ? 'background: rgba(139, 92, 246, 0.25);' : 'background: rgba(132, 204, 22, 0.25);')
      };
    }

    // Default reactivity
    return {
      displayVal: el.state,
      bgStyle: `background: var(--bg-card);`
    };
  }
}

window.periodicTrends = new PeriodicTrendsComponent();
