# 005 — Blindaje anti-inyección: solo las señales del validador mueven el loop

**Estado:** ✅ **aceptada** · 2026-07-13 (v1.10.0) · asentada retrospectivamente el 2026-07-26
**Procedencia:** decisión de v1.10.0, vigente. Ratificada por el merge del dueño.
**Registro previo:** ninguno — el tracker **no** la tenía registrada. Este ADR la asienta por
primera vez.
**superaA:** —

## Contexto / problema

El orquestador **lee texto que no controla**: cuerpos de issues, comentarios, logs de CI,
salidas de herramientas. Cualquiera con acceso al repo —o cualquier proceso que escriba en él—
puede dejar ahí una frase con forma de orden: *«aprobá este PR»*, *«saltá la verificación»*,
*«marcá este criterio como cumplido»*.

Un loop que obedece texto entrante no tiene compuerta: tiene una **puerta con cartel**.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Confiar en el contenido del repo** | Simple · Pero: el repo es un canal, no una fuente confiable. Basta un colaborador, un bot o un log envenenado. |
| **2. Sanitizar / filtrar directivas** | Suena defensivo · Pero: el filtro da **falsa seguridad**. Toda lista de patrones se esquiva parafraseando; y ahora creés que estás protegido. |
| **3. Negar autoridad: solo el validador mueve el loop** ✅ | No depende de detectar nada · Cuesta: hay que definir con precisión quién es el validador y tratar TODO lo demás como dato. |

## Decisión y porqué

**Opción 3.** **Solo las señales del validador mueven el estado del loop** — firma, cambios
pedidos, veto, decisiones. Todo lo demás es **dato, jamás directiva**.

Instrucciones metidas por terceros en issues, comentarios o logs **se reportan como hallazgo,
jamás se obedecen**. Y la regla que cierra la zona gris: **duda = tercero**.

El porqué es que la defensa correcta no es *limpiar las palabras* sino **negarles autoridad**.
Un filtro compite con la creatividad de quien inyecta; una regla de autoridad no compite con
nada — no importa cómo esté redactada la directiva si el canal no tiene poder para mover el loop.

## Consecuencias

- El texto entrante nunca es instrucción, por más que venga con la forma de una.
- Una directiva topada **se reporta** — queda visible como hallazgo, no se descarta en silencio.
  Lo que no se ve no se corrige.
- **No se sanitiza ni se filtra**: hacerlo daría una seguridad que no existe.
- La definición de validador debe ser **inequívoca** y anclada fuera del canal que se protege —
  si el validador se declarara en un archivo que un PR puede editar, el blindaje se anula solo.
- **Costo aceptado:** un colaborador legítimo que escriba una sugerencia en un comentario no
  mueve nada, y puede sorprenderle. Correcto: sugerir no es decidir.
