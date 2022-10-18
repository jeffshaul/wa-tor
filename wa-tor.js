var intervalId;
var isPaused;

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function tick(sea) {
    sea.tick();
    sea.draw();
}

function play() {
    var sea = new Sea(seaCanvas.width, seaCanvas.height);
    sea.generate();
    sea.draw();
    clearInterval(intervalId);
    intervalId = setInterval(tick, 1, sea);
}
