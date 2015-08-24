"use strict":

var Ship = require('./ship');
var globals = require('./globals');

function fighterShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""])
	this.faction = faction;

	this.maxRotationSpeed = 0.4;
	this.width = 90;
	this.height = 90;
	this.radius = 90 / 2;

	this.hp = 90;
	this.maxhp = 90;
	this.maxShields = 30;
	this.shields = 30;

	this.image = this.faction.images['fighter'];

	this.name = faction.name + " " + "fighter " + num;

	this.weapon = new Weapon(20, 15, 40);

}

module.exports = FighterShip;