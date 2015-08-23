"use strict";

var AsteroidRing = require('./asteroidRing');
var Ball = require('./ball');

function Planet(x, y, radius, src, hasRing) {
	Ball.apply(this, [x, y]);
	this.radius = radius;
	this.src = src;
	this.hasRing = hasRing;
	if(this.hasRing) {
		this.ring = new AsteroidRing(this.x, this.y, this.radius + 100, this.radius + Math.floor(Math.random() * 300), this.radius / 5)
	}

	this.image = new Image();
	this.image.src = this.src;

	this.factions = {};
	this.factions["neutral"] = true;
}

Planet.prototype = Object.create(Ball.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.draw = function(ctx, canvas) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height	);
	ctx.restore();

	this.asteroidRing.draw(ctx, canvas);
};

module.exports = Planet;