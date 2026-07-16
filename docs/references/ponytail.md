---
tema: Ponytail — arquitectura de un plugin multi-agente con hooks, y qué patrones adoptamos
triggers: [hooks, statusline, lifecycle, snapshot, estado, never-block, ponytail, yagni, skills, subagentes, consistencia, CI]
fecha: 2026-07-16
fuentes:
  - https://github.com/DietrichGebert/ponytail (v4.8.4, código leído 2026-07-16)
  - Lectura directa de hooks/*.js, skills/*/SKILL.md, .claude-plugin/*.json del repo
---

# Ponytail — qué es y qué patrones de implementación adoptamos

Plugin MIT (~84k ⭐) que instala una persona de «dev senior vago» en agentes de código:
antes de escribir, el agente sube una escalera — ¿hace falta? (YAGNI) → ¿ya existe en el
codebase? → ¿stdlib? → ¿nativo de la plataforma? → ¿dependencia instalada? → ¿una línea? →
recién ahí, el mínimo que funcione — sin recortar jamás validación, errores, seguridad ni
accesibilidad. Nos interesa menos la filosofía que la **ingeniería del plugin**: es un
ejemplo maduro de plugin de Claude Code con hooks, estado y CI de consistencia.

## Arquitectura (verificada en código, no en el README)

1. **Única fuente de verdad**: el ruleset vive en `skills/ponytail/SKILL.md`; los hooks lo
   leen en runtime y lo FILTRAN por nivel de intensidad (`ponytail-instructions.js`).
   Copia hardcodeada solo como fallback de lectura. Las ~15 copias por-agente
   (`.cursor/rules/`, `AGENTS.md`, …) se validan con `scripts/check-rule-copies.js` y la
   suite falla si alguna quedó desalineada.
2. **Tres lifecycle hooks Node** (`hooks/claude-codex-hooks.json`):
   - `SessionStart` → escribe flag file `~/.claude/.ponytail-active` (modo activo), inyecta
     el ruleset como contexto, y emite un nudge de statusline UNA sola vez (flag propio).
   - `SubagentStart` → el contexto de SessionStart no llega a los subagentes del Agent
     tool; este hook re-inyecta el ruleset en cada uno (filtrable por regex vía env var).
   - `UserPromptSubmit` → parsea `/ponytail lite|full|ultra|off` y actualiza el flag file:
     el modo persiste entre turnos y la statusline lo refleja.
3. **Configuración en capas**: env var → `~/.config/ponytail/config.json` → default, y el
   flag file como estado de sesión.
4. **Contrato never-block** (lo más copiable del repo): ningún hook puede colgar ni romper
   la sesión. Timeout de stdin de 1s con `.unref()` (el wrapper PowerShell de Windows puede
   tragarse el pipe y `end` no llega jamás — su issue #443), handler de `error` en stdin,
   strip de BOM UTF-8 antes de `JSON.parse`, try/catch con fail silencioso en toda
   escritura, `commandWindows` que chequea que `node` exista, y allowlist de caracteres
   (`isShellSafe`) antes de incrustar un path en un comando de shell.
5. **Benchmarks honestos**: baseline agéntico justo, n=4, limitaciones declaradas, y la
   corrección pública de una cifra anterior inflada por artefacto de baseline. Buen molde
   para medir el valor del modo orquestado algún día.

## Qué adoptamos en audit-tracker v1.11.0

- **SessionStart + snapshot + statusline** para `/orquestar`: el orquestador mantiene
  `.claude/audit-tracker-state.json` (encargo en curso, PRs esperando firma, escalados) y
  los hooks del plugin lo inyectan al arrancar sesión y lo muestran como badge. Diferencia
  clave con ponytail: su flag file es la fuente de verdad del modo; nuestro snapshot es
  **cache de arranque** — la fuente de verdad del loop sigue siendo GitHub y la
  reconciliación (paso 1 de `/orquestar`) manda siempre.
- **El contrato never-block completo** en `plugins/audit-tracker/hooks/state.js`.
- **El nudge único de statusline** (solo si hay snapshot, sin statusline configurada y
  nunca ofrecido).
- **Check de consistencia en CI** (`scripts/check-consistency.js`): descripción
  marketplace↔plugin, versión↔CHANGELOG, hooks↔archivos. Mismo principio que su
  check-rule-copies: lo duplicado por contrato lo vigila el CI.

## Qué descartamos, y por qué (registro de decisión)

- **Skills auto-activables** para los comandos: la auto-activación le calza a ponytail
  porque su skill es guía barata y always-on. Nuestros comandos son workflows PESADOS y
  con efectos (fan-out de agentes, publicar issues, mergear PRs): que «seguí con el
  siguiente encargo» pueda autodisparar `/orquestar` es un anti-feature. Invocación
  deliberada por slash, siempre.
- **SubagentStart** para inyectar criterios de auditoría en los agentes del fan-out:
  exigiría un estado «auditoría en curso» que alguien tiene que limpiar; si la auditoría
  muere, el estado queda pegado y el hook contamina TODOS los subagentes de sesiones
  futuras. El prompt del fan-out ya lleva los criterios. Se reevalúa si aparece evidencia
  de subagentes clasificando distinto que el orquestador.
- **UserPromptSubmit**: no tenemos modos que trackear por prompt.

## Gotchas heredados que nos aplican

- Los plugins (y sus hooks) **no cargan en sesiones web/remotas** de Claude Code — ya
  verificado en este repo (ver `claude-code-plugins.md`, gotcha 1). El snapshot igual
  sirve ahí: `/orquestar` instruye leerlo a mano al arrancar.
- Un hook que escribe a stdout cuando no debe ensucia la sesión: sin snapshot, los
  nuestros no emiten NADA.

## Complementariedad (no competencia)

audit-tracker gobierna QUÉ se construye y en qué orden; ponytail gobierna CUÁNTO código se
escribe al construirlo. Instalar ponytail en las máquinas que corren `/proximo-encargo` o
`/orquestar` produce diffs más chicos en los encargos. Cero solapamiento: ellos no tocan
gestión de estado de proyecto; nosotros no tocamos estilo de código.
