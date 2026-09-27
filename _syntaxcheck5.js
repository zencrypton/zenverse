/* temp: find extra/missing brace by tracking depth per line and diffing against expectations */
const fs = require("fs");
const f = process.argv[2];
const src = fs.readFileSync(f, "utf8");
const L = src.split(/\r?\n/);
let depth = 0, inStr = false, inComment = false;
const depths = [];
L.forEach((line, idx) => {
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inComment) { if (c === "*" && line[i + 1] === "/") { inComment = false; i++; } continue; }
    if (inStr) {
      if (c === "\\") i++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === "/" && line[i + 1] === "*") { inComment = true; i++; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === "{" || c === "[") depth++;
    if (c === "}" || c === "]") depth--;
  }
  depths.push(depth);
});
// expected structure: depth 0 outside, depth 1 after chapter key line, depth 1 after `],`
// question lines should leave depth at 1. A question line ending at depth 2 means one extra closing.
L.forEach((d, i) => {
  const t = L[i].trim();
  const isKey = /^"[0-9]/.test(t);
  const isQ = /^\{type:/.test(t);
  const isClose = t === "],";
  if (isKey && depths[i] !== 1) console.log("KEY line " + (i + 1) + " depth=" + depths[i]);
  if (isQ && depths[i] !== 1) console.log("Q line " + (i + 1) + " depth=" + depths[i] + " :: " + t.slice(0, 90));
  if (isClose && depths[i] !== 1) console.log("CLOSE line " + (i + 1) + " depth=" + depths[i]);
});
console.log("final depth:", depth);
