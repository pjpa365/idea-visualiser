# Rework: comments → better text → better diagrams

This is loop 1. The user commented in the viewer and saved `UserComments-Mermaid.md`. You place each comment in the text, update a copy of the text, check your own changes, and draw new diagrams from the new copy.

## 1. Read

- The comments file (format: `knowledge/files.md`). Per `###` file: the comments, any `**Error (added automatically)**` entry, and `**Redraw completely**: yes`.
- The record file: the diagrams named in the comments file, their trace, the latest text copy (or the original on the first round), the settings.
- The current text: the latest text copy. If its hash differs from the record, the user edited it: take their version as it is. Remove the `[+]` markers of the previous round: `node <skill>/scripts/markers.mjs clear-additions <copy> <new-copy>` (or do it in memory before writing the new copy).
- Limited mode: the comments come from the attached file or the chat, the record from this chat.

## 2. Place and sort each comment

- **Place**: element (by its id in the comments file) → trace → place in the text. For an assumption or suggestion, the place where the text would have described it.
- **Sort**:
  - **a. Diagram only**: about the drawing, not the content ("make this a final state", "split this box", "this assumption is correct").
  - **b. Text change**: something is missing or wrong in the text ("error handling is missing here", "3 more states: …").
  - **e. Diagram error**: the automatic error entry.
  - **q. Question** to you: answer it in your report. When the honest answer is that the diagram left out something **the text says**, correct the diagram (that is drawing the text, not a new decision) and say so. Anything the text does not say becomes a proposal or an `[?]` point, never a silent change.
  - **unclear**: ask the user before changing anything for it.

## 3. Show the plan (setting "show the plan", default yes)

Before changing the text, show per comment: number, kind (a/b/e/q), where in the text, and what you will change (one line each). The user approves or corrects it. When the setting is off, go on at once (and recommend versioning of text copies, so the user can go back).

## 4. Apply

- **a. Diagram only**: change the diagram. A *confirmed assumption* also goes into the text copy, written as a normal sentence, otherwise the next round would mark it as an assumption again.
- **b. Text change**: write the addition at the place found, **in the style, terms and level of detail of the text**, so a later reader cannot tell it was added. Content that neither the text nor the comment gives (a timeout value, a count, a name, your own suggestion) is never filled in silently: write the addition without it when the sentence still makes sense, otherwise write an open point that starts with `[?] `. Use `[?]` also for your suggestions and for anything you are not sure about. Do not add `[?]` points for situations neither the text nor the comment mentions ("what if the doorway is not clear?"): that would be judging completeness, and the user sees such gaps in the diagrams.
- Start every addition of this round with `[+] ` (the user searches for it).
- **e. Diagram error**: fix the diagram's Mermaid text (no text change).
- When a change makes a counting or listing sentence wrong ("four states", "the three steps"), update that sentence too.

## 5. Write the text copy

- Never change the original. Write `<name>_text[_vN].md` in the text folder (`node <skill>/scripts/record.mjs next-text …`). Versioning off: one working copy that is updated.
- Record (full mode): the text copy and its hash, and per comment the change record (`changes` in `knowledge/files.md`).

## 6. Review your own changes

Follow `workflows/review.md`. Fix what it finds, or put it to the user as a question.

## 7. Draw the new diagrams

From the new text copy, as in `workflows/create.md` steps 4–6. Every diagram of this input whose content is affected by a text change gets a new version, also a diagram nobody commented on (e.g. a reaction added to the text that also shows in the sequence diagram); a diagram that nothing affects is left as it is. Draw as a **local change**: start from the previous `.mmd`, keep ids, order and labels of everything the changed text does not touch. Full redraw only for files marked `**Redraw completely**: yes` (or when the settings say full redraw). With versioning on, write the next `_vN`; off, overwrite. Check every file with the Mermaid check.

## 8. Close

- Full mode: **after** the new diagrams pass the check, delete `UserComments-Mermaid.md` (as late as possible: if something failed earlier, the user can run the rework again). Keep no copy. Do not delete it when a diagram still fails the check; say why.
- Learning notes: for each comment caused by the skill itself (cause: mermaid, domain:<pack> or skill), append a note (`knowledge/files.md`). Comments caused by an incomplete text are not noted. Limited mode: show the notes at the end as text.
- Tell the user, briefly: what changed per comment, where the text copy is, the `[?]` open points (`node <skill>/scripts/markers.mjs list <copy>`), the new diagram files, and: "Press Reload in the viewer to see the new diagrams. You may edit the text copy; I will take your version as it is. When the text is right, say 'the text is final'."
