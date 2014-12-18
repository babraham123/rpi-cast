// Controller for the Raspberry Pi portion of the RPiCast Project
// by Bereket Abraham

var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');
var gpio                  = require('pi-gpio');
var lirc_node             = require('lirc_node');

var browser = null;
var status_pin = 16;
var btn1 = 15;
var media = {
    // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
  contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
  contentType: 'video/mp4',
  streamType: 'BUFFERED', // or LIVE
  // Title and cover displayed while buffering
  metadata: {
    type: 0,
    metadataType: 0,
    title: "Big Buck Bunny", 
    images: [
      { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
    ]
  }        
};

function init() {
  lirc_node.init();
  browser = mdns.createBrowser(mdns.tcp('googlecast'));

  gpio.open(status_pin, "output", function(err) {
    gpio.write(status_pin, 1);
  });

  gpio.open(btn1, "input");

}

function discovery() {
  browser.on('serviceUp', function(service) {
    console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
    ondeviceup(service.addresses[0]);
    browser.stop();
  });

  browser.start();
}

function ondeviceup(host) {
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
        // Seek to 2 minutes after 15 seconds playing.
        setTimeout(function() {
          player.seek(2*60, function(err, status) {
            //
          });
        }, 15000);

      });

    });

  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });

}

