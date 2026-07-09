# /audit-tracker — Auditoría de estado + Tracker vivo del proyecto

Sos auditor técnico senior y arquitecto. Vas a hacer dos cosas, en orden:
(1) **auditar el estado REAL de construcción** de este proyecto contra su plan/documentación, y
(2) **construir un tracker vivo interactivo** (artifact) para gestionar lo que falta, con fichas de trabajo, plan de sesiones y ciclo de re-auditoría.

Contexto adicional del usuario (si lo hay): $ARGUMENTS

---

## FASE 0 — Calibración (preguntar ANTES de construir, con AskUserQuestion)

1. **Unidad de estimación**: recomendá «sesiones de trabajo» (~2-4h de Claude Code); alternativas: tallas S/M/L u horas.
2. **Actores**: ¿solo el usuario + Claude, o varias personas? (El artifact tiene CSP estricta: NO puede hablar con ningún backend; los ticks viven en localStorage de UN navegador. Si hay varias personas, anotá como tarea futura mover el estado compartido dentro de la app del proyecto — el tracker sigue sirviendo como informe + fichas.)
3. **Metodología**: si el proyecto usa SDD u otro método formal, proponé tratamiento MIXTO según envergadura (el ritual completo solo donde hay decisiones de diseño y escenarios que fijar; lo mecánico va directo). No apliques el método a todo: se quema.

## FASE 1 — Auditoría

- Leé la documentación de alcance (CLAUDE.md, README, docs/, roadmap, specs, plan de implementación) → extraé la lista de BLOQUES/módulos previstos y sus fases.
- **Fan-out de agentes Explore en paralelo** (uno por clúster de módulos). Cada agente: leer el doc del módulo, inspeccionar el código real (rutas, modelos, pantallas, lógica), y reportar con evidencia `file:line`. Buscar específicamente: TODOs/FIXMEs, botones sin handler, features detrás de flags apagados, funciones/endpoints sin llamadores, código dormant.
- Verificá **BD/migraciones** (repo vs producción si hay acceso) y el **historial de git** reciente.
- Corré los **gates reales** (typecheck, tests, lint) como evidencia de verificación — no te fíes de lo que digan los docs.
- **Criterio de HECHO — los tres o no está hecho**: funciona de punta a punta (flujo real, no camino feliz) + resiste errores y casos borde + está verificado. Sé escéptico: sin evidencia → EN CURSO o MAQUETA, nunca HECHO.
- Clasificá cada bloque: ✅ HECHO / 🟠 EN CURSO (qué falta exactamente) / ⚪ PENDIENTE / ⚠️ MAQUETA (existe pero es andamiaje).
- Si dos agentes se contradicen, gana la evidencia más fuerte (código/trigger real > comentario de doc). El **drift doc↔código es hallazgo de primera clase**: listalo punto por punto.
- Entregá primero el informe en texto: veredicto de una línea (fase actual + siguiente bloque recomendado), tabla Bloque|Estado|Qué existe|Qué falta, sección maqueta/deuda, recomendación de orden **de dentro hacia afuera** (cimientos → núcleo → automatismos → externo).

## FASE 2 — Tracker vivo (artifact HTML autocontenido)

Archivo **dentro del repo** (`docs/audits/<proyecto>-tracker.html` o equivalente), publicado como Artifact. Reglas duras:

- **Autocontenido** (CSP: sin CDNs, sin fetch): datos como constantes JS editables al inicio del script — `LAST_AUDIT`, `DATA` (zonas→bloques), `DEBT`, `EST` (estimación por pendiente), `PLAN` (sesiones), `CHANGELOG`, `CLOSED_COUNT`, `DECISIONS` (registro ADR de decisiones tomadas/pendientes) y `DECISION_PENDS` (decisiones pendientes derivadas de `pend`) — y la lógica de render separada, que NO se toca en actualizaciones normales.
- **Ticks en localStorage con IDs ESTABLES** (sobreviven redeploys; jamás renombrar ids). Semántica de dos colores: **ámbar** = marcado por el usuario, sin verificar; **verde** = cerrado y verificado en re-auditoría.
- **Comentario al inicio del archivo** con la URL del artifact y el protocolo de actualización (para que cualquier sesión futura sepa mantenerlo).
- Temas claro/oscuro vía tokens CSS (`prefers-color-scheme` + `data-theme` override). Validar el JS con `node --check` antes de CADA deploy.

**Cinco pestañas:**

