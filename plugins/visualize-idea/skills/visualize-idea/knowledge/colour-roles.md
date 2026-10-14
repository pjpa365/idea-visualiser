# Colour roles

You never choose colours. You give a few special elements a **role** and write only the role name; the viewer turns each role into the colours of the scheme the user picked.

## The 12 roles

| Role | Meaning |
|---|---|
| start | Where something begins: power-on, reset entry, boot, initial state, trigger, start of a flow |
| end | Where something finishes: shutdown, done, final state, transaction complete |
| error | Something went wrong: fault, failure, exception, NACK, CRC error, error state, abort |
| warning | Not wrong yet, but not normal: degraded mode, retry, pending timeout, threshold reached, low battery |
| safe | Protection and recovery: safe state, fail-safe, watchdog, interlock, fallback, emergency stop |
| external | Outside the system being designed: other system, operator, host PC, cloud service, third-party chip |
| hardware | Physical parts: MCU, sensor, actuator, power supply, board, peripheral |
| interface | Where parts connect or talk: bus (I2C, SPI, CAN), port, API, protocol layer, driver boundary |
| data | Stored or buffered information: memory, register, buffer, queue, configuration, log, database |
| timing | Time-driven behaviour: timer, interrupt, deadline, periodic task, clock, scheduler tick |
| inactive | Present but not in use now: optional, disabled, not yet implemented, out of scope, standby |
| suggestion | You added or modelled this and are not sure it is the best way (big uncertainty) |

## How to use them

- **Sparingly**: at most about a quarter of the elements get a role (count boxes and states; lanes, groups and lines do not count). When in doubt, no role. Colour should draw the eye to what matters.
- **One role per element**. When several fit, the most important wins: suggestion > error > safe > warning > start/end > the others (a watchdog is "safe", not "timing"; a bus fault is "error", not "interface").
- **Assumptions are suggestions, visible in the diagram**: an element the text does not give, that you added to make the diagram work, gets the suggestion role and ❓, and the trace says "assumption" with the reason. The same for an element the text gives but whose place you had to assume (e.g. which lane owns a step): the user must be able to see the doubt in the diagram itself, not only in your message.
- **Assumed lines**: a line cannot get a role, so a line the text does not give (e.g. where an event leads when the text names no target) gets a label that starts with ❓ (`Fault --> PowerOn : ❓ restart`, `A -->|"❓ retry"| B`), and the trace says "assumption" with the reason. Without the ❓ the user would read the line as something the text says.
- **Suggestion elements**: the text starts with ❓ (`Advice["❓ Ask for prepayment"]`); use ❓ only there and at the start of an assumed line's label, and only at the start. Explain the doubt and, where possible, the alternative: in a note where the type has notes (state, sequence, class); in types without notes (flowchart, swimlane, ER, packet) explain it in your hand-over message and in the trace (how to show it inside these diagrams is still open, O6 in the specification).
- **Lines are never coloured.**
- **Hard colours** only when a directive asks for a specific colour: then write the colour directly (`style A fill:#…`); the viewer keeps it.

## Syntax per diagram type

| Type | What can get a role | How |
|---|---|---|
| flowchart, swimlane | boxes and groups | `class A,B role_error` on its own line, or `A:::role_error` |
| state | named states and nested states (not the `[*]` dots; notes get no role) | `class PowerOn role_start` |
| class | classes | `class Sensor:::role_hardware { … }` or `class Sensor:::role_hardware` on its own line |
| ER | entities | `ORDER:::role_data` on its own line |
| sequence | only message bands (error, warning, timing, safe, suggestion) | `%% role_error` on the line directly before `rect rgb(255,230,230)` … `end` |
| packet, XY chart | nothing | no roles |

- Write role names as `role_<name>`. Never write `classDef role_…`: the viewer adds the colour definitions (and `end` on its own is a reserved word, hence the prefix).
- The check script rejects unknown role names, `classDef role_…`, coloured lines, and a `%% role_…` line that is not directly before `rect`.
