# Changelog — audit-tracker

Formato: una entrada por versión del plugin. El detalle fino vive en los mensajes de commit.

## v1.14.0 — 2026-07-28
- **La asignación pasa de sugerencia a CONDICIÓN DE PUBLICACIÓN** (issue #59). Un issue `encargo` nace con assignee **o** con label `maquina/<nombre>`; sin ninguno de los dos está mal publicado. Motivo medido: `/proximo-encargo` busca por `--assignee @me`, así que un encargo huérfano queda abierto y tomable **siendo invisible para el único comando que existe para tomarlo** — **3 de los 5 encargos publicados hasta el 2026-07-28 lo eran**, y la única corrida real que funcionó lo hizo por azar (el `#41` tenía assignee; si le tocaba el `#40`, habría reportado «no hay encargos» con la cola llena). La causa raíz es una costura: `/audit-tracker` manda asignar, `/orquestar` reclama por comentario 🔒 y nunca asigna — **dos comandos comparten una cola y la leen por campos distintos**.
- **La re-auditoría verifica la cola: `encargo` abierto sin dueño = drift, y el despachador lo repara en el acto.** El chequeo **no** va a `scripts/check-consistency.js` y el porqué queda escrito: ese script es offline y determinista, y meterle red, token y estado remoto le arruina la propiedad que lo hace confiable. Vive donde `gh` ya está en la mano.
- **`/proximo-encargo` deja de confundir «no hay trabajo» con «hay trabajo sin dueño».** Ante cero resultados, ahora separa la cola en encargos de otros y **huérfanos**, y los reporta por número como hallazgo. Con la prohibición explícita de auto-asignárselos: asignar es del despachador — si el ejecutor se adjudica un huérfano, el reparto pasa a decidirse por orden de llegada y deja de ser decisión de nadie.
- **La referencia de verificación crece a tres familias** (`docs/references/verificacion-de-criterios.md`): a las cuatro trampas del chequeo sobre prosa se suman el falso negativo **por campo** (este caso — el primero del repo: los cuatro anteriores son sobre texto) y la **medición defectuosa** (dos casos del mismo día: el exit code leído detrás de un `| head`, y un `md5` medido después de un `cd` en el mismo comando compuesto). La regla se generaliza: **el significado no vive donde el detector mira** — la cadena, el campo, o el instrumento. Y suma el criterio que faltaba: *ante un verde o un cero, sospechá igual* — un falso positivo grita, **un falso negativo se ve idéntico a «todo en orden»**.
- **Drift corregido en el encabezado del tracker**: declaraba `plano firmado 2026-07-27` con la firma real en `2026-07-28`. El gate de v1.13.0 no lo vio porque **solo coteja la versión del plugin** — la misma familia 2 de arriba, ocurriendo dentro del gate que se creó para vigilar ese encabezado. El dato se corrige acá; extender el gate a la fecha de firma queda como hallazgo abierto en el issue #59.

## v1.13.0 — 2026-07-27
- **Post-mortem: un veto o una escalada resuelta DESTILA su lección** (S06, issue #9 — abierto el 2026-07-13 y en pausa hasta hoy). `/orquestar` gana la obligación: al cerrarse un episodio —veto, o escalada que el validador destrabó— la lección va a la referencia del tema en `docs/references/` (o al 🛠️ método de la ficha si es específica del bloque), **con fecha y link al PR/issue de origen**. Sin link no es lección: es una opinión fechada. Si el tema no tiene referencia, se crea con sus `triggers` — sin ellos el conocimiento no encuentra al encargo siguiente (`decisiones/009`). **Y si el episodio no dejó conocimiento, se declara que no lo dejó**: inventarle una lección llena la referencia de ruido y entrena a saltearla, que es el modo exacto en que un sistema de conocimiento muere.
- **La re-auditoría lo verifica: veto o escalada sin lección destilada = PENDIENTE NUEVO.** `/audit-tracker` comprueba por evidencia —escrita, fechada y con link— cada episodio cerrado desde la última auditoría, y abre pendiente si falta. Un episodio que declaró explícitamente no haber dejado lección **cumple** la regla: la ausencia declarada es un resultado, el silencio no.
- **Primera lección destilada** (`docs/references/verificacion-de-criterios.md`): las **cuatro** formas verificadas en que un chequeo mecánico sobre prosa da falso —la línea de firma escrita como *ejemplo*, un regex greedy, una afirmación **citada dentro de su propia corrección**, y una declaración **partida por un salto de línea**—. Los cuatro eran defectos del verificador, no del archivo. Con su lección de segundo orden: **una lección aprendida no se transfiere sola al caso siguiente** — el mismo defecto de duplicación que un criterio atrapó en el PR #45 se repitió dos PRs después en el #46, y lo encontró el validador, no el ejecutor. Por eso la lección va a una referencia con `triggers` y no al comentario del PR donde se aprendió.
- **Contexto del cierre**: S06 estaba **gated por un EVENTO** desde el 2026-07-13 —esperaba el primer veto real, que en 6 ciclos del loop no había ocurrido—. Lo destrabó S08 provocándolo a propósito (PR #44). Ese veto fue un ejercicio, no un rechazo por defecto, y **se registró como tal**: la lección destilada sale de la ronda de cambios del #46 y del patrón acumulado, no del veto.

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
