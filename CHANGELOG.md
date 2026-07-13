# Changelog — audit-tracker

Formato: una entrada por versión del plugin. El detalle fino vive en los mensajes de commit.

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
