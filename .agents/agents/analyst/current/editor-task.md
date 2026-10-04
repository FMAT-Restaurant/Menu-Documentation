# Surgical editor task

## Only writable targets

- `docs/other/md/domain-model.md`
- `docs/ers/functional-requirements.md`
- `docs/ers/business-rules.md`
- `docs/ers/context.md`
- `docs/ers/architechture.md`
- `docs/ers/non-functional-requirements.md`
- `docs/ers/open.md`
- `docs/ers/traceability.md`
- `docs/ers/README.md`
- `docs/ers/configuration.md`

Invoke an editor once per exact file. Preserve current dirty work and all unrelated content. The authoritative plan is `.agents/agents/analyst/current/plan.json`.

## Instructions

1. In `docs/other/md/domain-model.md`, model `CompositionSlot.required` explicitly and `CompositionSlot.status` as ACTIVE iff it has at least one ACTIVE `SlotOption`. Define `requiredSlots` as the required subset of `Composition.slots`; at least one must be configured. If no required slot remains ACTIVE, set `CatalogOffer` INACTIVE automatically. An optional ACTIVE slot can be omitted; only participating ACTIVE slots create selection rounds. Update attributes, rules, diagrams, snapshots and copy semantics. Keep CatalogEntry administrative status independent and make its visibility conditional on an ACTIVE valid offer.
2. In `docs/ers/functional-requirements.md`, revise catalog visibility, entry and offer activation, composition configuration/selection, and option status criteria under existing IDs. Make transitions verifiable: no ACTIVE option makes the group INACTIVE, zero ACTIVE required groups makes the offer INACTIVE, restoring one does not auto-reactivate the offer; an ACTIVE entry without eligible offers is hidden. Preserve explicit offer activation. Require administrators to distinguish required from optional groups and at least one required group; an ACTIVE optional group can be omitted.
3. In `docs/ers/business-rules.md`, propagate the same rules through affected BR/INV IDs, including single-option defaults only when ACTIVE. Keep group quantity and independent CatalogEntry administrative status.
4. In `docs/ers/context.md`, revise composition, state, glossary and diagrams so structural membership of slots remains separate from their selection. Replace statements that every slot must be selected and that optional inclusion is unsupported.
5. In `docs/ers/architechture.md`, update conceptual view, entity table, class diagram, selection flow and summary of states for required/optional groups, derived group activity, offer inactivity cascade, and conditional entry publication.
6. In `docs/ers/non-functional-requirements.md`, update only the E2E validation scope in NFR-MENU-PERF-01/02/03 to cover ACTIVE required slots and any ACTIVE optional slots selected. INACTIVE groups do not generate rounds. Keep the original load and latency targets.
7. In `docs/ers/open.md`, remove OPEN-008 row and section. Preserve the five remaining questions and their IDs; do not add a closure explanation.
8. In `docs/ers/traceability.md`, update the affected requirement-to-rule/invariant mappings and inverse mappings under their existing IDs. Remove any OPEN-008 reference.
9. In `docs/ers/README.md`, set version 2.1.12; update scope and remaining OPEN list/count to five.
10. In `docs/ers/configuration.md`, set version 2.1.12 with date 2026-10-04; summarize the new composition and publication semantics where configuration summarizes the model.

## Mandatory behavior

1. Confirm group ACTIVE iff it has at least one ACTIVE option; an offer becomes INACTIVE when zero required groups are ACTIVE and does not auto-reactivate.
2. Confirm there is a required/optional distinction and optional ACTIVE slots may be omitted; inactive slots cannot be selected.
3. Confirm an administratively ACTIVE entry with zero ACTIVE valid offers is not published and its status is unchanged by the offer cascade.
4. Confirm no OPEN-008 remains in the current ERS; OPEN-001/003/006/009/010 remain.
5. Verify traceability, version 2.1.12, Markdown/Mermaid format and diff whitespace; do not change other files or add software tests.
