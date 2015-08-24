"use strict";

var Asteroid = require('./asteroid');
var objectBoxes = require('./objectBoxes');

// Creates a field of astroids
function AsteroidField(x, y, size, num_asteroids) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.num_asteroids = num_asteroids;

	this.asteroids = [];

	for(var i = 0; i < num_asteroids; i++) {
		this.asteroids.push(new Asteroid(Math.abs(Math.random() * size) + this.x, Math.abs(Math.random() * size) + this.y, 10 + Math.abs(Math.random() * 100), this));
	}
}	

AsteroidField.prototype.remove = function(asteroid) {
	var indexOf = this.asteroids.indexOf(asteroid);
	this.asteroids.splice(indexOf, 1);
	objectBoxes.removeObject(asteroid);
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