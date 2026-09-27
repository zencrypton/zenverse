/* temp: try removing any single line (or adjacent pair) to isolate the syntax error */
const fs = require("fs"), vm = require("vm");
const f = process.argv[2];
const L = fs.readFileSync(f, "utf8").split(/\r?\n/);
function parse(src) {
  try { vm.runInContext(src, vm.createContext({}), { filename: f }); return null; }
  catch (e) { return e.message; }
}
console.log("baseline:", parse(L.join("\n")));
let found = false;
for (let skip = 0; skip < L.length && !found; skip++) {
  if (!L[skip].trim()) continue;
  const copy = L.slice();
  copy[skip] = "/* SKIPPED */";
  if (parse(copy.join("\n")) === null) {
    console.log("REMOVING line " + (skip + 1) + " FIXES the parse. Line content:");
    console.log(JSON.stringify(L[skip]).slice(0, 800));
    found = true;
  }
}
if (!found) {
  for (let skip = 0; skip < L.length - 1 && !found; skip++) {
    if (!L[skip].trim() || !L[skip + 1].trim()) continue;
    const copy = L.slice();
    copy[skip] = "/* SKIPPED */"; copy[skip + 1] = "/* SKIPPED */";
    if (parse(copy.join("\n")) === null) {
      console.log("REMOVING lines " + (skip + 1) + "+" + (skip + 2) + " FIXES the parse:");
      console.log(JSON.stringify(L[skip]).slice(0, 400));
      console.log(JSON.stringify(L[skip + 1]).slice(0, 400));
      found = true;
    }
  }
}
