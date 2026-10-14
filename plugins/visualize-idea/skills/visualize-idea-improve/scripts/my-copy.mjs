// Your own copy of the Idea Visualizer repository (a fork, or a private copy), for visualize-idea-improve.
// Same on Windows, Mac and Linux (Node and git).
//
//   node my-copy.mjs setup --folder <path> --origin <owner/repo> [--original <owner/repo>]
//        clone your copy into <path> (or use the clone already there), link it to the original
//        ("upstream") and remember it in <home>/visualize-idea/my-copy.json.
//        A new, empty private repository is filled with the original first.
//   node my-copy.mjs status                      where your copy is, who you are, what is new
//   node my-copy.mjs sync                        bring the original's new changes into your copy, push
//   node my-copy.mjs save --notes "a|b" [--bump patch|minor|none] [--dry-run]
//        raise the version, add a change-log entry, commit and push to your copy
//   node my-copy.mjs propose --title "..."       offer your copy's changes to the original (pull request)
//
// Pushing always goes to your copy ("origin"), never to the original, except `propose` for the owner
// of the original, who pushes a separate branch there to open a pull request.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const home = path.join(os.homedir(), 'visualize-idea');
const configFile = path.join(home, 'my-copy.json');
const [cmd, ...rest] = process.argv.slice(2);
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
const dry = rest.includes('--dry-run');
const say = (s) => console.log(`${dry ? '[dry run] ' : ''}${s}`);
const stop = (s) => { console.error(`STOPPED: ${s}`); process.exitCode = 1; throw new Error('stop'); };
const git = (dir, ...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const gitTry = (dir, ...a) => { try { return git(dir, ...a); } catch { return ''; } };
const url = (repo) => `https://github.com/${repo}.git`;
const repoOf = (u) => (u.match(/github\.com[/:]([^/]+\/[^/.]+?)(\.git)?$/) ?? [])[1] ?? u;
const loadConfig = () => { try { return JSON.parse(fs.readFileSync(configFile, 'utf8')); } catch { stop(`no copy set up yet (${configFile}). Run: node my-copy.mjs setup --folder <path> --origin <owner/repo>`); } };
const manifestPath = (folder) => path.join(folder, 'plugins', 'visualize-idea', '.claude-plugin', 'plugin.json');

function identity(folder) {
  const name = gitTry(folder, 'config', 'user.name');
  const email = gitTry(folder, 'config', 'user.email');
  if (!name || !email) stop(`git does not know who you are in ${folder}. Set it for this copy only: git -C "${folder}" config user.name "<your GitHub name>" and user.email "<your email>".`);
  return `${name} <${email}>`;
}

function setup() {
  const folder = path.resolve(opt('--folder') ?? stop('--folder is missing'));
  const origin = opt('--origin') ?? stop('--origin <owner/repo> is missing');
  let original = opt('--original');
  if (!original) {
    // default: the repository this plugin comes from
    const here = path.dirname(fileURLToPath(import.meta.url));
    const m = JSON.parse(fs.readFileSync(path.resolve(here, '..', '..', '..', '.claude-plugin', 'plugin.json'), 'utf8')).repository ?? '';
    original = repoOf(m);
  }
  if (!fs.existsSync(path.join(folder, '.git'))) {
    say(`clone ${origin} into ${folder}`);
    if (!dry) execFileSync('git', ['clone', '-q', url(origin), folder], { stdio: 'inherit' });
  }
  if (!dry) {
    if (!gitTry(folder, 'remote', 'get-url', 'upstream')) git(folder, 'remote', 'add', 'upstream', url(original));
    git(folder, 'fetch', '-q', 'upstream');
    const hasHead = !!gitTry(folder, 'rev-parse', '--verify', '-q', 'HEAD');
    // a brand-new repository: empty, or only GitHub's single starting commit (README, LICENSE) unrelated to the original
    const fresh = !hasHead || (gitTry(folder, 'rev-list', '--count', 'HEAD') === '1' && !gitTry(folder, 'merge-base', 'HEAD', 'upstream/main'));
    if (fresh) {
      say(`your copy is new: filling it with ${original}${hasHead ? " (GitHub's starting commit is replaced)" : ''}`);
      git(folder, 'checkout', '-q', '-B', 'main', 'upstream/main');
      git(folder, 'push', '-q', ...(hasHead ? ['--force'] : []), '-u', 'origin', 'main');
    } else if (!gitTry(folder, 'merge-base', 'HEAD', 'upstream/main')) {
      stop(`${origin} already has its own history that is not a copy of ${original}. Use a new, empty repository or a fork.`);
    }
    fs.mkdirSync(home, { recursive: true });
    fs.writeFileSync(configFile, JSON.stringify({ folder, origin, original }, null, 2) + '\n');
  }
  say(`your copy: ${folder} (pushes to ${origin}; original: ${original}); remembered in ${configFile}`);
}

function status() {
  const c = loadConfig();
  gitTry(c.folder, 'fetch', '-q', 'origin'); gitTry(c.folder, 'fetch', '-q', 'upstream');
  const v = (ref) => { try { return JSON.parse(git(c.folder, 'show', `${ref}:plugins/visualize-idea/.claude-plugin/plugin.json`)).version; } catch { return '?'; } };
  console.log([
    `folder:   ${c.folder}`,
    `you:      ${gitTry(c.folder, 'config', 'user.name') || '(not set)'} <${gitTry(c.folder, 'config', 'user.email') || 'not set'}>`,
    `copy:     ${repoOf(gitTry(c.folder, 'remote', 'get-url', 'origin'))}, version ${v('origin/main')}`,
    `original: ${repoOf(gitTry(c.folder, 'remote', 'get-url', 'upstream'))}, version ${v('upstream/main')}`,
    `new in the original, not in your copy: ${gitTry(c.folder, 'rev-list', '--count', 'origin/main..upstream/main') || '?'} change(s)`,
    `in your copy, not in the original:     ${gitTry(c.folder, 'rev-list', '--count', 'upstream/main..origin/main') || '?'} change(s)`,
    `not yet saved in this folder:          ${gitTry(c.folder, 'status', '--porcelain').split('\n').filter(Boolean).length} file(s)`,
  ].join('\n'));
}

function sync() {
  const c = loadConfig();
  if (git(c.folder, 'status', '--porcelain')) stop('your copy has unsaved changes; save them first (save) or undo them.');
  git(c.folder, 'fetch', '-q', 'upstream');
  const behind = Number(git(c.folder, 'rev-list', '--count', 'HEAD..upstream/main'));
  if (!behind) { say('your copy already has everything from the original.'); return; }
  say(`bringing ${behind} change(s) from the original into your copy`);
  if (dry) return;
  try { git(c.folder, 'merge', '--no-edit', 'upstream/main'); }
  catch {
    const files = gitTry(c.folder, 'diff', '--name-only', '--diff-filter=U');
    stop(`the original and your copy changed the same lines in: ${files.split('\n').join(', ')}. Resolve them in ${c.folder} (keep both ideas where possible), then: git -C "${c.folder}" commit --no-edit and run sync again.`);
  }
  identity(c.folder);
  git(c.folder, 'push', '-q', 'origin', 'HEAD:main');
  say('done: your copy now has the original\'s changes. Update the installed plugin: /plugin marketplace update, then /plugin update visualize-idea.');
}

function save() {
  const c = loadConfig();
  const notes = (opt('--notes') ?? '').split('|').map((s) => s.trim()).filter(Boolean);
  const bump = opt('--bump') ?? 'patch';
  if (!notes.length || !['none', 'patch', 'minor', 'major'].includes(bump)) stop('usage: save --notes "line one|line two" [--bump patch|minor|none]');
  const who = identity(c.folder);
  const origin = repoOf(gitTry(c.folder, 'remote', 'get-url', 'origin'));
  if (origin === repoOf(gitTry(c.folder, 'remote', 'get-url', 'upstream'))) stop('origin and upstream are the same repository; save only goes to your own copy.');
  const mp = manifestPath(c.folder);
  const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
  const [a, b, d] = m.version.split('.').map(Number);
  const version = bump === 'none' ? m.version : bump === 'major' ? `${a + 1}.0.0` : bump === 'minor' ? `${a}.${b + 1}.0` : `${a}.${b}.${d + 1}`;
  say(`save as ${who} to ${origin}: version ${m.version}${version !== m.version ? ` → ${version}` : ''}`);
  if (dry) return;
  m.version = version;
  fs.writeFileSync(mp, JSON.stringify(m, null, 2) + '\n');
  const cl = path.join(c.folder, 'plugins', 'visualize-idea', 'CHANGELOG.md');
  const old = fs.existsSync(cl) ? fs.readFileSync(cl, 'utf8') : '# Change log\n\n';
  const [head, ...entries] = old.split(/\n(?=## )/);
  const entry = `## ${version} (${new Date().toISOString().slice(0, 10)})\n\n${notes.map((n) => `- ${n}`).join('\n')}\n\n`;
  fs.writeFileSync(cl, `${head.trimEnd()}\n\n${entry}${entries.filter((s) => !s.startsWith(`## ${version} `)).join('\n')}`.replace(/\n{3,}/g, '\n\n'));
  const msg = path.join(c.folder, '.git', 'SAVE_MSG');
  fs.writeFileSync(msg, `visualize-idea ${version}\n\n${notes.map((n) => `- ${n}`).join('\n')}\n`);
  git(c.folder, 'add', '-A');
  git(c.folder, 'commit', '-q', '-F', msg);
  git(c.folder, 'push', '-q', 'origin', 'HEAD:main');
  say(`saved: version ${version} is in your copy (${origin}). Update the installed plugin: /plugin marketplace update, then /plugin update visualize-idea.`);
}

function propose() {
  const c = loadConfig();
  const title = opt('--title') ?? 'Improvements from my copy';
  const origin = repoOf(gitTry(c.folder, 'remote', 'get-url', 'origin'));
  const original = repoOf(gitTry(c.folder, 'remote', 'get-url', 'upstream'));
  git(c.folder, 'fetch', '-q', 'upstream');
  const ahead = Number(git(c.folder, 'rev-list', '--count', 'upstream/main..HEAD'));
  if (!ahead) { say('your copy has nothing the original does not have.'); return; }
  const branch = `proposal-${new Date().toISOString().slice(0, 10)}`;
  identity(c.folder);
  // The owner of the original can push a branch there; anyone else proposes from their (public) fork.
  let link;
  try {
    if (!dry) git(c.folder, 'push', '-q', 'upstream', `HEAD:refs/heads/${branch}`);
    link = `https://github.com/${original}/compare/main...${branch}?expand=1&title=${encodeURIComponent(title)}`;
  } catch {
    link = `https://github.com/${original}/compare/main...${origin.split('/')[0]}:${origin.split('/')[1]}:main?expand=1&title=${encodeURIComponent(title)}`;
    say('(you cannot write to the original: this works when your copy is a public fork on GitHub)');
  }
  say(`${ahead} change(s) ready to propose. Open this page, check the changes and press "Create pull request":\n${link}`);
}

try {
  ({ setup, status, sync, save, propose }[cmd] ?? (() => stop('command: setup | status | sync | save | propose')))();
} catch (e) { if (e.message !== 'stop') { console.error(e.stderr?.toString() || e.message); process.exitCode = 1; } }
