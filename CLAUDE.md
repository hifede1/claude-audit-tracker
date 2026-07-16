# claude-audit-tracker

Marketplace de plugins de Claude Code (`fede-tools`). Contiene un solo plugin: **audit-tracker** — tres comandos (`/audit-tracker`, `/proximo-encargo`, `/orquestar`) para auditar el estado REAL de un proyecto, repartir trabajo vía GitHub Issues y correr un loop orquestado con validación humana.

## Mapa del repo

- `.claude-plugin/marketplace.json` — manifiesto del marketplace: registra los plugins y su `source`.
- `plugins/audit-tracker/` — **el producto que se distribuye**: `.claude-plugin/plugin.json` (manifiesto + versión) y `commands/*.md` (los tres comandos).
- `docs/references/` — investigación destilada con citas y fecha (frontmatter `triggers`).
- `docs/audits/` — tracker HTML del propio repo.
- `CHANGELOG.md` — una entrada por versión del plugin; el detalle fino vive en los commits.
- `.claude/` — configuración para trabajar **EN** este repo (comandos de mantenimiento, reglas, skills, agentes). No confundir con `plugins/audit-tracker/commands/`, que es lo que se instala en las máquinas de los usuarios.

## Reglas

@.claude/rules/estilo.md
@.claude/rules/versionado.md
@.claude/rules/estructura.md

## Gates

El CI (`.github/workflows/validate.yml`) valida tres cosas: manifiestos JSON parseables, presencia de los tres comandos del plugin, y sintaxis JS del tracker HTML. Corré `/validar` antes de commitear — corre exactamente los mismos checks.
