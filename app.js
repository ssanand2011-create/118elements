/**
 * ELEMENT 118 — APPLICATION CONTROLLER & GLOBAL ROUTER
 * Orchestrates view switching, navigation state, theme toggling, sound management, and keyboard hotkeys.
 */

class AppRouter {
  constructor() {
    this.currentView = 'home';
    this.validViews = [
      'home', 'table', 'learn', 'trends', 'quiz', 
      'games', 'flashback', 'fastmemory', 'facts', 
      'favorites', 'pcs'
    ];
  }

  init() {
    this.bindNavigationEvents();
    this.bindThemeAndSoundControls();
    this.bindGlobalKeyboardShortcuts();
    this.applyPersistedTheme();

    // Initialize all modular components
    if (window.periodicTable) window.periodicTable.init();
    if (window.elementModal) window.elementModal.init();
    if (window.filterSearch) window.filterSearch.init();
    if (window.compareTool) window.compareTool.init();
    if (window.elementOfTheDay) window.elementOfTheDay.init();
    if (window.randomElements) window.randomElements.init();
    if (window.learningHub) window.learningHub.init();
    if (window.periodicTrends) window.periodicTrends.init();
    if (window.quizEngine) window.quizEngine.init();
    if (window.gameZone) window.gameZone.init();
    if (window.flashback) window.flashback.init();
    if (window.fastMemory) window.fastMemory.init();
    if (window.funFacts) window.funFacts.init();
    if (window.favoritesView) window.favoritesView.init();
    if (window.pcsDashboard) window.pcsDashboard.init();

    // Default view: home
    this.navigate('home', false);
  }

  navigate(viewName, playSound = true) {
    if (!this.validViews.includes(viewName)) return;

    this.currentView = viewName;

    // Update section visibility
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update nav links active states (desktop + mobile)
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const btnView = btn.getAttribute('data-view');
      btn.classList.toggle('active', btnView === viewName);
    });

    // Close mobile drawer if open
    this.closeMobileDrawer();

    // Trigger sub-component renders on view arrival
    if (viewName === 'table' && window.periodicTable) {
      window.periodicTable.renderTable();
    } else if (viewName === 'learn' && window.learningHub) {
      window.learningHub.render();
    } else if (viewName === 'trends' && window.periodicTrends) {
      window.periodicTrends.render();
    } else if (viewName === 'quiz' && window.quizEngine) {
      window.quizEngine.render();
    } else if (viewName === 'games' && window.gameZone) {
      window.gameZone.render();
    } else if (viewName === 'flashback' && window.flashback) {
      window.flashback.render();
    } else if (viewName === 'fastmemory' && window.fastMemory) {
      window.fastMemory.render();
    } else if (viewName === 'facts' && window.funFacts) {
      window.funFacts.render();
    } else if (viewName === 'favorites' && window.favoritesView) {
      window.favoritesView.render();
    } else if (viewName === 'pcs' && window.pcsDashboard) {
      window.pcsDashboard.render();
    }

    if (playSound && window.audioService) {
      window.audioService.playClick();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindNavigationEvents() {
    // Brand link to home
    const brandLink = document.getElementById('brand-link');
    if (brandLink) {
      brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate('home');
      });
    }

    // All nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-view');
        if (view) this.navigate(view);
      });
    });

    // Quick PCS badge button in header
    const pcsHeaderBtn = document.getElementById('pcs-header-btn');
    if (pcsHeaderBtn) {
      pcsHeaderBtn.addEventListener('click', () => {
        this.navigate('pcs');
      });
    }

    // Home PCS Dashboard button
    const homePcsBtn = document.getElementById('home-view-pcs-btn');
    if (homePcsBtn) {
      homePcsBtn.addEventListener('click', () => {
        this.navigate('pcs');
      });
    }

    // Mobile menu drawer
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('mobile-drawer');

    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        if (window.audioService) window.audioService.playClick();
      });
    }

    if (closeDrawerBtn && drawer) {
      closeDrawerBtn.addEventListener('click', () => {
        this.closeMobileDrawer();
      });
    }

    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) this.closeMobileDrawer();
      });
    }
  }

  closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  bindThemeAndSoundControls() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const soundBtn = document.getElementById('sound-toggle-btn');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('elem118_theme', newTheme);
        if (window.audioService) window.audioService.playClick();
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (window.audioService) {
          const isSoundOn = window.audioService.toggleSound();
          const onIcon = soundBtn.querySelector('.sound-on-icon');
          const offIcon = soundBtn.querySelector('.sound-off-icon');
          if (onIcon && offIcon) {
            onIcon.style.display = isSoundOn ? 'block' : 'none';
            offIcon.style.display = isSoundOn ? 'none' : 'block';
          }
          if (isSoundOn) window.audioService.playClick();
        }
      });
    }
  }

  applyPersistedTheme() {
    const savedTheme = localStorage.getItem('elem118_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const soundMuted = localStorage.getItem('elem118_sound_muted') === 'true';
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      const onIcon = soundBtn.querySelector('.sound-on-icon');
      const offIcon = soundBtn.querySelector('.sound-off-icon');
      if (onIcon && offIcon) {
        onIcon.style.display = !soundMuted ? 'block' : 'none';
        offIcon.style.display = !soundMuted ? 'none' : 'block';
      }
    }
  }

  bindGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore shortcut keys if typing in an input field or modal is open
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      const isModalOpen = (window.elementModal && window.elementModal.isOpen()) || (window.compareTool && window.compareTool.isOpen());

      if (e.key === 'Escape') {
        if (window.elementModal && window.elementModal.isOpen()) window.elementModal.close();
        if (window.compareTool && window.compareTool.isOpen()) window.compareTool.close();
        this.closeMobileDrawer();
        return;
      }

      if (isInput || isModalOpen) return;

      // Hotkey: '/' or 'k' focuses Search on periodic table
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        this.navigate('table');
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
        return;
      }

      // Hotkey: 't' toggles theme
      if (e.key.toLowerCase() === 't') {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) themeBtn.click();
        return;
      }

      // Hotkey: 'm' toggles sound
      if (e.key.toLowerCase() === 'm') {
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) soundBtn.click();
        return;
      }

      // Hotkey: 'r' opens random element
      if (e.key.toLowerCase() === 'r') {
        if (window.randomElements) window.randomElements.generate(1);
        return;
      }

      // Number keys 1-9 for instant navigation
      const numMap = {
        '1': 'home',
        '2': 'table',
        '3': 'learn',
        '4': 'trends',
        '5': 'quiz',
        '6': 'games',
        '7': 'flashback',
        '8': 'fastmemory',
        '9': 'pcs'
      };
      if (numMap[e.key]) {
        this.navigate(numMap[e.key]);
      }
    });
  }
}

// Instantiate and initialize when DOM is ready
window.appRouter = new AppRouter();

document.addEventListener('DOMContentLoaded', () => {
  window.appRouter.init();
});
