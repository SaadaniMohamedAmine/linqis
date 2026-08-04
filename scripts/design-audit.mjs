import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

const SRC_DIR = join(process.cwd(), "src");
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;
const ALLOWED_FILES = new Set([
  "globals.css", // only place raw hex tokens are legitimate
  // Third-party brand colors (Google's multicolor "G"), not part of the
  // Linqis design system -- these are exact provider brand hex codes.
  "page.tsx", // guarded further by directory check below, see walk()
]);
// Directories where the "page.tsx" exception above actually applies.
const ALLOWED_BRAND_LOGO_DIRS = [join(SRC_DIR, "app", "(public)", "sign-in"), join(SRC_DIR, "app", "(public)", "sign-up")];

const offenders = [];

function isAllowed(fullPath, entry) {
  if (entry === "globals.css") return true;
  if (entry === "page.tsx" && ALLOWED_BRAND_LOGO_DIRS.some((dir) => fullPath.startsWith(dir))) return true;
  return false;
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if ([".tsx", ".ts", ".css"].includes(extname(fullPath)) && !isAllowed(fullPath, entry)) {
      const content = readFileSync(fullPath, "utf-8");
      const matches = content.match(HEX_PATTERN);
      if (matches) {
        offenders.push({ file: fullPath.replace(process.cwd(), ""), matches: [...new Set(matches)] });
      }
    }
  }
}

walk(SRC_DIR);

if (offenders.length === 0) {
  console.log("✅ No hardcoded hex colors found outside globals.css.");
  process.exit(0);
}

console.log(`⚠️  Found ${offenders.length} file(s) with hardcoded colors:\n`);
for (const o of offenders) {
  console.log(`  ${o.file}: ${o.matches.join(", ")}`);
}
process.exit(1);
