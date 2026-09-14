/**
 * ELEMENT 118 — QUIZ QUESTION BANK & DYNAMIC QUESTION GENERATOR
 * Supplies categorized questions across 4 difficulty tiers and 15+ question types.
 */

class QuizBank {
  constructor() {}

  /**
   * Generates exactly 10 randomized, diverse questions for a given difficulty.
   */
  generateQuiz(difficulty = 'medium', focusAtomicNumber = null) {
    if (typeof ELEMENTS_DATA === 'undefined') return [];

    const questions = [];
    const usedZ = new Set();
    if (focusAtomicNumber) usedZ.add(parseInt(focusAtomicNumber, 10));

    // Element pool based on difficulty
    let pool = [...ELEMENTS_DATA];
    if (difficulty === 'easy') {
      // Elements 1-20 or well-known everyday elements
      pool = ELEMENTS_DATA.filter(el => el.atomicNumber <= 36 || ['Au', 'Ag', 'Fe', 'Cu', 'Pb', 'Hg', 'U'].includes(el.symbol));
    } else if (difficulty === 'medium') {
      pool = ELEMENTS_DATA.filter(el => el.atomicNumber <= 86);
    } else {
      pool = [...ELEMENTS_DATA];
    }

    // Generator methods list
    const questionGenerators = [
      this.genSymbolToName,
      this.genNameToSymbol,
      this.genAtomicNumber,
      this.genGroupPeriod,
      this.genBlock,
      this.genCategory,
      this.genStateSTP,
      this.genValenceElectrons,
      this.genConfiguration,
      this.genPracticalUse,
      this.genDiscovery,
      this.genTrendComparison
    ];

    // Shuffle generators
    const shuffledGens = this.shuffleArray([...questionGenerators]);

    for (let i = 0; i < 10; i++) {
      const genFn = shuffledGens[i % shuffledGens.length];
      const targetEl = (i === 0 && focusAtomicNumber) 
        ? (ELEMENTS_DATA.find(el => el.atomicNumber === parseInt(focusAtomicNumber, 10)) || pool[0])
        : this.getUnusedElement(pool, usedZ);

      usedZ.add(targetEl.atomicNumber);
      const q = genFn.call(this, targetEl, difficulty);
      questions.push(q);
    }

    return questions;
  }

  getUnusedElement(pool, usedSet) {
    const available = pool.filter(el => !usedSet.has(el.atomicNumber));
    const list = available.length > 0 ? available : pool;
    return list[Math.floor(Math.random() * list.length)];
  }

  genSymbolToName(el) {
    const distractors = this.getDistractorNames(el, 3);
    const options = this.shuffleArray([el.name, ...distractors]);
    return {
      type: "symbol_to_name",
      topic: "Nomenclature & Symbols",
      targetZ: el.atomicNumber,
      question: `What is the chemical element name for the symbol "${el.symbol}"?`,
      options: options,
      correctIndex: options.indexOf(el.name),
      explanation: `The chemical symbol "${el.symbol}" represents ${el.name} (Atomic Number ${el.atomicNumber}).`
    };
  }

  genNameToSymbol(el) {
    const distractors = this.getDistractorSymbols(el, 3);
    const options = this.shuffleArray([el.symbol, ...distractors]);
    return {
      type: "name_to_symbol",
      topic: "Nomenclature & Symbols",
      targetZ: el.atomicNumber,
      question: `What is the official chemical symbol for ${el.name}?`,
      options: options,
      correctIndex: options.indexOf(el.symbol),
      explanation: `${el.name} has the chemical symbol "${el.symbol}" with atomic number ${el.atomicNumber}.`
    };
  }

  genAtomicNumber(el) {
    const z = el.atomicNumber;
    const offsets = [-2, -1, 1, 2, 3, -3].filter(off => z + off > 0 && z + off <= 118);
    const distractors = this.shuffleArray(offsets).slice(0, 3).map(off => String(z + off));
    const options = this.shuffleArray([String(z), ...distractors]);
    return {
      type: "atomic_number",
      topic: "Atomic Numbers",
      targetZ: el.atomicNumber,
      question: `What is the atomic number (Z) of ${el.name} (${el.symbol})?`,
      options: options,
      correctIndex: options.indexOf(String(z)),
      explanation: `${el.name} has atomic number ${z}, meaning it contains exactly ${z} protons in its nucleus.`
    };
  }

