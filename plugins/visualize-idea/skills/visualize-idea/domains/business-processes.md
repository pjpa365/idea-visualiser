# Domain pack: business processes

Workflow and BPM, case management, and decision management. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like process, procedure, workflow, task, step, approval, hand-over, role, department, request, case, dossier, status, escalation, decision, rule, policy, SLA, deadline.

## Terms and writing style
- Use the text's names for roles and departments ("Sales", "case worker") and for documents ("purchase order").
- Process texts are usually written as actions ("Sales checks the credit limit"); additions follow that pattern: who does what.

## Diagram choice
- Who owns which step and who hands over to whom → swimlane (one lane per role or department).
- The steps alone, without owners → flowchart.
- Lifecycle of a case or request (statuses and what changes them) → state diagram.
- Order of decisions → flowchart; the decision table itself stays in the text.
- Volumes, lead times or backlog figures the text gives → XY chart.

## How concepts are drawn
- BPM start / end events → stadium shapes `(["…"])` with roles start / end.
- Gateway (exclusive choice) → decision diamond, every outcome the text names labelled.
- Parallel work → two branches from one step that join again later.
- Hand-over → a line between lanes, labelled with the document or message when the text names one.
- Waiting time, deadline, SLA → label on the line or a step with role timing.
- Escalation → a line to the escalation step, role warning.
- Case status → a state; the event that changes it → the transition label.

## Role hints
start / end (process start and end events), warning (escalation, reminder), error (rejection, failure), external (customer, supplier, other organisation), data (registers, records), timing (deadlines).

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
