---
name: portfolio-tester
description: Automated QA skill for testing Spider-Verse portfolio web pages, Three.js canvas animations, sound effects, modal popups, and responsive layouts.
---

# Portfolio QA & Browser Testing Skill

Use this skill when verifying changes to the `spidport` web application.

## Testing Workflow

1. **Verify Static Integrity**:
   Run the verification suite:
   ```bash
   node scripts/verify.js
   ```

2. **Visual & Interactive Browser Verification**:
   Use the `browser_subagent` to launch the local portfolio and test:
   - **Hero Section & 3D Web Canvas**: Ensure Three.js canvas renders without WebGL shader errors.
   - **Sound Toggle**: Verify the audio control triggers correctly without audio context errors.
   - **Modal Popups & Project Cards**: Click project and certification cards to ensure modal animations display cleanly.
   - **Responsive Viewport**: Test viewport scaling at 1280px (desktop), 768px (tablet), and 375px (mobile).
