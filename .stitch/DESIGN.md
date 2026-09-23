---
name: FMAT Restaurant Tablet UI
viewport: 1024x768
deviceType: TABLET
colors:
  surface: '#FFFFFF'
  surface-dim: '#F7F7F7'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FAFAFA'
  surface-container: '#F7F7F7'
  surface-container-high: '#F0F0F0'
  surface-container-highest: '#EDEDED'
  on-surface: '#111111'
  on-surface-variant: '#444444'
  inverse-surface: '#111111'
  inverse-on-surface: '#FFFFFF'
  outline: '#1A1A1A'
  outline-variant: '#BDBDBD'
  surface-tint: '#111111'
  primary: '#111111'
  on-primary: '#FFFFFF'
  primary-container: '#1A1A1A'
  on-primary-container: '#FFFFFF'
  inverse-primary: '#EDEDED'
  secondary: '#444444'
  on-secondary: '#FFFFFF'
  secondary-container: '#EDEDED'
  on-secondary-container: '#111111'
  tertiary: '#444444'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#EDEDED'
  on-tertiary-container: '#111111'
  error: '#111111'
  on-error: '#FFFFFF'
  error-container: '#EDEDED'
  on-error-container: '#111111'
  primary-fixed: '#EDEDED'
  primary-fixed-dim: '#D9D9D9'
  on-primary-fixed: '#111111'
  on-primary-fixed-variant: '#444444'
  secondary-fixed: '#F7F7F7'
  secondary-fixed-dim: '#EDEDED'
  on-secondary-fixed: '#111111'
  on-secondary-fixed-variant: '#444444'
  tertiary-fixed: '#F7F7F7'
  tertiary-fixed-dim: '#EDEDED'
  on-tertiary-fixed: '#111111'
  on-tertiary-fixed-variant: '#444444'
  background: '#FFFFFF'
  on-background: '#111111'
  surface-variant: '#F7F7F7'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  subtitle:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-large:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-main:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.5rem
  lg: 0.75rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
  control-padding: 8px 16px
  card-gap: 16px
---

# Design System: FMAT Restaurant Tablet UI
**Project ID:** 15034143433341050287

## 1. Visual Theme & Atmosphere

The interface is a **high-fidelity grayscale operational UI** for a horizontal tablet point-of-sale terminal. It is calm, legible and structured without looking like a collection of rigid boxes. The visual character is clean and functional, with a small amount of warmth from moderate corner rounding and tonal layering.

The design prioritizes scanability, rapid recognition and typographic contrast over decoration. Every visible module must support the actor's immediate decision. Geometry follows a regular grid, but grouping comes from spacing and surface tone before it comes from borders.

**Core Principles:**
- **Monochromatic Discipline:** Exclusively composed of white, black, and calibrated neutral light grays. No chromatic colors (no red, green, blue, purple, or orange).
- **Functional States via Tonal Contrast:** Statuses, selections, and destructive actions are conveyed through tonal fills, dark underlines, stroke thickness, and iconography rather than chromatic cues.
- **Orderly Geometry:** Aligned grids, clear grouping and restrained 1px boundaries. Avoid a border around every text block.
- **Tablet Canvas:** Every mockup is exported at exactly **1024 × 768 px**, landscape tablet orientation, with a 24px safe margin. Content must fit that canvas; long explanations belong in a collapsed detail or a separate state.
- **Spanish-first UI:** Visible titles, actions, labels and messages are Spanish. Canonical enums and identifiers may appear as secondary metadata only.
- **Family consistency:** Variants of one view reuse the same header, spacing, cards, controls and state hierarchy. A changed state may change content, not the base composition.

---

## 2. Color Palette & Roles

### Surface & Background Foundation
- **Canvas Primary White** (`#FFFFFF`) — Default screen background, card surfaces, table body background, and primary input fill.
- **Secondary Surface Light Gray** (`#F7F7F7`) — Structural section backgrounds, secondary containers, header/footer backgrounds, table alternating row striping.
- **Selected & Active Surface Gray** (`#EDEDED`) — Selected table rows, active filter buttons, active segmented control chips, stepper progress indicators.

### Text & Foreground Hierarchy
- **Foreground Primary Ink** (`#111111`) — High-contrast page titles, section headers, active icons, primary button fill, and crucial operational text.
- **Foreground Secondary Slate** (`#444444`) — Subtitles, descriptive instructions, body copy, field placeholders, table metadata, and inactive labels.

