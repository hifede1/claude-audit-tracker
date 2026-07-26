# Visión — `audit-tracker`

> Destilado retrospectivo de material YA FIRMADO: `README.md`, `CHANGELOG.md` (v1.9.0–v1.12.0)
> y `docs/estado-contrato.md`. **La sustancia no se re-litigó**; se le dio forma de contrato.
> Fecha: 2026-07-26.

## 1. El problema real

Un proyecto en construcción miente sobre sí mismo, y no por mala fe: miente por **drift**.

- Los docs dicen que un bloque está hecho; el código dice otra cosa.
- Un issue cerrado se lee como trabajo terminado, cuando cerrar un issue es un acto de
  bookkeeping, no una prueba de que algo funcione.
- El estado real vive repartido entre la cabeza de quien lo construyó, un README que envejeció
  y un tablero que nadie actualizó.

El dolor no es «falta un tablero». El dolor es que **nadie puede responder con evidencia la
pregunta “¿qué está realmente construido?”** sin releer el repo entero — y cuando hay varias
máquinas o colaboradores trabajando, esa pregunta se hace todos los días.

## 2. Qué resuelve

`audit-tracker` audita la **obra** (el código real) contra el **plano** (la documentación del
proyecto), y publica el resultado con evidencia `file:line`.

Tres capacidades, una por comando:

- **`/audit-tracker`** — audita el estado REAL y construye el tracker vivo.
- **`/proximo-encargo`** — en cada máquina trabajadora: toma el siguiente encargo asignado,
  lo ejecuta, abre PR.
- **`/orquestar`** — corre el loop completo y deja al humano solo en el punto que importa.

## 3. Para quién

- **El dueño del proyecto**, en la máquina despachadora: audita, reparte, valida.
- **Colaboradores y máquinas trabajadoras**: toman encargos de la cola de GitHub Issues.
- **Otras herramientas del taller** (`batuta`, y quien venga): consumen el estado auditado
  **sin re-auditar**, vía el artefacto `docs/audits/<proyecto>-estado.json`.

Ese tercer consumidor no es hipotético: `batuta` lo pidió (issue #31) porque su diseño le
**prohíbe** reimplementar el trabajo de un delegado — frenó ante el hueco en vez de parsear el
HTML, y ese freno produjo el contrato de `estado-contrato.md`.

## 4. Las tres convicciones que ordenan el producto

**1. Sin evidencia nunca es `hecho`.** Un bloque solo pasa a ✅ con evidencia en código. El
drift doc↔código es hallazgo de primera clase, no una nota al pie.

**2. La máquina verifica, el humano valida.** La división es fija y no se negocia. La máquina
corre gates, refuta criterios y arma el informe; el humano firma. **El silencio jamás es
aprobación** — el orquestador no mergea sin firma ni con CI rojo.

**3. Issue cerrado ≠ HECHO.** Los cierres se marcan en ámbar y solo pasan a verde cuando una
**re-auditoría los confirma EN CÓDIGO**. Es la regla que impide que el propio sistema se
mienta a sí mismo.

## 5. Cómo se ve el éxito — observable, no aspiracional

| Señal | Cómo se observa |
|---|---|
| El estado publicado es verificable | Cada bloque ✅ tiene su evidencia `file:line` en el tracker |
| Un cierre no se cree solo | El ítem queda ámbar hasta que una re-auditoría lo confirma en código |
| Nada se mergea sin firma | `merged_by` del PR == el dueño; cero merges con CI rojo |
| El estado es consumible por máquinas | Un tercero lee `<proyecto>-estado.json` y **no dispara** ninguna auditoría |
| Lo duplicado por contrato no driftea | `scripts/check-consistency.js` falla el CI cuando driftea |

## 6. Su lugar en el taller

`audit-tracker` audita la obra; **`doc-arquitecto` produce y audita el plano** que él consume.
Son hermanas y cierran un ciclo:

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

Y sobre ese ciclo se para `batuta`, que lo orquesta de punta a punta sin reimplementar
ninguna de las dos.

> **Nota de procedencia (2026-07-26).** Este documento nace de una corrida de `batuta` que
> frenó por precondición: `audit-tracker` era el ÚNICO de los 7 proyectos propios sin plano
> firmado. La herramienta que audita planos ajenos no tenía el suyo.
