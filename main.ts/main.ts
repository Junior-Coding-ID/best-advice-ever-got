// main.ts — "The Best Advice I Ever Got" (make.fun)
// Node-only program: writes entry.txt, then self-checks it byte by byte.
// No Deno APIs, no network, no dependencies. Plain JavaScript.

const fs = require("node:fs");
const path = require("node:path");

const ANSWER =
  "When I dropped a glass on my first shift at the diner, my boss told me to warn the cook coming through the door before I apologized.";

const EXPECTED_CHARS = 132;
const MAX_CHARS = 200;

const outPath = path.join(__dirname, "entry.txt");

// Write the single-sentence entry exactly as specified, no trailing newline.
fs.writeFileSync(outPath, ANSWER, "utf8");

// Best effort: also drop a copy at /output/entry.txt when the harness
// output directory exists (the competition expects /output/entry.txt).
if (fs.existsSync("/output")) {
  try {
    fs.writeFileSync(path.join("/output", "entry.txt"), ANSWER, "utf8");
  } catch (err) {
    // Local run: /output may not be writable. The local entry.txt is enough.
  }
}

// Self-check: read entry.txt back byte by byte and verify the gate.
const raw = fs.readFileSync(outPath);
const expected = Buffer.from(ANSWER, "utf8");

if (!raw.equals(expected)) {
  console.error("FAIL: entry.txt bytes do not match the expected answer.");
  process.exit(1);
}

const text = raw.toString("utf8");
const chars = [...text].length;

if (chars !== EXPECTED_CHARS) {
  console.error(`FAIL: expected ${EXPECTED_CHARS} characters, got ${chars}.`);
  process.exit(1);
}
if (chars < 1 || chars > MAX_CHARS) {
  console.error(`FAIL: character count ${chars} outside the 1-200 gate.`);
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("FAIL: entry is only whitespace.");
  process.exit(1);
}

const terminators = (text.match(/[.!?]/g) || []).length;
if (terminators !== 1 || !text.endsWith(".")) {
  console.error("FAIL: entry must be exactly one sentence.");
  process.exit(1);
}

console.log(`OK: entry.txt verified — ${chars} characters, 1 sentence.`);
console.log(text);
