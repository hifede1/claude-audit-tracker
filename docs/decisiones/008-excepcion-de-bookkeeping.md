# 008 — Excepción de bookkeeping: el PR del tracker se automergea

**Estado:** ✅ **aceptada** · 2026-07-13 (v1.4 fix) · asentada como ADR el 2026-07-27
**Procedencia:** decisión tomada tras un **panel adversarial** durante v1.4.x; vigente desde
entonces. Registrada en el tracker como **`d3`** desde el 2026-07-13 — este archivo la baja a
`docs/decisiones/`, que pasa a ser la fuente. **No la re-litiga.**
**superaA:** —

## Contexto / problema

El panel adversarial de v1.4.x detectó un agujero en el propio loop: **cada cierre firmado
generaba un SEGUNDO PR** —el que actualiza el tracker— **que exigía otra firma**.

Es doble firma por un solo trabajo, y nunca se prometió: el humano firmó el entregable, y a los
dos minutos le llega otro PR pidiendo que firme la contabilidad de lo que acaba de firmar. Es la
fatiga de firma naciendo dentro del sistema diseñado para evitarla.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Doble firma** | Coherente con «nada sin firma» al pie de la letra · Pero: fatiga garantizada, y el humano termina firmando sin mirar — que es peor que no firmar. |
| **2. El tracker va directo a la rama default** | Cero fricción · **Viola la regla de rama+PR**: deja un cambio sin traza de revisión. |
| **3. El PR del tracker se automergea como contabilidad de un cierre YA firmado** ✅ | Mantiene rama+PR y elimina la doble firma · Cuesta: hay que definir con precisión qué cuenta como bookkeeping, o la excepción se estira. |

## Decisión y porqué

**Opción 3.** El porqué, textual de la decisión original: **la regla «jamás sin firma» protege el
código del proyecto, no su contabilidad.**

Un PR de tracker no propone trabajo: **refleja** un trabajo que el humano ya firmó. Pedir firma
otra vez no agrega control, agrega ruido — y el ruido en una compuerta la desgasta.

La opción 2 se descartó aunque resolvía el mismo problema: saltear rama+PR deja el cambio sin
traza, y la traza vale aunque el merge sea automático.

## Consecuencias

- El PR del tracker **no cuenta para el cupo de 3 PRs** en cola de validación.
- Es **agrupable al final de la corrida**.
- La excepción es **única y acotada**: bookkeeping de un cierre ya firmado. Un PR que toque
  código no es bookkeeping por más que también toque el tracker — ahí la excepción no aplica.
- **Riesgo declarado:** es la única puerta del sistema que se abre sola. Su seguridad depende
  enteramente de que «bookkeeping» siga significando lo mismo. Un ensanchamiento silencioso de
  esa definición es la forma más probable de que este sistema pierda su garantía central.
