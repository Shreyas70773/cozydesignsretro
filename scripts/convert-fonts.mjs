#!/usr/bin/env node
// Convert .otf / .ttf source fonts to .woff2 next to them.
// Safari/iOS is notoriously flaky with CFF-flavored OTF; woff2 is universally
// well-supported and ~40% smaller. Re-run with `npm run fonts:convert` whenever
// a source font is added or replaced.

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, parse, relative } from "node:path";
import { fileURLToPath } from "node:url";

import wawoff2 from "wawoff2";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// Directories to scan for source fonts. Add more as needed.
const SOURCE_DIRS = ["public/cozydesigns"];
const SOURCE_EXTENSIONS = new Set([".otf", ".ttf"]);

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function collectFonts(absDir) {
  const entries = await readdir(absDir, { withFileTypes: true });
  const fonts = [];

  for (const entry of entries) {
    if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      fonts.push(join(absDir, entry.name));
    }
  }

  return fonts;
}

async function convertOne(srcPath) {
  const parsed = parse(srcPath);
  const outPath = join(parsed.dir, `${parsed.name}.woff2`);
  const srcBuf = await readFile(srcPath);
  const woff2Buf = await wawoff2.compress(srcBuf);
  await writeFile(outPath, woff2Buf);

  const srcStat = await stat(srcPath);
  const outStat = await stat(outPath);

  return {
    src: relative(repoRoot, srcPath),
    out: relative(repoRoot, outPath),
    srcBytes: srcStat.size,
    outBytes: outStat.size,
  };
}

async function main() {
  const allFonts = [];

  for (const dir of SOURCE_DIRS) {
    const abs = join(repoRoot, dir);
    try {
      const found = await collectFonts(abs);
      allFonts.push(...found);
    } catch (error) {
      if (error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  if (allFonts.length === 0) {
    console.log("No .otf or .ttf files found to convert.");
    return;
  }

  console.log(`Converting ${allFonts.length} font${allFonts.length === 1 ? "" : "s"} to woff2…\n`);

  const results = [];
  for (const fontPath of allFonts) {
    try {
      const result = await convertOne(fontPath);
      results.push(result);
      const ratio = ((1 - result.outBytes / result.srcBytes) * 100).toFixed(0);
      console.log(
        `  ${result.src}\n    → ${result.out}  ${formatBytes(result.srcBytes)} → ${formatBytes(result.outBytes)}  (-${ratio}%)`,
      );
    } catch (error) {
      console.error(`  ${relative(repoRoot, fontPath)} — FAILED: ${error.message}`);
    }
  }

  const totalSrc = results.reduce((sum, r) => sum + r.srcBytes, 0);
  const totalOut = results.reduce((sum, r) => sum + r.outBytes, 0);
  const totalRatio = totalSrc === 0 ? 0 : ((1 - totalOut / totalSrc) * 100).toFixed(0);

  console.log(
    `\nTotal: ${formatBytes(totalSrc)} → ${formatBytes(totalOut)}  (-${totalRatio}%) across ${results.length} font${results.length === 1 ? "" : "s"}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