  genGroupPeriod(el) {
    const correct = el.group === "f-block" ? `f-block, Period ${el.period}` : `Group ${el.group}, Period ${el.period}`;
    const distractors = [
      el.group === "f-block" ? `Group 3, Period ${el.period}` : `Group ${el.group === 18 ? 1 : el.group + 1}, Period ${el.period}`,
      `Group ${typeof el.group === 'number' ? el.group : 4}, Period ${el.period > 1 ? el.period - 1 : 2}`,
      `Group ${typeof el.group === 'number' ? (el.group > 1 ? el.group - 1 : 18) : 5}, Period ${el.period < 7 ? el.period + 1 : 6}`
    ];
    const options = this.shuffleArray([correct, ...distractors]);
    return {
      type: "group_period",
      topic: "Periodic Table Organization",
      targetZ: el.atomicNumber,
      question: `In which group and period is ${el.name} (${el.symbol}) located?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} is situated in ${correct}.`
    };
  }

  genBlock(el) {
    const options = ["s-block", "p-block", "d-block", "f-block"];
    const correct = `${el.block}-block`;
    return {
      type: "block_classification",
      topic: "Subshell Blocks",
      targetZ: el.atomicNumber,
      question: `Which electron subshell block does ${el.name} (${el.symbol}) belong to?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} is part of the ${correct} because its valence electrons populate the ${el.block} subshell.`
    };
  }

  genCategory(el) {
    const allCats = [
      "Alkali metals", "Alkaline earth metals", "Transition metals", 
      "Post-transition metals", "Metalloids", "Reactive nonmetals", 
      "Noble gases", "Lanthanides", "Actinides"
    ];
    const correct = el.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const distractors = this.shuffleArray(allCats.filter(c => c.toLowerCase() !== correct.toLowerCase())).slice(0, 3);
    const options = this.shuffleArray([correct, ...distractors]);
    return {
      type: "category_classification",
      topic: "Element Families",
      targetZ: el.atomicNumber,
      question: `Which chemical category or family does ${el.name} (${el.symbol}) belong to?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} is classified as a ${correct}.`
    };
  }

  genStateSTP(el) {
    const options = ["Gas", "Liquid", "Solid", "Unknown / Synthetic"];
    const correct = el.state === "Unknown" ? "Unknown / Synthetic" : el.state;
    return {
      type: "state_stp",
      topic: "States of Matter",
      targetZ: el.atomicNumber,
      question: `What is the standard physical state of ${el.name} (${el.symbol}) at room temperature (STP)?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} exists as a ${el.state} at standard temperature and pressure (298 K, 1 atm).`
    };
  }

  genValenceElectrons(el) {
    const val = typeof el.valenceElectrons === 'number' ? el.valenceElectrons : (el.group > 10 ? el.group - 10 : el.group);
    const correct = String(val);
    const distractors = ["1", "2", "4", "7", "8"].filter(d => d !== correct).slice(0, 3);
    const options = this.shuffleArray([correct, ...distractors]);
    return {
      type: "valence_electrons",
      topic: "Valence Electrons",
      targetZ: el.atomicNumber,
      question: `How many valence electrons does a neutral atom of ${el.name} (${el.symbol}) possess in its outer shell?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} (Group ${el.group}) has ${correct} valence electron(s) participating in chemical bonding.`
    };
  }

