var net = require('net');

net.createServer(function(socket){
    socket.on('data', function(data){
        data = data.toString();
        var key = 'terminal: ';
        var a = data.indexOf(key);
        if (a > -1) {
        	var payload = data.substring(a+key.length-1);
        	console.log(payload);
        }
    });
}).listen(4545);


// echo "terminal: " | nc localhost 4545
