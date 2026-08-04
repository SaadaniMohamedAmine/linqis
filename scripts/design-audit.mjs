import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

const SRC_DIR = join(process.cwd(), "src");
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;

// Files (or file-in-directory pairs) where raw hex is legitimate, with why:
const ALLOWED = [
  // The only place raw hex tokens themselves are defined.
  { entry: "globals.css" },
  // Google's multicolor "G" logo -- third-party brand colors, not part of
  // the Linqis design system. Scoped by directory since "page.tsx" is the
  // basename of every route in the App Router.
  { entry: "page.tsx", dir: join(SRC_DIR, "app", "(public)", "sign-in") },
  { entry: "page.tsx", dir: join(SRC_DIR, "app", "(public)", "sign-up") },
  // next/og's ImageResponse (Satori) can't consume CSS variables or
  // Tailwind classes -- it requires literal inline style values. The hex
  // codes here are exact copies of the design tokens, just necessarily
  // hardcoded because of how the renderer works.
  { entry: "opengraph-image.tsx", dir: join(SRC_DIR, "app") },
  // recharts' stroke/fill/contentStyle props are SVG presentation
  // attributes, not Tailwind classes -- same constraint as the OG image.
  // Values are exact copies of --color-border/-text-secondary/-surface/-success.
  { entry: "page.tsx", dir: join(SRC_DIR, "app", "dashboard", "analytics") },
];

const offenders = [];

function isAllowed(fullPath, entry) {
  return ALLOWED.some((rule) => rule.entry === entry && (!rule.dir || fullPath.startsWith(rule.dir)));
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
