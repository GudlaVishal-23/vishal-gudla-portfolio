---
name: spider-design-tokens
description: Design system guidelines, CSS variables, neon color palettes, halftone comic shaders, and glitch animation tokens for the Spider-Verse portfolio.
---

# Spider-Verse Design System & Tokens

Use this skill whenever designing or modifying UI components in `spidport`.

## Color Palette Tokens

```css
:root {
  --spider-red: #ff0055;
  --spider-blue: #00f2fe;
  --spider-purple: #7928ca;
  --spider-dark: #070b19;
  --spider-card-bg: rgba(15, 23, 42, 0.75);
  --spider-border: rgba(0, 242, 254, 0.2);
  --spider-glow-red: 0 0 25px rgba(255, 0, 85, 0.4);
  --spider-glow-blue: 0 0 25px rgba(0, 242, 254, 0.4);
}
```

## Typography Hierarchy
- **Headings & Titles**: `'Montserrat'`, sans-serif (800 / 900 italic weights)
- **Body & Paragraphs**: `'Inter'`, sans-serif (400 / 500 weights)
- **Terminal & Code Blocks**: `'JetBrains Mono'`, monospace

## Visual FX Classes
- **Halftone Dot Texture**: Add subtle radial repeating gradient overlays for the comic print effect.
- **Neon Glow Hover**: Cards must elevate on hover with `transform: translateY(-4px)` and neon border glow.
- **Glassmorphism**: Backdrop blur filter (`backdrop-blur-md`) with semi-transparent dark borders.
