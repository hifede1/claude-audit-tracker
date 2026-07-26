# 006 — Estado consumible por máquinas: un artefacto derivado y versionado

**Estado:** ✅ **aceptada** · 2026-07-20 (v1.12.0) · asentada retrospectivamente el 2026-07-26
**Procedencia:** pedida por `batuta` en el issue #31; contrato completo en
`docs/estado-contrato.md`. Ratificada por el merge del dueño.
**superaA:** —

## Contexto / problema

Otras herramientas del taller necesitan **leer el estado auditado** de un proyecto —qué bloques
hay, en qué estado, qué queda— **sin volver a auditar**. Hasta v1.11 no había forma de hacerlo
sin romper algo.

El caso que lo destapó: `batuta`, cuyo diseño le **prohíbe reimplementar el trabajo de un
delegado**, frenó ante este hueco en vez de resolverlo por su cuenta. Ese freno es el origen de
esta decisión.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Que el tercero invoque `/audit-tracker`** | Cero artefactos nuevos · Pero: **re-audita** — calibración y fan-out de agentes sobre el código. Caro, y absurdo cuando ya hay una auditoría fresca. |
| **2. Que el tercero parsee el tracker HTML** | Nada que construir · Pero: significa parsear **constantes JS embebidas en HTML** — superficie frágil, sin schema ni versión, que cambia de forma sin aviso. |
| **3. Emitir un JSON derivado y versionado** ✅ | Contrato estable que un tercero puede consumir · Cuesta: un artefacto más que mantener sincronizado, y hay que sostener compatibilidad. |

## Decisión y porqué

**Opción 3.** Cada vez que `/audit-tracker` construye o re-audita, **emite además**
`docs/audits/<proyecto>-estado.json`, derivado de los MISMOS datos que el HTML.

Cuatro garantías lo hacen contrato de verdad:

1. **Versionado** — `schema_version` `MAJOR.MINOR`. MAJOR sube ante cambio incompatible; un
   consumidor de `1.x` sigue funcionando con cualquier `1.y`.
2. **Consumo declarado** — terceros **pueden** depender de su forma. Los cambios incompatibles
   pasan por bump de MAJOR y entrada de CHANGELOG.
3. **Derivado, nunca a mano** — el CI (`check-consistency.js`) falla si su `last_audit` no
   coincide con el del tracker hermano.
4. **Snapshot, no vivo** — refleja la última auditoría. **Leerlo nunca dispara una.**

El porqué de fondo: sin esto, la única superficie de integración era frágil por accidente. Un
contrato **declarado** convierte una dependencia implícita en una explícita — y una explícita se
puede versionar, testear y romper con aviso.

## Consecuencias

- El JSON **no es una segunda fuente de verdad**: es una **proyección**. Ante divergencia, manda
  la auditoría que lo produjo.
- Si `last_audit` es viejo para el gusto del consumidor, **es decisión del consumidor** pedir una
  re-auditoría. Leer nunca audita.
- El CI protege la sincronía: un `estado.json` editado a mano rompe el build.
- **Verificado en campo (2026-07-26):** `batuta` consumió este artefacto en una corrida real
  —`schema_version`, `last_audit`, bloques y plan— **sin parsear HTML y sin disparar auditoría**.
  El consumo end-to-end sigue pendiente: esa corrida frenó antes, por precondición de plano.
