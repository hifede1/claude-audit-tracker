# Plan de sesiones — `audit-tracker`

**Unidad de estimación:** sesiones (~2-4h) · **Metodología:** directa · **Loop:** orquestado
(despacho activo) · **Firma:** comentario `✅ validado` en el PR (orquestador y validador
comparten cuenta `hifede1`).

**Fecha:** 2026-07-26 · **Naturaleza: RETROSPECTIVO + v2.** Asienta el trabajo ya construido y
verificado (v1.0.0 → v1.12.0) y abre las sesiones que salen de la deuda declarada en
`ALCANCE.md` §3.

> **Advertencia de honestidad sobre las sesiones de v2.** Las sesiones **S06, S08 y S10** tienen criterios
> que dependen de **provocar condiciones que todavía no ocurrieron** (un veto real, corridas
> suficientes para decidir telemetría). Nacen con criterio **verificable pero no ejercitado**, y
> este plano lo declara en vez de disimularlo. La misma forma que dejó a S06 en pausa.

---

## Historial — lo construido (v1.0.0 → v1.12.0)

Las fichas originales de las sesiones tempranas **no se conservaron como documento**: el plan
vivía en el tracker y en los issues. Este historial se reconstruye desde `CHANGELOG.md`, que sí
guarda cada entrega con su porqué. **No se inventan fichas retrospectivas** de sesiones cuyo
contrato original no existe.

| Versión | Entrega | Estado |
|---|---|---|
| v1.0.0 | `/audit-tracker` + tracker vivo + semántica ámbar/verde | ✅ |
| v1.1.0–v1.2.0 | Modo despacho multi-máquina + `/proximo-encargo` + assignees | ✅ spec |
| v1.3.0 | `docs/references/` — investigación destilada con citas y fecha | ✅ |
| v1.4.x | `/orquestar` + 8 agujeros cerrados tras panel adversarial | ✅ |
| v1.5.0–v1.6.0 | Pestañas 🧪 Tests y 📚 Referencias | ✅ |
| v1.7.0 | Protocolo «DENTRO DEL ENCARGO» | ✅ |
| v1.8.0–v1.8.1 | Triggers en referencias · freno anti-loop · fallback de calibración | ✅ |
| v1.9.0 | Verificador independiente (dos actores) | ✅ |
| v1.10.0 | Anti-inyección · firma selectiva por riesgo · presupuesto | ✅ |
| v1.11.0–v1.11.1 | Hooks de estado · CI anti-drift · fix de carga | ✅ |
| v1.12.0 | Estado consumible (`<proyecto>-estado.json`) + contrato | ✅ |

**Pendientes cerrados y verificados a la fecha: 10.**

### S04 — Instalación local verificada + hooks reales + troubleshooting

