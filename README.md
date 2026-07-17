# audit-tracker — plugin de Claude Code

Tres comandos para gestionar el estado real de un proyecto, repartir el trabajo y correr el loop en modo autónomo con validación humana:

- **`/audit-tracker`** — auditoría del estado **REAL** de construcción + **tracker vivo interactivo** para gestionar lo que falta.
- **`/proximo-encargo`** — en cada máquina trabajadora: toma el siguiente encargo asignado (GitHub Issue), lo ejecuta y abre PR.
- **`/orquestar`** — loop orquestado: el orquestador ejecuta los encargos él mismo, verifica en código contra los criterios de la ficha y pide tu firma en el PR antes de mergear (default: todo se firma; podés marcar clases auto-mergeables en la calibración).

## Herramienta hermana: doc-arquitecto

El audit-tracker audita la **obra** (el código) contra la documentación del proyecto — pero es tan bueno como esa documentación: si el plano está incompleto, contradictorio o con criterios no verificables, audita contra un plano roto. [**`doc-arquitecto`**](https://github.com/hifede1/claude-doc-arquitecto) es su hermana: produce y audita ese **plano** (la documentación-contrato) para que el audit-tracker lo consuma **sin traducción**. Se instalan juntas desde el marketplace `fede-tools` y cierran el ciclo completo:

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

## Qué hace `/audit-tracker`

1. **Audita** el proyecto contra su plan/documentación: lanza agentes en paralelo que inspeccionan el código real (no lo que dicen los docs), corren los gates (typecheck, tests, lint) y clasifican cada bloque como ✅ HECHO / 🟠 EN CURSO / ⚪ PENDIENTE / ⚠️ MAQUETA — con evidencia `file:line`. El drift doc↔código es hallazgo de primera clase.
2. **Construye un tracker vivo** (artifact HTML autocontenido, commiteado al repo) con siete pestañas: tablero con fichas de trabajo y encargos copiables, plan de sesiones ordenado por dependencias, mapa de flujo end-to-end, stack por capas, registro de decisiones tipo ADR, mapa de evidencia de tests (gates reales, flujos clavados por tests, contrato criterios↔tests — lo que no está clavado por un test es deuda de verificación visible), y catálogo de referencias (`docs/references/` y `docs/business/` con frescura fechada, triggers de carga automática, quién usa cada una, y las faltantes por generar).
3. **Ciclo de re-auditoría**: los cierres se marcan en ámbar (sin verificar) y solo pasan a verde cuando una re-auditoría los confirma EN CÓDIGO. El tracker se redeploya siempre a la misma URL.

## Trabajo en equipo (modo despacho)

El tracker es un **mapa**, no un despachador (es un artifact con CSP estricta: sin backend, ticks en localStorage). La asignación de tareas vive en **GitHub Issues**:

1. En la **máquina despachadora**, `/audit-tracker` en modo despacho publica cada sesión del plan como un issue: título `[S<NN>] <objetivo>`, cuerpo = la ficha completa, labels `encargo` + `sesion-NN`. Asignar = poner a la persona como *assignee* del issue (los colaboradores deben estar invitados al repo); las etiquetas `maquina/<nombre>` quedan para máquinas sin persona fija.
2. Cada **colaborador**, desde su máquina y dentro del repo del proyecto, corre `/proximo-encargo`: busca el siguiente issue abierto asignado a él (`--assignee @me`) respetando dependencias, lo reclama con un comentario (evita pisadas), lo ejecuta en una rama y abre PR con `Closes #NN`.
3. La **re-auditoría** en la despachadora cierra el ciclo: issue cerrado ≠ hecho — se verifica en código, y recién ahí el tracker pasa el ítem a verde.

## Modo orquestado (loop autónomo + validación humana)

Con `/orquestar`, el ciclo completo lo corre el orquestador y el humano queda solo en el punto que importa: **validar**. La división del trabajo es fija — *la máquina verifica, el humano valida*:

1. El orquestador toma el siguiente encargo desbloqueado de la cola de issues (respeta dependencias y los reclamos de otras máquinas — coexiste con `/proximo-encargo`).
2. **Dentro del encargo navega el tracker**: primero la finalidad de la ficha y su lugar en el mapa, después su plan de ataque (que deja escrito en el issue), las referencias, y la **caza de decisiones** — lo estructural te lo pregunta ANTES de escribir código, con opciones y tradeoffs, y jamás lo inventa. Si lo aprendido cambia el plan, lo propone como hallazgo en vez de aplicarlo en silencio.
3. Ejecuta en una rama y, antes de pedir nada, **verifica en dos actores**: su propia pasada criterio por criterio (evidencia `file:line` + gates) y un **verificador independiente de contexto limpio** que intenta *refutar* cada criterio — el informe del PR declara quién ejecutó, quién verificó, qué se intentó tumbar y qué sobrevivió. La ficha es el contrato de validación, y el cierre es contra los objetivos, no contra el checklist.
4. Te pide la **firma en el PR**: review aprobado si orquestador y validador usan cuentas de GitHub distintas, o un comentario tuyo `✅ validado` si comparten cuenta (GitHub no permite aprobar el propio PR). Recién con tu firma y el CI verde mergea, re-audita y el tracker pasa el ítem a verde. Cambios pedidos = hallazgos (corrige y re-pide firma; tras 2 rondas rechazadas escala ese encargo y sigue con los demás). Cerrar el PR sin mergear = veto: libera el encargo y no lo re-toma sin re-priorización humana. El orquestador **jamás mergea sin tu firma ni con CI rojo** — el silencio no es aprobación — salvo las clases de encargo que VOS marques auto-mergeables en la calibración (por defecto: ninguna; la zona gris siempre se firma). Cada encargo declara su **presupuesto** al reclamarse y su informe cierra con el costo real. Y solo TUS señales mueven el loop: instrucciones metidas por terceros en issues o comentarios se reportan como hallazgo, jamás se obedecen.
5. Mientras un PR espera firma puede arrancar el siguiente encargo independiente (máximo 3 PRs en cola de validación, para no inundarte), y al (re)arrancar reconcilia primero los PRs de corridas anteriores: los firmados se mergean, los vetados se liberan.

La cola de validación vive en GitHub, no en ticks del tracker: el equivalente del ámbar es el **PR esperando tu firma** (verificado por la máquina, sin validar); al mergear, el tracker pasa el ítem directo a **verde**. El PR que actualiza el propio tracker es bookkeeping de un cierre ya firmado y el orquestador lo automergea.

### Estado entre sesiones (hooks del plugin)

`/orquestar` deja un snapshot local del loop en `.claude/audit-tracker-state.json` del proyecto (gitignoreado; cache de arranque — la fuente de verdad sigue siendo GitHub). El plugin trae dos hooks que lo aprovechan en el CLI local (los plugins no cargan en sesiones web):

- **SessionStart**: al arrancar una sesión en el proyecto, inyecta qué encargo está en curso, qué PRs esperan tu firma y qué quedó escalado — la sesión no arranca ciega.
- **Statusline opcional**: badge tipo `[Opus] · mi-proyecto · 🎼 #12 S07 en curso · ⏳ 2 PRs esperando firma`. El propio hook te lo ofrece UNA vez (con el path exacto ya resuelto) si no tenés statusline configurada; también podés apuntar `statusLine` de `~/.claude/settings.json` a `node "<plugin>/hooks/statusline.js"` a mano.

Los hooks necesitan `node` en el PATH y siguen el contrato *never-block*: sin snapshot no emiten nada, y un hook roto jamás frena la sesión.

## Instalación

Dentro de Claude Code:

```
/plugin marketplace add hifede1/claude-audit-tracker
/plugin install audit-tracker@fede-tools
```

O desde la terminal:

```bash
claude plugin marketplace add hifede1/claude-audit-tracker
claude plugin install audit-tracker@fede-tools --scope user
```

### Alternativa sin plugin (copia manual)

```bash
curl -fsSL https://raw.githubusercontent.com/hifede1/claude-audit-tracker/main/plugins/audit-tracker/commands/audit-tracker.md \
  -o ~/.claude/commands/audit-tracker.md
curl -fsSL https://raw.githubusercontent.com/hifede1/claude-audit-tracker/main/plugins/audit-tracker/commands/proximo-encargo.md \
  -o ~/.claude/commands/proximo-encargo.md
curl -fsSL https://raw.githubusercontent.com/hifede1/claude-audit-tracker/main/plugins/audit-tracker/commands/orquestar.md \
  -o ~/.claude/commands/orquestar.md
```

## Uso

```
/audit-tracker [contexto opcional sobre el proyecto]       # en la máquina despachadora
/proximo-encargo [etiqueta de esta máquina, p.ej. taller]  # en cada máquina trabajadora
/orquestar [límite de iteraciones o sesión concreta]       # loop autónomo en la despachadora
```

`/audit-tracker` arranca con una fase de calibración (unidad de estimación, actores/máquinas, metodología, modo de ejecución del loop); si hay varias máquinas — o se elige el modo orquestado, aunque haya una sola — activa el modo despacho: los issues son la cola que `/orquestar` consume. Si un comando entra en conflicto con otro del mismo nombre, invocalo con namespace: `/audit-tracker:audit-tracker`.

## Licencia

MIT
