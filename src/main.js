"use strict";

// Object imports
var Player = require('./player');
var Ball = require('./ball');
var Camera = require('./camera');
var Point = require('./point')['Point'];
var Background = require('./background');
var Input = require('./input');
var Asteroid = require('./asteroid');
var AsteroidField = require('./asteroidField');
var AsteroidRing = require('./asteroidRing');
var Planet = require('./planet');
var Faction = require('./faction');
var factionInfo = require('./factionInfo');

// Globals import
var globals = require('./globals');

// Variables import
var boxSize = require('./variables').boxSize;

// Drawing tools
var canvas;
var ctx;

var objectBoxes = require('./objectBoxes');
var CivilianShip = require('./civilianShip');

// Variables for global objects
var camera;
var miniMapCamera;
var background;
window.paused = false;
var player;
var input;
var asteroidField;
var asteroidRing;
var planets;
var projectilePool;
var factions;

// On load/constructor for game
window.onload = function () {
    window.globals = globals;
	canvas = document.getElementById('game-canvas');
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 10;
	console.log(canvas);
	ctx = canvas.getContext("2d");

    // Initialize variables and environment
	camera = new Camera(0, 0, 1, canvas);
    globals.camera = camera;
    miniMapCamera = new Camera(0, 0, 10);
    global.miniMapCamera = miniMapCamera;
    globals.canvas = canvas;

	player = new Player(50, 50, camera, canvas);
    input = new Input(canvas);

    background = new Background();
    asteroidField = new AsteroidField(-10000, -15000, 2000, 150);
    asteroidRing = new AsteroidRing(10000, 15000, 700, 900, 100);
    factions = [];
    planets = [];    
    for(name in factionInfo) {
        var faction = new Faction(name);
        factions.push(faction);
        planets.push(faction.basePlanet);
    }
    /*
    planets.push(new Planet(-4000, 0, 500, "images/planets/greenplanet.png", false)); 
    planets.push(new Planet(-2000, 500, 750, "images/planets/p1shaded.png", true));
    planets.push(new Planet(1000, 3000, 300, "images/planets/p2shaded.png", false));
    planets.push(new Planet(2000, 1700, 600, "images/planets/p3shaded.png", true));
    planets.push(new Planet(1500, -1500, 950, "images/planets/p4shaded.png", false));
    */
    var box = [player].concat(asteroidField.asteroids).concat(asteroidRing.asteroids);
    
    for(var i = 0; i < planets.length; i++) {
        box = box.concat(planets[i].getAsteroids());
    }

    for(var i = 0; i < factions.length; i++) {
        box = box.concat(factions[i].ships);
    }

    var ProjectilePool = require('./projectilePool');
    projectilePool = new ProjectilePool();
    globals.projectilePool = projectilePool;
    box.concat(projectilePool.projectiles);
    initializeObjectBoxes(box);

    globals.objectBoxes = objectBoxes;
    globals.frameCount = 0;
};

// Initializes collision boxes for objects in scenario
function initializeObjectBoxes(objects) {
    for (var i = 0; i < objects.length; i++) {
        objectBoxes.addObject(objects[i]);
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

// Update information for each object and running collisions.
function update() {
    if (input.keys[27]) {//ESC
        paused = true;
    }

    globals.frameCount++;

    var objects = [player]
    objects = objects.concat(asteroidField.asteroids);
    objects = objects.concat(asteroidRing.asteroids);
    objects = objects.concat(projectilePool.projectiles);
    for(var i = 0; i < planets.length; i++) {
        objects = objects.concat(planets[i].getAsteroids());
    }
    for(var i = 0; i < factions.length; i++) {
        objects = objects.concat(factions[i].ships);
    }

    player.update(input);
    for(var i = 0; i < factions.length; i++) {
        factions[i].update(objects);
    }
    asteroidField.update();
    asteroidRing.update();
    doCollisions(objects);
}

// Checks for collisions between objects. If they exist, completes momentum transfers.
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

// Moves objects, resorting boxes and adjucting things.
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
            objectBoxes.removeObject(objects[i]);
            objects[i].boxX = newBoxX;
            objects[i].boxY = newBoxY;
            objectBoxes.addObject(objects[i]);
        }
    }
}

// Collision between two objects
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

    object1.velX += (length) * dx * object2.mass / totalMass * 2;
    object1.velY += (length) * dy * object2.mass / totalMass * 2;
    object2.velX = vx1 + dvx - (length) * dx * object1.mass / totalMass * 2;
    object2.velY = vy1 + dvy - (length) * dy * object1.mass / totalMass * 2;

    if (object1.onCollide) object1.onCollide(object2);
    if (object2.onCollide) object2.onCollide(object1);
}

// Drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(input.keys[77]) {
        drawMiniMap()
    } else {
        drawBackground();
        drawChars();
    }
    
}

// Draw background assets
function drawBackground() {
    background.draw(camera, ctx);

    for(var i = 0; i < planets.length; i++) {
        planets[i].draw(ctx, camera);
    }
    
    asteroidField.draw(ctx, camera);
    asteroidRing.draw(ctx, camera);
}

// Draw characters
function drawChars() {
    projectilePool.draw(ctx, camera);
    for(var i = 0; i < factions.length; i++) {
        factions[i].drawShips(ctx, camera);
    }
    player.draw(ctx, camera);
}

function drawMiniMap() {
    miniMapCamera.x = camera.x * camera.z / miniMapCamera.z + canvas.width / 2;
    miniMapCamera.y = camera.y * camera.z / miniMapCamera.z + canvas.height / 2;

    for(var i = 0; i < planets.length; i++) {
        planets[i].draw(ctx, miniMapCamera);
    }
    
    asteroidField.draw(ctx, miniMapCamera);
    asteroidRing.draw(ctx, miniMapCamera);

    for(var i = 0; i < factions.length; i++) {
        factions[i].drawShips(ctx, miniMapCamera);
    }
    projectilePool.draw(ctx, miniMapCamera);
    player.draw(ctx, miniMapCamera);
}
