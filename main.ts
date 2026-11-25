import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve everything from this module's own location, never from the
// working directory, so `node main.ts` behaves the same from anywhere.
const here = dirname(fileURLToPath(import.meta.url));
const fortunePath = join(here, "fortune.txt");
const outPath = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const raw = readFileSync(fortunePath, "utf8");
const fortune = raw.trim();

// A fortune is one non-blank line, 1-160 characters, at most 20 words.
// Validation runs on the trimmed text (the line itself), while the file
// is written byte-for-byte from the raw input so the output stays an
// exact copy of fortune.txt, trailing newline included.
if (fortune.length === 0) fail("fortune.txt is empty or blank.");
if (fortune.length < 1 || fortune.length > 160) {
  fail(`fortune must be 1-160 characters, got ${fortune.length}.`);
}
if (fortune.includes("\n")) fail("fortune must be a single line.");
// Reject stray blank lines: the raw input may end with at most one
// trailing newline and must not contain an empty line anywhere.
if (raw.endsWith("\n\n") || raw.includes("\n\n")) {
  fail("fortune.txt must not contain a blank line.");
}
const words = fortune.split(/\s+/).filter(Boolean);
if (words.length > 20) {
  fail(`fortune must be at most 20 words, got ${words.length}.`);
}

mkdirSync("/output", { recursive: true });
writeFileSync(outPath, raw, "utf8");

// Read-back must be byte-identical to what was written.
const back = readFileSync(outPath, "utf8");
if (back !== raw) fail("read-back mismatch: entry.txt differs from fortune.txt.");

console.log(`wrote ${fortune.length} chars (${words.length} words) to ${outPath}`);