1. **📋 Tablero** — tarjetas por bloque (pill de estado, pendientes abiertos, carga estimada, próximo ítem). Cada tarjeta abre su **FICHA DE TRABAJO**: 🎯 *Planteamiento* (qué es y por qué importa — el problema real, no descripción genérica) · 🛠️ *Cómo trabajarlo* (método paso a paso con el workflow REAL del proyecto: qué verificar antes, qué decisiones de negocio hay que tomar ANTES de escribir código, gotchas conocidos) · ✅ *Resultados esperados* (criterios de cierre VERIFICABLES, no vaguedades) · checklist de pendientes · botón **«Copiar encargo»** (prompt completo con la ficha + pendientes abiertos, listo para pegar en Claude Code). Los bloques cerrados también llevan ficha, en modo «cómo protegerlo al tocarlo». + Sección Maqueta/Deuda transversal + Historial de actualizaciones + instrucciones de uso.
2. **🗓️ Plan de sesiones** — cada pendiente con su estimación (chip); sesiones numeradas ordenadas por **dependencias** (higiene/cimientos primero), cada una con ficha propia (objetivo en una frase, ⛓️ prerrequisitos explícitos, método, tareas marcables, encargo copiable por sesión). Si hay metodología formal: **badge de tratamiento por sesión** (p.ej. SDD completo `/sdd-new` · ligero `/sdd-ff` · directo) y el encargo genera el arranque correcto. Resumen arriba: total estimado, completadas, restantes según ticks, **próxima sesión resaltada**. Un trabajo grande puede ser UN solo change de la metodología atravesando varias sesiones (abrir → continuar → verificar/archivar).
3. **🗺️ Mapa** — los bloques como diagrama de flujo end-to-end; nodos clickeables (abren la MISMA ficha del tablero) con su pill de estado; las aristas dicen **qué dispara cada paso y si es automático o humano** (ahí se ve dónde el sistema fluye solo y dónde depende de memoria humana).
4. **🔧 Stack** — herramientas por capa (cliente / datos / servicios / calidad) con rol, conexiones y ⚠️ warnings (dormant, sin cron, deuda) + **5-7 recorridos reales de un dato punta a punta** («si entendés estos recorridos, entendés el sistema»).
5. **⚖️ Decisiones** — registro tipo **ADR** para auditar el **porqué** del sistema (no solo el qué). Ficha por decisión: contexto/problema · opciones evaluadas con tradeoffs · decisión + porqué · consecuencias · `superaA` (texto de la decisión anterior que reemplazó) · links al bloque/sesión/PR/migración. **Dos ciclos de vida separados** (esto es la clave anti-drift): (a) las decisiones TOMADAS/superadas viven en `DECISIONS` = **log aditivo** curado (fuente externa: engram + docs → no duplica); (b) las PENDIENTES que ya son un `pend` de DATA **NO se copian** — se **derivan en vivo** vía `DECISION_PENDS` (lista de `{pendId, note}`) con `findPend()`: si el `pend` se cierra en re-auditoría, la ficha desaparece sola (cero fantasma, cero doble fuente). Las pendientes que NO existen como `pend` (decisiones de pricing con un tercero) sí viven en `DECISIONS` con `estado:'pendiente'` y NO cuentan para el % de progreso. Read-only: las fichas **no emiten `data-id`** (jamás tocan ticks/progreso). Filtros namespaced `.dchip` (NO reusar `.chip` del board). Criterio de inclusión: solo lo **estructural** (mueve precio de venta, cambia el modelo de datos, o depende de un tercero) — herramienta, no monumento.

Navegación cruzada: chip de sesión en cada pendiente (salta a la ficha de sesión), tratamiento visible también en la ficha del bloque, tabs con hash en la URL.

## FASE 3 — Ciclo de vida

- El loop completo: **abrir ficha → copiar encargo → sesión de trabajo → el usuario dice «actualizá el tracker» → RE-AUDITORÍA**: re-verificás EN CÓDIGO los ticks ámbar (jamás confíes en el tick), borrás de DATA/DEBT/EST/PLAN los confirmados, sumás su número a CLOSED_COUNT, recalculás estados de bloque, entrada fechada en CHANGELOG, actualizás mapa/stack si un automatismo cambió de «manual» a «auto», **redeploy A LA MISMA URL** (parámetro `url` del tool Artifact — URL nueva = tracker roto), commit.
- **Mantené el registro de Decisiones (`DECISIONS`/`DECISION_PENDS`)** en cada re-auditoría: cuando cierres un bloque/sesión cuya decisión de diseño valga para auditar, **añadí** una ficha (log aditivo, id estable, jamás borres una tomada). Cuando una decisión reemplace a otra, poné el texto legible de la anterior en `superaA`. Cuando se **resuelva una pendiente de negocio**, cambiá su `estado` a `aceptada`/`rechazada` con fecha y completá su porqué. Las pendientes que ya viven como `pend` NO se copian: se derivan vía `DECISION_PENDS` (si el `pend` se cierra, la ficha desaparece sola). Aplicá el criterio de inclusión estructural — si no ayuda a auditar dinero/modelo/tercero, no entra.
- Si vos mismo verificaste un cierre (p.ej. mergeaste el PR con CI verde), podés re-auditarlo en el momento.
- **Persistí en memoria**: URL fija del artifact, ruta del archivo fuente, protocolo de actualización, decisiones del usuario (unidad, actores, metodología). La próxima sesión no puede arrancar ciega.
- Commit del tracker **al repo en rama + PR** (nunca directo a la rama default). Cada versión del tracker = un commit.

## REGLAS DE ORO

- Nunca marcar HECHO sin haberlo verificado vos.
- Cuando descubras drift doc↔código, actualizá el doc AL MOMENTO (o dejalo como pendiente explícito del tracker si requiere decisión de negocio).
- Las decisiones de negocio NO se inventan: se marcan como prerrequisito con su dueño («decisión con X antes de escribir código»).
- El tracker define QUÉ/CUÁNDO/CÓMO; la metodología del proyecto define la ejecución. No dupliques: el planteamiento de la ficha ES la base del proposal.
- Al re-auditar, mantené los briefs coherentes: bloque cerrado → brief en modo mantenimiento.
- Sé selectivo con el alcance del tracker: es una herramienta de trabajo, no un monumento. Si una pieza no ayuda a decidir o ejecutar, fuera.
