---
name: OnBrain Theme and Responsiveness
description: Follow these guidelines to maintain the premium SaaS look and feel of OnBrain, ensuring responsive perfection across all devices.
---

# OnBrain Theme and Typography Guidelines

## 1. Color Palette
Use only the following CSS variables for colors to maintain the "industrial intelligence" SaaS style:
- `--amber: #ffbe0b;` (Primary accents, warnings, CTA buttons)
- `--malt: #272311;` (Card backgrounds)
- `--malt-2: #181609;` (Main page background)
- `--ink: #161508;` (Dark text on amber background)
- `--cream: #fff9e8;` (Primary light text)
- `--muted-cream: #c7bea1;` (Secondary/muted text)

## 2. Typography
- **Heading Font:** Use `var(--font-heading)` (Doctor Glitch / Outfit).
  - Use `font-weight: normal;` for the primary display font.
  - Set `line-height: 1.1;` and `letter-spacing: normal;` for large headings to prevent characters overlapping.
- **Body Font:** Use `var(--font-body)` (Inter / Manrope).
  - Use `color: var(--muted-cream)` for paragraphs and `line-height: 1.6` or `1.7`.

## 3. Responsive Design Principles
- **Fluid Typography:** Always use `clamp()` for `font-size` on headings to scale smoothly across desktop, tablet, and mobile.
  - Example: `font-size: clamp(2.5rem, 5vw, 4.5rem);`
- **Tablet Breakpoint (`max-width: 820px`):**
  - Collapse multi-column grid layouts to `1fr`.
  - Reduce padding and margins.
  - Hide non-essential navigation links.
  - Add `gap` to flex elements that wrap.
- **Mobile Breakpoint (`max-width: 480px`):**
  - Adjust font sizes further (e.g., `font-size: clamp(2rem, 10vw, 3rem)` for main heroes).
  - Change flex directions to `column` where elements stack (like footers).
  - Ensure interactive elements are large enough for touch targets.
