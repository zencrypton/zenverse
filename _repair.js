/* ===== Wiring plan (add at the end of app.js, after the existing mergeExtra calls) ===== */

mergeExtra(PHYSICS_TOPICS, typeof BULK_PH !== "undefined" ? BULK_PH : null);
mergeExtra(CHEMISTRY_TOPICS, typeof BULK_CH !== "undefined" ? BULK_CH : null);
mergeExtra(MATHS_TOPICS, typeof BULK_MA !== "undefined" ? BULK_MA : null);
mergeExtra(PHYSICS_TOPICS, typeof BULK_P1 !== "undefined" ? BULK_P1 : null);
mergeExtra(CHEMISTRY_TOPICS, typeof BULK50_CH_4 !== "undefined" ? BULK50_CH_4 : null);
mergeExtra(CHEMISTRY_TOPICS, typeof BULK50_C11 !== "undefined" ? BULK50_C11 : null);
const fs = require("fs"), vm = require("vm");

const FILES = [
  "data_physics.js", "data_chemistry.js", "data_maths.js",
  "data_extra_physics.js", "data_extra_chemistry.js", "data_extra_maths.js",
  "data_hard_physics.js", "data_hard_chemistry.js", "data_hard_maths.js",
  "data_pyq50.js",
  "data_bulk_p.js", "data_bulk_c.js", "data_bulk_m.js",
  "data_bulk_p1.js", "data_bulk_p2.js",
  "data_50_p1.js", "data_50_c4.js", "data_50_c11.js"
];

const ctx = vm.createContext({
  console, document: null, window: null, performance: Date, IntersectionObserver: null,
});
let merged = null;

// 1. Load all data files
for (const f of FILES) {
  try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); }
  catch (e) { console.log("!! " + f + " -> " + e.message); }
}

// 2. Stub renderHome (called at end of app.js), then run app.js
vm.runInContext("function renderHome(){ merged = true; }", ctx);
try {
  vm.runInContext(fs.readFileSync("app.js", "utf8"), ctx, { filename: "app.js" });
  console.log("app.js executed; renderHome reached:", merged === true);
} catch (e) { console.log("!! app.js -> " + e.message); }

// 3. Report per-chapter counts after all merges
const count = (topics) => {
  let tot = 0;
  const per = topics.map(t => {
    tot += t.qs.length;
    return t.name + "=" + t.qs.length;
  });
  return { tot, per };
};
for (const subj of ["PHYSICS_TOPICS", "CHEMISTRY_TOPICS", "MATHS_TOPICS"]) {
  const topics = vm.runInContext(subj, ctx);
  const { tot, per } = count(topics);
  console.log("== " + subj + " TOTAL: " + tot + " ==");
  per.forEach(p => console.log("   " + p));
}

