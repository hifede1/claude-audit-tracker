---
description: Corre localmente los mismos checks que el CI (validate.yml)
---

Corré los tres gates de `.github/workflows/validate.yml` y reportá el resultado de cada uno:

1. **Manifiestos JSON parseables**:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('marketplace.json OK')"
   node -e "JSON.parse(require('fs').readFileSync('plugins/audit-tracker/.claude-plugin/plugin.json','utf8')); console.log('plugin.json OK')"
   ```
2. **Estructura del plugin** — existen los tres comandos:
   ```bash
   test -f plugins/audit-tracker/commands/audit-tracker.md
   test -f plugins/audit-tracker/commands/proximo-encargo.md
   test -f plugins/audit-tracker/commands/orquestar.md
   ```
3. **Sintaxis JS del tracker** (si existe `docs/audits/claude-audit-tracker-tracker.html`): extraé el bloque `<script>` y corré `node --check` sobre él, igual que el CI.

Si algo falla, mostrá el error exacto y proponé el fix mínimo. No commitees con un gate rojo.
