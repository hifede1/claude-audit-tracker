// audit-tracker — helpers compartidos de los hooks.
// Contrato de los hooks (patrón ponytail): best-effort y never-block — un hook
// roto, lento o sin stdin JAMÁS frena la sesión ni ensucia la salida.

const fs = require('fs');
const path = require('path');

// Snapshot local del loop orquestado, mantenido por /orquestar en el repo del
// proyecto. GitHub es la fuente de verdad; esto es cache de arranque.
const STATE_RELPATH = path.join('.claude', 'audit-tracker-state.json');

// null = no hay snapshot; 'corrupt' = existe pero no parsea (el hook decide si avisar).
function readState(projectDir) {
  let raw;
  try {
    raw = fs.readFileSync(path.join(projectDir, STATE_RELPATH), 'utf8');
  } catch (e) {
    return null;
  }
  try {
    // BOM UTF-8 que algunos editores/shell de Windows anteponen rompe JSON.parse
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (e) {
    return 'corrupt';
  }
}

// Lee el JSON que Claude Code manda por stdin y llama fn(data) UNA sola vez.
// Si 'end' nunca llega (el wrapper de PowerShell en Windows puede tragarse el
// pipe), un timeout corto procesa lo que haya y sale igual. unref() evita
// sumar latencia al camino normal, donde 'end' dispara primero.
function withStdinJson(fn) {
  let input = '';
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    let data = {};
    try { data = JSON.parse(input.replace(/^\uFEFF/, '')); } catch (e) {}
    try { fn(data); } catch (e) {}
    process.exit(0);
  }
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', finish);
  process.stdin.on('error', finish);
  setTimeout(finish, 1000).unref();
}

module.exports = { STATE_RELPATH, readState, withStdinJson };
