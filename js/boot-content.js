// ── Boot screen content ───────────────────────────────────────────────────────
// Edit the lines here to change what appears in the terminal animation.
//
// Line types:
//   (none)       → plain typed line
//   header: true → instant title line (no typewriter)
//   bar: true    → typewriter + animated loading bar [######    ]  done
//   love: true   → typewriter + escalating percentage sequence (LOVE_PCTS)
//
// Optional: done: 'custom text' on a bar line overrides the default "done" label.

const BOOT_LINES = [
  { text: "louisa_je_t'aime.exe  -  version 3.04.26", header: true },
  { text: '--------------------------------'                         },
  { text: '> lancement de la simulation...'                            },
  { text: '> chargement de l\'espace pour mon coeur',   bar: true              },
  { text: '> création des nebuleuses et des étoiles',   bar: true              },
  { text: '> génération de mon amour pour toi..',       bar: true, done: 'already created', doneColor: '#ff4444' },
  { text: '> assemblement des galaxies',                bar: true              },
  { text: '> injection de la poussière d\'étoile',      bar: true              },
  { text: '> vérification de rocky',                    bar: true              },
  { text: '> Rocky va bien! 👎',                        bar: true              },
  { text: ''                                                        },
  { text: '> chargement de mon amour',     love: true              },
  { text: ''                                                        },
  { text: '> désolé louisa pour ce soir, je t\'aime beaucoup sache le, désolé...', glitch: true },
];

// Percentage steps shown during the love sequence.
// val: the text displayed, delay: ms before showing the next step.
const BOOT_LOVE_PCTS = [
  { val: '10%',   delay: 520  },
  { val: '25%',   delay: 420  },
  { val: '30%',   delay: 260  },
  { val: '50%',   delay: 500  },
  { val: '67%',   delay: 380  },
  { val: '80%',   delay: 310  },
  { val: '99%',   delay: 700  },
  { val: '100%',  delay: 900  },
  { val: '250%',  delay: 1200 },
  { val: '460%',  delay: 400  },
  { val: '790%',  delay: 240  },
  { val: '1000%', delay: 300  },
  { val: '∞%',    delay: 420  },
];
