// Terminal boot animation — plays on every page load

(function () {

  const LINES     = BOOT_LINES;
  const LOVE_PCTS = BOOT_LOVE_PCTS;

  const CHAR_MS  = 50;
  const BAR_LEN  = 10;
  const BAR_FULL = '##########';
  const BAR_EMPTY= '          ';
  const BAR_MS   = 600;

  let boost = localStorage.getItem('nsky_v2_manual_seen') ? 3 : 1;

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
    const chars = [...text]; // spread splits by Unicode code point, not UTF-16 unit — fixes emoji
    let i = 0;
    lineEl.appendChild(cursorEl);
    function step() {
      cursorEl.remove();
      lineEl.insertBefore(document.createTextNode(chars[i]), null);
      i++;
      lineEl.appendChild(cursorEl);
      if (i >= chars.length) { cursorEl.remove(); onDone(); }
      else setTimeout(step, CHAR_MS / boost);
    }
    setTimeout(step, CHAR_MS / boost);
  }

  function fillBar(barEl, closeEl, doneLabel, doneColor, onDone) {
    let filled = 0;
    function step() {
      filled++;
      barEl.textContent = BAR_FULL.slice(0, filled) + BAR_EMPTY.slice(filled);
      if (filled >= BAR_LEN) {
        const span = document.createElement('span');
        span.style.color = doneColor;
        span.textContent = '  ' + doneLabel;
        closeEl.textContent = ']';
        closeEl.appendChild(span);
        onDone();
      }
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

    const { text, bar, header, love, gold, done: doneLabel = 'done', doneColor = '#44ff88' } = LINES[index];
    const isLast = index === LINES.length - 1;

    const lineEl = document.createElement('div');
    lineEl.className = 'bt-line'
      + (header ? ' bt-header' : '')
      + (!love && isLast ? ' bt-last' : '')
      + (gold ? ' bt-gold' : '');
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
        fillBar(barEl, closeEl, doneLabel, doneColor, () => {
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
