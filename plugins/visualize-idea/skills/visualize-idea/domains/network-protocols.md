# Domain pack: network protocols

Protocols, links and device–cloud connections. Drawing hints only: draw what the text says; this pack is not a checklist.

## Recognition
Words like frame, packet, message, header, payload, handshake, ACK/NACK, retransmit, sequence number, session, keep-alive, MQTT, HTTP, TCP/UDP, BLE, CAN, Modbus, CRC, checksum.

## Terms and writing style
- Keep the text's message and field names exactly (`CONNECT`, `SYN-ACK`, `seq_no`), including capitals.
- Use the text's words for the parties (client/server, master/slave, host/device) in every diagram.
- Sizes and timings exactly as written; missing ones become `[?]` open points.

## Diagram choice
A protocol usually needs three views; propose the two that fit the text best and mention the third:
- the exchange in order → sequence diagram (one scenario per diagram: setup, normal data, error/retry, teardown);
- the behaviour of one endpoint → state diagram (one per endpoint);
- the frame layout → packet diagram.
- Throughput, latency or message-size figures the text gives → XY chart.

## How concepts are drawn
- Request / reply → `->>` and `-->>`; fire-and-forget → `-)`; a lost message → `-x`.
- Retries → `loop` in the sequence; a retry counter → a guard on the state transition (`timeout [retries < 3]`).
- Success vs failure outcomes → `alt` / `else`; an abort → `break`.
- Timeouts → a note on the waiting side or an `alt` branch "timeout".
- `autonumber` in sequence diagrams, so comments can refer to "message 3".
- Frame fields in bit order, lowest first; reserved bits as their own field.

## Role hints
Bands in sequence diagrams: error (NACK, CRC error), warning (retry), timing (timeouts). States: start (idle/disconnected start), error, safe (fallback), timing. External for the other side when it is outside the system.

## Lessons
(Added through loop 2, each with date and evidence. Budget: at most 15 lines.)
