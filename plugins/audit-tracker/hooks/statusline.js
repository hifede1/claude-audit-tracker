#!/usr/bin/env node
// audit-tracker — statusline con badge del loop orquestado
//
// Claude Code manda su JSON por stdin ({model, workspace, cwd, …}); imprimimos
// UNA línea: [modelo] carpeta · <badge del loop si hay snapshot>. Sin snapshot
// queda una statusline mínima igual de usable, así el mismo comando sirve en
// proyectos con y sin modo orquestado.

const path = require('path');
const { readState, withStdinJson } = require('./state');

withStdinJson((data) => {
  const dir = (data.workspace && data.workspace.current_dir) || data.cwd || process.cwd();
  const model = (data.model && data.model.display_name) || '';

  const parts = [];
  if (model) parts.push('[' + model + ']');
  parts.push(path.basename(dir));

  const state = readState(dir);
  if (state && state !== 'corrupt') {
    const encargos = Array.isArray(state.encargos_en_curso) ? state.encargos_en_curso : [];
    const prs = Array.isArray(state.prs_esperando_firma) ? state.prs_esperando_firma : [];
    const escalados = Array.isArray(state.escalados) ? state.escalados : [];
    if (encargos.length) {
      parts.push('🎼 ' + encargos.map((e) => '#' + e.issue + (e.sesion ? ' ' + e.sesion : '')).join(', ') + ' en curso');
    }
    if (prs.length) {
      parts.push('⏳ ' + prs.length + ' PR' + (prs.length > 1 ? 's' : '') + ' esperando firma (' +
        prs.map((p) => '#' + p.pr).join(' ') + ')');
    }
    if (escalados.length) {
      parts.push('🛑 ' + escalados.length + ' escalado' + (escalados.length > 1 ? 's' : ''));
    }
  }

  process.stdout.write(parts.join(' · '));
});
