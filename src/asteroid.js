"use strict";

var Ball = require('./ball');

function Asteroid(x, y, size) {
	Ball.apply(this, [x, y]);
	this.x = x;
	this.y = y;
	this.angle = 0;

	this.velX = 0;
	this.velY = 0;

	this.rotation = 0;

	this.width = size;
	this.height = size;
	this.radius = size / 2;
}

Asteroid.prototype = Object.create(Ball.prototype);
Asteroid.prototype.constructor = Asteroid;

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