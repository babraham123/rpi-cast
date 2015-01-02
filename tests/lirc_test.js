var lirc_node = require('lirc_node');
var exec = require('child_process').exec;

lirc_node.init();

lirc_node.irsend.send_once("rpidvd", "KEY_PLAY", function() {
  console.log("Sent rpidvd cmd");
});

// To see all of the remotes and commands that LIRC knows about:
console.log(lirc_node.remotes);
var cmd = 'irsend LIST "" ""';
//cmd = 'pwd';

var proc = exec(cmd);
proc.stdout.setEncoding('utf8');
proc.stdout.on('data', function (chunk) {
    console.log(chunk);
});
