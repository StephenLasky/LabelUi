function playVideo() {
    var videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.play();
}

function pauseVideo() {
    var videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.pause();
}

function restartVideo() {
    var videoPlayer = document.getElementById("videoPlayer");

    videoPlayer.currentTime = 0;
}

function changeVideoPlaybackSpeed(speed) {
    var videoPlayer = document.getElementById("videoPlayer");

    console.log("Changing video speed to " + speed);
    videoPlayer.playbackRate = speed;
}