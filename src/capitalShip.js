"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function CapitalShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.05;
	this.width = 500;
	this.height = 500;
	this.radius = 250;

	this.hp = 1000;
	this.maxhp = 1000;
	this.maxShields = 500;
	this.shields = 500;

	this.image = this.faction.images['captialShip'];

	this.name = faction.name + " " + "captialShip " + num;

	this.weapon = new Weapon(100, 150, 20);

}

module.exports = CapitalShip;