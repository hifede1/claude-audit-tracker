# 009 — Referencias con `triggers`: el conocimiento busca al encargo

**Estado:** ✅ **aceptada** · 2026-07-13 (v1.8.0) · asentada como ADR el 2026-07-27
**Procedencia:** decisión de v1.8.0, inspirada en los *microagents* de OpenHands
(`docs/references/openhands-agentes.md`). Registrada en el tracker como **`d4`** desde el
2026-07-13 — este archivo la baja a `docs/decisiones/`, que pasa a ser la fuente.
**superaA:** —

## Contexto / problema

Las referencias de `docs/references/` son investigación destilada: cómo se hace bien una clase
de problema. Pero **dependían de que la ficha las linkeara a mano**.

El resultado es la peor forma de tener conocimiento: **existe, está bien escrito, y no llega al
encargo que lo necesita.** Quien arma la ficha tiene que acordarse de que la referencia existe —
y si se acuerda, probablemente ya sabía lo que la referencia dice.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Solo links explícitos** | Simple y predecible: se lee lo que la ficha manda · Pero depende de la memoria de quien escribe la ficha, que es justo lo que falla. |
| **2. Frontmatter `triggers` + barrido automático por tema** ✅ | El conocimiento encuentra al encargo aunque nadie lo haya linkeado · Cuesta: hay que mantener los triggers, y un trigger mal puesto carga ruido. |

## Decisión y porqué

**Opción 2.** El porqué original: **el conocimiento debe encontrar al encargo**, no al revés. Y
el patrón no es una apuesta: OpenHands lo tiene probado en producción con sus *microagents*.

Cada referencia lleva frontmatter `triggers: [palabras, clave]`. El ejecutor lee **toda**
referencia cuyos triggers matcheen el tema de su encargo, **además** del link explícito de la
ficha. Los dos caminos conviven: el link es intención, el trigger es red de seguridad.

## Consecuencias

- La auditoría **indexa los triggers**; una referencia sin frontmatter se completa en la
  re-auditoría siguiente.
- El catálogo de `references/` expone los `triggers` completos —no «ver frontmatter»— porque el
  tracker los lee de ahí.
- Una referencia **faltante** se declara con sus `triggers` candidatos: sin ellos el sistema no
  puede pre-cargarla cuando exista.
- **Riesgo declarado:** un trigger demasiado genérico carga referencias irrelevantes en cada
  encargo y entrena a ignorarlas. El costo de un trigger malo no es ruido: es que se deje de
  confiar en el mecanismo entero.
