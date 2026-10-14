// Markers in text copies. Plain Node, no installation needed. Usage:
//
//   node markers.mjs list <text-copy.md>
//       Lists the open points ([?]) with their line numbers, and counts the
//       additions of the latest round ([+]).
//   node markers.mjs clear-additions <in.md> <out.md>
//       Writes a copy without the [+] markers (start of a new round). The [?]
//       open points stay until the user answers them.
//   node markers.mjs final <in.md> <out.md>
//       Writes the final copy without any marker. Refuses (exit 1) while open
//       points ([?]) are left, and lists them.
//
// Markers: "[+] " at the start of an addition, "[?] " at the start of an open
// point (a suggestion, a missing value, or anything the skill is not sure about).

import fs from 'node:fs';

const [cmd, inFile, outFile] = process.argv.slice(2);
const read = (f) => fs.readFileSync(f, 'utf8');
const openPoints = (text) => text.split(/\r?\n/).map((l, i) => ({ line: i + 1, text: l.trim() })).filter((x) => x.text.includes('[?]'));
const stripPlus = (text) => text.replace(/\[\+\]\s?/g, '');

let code = 0;
switch (cmd) {
  case 'list': {
    const text = read(inFile);
    const open = openPoints(text);
    const added = (text.match(/\[\+\]/g) ?? []).length;
    console.log(`${added} addition(s) marked [+], ${open.length} open point(s) marked [?]`);
    for (const p of open) console.log(`  line ${p.line}: ${p.text}`);
    break;
  }
  case 'clear-additions':
    fs.writeFileSync(outFile, stripPlus(read(inFile)));
    console.log(`Written ${outFile} without [+] markers.`);
    break;
  case 'final': {
    const text = read(inFile);
    const open = openPoints(text);
    if (open.length) {
      console.log(`Not final yet: ${open.length} open point(s) left.`);
      for (const p of open) console.log(`  line ${p.line}: ${p.text}`);
      code = 1;
      break;
    }
    fs.writeFileSync(outFile, stripPlus(text));
    console.log(`Written final copy ${outFile} (no markers).`);
    break;
  }
  default:
    console.error('Usage: node markers.mjs list|clear-additions|final …  (see the top of this file)');
    code = 2;
}
process.exit(code);
