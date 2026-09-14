/**
 * ELEMENT 118 — REACTIVE PERSISTENT STORAGE & PCS SCORE SERVICE
 * Manages favorites, explored items, quiz/game logs, streaks, flashback queue, and PCS metrics.
 */

class StorageService {
  constructor() {
    this.STORAGE_KEY = 'elem118_user_state_v1';
    this.listeners = [];
    this.state = this.loadState();
    this.checkDailyStreak();
  }

  getDefaultState() {
    return {
      exploredElements: [],      // Array of atomic numbers [1, 2, 8, ...]
      masteredElements: [],      // Array of atomic numbers
      favorites: [],             // Array of atomic numbers
      comparisonList: [],        // Up to 4 atomic numbers
      quizAttempts: 0,
      quizHistory: [],           // Array of { timestamp, difficulty, score, total, percentage, timeSec, weaknesses }
      bestQuizScore: 0,
      averageQuizScore: 0,
      gamesPlayed: 0,
      gamesCompleted: 0,
      gamesWon: 0,
      gameAccuracy: 0,
      gameHistory: [],           // Array of { type, difficulty, score, timeSec, accuracy, timestamp }
      fastMemoryScore: 0,
      fastMemoryBest: 0,
      flashbackQueue: [],        // Array of { atomicNumber, reason, missedIn, timestamp, reviewCount }
      flashbackReviewsCompleted: 0,
      learningCompletedTopics: [], // Array of topic IDs ['atomic-structure', 'isotopes', ...]
      unlockedAchievements: [],  // Array of achievement IDs
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      theme: 'dark'
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return { ...this.getDefaultState(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error("Failed to load user state from localStorage", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to persist state", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.state, this.calculatePCS()));
  }

  // --- Streak Tracker ---
  checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.state.lastActiveDate;

    if (!lastDate) {
      this.state.lastActiveDate = today;
      this.state.currentStreak = 1;
      this.state.bestStreak = 1;
      this.saveState();
      return;
    }

    if (lastDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      this.state.currentStreak += 1;
      if (this.state.currentStreak > this.state.bestStreak) {
        this.state.bestStreak = this.state.currentStreak;
      }
    } else {
      this.state.currentStreak = 1;
    }

    this.state.lastActiveDate = today;
    this.saveState();
  }

  // --- Element Exploration ---
  markElementExplored(atomicNumber) {
    const z = parseInt(atomicNumber, 10);
    if (!this.state.exploredElements.includes(z)) {
      this.state.exploredElements.push(z);
      this.saveState();
      this.checkAchievements();
    }
  }

  isElementExplored(atomicNumber) {
    return this.state.exploredElements.includes(parseInt(atomicNumber, 10));
  }

  // --- Favorites Management ---
  toggleFavorite(atomicNumber) {
    const z = parseInt(atomicNumber, 10);
    const index = this.state.favorites.indexOf(z);
    let isFav = false;
    if (index >= 0) {
      this.state.favorites.splice(index, 1);
    } else {
      this.state.favorites.push(z);
      isFav = true;
    }
    this.saveState();
    this.checkAchievements();
    return isFav;
  }

  isFavorite(atomicNumber) {
    return this.state.favorites.includes(parseInt(atomicNumber, 10));
  }

  getFavorites() {
    return [...this.state.favorites];
  }

  // --- Comparison Tool Selection (2-4 elements) ---
  toggleComparison(atomicNumber) {
    const z = parseInt(atomicNumber, 10);
    const idx = this.state.comparisonList.indexOf(z);
    if (idx >= 0) {
      this.state.comparisonList.splice(idx, 1);
    } else {
      if (this.state.comparisonList.length >= 4) {
        this.state.comparisonList.shift();
      }
      this.state.comparisonList.push(z);
    }
    this.saveState();
    return [...this.state.comparisonList];
  }

  clearComparison() {
    this.state.comparisonList = [];
    this.saveState();
  }

  getComparisonList() {
    return [...this.state.comparisonList];
  }

  // --- Quiz Results Logger ---
  recordQuizResult(result) {
    // result: { difficulty, score, total (10), timeSec, missedElements: [atomicNumbers] }
    this.state.quizAttempts += 1;
    const pct = Math.round((result.score / result.total) * 100);
    const entry = {
      ...result,
      percentage: pct,
      timestamp: Date.now()
    };

    this.state.quizHistory.unshift(entry);
    if (pct > this.state.bestQuizScore) {
      this.state.bestQuizScore = pct;
    }

    const totalPct = this.state.quizHistory.reduce((sum, q) => sum + q.percentage, 0);
    this.state.averageQuizScore = Math.round(totalPct / this.state.quizHistory.length);

    // Add missed elements to Flashback queue
    if (result.missedElements && result.missedElements.length > 0) {
      result.missedElements.forEach(z => {
        this.addToFlashback(z, `Struggled in ${result.difficulty} Quiz`, 'quiz');
      });
    }

    this.saveState();
    this.checkAchievements();
  }

  // --- Game Results Logger ---
  recordGameResult(gameData) {
    // gameData: { type: 'symbol_match'|'atomic_number'|'memory', difficulty, score, timeSec, accuracy, completed, won, missedElements }
    this.state.gamesPlayed += 1;
    if (gameData.completed) this.state.gamesCompleted += 1;
    if (gameData.won) this.state.gamesWon += 1;

    this.state.gameHistory.unshift({
      ...gameData,
      timestamp: Date.now()
    });

    const accuracies = this.state.gameHistory.filter(g => typeof g.accuracy === 'number').map(g => g.accuracy);
    if (accuracies.length > 0) {
      this.state.gameAccuracy = Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length);
    }

    if (gameData.missedElements && gameData.missedElements.length > 0) {
      gameData.missedElements.forEach(z => {
        this.addToFlashback(z, `Missed in ${gameData.type.replace('_', ' ')}`, 'game');
      });
    }

    this.saveState();
    this.checkAchievements();
  }

  // --- Flashback Queue ---
  addToFlashback(atomicNumber, reason, source) {
    const z = parseInt(atomicNumber, 10);
    if (!z || z < 1 || z > 118) return;

    const existing = this.state.flashbackQueue.find(item => item.atomicNumber === z);
    if (existing) {
      existing.reason = reason;
      existing.missedIn = source;
      existing.timestamp = Date.now();
    } else {
      this.state.flashbackQueue.push({
        atomicNumber: z,
        reason: reason,
        missedIn: source,
        timestamp: Date.now(),
        reviewCount: 0
      });
    }
  }

  resolveFlashback(atomicNumber, remembered) {
    const z = parseInt(atomicNumber, 10);
    const index = this.state.flashbackQueue.findIndex(item => item.atomicNumber === z);
    if (index >= 0) {
      this.state.flashbackReviewsCompleted += 1;
      if (remembered) {
        this.state.flashbackQueue.splice(index, 1);
        if (!this.state.masteredElements.includes(z)) {
          this.state.masteredElements.push(z);
        }
      } else {
        this.state.flashbackQueue[index].reviewCount += 1;
        this.state.flashbackQueue[index].timestamp = Date.now();
      }
      this.saveState();
      this.checkAchievements();
    }
  }

  getFlashbackQueue() {
    return [...this.state.flashbackQueue];
  }

  // --- Fast Memory Record ---
  recordFastMemoryScore(score, total, timeSec) {
    const pct = Math.round((score / total) * 100);
    this.state.fastMemoryScore = pct;
    if (pct > this.state.fastMemoryBest) {
      this.state.fastMemoryBest = pct;
    }
    this.saveState();
    this.checkAchievements();
  }

  // --- Learning Module Topics ---
  markTopicCompleted(topicId) {
    if (!this.state.learningCompletedTopics.includes(topicId)) {
      this.state.learningCompletedTopics.push(topicId);
      this.saveState();
      this.checkAchievements();
    }
  }

  // --- Chemistry Progress Score (PCS) Calculation ---
  calculatePCS() {
    const explored = this.state.exploredElements.length;
    const mastered = this.state.masteredElements.length;
    const quizAvg = this.state.averageQuizScore;
    const games = this.state.gamesCompleted;
    const topics = this.state.learningCompletedTopics.length;
    const flashback = this.state.flashbackReviewsCompleted;

    // Component calculations
    const exploredScore = (Math.min(explored, 118) / 118) * 25; // 25% max
    const masteredScore = (Math.min(mastered, 118) / 118) * 15; // 15% max
    const quizScore = this.state.quizAttempts > 0 ? (quizAvg / 100) * 20 : 0; // 20% max
    const gameScore = (Math.min(games, 10) / 10) * 15; // 15% max
    const topicScore = (Math.min(topics, 16) / 16) * 15; // 15% max
    const reviewScore = (Math.min(flashback, 10) / 10) * 10; // 10% max

    const total = Math.round(exploredScore + masteredScore + quizScore + gameScore + topicScore + reviewScore);
    return Math.max(0, Math.min(100, total));
  }

  // --- Achievements Checker ---
  checkAchievements() {
    if (typeof ACHIEVEMENTS_DATA === 'undefined') return;

    ACHIEVEMENTS_DATA.forEach(ach => {
      if (!this.state.unlockedAchievements.includes(ach.id)) {
        if (ach.condition(this.state, this.calculatePCS())) {
          this.state.unlockedAchievements.push(ach.id);
          this.triggerUnlockToast(ach);
        }
      }
    });
  }

  triggerUnlockToast(achievement) {
    if (window.audioService) {
      window.audioService.playFanfare();
    }
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div style="font-size:1.5rem;">🏆</div>
      <div>
        <div style="font-size:0.75rem; color:var(--accent-cyan); text-transform:uppercase; font-weight:700;">Achievement Unlocked!</div>
        <div style="font-weight:700;">${achievement.title}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">${achievement.description}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

window.storageService = new StorageService();
