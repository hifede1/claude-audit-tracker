# Estructura del repo — qué va dónde

- Los comandos **que se distribuyen** viven en `plugins/audit-tracker/commands/` — el CI verifica que estén los tres (`audit-tracker.md`, `proximo-encargo.md`, `orquestar.md`). **NO moverlos a `.claude/commands/`**: el formato de plugin de Claude Code exige esa ruta.
- `.claude/commands/` es solo para comandos de mantenimiento de ESTE repo (revisión, validación, releases).
- Plugin nuevo = carpeta `plugins/<nombre>/` con su propio `.claude-plugin/plugin.json` + entrada en `.claude-plugin/marketplace.json` + pasos de validación nuevos en `.github/workflows/validate.yml`.
- Referencias nuevas van a `docs/references/` con frontmatter `triggers: [...]` y fecha.
- El tracker HTML del repo vive en `docs/audits/` y se redeploya siempre a la misma URL.
- `CLAUDE.local.md` y `.claude/settings.local.json` son personales y están git-ignorados: jamás commitearlos.
