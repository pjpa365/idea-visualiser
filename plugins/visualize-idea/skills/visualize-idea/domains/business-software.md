# Domain pack: business software

ERP, CRM and other business applications. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like ERP, CRM, module, master data, customer, account, lead, opportunity, sales order, invoice, item, stock, ledger, workflow in the application, screen, report, integration with another application.

## Terms and writing style
- Use the application's own object names (the text's "Sales Order", "Account") with their capitals.
- Field names as written; additions in the same functional style ("The system shows…", "The user selects…") when the text uses it.

## Diagram choice
- Business objects and how they relate → ER diagram.
- Lifecycle of a record (draft → approved → posted) → state diagram.
- The business process around the application, with who does what → swimlane.
- Integration with other applications → flowchart with subgraphs, or a sequence diagram for one exchange.
- Volumes and figures the text gives → XY chart.

## ERP
- Typical objects: item, bill of materials, sales order, purchase order, stock, invoice, ledger entry. Order-to-cash and purchase-to-pay are processes (swimlane); the order itself has a lifecycle (state).

## CRM
- Typical objects: account, contact, lead, opportunity, case. A lead or opportunity has stages (state diagram); the sales or service process is a swimlane.

## How concepts are drawn
- Master data vs transactions: master data entities role data; transaction entities without role, unless the text stresses them.
- Another application → role external; the interface between them role interface.
- Status values exactly as the text names them, as states.

## Role hints
data (master data, registers), external (other applications, customers, suppliers), interface (integrations), inactive (later phases, out of scope), error (rejected, blocked).

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
