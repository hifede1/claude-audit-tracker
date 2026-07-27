---
tema: Anatomía, instalación y gotchas de plugins/marketplaces de Claude Code
triggers: [plugin, marketplace, instalación, comandos, namespace, reload, distribución, hooks, manifiesto, plugin.json, carga]
fecha: 2026-07-27
fuentes:
  - https://code.claude.com/docs/en/plugins.md
  - https://code.claude.com/docs/en/plugin-marketplaces.md
  - https://code.claude.com/docs/en/discover-plugins.md
  - https://code.claude.com/docs/en/claude-code-on-the-web.md
  - Verificación empírica en este repo (2026-07-13)
  - Instalación end-to-end en config aislada (2026-07-18) — origen del gotcha 7
---

# Plugins de Claude Code — cómo se empaqueta y distribuye este plugin

## Anatomía (verificada contra docs oficiales, 2026-07-13)

```
<repo marketplace>
├── .claude-plugin/marketplace.json        ← catálogo: {name, owner, plugins:[{name, source, description}]}
└── plugins/<plugin>/
    ├── .claude-plugin/plugin.json         ← manifiesto: {name, version, description, hooks?, ...}
    ├── commands/*.md                      ← comandos slash (auto-descubiertos)
    └── hooks/hooks.json + *.js            ← lifecycle hooks (declarados vía "hooks" del manifiesto)
```

- El **nombre del marketplace** sale del `name` de `marketplace.json` (aquí: `fede-tools`) —
  es lo que va después de la `@` al instalar.
- `commands/` y `skills/` se descubren solos; no hay que declararlos en el manifiesto.
  Los **hooks** sí se declaran: campo `"hooks": "./hooks/hooks.json"` en plugin.json; los
  comandos del hook referencian sus scripts vía `${CLAUDE_PLUGIN_ROOT}` (desde v1.11.0,
  patrón tomado de ponytail — ver `ponytail.md`).
- El CI del repo (validate.yml, desde S01) protege ambos JSON, la existencia de los
  comandos y (desde v1.11.0) la sintaxis de los hooks + la consistencia
  marketplace↔plugin↔CHANGELOG (`scripts/check-consistency.js`). El check recorre **todas**
  las entradas del catálogo: las de source local se validan `name`/`description` contra su
  `plugin.json`; las externas (`git-subdir`, p.ej. `doc-arquitecto` → otro repo) se validan
  solo en la forma del `source` (`url`/`path` presentes) — su `description` NO se coteja
  contra la fuente remota, que vive en otro repo y no se lee en este CI.

## Instalación (flujo exacto)

Interactivo:
```
/plugin marketplace add hifede1/claude-audit-tracker
/plugin install audit-tracker@fede-tools
/reload-plugins          ← OBLIGATORIO: sin esto el comando no aparece
```
Terminal: `claude plugin marketplace add …` / `claude plugin install … --scope user`.
Verificación: `/plugin list` (o menú `/plugin` → Installed / Errors).

## Gotchas COMPROBADOS (no teóricos)

1. **Los plugins NO existen en sesiones web/remotas** — verificado 2026-07-13: `/plugin`
   devuelve «isn't available in this environment». Son exclusivos del CLI local
   (`~/.claude/plugins/`). **Workaround web**: copiar los comandos a `.claude/commands/`
   del repo del PROYECTO a auditar (los comandos a nivel repo sí cargan en web).
2. **`/reload-plugins` tras instalar** — el paso que todo el mundo se salta.
3. **Namespace**: la forma estable es `/audit-tracker:audit-tracker` (plugin:comando);
   la corta `/audit-tracker` puede colisionar.
4. **Caché del marketplace**: los cambios en el repo no llegan solos —
   `claude plugin marketplace update fede-tools` y reinstalar.
5. **Repo privado**: el CLI necesita `GITHUB_TOKEN`/`GH_TOKEN` exportado para clonar el
   marketplace.
6. **Scope**: instalar en scope `local` no viaja a otras sesiones/máquinas; usar
   `--scope user` para tenerlo en toda la máquina.
7. **⚠️ NO declares `hooks` en el manifiesto del plugin** — *el más caro de esta lista.*
   Claude Code **auto-carga** `hooks/hooks.json` desde su ubicación estándar. Si además lo
   declarás en `plugin.json` (`"hooks": "./hooks/hooks.json"`), se carga **dos veces**:
   `Duplicate hooks file detected` → **`Status: ✘ failed to load`**. El plugin entero deja de
   cargar, no solo los hooks.
   **Verificado el 2026-07-18** en instalación limpia con config aislada (`CLAUDE_CONFIG_DIR`).
   Fix: quitar la referencia del manifiesto — los hooks se auto-cargan igual
   ([PR #27](https://github.com/hifede1/claude-audit-tracker/pull/27), v1.11.1).
   **Por qué nadie lo vio antes:** ver §Estado de verificación — este fallo solo aparece al
   instalar, y nada en el pipeline instalaba.

## Estado de verificación

**Instalación end-to-end: VERIFICADA el 2026-07-18** (encargo S04, issue #7), en config aislada
con `CLAUDE_CONFIG_DIR` → `Status: ✔ enabled`.

Esa corrida produjo el fix de la v1.11.1, y sus fricciones se incorporaron acá y al
§Troubleshooting del README.

> **La lección, que vale más que el gotcha:** la v1.11.0 se publicó con el plugin roto y nadie
> lo notó, porque **el pipeline validaba los JSON y la estructura pero nada instalaba el
> plugin** — y el fallo solo aparece al instalar. El pendiente que lo habría atrapado
> (`p-install`) existía y llevaba semanas abierto.
>
> *Un artefacto que no se instala nunca no está verificado: está declarado.*
