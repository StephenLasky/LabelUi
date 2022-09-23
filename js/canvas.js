const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const height = 1080;
const width = 1920;

// resize canvas (CSS does scale it up or down)
canvas.height = height;
canvas.width = width;

context.strokeStyle = 'red';

let drawing = false;
let objectStack = [];
var startX = -1.0;
var startY = -1.0;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;

    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
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

function draw(e) {
    if (!drawing) return;

    let { x, y } = getMousePos(canvas, e);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(startX, startY, x, y);

    for (let i =0; i < objectStack.length; i++) {
        let [x, y, w, h] = objectStack[i].getPos();
        drawFrame(x, y, x+w, y+h);
    }
}

window.addEventListener("mousemove", draw);

class Object {
    constructor(x, y, w, h) {
        this.x = x; // starting x point
        this.y = y; // starting y point
        this.w = w; // width of rectangle
        this.h = h; // height of rectangle
        this.class = "noClassSelected";
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