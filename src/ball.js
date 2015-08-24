'use strict';

var boxSize = require('./variables').boxSize;

function Ball(x, y) {
	this.x = x;
	this.y = y;

	this.boxX = Math.floor(x / boxSize);
	this.boxY = Math.floor(y / boxSize);

	this.angle = 0;

	this.velX = 0;
	this.velY = 0;
	this.rotation = 0;

	this.width = 64;
	this.height = 64;
	this.radius = 32;

	this.mass = 32;
	this.maxhp = 32;
	this.hp = 32;
}

Ball.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.restore();
};

Ball.prototype.onHit = function(damage, source) {
	
}

module.exports = Ball;