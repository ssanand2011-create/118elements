/**
 * ELEMENT 118 — ACHIEVEMENTS & BADGES DEFINITION
 * Unlocked strictly based on real verified user actions and metrics.
 */

const ACHIEVEMENTS_DATA = [
  {
    id: "first_discovery",
    title: "First Discovery",
    description: "Explore your very first chemical element in the periodic table.",
    icon: "🔬",
    category: "exploration",
    condition: (state) => state.exploredElements.length >= 1
  },
  {
    id: "element_explorer",
    title: "Element Explorer",
    description: "Explore at least 10 different chemical elements.",
    icon: "🧭",
    category: "exploration",
    condition: (state) => state.exploredElements.length >= 10
  },
  {
    id: "periodic_pioneer",
    title: "Periodic Pioneer",
    description: "Inspect and explore all 118 elements in the periodic table.",
    icon: "👑",
    category: "exploration",
    condition: (state) => state.exploredElements.length >= 118
  },
  {
    id: "quiz_starter",
    title: "Quiz Starter",
    description: "Complete your first 10-question chemistry quiz challenge.",
    icon: "📝",
    category: "quiz",
    condition: (state) => state.quizAttempts >= 1
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Score a perfect 100% on any 10-question chemistry quiz.",
    icon: "🎯",
    category: "quiz",
    condition: (state) => state.bestQuizScore === 100
  },
  {
    id: "memory_master",
    title: "Memory Master",
    description: "Successfully complete a round of the Element Card Memory Game.",
    icon: "🧠",
    category: "games",
    condition: (state) => state.gameHistory.some(g => g.type === 'memory' && g.completed)
  },
  {
    id: "speed_learner",
    title: "Speed Learner",
    description: "Complete a rapid visual sequence challenge in Fast Memory.",
    icon: "⚡",
    category: "memory",
    condition: (state) => state.fastMemoryBest > 0
  },
  {
    id: "game_champion",
    title: "Game Champion",
    description: "Play and complete all 3 chemistry games: Symbol Match, Atomic Number, and Memory Game.",
    icon: "🏆",
    category: "games",
    condition: (state) => {
      const types = new Set(state.gameHistory.filter(g => g.completed).map(g => g.type));
      return types.has('symbol_match') && types.has('atomic_number') && types.has('memory');
    }
  },
  {
    id: "chemistry_scholar",
    title: "Chemistry Scholar",
    description: "Complete at least 5 guided topics in the Chemistry Learning Hub.",
    icon: "🎓",
    category: "learning",
    condition: (state) => state.learningCompletedTopics.length >= 5
  },
  {
    id: "consistent_learner",
    title: "Consistent Learner",
    description: "Maintain a learning streak of 3 or more consecutive days.",
    icon: "🔥",
    category: "streak",
    condition: (state) => state.bestStreak >= 3
  },
  {
    id: "favorite_curator",
    title: "Curator of Matter",
    description: "Save 5 or more elements to your personal Favorites collection.",
    icon: "💖",
    category: "curation",
    condition: (state) => state.favorites.length >= 5
  },
  {
    id: "grand_chemist",
    title: "Grand Chemist",
    description: "Achieve an overall Chemistry Progress Score (PCS) of 80% or higher.",
    icon: "🌟",
    category: "mastery",
    condition: (state, pcs) => pcs >= 80
  }
];

Object.freeze(ACHIEVEMENTS_DATA);
