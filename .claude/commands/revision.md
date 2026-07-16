---
description: Revisa los cambios pendientes contra las convenciones del repo
---

Revisá el diff pendiente (`git diff` + `git diff --cached`, y si no hay nada staged, el último commit) contra las reglas de `.claude/rules/`:

1. **Versionado**: ¿el cambio toca `plugins/audit-tracker/commands/*.md`? Entonces exige bump de versión en `plugin.json` y entrada nueva en `CHANGELOG.md` — verificá que estén.
2. **Estilo**: castellano rioplatense con voseo, vocabulario fijo del plugin (encargo, ficha, firma, veto, hallazgo, ámbar/verde), lemas en cursiva, sin emojis decorativos.
3. **Sincronía de manifiestos**: si cambió la descripción, `plugin.json` y `marketplace.json` tienen que decir lo mismo.
4. **README**: si cambió el uso visible (comandos, instalación, flujo), el README lo tiene que reflejar.
5. **Gates**: corré las mismas validaciones que el CI (ver `/validar`).

Reportá cada hallazgo con `file:line` y severidad (bloqueante / menor / sugerencia). No corrijas nada sin que te lo pidan.
