#!/usr/bin/env node
// audit-tracker — hook SessionStart
//
// Si el proyecto tiene snapshot del loop orquestado (.claude/audit-tracker-state.json,
// mantenido por /orquestar), lo inyecta como contexto al arrancar la sesión: qué
// encargo está en curso, qué PRs esperan firma y qué quedó escalado. Así la sesión
// no arranca ciega — pero GitHub sigue siendo la fuente de verdad: /orquestar
// reconcilia SIEMPRE (paso 1) antes de decidir nada.
//
// Sin snapshot no emite nada: en proyectos que no usan el modo orquestado este
// hook es invisible.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { STATE_RELPATH, readState, withStdinJson } = require('./state');

function stateLines(state) {
  const encargos = Array.isArray(state.encargos_en_curso) ? state.encargos_en_curso : [];
  const prs = Array.isArray(state.prs_esperando_firma) ? state.prs_esperando_firma : [];
  const escalados = Array.isArray(state.escalados) ? state.escalados : [];
  if (!encargos.length && !prs.length && !escalados.length) return [];

  const out = [];
  out.push('AUDIT-TRACKER — estado del loop orquestado (snapshot ' + STATE_RELPATH +
    (state.actualizado ? ', actualizado ' + state.actualizado : '') + '):');
  for (const e of encargos) {
    out.push('- En curso: issue #' + e.issue + (e.sesion ? ' [' + e.sesion + ']' : '') +
      (e.titulo ? ' — ' + e.titulo : ''));
  }
  for (const p of prs) {
    out.push('- Esperando firma: PR #' + p.pr + (p.issue ? ' (issue #' + p.issue + ')' : '') +
      (p.titulo ? ' — ' + p.titulo : ''));
  }
  for (const e of escalados) {
    out.push('- Escalado (espera decisión humana): issue #' + e.issue +
      (e.motivo ? ' — ' + e.motivo : ''));
  }
  if (state.nota) out.push('- Nota de la última corrida: ' + state.nota);
  out.push('Al retomar /orquestar: reconciliá contra GitHub (paso 1) antes de tomar nada — ' +
    'el snapshot es cache de arranque, no la cola.');
  return out;
}

// Aviso ÚNICO de statusline (patrón ponytail): solo si el usuario ya usa el loop
// (hay snapshot), no tiene statusline configurada y nunca se le avisó. El flag
// marca «ya ofrecido» aunque lo rechace — un hint repetido es spam.
function statuslineNudge() {
  try {
    const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
    const flagPath = path.join(claudeDir, '.audit-tracker-statusline-nudged');
    if (fs.existsSync(flagPath)) return null;

    const settingsPath = path.join(claudeDir, 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/^\uFEFF/, ''));
      if (settings.statusLine) return null;
    }

    const script = path.join(__dirname, 'statusline.js');
    // Solo incrustamos el path en un comando si es de caracteres normales; un
    // path con metacaracteres de shell (comillas, $, ;, …) exige setup manual.
    if (!/^[A-Za-z0-9 _.\-:/\\~]+$/.test(script)) return null;

    try {
      fs.mkdirSync(claudeDir, { recursive: true });
      fs.writeFileSync(flagPath, '');
    } catch (e) { /* best-effort */ }

    return 'STATUSLINE OPCIONAL: el plugin audit-tracker trae un badge de statusline con el ' +
      'estado del loop (p.ej. «#12 S07 en curso · 1 PR esperando firma»). Para activarlo, ' +
      'agregar a ' + settingsPath + ': "statusLine": { "type": "command", "command": ' +
      JSON.stringify('node "' + script + '"') + ' }. Ofrecéselo al usuario UNA vez; si no lo quiere, no insistas.';
  } catch (e) {
    return null;
  }
}

withStdinJson((data) => {
  const cwd = data.cwd || process.cwd();
  const state = readState(cwd);
  if (state === null) return;

  if (state === 'corrupt') {
    process.stdout.write('AUDIT-TRACKER: ' + STATE_RELPATH + ' existe pero no parsea como JSON. ' +
      'No lo uses como estado; la próxima corrida de /orquestar debe regenerarlo (la ' +
      'reconciliación contra GitHub del paso 1 no depende de él).');
    return;
  }

  const out = stateLines(state);
  if (!out.length) return;

  const nudge = statuslineNudge();
  if (nudge) out.push('', nudge);
  process.stdout.write(out.join('\n'));
});
