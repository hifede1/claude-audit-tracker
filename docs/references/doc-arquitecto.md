---
tema: doc-arquitecto — la herramienta hermana que produce y audita el plano (el contrato que este audit-tracker consume)
triggers: [doc-arquitecto, documentación, plano, documentar, auditar-docs, contrato, references, fede-tools]
fecha: 2026-07-18
fuentes:
  - https://github.com/hifede1/claude-doc-arquitecto (v1.0.0)
  - claude-doc-arquitecto/docs/FICHA.md — contrato de diseño firmado
  - claude-doc-arquitecto/README.md
  - Verificación empírica: pipeline e2e doc-arquitecto → audit-tracker (2026-07-17)
---

# doc-arquitecto — el que escribe el plano que este audit-tracker audita

## Por qué le importa al audit-tracker

El audit-tracker audita la **obra** (el código) contra la documentación del proyecto — pero es
tan bueno como esa documentación. `doc-arquitecto` produce y audita el **plano** (la
documentación-contrato) para que el audit-tracker lo consuma **sin traducción**. Es la mitad
upstream del par; se instala junto con el audit-tracker desde el mismo marketplace `fede-tools`.

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
```

## Los dos comandos

- **`/documentar`** — produce el plano.
  - *Modo nuevo* (repo sin docs): entrevista guiada por etapas (propósito → alcance →
    decisiones estructurales con opciones y tradeoffs → plan de sesiones); genera `docs/`
    completo solo con el plan confirmado por el humano.
  - *Modo existente* (repo con docs/código): inventaría, detecta huecos contra el contrato,
    completa con **diffs confirmados archivo por archivo**. Guardia de Escritura Universal:
    ningún archivo existente se pisa sin confirmación, en cualquier modo. Idempotente.
- **`/auditar-docs`** — audita el plano en seis dimensiones (completitud, contradicciones,
  criterios no verificables, decisiones sin registrar, referencias faltantes/vencidas, drift
  doc↔doc), con severidad y `file:línea`; arreglos uno por uno con confirmación, «requiere
  decisión humana» donde arreglar sería inventar.

## El contrato de formato — lo que este audit-tracker recibe

Lo que `/documentar` emite es EXACTAMENTE lo que este audit-tracker consume. Si tocás cómo el
audit-tracker lee el plano, esto es lo que le llega:

- **`PLAN.md`** — una ficha por sesión: 🎯 planteamiento · 🛠️ método · ✅ criterios (cada uno
  con `(verificación: …)`) · 📚 referencias (solo links) · ⛓️ prerrequisitos · estimación →
  alimenta los BLOQUES/fichas del tablero.
- **`decisiones/NNN-*.md`** — ADRs: contexto · opciones con tradeoffs · decisión y porqué ·
  consecuencias · estado (aceptada/pendiente con dueño) · `superaA` → pestaña Decisiones.
- **`references/README.md`** — catálogo que la pestaña Referencias consume: por fila, tema · qué
  resuelve · fecha · **triggers con valores** · quién la usa · frescura (🟢🟠🔴) · path; cubre
  `references/` (CÓMO) y `business/` (QUÉ) → pestaña Referencias.
- **`business/*.md`** — el QUÉ del negocio, con frontmatter machine-readable
  `tema`/`fecha`/`triggers`/`resumen`.
- **`VISION.md` / `ALCANCE.md`** — propósito/éxito y v1 sí/no.

**Gotcha verificado (e2e 2026-07-17):** el catálogo de referencias debe exponer los `triggers`
con VALORES (no «ver frontmatter») y catalogar `business/`; si no, el audit-tracker tendría que
abrir archivos del repo hermano o fabricar datos a mano = adaptación manual. La v1.0.0 de
doc-arquitecto ya lo cumple (fue un hallazgo del propio e2e adversarial, arreglado en la fuente).

## Regla transversal (compartida)

Lo estructural se le pregunta SIEMPRE al humano con opciones y tradeoffs; la herramienta jamás
inventa decisiones de negocio ni de arquitectura. Herencia directa del modo orquestado de este
audit-tracker.

## Instalación

```
/plugin marketplace add hifede1/claude-doc-arquitecto
/plugin install doc-arquitecto@fede-tools
```
