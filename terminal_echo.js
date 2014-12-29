var net = require('net');
var client = net.connect({port: 4545}, function() { 
    client.write('terminal:' + process.argv[2]);
});