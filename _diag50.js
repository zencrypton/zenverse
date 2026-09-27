/* diagnose data_50_* and bulk files */
const fs = require("fs"), vm = require("vm");
function tryLoad(f) {
  if (!fs.existsSync(f)) return console.log(f, "MISSING");
  try {
    const c = {}; vm.createContext(c);
    let s = fs.readFileSync(f, "utf8");
    const names = [...s.matchAll(/const\s+([A-Z_0-9]+)/g)].map(m => m[1]);
    for (const n of names) s += ";globalThis." + n + "=" + n + ";";
    vm.runInContext(s, c);
    for (const n of names) {
      const o = c[n];
      if (!o || typeof o !== "object") { console.log(f, n, "NOT OBJECT"); continue; }
      let tot = 0;
      for (const k of Object.keys(o)) {
        const t = {}; o[k].forEach(q => t[q.type] = (t[q.type] || 0) + 1);
        tot += o[k].length;
        console.log(f, "|", k, "|", o[k].length, "|", JSON.stringify(t));
      }
      console.log(f, "TOTAL:", tot);
    }
  } catch (e) { console.log(f, "PARSE FAIL:", e.message); }
}
["data_50_p1.js", "data_50_c4.js", "data_50_c11.js", "data_bulk_p2.js"].forEach(tryLoad);
console.log("\n--- c4.js lines 95-105 ---");
const L4 = fs.readFileSync("data_50_c4.js", "utf8").split(/\r?\n/);
for (let i = 94; i < Math.min(105, L4.length); i++) console.log((i + 1) + ": " + L4[i].slice(0, 130));
console.log("--- c4 chapter key lines ---");
L4.forEach((l, i) => { if (/^"/.test(l.trim())) console.log("KEY line", i + 1, ":", l.trim().slice(0, 70)); });
console.log("c4 total lines:", L4.length, "| last line:", L4[L4.length - 1].slice(0, 40));
console.log("\n--- bulk_p2 chapter key lines ---");
const L2 = fs.readFileSync("data_bulk_p2.js", "utf8").split(/\r?\n/);
L2.forEach((l, i) => { if (/^"[0-9]/.test(l.trim())) console.log("KEY line", i + 1, ":", l.trim().slice(0, 70)); });
console.log("bulk_p2 total lines:", L2.length, "| last 2:", JSON.stringify(L2.slice(-2)));
