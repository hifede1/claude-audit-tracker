# 001 — El tracker es un mapa, no un despachador

**Estado:** ✅ **aceptada** · 2026-07-09 (v1.0.0–v1.1.0) · asentada retrospectivamente el 2026-07-26
**Procedencia:** decisión tomada e implementada en v1.0.0/v1.1.0; ratificada por el merge del
dueño (`hifede1`) de los PRs que la construyeron. Este ADR le da forma de contrato a una
decisión ya vigente — **no la re-litiga**.
**superaA:** —

## Contexto / problema

El tracker vivo es un artifact HTML autocontenido: se publica, se comparte por URL y se
commitea al repo. La pregunta estructural: ¿ese artefacto debe también **repartir el trabajo**
—asignar tareas, marcar quién toma qué— o solo **mostrar el estado**?

La tentación es fuerte: ya tenés la vista de todo el proyecto, poner ahí los assignees parece
natural.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **1. Tracker como despachador** (asignación adentro) | Todo en un lugar · Pero: el artifact corre con **CSP estricta, sin backend**; el estado tendría que vivir en `localStorage` — es decir, **por navegador**. Dos personas verían asignaciones distintas y ninguna sería la verdad. |
| **2. Tracker como mapa; la cola vive en GitHub Issues** ✅ | La asignación usa un sustrato que ya existe, con permisos, notificaciones e historial reales · Cuesta: el estado vive en dos lugares y hay que declarar cuál manda. |
| **3. Backend propio** | Resolvería ambas · Pero: infra que mantener, auth, hosting — desproporcionado para un plugin, y rompe la propiedad de artifact autocontenido. |

## Decisión y porqué

**Opción 2.** El tracker es un **mapa**, no un despachador.

El porqué es duro, no estético: un artifact con CSP estricta **no puede** sostener estado
compartido. Los ticks en `localStorage` son por navegador. Cualquier asignación que viviera ahí
sería una opinión local disfrazada de estado del proyecto — la clase exacta de mentira que este
producto existe para eliminar.

La asignación va a **GitHub Issues**: `[S<NN>] <objetivo>`, labels `encargo` + `sesion-NN`,
assignees para personas y `maquina/<nombre>` para máquinas sin persona fija.

## Consecuencias

- **GitHub es la fuente de verdad de la cola.** Todo snapshot local (`.claude/audit-tracker-state.json`)
  es **cache de arranque**, nunca autoridad. La regla derivada — *el snapshot orienta, GitHub decide* — nace acá.
- `/proximo-encargo` y `/orquestar` consumen esa cola y coexisten sin pisarse (reclamo por comentario).
- El tracker puede regenerarse entero sin perder asignaciones: no las tiene.
- **Costo aceptado:** el estado vive en dos superficies (artefacto y canal) y pueden divergir.
  Divergencia observada el 2026-07-26: el `estado.json` declaraba S06 «EN PAUSA» mientras el
  issue #9 seguía abierto sin marca — el canal mostraba como accionable algo que el artefacto
  tenía bloqueado.
