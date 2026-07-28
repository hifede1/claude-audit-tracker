# 011 — Un cambio de comportamiento del producto exige MINOR, aunque el CI no lo obligue

**Estado:** ✅ **aceptada** · 2026-07-27 · **Decidida por:** Fede, en sesión interactiva, **antes
de codificar** (caza de decisiones del encargo #9).
**Procedencia:** aplicada en el acto — el PR
[`#49`](https://github.com/hifede1/claude-audit-tracker/pull/49) salió como **v1.13.0** con su
entrada de CHANGELOG, mergeado por el dueño.
**Registro previo:** ninguno.
**superaA:** —

## Contexto / problema

S06 cambiaba el comportamiento de dos comandos: `/orquestar` ganaba una obligación nueva
(destilar la lección) y `/audit-tracker` un chequeo nuevo (episodio sin lección = pendiente).

Y apareció un hueco que nadie había mirado: **el CI no obliga a bumpear.**
`check-consistency.js` verifica que la **versión declarada tenga entrada en CHANGELOG** — y
`v1.12.0` ya la tenía. O sea que se podía cambiar el comportamiento de los comandos, mergear con
todos los gates en verde, y **dejar el producto distinto bajo el mismo número de versión**.

El gate protege la *coherencia* del CHANGELOG, no la *honestidad* del versionado.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Sin bump** — tratarlo como refinamiento de comandos existentes | Cero ceremonia, y el CI pasa igual · Pero **quien instale `v1.12.0` hoy y mañana obtiene comportamientos distintos bajo el mismo número**. El versionado deja de significar algo. |
| **2. MINOR ante todo cambio de comportamiento** ✅ | El número vuelve a ser información · Cuesta: hay que bumpear y escribir CHANGELOG también cuando el diff es de prompts en markdown. |
| **3. Agregar un gate que lo obligue** | No dependería del criterio de nadie · Pero **¿cómo detecta un gate que un prompt cambió de comportamiento y no solo de redacción?** No es mecanizable sin falsos de los dos lados. |

## Decisión y porqué

**Opción 2.** Un cambio en lo que los comandos **hacen** —no en cómo lo explican— sale como
**MINOR** con su entrada de CHANGELOG, **aunque ningún gate lo pida**.

El porqué: en este producto **los comandos SON el código**. Un prompt que gana una obligación
cambia el comportamiento igual que una función nueva. Tratarlo como «documentación» porque el
archivo es `.md` es confundir el formato con la naturaleza.

Y la 3 se descartó por honestidad sobre sus límites: distinguir «cambió de comportamiento» de
«cambió de redacción» exige leer intención, y un gate que intente eso va a dar falsos en las dos
direcciones. **La regla es de criterio humano, y se declara como tal en vez de fingir que se puede
automatizar.**

## Consecuencias

- Cada PR que toque `plugins/audit-tracker/commands/**` cambiando conducta **bumpea MINOR**. Los
  que solo corrigen redacción, ejemplos o typos, no.
- La frontera «conducta vs redacción» la juzga quien escribe el PR y la revisa quien firma. **Es
  criterio, no gate** — y por eso vive acá, donde se puede discutir.
- **El CI sigue sin poder atraparlo.** Queda declarado como límite conocido, igual que el gotcha
  de instalación (`references/claude-code-plugins.md`) y el drift del encabezado del tracker: en
  los tres casos, *lo que ningún gate mira, driftea en silencio*.
- **Riesgo declarado:** sin gate, la regla depende de que alguien se acuerde. La primera vez que
  un cambio de conducta salga sin bump, esta decisión no se habrá roto — se habrá revelado como
  insuficiente, y ahí tocará la opción 3 con sus falsos y todo.
