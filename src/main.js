"use strict";

var Player = require('./player');
var Ball = require('./ball');
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
var ball;
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
    ball = new Ball(200, 200);
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
    if (input.keys[27]) {//ESC
        paused = true;
    }
    player.update(input);

    doCollisions([player, ball]);
}

function doCollisions(objects) {
    for (var i = 0; i < objects.length; i++) {
        for (var j = i + 1; j < objects.length; j++) {
            var dx = objects[j].x - objects[i].x;
            var dy = objects[j].y - objects[i].y;

            var dvx = objects[j].velX - objects[i].velX;
            var dvy = objects[j].velY - objects[j].velY;

            var ri = objects[i].radius;
            var rj = objects[j].radius;
            var r = ri + rj;

            var b = 2 * (dvx * dx + dvy * dy);
            if (b > 0) {
                continue;
            }

            var a = (dvx * dvx + dvy * dvy);
            var c = (dx * dx + dy * dy - r * r);

            var discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                continue;
            }

            var t = (-b - Math.sqrt(discriminant)) / 2 / a;
            if (t < 1 && t > 0)
                console.log("THERE WILL BE A COLLISION");
        }
    }
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
    ball.draw(ctx, camera);
}
