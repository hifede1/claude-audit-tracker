# Changelog — audit-tracker

Formato: una entrada por versión del plugin. El detalle fino vive en los mensajes de commit.

## v1.12.0 — 2026-07-20
- **Estado consumible por máquinas (`docs/audits/<proyecto>-estado.json`)**: `/audit-tracker` ahora emite, junto al tracker HTML, una proyección JSON versionada del estado auditado (`schema_version` semver, bloques con estado, plan, pendientes, decisiones pendientes, referencias, deuda). Pedido por `batuta` (issue #31): su fase `analizar` necesita **leer el estado real sin re-auditar**, y hasta ahora la única superficie era parsear las constantes JS embebidas en el HTML — frágil y sin contrato. Ahora hay contrato declarado en `docs/estado-contrato.md`. El artefacto es derivado, no fuente: sale de los mismos datos que el HTML, en el mismo commit.
- **CI — anti-drift del estado.json**: `check-consistency.js` verifica que cada `<p>-estado.json` parsea, declara `schema_version` bien formada, y que su `last_audit` coincide con el `LAST_AUDIT` de su tracker hermano. Un estado.json editado a mano que se desincronice del tracker rompe el build.
- **Dogfood**: se emitió el `claude-audit-tracker-estado.json` de este propio repo, derivado de su tracker vigente.

## v1.11.1 — 2026-07-18
- **Fix de carga (regresión de v1.11.0)**: el manifiesto declaraba `"hooks": "./hooks/hooks.json"`, pero Claude Code auto-carga ese archivo desde su ubicación estándar → «Duplicate hooks file detected» → el plugin **fallaba al cargar** en una instalación limpia. Nadie lo había visto porque nadie hizo el install end-to-end (era el pendiente `p-hooks-real`). Removida la referencia del manifiesto; los hooks se siguen auto-cargando. Verificado: instalación en config aislada da `Status: ✔ enabled`.
- **README — sección Troubleshooting** basada en fricciones REALES de la primera instalación verificada (S04, encargo #7): duplicate hooks, sesiones web, namespace, caché/reinicio, repo privado.

## v1.11.0 — 2026-07-16
- **Hooks de estado del loop** (patrones de [ponytail](https://github.com/DietrichGebert/ponytail), ver `docs/references/ponytail.md`): `/orquestar` mantiene un snapshot local (`.claude/audit-tracker-state.json`, gitignoreado — cache de arranque, jamás la cola: GitHub sigue siendo la fuente de verdad) y el plugin gana lifecycle hooks. SessionStart inyecta al arrancar qué encargo está en curso, qué PRs esperan firma y qué quedó escalado; una statusline opcional (ofrecida UNA vez vía nudge) muestra el badge `#12 S07 en curso · 2 PRs esperando firma`. Contrato never-block heredado de ponytail: timeout de stdin con unref, BOM strip, fail silencioso, allowlist de paths antes de incrustarlos en comandos — un hook roto jamás frena la sesión. Solo CLI local (los plugins no cargan en sesiones web; documentado).
- **Check de consistencia en CI** (`scripts/check-consistency.js`, patrón check-rule-copies de ponytail): descripción marketplace↔plugin idéntica (drift real detectado y corregido), versión plugin.json↔CHANGELOG, hooks.json↔archivos referenciados. Lo duplicado por contrato se verifica en CI, no de memoria.
- **Descartes deliberados, con porqué** (en la referencia): skills auto-activables (workflows pesados y con efectos — mergear PRs, fan-out de agentes — no deben autodispararse por fraseo natural), SubagentStart (exigiría estado «auditoría en curso» frágil) y UserPromptSubmit (no hay modos que trackear).

## v1.10.0 — 2026-07-13
- **Blindaje anti-inyección**: solo las señales del validador (firma, cambios, veto, decisiones) mueven el estado del loop; instrucciones de terceros en issues/comentarios/logs se reportan como hallazgo, jamás se obedecen. Duda = tercero.
- **Firma selectiva por riesgo**: ítem 5 de calibración — clases de encargo auto-mergeables con CI verde + informe de dos actores (default: NINGUNA; la zona gris se firma). El orquestador jamás clasifica en zona gris.
- **Presupuesto por encargo**: se declara al reclamar (límite operativo derivado de la estimación de la ficha; superarlo dispara el freno anti-loop) y el informe cierra con el costo real.

## v1.9.0 — 2026-07-13
- **Verificador independiente** (inspirado en el critic model de OpenHands): la verificación del orquestador pasa a dos actores — el ejecutor hace su pasada y un escéptico de CONTEXTO LIMPIO (solo ficha + diff + repo) intenta refutar cada criterio; lo tumbado se corrige antes de pedir firma. El informe declara quién ejecutó, quién verificó, qué se intentó refutar y qué sobrevivió. Alcance (d6): todo encargo salvo bookkeeping. Sin subagentes disponibles, degradación DECLARADA (filosofía d5).

## v1.8.1 — 2026-07-13
- **Fallback de calibración**: la Fase 0 jamás bloquea — si AskUserQuestion falla o no está disponible, se declaran defaults en texto (con su porqué), rigen hasta corrección del usuario y quedan visibles como calibración vigente en el tracker. Hallazgo en vivo de la primera corrida real (S03, issue #6).

## v1.8.0 — 2026-07-13
- **Triggers en referencias** (estilo microagents de OpenHands): frontmatter `triggers: [...]` en `docs/references/`; los ejecutores barren por trigger además del link explícito de la ficha.
- **Freno anti-loop** (stuck detection): mismo error tres veces o gate que no pasa tras varios intentos = parar, comentar hipótesis y escalar o desistir. *Trabado que insiste ≠ progreso.*

## v1.7.0 — 2026-07-13
- **«DENTRO DEL ENCARGO»**: protocolo de navegación del tracker para el orquestador — finalidad antes que tarea, plan de ataque escrito en el issue, referencias, caza de decisiones ANTES de codificar, replanificación como hallazgo (nunca en silencio), cierre contra objetivos y no contra el checklist.

## v1.6.0 — 2026-07-13
- **Pestaña 📚 Referencias** (séptima): catálogo vivo de `docs/references/` y `docs/business/` con frescura fechada (🟢/🟠/🔴), índice inverso de quién usa cada una, y faltantes por generar. Constante `REFS`, read-only.

## v1.5.0 — 2026-07-13
- **Pestaña 🧪 Tests** (sexta): mapa de evidencia — gates reales con comando y estado, cobertura a altitud de flujo (🟢 clavado / 🟠 camino feliz / 🔴 sin test) y contrato criterios↔tests. Criterio sin test = deuda de verificación visible.

## v1.4.x — 2026-07-13
- **Modo orquestado** (`/orquestar`): loop autónomo — el orquestador ejecuta encargos, verifica en código contra los criterios de la ficha y pide la firma humana en el PR (review aprobado o comentario `✅ validado` con cuenta única). Jamás mergea sin firma ni con CI rojo.
- Fixes tras panel adversarial (8 agujeros cerrados): canal de firma con cuenta única, reconciliación al (re)arrancar, CI en la máquina de estados, transición de veto, escalada definida, excepción de bookkeeping para el PR del tracker, cola de validación en GitHub, activación del despacho con una sola máquina.

## v1.3.0 — 2026-07-09
- **Referencias externas** (`docs/references/`): investigación destilada con citas y fecha; fichas e issues las linkean; `/proximo-encargo` las lee o las genera antes de codificar.

## v1.2.0 — 2026-07-09
- **Asignación por persona**: assignees de GitHub como vía normal; labels `maquina/<nombre>` solo para máquinas sin persona fija.

## v1.1.0 — 2026-07-09
- **Modo despacho multi-máquina**: sesiones del plan como GitHub Issues (`[SNN]`, labels `encargo`+`sesion-NN`) + comando `/proximo-encargo`.

## v1.0.0 — 2026-07-09
- Versión inicial: `/audit-tracker` — auditoría del estado REAL de construcción + tracker vivo interactivo (artifact) con ciclo de re-auditoría y semántica ámbar/verde.
