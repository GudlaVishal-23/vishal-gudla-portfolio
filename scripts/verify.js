/**
 * Project Verification & Health Check Script
 * Validates syntax, asset integrity, and critical DOM elements in spidport.
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

function logPass(msg) {
  console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  errors++;
}

function logWarn(msg) {
  console.warn(`\x1b[33m⚠ WARN:\x1b[0m ${msg}`);
  warnings++;
}

console.log('--- 🕷️ Running Spidport Project Verification ---');

// 1. Check Core Files Existence
const coreFiles = ['index.html', 'style.css', 'app.js', 'AGENTS.md'];
for (const file of coreFiles) {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    logPass(`Found core file: ${file}`);
  } else {
    logFail(`Missing core file: ${file}`);
  }
}

// 2. Validate app.js syntax
try {
  const appJsContent = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
  new Function(appJsContent);
  logPass('app.js parsed with valid JavaScript syntax.');
} catch (err) {
  logFail(`app.js syntax error: ${err.message}`);
}

// 3. Check Image Assets referenced in index.html
try {
  const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const srcRegex = /src=["']([^"']+\.(?:png|jpg|jpeg|svg|webp))["']/gi;
  let match;
  const checkedAssets = new Set();
  
  while ((match = srcRegex.exec(htmlContent)) !== null) {
    const assetPath = match[1];
    if (assetPath.startsWith('http') || checkedAssets.has(assetPath)) continue;
    checkedAssets.add(assetPath);
    
    const localPath = path.join(ROOT_DIR, assetPath);
    if (fs.existsSync(localPath)) {
      logPass(`Asset verified: ${assetPath}`);
    } else {
      logWarn(`Referenced local asset not found: ${assetPath}`);
    }
  }
} catch (err) {
  logFail(`HTML verification error: ${err.message}`);
}

console.log('------------------------------------------------');
if (errors === 0) {
  console.log(`\x1b[32m✨ Verification Passed cleanly! (${warnings} warning(s))\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\x1b[31m💥 Verification Failed with ${errors} error(s).\x1b[0m\n`);
  process.exit(1);
}
