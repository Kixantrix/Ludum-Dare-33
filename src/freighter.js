"use strict":

var Ship = require('./ship');
var globals = require('./globals');

function freighterShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""])
	this.faction = faction;

	this.maxRotationSpeed = 0.05;
	this.maxVel = 12;

	this.width = 300;
	this.height = 300;
	this.radius = 150;

	this.hp = 500;
	this.maxhp = 500;
	this.maxShields = 100;
	this.shields = 100;

	this.image = this.faction.images['freighter'];

	this.name = faction.name + " " + "freighter " + num;

	this.weapon = null;

}

module.exports = FreighterShip;