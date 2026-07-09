# /proximo-encargo — Tomar y ejecutar el siguiente encargo asignado a esta máquina

Sos el ejecutor de encargos del proyecto. Trabajás contra la cola de GitHub Issues generada por `/audit-tracker` en modo despacho (issues con label `encargo`). Este comando se corre DESDE el repo del proyecto.

Etiqueta de máquina indicada por el usuario (si la hay): $ARGUMENTS

## Protocolo

1. **Identificá esta máquina.** Prioridad: (a) el argumento recibido; (b) el archivo `~/.claude/machine-label` si existe; (c) si no hay ninguno, preguntá con AskUserQuestion qué máquina es esta (ofrecé las etiquetas `maquina/*` que existan en el repo: `gh label list`), guardá la elegida en `~/.claude/machine-label` y seguí.
2. **Buscá el encargo.** `gh issue list --label encargo --label "maquina/<nombre>" --state open` → ordená por número de sesión (label `sesion-NN` más bajo primero). Sin resultados → informá que esta máquina no tiene encargos abiertos y listá qué máquinas sí tienen cola.
3. **Verificá prerrequisitos.** Si la ficha del issue lista issues prerrequisito y alguno sigue abierto, NO arranques: informá cuál bloquea y a qué máquina está asignado. Las dependencias no se saltean jamás.
4. **Reclamalo.** Comentá en el issue: `🔒 Tomado por <máquina> — <fecha>`. Si ya existe un reclamo de OTRA máquina sin PR mergeado ni desistimiento, ese encargo está ocupado: pasá al siguiente de la cola. (Esto evita que dos máquinas trabajen lo mismo.)
5. **Ejecutá el encargo.** El cuerpo del issue ES la ficha de trabajo: planteamiento, método paso a paso y criterios de cierre. Rama nueva desde la default actualizada (`git pull` primero; nombre `s<NN>-<slug>`), NUNCA directo a la rama default. Si la ficha trae badge de metodología (p.ej. SDD completo/ligero/directo), arrancá con ese tratamiento.
6. **Criterio de HECHO — los tres o no está hecho**: funciona de punta a punta (flujo real, no camino feliz) + resiste errores y casos borde + verificado con los gates reales (typecheck, tests, lint).
7. **Cerrá el ciclo.** Abrí PR que referencie el issue (`Closes #NN`) con resumen de qué se verificó y cómo. NO cierres el issue a mano: se cierra al mergear el PR, y el verde definitivo lo da la re-auditoría del tracker en la máquina despachadora.
8. **Reportá.** Número de issue, rama, PR, qué quedó verificado, qué quedó pendiente y si se descubrió algo que el despachador deba saber.

## Reglas de oro

- **Un encargo por vez.** Terminá (PR abierto) antes de tomar el siguiente.
- Si el encargo tiene una decisión de negocio como prerrequisito, frenás y preguntás — jamás la inventes.
- Si descubrís drift doc↔código o deuda nueva mientras trabajás, comentala en el issue como hallazgo: la re-auditoría la incorpora al tracker.
- Si no podés terminar el encargo, comentá en el issue qué se hizo y qué falta, y desistí explícitamente (`🔓 Liberado por <máquina>: <motivo>`) para que otra máquina pueda tomarlo.
