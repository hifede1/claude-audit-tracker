# 007 — Degradación declarada, nunca bloqueo silencioso

**Estado:** ✅ **aceptada** · 2026-07-13 → 2026-07-16 (v1.8.0 · v1.8.1 · v1.11.0) · asentada
retrospectivamente el 2026-07-26
**Procedencia:** tres decisiones convergentes, cada una nacida de un hallazgo real (la de v1.8.1,
en vivo durante la primera corrida real — S03, issue #6). Ratificadas por los merges del dueño.
**superaA:** —

## Contexto / problema

Tres momentos distintos, el mismo dilema: **¿qué hace la herramienta cuando algo no está
disponible o no avanza?**

1. La **calibración** necesita respuestas del humano y `AskUserQuestion` puede fallar o no estar.
2. Un **hook** puede romperse en el arranque de la sesión.
3. Un encargo puede **trabarse**: el mismo error tres veces, un gate que no pasa.

Las salidas malas son dos, opuestas y ambas frecuentes: **bloquear** (la herramienta se planta y
nadie trabaja) o **seguir en silencio** (sigue como si nada, y el resultado miente sobre sus
propias condiciones).

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Bloquear ante cualquier faltante** | Nunca produce resultado dudoso · Pero: una herramienta que se planta por un hook roto es una herramienta que nadie usa. |
| **2. Seguir en silencio con defaults** | Nunca frena · Pero: el output no declara sus condiciones. Un tracker calibrado por defaults invisibles se lee como uno calibrado por el humano. |
| **3. Degradar, y DECLARAR la degradación** ✅ | Sigue funcionando sin mentir · Cuesta: hay que escribir la declaración en cada punto, y el output es más ruidoso. |

## Decisión y porqué

**Opción 3**, aplicada en los tres frentes:

- **Calibración (v1.8.1):** la Fase 0 **jamás bloquea**. Si `AskUserQuestion` falla, se declaran
  **defaults en texto con su porqué**, rigen hasta corrección del usuario y quedan **visibles
  como calibración vigente en el tracker**.
- **Hooks (v1.11.0):** contrato **never-block** — timeout de stdin con `unref`, BOM strip, fallo
  silencioso, allowlist de paths. **Un hook roto jamás frena la sesión**; sin snapshot, no emite nada.
- **Freno anti-loop (v1.8.0):** *stuck detection* — mismo error tres veces, o un gate que no pasa
  tras varios intentos: **parar**, comentar la hipótesis y escalar o desistir.
  **Trabado que insiste ≠ progreso.**

El porqué común: lo que hace confiable a una herramienta no es que nunca degrade — es que
**nunca degrade en secreto**. Un resultado producido en condiciones pobres es útil si viene con
sus condiciones escritas; el mismo resultado sin declararlas es una trampa.

Nota: el freno anti-loop es la cara complementaria. Ahí lo honesto es **parar y decirlo**,
porque insistir consume presupuesto y produce la ilusión de avance.

## Consecuencias

- Todo default asumido queda **visible** — nada rige en la sombra.
- Un hook roto degrada la experiencia, nunca la sesión.
- Un encargo trabado **escala** en vez de consumir presupuesto indefinidamente; el presupuesto
  declarado al reclamar (v1.10.0) es el que dispara el freno.
- **Costo aceptado:** más ruido en la salida. Es el precio de que la salida sea creíble.
- Esta regla es la que hace legible a `004`: sin subagentes, la verificación de dos actores
  **degrada declarándolo**, en vez de fingir que corrió completa.
