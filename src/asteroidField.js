"use strict";

var Asteroid = require('./asteroid');

// Creates a field of astroids
function AsteroidField(x, y, size, num_asteroids) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.num_asteroids = num_asteroids;

	this.asteroids = [];

	for(var i = 0; i < num_asteroids; i++) {
		this.asteroids.push(new Asteroid(Math.abs(Math.random() * size) + this.x, Math.abs(Math.random() * size) + this.x, 10 + Math.abs(Math.random() * 100)));
	}
}	

AsteroidField.prototype.draw = function(ctx, canvas) {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].draw(ctx, canvas);
	}
};

AsteroidField.prototype.update = function() {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].update();
	}
};

module.exports = AsteroidField;