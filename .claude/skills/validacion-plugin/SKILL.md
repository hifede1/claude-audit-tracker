---
name: validacion-plugin
description: Valida manifiestos, estructura y consistencia del plugin audit-tracker. Usar después de editar marketplace.json, plugin.json, los comandos del plugin o el tracker HTML, y siempre antes de commitear cambios del plugin.
---

# Validación del plugin

Después de editar manifiestos, comandos o el tracker, corré esta secuencia (el CI corre exactamente los mismos checks — un fallo acá es un CI rojo seguro):

1. **JSON parseable**: `node -e "JSON.parse(...)"` sobre `.claude-plugin/marketplace.json` y `plugins/audit-tracker/.claude-plugin/plugin.json`.
2. **Estructura**: existen los tres comandos en `plugins/audit-tracker/commands/` (`audit-tracker.md`, `proximo-encargo.md`, `orquestar.md`).
3. **Tracker**: si se tocó `docs/audits/claude-audit-tracker-tracker.html`, extraer el bloque `<script>` y correr `node --check`.
4. **Consistencia** (esto el CI no lo cubre — cazalo acá):
   - `version` de `plugin.json` ↔ última entrada del `CHANGELOG.md`.
   - `description` de `plugin.json` ↔ entrada del plugin en `marketplace.json`.
   - Comandos documentados en el README ↔ archivos reales en `commands/`.

Cualquier fallo se corrige **antes** de commitear.
