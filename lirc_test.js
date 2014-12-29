lirc_node = require('lirc_node');
lirc_node.init();

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);

/*
  Let's pretend that the output of lirc_node.remotes looks like this:

  {
    "something_tv": ["Power", "VolumeUp", "VolumeDown", "Insert"],
    "lg_dvd_player": ["Up", "Down", "Left", "Right", "Enter", "Menu", 
    				  "Play", "Pause", "Stop", "Rewind", "Forward"],
    "verizon_fios": ["Menu", "0-9", "Guide", "Last"]
  }
*/

// Tell the TV to turn on
lirc_node.irsend.send_once("tv", "power", function() {
  console.log("Sent TV power command!");
});

// Tell the Xbox360 to turn on
lirc_node.irsend.send_once("xbox360", "power", function() {
  console.log("Sent Xbox360 power command!");
});