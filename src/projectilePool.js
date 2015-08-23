'use strict';

var objectBoxes = require('./objectBoxes');

function ProjectilePool() {
	this.projectiles = [];
}

ProjectilePool.prototype.addProjectile = function(projectile) {
	this.projectiles.push(projectile);
	objectBoxes.addObject(projectile);
}

ProjectilePool.prototype.remove = function(projectile) {
	var index = this.projectiles.indexOf(projectile);
	this.projectiles.splice(index, 1);
	objectBoxes.removeObject(projectile);
}

ProjectilePool.prototype.draw = function (ctx, camera) {
	for (var i = 0; i < this.projectiles.length; i++) {
		this.projectiles[i].draw(ctx, camera);
	}
}

ProjectilePool.prototype.update = function(input) {
	for (var i = 0; i < this.projectiles.length; i++) {
		this.projectiles[i].update(input);
	}
};

module.exports = ProjectilePool;