---
tema: Anatomía, instalación y gotchas de plugins/marketplaces de Claude Code
triggers: [plugin, marketplace, instalación, comandos, namespace, reload, distribución]
fecha: 2026-07-13
fuentes:
  - https://code.claude.com/docs/en/plugins.md
  - https://code.claude.com/docs/en/plugin-marketplaces.md
  - https://code.claude.com/docs/en/discover-plugins.md
  - https://code.claude.com/docs/en/claude-code-on-the-web.md
  - Verificación empírica en este repo (2026-07-13)
---

# Plugins de Claude Code — cómo se empaqueta y distribuye este plugin

## Anatomía (verificada contra docs oficiales, 2026-07-13)

```
<repo marketplace>
├── .claude-plugin/marketplace.json        ← catálogo: {name, owner, plugins:[{name, source, description}]}
└── plugins/<plugin>/
    ├── .claude-plugin/plugin.json         ← manifiesto: {name, version, description, ...}
    └── commands/*.md                      ← comandos slash (auto-descubiertos)
```

- El **nombre del marketplace** sale del `name` de `marketplace.json` (aquí: `fede-tools`) —
  es lo que va después de la `@` al instalar.
- `commands/` y `skills/` se descubren solos; no hay que declararlos en el manifiesto.
- El CI del repo (validate.yml, desde S01) protege ambos JSON y la existencia de los comandos.

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

## Estado de verificación

La instalación local end-to-end sigue SIN verificarse en máquina real → encargo S04
(issue #7). Cuando se haga, las fricciones reales de esa corrida se añaden acá y al
Troubleshooting del README.
