const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const height = 1080;
const width = 1920;

// resize canvas (CSS does scale it up or down)
canvas.height = height;
canvas.width = width;

context.strokeStyle = 'red';

let drawing = false;
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
}

window.addEventListener("mousemove", draw);