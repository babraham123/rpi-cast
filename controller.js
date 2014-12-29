// Controller for the Raspberry Pi portion of the RPiCast Project
// by Bereket Abraham

// send commands to receiver server with this bash cmd:
// echo "terminal:tv#power" | nc localhost 4545
// message = [source]:[destination]:[command/media type]


var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');
var lirc_node             = require('lirc_node');
var Gpio                  = require('onoff').Gpio;
var net                   = require('net');

var browser = null;
var status_pin = 4;
var btn_pin = 17;
var led = null;
var button = null;
var terminal_port = 4545;
var mediaList = {
  "eritv": {
    // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
    contentId: 'http://104.167.97.77/hls/mystream.m3u8',
    contentType: 'video/mp2t',   // application/vnd.apple.mpegurl
    streamType: 'LIVE', // or BUFFERED
    metadata: {
      type: 0,
      metadataType: 0,
      title: "EriTV Live", 
      images: [
        { url: 'http://104.167.97.77/static/eritv_logo.png' }
      ]
    }
  },
  "test": {
    contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    contentType: 'video/mp4',
    streamType: 'BUFFERED', // or LIVE
    metadata: {
      type: 0,
      metadataType: 0,
      title: "Big Buck Bunny", 
      images: [
        { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
      ]
    }
  }
}

function init() {
  lirc_node.init();
  console.log(lirc_node.remotes);

  browser = mdns.createBrowser(mdns.tcp('googlecast'));

  launchGpioPins();

  launchReceiverServer();
}

function exit() {
  led.unexport();
  button.unexport();
  process.exit();
}

function launchGpioPins() {
  //led = new Gpio(status_pin, 'out');
  button = new Gpio(btn_pin, 'in', 'falling', {persistentWatch: true, debounceTimeout: 300});
  button.watch(function(err, value) {
    if (err) { exit(); }
    //led.writeSync(value);
    console.log('Button value: ' + JSON.stringify(value));
    sendCommand('chromecast#eritv');
  });

  process.on('SIGINT', exit);
}

function sendCommand(message) {
  var client = net.connect({port: 4545}, function() { 
    client.write('app:' + message);
  });
}

function launchReceiverServer() {
  net.createServer( function(socket) {
    socket.on('data', function(data) {
      //socket.write(data.toString());
      data = splitMessage(data, ":");
      if(data && data.key) {
        console.log('message incoming from ' + data.key);
        generateTransmission(data.value);
      }
    });
  }).listen(terminal_port);
}

/* assume output of lirc_node.remotes:
  {
    "something_tv": ["Power", "VolumeUp", "VolumeDown", "Insert", "Mute"],
    "lg_dvd_player": ["Up", "Down", "Left", "Right", "Enter", "Menu", 
              "Play", "Pause", "Stop", "Rewind", "Forward"],
    "verizon_fios": ["Menu", "0-9", "Guide", "Last"]
  }
*/

function generateTransmission(message) {
  message = splitMessage(message, "#");
  var remote = message.key;
  var signal = message.value;
  if(remote === "chromecast") {
    if(signal in mediaList) {
      discoverAndLaunchService('cast_service_blah', mediaList[signal]);
    } else {
      console.log('No such media type for chromecast');
    }
  } else {
    lirc_node.irsend.send_once(remote, signal, function() {
      console.log("Send: " + remote + " : " + signal);
    });
  }
}

function splitMessage(message, split) {
  if ( var a = message.indexOf(split) > -1) {
    var kkey = message.substring(0, a + split.length - 1);
    var vvalue = message.substring(a + split.length);

    return {
      key: kkey,
      value: vvalue
    };
  } else {
    return null;
  }
}

function discoverAndLaunchService(serviceName, media) {
  browser.on('serviceUp', function(service) {
    console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);

    ondeviceup(service.addresses[0], media);
    browser.stop();
  });

  browser.start();
}

function ondeviceup(host, media) {
  var client = new Client();

  client.connect(host, function() {
    console.log('connected, launching app ...');

    client.launch(DefaultMediaReceiver, function(err, player) {
      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);
      });

      console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

      player.load(media, { autoplay: true }, function(err, status) {
        console.log('media loaded playerState=%s', status.playerState);
      });

    });

  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });

}

init();
