#!/usr/bin/env node
// Consistencia del repo (patrón ponytail check-rule-copies): lo que está
// duplicado por contrato se verifica en CI, no de memoria. Chequea:
//   1. marketplace.json ↔ plugin.json: name y description idénticos
//   2. plugin.json version == entrada más reciente del CHANGELOG
//   3. hooks.json parsea y cada script que referencia existe en el plugin
//   4. cada docs/audits/<p>-estado.json parsea, declara schema_version, y su
//      last_audit coincide con el LAST_AUDIT de su tracker HTML hermano
// Sale con código 1 y la lista de drift si algo no cierra.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PLUGIN_DIR = 'plugins/audit-tracker';
const errors = [];

function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}

const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));
const plugin = JSON.parse(read(path.join(PLUGIN_DIR, '.claude-plugin/plugin.json')));

// 1. marketplace ↔ plugins: recorre TODAS las entradas del catálogo.
//    - source local (string "./..."): valida name + description contra su plugin.json local.
//    - source externo (objeto git-subdir): no se puede leer el plugin.json remoto acá, así que
//      solo se valida que el source esté bien formado (url/path presentes; ref/sha son opcionales).
//    La description de entradas externas no se coteja contra su fuente en este CI (vive en otro repo).
const plugins = marketplace.plugins || [];
if (!plugins.some((p) => p.name === plugin.name)) {
  errors.push('marketplace.json no lista un plugin llamado "' + plugin.name + '"');
}
for (const entry of plugins) {
  if (typeof entry.source === 'string') {
    const localDir = entry.source.replace(/^\.\//, '');
    const manifestPath = path.join(localDir, '.claude-plugin/plugin.json');
    let localPlugin;
    try {
      localPlugin = JSON.parse(read(manifestPath));
    } catch (e) {
      errors.push('entrada "' + entry.name + '": no pude leer su plugin.json local (' + manifestPath + '): ' + e.message);
      continue;
    }
    if (entry.name !== localPlugin.name) {
      errors.push('entrada "' + entry.name + '": name driftado vs su plugin.json (' + localPlugin.name + ')');
    }
    if (entry.description !== localPlugin.description) {
      errors.push('entrada "' + entry.name + '": description driftada entre marketplace.json y su plugin.json — tienen que ser idénticas');
    }
  } else if (entry.source && typeof entry.source === 'object') {
    const s = entry.source;
    if (s.source === 'git-subdir') {
      for (const key of ['url', 'path']) {
        if (!s[key]) errors.push('entrada externa "' + entry.name + '" (git-subdir): falta o vacío source.' + key);
      }
    } else {
      errors.push('entrada externa "' + entry.name + '": source.source no soportado por este check ("' + s.source + '"; esperado git-subdir)');
    }
  } else {
    errors.push('entrada "' + entry.name + '": source ausente o de tipo no soportado');
  }
}

// 2. versión ↔ CHANGELOG (la entrada más reciente es la primera "## vX.Y.Z")
const changelog = read('CHANGELOG.md').match(/^## v(\d+\.\d+\.\d+)/m);
if (!changelog) {
  errors.push('CHANGELOG.md sin ninguna entrada "## vX.Y.Z"');
} else if (changelog[1] !== plugin.version) {
  errors.push('versión driftada: plugin.json v' + plugin.version + ' vs CHANGELOG v' + changelog[1]);
}

// 3. hooks.json y sus scripts
if (plugin.hooks) {
  const hooksPath = path.join(PLUGIN_DIR, plugin.hooks);
  try {
    const hooks = read(hooksPath);
    const refs = JSON.stringify(JSON.parse(hooks)).match(/\$\{CLAUDE_PLUGIN_ROOT\}[^"\\]*/g) || [];
    if (!refs.length) errors.push(hooksPath + ' no referencia ningún script vía ${CLAUDE_PLUGIN_ROOT}');
    for (const ref of refs) {
      const rel = ref.replace('${CLAUDE_PLUGIN_ROOT}', '');
      if (!fs.existsSync(path.join(root, PLUGIN_DIR, rel))) {
        errors.push(hooksPath + ' referencia un archivo inexistente: ' + rel);
      }
    }
  } catch (e) {
    errors.push(hooksPath + ' no existe o no parsea: ' + e.message);
  }
}

// 4. estado.json ↔ tracker HTML (contrato de consumo, docs/estado-contrato.md)
const auditsDir = path.join(root, 'docs/audits');
if (fs.existsSync(auditsDir)) {
  for (const file of fs.readdirSync(auditsDir)) {
    if (!file.endsWith('-estado.json')) continue;
    const rel = path.join('docs/audits', file);
    let estado;
    try {
      estado = JSON.parse(read(rel));
    } catch (e) {
      errors.push(rel + ' no parsea como JSON: ' + e.message);
      continue;
    }
    if (!/^\d+\.\d+$/.test(estado.schema_version || '')) {
      errors.push(rel + ': schema_version ausente o mal formada (esperado "MAJOR.MINOR")');
    }
    // el tracker hermano: mismo prefijo, -tracker.html
    const trackerRel = path.join('docs/audits', file.replace(/-estado\.json$/, '-tracker.html'));
    if (fs.existsSync(path.join(root, trackerRel))) {
      const m = read(trackerRel).match(/const LAST_AUDIT\s*=\s*"((?:[^"\\]|\\.)*)"/);
      if (!m) {
        errors.push(trackerRel + ': no encontré const LAST_AUDIT para cotejar con ' + file);
      } else if (m[1] !== estado.last_audit) {
        errors.push(rel + ': last_audit driftado vs su tracker — estado.json="' + estado.last_audit + '" vs tracker="' + m[1] + '"');
      }
    }
  }
}

if (errors.length) {
  console.error('DRIFT detectado:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('consistencia OK (marketplace↔plugin, versión↔CHANGELOG, hooks↔archivos, estado.json↔tracker)');
