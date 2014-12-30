var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

browser.on('serviceUp', function(service) {
  console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
  ondeviceup(service.addresses[0]);
  browser.stop();
});

browser.start();

function ondeviceup(host) {

  var client = new Client();

  client.connect(host, function() {
    client.launch(DefaultMediaReceiver, function(err, player) {
      var media = {
          // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
        contentId: 'http://192.168.1.3:1234/mystream.m3u8',  // 'http://104.167.97.77/hls/mystream.m3u8',
        contentType: 'application/vnd.apple.mpegurl', // 'application/x-mpegURL', //'video/mp2t',
        streamType: 'LIVE', // or BUFFERED

        metadata: {
          type: 0,
          metadataType: 0,
          title: "EriTV Live RPi", 
          images: [
            { url: 'http://104.167.97.77/static/eritv_logo.jpg' }
          ]
        }        
      };

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

