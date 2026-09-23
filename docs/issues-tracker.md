# Issues Tracker

This tracker documents, classifies, and traces all design considerations, open questions, and domain clarifications identified across the semantic UI specification in relation to the authoritative Software Requirements Specification (**SRS 1.2.3** / `output/ers/spec.md`).

## Classification Scheme

Every issue is assigned exactly one of the following five classifications:

1. **Open and UI-relevant (UI-Blocking)**: Substantive human interaction decisions that directly affect UI controls, input affordances, or flows, and must be resolved to finalize wireframes and concrete views.
2. **Open and UI-relevant (Non-Blocking)**: UI considerations that provide non-blocking enhancements or clarifications without altering core interaction models.
3. **Deferred implementation concern**: Technical implementation details (such as backend protocols, database behavior, security/authentication infrastructure, URL routing, image processing pipelines, or search indexing algorithms) that do not block or modify the semantic UI specification.
4. **Closed**: Issues that have been normatively resolved by the authoritative SRS (e.g., closures of OPEN-002, OPEN-007, OPEN-009, and OPEN-010 in SRS 1.2.x).
5. **Invalid / unnecessary UI issue**: Demands or assumptions that fall outside the bounded context or contradict the normative SRS domain model.

---

## Summary of Issues and Classifications

| Concern / Issue | Classification | Status | Blocking? |
| :--- | :--- | :--- | :--- |
| [Human Interaction Choice for Inventory-Item and Recipe-Revision Reference Acquisition](#human-interaction-choice-for-inventory-item-and-recipe-revision-reference-acquisition) | Open and UI-relevant | Open | **Yes (UI-Blocking)** |
| [Missing Human Actor, Role, and Permission Assignments](#missing-human-actor-role-and-permission-assignments) | Deferred implementation concern | Deferred | No |
| [Undefined Global Navigation and Application Shell Entry Points](#undefined-global-navigation-and-application-shell-entry-points) | Deferred implementation concern | Deferred | No |
| [Catalog Keyword Search and Matching Semantics](#catalog-keyword-search-and-matching-semantics) | Deferred implementation concern | Deferred | No |
| [Missing Image Reference Acquisition and Upload Interface](#missing-image-reference-acquisition-and-upload-interface) | Deferred implementation concern | Deferred | No |
| [Category Administration Lifecycle and Management Interface](#category-administration-lifecycle-and-management-interface) | Invalid / unnecessary UI issue | Invalid | No |
| [Unspecified UI Input Maxima and Text Length Limits (OPEN-010)](#unspecified-ui-input-maxima-and-text-length-limits-open-010) | Closed | Closed | No |
| [Explicit Combo Slot Mapping and Per-Destination Atomicity (OPEN-002)](#explicit-combo-slot-mapping-and-per-destination-atomicity-open-002) | Closed | Closed | No |
| [Whole-Unit Combo Quantities and Per-Instance Modifier Pricing (OPEN-009)](#whole-unit-combo-quantities-and-per-instance-modifier-pricing-open-009) | Closed | Closed | No |
| [Undefined Menu-to-Orders Configured Selection Handoff Contract](#undefined-menu-to-orders-configured-selection-handoff-contract) | Closed | Closed | No |

---

## 1. Open and UI-Relevant Issues

### Human Interaction Choice for Inventory-Item and Recipe-Revision Reference Acquisition

- **Classification**: Open and UI-relevant
- **Status**: Open (UI-Blocking)
- **Description**: The SRS models `inventoryItemId` (in `MenuItemVariant` for `STOCKED` items and in `RecipeComponent` for recipes) and `recipeRevisionId` (in `MenuItemVariant` for `PREPARED` items) as mandatory opaque external string references (REQ-MENU-FUL-001, REQ-MENU-FUL-002, REQ-MENU-FUL-003). However, the SRS does not define the human interaction modality for how an administrator discovers, selects, or enters these references in the UI—specifically, whether the user types/pastes raw opaque text identifiers, selects from a preloaded selection control, or interacts with a dedicated picker/search dialog.
- **Rationale**: This is the sole remaining **UI-blocking** issue. Defining whether the administrator enters raw text, selects from a list, or searches via a picker directly changes the concrete controls, input validation states, and user interaction steps in the semantic views. In accordance with domain scope boundaries, this issue strictly concerns the *human interaction choice* within the UI; it does not request or require designing external Inventory or Recipe REST APIs, transport protocols, or backend service integrations within the Menu bounded context.
- **Affected UI Artifacts**:
  - `MenuItemEditorView.yaml` (`updateStockedSupplyControl`, `associateRecipeRevisionInput`)
  - `RecipeEditorView.yaml` (`componentInventoryItemIdInput`)
  - `manage-menu-item.md` (`ConfigStockedSupply`, `ConfigPreparedSupply`)
  - `manage-recipe.md` (`ConfigureOpaqueInventoryId`)
- **Source**: `output/ers/spec.md` §4.4 (REQ-MENU-FUL-001, REQ-MENU-FUL-002, REQ-MENU-FUL-003), §7.2, §9.3, §12.1.

---

### Remaining UI-Relevant Non-Blocking Issues

*None currently identified.* All other domain and UI requirements in SRS 1.2.3 are fully accounted for, normatively closed, classified as deferred implementation concerns, or identified as out-of-scope invalid concerns.

---

## 2. Deferred Implementation Concerns

### Missing Human Actor, Role, and Permission Assignments

- **Classification**: Deferred implementation concern
- **Status**: Deferred
- **Description**: The SRS defines generic system-level actors (`ADMINISTRATOR`, `POS_CLIENT`, `KDS_CLIENT`) and outlines administrative and consultation operations, but leaves human role hierarchies, fine-grained permission assignments, user authentication boundaries, session management, and approval workflows outside the domain boundary.
- **Rationale**: The semantic UI specification models interfaces from the perspective of the authorized business actors defined in SRS §3.1. Granular role-based access control (RBAC), credential validation, identity provider integration, session lifetimes, and security tokens are application infrastructure and platform security implementation concerns. They do not alter the semantic structure of views, inputs, or domain validation rules.
- **Affected UI Artifacts**: All administrative views (`MenuCatalogAdministrationView`, `MenuItemEditorView`, `RecipeEditorView`, `ModifierConfigurationView`, `ComboConfigurationView`, `ComboReviewView`) and administrative flows (`manage-menu-item.md`, `manage-recipe.md`, `manage-modifiers.md`, `manage-combo.md`, `review-combo.md`).
- **Source**: `output/ers/spec.md` §3.1, §4.1 (REQ-MENU-ITM-001, REQ-MENU-ITM-002), §4.10 (REQ-MENU-REV-002, REQ-MENU-REV-003), §10.2, §10.3.

### Undefined Global Navigation and Application Shell Entry Points

- **Classification**: Deferred implementation concern
- **Status**: Deferred
- **Description**: The SRS specifies functional interactions and view boundaries but does not define the global application shell architecture, persistent navigation chrome (e.g., top app bar, collapsible sidebar navigation, breadcrumbs), or deep-linking URL routing hierarchies (e.g., `/admin/catalog`, `/admin/items/:id/edit`).
- **Rationale**: In accordance with `docs/ui-spec-arch.md` §1 and §3, the semantic UI specification defines view boundaries, triggers, actions, and canonical navigation graphs (`screen-navigation.md`). Concrete shell layout styling, outer chrome frames, browser history synchronization, and deep-linking URL patterns are front-end hosting and routing framework implementation concerns that do not block or alter the semantic domain specifications.
- **Affected UI Artifacts**: Global navigation model (`screen-navigation.md`), view boundaries across `CatalogBrowseView`, `MenuCatalogAdministrationView`, and contextual editors.
- **Source**: `output/ers/spec.md` §3.1, §10.1, §10.2, §12.3; `docs/ui-spec-arch.md` §1, §3.

### Catalog Keyword Search and Matching Semantics

- **Classification**: Deferred implementation concern
- **Status**: Deferred
- **Description**: While `CatalogBrowseView` provides catalog search and category filtering controls, the algorithmic specifics of text search matching (e.g., tokenized substring search vs exact prefix match, case sensitivity, diacritic/accent folding, and indexing strategy) are not specified in the SRS.
- **Rationale**: The semantic UI specification defines the presence of the search input and filtering action (`catalogSearch`, `categoryFilter` in `CatalogBrowseView.yaml`, `browse-catalog.md`). The exact matching algorithm and query execution mechanics are client-side library or backend search-engine implementation details that do not impact the semantic view definitions or user interaction flow.
- **Affected UI Artifacts**: `CatalogBrowseView.yaml` (`catalogSearch`, `categoryFilter`), `browse-catalog.md` (`FilterAction`).
- **Source**: `output/ers/spec.md` §4.1 (REQ-MENU-ITM-001), §4.3 (REQ-MENU-PRC-002), §10.1, §14.1.

### Missing Image Reference Acquisition and Upload Interface

- **Classification**: Deferred implementation concern
- **Status**: Deferred
- **Description**: The SRS models `imageRef` (domain/UI property) and `image_ref` (persistence column) on `MenuItem` strictly as an opaque string URI. There is no specification for binary media asset acquisition, validation, or upload mechanisms (e.g., direct file asset upload, media service integration, supported image MIME types, file size thresholds, aspect ratios, or thumbnail generation).
- **Rationale**: The semantic UI models `imageRefInput` as a URI text/reference input and `imageRef` as a display property on `MenuItemEditorView.yaml` and `manage-menu-item.md`. Binary file upload pipelines, image processing services, validation rules, and media CDN hosting are technical implementation details belonging to media storage infrastructure rather than semantic domain modeling. Image acquisition and processing remain deferred and non-blocking.
- **Affected UI Artifacts**: `MenuItemEditorView.yaml` (`imageRefInput`), `manage-menu-item.md` (`ConfigureNewItemIdentity`).
- **Source**: `output/ers/spec.md` §4.1 (REQ-MENU-ITM-001), §7.2 (`MenuItem.imageRef`), §9.1 (`image_ref`).

---

## 3. Invalid / Unnecessary UI Issues

### Category Administration Lifecycle and Management Interface

- **Classification**: Invalid / unnecessary UI issue
- **Status**: Invalid
- **Description**: Previous tracker entries raised a missing information concern demanding data models and CRUD interfaces for managing category lifecycles (creating, renaming, ordering, archiving, and deleting categories such as `ItemCategory` or `ComboCategory`).
- **Rationale**: This is an unsupported demand. Under SRS §3.1, §4.1 (REQ-MENU-ITM-001), §7.2, and §9.1, items maintain optional category references (`itemCategoryId` on `PREPARED` and `STOCKED` items, `comboCategoryId` on `COMBO` items) for catalog presentation and filtering. The SRS does not define, authorize, or require category lifecycle CRUD entities, administrative management interfaces, or category-search UI within the Menu bounded context. Demanding dedicated category administration views, actions, or data models is an unwarranted expansion of scope beyond the normative SRS.
- **Affected UI Artifacts**: None. Category lifecycle CRUD functionality and category-search UI are correctly excluded from `MenuCatalogAdministrationView.yaml`, `MenuItemEditorView.yaml`, and `manage-menu-item.md`.
- **Source**: `output/ers/spec.md` §3.1, §4.1 (REQ-MENU-ITM-001), §7.2 (`itemCategoryId`, `comboCategoryId`), §9.1.

---

## 4. Closed Issues (Resolved in SRS 1.2.x)

### Unspecified UI Input Maxima and Text Length Limits (OPEN-010)

- **Classification**: Closed
- **Status**: Closed
- **Description**: Former SRS open issue `OPEN-010` noted the absence of explicit upper bounds for monetary amounts, maximum selectable quantities, string length limits, and currency formatting standards.
- **Normative Resolution**: Formally closed in SRS 1.2.0, 1.2.1, and 1.2.2 (§13.4, §6.2 INV-MENU-007..012, §4.5 REQ-MENU-MOD-002, §7.2..7.4, §9.1):
  - **Menu Currency**: A single ISO 4217 alphabetic currency code applies per `menuId` (`MenuItem.currency_code`, e.g., `"MXN"`, `"USD"`). Multi-currency menus and runtime currency conversions are strictly prohibited (INV-MENU-007).
  - **Monetary Precision and Ranges**: All monetary values use exact `DECIMAL(12,2)` with exactly two decimal places; inputs with more than two decimal places are strictly rejected without rounding (INV-MENU-008). Absolute unit prices (`MenuItemVariant.unitPrice`, `ComboConfiguration.unitPrice`, `saved_unit_price`) are constrained to $[0.00, 9999999999.99]$ (INV-MENU-009). Relative price adjustments (`priceDelta`) are signed values in $[-9999999999.99, +9999999999.99]$. Calculated final prices must be non-negative ($\ge 0.00$) (INV-MENU-010).
  - **Integer Quantities and Selection Limits**: Selection bounds (`min_selections`, `max_selections`) and maximum quantities (`maxQuantity`) across all catalog entities (`ModifierOptionConfig`, `ResolvedVariantModifier`, `ModifierGroup`, `ComboSlot`) are strictly constrained to integers in $[0, 99]$ with $0 \le \text{min\_selections} \le \text{max\_selections} \le 99$. Delivered physical quantity for combo options (`ComboOption.quantity`) is strictly an integer in $[1, 99]$ (INV-MENU-011).
  - **Text Length Bounds**: Commercial and descriptive names (`name` across items, dimensions, values, modifier groups, modifier options, combo configurations, combo slots, and recipes) are constrained to $1..120$ Unicode characters after trimming leading and trailing whitespace. Commercial descriptions (`MenuItem.description`) are constrained to $0..1000$ Unicode characters (INV-MENU-012).
- **Affected UI Artifacts**: `MenuItemEditorView.yaml`, `ModifierConfigurationView.yaml`, `ComboConfigurationView.yaml`, `RecipeEditorView.yaml`, `SellableItemConfigurationView.yaml`, and corresponding interaction flows (`manage-menu-item.md`, `manage-modifiers.md`, `manage-combo.md`, `manage-recipe.md`, `configure-sellable-item.md`).
- **Source**: `output/ers/spec.md` §13.4 (Cierre OPEN-010), §4.1, §4.2, §4.3, §4.5 (REQ-MENU-MOD-002), §6.2 (INV-MENU-007..012), §7.2, §9.1.

### Explicit Combo Slot Mapping and Per-Destination Atomicity (OPEN-002)

- **Classification**: Closed
- **Status**: Closed
- **Description**: Former SRS open issue `OPEN-002` noted undefined heuristics for slot matching and collision resolution during bulk copy of combo configurations across different topologies.
- **Normative Resolution**: Formally closed in SRS 1.2.0, 1.2.1, and 1.2.2 (§13.1, §4.6 REQ-MENU-COM-004, REQ-MENU-COM-005, §6.1 BR-MENU-026..028, §10.2):
  - **Prohibition of Heuristic Matching**: All automatic, fuzzy, name-based, or positional slot matching is strictly eliminated (BR-MENU-026).
  - **Operation Modes (`mode`)**: Bulk copy operations distinguish two mutually exclusive modes:
    - `FULL_CLONE`: Structural cloning under a target owner (`targetMenuItemId`). Creates a new `ComboConfiguration`, regenerates new RFC 4122 UUIDs for configuration, slots, and options while preserving topology and ordering, and returns `createdConfigurationId` with complete `idMappings`.
    - `COPY_TO_EXISTING`: Granular copy onto an existing configuration (`targetConfigurationId`), requiring explicit `slotMappings` (`sourceSlotId -> targetSlotId` or `createNewSlot: true`).
  - **Simulation Mode (`dryRun = true`)**: Predictive invariant, mapping, and collision validation with zero persistent side effects (no database writes, no Pub/Sub events, no revision increments, no state changes) and separate idempotency from definitive execution.
  - **Atomicity per Target and Partial Batch Success**: The transaction boundary is delimited strictly per target destination (`targetMenuItemId` or `targetConfigurationId`). Failures or conflicts in one destination under policy `FAIL` revert only that destination without aborting other valid destinations in the batch (BR-MENU-027).
  - **Indivisibility per Target**: Within a single target configuration, copy operations are indivisible; if any mapped slot fails, the entire target configuration copy is reverted (no partial rollback per slot, BR-MENU-028).
  - **Conflict Policies**: Local conflict policies on existing target slots are explicitly defined as `FAIL` (revert target destination and emit diagnostic) or `REPLACE` (remove existing options in the target slot and insert copied options).
- **Affected UI Artifacts**: `ComboConfigurationView.yaml` (control `executeBatchCopyAction`, action `executeBatchCopy`), `manage-combo.md` (nodes `ConfigureFullClone`, `ConfigureCopyToExisting`, `ExecuteBatchCopyAction`).
- **Source**: `output/ers/spec.md` §4.6 (REQ-MENU-COM-004, REQ-MENU-COM-005), §6.1 (BR-MENU-026..028), §10.2, §13.1 (Cierre OPEN-002).

### Whole-Unit Combo Quantities and Per-Instance Modifier Pricing (OPEN-009)

- **Classification**: Closed
- **Status**: Closed
- **Description**: Former SRS open issue `OPEN-009` concerned pricing rules for fractionated components, multiple modifier selections across combo slots, and their reflection in informational review prices.
- **Normative Resolution**: Formally closed in SRS 1.2.0, 1.2.1, and 1.2.2 (§13.3, §4.6 REQ-MENU-COM-003, §4.8 REQ-MENU-ING-001, §6.1 BR-MENU-008, BR-MENU-029, §6.2 INV-MENU-010, INV-MENU-011, §10.4):
  - **Integer Physical Quantities (No Fractions)**: `ComboOption.quantity` is strictly an integer in $[1, 99]$ representing whole physical units. Fractional quantities, proportional coefficients, and fractional pricing on variants within combos are prohibited. Commercial fractional portions (e.g., half pizza) must be modeled as separate concrete `MenuItemVariant` entities with their own recipe and unit price.
  - **Independent Modifier Pricing per Physical Instance**: Modifiers selected on combo components are priced independently for every physical instance ($1..o.\text{quantity}$) and effective selected quantity ($q_{m,i} \ge 1$), without cross-component deduplication, bundled discount caps, or implicit discounts (BR-MENU-029).
  - **Authoritative Combo Sale Price Formula**: Total combo price equals `ComboConfiguration.unitPrice` plus selected option deltas (`ComboOption.priceDelta`) plus instance-level modifier deltas ($\text{priceDelta} \times q$). Component variant regular list prices (`MenuItemVariant.unitPrice`) are strictly excluded from the sale price. The final combo price cannot be negative ($\ge 0.00$) (INV-MENU-010).
  - **Separation of Informational Review References (REQ-MENU-REV-005)**: The saved, current, and difference values displayed in `ComboReviewView` are strictly informational component-price reference comparisons for commercial review and audit; they are mathematically distinct from the authoritative combo sale price calculation established by OPEN-009.
- **Affected UI Artifacts**: `SellableItemConfigurationView.yaml`, `ComboConfigurationView.yaml`, `ComboReviewView.yaml`, `configure-sellable-item.md`, `review-combo.md`.
- **Source**: `output/ers/spec.md` §4.6 (REQ-MENU-COM-001, REQ-MENU-COM-003), §4.8 (REQ-MENU-ING-001), §4.10 (REQ-MENU-REV-005), §6.1 (BR-MENU-008, BR-MENU-029), §6.2 (INV-MENU-010, INV-MENU-011), §10.4, §13.3 (Cierre OPEN-009).

### Undefined Menu-to-Orders Configured Selection Handoff Contract

- **Classification**: Closed
- **Status**: Closed
- **Description**: Former tracking concern regarding the missing technical interface, serialization schema, and transmission mechanism between Menu and Orders for configured selection handoff.
- **Normative Resolution**: Formally closed in SRS 1.2.0, 1.2.1, and 1.2.2 under the normative integration contracts of OPEN-007 (§13.2) and OPEN-009 (§13.3), §4.8 REQ-MENU-ING-001, and §10.4:
  - **Technical Contract and Discriminated Union Payload**: The Menu-to-Orders boundary contract is formally specified under REST/JSON v1 via `POST /v1/menus/{menuId}/ingredients/resolve` as a discriminated union (`lineType`: `"LEAF"` vs `"COMBO"`).
  - **Payload Structure**: Leaf lines provide `variantId`, `definitionRevision`, `quantity`, and `selectedModifiers` (with `modifierGroupId`, `modifierOptionId`, `quantity`, `priceDelta`). Combo lines provide `comboConfigurationId`, `definitionRevision`, `quantity`, and `slots` containing `selectedOptions` with per-physical-instance ($1..o.\text{quantity}$) modifier selections.
  - **Response Breakdown**: Returns resolved base unit prices, itemized option deltas, instance modifier deltas, non-negative `resolvedUnitPrice`, line `totalPrice`, and consolidated net culinary ingredient requirements for order line recording in Orders.
  - **UI Selection State Alignment**: The UI specification models `selectionState.selectedSlots[].selectedOptions[].instances[].selectedModifiers[]` matching this domain structure with all required correlation IDs (`slotId`, `comboOptionId`, `itemVariantId`, `quantity`, `priceDelta`, `instanceIndex`, `modifierGroupId`, `modifierOptionId`). The client-side delivery mechanism (e.g., host POS application callback, custom DOM event, or message passing) is a standard frontend container integration detail that does not leave any semantic UI behavior unresolved.
- **Affected UI Artifacts**: `SellableItemConfigurationView.yaml`, `configure-sellable-item.md`.
- **Source**: `output/ers/spec.md` §3.2, §4.8 (REQ-MENU-ING-001), §10.4, §12.2, §12.3, §13.2 (Cierre OPEN-007), §13.3 (Cierre OPEN-009).
