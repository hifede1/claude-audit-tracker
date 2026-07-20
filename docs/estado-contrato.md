# Contrato de estado consumible — `<proyecto>-estado.json`

> Introducido en **v1.12.0** (2026-07-20) · Origen: `hifede1/claude-audit-tracker#31`, pedido por `batuta`.

## Por qué existe

Otras herramientas del taller necesitan **leer el estado auditado** de un proyecto —qué
bloques hay, en qué estado, qué sesiones y pendientes quedan— **sin volver a auditar**.

Hasta v1.11 eso era imposible sin romper algo:

- Invocar `/audit-tracker` **re-audita**: corre calibración y fan-out de agentes sobre el
  código. Caro, y sobra cuando ya hay una auditoría fresca.
- Leer el tracker HTML a mano significa **parsear constantes JS embebidas en HTML**: una
  superficie frágil, sin schema ni versión, que puede cambiar de forma sin aviso.

`batuta`, cuyo diseño prohíbe reimplementar el trabajo de un delegado, frenó ante esto y lo
trajo como hueco-a-construir. Este contrato es la respuesta: **un artefacto estable y
versionado que declara ser consumible por terceros.**

## Qué es

Cada vez que `/audit-tracker` construye o re-audita el tracker de un proyecto, **emite
además** un archivo hermano, derivado de los MISMOS datos de la auditoría:

```
docs/audits/<proyecto>-tracker.html    ← la vista humana (ya existía)
docs/audits/<proyecto>-estado.json     ← la vista máquina (este contrato)
```

Los dos salen de la misma fuente (`DATA`, `PLAN`, `DECISIONS`, `REFS`, `DEBT`, `CALIB`,
`LAST_AUDIT`, `CLOSED_COUNT`). El JSON no es una segunda fuente de verdad: es una
**proyección** de la auditoría a un formato que una máquina puede leer sin ejecutar nada.

## Garantías

1. **Versionado.** El campo `schema_version` es `"MAJOR.MINOR"`. **MAJOR** sube ante un
   cambio incompatible (campo renombrado o quitado, semántica alterada). **MINOR** sube ante
   un agregado retrocompatible. Un consumidor que soporta `1.x` debe seguir funcionando con
   cualquier `1.y`.
2. **Consumo declarado.** Este archivo **es contrato**. Terceros pueden depender de su forma.
   Los cambios incompatibles pasan por bump de MAJOR y entrada de CHANGELOG.
3. **Derivado, nunca a mano.** Lo emite `/audit-tracker`. Editarlo a mano lo desincroniza del
   tracker; el CI (`check-consistency.js`) falla si `last_audit` no coincide con el HTML.
4. **Snapshot, no vivo.** Refleja la última auditoría. No es estado en tiempo real — el
   estado vivo del loop es `.claude/audit-tracker-state.json`, que es otra cosa (cache de
   arranque de `/orquestar`, no auditoría).

## Schema `1.0`

```jsonc
{
  "schema_version": "1.0",
  "proyecto": "claude-audit-tracker",     // nombre del repo/proyecto
  "last_audit": "2026-07-18 (...)",        // === LAST_AUDIT del tracker (CI lo verifica)
  "closed_count": 10,                       // pendientes cerrados y verificados histórico
  "calibracion": {                          // === CALIB del tracker (o null si no hay)
    "unidad": "sesiones (~2-4h)",
    "actores": "…",
    "metodologia": "directa",
    "loop": "orquestado (despacho activo)"
  },
  "bloques": [
    {
      "id": "b-orq",                        // id ESTABLE (mismo que el tracker)
      "nombre": "/orquestar",
      "zona": "Comandos — el producto",
      "estado": "curso",                    // hecho | curso | pend | maqueta
      "resumen": "…",                       // una línea de qué existe / qué falta
      "pendientes": [
        { "id": "p-learn", "txt": "…", "sesion": "S06" }
      ]
    }
  ],
  "plan": [
    { "sesion": "S04", "titulo": "…", "estimacion": 1, "deps": [], "cierra": ["p-hooks-real"] }
  ],
  "decisiones_pendientes": [                // solo las que bloquean; [] si ninguna
    { "id": "d-…", "tema": "…", "dueno": "…", "desbloquea": "S…" }
  ],
  "referencias": [
    { "tema": "ponytail", "path": "docs/references/ponytail.md", "frescura": "fresca", "fecha": "2026-07-16" }
  ],
  "referencias_faltantes": [                // territorios sin referencia; [] si ninguno
    { "tema": "…", "la_necesita": "S…" }
  ],
  "deuda": [ "…" ]                          // deuda transversal, líneas de texto
}
```

### Valores de `estado`

Los mismos cuatro del tracker: `hecho` (✅ HECHO) · `curso` (🟠 EN CURSO) · `pend`
(⚪ PENDIENTE) · `maqueta` (⚠️ MAQUETA). **Sin evidencia nunca es `hecho`.**

### Valores de `frescura`

`fresca` (🟢) · `refresco` (🟠 pendiente de refresco) · `falta` (🔴, y entonces aparece
también en `referencias_faltantes`).

## Cómo lo consume un tercero

```bash
# no re-audita: solo lee el archivo derivado
cat docs/audits/<proyecto>-estado.json
```

El consumidor lee `schema_version`, comprueba que soporta esa MAJOR, y usa los campos. Si
`last_audit` es viejo para su gusto, es decisión del consumidor pedir una re-auditoría — pero
**leer el estado nunca dispara una.**
