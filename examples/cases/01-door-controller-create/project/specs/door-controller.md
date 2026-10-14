# Door controller — functional specification

## 1. Purpose

The door controller opens and closes one access door of a laboratory. It runs on a small micro-controller board with a badge reader, a door motor, a lock and a jam sensor. Badges are checked by the central access server.

## 2. Start-up

After power-on the controller runs a self-test of the lock, the motor and the badge reader. When the self-test passes, the door is locked and the controller goes to the Locked state. When the self-test fails, the controller goes to the Fault state.

## 3. Normal operation

### 3.1 Opening

In the Locked state the controller waits for a badge. When a badge is presented, the badge reader sends the badge number to the controller. The controller asks the access server whether the badge is allowed. The server answers with "allow" or "deny".

On "allow" the controller releases the lock and starts the motor to open the door (Opening state). When the door is fully open, the motor stops and the controller is in the Open state.

On "deny" the controller stays in the Locked state and the badge reader shows a red light.

If the server does not answer within 2 seconds, the request is treated as "deny".

### 3.2 Closing

The door stays open for 10 seconds. Then the controller starts the motor to close the door (Closing state). When the door is fully closed, the lock is engaged and the controller returns to the Locked state.

### 3.3 Jam

The jam sensor reports when the door is blocked while it is moving.

## 4. Faults and safety

A hardware watchdog restarts the controller when the software stops responding.

In the Fault state the lock stays engaged and the motor is off. The controller reports the fault to the access server. Only a power-on restart leaves the Fault state.
