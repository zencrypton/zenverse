/* fix data_50_p1.js counts: ch2 +1 pyq | ch3 -1 pyq +3 imp | ch4 -3 pyq, then rewrite cleanly */
const fs = require("fs"), vm = require("vm");
let src = fs.readFileSync("data_50_p1.js", "utf8");
const c = {}; vm.createContext(c);
src += ";globalThis.B=" + "BULK50_PH_1" + ";";
vm.runInContext(src, c);
const B = c.B;
const q2pyq = {type:"pyq",year:"JEE Main 2020",q:"A particle moves along a straight line such that its displacement is s = t³ − 6t² + 9t m. The particle reverses its direction of motion at time:",options:["t = 1 s only","t = 2 s only","t = 1 s and t = 3 s","t = 3 s only"],answer:2,steps:["v = ds/dt = 3t² − 12t + 9.","Set v = 0: t² − 4t + 3 = 0 → (t − 1)(t − 3) = 0.","v changes sign at both t = 1 s and t = 3 s, so the particle reverses at both instants."],ans:"t = 1 s and t = 3 s (option C)",tip:"Reversal needs v = 0 AND a sign change; a double root of v(t) only pauses the motion."};
const imp3 = [
{type:"imp",q:"A man of mass 60 kg stands in a lift accelerating upward with 2 m/s². The normal reaction on him is (g = 10 m/s²):",options:["480 N","600 N","720 N","60 N"],answer:2,steps:["N − mg = ma while accelerating upward.","N = m(g + a) = 60 × 12.","N = 720 N."],ans:"720 N (option C)",tip:"Lift up: apparent weight = m(g + a); down: m(g − a); free fall: N = 0."},
{type:"imp",q:"A block of mass 5 kg rests on a rough horizontal surface (μ = 0.4). The minimum horizontal force needed to start its motion is (g = 10 m/s²):",options:["20 N","50 N","2 N","12.5 N"],answer:0,steps:["Limiting friction f = μN = μmg.","f = 0.4 × 5 × 10 = 20 N.","Motion starts when the applied force just exceeds this."],ans:"20 N (option A)",tip:"On a horizontal surface N = mg, so F_min = μmg — never drop the g."},
{type:"imp",q:"A body of mass m stays at rest on a rough inclined plane of angle θ. The frictional force acting on it is:",options:["μmg cosθ","mg sinθ","mg cosθ","μmg sinθ"],answer:1,steps:["Equilibrium on the incline: friction balances the downslope weight component.","The pull along the slope is mg sinθ.","Static friction equals it: f = mg sinθ (≤ μmg cosθ)."],ans:"mg sinθ (option B)",tip:"Static friction equals the applied pull (mg sinθ); μmg cosθ is only the MAXIMUM available."}
];
/* ch2: +1 pyq */
const K2 = "2. Kinematics", K3 = "3. Laws of Motion", K4 = "4. Work, Energy & Power";
const existing2 = new Set(B[K2].map(q => q.q));
if (!existing2.has(q2pyq.q)) B[K2].push(q2pyq);
/* ch3: drop one pyq, add 3 imp */
let removed3 = 0;
for (let i = 0; i < B[K3].length && removed3 < 1; i++) if (B[K3][i].type === "pyq") { B[K3].splice(i, 1); removed3++; }
B[K3].push(...imp3);
/* ch4: drop last 3 pyq */
const pyq4 = [];
for (let i = B[K4].length - 1; i >= 0 && pyq4.length < 3; i--) if (B[K4][i].type === "pyq") pyq4.push(i);
pyq4.forEach(i => B[K4].splice(i, 1));
/* dedupe by normalized question text within each chapter */
for (const k of Object.keys(B)) {
  const seen = new Set(); const out = [];
  for (const q of B[k]) { const key = q.q.replace(/\s+/g, " ").trim().toLowerCase(); if (!seen.has(key)) { seen.add(key); out.push(q); } }
  B[k] = out;
}
/* rewrite file */
let out2 = "/* ===== 50-PER-CHAPTER JEE BANK — PHYSICS (chapters 1-5) ===== */\nconst BULK50_PH_1 = {\n";
for (const k of Object.keys(B)) {
  out2 += JSON.stringify(k) + ": [\n";
  for (const q of B[k]) out2 += JSON.stringify(q) + ",\n";
  out2 = out2.replace(/,\n$/, "\n") + "],\n";
}
out2 = out2.replace(/,\n$/, "\n") + "};\n";
fs.writeFileSync("data_50_p1.js", out2);
/* report */
for (const k of Object.keys(B)) {
  const t = {}; B[k].forEach(q => t[q.type] = (t[q.type] || 0) + 1);
  console.log(k, B[k].length, JSON.stringify(t));
}
