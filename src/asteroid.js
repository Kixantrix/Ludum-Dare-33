"use strict";

var Ball = require('./ball');
var globals = require('./globals');

function Asteroid(x, y, size, pool) {
	Ball.apply(this, [x, y]);

	this.width = size;
	this.height = size;
	this.radius = size / 2;

	this.mass = size;
	this.maxhp = size;
	this.hp = size;

	this.pool = pool;

	this.crashSound = new Audio("sounds/AsteroidCrash.wav");
	this.explodeSound = new Audio("sounds/AsteroidExplosion.wav");

	this.type = 'asteroid';
}

Asteroid.prototype = Object.create(Ball.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.explode = function() {
	this.pool.remove(this);

	var dx, dy;
	dx = Math.abs(this.x - globals.camera.center().x);
	dy = Math.abs(this.y - globals.camera.center().y);

	if (dx + dy < 100) {
		this.explodeSound.volume = 1;
	} else {
		this.explodeSound.volume = 100 / (dx + dy);
	}
	this.explodeSound.play();
}

Asteroid.prototype.onCollide = function(object) {
	var dx, dy;
	dx = Math.abs(this.x - globals.camera.center().x);
	dy = Math.abs(this.y - globals.camera.center().y);

	if (dx + dy < 100) {
		this.crashSound.volume = 1;
	} else {
		this.crashSound.volume = 100 / (dx + dy);
	}
	this.crashSound.play();
}

Asteroid.prototype.update = function() {
	if(this.velX < 0.1 && this.velX > -0.1) {
		this.velX = 0;
	} else {
		this.velX = this.velX * 0.99;
	}

	if(this.velY < 0.1 && this.velY > -0.1) {
		this.velY = 0;
	} else {
		this.velY = this.velY * 0.99;
	}

	if(this.rotation < 0.001 && this.rotation > -0.001) {
		this.rotation = 0;
	} else {
		this.rotation *= 0.99;
	}
	
	this.x += this.velX;
	this.y += this.velY;
	this.angle += this.rotation;
};

Asteroid.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'brown';
	ctx.fill();
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText(this.boxX + ", " + this.boxY, 0, 0);
	ctx.restore();
};

module.exports = Asteroid;