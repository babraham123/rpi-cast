rpi-cast
========

Project to build a universal IR transceiver (remote control) with
chromcasting capabilities using a raspberry pi.

The EriTV Project

Steps
1. take the eriTV rtmp live feed
3. convert rtmp to hls using the nginx rtmp module
4. wire gpio buttons and volume knob on raspberry pi
8. use node lib to connect to cast, listen to buttons, 
10. map buttons to correct actions, test
11. create sturdy, attractive RPi case
12. wire up IR receiver and blaster
13. record and forward living room remotes
14. configure lirc to echo msgs to socket on remote cmds, listen to socket

Design:
Raspberry Pi:
- read gpio button presses, de-bounce
- set media for chrome cast
- handle IR signals
Server:
- convert rtmp live stream

Hardware:
Circuit for input buttons
Safe shut down circuit
Diodes
Resistors
Buttons
Big enough case
Digital knob / up down buttons


