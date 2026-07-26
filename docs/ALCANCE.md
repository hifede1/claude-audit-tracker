# Alcance — `audit-tracker`

> **Retrospectivo.** Documenta el alcance de la obra YA CONSTRUIDA (v1.12.0, publicada) más
> las sesiones abiertas de v2. Destilado de `README.md` y `CHANGELOG.md` v1.9.0–v1.12.0.
> **Los descartes de §2 no se decidieron acá: ya estaban decididos con su porqué en el
> CHANGELOG.** Este documento les da forma de contrato, no los re-litiga.
>
> Fecha: 2026-07-26 · Firma: el merge del PR que introduce este documento (`018`).

## 1. Lo que la v1 SÍ hace — construido y verificado

### Los tres comandos

| Comando | Qué hace | Dónde corre |
|---|---|---|
| `/audit-tracker` | Audita el estado REAL contra el plano y construye el tracker vivo | máquina despachadora |
| `/proximo-encargo` | Toma el siguiente encargo asignado, lo ejecuta, abre PR | cada máquina trabajadora |
| `/orquestar` | Corre el loop completo y pide firma humana antes de mergear | máquina despachadora |

### Las capacidades

- **Auditoría con evidencia.** Fan-out de agentes sobre el código real; cada bloque clasificado
  ✅ HECHO / 🟠 EN CURSO / ⚪ PENDIENTE / ⚠️ MAQUETA con `file:line`. **Sin evidencia nunca es
  `hecho`.**
- **Tracker vivo** — artifact HTML autocontenido, commiteado al repo, redeployado siempre a la
  misma URL. Siete pestañas: tablero, plan, mapa de flujo, stack, decisiones, evidencia de
  tests, catálogo de referencias.
- **Modo despacho** — cada sesión del plan publicada como issue (`[S<NN>] <objetivo>`, labels
  `encargo` + `sesion-NN`); la asignación vive en GitHub Issues, no en el tracker.
- **Modo orquestado** con **verificación de dos actores**: la pasada del ejecutor más un
  verificador independiente de contexto limpio que intenta *refutar* cada criterio. El informe
  del PR declara quién ejecutó, quién verificó, qué se intentó tumbar y qué sobrevivió.
- **Firma humana como única puerta al merge.** Review aprobado, o comentario `✅ validado` si
  orquestador y validador comparten cuenta. Cero merges sin firma; cero merges con CI rojo.
- **Blindaje anti-inyección** — solo las señales del validador mueven el loop; instrucciones de
  terceros en issues, comentarios o logs se reportan como hallazgo. **Duda = tercero.**
- **Presupuesto por encargo** — declarado al reclamar, con el costo real al cerrar.
- **Hooks de estado** (solo CLI local): SessionStart inyecta el estado del loop; statusline
  opcional. Contrato *never-block*: un hook roto jamás frena la sesión.
- **CI anti-drift** (`scripts/check-consistency.js`): lo duplicado por contrato se verifica en
  CI, no de memoria.
- **Estado consumible por máquinas** — `docs/audits/<proyecto>-estado.json`, `schema_version`
  semver, contrato declarado en `docs/estado-contrato.md`. Leerlo **nunca dispara** una
  auditoría.

> **Hueco declarado: cuatro de estas capacidades no tienen ADR.** Se asentaron 7 decisiones
> estructurales en `decisiones/`; **estas cuatro quedaron afirmadas sin su ADR**, y un tercero
> que pregunte «¿por qué?» no tiene dónde leerlo. Su porqué existe, pero solo en el CHANGELOG:
>
> | Decisión afirmada | Dónde está hoy su porqué |
> |---|---|
> | Presupuesto por encargo (declarado al reclamar, costo real al cerrar) | `CHANGELOG` v1.10.0 |
> | `triggers` en referencias (barrido además del link explícito) | `CHANGELOG` v1.8.0 |
> | Asignación por *assignees*; `maquina/<nombre>` solo sin persona fija | `CHANGELOG` v1.2.0 |
> | Protocolo «DENTRO DEL ENCARGO» (finalidad antes que tarea) | `CHANGELOG` v1.7.0 |
>
> **No se les fabrica un ADR retrospectivo acá**: el esqueleto lo puede proponer una corrida
> futura, pero las opciones descartadas y el porqué los completa el humano que decidió.

## 2. Lo que la v1 NO hace — descartes deliberados, con su porqué

Cada uno se decidió cuando se decidió, y el porqué es el que quedó escrito entonces:

| Fuera de alcance | Porqué (fuente) |
|---|---|
| **Skills auto-activables** | Los workflows son pesados y con efectos —mergear PRs, fan-out de agentes—: **no deben autodispararse por fraseo natural**. `CHANGELOG` v1.11.0 |
| **Hook `SubagentStart`** | Exigiría mantener un estado «auditoría en curso» frágil. `CHANGELOG` v1.11.0 |
| **Hook `UserPromptSubmit`** | No hay modos que trackear: sería maquinaria sin uso. `CHANGELOG` v1.11.0 |
| **Backend / despachador propio** | El tracker es un **mapa, no un despachador**: artifact con CSP estricta, sin backend, ticks en `localStorage`. La asignación vive en GitHub Issues. `README` |
| **Hooks en sesiones web** | Los plugins no cargan en sesiones web — límite de Claude Code, no del plugin. Workaround documentado (copia manual); por esa vía no hay hooks. `README` §Troubleshooting |
| **Auditar el plano** | Es trabajo de la herramienta hermana `doc-arquitecto` (`/auditar-docs`). Reimplementarlo sería duplicar un delegado. `README` |
| **Clases auto-mergeables por defecto** | Default explícito: **NINGUNA**. La zona gris siempre se firma, y el orquestador jamás clasifica en zona gris. `CHANGELOG` v1.10.0 |

## 3. Deuda declarada — abierta, no disimulada

Lo que el propio artefacto de estado ya lista como deuda transversal, y que las sesiones de v2
toman (ver `PLAN.md`):

1. **Ramas difíciles del loop sin ejercitar** — cambios pedidos, veto, silencio prolongado.
   Hay que provocarlas a propósito; no aparecen solas en corridas sanas.
2. **Sin telemetría del loop** — rondas por encargo, escaladas, costo. Está sin decidir si vale
   la pena, y esa decisión necesita corridas previas.
3. **La emisión automática del `estado.json` no se ejercitó en corrida real** — se emitió por
   dogfood en v1.12.0, pero se clava cuando `batuta` lo consuma end-to-end.
4. **`/proximo-encargo` especificado desde v1.1 y jamás ejercitado** — **ninguna máquina tomó
   nunca un encargo**. El bloque `b-prox` está 🟠 desde entonces. Una spec sin ejercitar es una
   promesa, no una capacidad: la misma lección que dejó S04 con el install que nadie había hecho.
   La toma **S07**.

> **Nota honesta sobre la deuda 3 (2026-07-26).** `batuta` LEYÓ el `estado.json` de este repo
> en una corrida real y funcionó: schema, `last_audit` y bloques se consumieron sin parsear
> HTML. Pero la corrida **frenó antes** del consumo end-to-end (precondición: este repo no
> tenía plano). La deuda sigue abierta, ahora con un tramo verificado.

## 4. Lo que está fuera de alcance de este DOCUMENTO

Este plano es **retrospectivo**: asienta lo construido y abre las sesiones de v2 que salen de
la deuda de §3. No inventa capacidades nuevas ni promete roadmap más allá de eso. Toda
capacidad que no esté en §1 o en las sesiones de `PLAN.md` **no está prometida**.
