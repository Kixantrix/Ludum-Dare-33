"use strict";

var Asteroid = require('./asteroid');
var objectBoxes = require('./objectBoxes');

// Creates a field of astroids
function AsteroidRing(x, y, innerRadius, outerRadius, num_asteroids) {
	this.x = x;
	this.y = y;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.num_asteroids = num_asteroids;

	this.asteroids = [];

	for(var i = 0; i < num_asteroids; i++) {
		var angle = Math.random() * 2 * Math.PI;
		var radius = Math.random() * (this.outerRadius - this.innerRadius);
		this.asteroids.push(new Asteroid(Math.floor((radius + innerRadius) * Math.cos(angle) + this.x), 
			Math.floor((radius + innerRadius) * Math.sin(angle) + this.y), 10 + Math.abs(Math.random() * 100), this));
	}
}	

AsteroidRing.prototype.remove = function(asteroid) {
	var indexOf = this.asteroids.indexOf(asteroid);
	this.asteroids.splice(indexOf, 1);
	objectBoxes.removeObject(asteroid);
}

AsteroidRing.prototype.draw = function(ctx, canvas) {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].draw(ctx, canvas);
	}
};

AsteroidRing.prototype.update = function() {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].update();
	}
};

module.exports = AsteroidRing;