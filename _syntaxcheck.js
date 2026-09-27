/* temp: locate syntax errors in data files */
const fs = require("fs"), vm = require("vm");
for (const f of process.argv.slice(2)) {
  try {
    vm.runInContext(fs.readFileSync(f, "utf8"), vm.createContext({}), { filename: f });
    console.log("OK:", f);
  } catch (e) {
    console.log("=== FAIL:", f, "->", e.message);
    const m = /<anonymous>:(\d+)/.exec(e.stack);
    if (m) {
      const ln = +m[1];
      const L = fs.readFileSync(f, "utf8").split(/\r?\n/);
      for (let i = Math.max(0, ln - 2); i < Math.min(L.length, ln + 1); i++)
        console.log("  " + (i + 1) + ": " + L[i].slice(0, 200));
    }
  }
}
