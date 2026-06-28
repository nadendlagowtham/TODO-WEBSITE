---
name: Kinetic Mono-Minimalism
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand identity centers on high-utility elegance and cognitive clarity. Targeting power users and high-performance teams, the design system evokes a sense of "digital calm" through extreme precision and reduced visual noise. 

Drawing from **Minimalism** and **Modern Corporate** aesthetics, the interface prioritizes content over container. It utilizes a refined grayscale foundation punctuated by high-intent color accents. The aesthetic is characterized by expansive whitespace, hairline borders, and sophisticated glassmorphism that creates a sense of spatial awareness without sacrificing performance. The goal is to make the act of task management feel frictionless and professional.

## Colors

The palette is anchored in a pristine "Paper White" environment. We use a multi-tiered neutral scale to establish hierarchy:
- **Primary (Indigo):** Reserved strictly for primary actions and active states.
- **Surface Tiers:** White (#FFFFFF) for the highest elevation (cards/modals), and Soft Gray (#F9FAFB) for the base canvas to provide subtle contrast.
- **Semantic Colors:** Green, Amber, and Red are used with low-saturation backgrounds and high-saturation text for status indicators to maintain a "premium" feel rather than a "loud" one.
- **Borders:** A consistent 1px hairline (#E5E7EB) defines structure without adding visual weight.

## Typography

This system uses a dual-font strategy. **Geist** provides a technical, precise feel for headings and UI labels, while **Inter** ensures maximum legibility for long-form task descriptions and body text. 

Typography should be treated with a strict hierarchy. Large display titles use aggressive negative letter spacing to feel "locked in" and professional. All labels should be rendered with slightly higher weight to ensure they stand out against the minimalist backgrounds. Use `label-sm` for metadata like timestamps or tag categories.

## Layout & Spacing

The system is built on a rigid **8px grid**. All dimensions, padding, and margins must be multiples of 8. 

- **Grid Model:** A 12-column fluid grid for the main content area, with a fixed 240px or 280px sidebar.
- **Layout Philosophy:** Use "Generous Padding." Cards and containers should have internal padding of at least 24px (`stack-lg`) to allow the content to breathe.
- **Glassmorphism Headers:** Page headers and sticky navigation use a `backdrop-filter: blur(12px)` with a 80% opaque white background to maintain context while scrolling.
- **Mobile Adaptivity:** On mobile, margins shrink to 16px, and multi-column layouts stack vertically. The sidebar transitions into a bottom-sheet or a full-screen overlay.

## Elevation & Depth

We avoid heavy drop shadows in favor of **Tonal Layering** and **Soft Ambient Occlusion**.

- **Level 0 (Canvas):** #F9FAFB. No shadow.
- **Level 1 (Cards/Sidebar):** #FFFFFF with a 1px border (#E5E7EB).
- **Level 2 (Hover States/Dropdowns):** A very soft, diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`.
- **Level 3 (Modals):** High-diffusion shadow to create focus: `0 20px 25px -5px rgb(0 0 0 / 0.1)`.

The 1px border is the primary tool for separation, ensuring the UI feels "crisp" and architecturally sound.

## Shapes

The design system uses a **Rounded** shape language to soften the "technical" feel of the typography. 

- **Standard Elements:** Buttons, inputs, and small chips use `rounded-md` (0.5rem / 8px).
- **Containers:** Dashboard cards and main content areas use `rounded-lg` (1rem / 16px) to create a clear container identity.
- **Selection States:** Highlighted states in the sidebar or menu lists should use a slightly smaller radius than their parent container for a nested, harmonious look.

## Components

- **Buttons:** 
  - *Primary:* Solid Indigo, white text, subtle inner top-border for a "pressed" feel.
  - *Secondary:* White background, 1px gray border, dark text.
  - *Ghost:* No background/border, text only, appears on hover.
- **Custom Checkboxes:** Avoid the default browser style. Use a 18px square with a 4px corner radius. When checked, fill with Primary Indigo and a custom white checkmark.
- **Task Cards:** Use a white background, 1px border, and `stack-md` padding. On hover, apply the Level 2 shadow.
- **Status Chips:** Use a "Pill" shape with a low-opacity background of the semantic color (e.g., 10% Green) and high-opacity text (e.g., 100% Green).
- **Input Fields:** 1px border, height of 40px, subtle gray placeholder text. Focus state uses a 2px Indigo ring with 0px offset.
- **List Items:** Tasks should be separated by thin dividers or 8px vertical gaps. Ensure a clear horizontal rhythm: Checkbox | Title | Meta-Tags | Assignee.