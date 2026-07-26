# 002 — Issue cerrado ≠ HECHO: la semántica ámbar/verde

**Estado:** ✅ **aceptada** · 2026-07-09 (v1.0.0) · asentada retrospectivamente el 2026-07-26
**Procedencia:** decisión fundacional de v1.0.0, vigente desde entonces y verificable en el
comportamiento del comando. Ratificada por los merges del dueño.
**superaA:** —

## Contexto / problema

Cuando un encargo se termina, ¿el sistema puede darlo por hecho?

Todo tablero de proyecto responde que sí: cerraste el ticket, la columna pasa a "Done". Y ahí
nace el drift que este producto existe para matar — porque **cerrar un issue es un acto de
bookkeeping, no una prueba de que algo funcione**.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Cierre = hecho** (el modelo de todo tablero) | Simple, cero fricción · Pero: el tablero se vuelve una lista de intenciones. Nadie miente a propósito; el drift entra solo. |
| **2. Cierre = ámbar; verde solo con re-auditoría en código** ✅ | El verde significa algo verificable · Cuesta: hay que re-auditar, y un ítem puede quedar ámbar un tiempo. |
| **3. Verde con checklist auto-declarado** | Barato · Pero: quien construyó declara sobre su propio trabajo, sin actor independiente. Es la opción 1 con un paso extra. |

## Decisión y porqué

**Opción 2.** Un cierre entra en **ámbar (sin verificar)** y **solo pasa a verde cuando una
re-auditoría lo confirma EN CÓDIGO**, con evidencia `file:line`.

El principio que lo ordena todo: **sin evidencia nunca es `hecho`**. Los cuatro estados
(`hecho` · `curso` · `pend` · `maqueta`) describen lo que el código muestra, no lo que los docs
prometen. El drift doc↔código es hallazgo de primera clase.

## Consecuencias

- La re-auditoría no es opcional: es lo que **cierra el ciclo**. Un cierre sin re-auditoría deja
  el ítem en ámbar, y eso es correcto — no es un bug del tablero.
- La re-auditoría puede **reabrir** un cierre. Eso es el sistema funcionando, no fallando.
- El estado ⚠️ MAQUETA existe justamente para lo que *parece* hecho y no lo está.
- **Costo aceptado:** el verde llega más tarde y cuesta trabajo. A cambio, cuando llega,
  significa algo — que es la única razón por la que un tablero vale la pena.
- En el modo orquestado la semántica se traslada: el equivalente del ámbar es **el PR esperando
  firma** (verificado por la máquina, sin validar); al mergear, el ítem pasa directo a verde.
