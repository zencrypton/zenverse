/* temp: binary search the syntax error by truncating the file */
const fs = require("fs");
const f = process.argv[2];
const L = fs.readFileSync(f, "utf8").split(/\r?\n/);
function ok(n) {
  // try parsing first n lines wrapped so braces balance is ignored; just use vm and catch
  const vm = require("vm");
  try { vm.runInContext(L.slice(0, n).join("\n"), vm.createContext({})); return true; } catch (e) { return /Unexpected token/.test(e.message) === false; }
}
// find first prefix length that throws "Unexpected token" — smaller window approach:
let lo = 1, hi = L.length;
// First check whole file fails
console.log("total lines:", L.length);
// Walk line by line accumulating, catching syntax errors that are NOT about incomplete structure
const vm = require("vm");
let firstBad = -1;
for (let n = 1; n <= L.length; n++) {
  try { vm.runInContext(L.slice(0, n).join("\n"), vm.createContext({})); }
  catch (e) {
    const msg = e.message;
    // "Unexpected token" on a prefix usually just means incomplete structure; but if the same token error appears with the NEXT line being a question start, we may have found it
    if (/Unexpected token '}'|Unexpected token ']';/.test(msg)) { firstBad = n; break; }
    if (/Unexpected token ';'/.test(msg) || /Unexpected token '\]'/.test(msg)) { firstBad = n; break; }
  }
}
console.log("first prefix that errors structurally:", firstBad);
