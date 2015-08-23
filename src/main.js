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

var globals = require('./globals');

var boxSize = require('./variables').boxSize;

var canvas;
var ctx;

var objectBoxes = {};

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
    globals.camera = camera;

	player = new Player(50, 50, camera, canvas);
    ball = new Ball(200, 200);
    input = new Input(canvas);
    enemy = new Ship(500, 500, camera, canvas, "images/spaceships/alienspaceship.png");
    asteroid = new Asteroid(-300, -300, 32);
    background = new Background();
    asteroidField = new AsteroidField(1000, 1000, 2000, 150);
    asteroidRing = new AsteroidRing(-1000, -1000, 700, 900, 100);
    initializeObjectBoxes([player, ball, enemy, asteroid].concat(asteroidField.asteroids).concat(asteroidRing.asteroids));
};

function initializeObjectBoxes(objects) {
    for (var i = 0; i < objects.length; i++) {
        if (!objectBoxes[[objects[i].boxX, objects[i].boxY]])
            objectBoxes[[objects[i].boxX, objects[i].boxY]] = [];
        objectBoxes[[objects[i].boxX, objects[i].boxY]].push(objects[i]);
    }
}

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
            for (var boxX = -1; boxX < 2; boxX++) {
                for (var boxY = -1; boxY < 2; boxY++) {
                    var boxXnew = boxX + objects[i].boxX;
                    var boxYnew = boxY + objects[i].boxY;
                    if (!objectBoxes[[boxXnew, boxYnew]] ||
                        !objectBoxes[[boxXnew, boxYnew]].length) continue;
                    for (var j = 0; j < objectBoxes[[boxXnew, boxYnew]].length; j++) {
                        var object2 = objectBoxes[[boxXnew, boxYnew]][j];
                        var dx = object2.x - objects[i].x;
                        var dy = object2.y - objects[i].y;

                        var dvx = object2.velX - objects[i].velX;
                        var dvy = object2.velY - objects[i].velY;

                        var ri = objects[i].radius;
                        var rj = object2.radius;
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
                        //console.log(t, minT);
                        if (t > 1 || t <= 0) continue;
                        //if (t < 1 && t > 0)
                        //    console.log("THERE WILL BE A COLLISION");
                        if (t < minT) {
                            minT = t;
                            minObject1 = objects[i];
                            minObject2 = object2;
                        }
                    }
                }
            }
        }

        //console.log(minT, minObject1);

        if (minObject1) {
            moveObjects(objects, minT);
            currentT += minT;
            doReaction(minObject1, minObject2);
        } else {
            moveObjects(objects, 1 - currentT);
            currentT = 1;
        }
    }
}

function moveObjects(objects, t) {
    var oldBoxX, oldBoxY;
    for (var i = 0; i < objects.length; i++) {
        oldBoxX = objects[i].boxX;
        oldBoxY = objects[i].boxY;

        objects[i].x += objects[i].velX * t;
        objects[i].y += objects[i].velY * t;

        var newBoxX = Math.floor(objects[i].x / boxSize);
        var newBoxY = Math.floor(objects[i].y / boxSize);

        if (newBoxX !== oldBoxX || newBoxY !== oldBoxY) {
            var index = objectBoxes[[oldBoxX, oldBoxY]].indexOf(objects[i]);
            objectBoxes[[oldBoxX, oldBoxY]].splice(index, 1);
            if (objectBoxes[[oldBoxX, oldBoxY]].length === 0) {
                delete objectBoxes[[oldBoxX, oldBoxY]];
            }
            if (!objectBoxes[[newBoxX, newBoxY]])
                objectBoxes[[newBoxX, newBoxY]] = [];
            objectBoxes[[newBoxX, newBoxY]].push(objects[i]);
            objects[i].boxX = newBoxX;
            objects[i].boxY = newBoxY;
        }
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

    var totalMass = (object1.mass + object2.mass);

    object1.velX += (length) * dx * totalMass / object1.mass / 2;
    object1.velY += (length) * dy * totalMass / object1.mass / 2;
    object2.velX = vx1 + dvx - (length) * dx * totalMass / object2.mass / 2;
    object2.velY = vy1 + dvy - (length) * dy * totalMass / object2.mass / 2;

    if (object1.onCollide) object1.onCollide(object2);
    if (object2.onCollide) object2.onCollide(object1);
}

// Drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
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
