---
name: code-verifier
description: Automated verification and linting skill to run syntax checks, DOM element tests, and asset validation on Spidport.
---

# Code Verifier Skill

Use this skill after making any changes to HTML, CSS, or JavaScript files.

## Verification Command
```bash
node scripts/verify.js
```

## Self-Healing Protocol
1. If `verify.js` fails with a syntax error, locate the exact file and line number.
2. Apply surgical line edit using `replace_file_content`.
3. Re-run `node scripts/verify.js` until all tests report `PASS`.
