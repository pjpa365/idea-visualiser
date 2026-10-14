// Checks whether the installed visualize-idea is the newest one, and says what to do when it is not.
// Usage: node version-check.mjs [--force] [--json]
//
// Compares:
//  - the installed version (this plugin's .claude-plugin/plugin.json)
//  - your own copy, when you have one (a fork or private copy, set up by visualize-idea-improve;
//    recorded in <home>/visualize-idea/my-copy.json): its version, and whether the original has
//    changes your copy does not have yet
//  - otherwise the original repository (the "repository" in plugin.json)
// Runs at most once a day (--force: now). Never fails: no internet or no git means "skipped".
// The script ends by itself (no process.exit): on Windows, exiting right after a download crashes Node.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
let manifest;   // missing when only the skill folder was copied (e.g. with `npx skills add`)
try { manifest = JSON.parse(fs.readFileSync(path.resolve(here, '..', '..', '..', '.claude-plugin', 'plugin.json'), 'utf8')); }
catch { console.log('visualize-idea: version check skipped (installed without its plugin files)'); process.exit(0); }
const home = path.join(os.homedir(), 'visualize-idea');
const stamp = path.join(home, 'version-check.json');
const myCopyFile = path.join(home, 'my-copy.json');
const args = process.argv.slice(2);

const result = (status, lines = []) => ({ status, lines });
const newer = (a, b) => {   // is version a newer than b?
  const x = a.split(/[.-]/).map(Number), y = b.split(/[.-]/).map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
};
const git = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const update = 'update the installed plugin: `/plugin marketplace update`, then `/plugin update visualize-idea`, and restart Claude Code';

async function check() {
  // at most once a day
  const today = new Date().toISOString().slice(0, 10);
  try { if (!args.includes('--force') && JSON.parse(fs.readFileSync(stamp, 'utf8')).date === today) return result('checked today already'); } catch {}
  try { fs.mkdirSync(home, { recursive: true }); fs.writeFileSync(stamp, JSON.stringify({ date: today })); } catch {}

  // 1. your own copy (fork or private copy)
  let myCopy = null;
  try { myCopy = JSON.parse(fs.readFileSync(myCopyFile, 'utf8')); } catch {}
  if (myCopy?.folder && fs.existsSync(path.join(myCopy.folder, '.git'))) {
    try { git(myCopy.folder, 'fetch', '-q', 'origin'); git(myCopy.folder, 'fetch', '-q', 'upstream'); }
    catch { return result('skipped (could not reach GitHub)'); }
    const lines = [];
    try {
      const copyVersion = JSON.parse(git(myCopy.folder, 'show', 'origin/main:plugins/visualize-idea/.claude-plugin/plugin.json')).version;
      if (copyVersion !== manifest.version) lines.push(`Your copy (${myCopy.origin}) has version ${copyVersion}; you use ${manifest.version}: ${update}.`);
    } catch {}
    try {
      const behind = Number(git(myCopy.folder, 'rev-list', '--count', 'origin/main..upstream/main'));
      if (behind > 0) lines.push(`The original (${myCopy.original}) has ${behind} change(s) that are not in your copy yet: ask Claude "update my copy from the original".`);
    } catch {}
    return result(lines.length ? 'action needed' : 'up to date', lines);
  }

  // 2. no own copy: compare with the original
  const m = String(manifest.repository ?? '').match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return result('skipped (no repository in plugin.json)');
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${m[1]}/${m[2]}/main/plugins/visualize-idea/.claude-plugin/plugin.json`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return result('skipped (could not read the original)');
    const latest = (await res.json()).version;
    return newer(latest, manifest.version)
      ? result('action needed', [`Version ${latest} is available (you use ${manifest.version}): ${update}.`])
      : result('up to date');
  } catch { return result('skipped (could not reach GitHub)'); }
}

const { status, lines } = await check();
if (args.includes('--json')) console.log(JSON.stringify({ installed: manifest.version, status, lines }));
else console.log([`visualize-idea ${manifest.version}: ${status}`, ...lines.map((l) => `- ${l}`)].join('\n'));
