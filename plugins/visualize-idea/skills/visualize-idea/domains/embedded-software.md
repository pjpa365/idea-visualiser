# Domain pack: embedded software

Micro-controllers, RTOS, embedded Linux (e.g. Raspberry Pi), device software on a PC, and the hardware interfaces around them. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like MCU, firmware, interrupt, ISR, register, GPIO, I2C/SPI/UART/CAN, RTOS task, watchdog, bootloader, flash, low-power mode, sensor, actuator, driver, HAL.

## Terms and writing style
- Keep the text's own names for modes, tasks, signals and registers (`STANDBY`, `adc_task`, `CTRL_REG`), including their capitals.
- Requirements are often written "shall"; additions follow that form when the text uses it.
- Units and numbers exactly as written (ms, µA, kHz); a missing value becomes an `[?]` open point, never a guess.

## Diagram choice
- Modes and their changes (boot, run, sleep, fault, update) → state diagram.
- Exchanges on a bus or with a host or cloud → sequence diagram.
- Start-up or update procedure, decision logic → flowchart.
- Software structure (drivers, HAL, tasks, modules) → class diagram, or flowchart with subgraphs per layer.
- Register or frame layout → packet diagram.
- Figures the text gives (timing budget, current per mode, memory use) → XY chart.

## How concepts are drawn
- Power-on / reset entry → a named start state (`PowerOn`, role start), not only the `[*]` dot.
- Interrupt vs main loop → separate participants in a sequence, or separate subgraphs in a flowchart.
- Safe state, fail-safe → their own state or box, role safe. A watchdog or reset that the text gives a target for → one transition (from a composite state when it applies everywhere); without a target → a short note (`knowledge/mermaid-rules.md` section 7).
- Timeouts → a transition label `timeout [after 500 ms]` (state) or a note / `alt` branch (sequence).
- Hardware blocks (sensor, MCU, power supply) → boxes with role hardware; the bus between them role interface.
- "Any fault goes to Fault" → a composite state or one transition from a group, not a line from every state.

## Role hints
start (power-on, boot), safe (watchdog, safe state), error (fault, bus error), timing (timers, ticks, deadlines), hardware, interface (buses, drivers), data (flash, buffers, configuration).

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
