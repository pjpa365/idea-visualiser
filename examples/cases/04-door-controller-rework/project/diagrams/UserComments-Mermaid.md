# User comments — Mermaid diagrams

## Saved 2026-10-13 15:10

### door-controller_state_v1.mmd

1. **State** "❓ Jammed" (id `Jammed`)
   Correct, a jam needs its own state. After a jam the motor must stop and open the door fully again, and the controller reports the jam to the access server. Please put this in the text.
2. **Line** "Open" → "Closing", label "after 10 s" (from `Open` to `Closing`)
   Before closing, the controller must check that the doorway is clear.
3. **State** "Self-test" (id `SelfTest`)
   Draw the self-test as one state with the three checks inside it.
4. **State** "Fault" (id `Fault`)
   Why is the watchdog not in the diagram?

### door-controller_sequence_v1.mmd

1. **Error (added automatically)**
   This diagram could not be drawn.
   Parse error on line 20:
   ...  C->>B: red light
   ---------------------^
