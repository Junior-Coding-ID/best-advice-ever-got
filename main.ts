"use strict";

const fs = require("fs");
const path = require("path");

const ANSWER = "When I dropped a glass on my first shift at the diner, my boss told me to warn the cook coming through the door before I apologized.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || process.env.MAKEFUN_OUTPUT || "/output";

fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, ANSWER, "utf8");

// Self-check: baca balik byte-per-byte dan verifikasi jawaban persis.
const written = fs.readFileSync(outPath, "utf8");
if (written !== ANSWER) {
  throw new Error("entry.txt does not match the expected answer byte-for-byte");
}
if (ANSWER.length !== 132) {
  throw new Error("answer must be exactly 132 characters, got " + ANSWER.length);
}
if (ANSWER.length < 1 || ANSWER.length > 200) {
  throw new Error("answer outside the 1-200 character gate");
}
const sentenceCount = ANSWER.split(".").filter(function (part) {
  return part.trim().length > 0;
}).length;
if (sentenceCount !== 1) {
  throw new Error("answer must be exactly 1 sentence, got " + sentenceCount);
}
console.log("OK: entry.txt written to " + outPath + " (" + ANSWER.length + " chars, 1 sentence)");
