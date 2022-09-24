const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const height = 1080;
const width = 1920;

canvas.height = height;
canvas.width = width;

context.strokeStyle = 'yellow';
context.lineWidth = 3;

let drawing = false;
let objectStack = [];
var startX = -1.0;
var startY = -1.0;

let canvasBackgroundImage = undefined;

function getMousePos(canvas, evt, normalized=false) {
    var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;

    if (!normalized) {
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }
    else {
        return {
            x: (evt.clientX - rect.left),
            y: (evt.clientY - rect.top)
        }
    }
}

function startDrawing(e) {
    drawing = true;
    context.beginPath();

    let { x, y } = getMousePos(canvas, e);
    startX = x;
    startY = y;
}

window.addEventListener("mousedown", startDrawing);

function endDrawing(e) {
    drawing = false;

    let { x, y } = getMousePos(canvas, e);
    objectStack.push(new Object(startX, startY, x-startX, y-startY));
}

window.addEventListener("mouseup", endDrawing);

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawFrame(x1, y1, x2, y2) {
    drawLine(x1, y1, x2, y1); // top
    drawLine(x2, y1, x2, y2); // right
    drawLine(x1, y2, x2, y2); // bottom
    drawLine(x1 , y1, x1, y2); // left
}

function refreshCanvas() {
    context.drawImage(canvasBackgroundImage, 0, 0);
    for (let i =0; i < objectStack.length; i++) {
        let [x, y, w, h] = objectStack[i].getPos();
        drawFrame(x, y, x+w, y+h);
    }
}

function draw(e) {
    if (!drawing) return;
    let { x, y } = getMousePos(canvas, e);
    refreshCanvas();
    drawFrame(startX, startY, x, y);
}

window.addEventListener("mousemove", draw);

class Object {
    constructor(x, y, w, h) {
        this.x = x; // starting x point
        this.y = y; // starting y point
        this.w = w; // width of rectangle
        this.h = h; // height of rectangle
        this.class = "noClassSelected";
        this.createdTimestamp = Date.now();
    }

    getPos() {
        return [this.x, this.y, this.w, this.h];
    }

    logInfo() {
        console.log("Object: x:"+ this.x + "y:" + this.y);
    }

    healthCheck() {
        console.log("Object healthy.");
    }
}

function getVideoImage(path, secs, callback) {
    var me = this, video = document.createElement('video');
    video.onloadedmetadata = function() {
        if ('function' === typeof secs) {
            secs = secs(this.duration);
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    };
    video.onseeked = function(e) {
        var canvas = document.createElement('canvas');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.src = canvas.toDataURL();
        console.log("Video callback success");
        callback.call(me, img, this.currentTime, e);

    };
    video.onerror = function(e) {
        console.log("Video callback error");
        callback.call(me, undefined, undefined, e);
    };
    video.src = path;
}

function getVideoImageCallback(img, t, e) {
    canvasBackgroundImage = img;
}

let sampleVideoPath = "../testVideo/unamed_cam_1/DSCF0013.AVI";
getVideoImage(sampleVideoPath, 0.1, getVideoImageCallback);