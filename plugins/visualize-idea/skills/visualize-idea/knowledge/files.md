# Files, names and versions

## Where things go (full mode)

| What | Where | Written by |
|---|---|---|
| Diagrams `.mmd` | the diagram folder: project file setting, else a folder `diagrams` next to the input text | the skill |
| Record file `visualize-record.json` | the diagram folder | the skill |
| Comments file `UserComments-Mermaid.md` | the diagram folder | the viewer (Save) |
| Text copies `<name>_text[_vN].md` | the text folder: project file setting, else `text` inside the diagram folder | the skill |
| Learning notes `learning-notes.md` | `<home>/visualize-idea/` (`node scripts/record.mjs notes-path` prints it) | the skill |
| Input text, project file, directives file | where the user keeps them | the user only: **never change them** |

In limited mode there are no folders: every file is a download, and the record lives in the chat.

## File names

- Diagram: `<name>_<diagram-type>.mmd`, with versioning on `<name>_<diagram-type>_vN.mmd`.
- Diagram types in names: `flowchart`, `swimlane`, `sequence`, `state`, `er`, `class`, `packet`, `xychart`.
- `<name>`: short, lowercase, words joined by `-` (`door-controller`). It may contain `_`, but `-` is clearer. Directives can give it; otherwise propose one on the first run. Later runs reuse the name from the record (or, in limited mode, from the chat).
- Two diagrams of the same type for one input: make the name more specific (`door-controller-boot_state`, `door-controller-fault_state`).
- Next file name: `node scripts/record.mjs next <diagram-folder> <name> <type> <on|off>`; next text copy: `node scripts/record.mjs next-text <text-folder> <name> <on|off>`.
- Versioning off: the file is overwritten with the same name (the user presses Reload in the viewer). Versioning on: a new `_vN` each round; old versions stay, so the user can step back with v−/v+.

## Record file `visualize-record.json`

Keeps the link between input and output, so the next round finds the same name and the next version, and so comments can be placed in the text. The user never needs to read it. Write it as JSON (create it on the first run, update it every round):

```json
{
  "version": 1,
  "inputs": [
    {
      "name": "door-controller",
      "input": "specs/door-controller.md",
      "inputHash": "3f2a9c01d4e5b6a7",
      "directives": "specs/door-controller-directives.md",
      "domains": ["embedded-software"],
      "settings": { "versioning": "on", "textVersioning": "on", "showPlan": "yes", "diagramChanges": "local" },
      "rounds": [
        { "round": 1, "date": "2026-10-13", "kind": "create", "from": "specs/door-controller.md",
          "wrote": ["door-controller_state_v1.mmd"] }
      ],
      "diagrams": [
        {
          "file": "door-controller_state_v1.mmd", "type": "state", "version": 1, "round": 1,
          "trace": [
            { "id": "Closed", "element": "state Closed", "source": "§2 \"the door starts closed and locked\"" },
            { "id": "Opening", "element": "state Opening", "source": "§3.1 \"on a valid badge the motor opens the door\"" },
            { "id": "Jammed", "element": "state Jammed", "assumption": "the text names a jam sensor but not what happens after a jam" }
          ]
        }
      ],
      "textCopies": [ { "file": "diagrams/text/door-controller_text_v1.md", "hash": "9be0c4d1a2f37e55", "round": 2 } ],
      "changes": [
        { "round": 2, "textCopy": "diagrams/text/door-controller_text_v1.md", "comment": "door-controller_state_v1.mmd #1",
          "kind": "text change", "where": "§3.1", "change": "added what happens after a jam", "openPoints": 1 }
      ]
    }
  ]
}
```

