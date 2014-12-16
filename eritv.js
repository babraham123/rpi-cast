// Chromecast app
// Bereket Abraham

// global variables
var currentMedia = null;
var currentVolume = 0.5;
var progressFlag = 1;
var mediaCurrentTime = 0;
var session = null;
var storedSession = null;
var mediaURLs = ['rtmp://173.192.70.133:1935/live'];
var mediaTitles = ['EriTV Live'];
var mediaThumbs = ['/static/eritv_logo.png'];
var currentMediaURL = mediaURLs[0];
var currentMediaTitle = mediaTitles[0];
var currentMediaThumb = mediaThumbs[0];

function stopApp() {
  if (session) {
    session.stop(onSuccess, onError);
  }
}

function startApp() {
  console.log('starting app...');
  chrome.cast.requestSession(onRequestSessionSuccess, onError);
}

function playResumeMedia() { 
  currentMedia.play(null, onSuccess, onError);
}
function pauseMedia() { 
  currentMedia.pause(null, onSuccess, onError);
}
function stopMedia() { 
  currentMedia.stop(null, onSuccess, onError);
}
function seekMedia() { 
  currentMedia.seek(null, onSuccess, onError);
}


// check if cast lib is available
window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
  if (loaded) {
    initializeCastApi();
  } else {
    console.log(JSON.stringify(errorInfo));
  }
}
// initialize
initializeCastApi = function() {
  //var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var sessionRequest = new chrome.cast.SessionRequest(
                   chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener,
    chrome.cast.AutoJoinPolicy.PAGE_SCOPED);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

function receiverListener(e) {
  if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
    console.log('cast devices are available on network');
  }
}

function onInitSuccess() {
  console.log('Init success');

  // check if a session ID is saved into localStorage
  storedSession = JSON.parse(localStorage.getItem('storedSession'));
  if (storedSession) {
    var dateString = storedSession.timestamp;
    var now = new Date().getTime();
    console.log((now - dateString));
    // to timeout stored sessions
  }
}
function onError(e) {
  console.log('error: ' + JSON.stringify(e));
}
function onSuccess(message) {
  console.log(JSON.stringify(message));
}
// to connect to cast, user must select device from chromsecast extension
//      or use existing session

// new session
function onRequestSessionSuccess(e) {
  session = e;
  console.log(JSON.stringify(session));
  saveSessionID(session.sessionId);

  loadMediaUrl();
}

// existing session 
function sessionListener(e) {
  session = e;
  console.log('New session ID: ' + session.sessionId);
  if (session.media.length != 0) {
    onMediaDiscovered('onRequestSessionSuccess', session.media[0]);
  }
  console.log(JSON.stringify(session));
  saveSessionID(session.sessionId);

}
function onMediaDiscovered(how, media) {
  currentMedia = media;
  currentMedia.addUpdateListener(onMediaStatusUpdate);
  mediaCurrentTime = currentMedia.currentTime;

  console.log('Media play state: ' + currentMedia.playerState);
  console.log(JSON.stringify(currentMedia));
}
function onMediaStatusUpdate() {
  if(session) {
    console.log("Update occurred: " + session.status);
  }
}

/*
value="config={"clip":{"url":"myStream","live":true,"provider":"rtmp"},
"plugins":{"controls":{"autoHide":"never"},
"rtmp":{"url":"flowplayer.rtmp-3.2.8.swf","netConnectionUrl":
"rtmp://173.192.70.133:1935/live"}},"playerId":"player",
"playlist":[{"url":"myStream","live":true,"provider":"rtmp"}]}"
*/

function loadMediaUrl() {
  if (!session) {
    console.log('no session');
    return;
  }

  console.log("Media url: " + currentMediaURL);

  var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL);
  /*
  mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
  mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
  mediaInfo.contentType = 'video/mp4';

  mediaInfo.metadata.title = currentMediaTitle;
  mediaInfo.metadata.images = [{'url': currentMediaThumb}];
  */

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;
  request.currentTime = 0;

  session.loadMedia(request,
    onMediaDiscovered.bind(this, 'loadMedia'),
    onError);
}

function saveSessionID(sessionId) {
  // Check browser support of localStorage
  if (typeof(Storage) != 'undefined') {
    // Store sessionId and timestamp into an object
    var object = {id: sessionId, timestamp: new Date().getTime()};
    localStorage.setItem('storedSession', JSON.stringify(object));
  }
}

function joinSessionBySessionId() {
  if (storedSession) {
    appendMessage(
        'Found stored session id: ' + storedSession.id);
    chrome.cast.requestSessionById(storedSession.id);
  }
}

// level = number, mute = true/false
function setMediaVolume(level, mute) {
  if (!currentMediaSession)
    return;

  var volume = new chrome.cast.Volume();
  volume.level = level;
  currentVolume = volume.level;
  volume.muted = mute;
  var request = new chrome.cast.media.VolumeRequest();
  request.volume = volume;
  currentMediaSession.setVolume(request,
    mediaCommandSuccessCallback.bind(this, 'media set-volume done'),
    onError);
}
function mediaCommandSuccessCallback(info) {
  console.log(JSON.stringify(info));
}


