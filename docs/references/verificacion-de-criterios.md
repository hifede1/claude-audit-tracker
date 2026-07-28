---
tema: Cómo se verifica un criterio sin engañarse — las trampas del chequeo mecánico sobre texto
triggers: [verificación, criterio, grep, chequeo, evidencia, informe de verificación, falso positivo, falso negativo, precondición, firma, duplicación, medición, exit code, assignee, cola, campo]
fecha: 2026-07-28
fuentes:
  - Corridas reales del loop 2026-07-26/27 — 4 falsos verificados, con su PR de origen
  - PR #44, PR #45, PR #46 de este repo
  - claude-flota (repo hermano) — falso positivo de plano firmado
  - Issue #59 (2026-07-28) — falso negativo por campo, y las dos mediciones defectuosas
---

# Verificación de criterios: cómo el chequeo mecánico engaña

> **Lección destilada** el 2026-07-27, tras el primer veto real del loop
> ([PR #44](https://github.com/hifede1/claude-audit-tracker/pull/44)) y la ronda de cambios del
> [PR #46](https://github.com/hifede1/claude-audit-tracker/pull/46). Regla que la produjo:
> `orquestar.md` §Post-mortem.
>
> **Ampliada el 2026-07-28** ([issue #59](https://github.com/hifede1/claude-audit-tracker/issues/59))
> con dos familias que la versión original no cubría: el falso negativo **por campo**, y la
> **medición defectuosa**. Las tres familias se distinguen por *dónde* está el error — en la
> cadena, en el campo, o en el instrumento.
>
> **Nota honesta sobre el origen:** el veto del PR #44 fue **provocado a propósito** para
> ejercitar la rama del loop, no un rechazo por defecto — **no destiló lección de contenido**, y
> se registra así. Lo que sí produjo conocimiento fue la **ronda de cambios** del PR #46 y el
> patrón acumulado de la jornada. El veto es el evento que destrabó la sesión, no su fuente.

## La regla, en una línea

**El significado no vive donde el detector mira.** De ahí salen las tres familias: el detector
mira **la cadena equivocada** (familia 1), **el campo equivocado** (familia 2), o mira bien y
**vos leés mal su resultado** (familia 3).

## Familia 1 — el detector busca una cadena: los cuatro casos verificados

Todo chequeo por `grep` sobre texto en prosa falla cuando el texto **cita**, **ejemplifica** o
**se parte en dos líneas**.

| # | Qué se chequeaba | Qué pasó | Tipo |
|---|---|---|---|
| 1 | ¿el plano está firmado? (línea de `011`) | La ficha **explicaba cómo firmar** y transcribía la línea como ejemplo. Un plano que se declara BORRADOR dio **exit 0** | falso **positivo** |
| 2 | ¿el JS del tracker parsea? | Regex `<script>([\s\S]*)</script>` **greedy**: capturó desde el primer `<script>` hasta el último, tragándose un comentario | falso **fallo** |
| 3 | ¿el archivo sigue afirmando X? ([#44](https://github.com/hifede1/claude-audit-tracker/pull/44)) | La afirmación estaba **citada dentro de su propia corrección**, precedida de «esto es falso» | falso **positivo** |
| 4 | ¿el documento declara Y? ([#45](https://github.com/hifede1/claude-audit-tracker/pull/45)) | La declaración existía, **partida por un salto de línea** del markdown a 100 columnas | falso **negativo** |

## Familia 2 — el detector mira el campo equivocado

**El caso** ([issue #59](https://github.com/hifede1/claude-audit-tracker/issues/59), 2026-07-28):
`/proximo-encargo` busca su trabajo con `gh issue list --label encargo --assignee @me`. Devolvió
**cero** con un encargo abierto, libre y tomable. El encargo **no tenía assignee**.

El chequeo no falló: hizo exactamente lo que su spec dice. Lo que falló es que **el significado
—«¿hay trabajo para mí?»— no vive en ese campo**, vive en el cruce de tres (`assignee`, label
`maquina/*`, y reclamos 🔒 en los comentarios). Medido: **3 de los 5 encargos publicados en la
historia del repo eran invisibles**, y la única corrida que funcionó lo hizo por azar.

**Es el primer falso NEGATIVO por campo de este repo** — los cuatro de la familia 1 son sobre
texto. Y es el más peligroso de los dos signos: un falso positivo grita (rompés algo y se nota);
**un falso negativo se ve idéntico a «todo en orden»**. Nadie investiga un cero.

> **La pregunta que lo caza:** no «¿el chequeo devolvió lo que esperaba?» sino **«¿un resultado
> vacío y el mundo vacío se ven distinto desde acá?»**. Si no se distinguen, tu chequeo no puede
> decirte nada — y su silencio va a leerse como buenas noticias.

## Familia 3 — el chequeo está bien; la MEDICIÓN está mal

Los dos casos son del 2026-07-28 y **los cometió el mismo ejecutor el mismo día**:

| # | Qué se midió | Qué devolvió en realidad |
|---|---|---|
| 1 | `node scripts/check-consistency.js \| head -2; echo $?` — «el gate pasa» | el exit code de **`head`**, no el del script. El gate andaba; la medición, no |
| 2 | `cd otro/repo && … && md5 -q docs/FICHA.md` — «el testigo del cwd está intacto» | el md5 del **otro repo**: el `cd` del mismo comando compuesto ya había movido el piso |

**El patrón común:** en los dos, lo medido y lo que uno *cree* medido están separados por un
operador de shell que nadie mira — un `|` y un `&&`. El comando corre, imprime algo plausible, y
lo plausible se toma por verdadero.

**Qué hacer:** medí **una cosa por comando**. Sin pipe cuando lo que te importa es el exit code
(`node script.js; echo $?`, y si querés ver poco, redirigí a un archivo y leelo aparte). Sin `cd`
compartido cuando lo que te importa es *dónde* estás parado. Y cuando un número te sorprenda —
para bien o para mal— **sospechá de la regla, no del mundo**: es la misma regla del punto 4 de
abajo, aplicada al instrumento en vez de al detector.

## Qué hacer, entonces

1. **Acotá el ámbito antes de buscar.** «El bloque `fuentes` afirma X» no se verifica sobre el
   archivo entero: se verifica **sobre el frontmatter**. Casi todos los falsos positivos salen de
   buscar en más territorio del que el criterio nombra.
2. **Normalizá los espacios** cuando busques prosa: `texto.replace(/\s+/g,' ')`. El markdown corta
   líneas y tu regex no cruza saltos.
3. **Distinguí uso de mención.** Un texto que corrige, cita o ejemplifica contiene la cadena que
   estás cazando. Si el criterio es «ya no afirma X», el chequeo tiene que mirar **dónde se
   afirma**, no dónde aparece.
4. **Ante un rojo, sospechá primero del chequeo.** De los cuatro casos de la familia 1, **ninguno
   era un defecto del archivo**: los cuatro eran defectos del verificador.
5. **Ante un VERDE o un CERO, sospechá igual.** Es el punto anterior en el signo incómodo, y
   cuesta el doble: nadie audita una buena noticia. Antes de aceptar un resultado vacío,
   contestá **«¿cómo se vería esto si el detector estuviera ciego?»** — si la respuesta es
   «igual», no verificaste nada (familias 2 y 3).
6. **Un criterio de contenido documental rara vez es clavable por test.** Cuando no lo sea,
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
