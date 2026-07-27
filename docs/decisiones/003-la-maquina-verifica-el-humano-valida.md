# 003 — La máquina verifica, el humano valida: la firma como única puerta al merge

**Estado:** ✅ **aceptada** · 2026-07-13 (v1.4.x) · reforzada en v1.10.0 · asentada
retrospectivamente el 2026-07-26
**Procedencia:** decisión estructural del modo orquestado; sobrevivió a un panel adversarial
(8 agujeros cerrados, v1.4.x). Ratificada por los merges del dueño.
**Registros previos que absorbe:** **`d2`** («La firma humana es la única puerta al merge») y
**`d7`** («Umbral de firma por riesgo: por ahora NADA automergea»), ambas del tracker desde
2026-07-13. Desde el 2026-07-27 la fuente es este archivo.
**superaA:** —

## Contexto / problema

Si el orquestador ejecuta encargos, verifica su propio trabajo y puede mergear — **¿qué le
queda al humano?** Y peor: ¿qué impide que un loop autónomo se apruebe a sí mismo?

Un loop que se valida solo no es autonomía: es un sistema sin frenos con buena redacción.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Autonomía total** (mergea si los gates pasan) | Máxima velocidad · Pero: los gates verdes no prueban que se construyó **lo pedido**. Nadie mira el objetivo. |
| **2. Firma humana en cada merge** ✅ | El humano queda en el punto donde su juicio es insustituible · Cuesta: hay que esperarlo, y se vuelve el cuello de botella. |
| **3. Firma por muestreo** (uno de cada N) | Menos fricción · Pero: la muestra la elige la máquina, y el criterio de riesgo es justamente lo que no sabe evaluar. |

## Decisión y porqué

**Opción 2**, con una división del trabajo que **no se negocia**: *la máquina verifica, el
humano valida*.

- **Verificar** es mecánico: correr gates, comprobar criterio por criterio con evidencia
  `file:line`, intentar refutar. Eso lo hace la máquina, y lo hace mejor.
- **Validar** es de juicio: ¿esto que se construyó es lo que yo quería? Eso no se delega.

Reglas que la sostienen:

1. **El silencio jamás es aprobación.** No hay timeout que apruebe.
2. **Cero merges con CI rojo**, aunque haya firma.
3. **Canal de firma según cuentas**: review aprobado si orquestador y validador usan cuentas
   distintas; comentario `✅ validado` si comparten (GitHub no permite aprobar el propio PR).
4. **Clases auto-mergeables: default NINGUNA** (v1.10.0). Solo el dueño puede marcarlas en
   calibración, y **el orquestador jamás clasifica en zona gris** — la zona gris siempre se firma.
5. **Excepción única:** el PR de bookkeeping del tracker, que es contabilidad de un cierre YA
   firmado.

## Consecuencias

- El humano es el cuello de botella **a propósito**. Se mitiga con paralelismo (hasta 3 PRs en
  cola de validación), no aflojando la regla.
- Cambios pedidos = hallazgos: se corrigen y se re-pide firma. Tras 2 rondas rechazadas, ese
  encargo **escala** y el loop sigue con los demás.
- Cerrar el PR sin mergear = **veto**: libera el encargo y no se re-toma sin re-priorización humana.
- **Costo aceptado:** el loop se detiene si el humano no está. Es el costo correcto —
  la alternativa es un sistema que construye cosas que nadie pidió, más rápido.
