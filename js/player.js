/********************
Variables
********************/

//Video
var video = document.getElementsByTagName("video")[0];

//Video container
var videoContainer = document.getElementById("video-container");
//Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var fullScreenButton = document.getElementById("full-screen");

//Transcript
var transcriptParagraph = document.getElementById("transcript");

//return a node list
var transcriptNodeList = transcriptParagraph.children;

//turn the node list into an array containing objects that include the startTime property
var transcriptArray = [];

for (var i = 0; i < transcriptNodeList.length; i++) {
  var transcriptSegment = {
    segmentSpan: transcriptNodeList[i],
    startTime: transcriptNodeList[i].getAttribute("data-start"),
  };
  transcriptArray.push(transcriptSegment);
}

//Progress bar
var progressBar = document.getElementById("progress-bar");
var clickArea = document.getElementById("progress-clickable");
progressBar.width = videoContainer.offsetWidth;

/********************
Event Listeners for video interactivity
********************/

/*** Buttons ***/

//Event listener for the play/pause button
playButton.addEventListener("click", function() {
  if (video.paused == true) {
    //Play the video
    video.play();

    //Update the button icon to paused
    playButton.innerHTML = "<img src='icons/pause-icon.png'>";
  } else {
    //Pause the video
    video.pause();

    //Update the button icon to play
    playButton.innerHTML = "<img src='icons/play-icon.png'>";
  }
});

//Event listener for the mute button
muteButton.addEventListener("click", function() {
  if (video.muted == false) {
    //Mute the video
    video.muted = true;

    //Update the button icon to volume off
    muteButton.innerHTML = "<img src='icons/volume-off-icon.png'>";
  } else {
    //Unmute the video
    video.muted = false;

    //Update the button icon to volume on
    muteButton.innerHTML = "<img src='icons/volume-on-icon.png'>"
  }
});

//Event listener for the full-screen button
fullScreenButton.addEventListener("click", function() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); //Firefox
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen(); //Chrome and Safari
  }
});

/*** Progress Bar ***/

//Event listener for updating the progress bar with orange fill
video.addEventListener("timeupdate", function() {

  //If the context identifier is supported
  if (progressBar.getContext) {

    //Establish context for canvas element
    var ctx = progressBar.getContext("2d");

    //Clear canvas before filling
    ctx.clearRect(0, 0, progressBar.clientWidth, progressBar.clientHeight);

    //Set fill style to orange
    ctx.fillStyle = "rgb(255,148,0)";

    //Determine fill width based on current time
    var fillWidth = (video.currentTime / video.duration) * (progressBar.clientWidth);

    if (fillWidth > 0) {
      ctx.fillRect(0,0, fillWidth, progressBar.clientHeight);
    }
  }
});

//Event listener for jumping to new video location with progress bar click
clickArea.addEventListener("mousedown", function() {
  var progressX = event.pageX;
  var clickTime = (progressX / progressBar.clientWidth) * video.duration;
  video.currentTime = clickTime;
});

/*** Transcript ***/

//Event listener for highlighting the transcript as the video plays
video.addEventListener("timeupdate", function() {
  for (var i = 0; i < transcriptArray.length; i++) {
    if (transcriptArray[i].startTime <= video.currentTime && video.currentTime < transcriptArray[i+1].startTime) {
      transcriptArray[i].segmentSpan.className = "highlight";
    } else {
      transcriptArray[i].segmentSpan.classList.remove("highlight");
    }
  }
})
