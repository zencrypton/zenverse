const fs = require("fs"), vm = require("vm");
const FILES = [
  "data_bulk_p.js", "data_bulk_c.js", "data_bulk_m.js",
  "data_bulk_p1.js", "data_bulk_p2.js",
  "data_50_p1.js", "data_50_c4.js", "data_50_c11.js"
];
const ctx = vm.createContext({});
for (const f of FILES) {
  let src = fs.readFileSync(f, "utf8");
  const names = [...src.matchAll(/const\s+([A-Z_0-9]+)/g)].map(m => m[1]);
  for (const n of names) src += "\n;globalThis." + n + " = " + n + ";";
  try {
    vm.runInContext(src, ctx, { filename: f });
    for (const n of names) {
      const bank = ctx[n];
      if (!bank || typeof bank !== "object") { console.log(f + " :: " + n + " NOT OBJECT"); continue; }
      let tot = 0;
      for (const k of Object.keys(bank)) {
        const t = {};
        (bank[k] || []).forEach(q => t[q.type] = (t[q.type] || 0) + 1);
        tot += bank[k].length;
        console.log(f + " | " + k + " | " + bank[k].length + " | " + JSON.stringify(t));
      }
      console.log(f + " TOTAL: " + tot);
    }
  } catch (e) { console.log(f + " PARSE FAIL: " + e.message); }
}
