// Firm (exact) checks of one test run of the visualize-idea skill.
// Part of visualize-idea-improve; checks a test run against the test cases in examples/cases.
// Usage (from anywhere): node firm-checks.mjs <run-project-folder> --case <case-folder> [--json]
//
// <case-folder> holds project/ (the untouched inputs) and expect.json.
// <run-project-folder> is the copy of project/ the skill worked in.
// Prints PASS/FAIL per check; exit 0 when all pass.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.resolve(here, '..', '..', 'visualize-idea', 'scripts');   // the visualize-idea skill next to this one
const args = process.argv.slice(2);
const run = path.resolve(args[0]);
const caseDir = path.resolve(args[args.indexOf('--case') + 1]);
const asJson = args.includes('--json');
const exp = JSON.parse(fs.readFileSync(path.join(caseDir, 'expect.json'), 'utf8'));
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });

const diagDir = path.join(run, exp.diagramFolder);
const mmd = fs.existsSync(diagDir) ? fs.readdirSync(diagDir).filter((f) => f.endsWith('.mmd')) : [];

// 1. inputs untouched (every file of the case's project folder, except diagram-folder files a rework may replace)
const walk = (d, base = d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name), base) : [path.relative(base, path.join(d, e.name))]);
const inputs = walk(path.join(caseDir, 'project')).filter((f) => !f.startsWith(exp.diagramFolder.replace(/\//g, path.sep) + path.sep));
const changed = inputs.filter((f) => !fs.existsSync(path.join(run, f)) || !fs.readFileSync(path.join(run, f)).equals(fs.readFileSync(path.join(caseDir, 'project', f))));
check('Input text, directives and project file are unchanged', !changed.length, changed.join(', '));

// 2. expected diagram types written, with the right names
const newFiles = exp.rework ? Object.values(exp.previous) : mmd;
for (const t of exp.types) {
  const re = exp.versioning === 'on' ? new RegExp(`_${t}_v${exp.rework ? 2 : 1}\\.mmd$`) : new RegExp(`_${t}\\.mmd$`);
  const hit = mmd.filter((f) => re.test(f));
  check(`A ${t} diagram is written with the right file name (versioning ${exp.versioning})`, hit.length >= 1, hit.join(', ') || `none in ${exp.diagramFolder}: ${mmd.join(', ')}`);
}

// 3. Mermaid check + firm rules on every diagram (the rework fixture's v1 sequence is broken on purpose)
const toCheck = exp.rework ? mmd.filter((f) => newFiles.includes(f)) : mmd;
if (toCheck.length) {
  let out;
  try { out = execFileSync('node', [path.join(scripts, 'check-mermaid.mjs'), '--json', ...toCheck.map((f) => path.join(diagDir, f))], { encoding: 'utf8' }); }
  catch (e) { out = e.stdout; }
  const res = JSON.parse(out).results;
  for (const r of res) check(`Mermaid 12.1 check and firm rules: ${path.basename(r.file)}`, r.ok, [r.parse !== 'ok' ? r.parse.split('\n')[0] : '', ...r.problems].filter(Boolean).join(' | '));
} else check('Diagrams to check exist', false, `no .mmd files in ${exp.diagramFolder}`);

// 4. record file: every element traced, every trace has a source or an assumption
let recOut;
try { recOut = execFileSync('node', [path.join(scripts, 'record.mjs'), 'check', diagDir], { encoding: 'utf8' }); check('Record file traces every element (record.mjs check)', true); }
catch (e) { recOut = e.stdout ?? String(e); check('Record file traces every element (record.mjs check)', false, recOut.split('\n').filter((l) => l.startsWith('FAIL')).join(' | ')); }

// 5. roles: only names, no colours (also in check-mermaid), and not too many
for (const f of toCheck) {
  const text = fs.readFileSync(path.join(diagDir, f), 'utf8');
  const roles = (text.match(/role_\w+/g) ?? []).length;
  // elements: boxes and states; in sequence diagrams the messages (roles go on message bands there)
  const ids = /^\s*sequenceDiagram/m.test(text)
    ? (text.match(/^\s*\w+\s*(?:-->>|->>|-\)|--\)|-x|--x|->|-->)\s*\w+\s*:/gm) ?? []).length
    : (text.match(/^\s*(?:state\s+"[^"]*"\s+as\s+\w+|participant\s+\w+|\w+\s*[[({])/gm) ?? []).length;
  check(`Roles used sparingly in ${f}`, ids === 0 || roles <= Math.max(3, Math.ceil(ids * 0.4)), `${roles} role use(s), about ${ids} element(s)`);
}

// 6. rework only
if (exp.rework) {
  check('Comments file deleted after the rework', !fs.existsSync(path.join(diagDir, 'UserComments-Mermaid.md')));
  for (const [oldF, newF] of Object.entries(exp.previous)) {
    check(`Previous version kept: ${oldF}`, fs.existsSync(path.join(diagDir, oldF)));
    if (oldF.includes('_state_') && fs.existsSync(path.join(diagDir, newF))) {
      // state ids: declared with a text, or used on either side of a transition
      const idsOf = (t) => new Set([
        ...[...t.matchAll(/^\s*state\s+"[^"]*"\s+as\s+(\w+)/gm)].map((m) => m[1]),
        ...[...t.matchAll(/^\s*(\w+)\s+-->\s*(\w+)/gm)].flatMap((m) => [m[1], m[2]]),
        ...[...t.matchAll(/^\s*\[\*\]\s+-->\s*(\w+)/gm)].map((m) => m[1]),
      ]);
      const a = idsOf(fs.readFileSync(path.join(diagDir, oldF), 'utf8'));
      const b = idsOf(fs.readFileSync(path.join(diagDir, newF), 'utf8'));
      const kept = [...a].filter((x) => b.has(x));
      check(`Local change: ids of ${oldF} kept in ${newF}`, kept.length / a.size >= 0.85, `${kept.length}/${a.size} kept; missing: ${[...a].filter((x) => !b.has(x)).join(', ')}`);
    }
  }
  const textDir = path.join(run, exp.textFolder);
  const copies = fs.existsSync(textDir) ? fs.readdirSync(textDir).filter((f) => /_text(_v\d+)?\.md$/.test(f)) : [];
  check('A text copy <name>_text[_vN].md is written in the text folder', copies.length >= 1, copies.join(', ') || `none in ${exp.textFolder}`);
  if (copies.length) {
    const t = fs.readFileSync(path.join(textDir, copies.sort().at(-1)), 'utf8');
    check('Text copy marks the additions of this round with [+]', /\[\+\]/.test(t), `${(t.match(/\[\+\]/g) ?? []).length} marker(s)`);
    // [?] is only needed when an addition would otherwise invent a detail (judged check), so only reported here
    check('Open points [?] counted (none is fine when nothing had to be invented)', true, `${(t.match(/\[\?\]/g) ?? []).length} open point(s)`);
  }
  const notes = path.join(run, '..', 'learning-notes.md');
  check('Learning notes written (test location)', fs.existsSync(notes));
}

const bad = results.filter((r) => !r.ok).length;
if (asJson) console.log(JSON.stringify({ run, passed: results.length - bad, total: results.length, results }, null, 2));
else {
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  — ' + r.detail : ''}`);
  console.log(bad ? `${bad} of ${results.length} firm check(s) failed.` : `All ${results.length} firm checks passed.`);
}
process.exit(bad ? 1 : 0);
