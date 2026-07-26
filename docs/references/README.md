# Catálogo de referencias — `audit-tracker`

Índice de las **dos mitades** del conocimiento destilado del proyecto:
`docs/references/` (el **CÓMO** técnico) y `docs/business/` (el **QUÉ** del negocio).
Esta tabla es lo que la pestaña 📚 Referencias del tracker consume **sin traducir**.

**Frescura** — evaluación de **vigencia**, no de existencia: 🟢 fresca · 🟠 pendiente de
refresco · 🔴 faltante. *«Existe» no es un estado de frescura.*

Actualizado: 2026-07-26.

| Tema | Qué resuelve | Fecha | Triggers | Quién la usa | Frescura |
|---|---|---|---|---|---|
| **Anatomía, instalación y gotchas de plugins/marketplaces de Claude Code** | Cómo se estructura, distribuye e instala el plugin, y qué rompe en el camino | 2026-07-13 | `plugin`, `marketplace`, `instalación`, `comandos`, `namespace`, `reload`, `distribución` | S07 · histórico: v1.11.x (distribución) | 🟠 |
| **`doc-arquitecto` — la herramienta hermana que produce y audita el plano** | Qué consume `audit-tracker` como entrada y de dónde sale | 2026-07-18 | `doc-arquitecto`, `documentación`, `plano`, `documentar`, `auditar-docs`, `contrato`, `references`, `fede-tools` | `FICHA.md` §5 · histórico: v1.12.0 | 🟠 |
| **Patrones de agentes autónomos de OpenHands aplicables al modo orquestado** | De dónde salen el critic model, el freno anti-loop y la firma por riesgo | 2026-07-13 | `orquestador`, `critic`, `verificador`, `confirmation mode`, `microagents`, `stuck detection`, `firma por riesgo`, `presupuesto`, `loop autónomo` | S08 · histórico: v1.8.0, v1.9.0, v1.10.0 | 🟢 |
| **Ponytail — arquitectura de un plugin multi-agente con hooks** | Qué patrones de hooks se adoptaron, y cuáles se descartaron con su porqué | 2026-07-16 | `hooks`, `statusline`, `lifecycle`, `snapshot`, `estado`, `never-block`, `ponytail`, `yagni`, `skills`, `subagentes`, `consistencia`, `CI` | histórico: v1.11.0 (hooks + CI) | 🟢 |
| **El taller `fede-tools`** *(business)* | Para quién es el proyecto, su lugar en la flota y bajo qué restricciones se construye | 2026-07-26 | `taller`, `fede-tools`, `marketplace`, `flota`, `batuta`, `doc-arquitecto`, `publicador`, `verificador`, `cartera`, `licencia`, `colaboradores` | `FICHA.md` §5 · `VISION.md` §6 | 🟢 |

## Ubicación

| Tema | Path |
|---|---|
| Plugins de Claude Code | `docs/references/claude-code-plugins.md` |
| `doc-arquitecto` | `docs/references/doc-arquitecto.md` |
| OpenHands / agentes | `docs/references/openhands-agentes.md` |
| Ponytail | `docs/references/ponytail.md` |
| El taller `fede-tools` | `docs/business/taller-fede-tools.md` |

## Por qué dos referencias están en 🟠

La frescura evalúa vigencia, y estas dos tienen **drift verificado**, no sospechado:

1. **Plugins de Claude Code** (2026-07-13) — **no contiene el gotcha que rompió la v1.11.0**:
   declarar `"hooks": "./hooks/hooks.json"` en el manifiesto provoca doble carga («Duplicate
   hooks file detected») porque Claude Code **auto-carga** ese archivo desde su ubicación
   estándar. Se descubrió el 2026-07-18 —cinco días DESPUÉS de la referencia— y quedó solo en
   el README (§Troubleshooting) y en el CHANGELOG. **Refresco: incorporar el gotcha con su fecha
   y el link al fix de v1.11.1.**

2. **`doc-arquitecto`** (2026-07-18) — su bloque `fuentes` cita
   `claude-doc-arquitecto/docs/FICHA.md — contrato de diseño **firmado**`, y el 2026-07-26 se
   verificó que **esa ficha NO lleva la línea de firma de `011`**: dice «(firmada por Fede el
   2026-07-17)», que es una *mención* de firma, no la firma. Para el contrato del taller, esa
   ficha es **borrador**. **Refresco: corregir la caracterización de la fuente.**

## Faltantes

| Tema | La necesita | `triggers` candidatos | Estado |
|---|---|---|---|
| **Telemetría y observabilidad de loops autónomos** | `PLAN.md` **S10** | `telemetría`, `observabilidad`, `métricas`, `costo`, `rondas`, `escaladas`, `presupuesto`, `loop` | 🔴 |

**Por qué se declara.** S10 decide si vale la pena medir el loop —rondas por encargo, escaladas,
costo real contra presupuesto— y **ningún documento del set cubre ese territorio**. Los
`triggers` van declarados porque **sin ellos el tracker no puede pre-cargarla**.

**Generarla es trabajo de un encargo, no de este plano**: identificar la faltante es de
`/documentar`; escribir la investigación destilada, de la sesión que la necesite.

Los demás territorios que el proyecto toca —plugins, agentes autónomos, hooks, la herramienta
hermana— sí tienen su referencia.
