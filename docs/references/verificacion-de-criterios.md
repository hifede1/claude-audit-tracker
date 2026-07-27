---
tema: Cómo se verifica un criterio sin engañarse — las trampas del chequeo mecánico sobre texto
triggers: [verificación, criterio, grep, chequeo, evidencia, informe de verificación, falso positivo, falso negativo, precondición, firma, duplicación]
fecha: 2026-07-27
fuentes:
  - Corridas reales del loop 2026-07-26/27 — 4 falsos verificados, con su PR de origen
  - PR #44, PR #45, PR #46 de este repo
  - claude-flota (repo hermano) — falso positivo de plano firmado
---

# Verificación de criterios: cómo el chequeo mecánico engaña

> **Lección destilada** el 2026-07-27, tras el primer veto real del loop
> ([PR #44](https://github.com/hifede1/claude-audit-tracker/pull/44)) y la ronda de cambios del
> [PR #46](https://github.com/hifede1/claude-audit-tracker/pull/46). Regla que la produjo:
> `orquestar.md` §Post-mortem.
>
> **Nota honesta sobre el origen:** el veto del PR #44 fue **provocado a propósito** para
> ejercitar la rama del loop, no un rechazo por defecto — **no destiló lección de contenido**, y
> se registra así. Lo que sí produjo conocimiento fue la **ronda de cambios** del PR #46 y el
> patrón acumulado de la jornada. El veto es el evento que destrabó la sesión, no su fuente.

## La regla, en una línea

**El detector busca una cadena; el significado no vive en la cadena.** Todo chequeo por `grep`
sobre texto en prosa falla cuando el texto **cita**, **ejemplifica** o **se parte en dos líneas**.

## Los cuatro casos, verificados

| # | Qué se chequeaba | Qué pasó | Tipo |
|---|---|---|---|
| 1 | ¿el plano está firmado? (línea de `011`) | La ficha **explicaba cómo firmar** y transcribía la línea como ejemplo. Un plano que se declara BORRADOR dio **exit 0** | falso **positivo** |
| 2 | ¿el JS del tracker parsea? | Regex `<script>([\s\S]*)</script>` **greedy**: capturó desde el primer `<script>` hasta el último, tragándose un comentario | falso **fallo** |
| 3 | ¿el archivo sigue afirmando X? ([#44](https://github.com/hifede1/claude-audit-tracker/pull/44)) | La afirmación estaba **citada dentro de su propia corrección**, precedida de «esto es falso» | falso **positivo** |
| 4 | ¿el documento declara Y? ([#45](https://github.com/hifede1/claude-audit-tracker/pull/45)) | La declaración existía, **partida por un salto de línea** del markdown a 100 columnas | falso **negativo** |

## Qué hacer, entonces

1. **Acotá el ámbito antes de buscar.** «El bloque `fuentes` afirma X» no se verifica sobre el
   archivo entero: se verifica **sobre el frontmatter**. Casi todos los falsos positivos salen de
   buscar en más territorio del que el criterio nombra.
2. **Normalizá los espacios** cuando busques prosa: `texto.replace(/\s+/g,' ')`. El markdown corta
   líneas y tu regex no cruza saltos.
3. **Distinguí uso de mención.** Un texto que corrige, cita o ejemplifica contiene la cadena que
   estás cazando. Si el criterio es «ya no afirma X», el chequeo tiene que mirar **dónde se
   afirma**, no dónde aparece.
4. **Ante un rojo, sospechá primero del chequeo.** De los cuatro casos, **ninguno era un defecto
   del archivo**: los cuatro eran defectos del verificador.
5. **Un criterio de contenido documental rara vez es clavable por test.** Cuando no lo sea,
   declaralo como **deuda de verificación** en vez de fingir cobertura.

## La lección de segundo orden — y es la que más cuesta

**Una lección aprendida no se transfiere sola al caso siguiente.**

En el [PR #45](https://github.com/hifede1/claude-audit-tracker/pull/45), un criterio atrapó una
frase duplicada — **justamente la frase que declara que no hay que duplicar**. Se corrigió y se
entendió.

**Dos PRs después**, en el [#46](https://github.com/hifede1/claude-audit-tracker/pull/46), el
mismo ejecutor cometió **el mismo defecto**: la frase de cierre repetida en dos secciones del
mismo archivo, y la explicación del CI escrita tres veces. Lo detectó la ronda de cambios del
validador, no el ejecutor.

**Por qué importa para este producto:** es exactamente la razón por la que la lección tiene que
ir a una **referencia con `triggers`** y no quedarse en el comentario del PR donde se aprendió.
Un comentario se lee una vez; una referencia se carga en el encargo siguiente (`decisiones/009`).
El sistema no puede confiar en que quien aprendió recuerde: tiene que hacer que el conocimiento
**vuelva solo**.

## Anti-ejemplo: qué NO poner acá

Este archivo **no** registra que «hubo un veto» ni que «el loop funcionó». Eso es historia del
proyecto y vive en el CHANGELOG y el tracker. Una referencia acumula **conocimiento reusable**;
si se llena de bitácora, deja de leerse — y una referencia que nadie lee es peor que no tenerla,
porque simula que el conocimiento está cubierto.
