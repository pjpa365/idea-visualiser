// Exact steps around the record file (visualize-record.json) and file names.
// Plain Node, no installation needed. Usage:
//
//   node record.mjs next <diagram-folder> <name> <type> <on|off>
//       File name to write for this diagram: <name>_<type>.mmd (versioning off)
//       or the next <name>_<type>_vN.mmd (versioning on).
//   node record.mjs next-text <text-folder> <name> <on|off>
//       Same for text copies: <name>_text.md or the next <name>_text_vN.md.
//   node record.mjs hash <file>
//       Fingerprint of a file, to notice later whether the user changed it.
//   node record.mjs check <diagram-folder>
//       Checks the record file against the diagrams: every recorded file exists,
//       every element id in a recorded diagram has a trace entry, and every trace
//       entry has a source (section + quote) or says "assumption" with a reason.
//   node record.mjs notes-path
//       Where the learning notes go: <home>/visualize-idea/learning-notes.md
//
// The record file itself is written by Claude (see knowledge/files.md).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const RECORD = 'visualize-record.json';
const [cmd, ...args] = process.argv.slice(2);

function versions(folder, re) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).map((f) => re.exec(f)).filter(Boolean).map((m) => Number(m[1] ?? 0));
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function next(folder, stem, ext, versioning) {
  if (versioning !== 'on') return `${stem}${ext}`;
  const vs = versions(folder, new RegExp(`^${esc(stem)}_v(\\d+)${esc(ext)}$`));
  return `${stem}_v${vs.length ? Math.max(...vs) + 1 : 1}${ext}`;
}

/** Element ids written in a diagram (best effort per diagram type). */
export function elementIds(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter((l) => !/^\s*%%/.test(l));
  const head = (lines.find((l) => l.trim()) ?? '').trim();
  const ids = new Set();
  const add = (x) => { if (x && !/^(end|subgraph|direction|class|classDef|style|note|state|participant|actor|loop|alt|else|opt|par|and|rect|box|critical|break|autonumber|title)$/i.test(x)) ids.add(x); };
  if (/^(flowchart|graph|swimlane)/.test(head)) {
    for (const l of lines.slice(1)) {
      const sg = /^\s*subgraph\s+(\w+)/.exec(l);
      if (sg) { add(sg[1]); continue; }
      if (/^\s*(classDef|class|style|linkStyle|click|direction|end)\b/.test(l)) continue;
      for (const m of l.matchAll(/(?:^|[\s&>|-])([A-Za-z]\w*)\s*(?=[[({>@])/g)) add(m[1]);
    }
  } else if (/^stateDiagram/.test(head)) {
    for (const l of lines.slice(1)) {
      const as = /^\s*state\s+"[^"]*"\s+as\s+(\w+)/.exec(l);
      if (as) { add(as[1]); continue; }
      const st = /^\s*state\s+(\w+)/.exec(l);
      if (st) { add(st[1]); continue; }
      const tr = /^\s*([\w[\]*]+)\s*-->\s*([\w[\]*]+)/.exec(l);
      if (tr) for (const x of [tr[1], tr[2]]) if (x !== '[*]') add(x);
    }
  } else if (/^sequenceDiagram/.test(head)) {
    for (const l of lines) { const p = /^\s*(?:participant|actor)\s+(\w+)/.exec(l); if (p) add(p[1]); }
  } else if (/^classDiagram/.test(head)) {
    for (const l of lines) { const c = /^\s*class\s+(\w+)/.exec(l); if (c) add(c[1]); }
  } else if (/^erDiagram/.test(head)) {
    for (const l of lines.slice(1)) {
      const e = /^\s*([A-Za-z][\w-]*)\s*\{/.exec(l);
      if (e) add(e[1]);
      const r = /^\s*([A-Za-z][\w-]*)\s+[|}o.][|o{}.\-]+\s+([A-Za-z][\w-]*)\s*:/.exec(l);
      if (r) { add(r[1]); add(r[2]); }
    }
  } else if (/^packet/.test(head)) {
    for (const l of lines) { const f = /^\s*(?:\d+(?:\s*-\s*\d+)?|\+\d+)\s*:\s*"([^"]+)"/.exec(l); if (f) add(f[1]); }
  }
  return [...ids];
}

function check(folder) {
  const file = path.join(folder, RECORD);
  if (!fs.existsSync(file)) { console.log(`FAIL  no ${RECORD} in ${folder}`); return 1; }
  let rec;
  try { rec = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.log(`FAIL  ${RECORD} is not valid JSON: ${e.message}`); return 1; }
  let bad = 0;
  const say = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) bad++; };
  for (const inp of rec.inputs ?? []) {
    for (const d of inp.diagrams ?? []) {
      const p = path.join(folder, d.file);
      if (!fs.existsSync(p)) { say(false, `${d.file}: recorded but not in the folder`); continue; }
      const ids = elementIds(fs.readFileSync(p, 'utf8'));
      const traced = new Set((d.trace ?? []).map((t) => t.id));
      const missing = ids.filter((x) => !traced.has(x));
      say(!missing.length, `${d.file}: ${ids.length} element(s), ${missing.length ? 'no trace for: ' + missing.join(', ') : 'all traced'}`);
      const filled = (v) => typeof v === 'string' && v.trim() !== '';
      const empty = (d.trace ?? []).filter((t) => !filled(t.source) && !filled(t.assumption));
      say(!empty.length, `${d.file}: every trace entry has a source or is marked as an assumption${empty.length ? ' (missing: ' + empty.map((t) => t.id).join(', ') + ')' : ''}`);
    }
  }
  console.log(bad ? `${bad} problem(s).` : 'Record file and diagrams agree.');
  return bad ? 1 : 0;
}

let code = 0;
switch (cmd) {
  case 'next': {
    const [folder, name, type, v] = args;
    console.log(next(folder, `${name}_${type}`, '.mmd', v));
    break;
  }
  case 'next-text': {
    const [folder, name, v] = args;
    console.log(next(folder, `${name}_text`, '.md', v));
    break;
  }
  case 'hash': {
    const text = fs.readFileSync(args[0], 'utf8').replace(/\r\n/g, '\n');
    console.log(crypto.createHash('sha256').update(text).digest('hex').slice(0, 16));
    break;
  }
  case 'check':
    code = check(args[0] ?? '.');
    break;
  case 'notes-path':
    console.log(path.join(os.homedir(), 'visualize-idea', 'learning-notes.md'));
    break;
  default:
    console.error('Usage: node record.mjs next|next-text|hash|check|notes-path …  (see the top of this file)');
    code = 2;
}
process.exit(code);
