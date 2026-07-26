---
tema: El taller fede-tools — para quién es audit-tracker, su lugar en la caja y sus restricciones
fecha: 2026-07-26
triggers: [taller, fede-tools, marketplace, flota, batuta, doc-arquitecto, publicador, verificador, cartera, licencia, colaboradores]
resumen: El QUÉ del proyecto — quién lo usa, qué lugar ocupa entre las herramientas del taller y bajo qué restricciones se construye.
---

# El taller `fede-tools` — contexto de negocio de `audit-tracker`

## Para quién es

**No es un producto de mercado.** Es una herramienta de trabajo propia, publicada como open
source (MIT) porque no cuesta nada compartirla, no porque haya un usuario objetivo que
conquistar.

Tres consumidores reales, en orden de peso:

1. **El dueño del proyecto** (Fede, `hifede1`), en la máquina despachadora: audita, reparte y
   valida. Es el usuario para el que se toman todas las decisiones de diseño.
2. **Colaboradores y máquinas trabajadoras**: toman encargos de la cola de GitHub Issues. Hoy
   es una capacidad **especificada pero no ejercitada** — ninguna máquina tomó jamás un encargo
   (`PLAN.md` S07).
3. **Otras herramientas del taller**, que consumen su artefacto de estado sin re-auditar. Este
   consumidor **no estaba previsto** en el diseño original: apareció cuando `batuta` lo pidió
   (issue #31), y produjo el contrato de `docs/estado-contrato.md`.

Que el tercer consumidor sea una **máquina** y no una persona es la característica de negocio
más particular del proyecto: buena parte de su superficie pública es un contrato JSON.

## El taller y su flota

`audit-tracker` no vive solo. Es parte de una caja de herramientas que se compone entre sí:

| Herramienta | Qué hace | Relación |
|---|---|---|
| **`doc-arquitecto`** | Produce y audita el **plano** (la documentación-contrato) | **Hermana.** Su salida es la entrada de `audit-tracker`, sin traducción |
| **`audit-tracker`** | Audita la **obra** (el código) contra ese plano | — |
| **`batuta`** | Orquesta el ciclo entero, de objetivo a obra | **Consumidor.** Tiene prohibido reimplementar delegados: cuando le falta algo, frena y lo pide |
| **`publicador`** | Publicar / pushear | Delegado del taller |
| **`verificador`** | Convertir criterios en tests | Delegado del taller |
| **`cartera`** | Enumerar y priorizar la flota completa | Consume trackers de todos |

La regla que mantiene sana esa composición: **nadie reimplementa el trabajo de otro**. Cuando
una herramienta necesita algo que otra debería dar y no da, el resultado correcto es **frenar y
reportar el hueco**, no resolverlo por su cuenta. Este mismo plano existe por esa regla: `batuta`
frenó ante la falta de plano en vez de fabricarlo.

## Restricciones que ordenan el diseño

- **Licencia MIT.** Sin modelo de negocio, sin monetización, sin roadmap comercial.
- **Distribución por marketplace de Claude Code** (`fede-tools`) — instalación con dos
  comandos, sin infra propia.
- **Cero backend.** El tracker es un artifact autocontenido con CSP estricta. Toda persistencia
  compartida vive en GitHub (`decisiones/001`).
- **Un solo humano en el camino crítico.** Las decisiones de producto y las firmas son de una
  sola persona: eso hace **innecesaria** la maquinaria de consenso y **crítico** que la firma
  humana no se pueda saltear.
- **Misma cuenta de GitHub** para orquestador y validador (`hifede1`): por eso el canal de firma
  es el comentario `✅ validado` y no un review aprobado — GitHub no permite aprobar el propio PR.

## Qué significaría el éxito

No usuarios, ni estrellas, ni instalaciones. **Que el dueño pueda responder con evidencia, en
cualquier momento y sin releer el repo, qué está realmente construido en cada proyecto de su
flota** — y que otras máquinas puedan responder esa misma pregunta leyendo un archivo.
