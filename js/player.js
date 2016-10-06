/********************
Variables
********************/

//Video
var video = document.getElementsByTagName("video")[0];

//Video container
var videoContainer = document.getElementById("video-container");

//Controls
var videoControlsLeft = document.getElementById("button-left"); /*used as an anchor for appending the timer element*/

  /*allButtons.style.visibility = "hidden"; /*controls are hidden by default*/

var playButton = document.getElementById("play-pause");
var speedButton = document.getElementById("playback-speed");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");
var volumeControl = document.getElementById("volume-control");
var captionsButton = document.getElementById("cc");

//Video timer
var timer = document.createElement("span");
timer.className = "timer";
timer.textContent = "";
videoControlsLeft.appendChild(timer);

//Transcript (***the code that creates the transcript object and makes the transcript clickable is here***)
var transcriptParagraph = document.getElementById("transcript");

  //return a node list
  var transcriptNodeList = transcriptParagraph.children;

  //turn the node list into an array containing objects that include the startTime property and the setVideoTime method
  var transcriptArray = [];

  for (var i = 0; i < transcriptNodeList.length; i++) {
    var transcriptSegment = {
      segmentSpan: transcriptNodeList[i],
      startTime: transcriptNodeList[i].getAttribute("data-start"),
      setVideoTime: function() {
        video.currentTime = this.startTime;
      }
    };
    transcriptArray.push(transcriptSegment);
  }

  //run a loop that binds a click event listener to each span element in the transcript paragraph
  for (var i = 0; i < transcriptArray.length; i++) {
    //the anonymous function gives the handler the i variable during each iteration
    (function(i) {
      transcriptArray[i].segmentSpan.onclick = function() {
        //call the setVideoTime method from the transcriptSegment object
        transcriptArray[i].setVideoTime();
      };
    })(i);
  }

//Progress bar
var progressBar = document.getElementById("progress-bar");
var clickArea = document.getElementById("progress-clickable");

//Captions
var captions = video.textTracks[0];
captions.mode = "hidden"; /*hide captions on page load */
var cues = captions.cues;

/********************
Methods
********************/

//Set progress bar width

function progressBarWidth() {
  progressBar.width = video.clientWidth;
}

//Move captions up above the progress bar
function positionCaptions(line) {
  for (var i = 0; i < cues.length; i++) {
    cues[i].line = (line);
  }
}

//Plays and pauses the video
function playPause() {
  if (video.paused === true) {
    //Play the video
    video.play();

    //Update the button icon to paused
    playButton.innerHTML = "<img src='icons/pause-icon.png' alt='Pause icon'>";
    } else {
    //Pause the video
    video.pause();

    //Update the button icon to play
    playButton.innerHTML = "<img src='icons/play-icon.png' alt='Play icon'>";
  }
}

//Changes the video speed and updates button
function setPlaybackRate(newRate) {
  video.playbackRate = newRate;
  speedButton.textContent = newRate + "x";
}

//Turns sound and off
function toggleMute() {
  if (video.muted === false) {
    //Mute the video
    video.muted = true;

    //Update the button icon to volume off
    muteButton.innerHTML = "<img src='icons/volume-off-icon.png' alt='Volume off icon'>";
  } else {
    //Unmute the video
    video.muted = false;

    //Update the button icon to volume on
    muteButton.innerHTML = "<img src='icons/volume-on-icon.png' alt='Volume on icon'>";
  }
}

//Toggles fullscreen
function toggleFullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); //Firefox
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen(); //Chrome and Safari
  }
}

//Shows and hides captions
function toggleCaptions() {
  if (captions.mode == "hidden") {
    captions.mode = "showing";
    captionsButton.innerHTML = "<img src='icons/cc-icon-orange.png' alt='Orange closed captioning icon'>";
  } else {
    captions.mode = "hidden";
    captionsButton.innerHTML = "<img src='icons/cc-icon-white.png' alt='White closed captioning icon'>";
  }
}

//Update progress bar with 1) time progress and 2) buffered content
function updateProgressBar() {
  //If the context identifier is supported
  if (progressBar.getContext) {

    //Establish context for canvas element
    var ctx = progressBar.getContext("2d");

    //Clear canvas before filling
    ctx.clearRect(0, 0, progressBar.clientWidth, progressBar.clientHeight);

    var buffered = video.buffered;

    var inc = progressBar.clientWidth / video.duration;

    ctx.fillStyle = "rgba(200, 200, 200,.6)";

    for (var i = 0; i < buffered.length; i++) {
      var startX = buffered.start(i) * inc;
      var endX = buffered.end(i) * inc;
      var width = endX - startX;

      ctx.fillRect(startX, 0, width, progressBar.clientHeight);
    }

    //Set fill style to selected color
    ctx.fillStyle = "rgb(255,148,0)";

    //Determine fill width based on current time
    var progressWidth = (video.currentTime / video.duration) * (progressBar.width);

    if (progressWidth > 0) {
      ctx.fillRect(0,0, progressWidth, progressBar.clientHeight);
    }
  }
}

//Jump to new video time based on click location



//Add and remove "highlight" class to transcript segments
function highlightTranscript() {
  for (var i = 0; i < transcriptArray.length; i++) {
    if (transcriptArray[i].startTime <= video.currentTime && video.currentTime < transcriptArray[i+1].startTime) {
      transcriptArray[i].segmentSpan.className = "highlight";
    } else {
      transcriptArray[i].segmentSpan.classList.remove("highlight");
    }
  }
}

//Convert seconds to 00:00:00 format for timer
function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

//Set the timer content
function displayTime() {
  displayCurrentTime = secondsToHms(video.currentTime);
  displayDuration = secondsToHms(video.duration);
  timer.textContent = displayCurrentTime + "/" + displayDuration;
}

/********************
Event Listeners
********************/

window.onload = progressBarWidth;
window.onresize = progressBarWidth;

/*** When Video is Ready ***/

video.addEventListener("canplay", function() {
  //position the captions
  positionCaptions(-3);
  //update the progress bar
  updateProgressBar();
  //display the video timer
  displayTime();
});

/*** Buttons ***/

//Click button to play/pause
playButton.addEventListener("click", playPause);

//Click button to adjust playback speed
speedButton.addEventListener("click", function() {
  if (video.playbackRate == 1) {
    setPlaybackRate(1.5);
  } else if (video.playbackRate == 1.5) {
    setPlaybackRate(2);
  }
  else {
    setPlaybackRate(1);
  }
});

//Click button to toggle mute
muteButton.addEventListener("click", toggleMute);

//Click button to toggle fullscreen
fullScreenButton.addEventListener("click", toggleFullScreen);

volumeControl.addEventListener("input", function() {
  video.volume = this.value;
});

//Click button to toggle captions
captionsButton.addEventListener("click", toggleCaptions);

/*** Progress Bar ***/

progressBar.addEventListener("mousedown", function() {

  //determine the position of the click relative to the canvas
  var rect = progressBar.getBoundingClientRect();
  progressX = event.clientX - rect.left;
  //calculate what time to jump to based on click
  var clickTime = (progressX / progressBar.width) * video.duration;
  //set video current time to clicktime
  video.currentTime = clickTime;
});

/*** As Video Plays ***/

//Update progress bar and highlight the transcript as video plays
video.addEventListener("timeupdate", function() {
  updateProgressBar();
  displayTime();
  highlightTranscript();
});