### Structural Borders & Dividers
- **Primary Structural Border** (`#1A1A1A`) — Solid 1–2px boundary outlines, main container borders, focused input strokes, and active tab indicator rules.
- **Secondary Divider Stroke** (`#BDBDBD`) — Subtle 1px dividers between cards, list rows, inactive input borders, and grid structure lines.

### System & State Tones
- **Disabled State Fill & Border** (`#D9D9D9`) — Inactive/disabled buttons, unavailable items, and muted UI controls.
- **Banned Color Rule:** Absolutely no saturated, chromatic, or pastel colors. Destructive actions must NEVER use red; represent destructive actions strictly through typography, outline iconography, and confirmation positioning.

---

## 3. Typography Rules

**Font Family:** `Inter` (or modern neutral UI sans-serif equivalent: Arial, Helvetica).

### Scale & Hierarchy
- **Page Title (H1):** 28–32px | Bold (700) | Line-height: 36–40px | Tracking: -0.02em | Color: `#111111`. High visual contrast anchor.
- **Section Title (H2):** 20–24px | Semi-Bold (600–700) | Line-height: 28–32px | Tracking: -0.01em | Color: `#111111`. Defines major operational zones.
- **Component / Card Header (H3):** 16–18px | Semi-Bold (600) | Line-height: 22–26px | Color: `#111111`. Identifies items, tables, and modal blocks.
- **Body Main:** 14–16px | Regular (400) | Line-height: 20–24px | Color: `#111111`. Product descriptions, table values, order details.
- **Secondary Text / Meta:** 12–14px | Regular (400) | Line-height: 18–20px | Color: `#444444`. Pricing notes, timestamps, modifier specifications.
- **Form Labels & Table Headers:** 12–14px | Medium / Semi-Bold (500–600) | Line-height: 16–18px | Tracking: 0.01em | Color: `#111111`.
- **Button Text:** 14px | Semi-Bold (600) | Line-height: 20px | High contrast against button fill.

### Rules & Formatting
- Strict hierarchy: Bold weight is reserved exclusively for titles, key metrics, active tabs, and primary actions.
- Prohibit decorative or script typefaces.
- Text sizes remain sufficiently large (≥14px for interactive body) to ensure immediate legibility during fast-paced restaurant operations.

---

## 4. Component Stylings

### Buttons
- **Primary Action Button:** Solid dark ink fill (`#111111` or `#1A1A1A`), crisp white text (`#FFFFFF`), moderate 8px radius and touch-friendly padding. It must describe the actor's business action, not an endpoint or service.
- **Secondary Action Button:** Pure white background (`#FFFFFF`), solid dark text (`#111111`), 1px structural border and the same 8px radius.
- **Tertiary / Ghost Button:** Transparent background, dark text (`#111111`), no border, subtle underline or icon.
- **Button Rules:** No gradients, no glows and no pill-shaped controls. Avoid duplicate buttons for the same object; keep one primary action and only the supporting alternatives required by the state.

### Cards & Container Modules
- **Surface:** Pure white (`#FFFFFF`) grouped by whitespace and light-gray bands; use a 1px border only when the boundary improves scanning.
- **Corner Radius:** Consistent moderate rounding (8–12px). Do not combine several nested boxes with different corner treatments.
- **Shadows:** Flat. No heavy shadows or floating blur layers; optional barely perceptible hairline shadow (`0 1px 2px rgba(0,0,0,0.04)`).
- **Padding:** Moderate to generous (16–24px).
- **Selectable Cards:** Entire surface acts as a single interactive unit. When selected, the surface transitions to Light Gray (`#EDEDED`) with a 2px `#1A1A1A` border.

### Inputs & Form Fields
- **Container:** White rectangular fields (`#FFFFFF`) framed by a thin 1px border (`#1A1A1A` or `#BDBDBD`).
- **Corner Radius:** Consistent 8px radius for touch controls and 10–12px for modal surfaces.
- **Dimensions:** Touch-friendly height (40–48px) for tablet point-of-sale taps.
- **Placeholder:** Medium Gray (`#444444`).
- **Focus State:** 2px solid dark border (`#1A1A1A`). Absolutely no glowing outer halos or floating label animations.

