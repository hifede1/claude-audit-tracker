# audit-tracker — plugin de Claude Code

Tres comandos para gestionar el estado real de un proyecto, repartir el trabajo y correr el loop en modo autónomo con validación humana:

- **`/audit-tracker`** — auditoría del estado **REAL** de construcción + **tracker vivo interactivo** para gestionar lo que falta.
- **`/proximo-encargo`** — en cada máquina trabajadora: toma el siguiente encargo asignado (GitHub Issue), lo ejecuta y abre PR.
- **`/orquestar`** — loop orquestado: el orquestador ejecuta los encargos él mismo, verifica en código contra los criterios de la ficha y pide tu firma (review del PR) antes de mergear.

## Qué hace `/audit-tracker`

1. **Audita** el proyecto contra su plan/documentación: lanza agentes en paralelo que inspeccionan el código real (no lo que dicen los docs), corren los gates (typecheck, tests, lint) y clasifican cada bloque como ✅ HECHO / 🟠 EN CURSO / ⚪ PENDIENTE / ⚠️ MAQUETA — con evidencia `file:line`. El drift doc↔código es hallazgo de primera clase.
2. **Construye un tracker vivo** (artifact HTML autocontenido, commiteado al repo) con cinco pestañas: tablero con fichas de trabajo y encargos copiables, plan de sesiones ordenado por dependencias, mapa de flujo end-to-end, stack por capas, y registro de decisiones tipo ADR.
3. **Ciclo de re-auditoría**: los cierres se marcan en ámbar (sin verificar) y solo pasan a verde cuando una re-auditoría los confirma EN CÓDIGO. El tracker se redeploya siempre a la misma URL.

## Trabajo en equipo (modo despacho)

El tracker es un **mapa**, no un despachador (es un artifact con CSP estricta: sin backend, ticks en localStorage). La asignación de tareas vive en **GitHub Issues**:

1. En la **máquina despachadora**, `/audit-tracker` en modo despacho publica cada sesión del plan como un issue: título `[S<NN>] <objetivo>`, cuerpo = la ficha completa, labels `encargo` + `sesion-NN`. Asignar = poner a la persona como *assignee* del issue (los colaboradores deben estar invitados al repo); las etiquetas `maquina/<nombre>` quedan para máquinas sin persona fija.
2. Cada **colaborador**, desde su máquina y dentro del repo del proyecto, corre `/proximo-encargo`: busca el siguiente issue abierto asignado a él (`--assignee @me`) respetando dependencias, lo reclama con un comentario (evita pisadas), lo ejecuta en una rama y abre PR con `Closes #NN`.
3. La **re-auditoría** en la despachadora cierra el ciclo: issue cerrado ≠ hecho — se verifica en código, y recién ahí el tracker pasa el ítem a verde.

## Modo orquestado (loop autónomo + validación humana)

Con `/orquestar`, el ciclo completo lo corre el orquestador y el humano queda solo en el punto que importa: **validar**. La división del trabajo es fija — *la máquina verifica, el humano valida*:

1. El orquestador toma el siguiente encargo desbloqueado de la cola de issues (respeta dependencias y los reclamos de otras máquinas — coexiste con `/proximo-encargo`).
2. Lo ejecuta en una rama y, antes de pedir nada, **verifica su propio trabajo en código**: recorre los ✅ criterios de cierre de la ficha uno por uno y comenta en el PR un informe con evidencia `file:line` + gates. La ficha es el contrato de validación.
3. Te asigna como reviewer. **Aprobar el PR = validar**: recién ahí mergea, re-audita y el tracker pasa el ítem a verde. Cambios pedidos = hallazgos (corrige y re-pide review; tras 2 rondas rechazadas escala en vez de insistir). El orquestador **jamás mergea sin tu firma** — el silencio no es aprobación.
4. Mientras un PR espera firma puede arrancar el siguiente encargo independiente (máximo 3 PRs en cola de validación, para no inundarte).

En este modo la semántica de colores del tracker se invierte: **ámbar** = verificado por la máquina, esperando tu firma; **verde** = validado y mergeado.

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

`/audit-tracker` arranca con una fase de calibración (unidad de estimación, actores/máquinas, metodología, modo de ejecución del loop); si hay varias máquinas, activa el modo despacho. `/orquestar` requiere el modo despacho activo: los issues son la cola que consume. Si un comando entra en conflicto con otro del mismo nombre, invocalo con namespace: `/audit-tracker:audit-tracker`.

## Licencia

MIT
