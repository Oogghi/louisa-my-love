// Terminal boot animation — plays on every page load

(function () {

  const LINES = [
    { text: "louisa_je_t'aime.exe  -  version 3.04.26", header: true },
    { text: '--------------------------------'                         },
    { text: '> boot sequence initiated...'                            },
    { text: '> chargement du ciel étoilé',   bar:  true              },
    { text: '> calibration des nébuleuses',  bar:  true              },
    { text: '> génération de l\'amour',      bar:  true              },
    { text: '> montage de l\'espace',        bar:  true              },
    { text: '> injection de poussière',      bar:  true              },
    { text: '> vérification des étoiles',    bar:  true              },
    { text: ''                                                        },
    { text: '> chargement de mon amour',     love: true              },
  ];

  // Percentage steps for the love sequence
  const LOVE_PCTS = [
    { val: '10%',   delay: 520 },
    { val: '25%',   delay: 420 },
    { val: '30%',   delay: 260 },
    { val: '50%',   delay: 500 },
    { val: '67%',   delay: 380 },
    { val: '80%',   delay: 310 },
    { val: '99%',   delay: 700 },
    { val: '100%',  delay: 900 },
    { val: '300%',  delay: 240 },
    { val: '1000%', delay: 300 },
    { val: 'infini%', delay: 420 },
  ];

  const CHAR_MS  = 38;
  const BAR_LEN  = 10;
  const BAR_FULL = '##########';
  const BAR_EMPTY= '          ';
  const BAR_MS   = 600;

  let boost = 1;

  const overlay  = document.getElementById('boot-overlay');
  const terminal = document.getElementById('boot-terminal');
  if (!overlay || !terminal) return;

  overlay.addEventListener('pointerdown', () => {
    boost = Math.min(boost * 2.5, 60);
  });

  const cursorEl = document.createElement('span');
  cursorEl.className = 'bt-cursor';
  cursorEl.textContent = '_';

  function typeLine(lineEl, text, onDone) {
    let i = 0;
    lineEl.appendChild(cursorEl);
    function step() {
      cursorEl.remove();
      lineEl.insertBefore(document.createTextNode(text[i]), null);
      i++;
      lineEl.appendChild(cursorEl);
      if (i >= text.length) { cursorEl.remove(); onDone(); }
      else setTimeout(step, CHAR_MS / boost);
    }
    setTimeout(step, CHAR_MS / boost);
  }

  function fillBar(barEl, closeEl, onDone) {
    let filled = 0;
    function step() {
      filled++;
      barEl.textContent = BAR_FULL.slice(0, filled) + BAR_EMPTY.slice(filled);
      if (filled >= BAR_LEN) { closeEl.textContent = ']  done'; onDone(); }
      else setTimeout(step, (BAR_MS / BAR_LEN) / boost);
    }
    setTimeout(step, (BAR_MS / BAR_LEN) / boost);
  }

  function runLovePcts(pctEl, i, onDone) {
    if (i >= LOVE_PCTS.length) { onDone(); return; }
    const { val, delay } = LOVE_PCTS[i];
    setTimeout(() => {
      pctEl.textContent = val;
      if (val === 'infini%') pctEl.classList.add('bt-love-inf');
      runLovePcts(pctEl, i + 1, onDone);
    }, delay / boost);
  }

  function runLine(index) {
    if (index >= LINES.length) {
      setTimeout(() => {
        overlay.classList.add('bt-done');
        setTimeout(() => {
          overlay.style.display = 'none';
          if (!localStorage.getItem('nsky_v2_manual_seen')) {
            localStorage.setItem('nsky_v2_manual_seen', '1');
            const manual = document.getElementById('manual-overlay');
            if (manual) manual.classList.add('open');
          }
        }, 700);
      }, 600 / boost);
      return;
    }

    const { text, bar, header, love } = LINES[index];
    const isLast = index === LINES.length - 1;

    const lineEl = document.createElement('div');
    lineEl.className = 'bt-line'
      + (header ? ' bt-header' : '')
      + (!love && isLast ? ' bt-last' : '');
    terminal.appendChild(lineEl);

    // Instant lines: header, separator, blank
    if (header || text.startsWith('---') || text === '') {
      lineEl.textContent = text;
      setTimeout(() => runLine(index + 1), (header ? 120 : 60) / boost);
      return;
    }

    if (love) {
      typeLine(lineEl, text + '...  ', () => {
        const pctEl = document.createElement('span');
        pctEl.className = 'bt-love-pct';
        lineEl.appendChild(pctEl);
        runLovePcts(pctEl, 0, () => {
          setTimeout(() => runLine(index + 1), 500 / boost);
        });
      });
      return;
    }

    if (bar) {
      typeLine(lineEl, text + '  [', () => {
        const barEl = document.createElement('span');
        barEl.className = 'bt-bar';
        barEl.textContent = BAR_EMPTY;
        lineEl.appendChild(barEl);
        const closeEl = document.createElement('span');
        closeEl.textContent = ']';
        lineEl.appendChild(closeEl);
        lineEl.appendChild(cursorEl);
        fillBar(barEl, closeEl, () => {
          cursorEl.remove();
          setTimeout(() => runLine(index + 1), 55 / boost);
        });
      });
      return;
    }

    typeLine(lineEl, text, () => {
      setTimeout(() => runLine(index + 1), isLast ? 0 : 75 / boost);
    });
  }

  setTimeout(() => runLine(0), 100);

})();
