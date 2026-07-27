# 004 — Verificación de dos actores: el escéptico de contexto limpio

**Estado:** ✅ **aceptada** · 2026-07-13 (v1.9.0) · asentada retrospectivamente el 2026-07-26
**Procedencia:** inspirada en el *critic model* de OpenHands (`docs/references/openhands-agentes.md`).
Ratificada por el merge del dueño.
**Registro previo que absorbe:** **`d6`** del tracker («El verificador independiente revisa TODO
encargo salvo bookkeeping», 2026-07-13). Desde el 2026-07-27 la fuente es este archivo.
**superaA:** —

## Contexto / problema

El orquestador ejecuta un encargo y después verifica que cumple los criterios. **Es juez y
parte.** No por deshonestidad: por contexto. Quien acaba de construir algo tiene todo el
razonamiento fresco a favor — sabe qué quiso hacer, y eso contamina lo que ve al revisar.

El resultado típico: criterios que "se cumplen" porque el autor sabe en qué sentido se cumplen.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Una sola pasada** (el ejecutor se verifica) | Barato · Pero: juez y parte, con el sesgo de contexto intacto. |
| **2. Segunda pasada del mismo actor** | Algo mejor · Pero: mismo contexto contaminado. Releer no es refutar. |
| **3. Verificador independiente de contexto limpio, que intenta REFUTAR** ✅ | Ataca el sesgo en su raíz · Cuesta: un actor más por encargo, y depende de que haya subagentes disponibles. |

## Decisión y porqué

**Opción 3.** La verificación pasa a **dos actores**:

1. **El ejecutor** hace su pasada criterio por criterio, con evidencia `file:line` y gates.
2. Un **escéptico de CONTEXTO LIMPIO** —solo ficha + diff + repo, sin el razonamiento del
   ejecutor— **intenta refutar cada criterio**.

Lo tumbado se corrige **antes** de pedir firma. Y el informe del PR declara los cuatro datos
que hacen auditable el proceso: **quién ejecutó · quién verificó · qué se intentó tumbar · qué
sobrevivió**.

El porqué es la asimetría: pedirle a alguien que confirme encuentra confirmaciones; pedirle que
refute encuentra agujeros. La consigna importa más que el actor.

## Consecuencias

- **Alcance (d6):** todo encargo **salvo bookkeeping** — el PR del tracker es contabilidad de un
  cierre ya firmado, no obra nueva.
- **Sin subagentes disponibles: degradación DECLARADA** (filosofía d5). El sistema no finge que
  verificó con dos actores cuando corrió con uno: lo dice. Un informe que miente sobre su propio
  método es peor que un método pobre.
- El humano firma sobre un informe que ya **sobrevivió a un ataque**, no sobre una autodeclaración.
- **Costo aceptado:** más tokens y más tiempo por encargo. Se paga porque el criterio que cae en
  la refutación habría caído igual — pero en producción y con la firma ya puesta.
