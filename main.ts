// Fortune Cookie for the Liquidated Trader — make.fun entry program.
//
// This program is the whole entry. It loads the one-line fortune
// stored beside it in fortune.txt and writes that line, unchanged, to
// /output/entry.txt, where the sealed gate scorer reads it.
//
// The fortune lives in fortune.txt so the text the judge sees is exactly
// the text reviewed in this repository. Nothing is generated at run
// time: no model call, no randomness, no clock. Every run writes the
// same bytes, so the replay matches the live run exactly.
//
// The joke in one sentence: a wise trader once lost everything too —
// and the sting is that he did not vanish into legend, he ended up
// selling the very cookies. The fortune voice carries the laugh: an
// oracular opening, a shared loss, and a punchline that lands on the
// cookie in the trader's own hand. Rueful, warm, never cruel.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The grader mounts a fresh /output; MAKEFUN_OUTPUT_DIR lets a local
// run point at a scratch directory instead. It is only a path.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Resolve the fortune file from this module's own URL, never from the
// working directory, so the program works wherever the grader runs it.
const FORTUNE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "fortune.txt",
);

const fortune = readFileSync(FORTUNE_PATH, "utf8").replace(/\r?\n$/, "");

// Self-check before finishing: the gate wants UTF-8 text of 1-160
// characters, not only whitespace, on a single line of at most 20 words.
if (fortune.length < 1 || fortune.length > 160) {
  throw new Error(`fortune must be 1-160 characters, got ${fortune.length}`);
}
if (fortune.trim().length === 0 || fortune.includes("\n")) {
  throw new Error("fortune must be one non-blank line");
}
if (fortune !== fortune.trim()) {
  throw new Error("fortune must not start or end with whitespace");
}
const wordCount = fortune.split(/\s+/).length;
if (wordCount > 20) {
  throw new Error(`fortune must be at most 20 words, got ${wordCount}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, fortune, "utf8");

// Read back and confirm the file holds exactly what was written.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== fortune) {
  throw new Error("read-back mismatch: entry.txt is not the fortune");
}
console.log(`wrote ${fortune.length} characters (${wordCount} words) to ${OUTPUT_FILE}`);
