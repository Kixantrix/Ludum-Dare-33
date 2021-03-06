'use strict';

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function CivilianShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.1;
	this.maxVel = 15;

	this.width = 120;
	this.height = 120;
	this.radius = 120 / 2;

	this.hp = 120;
	this.maxhp = 120;
	this.maxShields = 30;
	this.shields = 30;

	this.enemies = faction.enemies;

	this.image = this.faction.images['civilian'];

	this.name = faction.name + " " + "civilian " + num;

	this.weapon = null;

	this.destinationIndex = 0;
	this.destinations = this.faction.civilianRoute;
}

CivilianShip.prototype = Object.create(Ship.prototype);
CivilianShip.prototype.constructor = CivilianShip;

// Remove function
CivilianShip.prototype.remove = function() {
	this.faction.remove(this);
}

CivilianShip.prototype.update = function() {
	var destination = this.destinations[this.destinationIndex];
	var dx = destination.x - this.x;
	var dy = destination.y - this.y;
	var distanceToDestination = Math.abs(dx) + Math.abs(dy);

	this.regenShields();

	if (distanceToDestination < 400) {
		var stopped = Math.abs(this.velX) + Math.abs(this.velY) < 5;
		if (stopped) {
			// REACHED THE DESTINATION.

			this.destinationIndex += 1;
			this.destinationIndex %= this.destinations.length;

			destination = this.destinations[this.destinationIndex];

			dx = destination.x - this.x;
			dy = destination.y - this.y;
		}
	}

	this.turnTo(destination, function () {
		var decelerationX = -0.5 * Math.sin(this.angle);
		var decelerationY = 0.5 * Math.cos(this.angle);
		var finaldx = dx + this.velX * this.velX / decelerationX / 2;
		var finaldy = dy + this.velY * this.velY / decelerationY / 2;

		var dot = finaldx * decelerationX + finaldy * decelerationY;

		if (dot > 1) {
			this.thrust(-2);
		} else if (dot < -1) {
			this.thrust(1);
		} else if (dot > 0) {
			this.thrust(-0.5);
		}
	}.bind(this));


	if(!this.thrustApplied) {
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
	}

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
}
module.exports = CivilianShip;