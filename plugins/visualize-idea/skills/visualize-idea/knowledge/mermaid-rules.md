# Mermaid rules

Written for **Mermaid 12.1.0**, the version inside the viewer and the check script. Read section 1–3 always, then only the sections of the diagram types you draw.

This file is the project's single collection of Mermaid rules (from the official documentation, our own tests, community guides and research; sources in section 14). When the Mermaid version changes, every rule here is checked again.

## Contents
1. Every diagram
2. Readability
3. Check and repair
4. Flowchart (and graphs)
5. Swimlane
6. Sequence
7. State
8. ER
9. Class
10. Packet
11. XY chart
12. Types not used
13. Choosing the diagram type
14. Sources

## 1. Every diagram

- First line is the type: `flowchart TD`, `swimlane-beta`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`, `classDiagram`, `packet`, `xychart`.
- **No beta types**, except `swimlane-beta`: their syntax can still change. Use the stable header when there is one (`packet`, not `packet-beta`). `architecture` is beta-only in 12.1 (it needs `architecture-beta` and cannot take colour roles), so system overviews use a flowchart with subgraphs.
- **Short simple ids, readable text in a label**: `PwrOn["Power on"]`. Ids: letters, digits, underscore; start with a capital letter (ids starting with `o` or `x` right after a link become arrow ends). The viewer names elements by id in the comments file, and the trace uses the ids, so they are how comments find their way back.
- **Keep ids stable** across versions: an element that still means the same thing keeps its id, order and label.
- **Quote every label**: `A["text"]`, `-->|"text"|`. Unquoted labels break on `( ) [ ] { } : ; / \ < > #` and emoji.
- **Reserved words**: never use `end`, `graph`, `subgraph`, `style`, `class`, `classDef`, `click`, `default`, `direction`, `state`, `note` as an id or bare word. In sequence messages write `End`, not `end`.
- Inside text: `#35;` for `#`, `#59;` for `;`, `#quot;` for `"`.
- `%%` comments only on their own line.
- Line breaks in labels behave differently per type: prefer short labels; `<br>` only in flowchart labels.
- **Nothing about looks in the file**: no front matter, no `%%{init}%%`, no theme, font, look or layout. The viewer decides; a font in the file even makes Mermaid fall back to a serif font.
- **No colours** except colour roles (see `colour-roles.md`) and hard colours a directive asks for. No `linkStyle`, no `click`.
- Clean text copied from PDF or Word (invisible characters break parsing).

## 2. Readability

- **One question per diagram** ("which states does the link have?"). Split rather than combine.
- **Size**: about 15–20 boxes; sequence about 5–6 participants; at most 3–4 parallel branches. Bigger → an overview plus detail diagrams.
- **Short labels**: 2–5 words in a box; details stay in the text or a note.
- **Label every line** that is not obvious (event, condition, message).
- **Same name for the same thing** in every diagram and in the text; follow the project's terms.
- **Direction**: top-to-bottom for processes and state machines, left-to-right for pipelines and data flow.
- **Declare in the order of the main flow**, so the main path is drawn straight and side paths branch off.
- **Draw what the text says, including its unhappy paths** (errors, timeouts, retries, aborts). Do not invent a path the text does not describe; a gap in the text should stay visible as a gap.
- **Small change, small difference**: when the text changes in one place, change the diagram only there and keep the order of everything else.
- **Short notes**: one or two short lines. A long note becomes a tall narrow box that stretches the whole diagram.

## 3. Check and repair

- Before checking: all labels quoted, no reserved words, every id used in a link is defined, every block (`subgraph`, `alt`, `loop`, `state {}`) closed.
- Run `node <skill>/scripts/check-mermaid.mjs <files>`. It parses with Mermaid 12.1.0 and checks the firm rules (file name, beta types, no look settings, no coloured lines, known role names, sequence role bands, packet fields).
- Fix and check again, at most 3 rounds. (Research: checking with the real library and repairing from its error raised the share of generated diagrams that draw from about 70% to 95%.) Still failing → say so honestly, with the error; never hand over a diagram as "checked" when it is not.
- The check parses but does not draw. A few problems show only when drawing; the viewer then adds the error to the comments automatically, and the next rework fixes it.

## 4. Flowchart (and graphs)

- `flowchart TD` or `flowchart LR`. `graph` is the old keyword for the same type. A graph without process (parts and connections, dependencies) is drawn with the same type, without start/end or decisions.
- Shapes with meaning: start/end stadium `A(["Start"])`; step `A["Do it"]`; decision `A{"Valid?"}` with every exit labelled; stored data `A[("Config")]`; sub-process `A[["Self-test"]]`; input/output `A[/"Read sensor"/]`. More shapes: `A@{ shape: doc, label: "Report" }` (doc, delay, event, manual and others) when the shape adds meaning.
- Groups: `subgraph MCU ["Microcontroller"]` … `end`. A subgraph's own `direction` is ignored once one of its nodes links outside it.
- One link per line (`A --> B`), not chains.
- Roles: `class A,B role_error` on its own line (or `A:::role_error`).

