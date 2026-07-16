# Estructura del repo — qué va dónde

- Los comandos **que se distribuyen** viven en `plugins/audit-tracker/commands/` — el CI verifica que estén los tres (`audit-tracker.md`, `proximo-encargo.md`, `orquestar.md`). **NO moverlos a `.claude/commands/`**: el formato de plugin de Claude Code exige esa ruta.
- `.claude/commands/` es solo para comandos de mantenimiento de ESTE repo (revisión, validación, releases).
- Plugin nuevo = carpeta `plugins/<nombre>/` con su propio `.claude-plugin/plugin.json` + entrada en `.claude-plugin/marketplace.json` + pasos de validación nuevos en `.github/workflows/validate.yml`.
- Referencias nuevas van a `docs/references/` con frontmatter `triggers: [...]` y fecha.
- El tracker HTML del repo vive en `docs/audits/` y se redeploya siempre a la misma URL.
- `CLAUDE.local.md` y `.claude/settings.local.json` son personales y están git-ignorados: jamás commitearlos.

## Cómo crece el esqueleto `.claude/` — seguir SIEMPRE esta anatomía

Cuando se agregue una pieza nueva de configuración de Claude Code, va en su carpeta según su tipo — nunca suelta en la raíz ni mezclada con el plugin:

| Pieza nueva | Ruta exacta | Formato exigido |
|---|---|---|
| Comando slash del repo | `.claude/commands/<nombre>.md` | frontmatter `description` (+ `argument-hint` si toma argumentos); se invoca como `/<nombre>` |
| Regla / convención | `.claude/rules/<tema>.md` | markdown corto y accionable; **además hay que sumar la línea `@.claude/rules/<tema>.md` en `CLAUDE.md`** — sin el import, la regla no se carga nunca |
| Skill (flujo auto-invocado) | `.claude/skills/<nombre>/SKILL.md` | carpeta propia en kebab-case; el archivo se llama exactamente `SKILL.md`, con frontmatter `name` + `description` (la `description` es lo que dispara la auto-invocación: escribí ahí *cuándo* usarla); archivos auxiliares de la skill van dentro de la misma carpeta |
| Subagente | `.claude/agents/<nombre>.md` | frontmatter `name`, `description` (incluye cuándo usarlo) y `tools` con el mínimo necesario — los revisores/auditores van de solo lectura (`Read, Grep, Glob`) |
| Permiso compartido | `.claude/settings.json` → `permissions.allow` | solo permisos que todo el equipo quiere pre-aprobados; lo personal va a `settings.local.json` (git-ignorado) |
| Instrucción de equipo | `CLAUDE.md` | solo el mapa y lo transversal; si crece más de unas líneas, extraerlo a una regla e importarla |

Criterio rápido para elegir tipo: ¿lo invoca el usuario a mano? → **comando**. ¿Debe aplicarse solo en el momento justo según contexto? → **skill**. ¿Es una convención que rige siempre? → **regla**. ¿Es una persona revisora con contexto propio? → **agente**.

Esta tabla es el contrato del esqueleto: si una pieza nueva no encaja en ninguna fila, se discute antes de inventar una carpeta nueva.
