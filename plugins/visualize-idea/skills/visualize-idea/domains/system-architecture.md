# Domain pack: system architecture

Systems and systems of systems, APIs and integration, data and databases. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like system, subsystem, component, service, API, interface, integration, gateway, database, message bus, queue, cloud, on-premise, deployment, data flow.

## Terms and writing style
- Use the text's names for systems and interfaces, the same on every level.
- Architecture texts often describe responsibilities ("X is responsible for…"); additions follow the same pattern.

## Diagram choice
- Which parts exist and how they connect → flowchart with subgraphs (one subgraph per system, location or layer). (Mermaid's architecture type is beta in 12.1 and is not used.)
- How a request travels through the parts → sequence diagram.
- Data and how it relates → ER diagram.
- Interfaces and modules of one system → class diagram.
- Lifecycle of an important object (order, job, device) → state diagram.

## How concepts are drawn
- One overview diagram with each subsystem as a box or group, plus one diagram per subsystem; interfaces carry the same name on both levels.
- Data stores as cylinders `[("Orders DB")]`; queues and buses as boxes with role interface.
- Systems outside the scope → role external, at the edge of the diagram.
- Data flow lines labelled with what flows (`"order events"`), direction left-to-right.

## Role hints
external (other systems, users, cloud services), interface (APIs, buses, gateways), data (databases, stores, queues), inactive (planned, not yet built), error and safe only where the text describes failure handling.

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
