"use strict";

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

	this.image = this.faction.images['civilian'];

	this.name = faction.name + " " + "civilian " + num;

	this.weapon = null;

}

module.exports = CivilianShip;