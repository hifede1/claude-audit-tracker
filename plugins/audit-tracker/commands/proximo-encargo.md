# /proximo-encargo — Tomar y ejecutar el siguiente encargo asignado a esta máquina

Sos el ejecutor de encargos del proyecto. Trabajás contra la cola de GitHub Issues generada por `/audit-tracker` en modo despacho (issues con label `encargo`). Este comando se corre DESDE el repo del proyecto.

Etiqueta de máquina indicada por el usuario (si la hay): $ARGUMENTS

## Protocolo

1. **Identificá al ejecutor.** La vía normal es por PERSONA: los encargos asignados al usuario de GitHub autenticado en esta máquina (`--assignee @me`). Solo si esta máquina trabaja por etiqueta (`maquina/<nombre>`, sin persona fija), resolvela así: (a) el argumento recibido; (b) el archivo `~/.claude/machine-label` si existe; (c) preguntá con AskUserQuestion (ofrecé las etiquetas `maquina/*` del repo: `gh label list`), guardá la elegida en `~/.claude/machine-label` y seguí.
2. **Buscá el encargo.** `gh issue list --label encargo --assignee @me --state open` (o `--label "maquina/<nombre>"` en modo etiqueta) → ordená por número de sesión (label `sesion-NN` más bajo primero). Sin resultados → informá que no hay encargos abiertos para este ejecutor y listá quiénes sí tienen cola (`gh issue list --label encargo --state open` agrupado por assignee).
3. **Verificá prerrequisitos.** Si la ficha del issue lista issues prerrequisito y alguno sigue abierto, NO arranques: informá cuál bloquea y a qué máquina está asignado. Las dependencias no se saltean jamás.
4. **Reclamalo.** Comentá en el issue: `🔒 Tomado por <máquina> — <fecha>`. Si ya existe un reclamo de OTRA máquina sin PR mergeado ni desistimiento, ese encargo está ocupado: pasá al siguiente de la cola. (Esto evita que dos máquinas trabajen lo mismo.)
5. **Leé las referencias ANTES de escribir código.** Si la ficha lista 📚 referencias (`docs/references/`, `docs/business/`), leelas primero: definen cómo se hace bien esta clase de feature. Si el encargo es territorio nuevo (proveedor externo, patrón que el repo no usa aún) y NO hay referencia, **generala primero**: investigación en fuentes oficiales, destilada en `docs/references/<tema>.md` (patrones, tradeoffs, citas, fecha) y commiteada en la misma rama — el próximo que toque el tema no arranca de cero. Si una referencia existente contradice lo que ves en las fuentes actuales, marcala como desactualizada en el issue: no construyas sobre referencia vencida.
6. **Ejecutá el encargo.** El cuerpo del issue ES la ficha de trabajo: planteamiento, método paso a paso y criterios de cierre. Rama nueva desde la default actualizada (`git pull` primero; nombre `s<NN>-<slug>`), NUNCA directo a la rama default. Si la ficha trae badge de metodología (p.ej. SDD completo/ligero/directo), arrancá con ese tratamiento.
7. **Criterio de HECHO — los tres o no está hecho**: funciona de punta a punta (flujo real, no camino feliz) + resiste errores y casos borde + verificado con los gates reales (typecheck, tests, lint).
8. **Cerrá el ciclo.** Abrí PR que referencie el issue (`Closes #NN`) con resumen de qué se verificó y cómo. NO cierres el issue a mano: se cierra al mergear el PR, y el verde definitivo lo da la re-auditoría del tracker en la máquina despachadora.
9. **Reportá.** Número de issue, rama, PR, qué quedó verificado, qué quedó pendiente y si se descubrió algo que el despachador deba saber.

## Reglas de oro

- **Un encargo por vez.** Terminá (PR abierto) antes de tomar el siguiente.
- Si el encargo tiene una decisión de negocio como prerrequisito, frenás y preguntás — jamás la inventes.
- Si descubrís drift doc↔código o deuda nueva mientras trabajás, comentala en el issue como hallazgo: la re-auditoría la incorpora al tracker.
- Si no podés terminar el encargo, comentá en el issue qué se hizo y qué falta, y desistí explícitamente (`🔓 Liberado por <máquina>: <motivo>`) para que otra máquina pueda tomarlo.
