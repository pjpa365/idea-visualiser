# Domain pack: user interfaces

Screens, user flows and operator panels. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like screen, page, dialog, menu, button, field, form, wizard, navigation, user flow, operator panel, display, touch, keypad, alarm screen.

## Terms and writing style
- Screen and button names exactly as written, in the text's quotes or capitals ("Settings", `OK`).
- User actions written as the text writes them ("The user presses OK").

## Diagram choice
- Which screens exist and how the user moves between them → state diagram (screens as states, user actions as transitions).
- One task from start to end (sign up, change a setting) → flowchart.
- Interaction between the screen and the system behind it → sequence diagram (user, screen, system).
- Who does what when several people are involved → swimlane.

## How concepts are drawn
- The first screen → role start; logout or exit → role end.
- Error and alarm screens → role error or warning.
- A dialog that returns to the screen it came from → a transition there and back, labelled with the action.
- Disabled or later screens → role inactive.

## Role hints
start, end, error (error screen), warning (confirmation, alarm), inactive (disabled, not yet built), external (other systems the screen talks to).

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
