---
description: Prepara una nueva versión del plugin (bump + changelog)
argument-hint: [major|minor|patch] [resumen del cambio]
---

Prepará el release: $ARGUMENTS

1. Leé la versión actual en `plugins/audit-tracker/.claude-plugin/plugin.json` y calculá la nueva según semver (major = incompatible, minor = feature, patch = fix).
2. Actualizá `version` en `plugin.json`.
3. Agregá la entrada **arriba de todo** en `CHANGELOG.md`: `## vX.Y.Z — AAAA-MM-DD` (fecha de hoy) con bullets y la feature en **negrita**, siguiendo el formato de las entradas existentes.
4. Si el cambio afecta el uso visible, actualizá el README y las descripciones de `plugin.json` y `marketplace.json` (sincronizadas).
5. Corré `/validar` y mostrá el diff completo antes de commitear.
