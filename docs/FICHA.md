# Ficha de diseño: `audit-tracker`

> **Estado: VIGENTE**
> Firmado: 2026-07-28 por Fede

**Procedencia de la firma (`018`).** Dos actos rastreables. **(1) Decisión:** en sesión
interactiva del 2026-07-26, Fede eligió explícitamente —entre opciones con tradeoffs— que este
repo tuviera plano, que el doc raíz fuera `docs/FICHA.md` como el resto del taller, que el plano
fuera retrospectivo **+ sesiones de v2**, y aprobó **archivo por archivo** cada pieza generada.
**(2) Ratificación:** el merge de este PR por el dueño anclado (`hifede1`).

> **Ficha RETROSPECTIVA.** Documenta obra **YA construida y verificada** (v1.0.0 → v1.12.0,
> publicada), no una promesa. Nace de una corrida de `batuta` del 2026-07-26 que **frenó por
> precondición**: `audit-tracker` era el ÚNICO de los 7 proyectos propios sin plano firmado —
> la herramienta que audita planos ajenos no tenía el suyo.

---

## 0. El plano — qué documento dice qué

Este documento es la **raíz**; no duplica a los demás, los ordena.

| Documento | Qué contiene |
|---|---|
| `docs/VISION.md` | El problema real, para quién, y cómo se ve el éxito (observable) |
| `docs/ALCANCE.md` | v1 sí · v1 no (descartes con su porqué) · deuda declarada |
| `docs/PLAN.md` | Historial v1.0→v1.12 · S04 cerrada · S06 en pausa · S07–S10 de v2 |
| `docs/decisiones/` | Los 7 ADRs estructurales, con opciones, tradeoffs y costo aceptado |
| `docs/references/` | Investigación destilada (4 referencias) + su catálogo |
| `docs/estado-contrato.md` | Contrato del artefacto `<proyecto>-estado.json` (schema 1.0) |

## 1. Propósito

`audit-tracker` audita la **obra** (el código real) contra el **plano** (la documentación), y
publica el resultado con evidencia `file:line`. Existe porque un proyecto en construcción
**miente sobre sí mismo por drift**, no por mala fe. Detalle en `VISION.md`.

## 2. Nombre público y superficie

Plugin de Claude Code, marketplace `fede-tools`. Tres comandos:

- **`/audit-tracker`** — audita el estado REAL + construye el tracker vivo (despachadora)
- **`/proximo-encargo`** — toma el siguiente encargo asignado y abre PR (trabajadora)
- **`/orquestar`** — loop autónomo con firma humana antes de cada merge (despachadora)

Si otro plugin define un comando homónimo: `/audit-tracker:audit-tracker`.

## 3. Las tres garantías que no se negocian

1. **Sin evidencia nunca es `hecho`** (`decisiones/002`)
2. **La máquina verifica, el humano valida** — el silencio jamás es aprobación (`decisiones/003`)
3. **Solo las señales del validador mueven el loop** — duda = tercero (`decisiones/005`)

## 4. Arquitectura en una línea

Un **mapa** (artifact HTML autocontenido, sin backend) sobre una **cola** que vive en GitHub
Issues, con un **artefacto derivado** (`estado.json`) para que otras máquinas lean el estado sin
re-auditar. El porqué de cada pieza: `decisiones/001` y `decisiones/006`.

## 5. Su lugar en el taller

`doc-arquitecto` produce y audita el **plano**; `audit-tracker` audita la **obra**; `batuta`
orquesta el ciclo entero sin reimplementar ninguno de los dos.

```
/documentar → /auditar-docs → código (encargos) → /audit-tracker
└──── doc-arquitecto ────┘   └──── audit-tracker ────┘
```

## 10. Decisiones

