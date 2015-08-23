'use strict';

function ProjectilePool() {
	this.projectiles = [];
}

ProjectilePool.prototype.addProjectile = function(projectile) {
	this.projectiles.push(projectile);
}

ProjectilePool.prototype.remove = function(projectile) {
	var index = this.projectiles.indexOf(projectile);
	this.projectiles.splice(index, 1);
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