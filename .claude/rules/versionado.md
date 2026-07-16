# Versionado

- Todo cambio de comportamiento del plugin sube la versión en `plugins/audit-tracker/.claude-plugin/plugin.json` (semver: major = incompatible, minor = feature nueva, patch = fix).
- Cada versión agrega una entrada **arriba de todo** en `CHANGELOG.md` con el formato `## vX.Y.Z — AAAA-MM-DD` y bullets con la feature en **negrita**. El detalle fino vive en los mensajes de commit.
- Si cambia la descripción del plugin, sincronizar `plugin.json` y `marketplace.json` (dicen lo mismo con distinto nivel de detalle).
- El README se actualiza solo cuando cambia el uso visible: comandos, instalación o flujo.
- Cambio sin bump de versión = solo docs, CI o configuración del repo; cualquier edición a `plugins/audit-tracker/commands/*.md` es comportamiento y exige bump.
