# Catálogo de referencias — `audit-tracker`

Índice de las **dos mitades** del conocimiento destilado del proyecto:
`docs/references/` (el **CÓMO** técnico) y `docs/business/` (el **QUÉ** del negocio).
Esta tabla es lo que la pestaña 📚 Referencias del tracker consume **sin traducir**.

**Frescura** — evaluación de **vigencia**, no de existencia: 🟢 fresca · 🟠 pendiente de
refresco · 🔴 faltante. *«Existe» no es un estado de frescura.*

Actualizado: 2026-07-27.

| Tema | Qué resuelve | Fecha | Triggers | Quién la usa | Frescura |
|---|---|---|---|---|---|
| **Anatomía, instalación y gotchas de plugins/marketplaces de Claude Code** | Cómo se estructura, distribuye e instala el plugin, y qué rompe en el camino | 2026-07-27 | `plugin`, `marketplace`, `instalación`, `comandos`, `namespace`, `reload`, `distribución`, `hooks`, `manifiesto`, `plugin.json`, `carga` | S07 · histórico: v1.11.x (distribución) | 🟢 |
| **`doc-arquitecto` — la herramienta hermana que produce y audita el plano** | Qué consume `audit-tracker` como entrada y de dónde sale | 2026-07-18 | `doc-arquitecto`, `documentación`, `plano`, `documentar`, `auditar-docs`, `contrato`, `references`, `fede-tools` | `FICHA.md` §5 · histórico: v1.12.0 | 🟠 |
| **Patrones de agentes autónomos de OpenHands aplicables al modo orquestado** | De dónde salen el critic model, el freno anti-loop y la firma por riesgo | 2026-07-13 | `orquestador`, `critic`, `verificador`, `confirmation mode`, `microagents`, `stuck detection`, `firma por riesgo`, `presupuesto`, `loop autónomo` | S08 · histórico: v1.8.0, v1.9.0, v1.10.0 | 🟢 |
| **Ponytail — arquitectura de un plugin multi-agente con hooks** | Qué patrones de hooks se adoptaron, y cuáles se descartaron con su porqué | 2026-07-16 | `hooks`, `statusline`, `lifecycle`, `snapshot`, `estado`, `never-block`, `ponytail`, `yagni`, `skills`, `subagentes`, `consistencia`, `CI` | histórico: v1.11.0 (hooks + CI) | 🟢 |
| **El taller `fede-tools`** *(business)* | Para quién es el proyecto, su lugar en la flota y bajo qué restricciones se construye | 2026-07-26 | `taller`, `fede-tools`, `marketplace`, `flota`, `batuta`, `doc-arquitecto`, `publicador`, `verificador`, `cartera`, `licencia`, `colaboradores` | `FICHA.md` §5 · `VISION.md` §6 | 🟢 |
| **Verificación de criterios: cómo el chequeo mecánico engaña** | Las cuatro formas verificadas en que un `grep` sobre prosa da falso, y qué hacer en su lugar | 2026-07-27 | `verificación`, `criterio`, `grep`, `chequeo`, `evidencia`, `informe de verificación`, `falso positivo`, `falso negativo`, `precondición`, `firma`, `duplicación` | S06 (post-mortem) · todo encargo con criterios documentales | 🟢 |

## Ubicación

| Tema | Path |
|---|---|
| Plugins de Claude Code | `docs/references/claude-code-plugins.md` |
| `doc-arquitecto` | `docs/references/doc-arquitecto.md` |
| OpenHands / agentes | `docs/references/openhands-agentes.md` |
| Ponytail | `docs/references/ponytail.md` |
| El taller `fede-tools` | `docs/business/taller-fede-tools.md` |
| Verificación de criterios | `docs/references/verificacion-de-criterios.md` |

## Movimientos de frescura

La frescura evalúa **vigencia**, y todo drift listado acá está **verificado**, no sospechado.
Las resueltas se conservan con su fecha: saber qué se corrigió y cuándo es tan útil como saber
qué falta.

### ✅ Resuelto el 2026-07-27 — Plugins de Claude Code

No contenía **el gotcha que rompió la v1.11.0**: declarar `"hooks": "./hooks/hooks.json"` en el
manifiesto provoca doble carga porque Claude Code **auto-carga** ese archivo. Se descubrió el
2026-07-18 —cinco días DESPUÉS de escribir la referencia— y quedó solo en el README y el
CHANGELOG.

**Refrescada** en el encargo [#40](https://github.com/hifede1/claude-audit-tracker/issues/40):
se incorporó como gotcha 7 con su fecha y el link al fix; se corrigió la sección «Estado de
verificación», que **seguía afirmando que la instalación estaba sin verificar nueve días después
de verificarse**; y se sumaron los triggers `hooks`, `manifiesto`, `plugin.json` y `carga` —
sin ellos, un encargo sobre hooks no cargaba la referencia donde vive la trampa.

### 🟠 Sigue abierta — `doc-arquitecto`

**Su corrección se fue con el PR [#44](https://github.com/hifede1/claude-audit-tracker/pull/44),
vetado el 2026-07-27.** El encargo [#41](https://github.com/hifede1/claude-audit-tracker/issues/41)
quedó liberado y no se re-toma sin re-priorización humana. El drift sigue vigente:

Su bloque `fuentes` cita
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
