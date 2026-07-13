---
tema: Patrones de agentes autónomos de OpenHands aplicables al modo orquestado
triggers: [orquestador, critic, verificador, confirmation mode, microagents, stuck detection, firma por riesgo, presupuesto, loop autónomo]
fecha: 2026-07-13
fuentes:
  - https://github.com/OpenHands/openhands (README, estado 2026)
  - https://github.com/OpenHands/OpenHands/blob/main/AGENTS.md
  - https://github.com/OpenHands/OpenHands/issues/2308 y /issues/6161 (confirmation mode)
  - https://arxiv.org/abs/2511.03690 (OpenHands Agent SDK)
---

# OpenHands — patrones aplicables a audit-tracker

OpenHands (ex OpenDevin, de All Hands AI) es el proyecto open-source más maduro en agentes
autónomos de desarrollo. En 2026 pivoteó a «control center» multi-agente (Agent Canvas +
Agent Server + automations por webhook/cron, soporta agentes de terceros vía ACP — incluido
Claude Code). Lleva años iterando el mismo problema que este plugin: **agente autónomo +
supervisión humana + conocimiento del repo**. Esta referencia destila sus patrones y el
estado de adopción en audit-tracker.

## 1. Critic model — verificador independiente ✦ para S05

OpenHands Cloud usa un **critic** separado del agente ejecutor que evalúa el trabajo antes
del review humano. Principio: *el que ejecutó tiene sesgo a aprobarse*; un evaluador con
contexto limpio encuentra lo que el autor no ve.

- **Aplicación en /orquestar**: el informe de verificación del paso 5 debe armarlo un
  escéptico con contexto limpio cuya consigna es REFUTAR el cierre (no confirmarlo),
  criterio por criterio. El informe declara: quién verificó, qué intentó refutar, qué
  sobrevivió.
- **Evidencia propia**: el panel adversarial sobre este mismo plugin (2026-07-13, PR #1)
  tumbó 8 de 16 hallazgos plausibles — la separación autor/escéptico funciona.
- **Decisión pendiente (⚖️)**: ¿obligatorio siempre o solo en encargos no triviales?

## 2. Confirmation mode y ConfirmRisky — firma por riesgo ✦ para S07

OpenHands gradúa la aprobación humana: `--always-approve`, `--llm-approve`, y la política
**ConfirmRisky** — el agente fluye en lo rutinario y pausa SOLO en acciones riesgosas
(estado `WAITING_FOR_CONFIRMATION`; ante rechazo, reintenta con una alternativa más segura).
Un *LLM security analyzer* clasifica el riesgo de cada acción.

- **Aplicación**: umbral de firma en la calibración — bajo riesgo (docs, tests, refactor
  interno) automerge con informe; alto riesgo (migraciones, dinero, API pública, terceros)
  firma obligatoria. Default conservador: todo se firma (decisión d2 del tracker).
- **Presupuesto**: OpenHands impone límites de costo por tarea. Aplicación: límite declarado
  por encargo + costo real reportado en el informe de verificación.

## 3. Microagents — conocimiento con triggers ✅ ADOPTADO (v1.8)

Markdown en `.openhands/microagents/` con frontmatter de **triggers**: el conocimiento se
carga solo cuando su palabra clave aparece en la tarea. Dos tipos: repo microagents (siempre
activos, tipo CLAUDE.md) y knowledge microagents (por trigger).

- **Adopción**: `docs/references/*.md` con frontmatter `triggers: [...]`; los ejecutores
  barren por trigger además del link explícito de la ficha. *El conocimiento encuentra al
  encargo, no al revés.*

## 4. Stuck detection — freno anti-loop ✅ ADOPTADO (v1.8)

OpenHands detecta bucles (misma acción repetida, sin progreso) y frena en vez de quemar
tokens. **Adopción**: regla en ambos ejecutores — mismo error 3 veces / gate que no pasa
tras varios intentos = parar, comentar hipótesis, escalar o desistir 🔓. *Trabado que
insiste ≠ progreso.*

## 5. Validaciones del diseño existente (no requieren cambios)

- **Event stream**: en OpenHands todo es un evento auditable → equivale a la regla «todo el
  rastro vive en comentarios de issue/PR».
- **Issue resolver por labels**: su resolver trabaja una cola de issues etiquetados →
  equivale a `/proximo-encargo` + labels `encargo`/`sesion-NN`.
- **Convención `.pr/`** (AGENTS.md): artefactos temporales del PR en un directorio que se
  borra al aprobar — candidata menor si los informes crecen.

## Qué adoptamos / qué queda

| Patrón | Estado en audit-tracker |
|---|---|
| Microagents/triggers | ✅ v1.8 |
| Stuck detection | ✅ v1.8 |
| Critic (verificador independiente) | ⏳ S05 (v1.9) |
| ConfirmRisky (firma por riesgo) + presupuesto | ⏳ S07 |
| Event stream / resolver | ✅ equivalentes de diseño desde v1.1/v1.4 |