### Tabs & Filters
- **Tabs:** Inactive tabs use regular text (`#444444`) on white; Active tab uses bold text (`#111111`) with a solid 2px dark underline (`#1A1A1A`).
- **Filter Segmented Controls:** Rectangular buttons. Inactive = `#FFFFFF` with `#BDBDBD` border; Active = `#EDEDED` fill with `#1A1A1A` border and bold text.

### Tables & Catalogs
- **Structure:** Modular, high-density row structure with clear column alignment.
- **Headers:** Light Gray background (`#F7F7F7`) with bold 12–14px labels and bottom border (`#1A1A1A`).
- **Row Separation:** Subtle horizontal divider lines (`#BDBDBD`).
- **Row States:** Alternating rows (`#FFFFFF` / `#F7F7F7`) or subtle hover/selected highlight (`#EDEDED`).

### Navigation & Steppers
- **Header:** White horizontal bar (`#FFFFFF`), 1px bottom border (`#1A1A1A`), left-aligned context/brand title, right-aligned operator identity and global actions.
- **Back Navigation:** Linear arrow icon (`←`) paired with concise text label.
- **Pagination:** Square/rectangular segmented numeric buttons with 1px borders; active page highlighted with `#EDEDED` fill.
- **Steppers:** Step-number circles connected by thin horizontal lines. Completed/Active step has dark fill (`#111111`) and white text; upcoming steps are outlined with light gray text.

### Icons
- **Style:** Uniform monochromatic outline / line iconography (stroke weight 1.5–2px, solid `#111111`).
- **Complexity:** Minimalist and universally recognizable (e.g., search magnifying glass, back arrow, table icon, checkmark, trash bin, plus/minus, edit pencil).
- **Fill:** Outline only; fill used strictly to indicate active state or selection toggle.

---

## 5. Layout & Spacing Principles

- **Base Unit:** 8px conceptual grid.
  - Micro-spacing: 4px (tight badge padding, icon-text gap).
  - Component spacing: 8–12px (button margins, input stacks).
  - Layout spacing: 16–24px (card internal padding, column gaps).
  - Section spacing: 32–48px (major module separation, modal margins).
- **Alignment:** Strict left alignment for textual content and form labels; right alignment for numeric currency amounts and secondary actions; centered alignment only when mathematically required (e.g. status icons).
- **Density:** Medium operational density. Use the 1024 × 768 canvas efficiently: keep the decision area visible, place secondary metadata in a compact detail region, and avoid large unused zones beside long technical panels.
- **Outer Frame:** Tablet landscape canvas at exactly 1024 × 768, maintaining a consistent 24px safe margin. Do not generate variable-height desktop pages and label them as tablet screens.
- **Responsive composition:** Use two columns only when both columns carry an equally important decision. Otherwise use one primary column with a compact summary rail.

---

## 6. Anti-Patterns & Banned AI Clichés

- **NO chromatic colors:** Any use of red, green, blue, purple, yellow, or orange is strictly forbidden.
- **NO color-coded destructive alerts:** Red alert banners or red delete buttons are BANNED. Represent destruction via clear wording ("Eliminar / Cancelar"), confirmation modals, and outline trash icons.
- **NO gradients or neon glows:** No "AI purple/blue" glows, radial gradients, or drop shadow bleeds.
- **NO rounded bubble shapes:** Pill buttons, oversized rounded corners (>16px), and decorative bubble badges are forbidden. Moderate 8–12px rounding is the standard for cards and controls.
- **NO glassmorphism or neumorphism:** No backdrop filters, blurred mica layers, or embossed shadows.
- **NO decorative illustrations or stock photography:** Only functional wireframe line icons and schematic layout diagrams.
- **NO floating unanchored cards:** All cards and panels must align to regular structural grid lines.
- **NO invented metric statistics:** Do not fabricate dummy uptime, percentage cards, or decorative analytics not explicitly requested.
- **NO infrastructure as primary UX:** Do not expose HTTP codes, schema names, sync pipelines, checksums, tenant nodes, service destinations or implementation notes in the main interaction surface. Put traceability in a collapsed secondary detail when it is genuinely needed.
- **NO language mixing:** Do not mix English labels such as `ACTIVE`, `STATUS`, `DEFAULT` or `EDIT` into primary UI copy; use `Activo`, `Estado`, `Base` and `Editar`, retaining the canonical token only as secondary metadata.