- **Paths** in the record are relative to the project folder (the folder with the project file, or the folder the user works in). You may add fields you need (e.g. the hash of the project or directives file); keep the ones shown.
- **Trace**: one entry per element id in the diagram (states, boxes, participants, entities, classes, fields, lanes), and for lines, messages and notes that carry meaning. `source` = section plus a short quote (a text without headings: `para 3`); or `assumption` = the reason. An element that comes from the text but is placed by assumption (e.g. a step in a lane the text does not name) gets both. Ids for things without an id: lines `From->To`, sequence messages `message N`, notes `note <first words>`, bands and blocks `band <first words>` / `alt <condition>`; packet fields use their label. When two get the same id, add a short qualifier in brackets (`Locked->Locked (deny)`). `node scripts/record.mjs check <diagram-folder>` verifies the element ids it can find in the diagram (boxes, states, participants, classes, entities, packet fields, lanes); lines, messages, notes and bands are your own responsibility.
- `inputHash` / text copy `hash`: from `node scripts/record.mjs hash <file>`. A different hash later means the user changed that file.
- `changes`: the change record of loop 1 (what was added, in which round, for which comment). Not shown to the user.

## Comments file `UserComments-Mermaid.md` (written by the viewer)

```markdown
# User comments — Mermaid diagrams

## Saved 2026-10-13 16:32

### door-controller_state_v1.mmd

**Redraw completely**: yes

1. **State** "Waiting for badge" (id `WaitBadge`)
   This should also time out after 30 s.
2. **Line** "Opening" → "Jammed", label "jam sensor" (from `Opening` to `Jammed`)
   Correct, the text should say this.

### door-controller_sequence_v1.mmd

1. **Error (added automatically)**
   This diagram could not be drawn.
   Parse error on line 12: …
2. **Message** "Controller" → "Motor", label "open" (from `C` to `M`, message 3)
   Is this a request or a command?
```

- One `###` section per diagram file (file name with version). Only files with comments are listed.
- `**Redraw completely**: yes` under a file: the user ticked "Redraw completely" for it; redraw that diagram fully instead of a local change.
- Each entry names the element by visible text **and** id: `(id \`X\`)` for boxes, states, lanes, classes, entities; `(from \`A\` to \`B\`)` for lines; `message N` for sequence messages; `bits a–b` for packet fields; `(category "…")` for XY chart bars. `[*]` is a start or end dot of a state diagram.
- Element kinds: Element, State, Class, Entity, Group, Lane, Line, Participant, Message, Note, Block, Field, Section, Title, Category, Series, Bar.
- `**Error (added automatically)**`: the viewer could not draw that file; the text is Mermaid's error. Fix the diagram like any comment.
- There is only ever one comments file; saving in the viewer overwrites it.

## Text copies and markers

- The input text is never changed. Changes go into a text copy `<name>_text[_vN].md` (own versioning setting, default: same as the diagrams). Text copies count on their own: the first copy is `_v1`, also when the diagrams are already at v2. No text copy is made in a create round.
- From round 2 on, the latest text copy is the input. The user may edit it between rounds; take their version as it is.
- `[+] ` starts each addition of the latest round (at the start of the added sentence or paragraph), so the user can search for what changed. Removed at the start of the next round (`node scripts/markers.mjs clear-additions`) and in the final copy. An open point that is also new this round starts with `[+] [?] `.
- `[?] ` starts every open point: a suggestion, a value the text and the comment do not give, or anything you are not sure about. Stays until the user answers it. `node scripts/markers.mjs list <copy>` lists them.
- Final copy: `node scripts/markers.mjs final <latest-copy> <name>_text_final.md` (refuses while `[?]` points are left).

## Learning notes `<home>/visualize-idea/learning-notes.md`

One file outside every project, so lessons survive when a project folder is deleted. Append; never rewrite earlier notes. Format, one note per comment that was caused by the skill itself:

```markdown
## 2026-10-13 · door-controller · round 2
- cause: mermaid | domain:<pack> | skill
- comment: "This should also time out after 30 s" on state WaitBadge
- what went wrong: the diagram drew a timeout the text gives for another state
- general lesson (proposal): …
```

Comments caused by the text being incomplete are loop 1 working as intended: do not note them.
