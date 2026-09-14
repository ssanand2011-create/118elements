/**
 * ELEMENT 118 — 16 COMPREHENSIVE CHEMISTRY LEARNING MODULES
 * Fully structured educational curricula with concepts, formulas, interactive widgets, and mini-quizzes.
 */

const LEARNING_TOPICS = [
  {
    id: "atomic-structure",
    title: "1. Atomic Structure & The Nucleus",
    icon: "⚛️",
    summary: "Atoms are the fundamental building blocks of all matter. Every atom comprises an ultra-dense, positively charged central nucleus surrounded by a cloud of negatively charged electrons inhabiting quantum energy levels.",
    keyPoints: [
      "The atomic nucleus contains more than 99.94% of the atom's total mass in less than 1/100,000th of its volume.",
      "Electrons occupy quantized orbitals (s, p, d, f) described by probabilistic wave functions (Schrödinger equation).",
      "Electrostatic Coulomb attraction between protons (+) and electrons (-) keeps the atom bound together."
    ],
    formula: "\\text{Atom Radius} \\approx 10^{-10} \\text{ m (1 Å)}, \\quad \\text{Nucleus Radius} \\approx 10^{-15} \\text{ m (1 fm)}",
    miniQuiz: [
      {
        question: "Where is nearly all the mass of an atom concentrated?",
        options: ["In the electron cloud", "In the atomic nucleus", "Evenly distributed throughout the atom", "In the valence orbitals"],
        correctIndex: 1,
        explanation: "Protons and neutrons in the nucleus are approximately 1,836 times more massive than electrons."
      },
      {
        question: "What fundamental force binds negatively charged electrons to the positively charged nucleus?",
        options: ["Gravitational force", "Strong nuclear force", "Electromagnetic (Coulomb) force", "Weak nuclear force"],
        correctIndex: 2,
        explanation: "The electrostatic attraction between opposite charges (protons and electrons) holds electrons in orbit."
      }
    ]
  },
  {
    id: "subatomic-particles",
    title: "2. Protons, Neutrons & Electrons",
    icon: "🔬",
    summary: "The three primary subatomic particles possess distinct mass, electric charge, and nuclear properties that dictate chemical reactivity and nuclear stability.",
    keyPoints: [
      "Protons have a relative charge of +1 and a mass of ~1.007276 u (composed of 2 up quarks and 1 down quark).",
      "Neutrons are electrically neutral (charge 0) with a mass of ~1.008665 u (composed of 1 up quark and 2 down quarks).",
      "Electrons are elementary leptons with a charge of -1 and a rest mass of ~0.00054858 u."
    ],
    formula: "m_p \\approx 1.6726 \\times 10^{-27}\\text{ kg}, \\quad m_n \\approx 1.6749 \\times 10^{-27}\\text{ kg}, \\quad m_e \\approx 9.109 \\times 10^{-31}\\text{ kg}",
    miniQuiz: [
      {
        question: "Which subatomic particle has no net electrical charge?",
        options: ["Proton", "Positron", "Electron", "Neutron"],
        correctIndex: 3,
        explanation: "Neutrons carry 0 net electrical charge and provide nuclear strong-force binding without electrostatic repulsion."
      },
      {
        question: "What determines the chemical identity of an element?",
        options: ["Number of neutrons", "Number of protons", "Number of valence electrons", "Total mass number"],
        correctIndex: 1,
        explanation: "The number of protons (atomic number Z) uniquely identifies an element on the periodic table."
      }
    ]
  },
  {
    id: "atomic-number",
    title: "3. Atomic Number (Z)",
    icon: "🔢",
    summary: "The atomic number (symbol Z, from German 'Zahl') is the exact number of protons in the nucleus of an atom. In an electrically neutral atom, Z also equals the total number of electrons.",
    keyPoints: [
      "Atomic number strictly defines an element's position on the modern periodic table.",
      "Henry Moseley (1913) demonstrated experimentally using X-ray spectroscopy that Z corresponds to nuclear charge.",
      "Elements are arranged in ascending order of Z: from Hydrogen (Z=1) to Oganesson (Z=118)."
    ],
    formula: "Z = \\text{Number of Protons} = \\text{Number of Electrons (in neutral atom)}",
    miniQuiz: [
      {
        question: "If an atom has 8 protons, 8 neutrons, and 8 electrons, what is its atomic number?",
        options: ["8", "16", "24", "0"],
        correctIndex: 0,
        explanation: "The atomic number Z is strictly the number of protons (Z = 8, which is Oxygen)."
      }
    ]
  },
  {
    id: "mass-number",
    title: "4. Mass Number (A) & Atomic Mass",
    icon: "⚖️",
    summary: "The mass number (symbol A) is the total count of nucleons (protons + neutrons) in an atom's nucleus. Standard atomic mass is the weighted average of all naturally occurring isotopes of an element.",
    keyPoints: [
      "Mass number A is always an integer for a specific isotope (e.g. Carbon-12 has A=12).",
      "Number of neutrons N can be determined via N = A - Z.",
      "1 unified atomic mass unit (1 u or Dalton) is defined as exactly 1/12th the mass of a single unbound Carbon-12 atom."
    ],
    formula: "A = Z + N \\implies N = A - Z",
    miniQuiz: [
      {
        question: "How many neutrons are in a neutral atom of Sodium-23 (atomic number Z = 11)?",
        options: ["11", "12", "23", "34"],
        correctIndex: 1,
        explanation: "N = A - Z = 23 - 11 = 12 neutrons."
      }
    ]
  },
  {
    id: "isotopes",
    title: "5. Isotopes & Radioactivity",
    icon: "🧪",
    summary: "Isotopes are nuclides of the same chemical element (identical proton count Z) that contain differing numbers of neutrons (varying mass number A). They share almost identical chemical properties but differ in nuclear stability.",
    keyPoints: [
      "Hydrogen has three named isotopes: Protium (¹H, 0 neutrons), Deuterium (²H, 1 neutron), and radioactive Tritium (³H, 2 neutrons).",
      "Unstable radioactive isotopes undergo alpha (α), beta (β), or gamma (γ) decay with characteristic half-lives.",
      "Carbon-14 (half-life 5,730 years) is used in radiocarbon dating of biological artifacts."
    ],
    formula: "\\text{Average Atomic Mass} = \\sum (\\text{Isotopic Mass}_i \\times \\text{Fractional Abundance}_i)",
    miniQuiz: [
      {
        question: "Two atoms with the same number of protons but different numbers of neutrons are called:",
        options: ["Isomers", "Isotopes", "Allotropes", "Isobars"],
        correctIndex: 1,
        explanation: "Isotopes have identical atomic numbers (Z) but different mass numbers (A)."
      }
    ]
  },
  {
    id: "ions",
    title: "6. Ions, Cations & Anions",
    icon: "⚡",
    summary: "An ion is an atom or molecule with a net electrical charge resulting from the gain or loss of one or more valence electrons.",
    keyPoints: [
      "Cations are positively charged ions formed when metals lose electrons (e.g., Na → Na⁺ + e⁻). Cations are smaller than their parent atoms.",
      "Anions are negatively charged ions formed when nonmetals gain electrons (e.g., Cl + e⁻ → Cl⁻). Anions are larger than their parent atoms.",
      "Ionic bonds form through electrostatic attraction between oppositely charged cations and anions."
    ],
    formula: "\\text{Net Charge} = Z - \\text{Number of Electrons}",
    miniQuiz: [
      {
        question: "When a neutral Magnesium atom (Z=12) loses 2 valence electrons, what ion does it form?",
        options: ["Mg²⁻ anion", "Mg²⁺ cation", "Mg⁺ cation", "Mg neutral radical"],
        correctIndex: 1,
        explanation: "Losing 2 negative electrons leaves a net charge of +2, forming the Mg²⁺ cation."
      }
    ]
  },
  {
    id: "groups",
    title: "7. Groups 1–18 & Chemical Families",
    icon: "📊",
    summary: "The 18 vertical columns of the periodic table are called Groups. Elements in the same group share identical valence electron configurations and exhibit similar chemical reactivity.",
    keyPoints: [
      "Group 1: Alkali Metals (1 valence electron, highly reactive with water).",
      "Group 2: Alkaline Earth Metals (2 valence electrons, reactive).",
      "Groups 3–12: Transition Metals (d-block, variable oxidation states, colorful complexes).",
      "Group 17: Halogens (7 valence electrons, highly electronegative, form salts).",
      "Group 18: Noble Gases (complete valence octet ns² np⁶, chemically inert under standard conditions)."
    ],
    formula: "\\text{Group 1: } ns^1, \\quad \\text{Group 17: } ns^2 np^5, \\quad \\text{Group 18: } ns^2 np^6",
    miniQuiz: [
      {
        question: "Which group consists of chemically inert gases with full valence electron shells?",
        options: ["Group 1 (Alkali Metals)", "Group 7 (Transition Metals)", "Group 17 (Halogens)", "Group 18 (Noble Gases)"],
        correctIndex: 3,
        explanation: "Noble gases (He, Ne, Ar, Kr, Xe, Rn) have complete outer electron shells and exceptionally low chemical reactivity."
      }
    ]
  },
  {
    id: "periods",
    title: "8. Periods 1–7 & Electron Shells",
    icon: "🔄",
    summary: "The 7 horizontal rows of the periodic table are called Periods. The period number indicates the principal quantum number (n) of the outermost electron shell being populated.",
    keyPoints: [
      "Period 1 contains only 2 elements (H and He), filling the 1s subshell.",
      "Periods 2 and 3 contain 8 elements each (filling s and p subshells).",
      "Periods 4 and 5 contain 18 elements each (introducing the 3d and 4d transition metals).",
      "Periods 6 and 7 contain 32 elements each (incorporating the 4f Lanthanides and 5f Actinides)."
    ],
    formula: "\\text{Max electrons per shell } n = 2n^2 \\quad (n=1 \\to 2, \\, n=2 \\to 8, \\, n=3 \\to 18, \\, n=4 \\to 32)",
    miniQuiz: [
      {
        question: "What does the period number of an element in the periodic table directly represent?",
        options: ["The number of valence electrons", "The principal quantum energy level (n) of its outermost shell", "The number of oxidation states", "The nuclear charge"],
        correctIndex: 1,
        explanation: "Elements in Period 4 have their valence electrons occupying the n=4 principal energy level."
      }
    ]
  },
  {
    id: "blocks",
    title: "9. The s, p, d & f Blocks",
    icon: "🧱",
    summary: "The periodic table is divided into four distinct blocks based on which atomic subshell is being actively filled with electrons.",
    keyPoints: [
      "s-block: Groups 1 and 2 (plus He and H), holds up to 2 electrons.",
      "p-block: Groups 13 to 18, holds up to 6 electrons.",
      "d-block: Groups 3 to 12 (Transition metals), holds up to 10 electrons.",
      "f-block: Lanthanides (4f) and Actinides (5f), holds up to 14 electrons."
    ],
    formula: "s: 1 \\text{ orbital (2 e}^-), \\quad p: 3 \\text{ orbitals (6 e}^-), \\quad d: 5 \\text{ orbitals (10 e}^-), \\quad f: 7 \\text{ orbitals (14 e}^-)",
    miniQuiz: [
      {
        question: "Which block of the periodic table contains the transition metals?",
        options: ["s-block", "p-block", "d-block", "f-block"],
        correctIndex: 2,
        explanation: "The d-block contains Groups 3 through 12, where electrons fill the (n-1)d subshells."
      }
    ]
  },
  {
    id: "electron-config",
    title: "10. Electronic Configuration & Quantum Rules",
    icon: "🪐",
    summary: "The arrangement of electrons in an atom's orbitals follows three fundamental quantum principles: the Aufbau principle, Pauli exclusion principle, and Hund's rule.",
    keyPoints: [
      "Aufbau Principle: Electrons occupy lowest energy orbitals first (1s < 2s < 2p < 3s < 3p < 4s < 3d...).",
      "Pauli Exclusion Principle: No two electrons in an atom can have the exact same set of 4 quantum numbers; max 2 electrons per orbital with opposite spins.",
      "Hund's Rule: Electrons occupy degenerate orbitals singly with parallel spins before pairing up."
    ],
    formula: "1s \\to 2s \\to 2p \\to 3s \\to 3p \\to 4s \\to 3d \\to 4p \\to 5s \\to 4d \\to 5p \\to 6s...",
    miniQuiz: [
      {
        question: "What is the ground-state electronic configuration of Carbon (Z=6)?",
        options: ["1s² 2s² 2p²", "1s² 2s⁴", "1s² 2p⁴", "1s¹ 2s² 2p³"],
        correctIndex: 0,
        explanation: "Carbon fills 1s (2 electrons), 2s (2 electrons), and has 2 electrons in the 2p subshell."
      }
    ]
  },
  {
    id: "valence-electrons",
    title: "11. Valence Electrons & Octet Rule",
    icon: "⭕",
    summary: "Valence electrons are the electrons in the outermost principal energy level that participate in chemical bonding. The Octet Rule states that atoms tend to gain, lose, or share electrons to attain a stable 8-electron noble gas configuration.",
    keyPoints: [
      "For main-group elements (Groups 1-2, 13-18), the number of valence electrons equals the group number (or group number minus 10).",
      "Valence electrons dictate whether an element forms covalent, ionic, or metallic bonds.",
      "Exceptions to the octet rule include Hydrogen/Helium (duet rule) and expanded octets in Period 3+ elements (e.g. SF₆, PCl₅)."
    ],
    formula: "\\text{Valence Electrons for main groups: } V = \\text{Group } \\# \\pmod{10}",
    miniQuiz: [
      {
        question: "How many valence electrons does an atom of Chlorine (Group 17) have?",
        options: ["1", "5", "7", "8"],
        correctIndex: 2,
        explanation: "Chlorine ([Ne] 3s² 3p⁵) has 2 + 5 = 7 valence electrons and needs 1 more to complete its octet."
      }
    ]
  },
  {
    id: "metals-nonmetals",
    title: "12. Metals, Nonmetals & Conductivity",
    icon: "🧲",
    summary: "Chemical elements are fundamentally classified into metals, nonmetals, and metalloids based on physical and electrical conductivity properties.",
    keyPoints: [
      "Metals (~80% of elements): Lustrous, malleable, ductile, excellent thermal and electrical conductors, tend to lose electrons (low ionization energy).",
      "Nonmetals: Dull, brittle when solid, poor electrical conductors (insulators), high electronegativity, tend to gain or share electrons.",
      "Metallic bonding features a 'sea of delocalized valence electrons' moving freely around fixed positive metal cations."
    ],
    formula: "\\text{Metallic Character increases towards lower-left (Fr, Cs); Nonmetallic increases towards top-right (F, O)}",
    miniQuiz: [
      {
        question: "Which property is characteristic of metals?",
        options: ["High electrical resistivity", "Brittle texture in solid state", "High thermal and electrical conductivity", "High electronegativity"],
        correctIndex: 2,
        explanation: "Delocalized conduction electrons in metals allow rapid conduction of electric current and thermal energy."
      }
    ]
  },
  {
    id: "metalloids",
    title: "13. Metalloids & Semiconductor Physics",
    icon: "💻",
    summary: "Metalloids (B, Si, Ge, As, Sb, Te, Po) exhibit properties intermediate between metals and nonmetals. They are foundational to modern semiconductor microelectronics.",
    keyPoints: [
      "Metalloids form a diagonal staircase dividing metals from nonmetals in the p-block.",
      "Semiconductors have electrical conductivity that increases with temperature (unlike metals whose conductivity decreases with heat).",
      "Doping silicon or germanium with Group 13 (p-type, Boron) or Group 15 (n-type, Phosphorus) elements creates diodes, transistors, and solar cells."
    ],
    formula: "\\text{Bandgap } E_g: \\text{ Metals (}E_g=0\\text{ eV)}, \\, \\text{Semiconductors (}0 < E_g < 3\\text{ eV)}, \\, \\text{Insulators (}E_g > 3\\text{ eV)}",
    miniQuiz: [
      {
        question: "Which metalloid element forms the primary substrate for computer microchips and solar panels?",
        options: ["Silicon (Si)", "Carbon (C)", "Aluminum (Al)", "Lead (Pb)"],
        correctIndex: 0,
        explanation: "Silicon is the premier semiconductor material due to its optimal bandgap, abundance, and stable oxide (SiO₂)."
      }
    ]
  },
  {
    id: "reactivity",
    title: "14. Chemical Reactivity & Electronegativity",
    icon: "💥",
    summary: "Chemical reactivity is driven by thermodynamics and the drive for atoms to achieve lower potential energy configurations through chemical bond formation.",
    keyPoints: [
      "Electronegativity is an atom's ability in a molecule to attract shared bonding electrons toward itself (Pauling scale: 0.79 Fr to 3.98 F).",
      "Large electronegativity differences (ΔEN > 1.7) lead to ionic bonds; smaller differences (0.4 < ΔEN < 1.7) lead to polar covalent bonds.",
      "Alkali metals and Halogens are the most reactive element families."
    ],
    formula: "\\Delta EN = |EN_A - EN_B| \\implies \\begin{cases} < 0.4 & \\text{Nonpolar Covalent} \\\\ 0.4 - 1.7 & \\text{Polar Covalent} \\\\ > 1.7 & \\text{Ionic} \\end{cases}",
    miniQuiz: [
      {
        question: "Which chemical element has the highest electronegativity on the Pauling scale?",
        options: ["Oxygen (O)", "Chlorine (Cl)", "Fluorine (F)", "Helium (He)"],
        correctIndex: 2,
        explanation: "Fluorine has the highest electronegativity (3.98) due to its high effective nuclear charge and compact 2p shell."
      }
    ]
  },
  {
    id: "oxidation-states",
    title: "15. Oxidation States & Redox Reactions",
    icon: "🔋",
    summary: "An oxidation state (or oxidation number) represents the degree of oxidation (loss of electrons) of an atom in a chemical compound compared to its neutral elemental form.",
    keyPoints: [
      "Pure uncombined elements always have an oxidation state of 0.",
      "Fluorine is always -1 in compounds; Oxygen is usually -2 (except in peroxides where it is -1, or with F where it is positive).",
      "Redox mnemonic: OIL RIG — Oxidation Is Loss of electrons, Reduction Is Gain of electrons."
    ],
    formula: "\\text{Redox Reaction: } \\text{Oxidant} + n\\text{e}^- \\to \\text{Reductant} \\quad (\\text{Conservation of Charge})",
    miniQuiz: [
      {
        question: "In the compound Water (H₂O), what is the typical oxidation state of the Oxygen atom?",
        options: ["+2", "+1", "0", "-2"],
        correctIndex: 3,
        explanation: "Oxygen has an oxidation state of -2 in water, while each Hydrogen is +1."
      }
    ]
  },
  {
    id: "periodic-trends",
    title: "16. Periodic Trends & Effective Nuclear Charge",
    icon: "📈",
    summary: "Periodic trends are predictable patterns in element properties across periods and groups, governed by effective nuclear charge (Z_eff) and electron shielding.",
    keyPoints: [
      "Atomic Radius: Decreases across a period (increasing Z_eff pulls electrons tighter); increases down a group (additional electron shells).",
      "Ionization Energy: Energy required to remove the outermost electron; increases across a period, decreases down a group.",
      "Electron Affinity: Energy released when an electron is added; generally becomes more exothermic across a period.",
      "Effective nuclear charge formula: Z_eff = Z - S, where S is the shielding constant from core electrons."
    ],
    formula: "Z_{\\text{eff}} = Z - S \\quad (\\text{Slater's Rules for Nuclear Shielding})",
    miniQuiz: [
      {
        question: "As you move from left to right across a Period, what happens to the atomic radius?",
        options: ["It increases", "It decreases", "It remains strictly constant", "It fluctuates randomly"],
        correctIndex: 1,
        explanation: "Atomic radius decreases across a period because the increasing nuclear charge (Z_eff) draws valence electrons closer."
      }
    ]
  }
];

Object.freeze(LEARNING_TOPICS);
