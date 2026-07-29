---
name: Lynqis
colors:
  surface: '#0e150e'
  surface-dim: '#0e150e'
  surface-bright: '#333b33'
  surface-container-lowest: '#091009'
  surface-container-low: '#161d16'
  surface-container: '#1a221a'
  surface-container-high: '#242c24'
  surface-container-highest: '#2f372e'
  on-surface: '#dce5d9'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#dce5d9'
  inverse-on-surface: '#2a322a'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#62df7d'
  on-secondary: '#003914'
  secondary-container: '#1ca64d'
  on-secondary-container: '#003111'
  tertiary: '#ffb5ab'
  on-tertiary: '#60130d'
  tertiary-container: '#ff8b7c'
  on-tertiary-container: '#76231b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#7f2a21'
  background: '#0e150e'
  on-background: '#dce5d9'
  surface-variant: '#2f372e'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-ui:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a premium, high-performance SaaS environment. It targets an audience of data experts and technical decision-makers who require a tool that conveys precision, authority, and institutional stability. 

The visual style is **Minimalist High-Tech**, leveraging a deep dark aesthetic that reduces eye strain during prolonged analytical sessions. It utilizes subtle glassmorphism for overlays to maintain spatial context, paired with crisp, structural borders that define a rigorous information hierarchy. The emotional response is one of controlled power—a professional, "no-nonsense" workspace where data is the protagonist.

## Colors
The palette is built on a "True Dark" foundation to ensure maximum contrast and premium feel. 

- **Foundation:** The background uses a near-black (#0A0A0A) to ground the interface, while surfaces use a lifted gray (#141414) to create depth.
- **Accents:** The primary success green (#22C55E) acts as the main action color, signifying growth and verification. It is supported by a more saturated hover state (#16A34A).
- **Functional Colors:** Priority, Danger, and Info accents are used sparingly to signal system status without cluttering the visual field. 
- **Typography:** Text levels are strictly enforced with #FAFAFA for headers to ensure "pop" and #A1A1AA for supporting metadata to maintain hierarchy.

## Typography
This design system utilizes a dual-typeface strategy to balance brand character with functional readability. 

- **Headings & Wordmarks:** Geist (SemiBold) provides a technical, developer-centric feel. Its geometric construction reinforces the data-driven narrative of the product.
- **Body & UI:** Inter is used for all functional text. It offers exceptional legibility at small sizes, making it ideal for dense data tables, dashboards, and complex input forms.
- **Scaling:** On mobile devices, `headline-lg` should scale down to 24px to prevent excessive line wrapping. Metadata and labels should never drop below 12px to maintain accessibility.

## Layout & Spacing
The layout follows a strict 8px linear grid system to ensure mathematical consistency across all components.

- **Grid:** A 12-column fluid grid is used for desktop layouts, with 24px gutters. For data-heavy views, a 16px gutter may be used to increase information density.
- **Margins:** Standard page margins are 32px on desktop and 16px on mobile. 
- **Structure:** Content should be grouped into logical modules using the spacing scale. Use `md` (16px) for internal component padding and `lg` (24px) for spacing between distinct sections or cards.

## Elevation & Depth
Elevation in this dark-themed system is conveyed through tonal layering and selective glassmorphism rather than heavy shadows.

- **Layer 0 (Background):** #0A0A0A — The base canvas.
- **Layer 1 (Cards/Surfaces):** #141414 with a 1px solid #1F1F1F border. This is the primary container for content.
- **Layer 2 (Modals/Popovers):** Surface #141414 with 80% opacity and a 20px backdrop-blur. This creates a "glass" effect that maintains the user's sense of place while focusing on a specific task.
- **Interaction Depth:** Hovering over interactive cards should trigger a subtle border color shift to #FAFAFA (10% opacity) or a slight lightening of the surface. Avoid diffused shadows unless used for high-level floating elements like global notifications.

## Shapes
The shape language is precise and modular. 

- **Standard Elements:** Buttons, inputs, and small UI components use a 6px radius to maintain a sharp, technical look.
- **Large Containers:** Cards and modals use an 8px radius (`rounded-lg`) to provide a slightly softer frame for the data within.
- **Consistency:** Never use fully circular (pill) shapes for functional buttons; keep them rectangular with the defined radii to reinforce the professional aesthetic.

## Components
Consistent styling across the application ensures a predictable user experience.

- **Buttons:**
  - *Primary:* Solid #22C55E with #FAFAFA text. Hover state transitions to #16A34A.
  - *Secondary:* #1F1F1F background with #FAFAFA text and border.
  - *Ghost:* No background, #A1A1AA text, transitions to #FAFAFA on hover.
  - *Danger:* #EF4444 background with white text.
- **Inputs:** #0A0A0A background with #1F1F1F border. On focus, the border shifts to #22C55E with a subtle 2px outer glow of the same color at 20% opacity.
- **Cards:** Defined by #141414 surface and #1F1F1F border. Padding is strictly 24px for desktop.
- **Badges:** Use a 10% opacity background of the functional color (e.g., Success, Warning) with 100% opacity text of the same color. This ensures they are visible but do not compete with primary actions.
- **Data Tables:** Use #1F1F1F for horizontal dividers only. Header rows should use `label-sm` typography in #A1A1AA for clear distinction from data cells.