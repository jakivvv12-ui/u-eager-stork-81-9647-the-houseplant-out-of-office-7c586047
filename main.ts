"use strict";

const fs = require("fs");
const path = require("path");

const ENTRY = "Out of office: I'm the office fern. Unwatered since March, I now photosynthesize resentment. Back when it rains.";

function codePoints(s) {
  return Array.from(s).length;
}

function validate(text) {
  if (typeof text !== "string") {
    throw new Error("entry is not a string");
  }
  const n = codePoints(text);
  if (n < 1 || n > 120) {
    throw new Error("entry must be 1-120 code points, got " + n);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must not contain a newline");
  }
  if (text !== text.trimEnd()) {
    throw new Error("entry must not end with trailing whitespace or newline");
  }
}

function main() {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const entryPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(entryPath, ENTRY, "utf8");
  const roundTrip = fs.readFileSync(entryPath, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("round-trip mismatch");
  }
  validate(roundTrip);
  console.log(
    "wrote entry.txt: " +
      codePoints(ENTRY) +
      " chars, " +
      Buffer.byteLength(ENTRY, "utf8") +
      " bytes"
  );
}

main();
