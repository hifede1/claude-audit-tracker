# audit-tracker — plugin de Claude Code

Dos comandos para gestionar el estado real de un proyecto y repartir el trabajo entre varias máquinas:

- **`/audit-tracker`** — auditoría del estado **REAL** de construcción + **tracker vivo interactivo** para gestionar lo que falta.
- **`/proximo-encargo`** — en cada máquina trabajadora: toma el siguiente encargo asignado (GitHub Issue), lo ejecuta y abre PR.

## Qué hace `/audit-tracker`

1. **Audita** el proyecto contra su plan/documentación: lanza agentes en paralelo que inspeccionan el código real (no lo que dicen los docs), corren los gates (typecheck, tests, lint) y clasifican cada bloque como ✅ HECHO / 🟠 EN CURSO / ⚪ PENDIENTE / ⚠️ MAQUETA — con evidencia `file:line`. El drift doc↔código es hallazgo de primera clase.
2. **Construye un tracker vivo** (artifact HTML autocontenido, commiteado al repo) con cinco pestañas: tablero con fichas de trabajo y encargos copiables, plan de sesiones ordenado por dependencias, mapa de flujo end-to-end, stack por capas, y registro de decisiones tipo ADR.
3. **Ciclo de re-auditoría**: los cierres se marcan en ámbar (sin verificar) y solo pasan a verde cuando una re-auditoría los confirma EN CÓDIGO. El tracker se redeploya siempre a la misma URL.

## Trabajo multi-máquina (modo despacho)

El tracker es un **mapa**, no un despachador (es un artifact con CSP estricta: sin backend, ticks en localStorage). La asignación de tareas vive en **GitHub Issues**:

1. En la **máquina despachadora**, `/audit-tracker` en modo despacho publica cada sesión del plan como un issue: título `[S<NN>] <objetivo>`, cuerpo = la ficha completa, labels `encargo` + `sesion-NN` + `maquina/<nombre>`. Asignar una tarea a una máquina = ponerle su label.
2. En cada **máquina trabajadora**, se corre `/proximo-encargo` desde el repo del proyecto: identifica la máquina (argumento o `~/.claude/machine-label`), busca su siguiente issue abierto respetando dependencias, lo reclama con un comentario (evita pisadas), lo ejecuta en una rama y abre PR con `Closes #NN`.
3. La **re-auditoría** en la despachadora cierra el ciclo: issue cerrado ≠ hecho — se verifica en código, y recién ahí el tracker pasa el ítem a verde.

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
```

## Uso

```
/audit-tracker [contexto opcional sobre el proyecto]       # en la máquina despachadora
/proximo-encargo [etiqueta de esta máquina, p.ej. taller]  # en cada máquina trabajadora
```

`/audit-tracker` arranca con una fase de calibración (unidad de estimación, actores/máquinas, metodología); si hay varias máquinas, activa el modo despacho. Si un comando entra en conflicto con otro del mismo nombre, invocalo con namespace: `/audit-tracker:audit-tracker`.

## Licencia

MIT
