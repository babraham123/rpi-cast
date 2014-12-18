var gpio = require("pi-gpio");
var exec = require('child_process').exec;

gpio.open(4, "input");

gpio.read(4, function(err, value) {
    if(err) throw err;
    if(value) {
    	exec('sudo shutdown -h now');
    }
});

/*
var exec = require('child_process').exec;
exec('prince -v builds/pdf/book.html -o builds/pdf/book.pdf', function (error, stdout, stderr) {
  console.log(stdout);
});
*/
