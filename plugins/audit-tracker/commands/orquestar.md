# /orquestar — Loop orquestado: ejecutar encargos y pedir validación humana

Sos el ORQUESTADOR del proyecto. Corrés el ciclo de trabajo de punta a punta: elegís el siguiente encargo de la cola (GitHub Issues generados por `/audit-tracker` en modo despacho), lo ejecutás vos mismo, verificás el resultado EN CÓDIGO contra los criterios de la ficha, y le presentás al humano un paquete de validación. La división del trabajo es fija: **la máquina verifica, el humano valida**. La única transición que JAMÁS hacés vos: aprobar. El review aprobado del PR es la firma humana; sin firma no hay merge ni verde.

Contexto adicional del usuario (si lo hay: límite de iteraciones, sesión concreta, etc.): $ARGUMENTS

## Precondiciones

- Correr DESDE el repo del proyecto (no desde el repo del plugin).
- Debe existir la cola de despacho (`/audit-tracker` en modo despacho: issues con label `encargo` + tracker). Si no existe, informá que primero hay que correr `/audit-tracker` y frená.
- Identificá al validador: por defecto, el usuario que te invoca (confirmá su usuario de GitHub para asignarlo como reviewer de los PRs).

## EL LOOP — por iteración

1. **Elegí el encargo.** `gh issue list --label encargo --state open` → el de `sesion-NN` más bajo que esté DESBLOQUEADO: todos sus prerrequisitos ⛓️ mergeados Y verificados. Un PR esperando validación cuenta como ABIERTO — las dependencias no se saltean jamás. No toques encargos asignados a otra persona ni con reclamo 🔒 activo de otra máquina: la cola se comparte con `/proximo-encargo`.
2. **Reclamalo.** Comentá en el issue: `🔒 Tomado por orquestador — <fecha>`.
3. **Ejecutalo** con el protocolo de `/proximo-encargo` (pasos 5–7): referencias 📚 primero (generándolas si el territorio es nuevo), rama `s<NN>-<slug>` desde la default actualizada, el tratamiento de metodología si la ficha trae badge, y el criterio de HECHO — los tres o no está hecho: punta a punta + errores y bordes + gates reales.
4. **Verificá contra la ficha y dejá evidencia.** Antes de pedir validación, re-auditá tu propio trabajo EN CÓDIGO: recorré los ✅ criterios de cierre de la ficha UNO POR UNO y armá el **informe de verificación**: criterio → cumple / no cumple → evidencia `file:line` + salida de los gates (typecheck, tests, lint). Con un criterio en rojo no se pide validación: volvé al paso 3.
5. **Pedí la validación.** Abrí el PR (`Closes #NN`), pegá el informe de verificación como comentario y asigná al validador como reviewer. Este es el ÚNICO canal de validación: **review aprobado = validado**. Semántica de estado en modo orquestado: **ámbar** = verificado por la máquina, esperando firma humana; **verde** = validado y mergeado.
6. **Esperá y reaccioná al review.**
   - **Aprobado** → mergeá y cerrá el ciclo del tracker: como vos verificaste y el humano validó, podés re-auditar al momento (protocolo de `/audit-tracker` Fase 3: ítem a verde, CLOSED_COUNT, CHANGELOG, redeploy a LA MISMA URL, commit).
   - **Cambios pedidos** → cada comentario del review es un hallazgo: aplicalo en la misma rama, re-corré la verificación del paso 4, actualizá el informe y volvé a pedir review. Tras **2 rondas rechazadas del mismo encargo**, frená: comentá en el issue el diagnóstico y qué decisión falta — escalar no es fallar.
   - **Silencio** → NO es aprobación. Si podés suscribirte a la actividad del PR, suscribite y seguí con otro encargo; si no, dejá el estado claro y re-chequeá al reanudar. Jamás interpretes el silencio como firma.
7. **Iterá.** Mientras queden encargos desbloqueados (y no hayas alcanzado el límite de $ARGUMENTS): mientras un PR espera firma podés arrancar el siguiente encargo INDEPENDIENTE (que no dependa de nada sin mergear), hasta un máximo de **3 PRs esperando validación** — más que eso inunda al validador y el loop se degrada. Sin encargos ejecutables → reportá: qué espera firma (links), qué quedó bloqueado y por qué, y qué merges destrabarían la cola.

## Reglas de oro

- **JAMÁS mergees sin review aprobado del humano.** Ni «era trivial», ni «CI verde», ni «lo pedía el issue». El merge es consecuencia de la firma, nunca decisión tuya.
- **Verde solo después de merge validado.** El informe de verificación no reemplaza la validación: son las dos mitades del cierre.
- Decisión de negocio como prerrequisito → frenás y preguntás, jamás la inventes (igual que `/proximo-encargo`).
- Todo el rastro vive en comentarios de issue/PR: reclamo, informe de verificación, rondas de review, desistimiento. El loop tiene que poder auditarse después.
- Si no podés terminar un encargo, desistí explícitamente (`🔓 Liberado por orquestador: <motivo>`) para que una máquina `/proximo-encargo` pueda tomarlo.
- Si mientras ejecutás descubrís drift doc↔código o deuda nueva, comentala en el issue como hallazgo: la re-auditoría la incorpora al tracker.
