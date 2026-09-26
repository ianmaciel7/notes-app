import { readFileSync } from "node:fs";
const source=readFileSync(new URL("./src/value.ts",import.meta.url),"utf8");
if(!/value\s*=\s*42\b/.test(source)){console.error("check: expected src/value.ts to export value = 42");process.exit(1);}
console.log("check: pass");
