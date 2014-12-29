var net = require('net');

net.createServer(function(socket){
    socket.on('data', function(data){
        //socket.write(data.toString());
        var key = 'terminal: ';
        if ( var a = data.indexOf(key) > -1) {
        	var payload = data.substring(a+key.length-1);
        	console.log(payload);
        }
    });
}).listen(4545);


// echo "terminal: " | nc localhost 4545