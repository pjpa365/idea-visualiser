# SensorLink protocol, version 1

SensorLink connects battery-powered sensor nodes to a gateway over a serial radio link.

## 1. Frame format

Every frame starts with a 1-byte start byte (0x7E), followed by a 1-byte frame type, a 1-byte sequence number and a 1-byte payload length. Then follows the payload of 0 to 32 bytes and, at the end, a 2-byte CRC-16 over all bytes after the start byte.

For the diagram, show the frame with a payload of 4 bytes.

Frame types: 0x01 HELLO, 0x02 HELLO_ACK, 0x10 DATA, 0x11 DATA_ACK, 0x1F NACK, 0x20 BYE.

## 2. Joining

A node that wakes up sends HELLO with its node id as payload. The gateway answers with HELLO_ACK, which carries the time slot the node may use. If no HELLO_ACK arrives within 500 ms, the node sends HELLO again, at most 3 times. After 3 failures the node sleeps for 60 seconds and starts again.

## 3. Sending data

In its time slot the node sends DATA frames with measurements. The gateway confirms each DATA frame with DATA_ACK carrying the same sequence number. If the CRC is wrong, the gateway answers NACK, and the node repeats the frame. A node repeats a frame at most twice; after that it drops the frame.

## 4. Leaving

Before going to sleep for a longer time, the node sends BYE. The gateway does not answer BYE.
