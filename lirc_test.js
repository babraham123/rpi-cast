lirc_node = require('lirc_node');
lirc_node.init();

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);

/*
  Let's pretend that the output of lirc_node.remotes looks like this:

  {
    "tv": ["Power", "VolumeUp", "VolumeDown"],
    "xbox360": ["Power", "A", "B"]
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