'use strict';

var Ball = require('./ball');

function Projectile(x, y, velX, velY, pool, origin, damage) {
	Ball.apply(this, [x, y]);
	this.velX = velX;
	this.velY = velY;
	this.radius = 8;
	this.width = 16;
	this.height = 16;
	this.origin = origin;
	this.mass = 2;
	this.damage = damage;

	this.pool = pool;
	this.pool.addProjectile(this);

	this.type = 'projectile';
}

Projectile.prototype = Object.create(Ball.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.onCollide = function(object) {
	object.onHit(this.damage, this.origin);
	this.remove();
}

Projectile.prototype.remove = function() {
	this.pool.remove(this);
}

module.exports = Projectile;