  genConfiguration(el) {
    const correct = el.electronicConfiguration;
    const otherElements = this.shuffleArray(ELEMENTS_DATA.filter(item => item.atomicNumber !== el.atomicNumber)).slice(0, 3);
    const distractors = otherElements.map(item => item.electronicConfiguration);
    const options = this.shuffleArray([correct, ...distractors]);
    return {
      type: "electron_configuration",
      topic: "Quantum Configuration",
      targetZ: el.atomicNumber,
      question: `What is the ground-state electron configuration of ${el.name} (Z = ${el.atomicNumber})?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `The ground-state electronic configuration of ${el.name} is ${correct}.`
    };
  }

  genPracticalUse(el) {
    const use = el.commonUses[0] || "Industrial manufacturing";
    const otherEls = this.shuffleArray(ELEMENTS_DATA.filter(item => item.atomicNumber !== el.atomicNumber)).slice(0, 3);
    const distractors = otherEls.map(item => item.commonUses[0] || "Specialty chemical synthesis");
    const options = this.shuffleArray([use, ...distractors]);
    return {
      type: "practical_application",
      topic: "Practical Applications & Industry",
      targetZ: el.atomicNumber,
      question: `Which of the following is a major real-world application of ${el.name} (${el.symbol})?`,
      options: options,
      correctIndex: options.indexOf(use),
      explanation: `${el.name} is widely utilized in: ${el.commonUses.join(', ')}.`
    };
  }

  genDiscovery(el) {
    const correct = el.discoveredBy;
    const otherEls = this.shuffleArray(ELEMENTS_DATA.filter(item => item.discoveredBy !== el.discoveredBy && item.discoveredBy !== "Known to antiquity")).slice(0, 3);
    const distractors = otherEls.map(item => item.discoveredBy);
    const options = this.shuffleArray([correct, ...distractors]);
    return {
      type: "history_discovery",
      topic: "History of Discovery",
      targetZ: el.atomicNumber,
      question: `Who is credited with discovering the element ${el.name} (${el.symbol}, ${el.discoveryYear})?`,
      options: options,
      correctIndex: options.indexOf(correct),
      explanation: `${el.name} was discovered by ${el.discoveredBy} in ${el.discoveryYear}.`
    };
  }

  genTrendComparison(el) {
    const otherEl = ELEMENTS_DATA[Math.floor(Math.random() * ELEMENTS_DATA.length)];
    const elEn = typeof el.electronegativity === 'number' ? el.electronegativity : 0;
    const otherEn = typeof otherEl.electronegativity === 'number' ? otherEl.electronegativity : 0;

    let higherEl = elEn >= otherEn ? el : otherEl;
    let lowerEl = elEn < otherEn ? el : otherEl;

    if (elEn === otherEn || elEn === 0 || otherEn === 0) {
      // Fallback to atomic number comparison
      higherEl = el.atomicNumber > otherEl.atomicNumber ? el : otherEl;
      const options = [el.name, otherEl.name];
      return {
        type: "trend_comparison",
        topic: "Atomic Properties",
        targetZ: el.atomicNumber,
        question: `Which element has a higher atomic number (more protons)?`,
        options: options,
        correctIndex: options.indexOf(higherEl.name),
        explanation: `${higherEl.name} (Z=${higherEl.atomicNumber}) has more protons than ${otherEl.name} (Z=${otherEl.atomicNumber}).`
      };
    }

    const options = [el.name, otherEl.name];
    return {
      type: "trend_comparison",
      topic: "Periodic Trends",
      targetZ: el.atomicNumber,
      question: `Between ${el.name} and ${otherEl.name}, which element has the HIGHER electronegativity on the Pauling scale?`,
      options: options,
      correctIndex: options.indexOf(higherEl.name),
      explanation: `${higherEl.name} (EN = ${higherEl.electronegativity}) is more electronegative than ${lowerEl.name} (EN = ${lowerEl.electronegativity}).`
    };
  }

  getDistractorNames(targetEl, count) {
    const others = ELEMENTS_DATA.filter(el => el.atomicNumber !== targetEl.atomicNumber);
    return this.shuffleArray(others).slice(0, count).map(el => el.name);
  }

  getDistractorSymbols(targetEl, count) {
    const others = ELEMENTS_DATA.filter(el => el.atomicNumber !== targetEl.atomicNumber);
    return this.shuffleArray(others).slice(0, count).map(el => el.symbol);
  }

  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

window.quizBank = new QuizBank();
