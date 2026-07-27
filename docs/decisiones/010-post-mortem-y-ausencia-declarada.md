# 010 — El post-mortem destila lecciones, y la ausencia de lección se declara

**Estado:** ✅ **aceptada** · 2026-07-27 · **Decidida por:** Fede, en sesión interactiva, **antes
de codificar** (caza de decisiones del encargo #9).
**Procedencia:** implementada en el mismo día — PR
[`#49`](https://github.com/hifede1/claude-audit-tracker/pull/49), **v1.13.0**, mergeado por el
dueño (`merged_by: hifede1`). Cierra **S06**, abierta el 2026-07-13.
**Registro previo:** ninguno. Este ADR la asienta por primera vez.
**superaA:** —

## Contexto / problema

Cuando un PR se veta o un encargo se escala, el humano tuvo que corregir algo. **Esa lección
muere en los comentarios del PR** — y los comentarios no se leen dos veces. El sistema repite
errores que ya costaron una intervención humana.

S06 llevaba **desde el 2026-07-13 en pausa**: su criterio pedía «un caso real», y en 6 ciclos del
loop no había habido ningún veto. No esperaba trabajo ni firma: esperaba un **evento**. Lo
destrabó S08 provocándolo a propósito.

Y al ir a escribir la regla apareció el problema difícil: **el primer veto real fue un ejercicio
deliberado**, no un rechazo por defecto. El PR estaba correcto, con CI verde. **¿Qué lección
destila un veto sin defecto?**

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Destilar siempre, sin excepción** | Regla simple, sin zonas grises · Pero obliga a **fabricar** lecciones donde no las hubo. La referencia se llena de ruido y se entrena a saltearla. |
| **2. Destilar solo cuando el episodio dejó conocimiento, y CALLAR si no** | Sin ruido · Pero el silencio es ambiguo: no se distingue «no había lección» de «nadie la escribió». La re-auditoría no puede verificar nada. |
| **3. Destilar cuando hay conocimiento, y DECLARAR explícitamente cuando no** ✅ | La referencia solo acumula señal, y la ausencia queda auditable · Cuesta: hay que escribir también cuando no hay nada que escribir. |

## Decisión y porqué

**Opción 3.** El post-mortem se dispara al cierre de un episodio —veto, o escalada resuelta— y:

- la lección va a la **referencia del tema** en `docs/references/` (o al 🛠️ método de la ficha si
  es específica del bloque), **con fecha y link al PR/issue de origen**. *Sin link no es lección:
  es una opinión fechada.*
- si el tema no tiene referencia, **se crea con sus `triggers`** — sin ellos el conocimiento no
  encuentra al encargo siguiente (`009`);
- **si el episodio no dejó conocimiento, se declara que no lo dejó, y por qué.**

**El porqué de la tercera regla es el que sostiene todo:** una referencia que acumula relleno
entrena a saltearla, y **una referencia que nadie lee es peor que no tenerla** — porque simula
que el conocimiento está cubierto. La ausencia declarada es un resultado; el silencio, no.

Y la verificación es lo que la vuelve real: `/audit-tracker` comprueba **por evidencia** cada
episodio cerrado desde la última auditoría, y **episodio sin lección ni declaración = pendiente
nuevo**.

## Consecuencias

- **Se aplicó contra el caso propio de inmediato:** el veto del PR #44 se registró como
  **ejercicio sin lección de contenido**. No se le fabricó una.
- La primera lección destilada de verdad
  (`docs/references/verificacion-de-criterios.md`) salió de una **ronda de cambios**, no del
  veto: las cuatro formas verificadas en que un chequeo mecánico sobre prosa da falso.
- **Escribir también cuando no hay lección** es trabajo extra en el caso vacío. Es el costo de
  que la re-auditoría pueda distinguir «nada que aprender» de «nadie lo escribió».
- **Riesgo declarado:** la regla puede degenerar en ritual — declarar «sin lección» por reflejo,
  para cerrar el trámite. La defensa no es un gate más: es que la declaración **exija su porqué**,
  que es revisable por un humano en la re-auditoría.
- Fija además la razón de fondo de `009`: la lección va a una referencia **con triggers**, no al
  comentario del PR, porque **una lección aprendida no se transfiere sola al caso siguiente** —
  verificado el 2026-07-27, cuando el mismo defecto reapareció dos PRs después de haberse
  corregido.
