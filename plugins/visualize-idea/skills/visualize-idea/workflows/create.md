# Create: text → diagrams

Also used for "draw again" after the user edited the text copy (then: steps 1–3 with the latest text copy as input, step 6 as a local change from the previous diagrams).

## 1. Read the inputs

- Read the input text completely. Read the directives and project file if there are any. Never change these files.
- Full mode: look for `visualize-record.json` in the diagram folder. If it knows this input, reuse its name, domains and settings, and continue its versions. If the input's hash differs from the record, the user changed the original: ask whether to start again from the original or keep working from the latest text copy.
- Settings: directives > project file > defaults (SKILL.md section 3). When two sources conflict and the text does not settle it, ask.

## 2. Decide name, domain and diagram types

- **Name**: from the directives, else from the record, else propose a short one (`door-controller`).
- **Domain pack**: from the project file, else choose one main pack (plus at most one extra) and read `domains/<pack>.md`. Say which you use in one line.
- **Diagram types**: when the directives list them, use them without asking. Otherwise propose the 1–2 types that answer the main questions of this text (`knowledge/mermaid-rules.md` section 13 and the pack's "Diagram choice"), with one line of reason each, mention other useful views, and let the user choose. When the user already said which diagrams they want, do not ask again.
- One question per diagram: a big text gets an overview plus detail diagrams rather than one huge diagram.
- "Show the plan" is about text changes in a rework; when creating, the choice of diagram types is the only question.

## 3. Read the knowledge

`knowledge/mermaid-rules.md` sections 1–3 and the sections of the chosen types; `knowledge/colour-roles.md`.

## 4. Draw

- Draw what the text says, in its terms. A short name you give to something the text describes (a "Self-test" state for "the controller runs a self-test") still comes from the text. Every element comes from a sentence of the text, or it is an **assumption**: something the diagram needs that the text does not give. Draw an assumption as a `suggestion` (❓ at the start of its text; for an assumed line, ❓ at the start of its label) and write the reason in the trace. Keep assumptions few; prefer leaving a visible gap over inventing.
- A gap in the text (a state without a way out, a decision with one outcome) stays a gap in the diagram. You only visualize; the user judges.
- When the text can be read two ways and the diagram has to pick one ("at most 3 times" vs "after 3 failures"), use the text's own words in the label and mention the reading you drew in the hand-over. That is not judging the text; it tells the user what the drawing assumes.
- Keep notes short (one or two short lines). Long notes make a diagram tall and hard to read; the full explanation belongs in the hand-over and the trace.
- Colour roles sparingly (about a quarter of the elements at most).
- Short ids, quoted labels, declaration in the order of the main flow (they keep later versions stable).
- Keep a trace while drawing: for every element id, the section and a short quote it came from, or the assumption and its reason (format and ids for lines, messages and notes: `knowledge/files.md`).

**Local change** ("draw again", rework): start from the previous `.mmd` of that diagram. Parts whose text did not change keep the same elements, ids, order and labels; change only what the changed text affects. Redraw completely only when the comments file says `**Redraw completely**: yes` for that diagram, or the directives/project file sets full redraw.

## 5. Write and check

- File names: `knowledge/files.md` (`node <skill>/scripts/record.mjs next …`). Full mode: write into the diagram folder (create it if needed). Limited mode: prepare downloads.
- Run `node <skill>/scripts/check-mermaid.mjs <the new files>`. Fix and run again, at most 3 rounds. If a file still fails, keep it, report the error plainly, and do not call it checked.

## 6. Record (full mode)

- Create or update `visualize-record.json` (`knowledge/files.md`): input and hash, settings, the round, the files written, the trace per diagram.
- Run `node <skill>/scripts/record.mjs check <diagram-folder>`; add trace entries for anything it reports missing.

## 7. Hand over

Keep it short and plain:
- The files written (and where), with one line per diagram on what question it answers.
- Assumptions and suggestions, each with its reason (this is where diagram types without notes explain their doubt).
- Whether the Mermaid check passed for every file.
- How to look at them: the viewer path or address (SKILL.md section 7). In limited mode, the explanation sentence from SKILL.md section 6.
- What happens next: "Comment in the viewer and press Save, then ask me to process your comments."

No learning notes in a create round: they come from the user's comments (rework). Do not create an empty notes file.
