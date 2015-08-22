"use strict";

var Player = require('./player');
var Camera = require('./camera');
var Point = require('./point');
var Background = require('./background');
var Input = require('./input');

var canvas;
var ctx;
var camera;
var background;
window.paused = false;
var player;
var input;

// Dynamic resize of canvas
window.onload = function () {
	canvas = document.getElementById('game-canvas');
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 10;
	console.log(canvas);
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, 1, canvas);

	player = new Player(50, 50, camera, canvas);
    input = new Input(canvas);
    background = new Background();
};

// Dynamic resize of canvas
window.onresize = function() {
    if(window.innerWidth >= 500 && window.innerHeight >= 500) {
        canvas.width = window.innerWidth - 10;
        canvas.height = window.innerHeight - 10;    
    } else {
        canvas.width = 500;
        canvas.height = 500;
    }
};

var FPS = 30;
var step = 1000.0 / FPS
    // Draw Loop
    setInterval(function() {
    	if (window.paused) return;
      update();
      draw();
  }, step);

// Update information for 
function update() {
    player.update(input);
}

// Drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    drawBackground();
    drawChars();
}

// Draw background assets
function drawBackground() {
    /*
	for (var x = Math.floor(camera.left() / 40) * 40; x < camera.right(); x += 40) {
		ctx.moveTo.apply(ctx, camera.transform(x, camera.top()));
		ctx.lineTo.apply(ctx, camera.transform(x, camera.bottom()));
	}
	for (var y = Math.floor(camera.top() / 40) * 40; y < camera.bottom(); y += 40) {
		ctx.moveTo.apply(ctx, camera.transform(camera.left(), y));
		ctx.lineTo.apply(ctx, camera.transform(camera.right(), y));
	}
	ctx.strokeStyle = "#eee";
	ctx.stroke();
    */
    background.draw(camera, ctx);


}

// Draw characters
function drawChars() {
    player.draw(ctx, camera);
}
