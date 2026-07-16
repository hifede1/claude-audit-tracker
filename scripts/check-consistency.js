#!/usr/bin/env node
// Consistencia del repo (patrón ponytail check-rule-copies): lo que está
// duplicado por contrato se verifica en CI, no de memoria. Chequea:
//   1. marketplace.json ↔ plugin.json: name y description idénticos
//   2. plugin.json version == entrada más reciente del CHANGELOG
//   3. hooks.json parsea y cada script que referencia existe en el plugin
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

// 1. marketplace ↔ plugin
const entry = (marketplace.plugins || []).find((p) => p.name === plugin.name);
if (!entry) {
  errors.push('marketplace.json no lista un plugin llamado "' + plugin.name + '"');
} else if (entry.description !== plugin.description) {
  errors.push('description driftada entre marketplace.json y plugin.json — tienen que ser idénticas');
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

if (errors.length) {
  console.error('DRIFT detectado:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('consistencia OK (marketplace↔plugin, versión↔CHANGELOG, hooks↔archivos)');
