"use strict";

var Projectile = require('./projectile');
var globals = require('./globals');

function Weapon(damage, rof, speed) {
	// 10 Damage per shot
	this.damage = damage;

	// 5 Wait frames between shots
	this.rof = rof;

	// Last frame shot was fired initiated to negative
	this.lastFire = -1000;

	this.speed = speed;
}

// Shoots a projectile from the gun if cooldown is over.
Weapon.prototype.fire = function(origin) {
	if((globals.frameCount - this.lastFire) > this.rof) {
		this.lastFire = globals.frameCount;
		new Projectile(origin.x, origin.y,
			Math.sin(origin.angle) * this.speed + origin.velX,
			 -Math.cos(origin.angle) * this.speed + origin.velY,
			  globals.projectilePool);
	}
}

module.exports = Weapon;