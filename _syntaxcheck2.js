/* temp: extract exact vm error line:column via Function constructor */
const fs = require("fs");
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, "utf8");
  try { new Function(src); console.log("OK:", f); }
  catch (e) {
    console.log("=== FAIL:", f, "->", e.message);
    // node reports positions in stack for Function ctor too; try locating manually:
    // scan for lines that don't end with , or [ or { or ( — a quick heuristic for a missing comma
    const L = src.split(/\r?\n/);
    for (let i = 0; i < L.length - 1; i++) {
      const t = L[i].trimEnd();
      if (t.length > 0 && !/[,;{}\[\)(]$/.test(t) && !/^\}/.test(L[i+1].trim()) && !/^\]/.test(L[i+1].trim()) && L[i+1].trim().startsWith("{")) {
        console.log("  suspicious line " + (i + 1) + " (no trailing comma, next line starts with {): " + t.slice(-80));
      }
    }
  }
}