## 5. Swimlane

- Answers "who owns this step?": one lane per role, person, department or system.
- Header `swimlane-beta` (top to bottom) or `swimlane-beta LR`.
- Each top-level `subgraph Id ["Lane name"]` … `end` is a lane. Steps use flowchart shapes and syntax (section 4); hand-overs are lines between lanes, labelled when they carry a document, message, decision or condition.
- Roles work on steps as in a flowchart (tested 2026-10-13 in all 4 schemes).
- A party that only receives something (a supplier who gets an order) needs no lane of its own unless the text gives it steps; a labelled line or a step in the sender's lane is enough.

```
swimlane-beta
    subgraph Emp ["Employee"]
        Req(["Request purchase"])
        Inf["Is informed"]
    end
    subgraph Lead ["Team lead"]
        Rev{"Approve?"}
    end
    Req -->|"purchase request"| Rev
    Rev -->|"no"| Inf
    class Req role_start
```
- For the steps alone, without owners, a flowchart is enough.

## 6. Sequence

- Declare participants in display order, initiator on the left: `participant C as Client`; `actor` for people.
- Arrows: `->>` request; `-->>` reply; `-)` asynchronous; `-x` lost or failed.
- Blocks: `alt`/`else` exclusive outcomes; `opt` optional; `loop` repetition; `par`/`and` parallel; `break` abort; `critical`/`option`. Close every block with `end`. Prefer at most two levels of nesting; go deeper only when the text's logic needs it (drawing what the text says matters more).
- Activations (`+`/`-`) only when they add meaning, always balanced.
- Timeouts: a note (`Note over C,S: timeout 500 ms`) or an `alt` branch "timeout".
- `autonumber` helps comments refer to messages; the viewer's "message N" matches the drawn number (tested 2026-10-13).
- Groups of participants: `box Name` … `end`, name only, no colour (`box transparent Name` when the name could be read as a colour).
- Roles only on message bands: write `%% role_<name>` on the line directly before `rect rgb(…)`. The colour after `rect` is only for other viewers; the viewer replaces it. Bands: error, warning, timing, safe, suggestion. A band may wrap messages or a whole block (`alt`, `loop`, `break`). Use few bands (about three per diagram), for the paths that matter most: errors, timeouts, retries.
- `;` in message text must be `#59;`.
- `create participant` / `destroy`: only the receiver of a message can be created; a destroyed participant needs a message that destroys it.
- One scenario per diagram (main path plus its error branches). When the user asks for two scenarios (e.g. joining and sending data), two diagrams with clear names (`sensor-link-join_sequence`, `sensor-link-data_sequence`) are fine; say so in the hand-over.

## 7. State

- `stateDiagram-v2`.
- States with spaces: `state "Waiting for ACK" as WaitAck`, then use the id. The comments file names both (tested 2026-10-13).
- Transition labels: `A --> B : event [guard] / action` (drawn in full, tested 2026-10-13). Avoid extra colons and `<br>` in labels.
- `[*]` start and end dots cannot be coloured: give the start/end role to a named state (`PowerOn`).
- Composite states `state Fault { … }` for shared behaviour; no transitions between inner states of different composite states.
- Parts the text lists without an order (e.g. "a self-test of the lock, the motor and the badge reader"): draw them inside the composite state without lines between them. Lines would show an order the text does not give.
- `<<choice>>` with a guard label on each exit; `<<fork>>`, `<<join>>`; `--` for concurrent regions.
- Notes: `note right of X` … `end note` (also for the doubt of a suggestion).
- A state the text gives no way out of is drawn without one.
- An event that applies in every state (watchdog reset, emergency stop, power loss): when the text gives its target, draw one transition from a composite state that holds the normal states; when it gives no target, a short note is enough; if a comment asks you to draw where it leads and the text still gives no target, the line's label starts with ❓ (an assumed line, see `colour-roles.md`). Do not add a state with no lines in or out.

## 8. ER

