# audit-tracker — plugin de Claude Code

Comando `/audit-tracker`: auditoría del estado **REAL** de construcción de un proyecto + **tracker vivo interactivo** para gestionar lo que falta.

## Qué hace

1. **Audita** el proyecto contra su plan/documentación: lanza agentes en paralelo que inspeccionan el código real (no lo que dicen los docs), corren los gates (typecheck, tests, lint) y clasifican cada bloque como ✅ HECHO / 🟠 EN CURSO / ⚪ PENDIENTE / ⚠️ MAQUETA — con evidencia `file:line`. El drift doc↔código es hallazgo de primera clase.
2. **Construye un tracker vivo** (artifact HTML autocontenido, commiteado al repo) con cinco pestañas: tablero con fichas de trabajo y encargos copiables, plan de sesiones ordenado por dependencias, mapa de flujo end-to-end, stack por capas, y registro de decisiones tipo ADR.
3. **Ciclo de re-auditoría**: los cierres se marcan en ámbar (sin verificar) y solo pasan a verde cuando una re-auditoría los confirma EN CÓDIGO. El tracker se redeploya siempre a la misma URL.

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

Si preferís no instalar el plugin, copiá el comando directo a tus comandos de usuario:

```bash
curl -fsSL https://raw.githubusercontent.com/hifede1/claude-audit-tracker/main/plugins/audit-tracker/commands/audit-tracker.md \
  -o ~/.claude/commands/audit-tracker.md
```

## Uso

```
/audit-tracker [contexto opcional sobre el proyecto]
```

El comando arranca con una fase de calibración (unidad de estimación, actores, metodología) antes de auditar. Si el comando entra en conflicto con otro del mismo nombre, invocalo con namespace: `/audit-tracker:audit-tracker`.

## Licencia

MIT
