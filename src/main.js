"use strict";

var Player = require('./player');
var Ball = require('./ball');
var Camera = require('./camera');
var Point = require('./point')['Point'];
var Background = require('./background');
var Input = require('./input');
var Ship = require('./ship');
var Asteroid = require('./asteroid');
var AsteroidField = require('./asteroidField');
var AsteroidRing = require('./asteroidRing');

var canvas;
var ctx;
var camera;
var background;
window.paused = false;
var player;
var enemy;
var ball;
var input;
var asteroid;
var asteroidField;
var asteroidRing;

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
    enemy = new Ship(500, 500, camera, canvas, "images/spaceships/alienspaceship.png");
    asteroid = new Asteroid(-300, -300, 32);
    background = new Background();
    asteroidField = new AsteroidField(1000, 1000, 2000, 150);
    asteroidRing = new AsteroidRing(-1000, -1000, 700, 900, 100);
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
    var objects = [player, ball, enemy, asteroid]
    objects = objects.concat(asteroidField.asteroids);
    objects = objects.concat(asteroidRing.asteroids);
    player.update(input);
    enemy.update(objects);
    asteroid.update();
    asteroidField.update();
    asteroidRing.update();
    doCollisions(objects);
}

function doCollisions(objects) {
    var currentT = 0;
    var minT;
    var minObject1, minObject2;
    while (currentT < 1) {
        minT = 1 - currentT;
        minObject1 = undefined;
        minObject2 = undefined;
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
                if (t > 1 || t <= 0) continue;
                //if (t < 1 && t > 0)
                //    console.log("THERE WILL BE A COLLISION");
                if (t < minT) {
                    minT = t;
                    minObject1 = objects[i];
                    minObject2 = objects[j];
                }
            }
        }

        console.log(minT, minObject1);

        if (minObject1) {
            moveObjects(objects, minT);
            currentT += minT;
            doReaction(minObject1, minObject2);
        } else {
            moveObjects(objects, 1 - currentT);
            currentT += minT;
        }
    }
}

function moveObjects(objects, t) {
    for (var i = 0; i < objects.length; i++) {
        objects[i].x += objects[i].velX * t;
        objects[i].y += objects[i].velY * t;
    }
}

function doReaction(object1, object2) {
    var dx = object2.x - object1.x;
    var dy = object2.y - object1.y;

    var dvx = object2.velX - object1.velX;
    var dvy = object2.velY - object1.velY;

    var vx1 = object1.velX;
    var vy1 = object1.velY;

    var length = (dvx * dx + dvy * dy);
    length /= (dx * dx + dy * dy);

    object1.velX += (length) * dx;
    object1.velY += (length) * dy;
    object2.velX = vx1 + dvx - (length) * dx;
    object2.velY = vy1 + dvy - (length) * dy;
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
    enemy.draw(ctx, camera);
    asteroid.draw(ctx, camera);
    asteroidField.draw(ctx, camera);
    asteroidRing.draw(ctx, camera);
}