- `erDiagram`. Entities singular, in capitals (`ORDER_LINE`).
- Attributes `type name PK|FK|UK "comment"`; type starts with a letter, no spaces; no `"` inside a comment.
- Relationship `A ||--o{ B : "places"` (label required, quoted, read from A's side). Cardinality `|o`, `||`, `}o`, `}|`. `--` identifying, `..` non-identifying. Many-to-many through a junction entity.
- About 10–12 entities per diagram. Roles: mostly data; also external, error, inactive, suggestion.

## 9. Class

- `classDiagram`. Names: letters, digits, `_`, `-`.
- Members: with `()` a method (return type after `)`), otherwise an attribute; visibility `+ - # ~`; `$` static, `*` abstract. Generics `List~int~` (no comma inside generics). Show only the members that matter for the diagram's question.
- Relations: `<|--` inheritance, `*--` composition, `o--` aggregation, `-->` association, `..>` dependency, `..|>` realization; cardinality `"1" --> "*"`.
- Annotations `<<interface>>`, `<<abstract>>`, `<<enumeration>>`.
- Roles on their own line (`class Sensor:::role_hardware` or `cssClass`), never on a relation line.
- For structure (modules, drivers, HAL, data structures), not behaviour.

## 10. Packet

- `packet`. Fields `0-15: "Source port"`, single bit `16: "ACK"`, or the width form `+16: "Source port"` (easier to keep right).
- Lowest bit first; fields contiguous without gaps or overlaps (fill holes with a reserved field). The check script verifies this.
- 32 bits per row by default. Bits are numbered from 0 on the left (the RFC style); use the descending bit order only when the text numbers bits from the right. No roles or colours.

## 11. XY chart

- `xychart` (vertical) or `xychart horizontal`.
- `title "…"`; `x-axis "Mode" [Sleep, Idle, Run]` or `x-axis "Load" 0 --> 100`; `y-axis "Current (mA)" 0 --> 120`.
- Series: `bar "Measured" [..]`, `line "Budget" [..]` (a name shows in the legend).
- **At most one bar series per chart**: Mermaid 12.1 draws several bar series on top of each other, so the front one hides the others (tested 2026-10-13). Show further series as lines.
- Only values that are in the text; never invent data points. No colour palette in the file; the viewer colours the series.

## 12. Types not used

- `architecture` (beta in 12.1, no roles), `sankey` (decided: not used). Candidates for later: treemap, Gantt (only 4 task kinds, no free roles), block (layout was unreliable in our test: overlapping blocks), requirement (elements and requirements can take roles).

## 13. Choosing the diagram type

| The text describes… | First choice | Second choice |
|---|---|---|
| A process, procedure, decision logic | flowchart | sequence (several parties take turns) |
| Who owns which step (hand-overs) | swimlane | sequence (the exchange matters more) |
| Figures: measurements, budgets, timings, counts | XY chart | — |
| Modes, states, lifecycle, reaction to events | state | flowchart (really a procedure) |
| Who sends what to whom, in which order | sequence | state (per endpoint) |
| Frame or register layout, bit fields | packet | ER/class (logical structure) |
| Data and how it relates | ER | class |
| Software structure, modules, interfaces | class | flowchart with subgraphs |
| System parts and how they connect | flowchart with subgraphs | class |

- A network protocol usually needs three views: sequence (the exchange), state (each endpoint), packet (the frame).
- Propose the 1–2 most useful first; mention the others.

## 14. Sources

- Mermaid documentation, mermaid.js.org: [flowchart](https://mermaid.js.org/syntax/flowchart.html), [sequence](https://mermaid.js.org/syntax/sequenceDiagram.html), [state](https://mermaid.js.org/syntax/stateDiagram.html), [ER](https://mermaid.js.org/syntax/entityRelationshipDiagram.html), [class](https://mermaid.js.org/syntax/classDiagram.html), [packet](https://mermaid.js.org/syntax/packet.html), [architecture](https://mermaid.js.org/syntax/architecture.html), [swimlane](https://mermaid.js.org/syntax/swimlanes.html), [XY chart](https://mermaid.js.org/syntax/xyChart.html); [release notes](https://github.com/mermaid-js/mermaid/releases).
- Our own tests in the Idea-Visualizer project (2026-10-07 to 2026-10-14), marked "tested" with a date above.
- Research: [HU Berlin, LLM-supported diagram generator and code validation](https://llm-enabled-development-41d6d8.pages.cms.hu-berlin.de/en/experiments/diagram/diagram-short); [arXiv, LLM debugging of Mermaid sequence errors](https://arxiv.org/pdf/2604.23027).
- Community guides: [Tessl review of a Mermaid skill](https://tessl.io/registry/skills/github/pantheon-org/tekhne/mermaid-diagrams/review), [LongTermWiki style guide](https://www.longtermwiki.com/internal/mermaid-diagrams), [ai-flow-dev guidelines](https://cdn.jsdelivr.net/npm/ai-flow-dev@2.9.1/prompts/shared/mermaid-guidelines.md), [Optum diagramming style](https://awesome-llm-stg.optum.com/assets/instructions/mermaid-diagramming-style), [haowjy mermaid skill](https://skills.sh/haowjy/orchestrate/mermaid), [Visual Paradigm: alternatives and loops](https://skills.visual-paradigm.com/?p=1694), [sequence diagrams for detailed design](https://book.st-hakky.com/en/business/efficient-detailed-design-sequence-diagram).
