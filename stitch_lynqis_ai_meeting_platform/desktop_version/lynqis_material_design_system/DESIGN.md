---
name: Lynqis Material Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bdcaba'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#879485'
  outline-variant: '#3e4a3d'
  surface-tint: '#62df7d'
  primary: '#62df7d'
  on-primary: '#003914'
  primary-container: '#1ca64d'
  on-primary-container: '#003111'
  inverse-primary: '#006e2d'
  secondary: '#ffca45'
  on-secondary: '#3f2e00'
  secondary-container: '#e4ae00'
  on-secondary-container: '#5b4400'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#4d8eff'
  on-tertiary-container: '#00285d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
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
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
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
  2xl: 48px
  3xl: 64px
  gutter: 24px
  margin: 40px
---

## Brand & Style

The design system is engineered for high-performance productivity, specifically tailored for an AI-driven meeting summarization environment. The brand personality is **expert, direct, and data-driven**, prioritizing information density and clarity over decorative elements. 

The aesthetic follows a **High-Fidelity Dark Minimalism** approach. It utilizes a monochromatic foundation punctuated by high-utility functional colors. Visual depth is achieved through subtle tonal layering and structural borders rather than heavy shadows. For complex overlays and navigational surfaces, a **refined glassmorphism** is applied to maintain context of the underlying data while providing necessary focus. This "zero fluff" philosophy ensures that the AI's insights remain the primary focal point of the user experience.

## Colors

This design system utilizes a deep-space palette optimized for long-form reading and data analysis. 

- **Foundation:** The `#0A0A0A` background provides a true-black canvas, reducing eye strain. Surfaces (`#141414`) use a subtle lift to differentiate content zones.
- **Accents:** The primary CTA and hover states utilize a vibrant emerald (`#16A34A`), symbolizing growth and successful synchronization. 
- **Functional:** Success, Warning, Info, and Danger colors follow standard utility conventions but are calibrated for high contrast against dark backgrounds.
- **Hierarchy:** Use `text_primary` for headlines and active states, `text_secondary` for body copy, and `text_muted` for metadata or disabled states.

## Typography

The typography strategy pairs technical precision with high readability.

- **Headlines:** Geist SemiBold is used for all brand-facing elements, wordmarks, and section headers. Its geometric, technical nature reinforces the "AI" and "Data" narrative.
- **UI & Body:** Inter is the workhorse for all functional interface elements and generated summaries. Its neutral grotesque style ensures that large blocks of text remain legible.
- **Scale:** Maintain tight line-heights for headlines to keep the layout compact, while utilizing more generous leading for body text to improve scanning efficiency during summary review.

## Layout & Spacing

The design system is built on a **strict 8px grid system** to ensure mathematical harmony across the desktop-first interface.

- **Desktop (1440px):** Employs a 12-column fluid grid with a maximum container width of 1360px. Gutters are fixed at 24px to provide clear separation between data widgets.
- **Padding:** Internal card padding should default to `lg` (24px) for primary content and `md` (16px) for sidebar or secondary utility items.
- **Rhythm:** Vertical rhythm is maintained by using multiples of 8px for all component heights and margins. 
- **Reflow:** On smaller screens, the 12-column layout collapses to a 4-column layout for mobile, with margins reduced to 16px.

## Elevation & Depth

Elevation in this design system is communicated through **tonal stepping** and **1px structural borders** rather than traditional drop shadows.

- **Level 0 (Background):** `#0A0A0A` - The base canvas.
- **Level 1 (Cards/Surfaces):** `#141414` - For primary content modules. These feature a 1px solid border of `#1F1F1F`.
- **Level 2 (Overlays/Modals):** These utilize the glassmorphism effect: a semi-transparent surface (Background color at 80% opacity) with a `20px` backdrop blur and a more prominent `#2A2A2A` border.
- **Shadows:** Use a singular, crisp 1px shadow: `0 1px 2px rgba(0,0,0,0.5)`. This is used to provide a micro-lift for interactive elements like buttons and active cards.

## Shapes

The shape language is precise and disciplined. 

- **Primary Containers:** Cards and large sections use an 8px radius, providing a modern but structured feel.
- **Interactive Elements:** Inputs and Buttons use a slightly tighter 6px radius. This differentiation helps users subconsciously distinguish between "containers" and "actions."
- **Badges & Avatars:** Always use a full pill radius (`999px`) to create a distinct visual contrast against the predominantly rectangular layout, making these small data points easy to spot.

## Components

### Buttons
- **Primary:** Solid `#16A34A` background, `text_primary` font. 6px radius.
- **Secondary:** Transparent background, `1px` border of `#1F1F1F`. Hover state shifts border to `#2A2A2A`.
- **Action/Warning:** Solid `#EAB308` with dark text for high-priority manual interventions.

### Cards
- Background: `#141414`. Border: `1px solid #1F1F1F`. 
- On hover: Border color transitions to `#2A2A2A`.
- Internal padding: 24px.

### Input Fields
- Background: `#0A0A0A` (inset). Border: `1px solid #1F1F1F`.
- Radius: 6px. Focus state: Border becomes `#16A34A` with a subtle outer glow.

### Chips & Badges
- Used for "Speakers" or "Keywords."
- Radius: 999px.
- Background: `#1F1F1F`. Text: `text_secondary`.

### Lists
- Use horizontal dividers of `1px solid #1F1F1F`.
- Item hover state: Subtle background shift to `#1A1A1A`.

### Summarization Timeline
- Vertical 2px line using `#1F1F1F`.
- Active timestamps use `text_primary` Geist SemiBold.
- AI-generated tags use the `#3B82F6` (Info) color for categorization.