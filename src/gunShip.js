"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function GunShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.2;
	this.width = 250;
	this.height = 250;
	this.radius = 125;

	this.hp = 300;
	this.maxhp = 300;
	this.maxShields = 100;
	this.shields = 100;

	this.image = this.faction.images['gunShip'];

	this.name = faction.name + " " + "gunShip " + num;

	this.weapon = new Weapon(50, 60, 20);

	this.enemies = faction.enemies;

}

GunShip.prototype = Object.create(Ship.prototype);
GunShip.prototype.constructor = GunShip;

module.exports = GunShip;