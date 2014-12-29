var exec = require('child_process').exec;

exec('sudo shutdown -h now');

/*
var exec = require('child_process').exec;
exec('prince -v builds/pdf/book.html -o builds/pdf/book.pdf', function (error, stdout, stderr) {
  console.log(stdout);
});
*/