✅ **CERRADA** (v1.11.1, encargo #7). Produjo el fix de la regresión de carga —el manifiesto
declaraba `hooks` y Claude Code ya lo auto-carga → doble carga → el plugin fallaba en
instalación limpia— y la sección Troubleshooting del README con fricciones reales.
**Lección: nadie lo había visto porque nadie hizo el install end-to-end.**

---

## S06 — Aprendizaje post-mortem: cada veto o escalada destila su lección

⏸️ **EN PAUSA — gated por EVENTO.** Issue [`#9`](https://github.com/hifede1/claude-audit-tracker/issues/9).

🎯 **Planteamiento.** Cuando un PR necesita 2 rondas o el validador lo veta, esa lección hoy
**muere en los comentarios**. El sistema no debe repetir un error que ya obligó al humano a
corregirlo una vez.

🛠️ **Método.**
1. Regla en `orquestar.md`: tras un veto o escalada resuelta, el orquestador destila la lección
   a la referencia del tema en `docs/references/` (o al 🛠️ método de la ficha si es específica
   del bloque), con fecha y link al PR de origen.
2. La re-auditoría verifica que la lección llegó: **veto sin lección destilada = pendiente nuevo**.
3. Ejercitarlo con un caso real.

✅ **Criterios de aceptación.**
- [ ] `orquestar.md` define la regla post-mortem *(verificación: inspección del comando — la regla nombra dónde se destila, con qué fecha y con qué link)*
- [ ] La re-auditoría trata «veto sin lección» como pendiente nuevo *(verificación: inspección de `audit-tracker.md`)*
- [ ] Un caso real: lección destilada con link al PR que la originó *(verificación: la referencia contiene la lección fechada y el link)*

📚 **Referencias.** `docs/references/openhands-agentes.md` (stuck detection, escaladas y firma por riesgo)

⛓️ **Prerrequisitos.** El tercer criterio **no depende de trabajo ni de una firma: depende de un
EVENTO** —que ocurra un veto o una escalada real—. Al 2026-07-26 no ocurrió ninguno.
**Lo destraba S08**, que los provoca a propósito. Hasta entonces esta sesión no es cerrable, y
el issue #9 debe leerse como pausado, no como accionable.

**Estimación: S** (los dos primeros criterios) **+ dependencia de S08** (el tercero).

---

## S07 — Ejercitar `/proximo-encargo` en corrida real

🎯 **Planteamiento.** `b-prox` está 🟠 EN CURSO con una spec estable desde v1.1 y **cero corridas
reales: ninguna máquina tomó jamás un encargo**. Una spec sin ejercitar es una promesa, no una
capacidad — la lección de S04 (el install que nadie había hecho) aplica igual acá.

🛠️ **Método.** Publicar un encargo real en la cola, tomarlo desde una máquina trabajadora con
`/proximo-encargo`, verificar el reclamo por comentario, la rama y el PR con `Closes #NN`.

✅ **Criterios de aceptación.**

**Parte A — el MECANISMO** (ejercitable con un solo actor):
- [ ] Un encargo real reclamado por `/proximo-encargo` *(verificación: el comentario de reclamo existe en el issue, con su fecha)*
- [ ] Rama y PR abiertos por esa corrida, con `Closes #NN` *(verificación: el PR referencia el issue y lo cierra al mergear)*
- [ ] Las dependencias se respetaron: no tomó un encargo bloqueado *(verificación: inspección del orden contra el plan)*
- [ ] **No tomó un encargo liberado por veto sin re-priorización** *(verificación: los vetados siguen sin reclamo tras la corrida)*

**Parte B — el CRUCE de reclamos** ⛓️ **gated por una SEGUNDA IDENTIDAD**:
- [ ] Un intento de tomar un encargo ya reclamado por el orquestador → lo saltea *(verificación: dos actores con cuentas distintas, y el reclamo ajeno respetado)*

> ### ⚠️ Corrección de criterio (2026-07-28)
>
> Esta sesión nació pidiendo *«autoría de la máquina»* en el reclamo, y su valor real es el
> **cruce de reclamos** con el orquestador. **Las dos cosas exigen una segunda identidad de
> GitHub** — y `decisiones/027` la revirtió, `028` declaró el agujero. S07 se escribió antes de
> eso y quedó apoyada en un supuesto que el taller **ya no cumple**.
>
> Con una sola cuenta: la autoría del reclamo **no discrimina** quién lo puso, y no hay cruce que
> verificar — sería comprobar que un actor no se pisa a sí mismo.
>
> **Se parte en dos** en vez de declararla incumplible: el **mecanismo** se ejercita hoy con un
> actor y **prueba lo que la spec nunca probó en 6 meses**; el **cruce** espera una segunda
> identidad, que es una decisión abierta del taller (`028` la dejó reversible sin costo).
>
> Se agrega además un criterio que ayer no existía: **que no tome un encargo liberado por veto**.
> Salió de S08 — el `#41` está en esa condición ahora mismo, así que la cola tiene el caso listo.

📚 **Referencias.** `docs/references/claude-code-plugins.md`

⛓️ **Prerrequisitos.** Parte A: ninguno. **Parte B: una segunda identidad de GitHub** — no la
destraba trabajo ni una firma sobre este repo, sino una decisión del taller sobre `028`.

**Estimación: S** (parte A) **+ bloqueada** (parte B)

---

## S08 — Provocar las ramas difíciles del loop

🎯 **Planteamiento.** El loop se ejercitó **5 veces por el camino feliz**. Las ramas que
importan —cambios pedidos, **veto**, silencio prolongado— nunca corrieron. Un camino de error
sin ejercitar es un camino que no existe: la primera vez que se use va a ser en producción y con
algo en juego.

🛠️ **Método.** Provocar cada rama **a propósito**, en encargos de bajo riesgo: (a) pedir cambios
en un PR y verificar que corrige y re-pide firma; (b) **vetar** un PR cerrándolo sin mergear y
verificar que libera el encargo y no lo re-toma; (c) dejar un PR sin respuesta y verificar que
el silencio **no** aprueba.

✅ **Criterios de aceptación.**
- [ ] Rama «cambios pedidos» ejercitada *(verificación: el PR muestra corrección y nueva petición de firma; tras 2 rondas rechazadas el encargo escala)*
- [ ] Rama «veto» ejercitada *(verificación: PR cerrado sin merge → encargo liberado en la cola y NO re-tomado sin re-priorización)*
- [ ] Rama «silencio» ejercitada *(verificación: pasadas **72h** desde el último evento del PR, sigue abierto y sin mergear — ningún timeout lo aprobó. Umbral decidido el 2026-07-26: 72h cubre un fin de semana completo, que es el escenario real del silencio prolongado)*

📚 **Referencias.** `docs/references/openhands-agentes.md`

⛓️ **Prerrequisitos.** Ninguno para empezar. **Esta sesión DESTRABA el tercer criterio de S06**:
el veto que produce es el caso real que la lección post-mortem necesita.

> ### ⚠️ Corrección de clasificación (2026-07-27)
>
> Esta sesión nació declarada **gated-por-EJECUCIÓN**. **Es incorrecto**, y lo detectó la fase
> `planificar` de `batuta` al enumerar sus criterios:
>
> | Criterio | Qué lo cierra realmente |
> |---|---|
> | C1 · cambios pedidos | **un acto del validador** — pedir cambios dos veces |
> | C2 · veto | **un acto del validador** — cerrar un PR sin mergear |
> | C3 · silencio | **72 horas de reloj** |
>
> **Ninguno lo cierra la máquina trabajando.** Lo que la máquina cierra sola es *preparar el
> escenario*: publicar los encargos-vehículo (hecho el 2026-07-27, issues **#40**, **#41**,
> **#42**). De ahí en adelante la sesión avanza por **actos del validador** y por el **paso del
> tiempo**.
>
> Se corrige porque la clasificación equivocada tiene un costo concreto y conocido: si se lee
> como ejecución, la sesión se encarga y queda esperando sin que nadie sepa por qué — **la misma
> enfermedad que tuvo S06 durante dos semanas**, un escalón más arriba.

**Estimación: M** (la preparación) **+ dos actos del validador + 72h de reloj**

---

## S09 — Consumo end-to-end del `estado.json` por un tercero

🎯 **Planteamiento.** El artefacto se emite desde v1.12.0 y su contrato está declarado, pero
**el consumo end-to-end por `batuta` nunca se completó**. El 2026-07-26 `batuta` lo leyó en una
corrida real —schema, `last_audit`, bloques y plan, sin parsear HTML y sin disparar auditoría—
pero **frenó antes** del end-to-end: este repo no tenía plano firmado. Ese bloqueo lo levanta
este mismo plano.

🛠️ **Método.** Correr `batuta` contra este repo con el plano ya firmado y verificar que atraviesa
`analizar` → `planificar` consumiendo el artefacto, sin re-auditar.

✅ **Criterios de aceptación.**
- [ ] `batuta` pasa la precondición de plano sobre este repo *(verificación: su registro de cadena declara `plano_version` con la fecha de firma, no «AUSENTE»)*
- [ ] Consume el artefacto sin invocar `/audit-tracker` *(verificación: la traza no muestra invocación del comando en fase 1)*
- [ ] La emisión automática queda ejercitada *(verificación: una re-auditoría emite el `estado.json` y el CI de consistencia pasa)*

📚 **Referencias.** `docs/estado-contrato.md`

⛓️ **Prerrequisitos.** Plano firmado de este repo — **cubierto por esta corrida** (`FICHA.md`
con la línea de firma). El tercer criterio depende además de una re-auditoría real.

**Estimación: S**

---

## S10 — Decidir la telemetría del loop

🎯 **Planteamiento.** No hay telemetría del loop —rondas por encargo, escaladas, costo real
contra presupuesto— y **está sin decidir si vale la pena**. La deuda declarada dice
explícitamente «decidir tras las primeras corridas»: es una **decisión, no una construcción**.

🛠️ **Método.** Reunir la evidencia de las corridas ya hechas (5 del loop + las de S07/S08),
presentar 2-3 opciones con tradeoffs —sin telemetría · contadores mínimos en el informe del PR ·
métricas agregadas en el tracker— y llevarla a firma como ADR.

✅ **Criterios de aceptación.**
- [ ] ADR con opciones y tradeoffs, firmado o explícitamente pendiente con dueño *(verificación: `docs/decisiones/NNN-*.md` con estado y procedencia)*
- [ ] Si la decisión es construir: sesión propia con criterios verificables *(verificación: ficha nueva en este plan)*

📚 **Referencias.** 🔴 **faltante** — «Telemetría y observabilidad de loops autónomos» (ver
`references/README.md` §Faltantes). Identificada acá; **generarla es trabajo de un encargo**, no
de este plano.

⛓️ **Prerrequisitos.** **Gated-por-FIRMA, no por ejecución.** Necesita las corridas de S07 y S08
como evidencia; ninguna cantidad de código la destraba.

**Estimación: S**

---

## Resumen

| Sesión | Objetivo | Talle | Qué la retiene |
|---|---|---|---|
| S04 | Instalación verificada + hooks reales | S | ✅ cerrada (v1.11.1) |
| **S06** | Aprendizaje post-mortem | S | ⏸️ **EVENTO** — la destraba S08 |
| **S07** | Ejercitar `/proximo-encargo` | S | **A:** — · **B:** una SEGUNDA IDENTIDAD *(la retiró `027`)* |
| **S08** | Provocar las ramas difíciles del loop | M | **ACTO DEL VALIDADOR** + 72h de reloj *(la preparación ya está: #40 · #41 · #42)* |
| **S09** | Consumo end-to-end del `estado.json` | S | plano firmado ✅ (esta corrida) |
| **S10** | Decidir telemetría | S | **FIRMA** + evidencia de S07/S08 |

**Cinco compuertas distintas, declaradas** *(actualizado el 2026-07-28)*:
**S07·A** espera **ejecución** · **S06** esperaba un **evento** (S08 lo produjo → cerrada) ·
**S10** espera una **firma** · **S08** espera **dos actos del validador y 72h de reloj** ·
**S07·B** espera una **IDENTIDAD** — algo que ni el trabajo, ni una firma, ni el tiempo destraban.

Confundirlas es lo que deja un proyecto esperando meses por «que alguien lo haga» cuando en
realidad esperaba otra cosa.

> **Este plan ya se equivocó dos veces en su primera semana de vida.**
>
> **S08** nació clasificada como ejecución y no lo era: nadie la habría destrabado trabajando.
>
> **S07** nació pidiendo «autoría de la máquina» y un cruce de reclamos — **las dos cosas
> necesitan una segunda identidad de GitHub, que `027` revirtió y `028` declaró ausente**. La
> sesión quedó apoyada en un supuesto que el taller dejó de cumplir, y nadie lo notó hasta que
> se fue a ejecutar.
>
> Las dos las detectó **enumerar criterio por criterio antes de trabajar** — no la intuición de
> nadie. La lección: **la clasificación se deriva de los criterios, y los criterios se revisan
> contra lo que el taller es HOY, no contra lo que era cuando se escribieron.**