| ADR | Decisión | Estado |
|---|---|---|
| `001` | El tracker es un mapa, no un despachador | ✅ aceptada · 2026-07-09 |
| `002` | Issue cerrado ≠ HECHO — semántica ámbar/verde | ✅ aceptada · 2026-07-09 |
| `003` | La máquina verifica, el humano valida | ✅ aceptada · 2026-07-13 |
| `004` | Verificación de dos actores (escéptico de contexto limpio) | ✅ aceptada · 2026-07-13 |
| `005` | Blindaje anti-inyección | ✅ aceptada · 2026-07-13 |
| `006` | Estado consumible por máquinas | ✅ aceptada · 2026-07-20 |
| `007` | Degradación declarada, nunca bloqueo silencioso | ✅ aceptada · 2026-07-13→16 |
| `008` | Excepción de bookkeeping: el PR del tracker se automergea | ✅ aceptada · 2026-07-13 |
| `009` | Referencias con `triggers`: el conocimiento busca al encargo | ✅ aceptada · 2026-07-13 |
| `010` | El post-mortem destila lecciones, y la ausencia de lección **se declara** | ✅ aceptada · 2026-07-27 |
| `011` | Un cambio de comportamiento exige MINOR, aunque el CI no lo obligue | ✅ aceptada · 2026-07-27 |

> **`docs/decisiones/` es LA fuente de decisiones de este proyecto** (decidido el 2026-07-27).
> El tracker las **linkea y cura**, no las duplica. Cada ADR declara qué registro previo del
> tracker absorbe (`d1`–`d8`), para que el mapeo no se pierda.
>
> **Cómo pasó:** el 2026-07-26 se creó `docs/decisiones/001`–`007` sin advertir que el tracker
> ya mantenía `d1`–`d8` desde julio. Quedaron **dos registros del mismo dato** — el drift exacto
> que este producto existe para detectar, dentro del producto mismo. La re-auditoría del
> 2026-07-27 lo encontró y lo resolvió: se escribieron los ADRs faltantes (`008` ← `d3`,
> `009` ← `d4`) y se declaró la fuente única.

**Pendientes:** **ninguna que bloquee hoy.** Hay **una futura, gated-por-firma**: la telemetría
del loop, con sesión propia (`PLAN.md` S10) — no bloquea porque ninguna capacidad vigente
depende de ella. Y hay **cuatro decisiones afirmadas sin ADR**, declaradas como hueco en
`ALCANCE.md` §1.

## 11. Fuera de alcance

Los descartes deliberados, cada uno con la fuente donde se decidió, viven en `ALCANCE.md` §2:
skills auto-activables · `SubagentStart` · `UserPromptSubmit` · backend propio · hooks en
sesiones web · auditar el plano (es de `doc-arquitecto`) · clases auto-mergeables por defecto.

## 12. Criterios de aceptación del proyecto

- [x] Cada bloque ✅ del tracker tiene evidencia `file:line` *(verificación: inspección del tracker vigente)*
- [x] Un cierre queda ámbar hasta que una re-auditoría lo confirme en código *(verificación: semántica implementada en `audit-tracker.md`)*
- [x] Ningún merge sin firma del dueño *(verificación: `merged_by` de los 29 PRs mergeados == `hifede1`, cero excepciones)*
- [x] El estado es consumible sin disparar auditoría *(verificación: `batuta` lo consumió el 2026-07-26 sin invocar el comando)*
- [x] Lo duplicado por contrato no driftea *(verificación: `scripts/check-consistency.js` en CI)*
- [ ] `/proximo-encargo` ejercitado en corrida real *(verificación: S07 — `b-prox` sigue 🟠 desde v1.1)*
- [ ] Ramas difíciles del loop ejercitadas *(verificación: S08 — veto, cambios pedidos, silencio)*

---

> **Nota de cierre.** Este plano no re-litigó ninguna decisión: toda la sustancia ya estaba
> firmada en `README.md`, `CHANGELOG.md` y `estado-contrato.md`, ratificada por 29 merges del
> dueño. Lo único que se hizo fue **darle forma de contrato** — que es exactamente lo que
> `audit-tracker` le exige a los proyectos que audita, y lo que a él le faltaba.
