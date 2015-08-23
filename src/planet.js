"use strict";

var AsteroidRing = require('./asteroidRing');
var Ball = require('./ball');

function Planet(x, y, radius, src, hasRing) {
	Ball.apply(this, [x, y]);
	this.radius = radius;
	this.src = src;
	this.hasRing = hasRing;
	if(this.hasRing) {
		this.ring = new AsteroidRing(this.x, this.y, this.radius + 100, this.radius + Math.floor(Math.random() * 300), this.radius / 30);
	}

	this.image = new Image();
	this.image.src = this.src;

	this.factions = {};
	this.factions["neutral"] = true;
}

Planet.prototype = Object.create(Ball.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.getAsteroids = function() {
	var asteroids = [];
	if(this.hasRing) {
		asteroids = asteroids.concat(this.ring.asteroids);
	}
	return asteroids;
}

Planet.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.radius / 2, -this.radius / 2, this.radius, this.radius);
	ctx.restore();

	if(this.hasRing) {
		this.ring.draw(ctx, camera);
	}
	
};

module.exports = Planet;