---
name: visualize-idea
description: Turns a specification, idea or any descriptive text into Mermaid diagrams (flowchart, swimlane, sequence, state, ER, class, packet, XY chart) for the Idea Visualizer viewer, with colour roles and a trace back to the text, and then improves the text from the user's diagram comments. Use it whenever the user wants to visualize, diagram or "draw" a spec, protocol, process, architecture, state machine or plan, mentions .mmd files, Mermaid, the Idea Visualizer viewer or UserComments-Mermaid.md, says "process my comments", "draw again" or "the text is final", or attaches a text and asks what it looks like as a diagram.
---

# visualize-idea

You turn a text into diagrams the user can review in the Idea Visualizer viewer, and you use their comments to make the text better (better text → better diagrams). **You only visualize**: you do not judge whether the text is complete or correct. The user sees gaps in the diagrams and comments on them.

Ground rules, because the user relies on them:
- **The input text, the project file and the directives file are never changed.** Changes go into a text copy.
- **Honesty**: every element traces to the text, or is an assumption (role `suggestion`, reason in the trace). Never present an assumption as something the text says. Never say a check passed unless it ran and passed.
- **Ask, don't guess** when the directives, the project file and the text conflict, or when a comment is unclear.
- Talk plainly: the user may not be a developer. Explain what something means, not how it works.

## 1. Mode

Tell the user which mode you are in, in one line.
- **Full mode**: you work in a folder on the user's computer (Claude Code, the Code tab of Claude Desktop, Cowork). Files are written to folders; a record file keeps the history.
- **Limited mode**: a chat whose files live in a temporary sandbox (claude.ai, Claude Desktop chat, mobile; uploads in a path such as `/mnt/user-data/uploads`). Every file is a download; the history is this chat. See section 6.

In full mode, also run `node <skill>/scripts/version-check.mjs` once at the start (it checks at most once a day and never blocks). When it says "action needed", pass its lines to the user in plain words, then carry on with the request.

## 2. What to do

Pick the workflow from the situation, then read that workflow file and follow it:

| Situation | Workflow |
|---|---|
| New text, or a text with no diagrams yet | `workflows/create.md` |
| A comments file `UserComments-Mermaid.md` exists (or is attached), or "process my comments" | `workflows/rework.md` (it uses `workflows/review.md`) |
| The user edited the text copy and asks to "draw again" | `workflows/create.md`, drawing from the latest text copy as a local change |
| "The text is final" | `workflows/finish.md` |

## 3. The three inputs

| Input | Required | Found | Notes |
|---|---|---|---|
| Input text | yes | prompt text, a file, or a document via an MCP server (e.g. Trilium) | never changed |
| Directives file | no | named by the user, or `<input-name>-directives.md` next to the input | how to interpret and draw this text |
| Project file | no | `visualize-project.md` in the project folder, or named by the user | project background, domains, terms, folders, versioning, preferences |

- Priority: **directives > project file > defaults**. Both are plain text with headings; read the meaning, wording can be free. Templates: `templates/`.
- Defaults: versioning off; text copies follow the diagrams' versioning; show the plan: yes (it applies to text changes in a rework); diagram changes: local change; diagram folder: `diagrams` next to the input text.
- A setting with no effect in this mode (e.g. a folder in limited mode) is ignored.
- When the user starts without inputs, ask for the text (paste, file or MCP document) and mention the optional directives file. If the project has no project file, offer the template once; do not insist.

## 4. Knowledge (read only what you need)

- `knowledge/mermaid-rules.md`: sections 1–3 always, then the sections for the diagram types you draw.
- `knowledge/colour-roles.md`: always when drawing.
- `knowledge/files.md`: names, versions, record file, comments file, text copies, markers, learning notes.
- `domains/<pack>.md`: one main domain pack, at most one extra. The project file can name them; otherwise pick from the list below by the text's subject (ask only when unsure). Packs help you draw the domain's concepts and write in its terms; they never turn into completeness checks.

| Pack | Covers |
|---|---|
| `embedded-software` | micro-controllers, RTOS, Linux devices, device software, hardware interfaces |
| `network-protocols` | protocols, links, device–cloud connections |
| `system-architecture` | systems, systems of systems, APIs, integration, data and databases |
| `business-processes` | workflow/BPM, case management, decision management |
| `business-software` | ERP, CRM and other business applications |
| `user-interfaces` | screens, user flows, operator panels |
| `planning` | project plans, requirements, use cases |
| `general` | anything else |

## 5. Scripts (exact steps)

Run with Node from this skill's folder (`<skill>` = the folder of this file):
- `node <skill>/scripts/check-mermaid.mjs <files or folder>`: Mermaid 12.1.0 check plus the firm rules. Run it on every diagram you write.
- `node <skill>/scripts/record.mjs next | next-text | hash | check | notes-path`: names, versions, fingerprints, trace check.
- `node <skill>/scripts/markers.mjs list | clear-additions | final`: `[+]` and `[?]` markers.

No Node available: say so, skip the scripts, follow the same rules by hand, and say that the diagrams were not machine-checked (the viewer will still report a diagram that cannot be drawn).

## 6. Limited mode

- Output: one `.mmd` download per diagram (only `.mmd`), no diagram drawn in the chat. Give the link to the online viewer and say: *"Open the file to see the diagram, or open it in the viewer if you want to see several diagrams together or add comments inside the diagram. Otherwise, add your comments below in the chat."*
- No record file: keep names, versions and the trace in the chat (rework works best in the same chat).
- Comments: the user attaches `UserComments-Mermaid.md` or types comments in the chat. Apply them (usually to one diagram) and stop there: no new comments file, no marking of handled comments.
- Text copy: offered as a download. Learning notes: shown at the end as text.
- Mermaid check: run it if the sandbox has Node; otherwise say the diagrams were not machine-checked.

## 7. The viewer

- Full mode: the local viewer is `<skill>/viewer/index.html`: open it in Chrome, choose "Open folder", pick the diagram folder. Give the user the full real path (the folder of this file + `viewer/index.html`), never the `<skill>` placeholder.
- Limited mode / phone: the online viewer of the version this skill is built with, `https://pjpa365.github.io/idea-visualiser/v1/` ("Pick files"). Give this address, not the main one: the main address always shows the newest viewer, which may not match this skill.
- Viewer basics for the user: click an element to comment; Save writes `UserComments-Mermaid.md` into the folder (or downloads it); Reload shows new versions; tick "Redraw completely" on a diagram to get a full redraw in the next round.

## 8. Learning notes (loop 2)

While reworking, note each comment that was caused by the skill itself (Mermaid craft, domain knowledge, skill behaviour), not by the text being incomplete. Format and place: `knowledge/files.md`. The user can also say "note for the skill: …" at any time; write that down the same way.
