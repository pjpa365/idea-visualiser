---
name: visualize-idea-improve
description: Improves the visualize-idea skill from the user's own learning notes (loop 2), in the user's own copy of the Idea Visualizer repository (a GitHub fork or a private copy), tests the new version automatically against the old one with the example test cases, and saves it to that copy after one "yes"; optionally offers the improvement to the original as a pull request. Also keeps that copy up to date with the original. Use it when the user asks to improve the visualize-idea skill, process its learning notes, set up their own copy, "update my copy from the original", or propose their improvements. Works only in Claude Code (it needs git, Node.js and helpers that run tests).
---

# visualize-idea-improve

Loop 2: the skill gets better from its own mistakes. Every user collects learning notes while using `visualize-idea`; this skill turns them into improvements of **the user's own copy** of the skill. The user then installs the plugin from that copy, and can offer the improvement to the original.

The user may not be a developer: you prepare, test and judge; they answer one "save?" question. Talk plainly.

**Only in Claude Code** (terminal, IDE, or the Code tab of Claude Desktop). In claude.ai, Claude Desktop chat or the mobile app, say that improving the skill needs Claude Code, and stop.

Paths below: `<this>` = the folder of this SKILL.md; `<copy>` = the user's copy (from `my-copy.mjs status`).

## 1. The user's copy

Run `node <this>/scripts/my-copy.mjs status`.
- **Not set up yet**: explain the two options in plain words and let the user choose:
  - **Fork** (public): on GitHub, open the original repository and press **Fork**. Simple; the copy is visible to everyone; proposing changes back is one click.
  - **Private copy**: on GitHub, create a new empty private repository (**+** → **New repository** → **Private**, nothing else). The setup fills it with the original. Proposing back works for the owner of the original; others propose through a public fork.

  Then ask for a local folder for the copy (outside other projects) and run `node <this>/scripts/my-copy.mjs setup --folder <folder> --origin <owner>/<repo>`. Make sure git knows the user in that folder (their GitHub name and email, set for this folder only; `status` shows it). Never push under another name.
- Before improving, the copy must have no unsaved changes and should have the original's latest changes (run `sync` first when `status` shows new changes in the original).

## 2. Collect

Read the learning notes (`node <copy>/plugins/visualize-idea/skills/visualize-idea/scripts/record.mjs notes-path` gives the file). Group notes that describe the same kind of situation. A note has a cause: `mermaid` (diagram craft), `domain:<pack>`, or `skill` (workflow behaviour). Notes about the text being incomplete are not lessons.

## 3. Turn notes into lessons, without "mist"

AI easily writes many small, specific rules that blur a skill. Keep it lean:
- A lesson is a **general rule for a kind of situation**, never about one specific text or project.
- A lesson needs **evidence from at least two different texts**. A single note waits in the notes file.
- Diagram types and ways of drawing go into `knowledge/mermaid-rules.md` (the single collection of Mermaid rules), so every domain benefits. Domain packs only get lessons about their domain's concepts and terms; each pack has a **budget of 15 lesson lines** (merge or replace when full).
- Prefer improving an existing sentence over adding one; give the reason in one clause rather than a MUST.
- Mark the notes you used (`→ lesson <date>`); do not delete them.
- This loop changes the skill's text files (rules, domain packs, workflows). The viewer and the check script are built from program code in the developer workspace; when a note needs a change there, tell the user it is for the developers and leave it in the notes.

## 4. Test automatically (old vs new)

The method of Anthropic's skill-creator: old and new version in separate helpers, graded by scripts and a blind judge. Work in a test folder **outside** the copy (`<home>/visualize-idea/improve-runs/<date>/`), so test output never ends up in the copy.
1. Snapshot the current skill folder `<copy>/plugins/visualize-idea/skills/visualize-idea/` into the test folder (the old version).
2. Write the lessons into the copy (the new version). For each lesson, add a small test case to `<copy>/examples/cases/` built from the situation that caused it (input text; for a rework also the previous diagrams, record file and comments file), with its `expect.json` and its prompt in `examples/cases/evals.json`. Use made-up content when the user's real text is private.
3. Run every case in `examples/cases/evals.json` with the old and the new version, each 2–3 times, in separate helpers (sub-agents): "Skill path: …, Task: <prompt>, work in a copy of <case>/project in <test folder>, save outputs there". The user is not there: the helper takes the option the skill recommends where it would ask, and notes the question.
4. **Firm checks** (exact), per run: `node <this>/scripts/firm-checks.mjs <run project folder> --case <copy>/examples/cases/<case>` (diagrams pass the Mermaid check; file names and versions; the record traces every element; role names only; input untouched; markers; comments file deleted after a rework; ids kept).
5. **Judged checks**: an independent helper that is not told which version is which compares the two outputs per case, using `examples/cases/judged-checks.json`: does every element trace to the text, would the comment behind the lesson still be needed, which version answers the case better. (When skill-creator is installed, its `agents/comparator.md` describes this blind comparison.)
6. **Pass rule**: the new version fixes the case(s) of its lessons, all firm checks pass, and no case gets worse. Otherwise drop or rework the lesson.

Tell the user honestly: the judged checks are AI judgement, the firm checks are exact; together they make a bad change unlikely, not impossible.

## 5. Save with one "yes"

Show one short summary, e.g. *"3 lessons, tested on 7 cases: better on 3, equal on 4, nothing worse. Save as version 0.2.1 in your copy?"* On "yes":

`node <this>/scripts/my-copy.mjs save --notes "<one line per lesson>"` (it raises the version, writes the change log, commits and pushes to the user's copy, never to the original).

Then tell the user to update the installed plugin (`/plugin marketplace update`, `/plugin update visualize-idea`, restart), and offer step 6.

## 6. Offer it to the original (optional)

`node <this>/scripts/my-copy.mjs propose --title "<short title>"` gives a link; the user opens it, checks the changes and presses **Create pull request**. The original's owner reviews and merges it; then everyone gets the improvement. Never propose without the user's "yes".

## Keeping the copy up to date

When the user asks to "update my copy from the original" (the skill's version check suggests this when the original has news): `node <this>/scripts/my-copy.mjs sync`. When the original and the copy changed the same lines, resolve them in `<copy>` keeping both ideas where possible (for the version number in `plugin.json`: take the higher one), commit, and run `sync` again. Then tell the user to update the installed plugin.
