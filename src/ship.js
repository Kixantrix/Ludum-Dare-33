"use strict";

function enemyShip(x, y, camera, canvas, src) {
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.camera = camera;
	this.canvas = canvas;

	this.velX = 0;
	this.velY = 0;
	this.rotation = 0;

	this.image = new Image();
	this.image.src = src;
	this.width = 64;
	this.height = 64;
}

Player.prototype.thrust = function(accel) {
	this.velX += Math.sin(this.angle) * accel;
	this.velY -= Math.cos(this.angle) * accel;
}

Player.prototype.thrustAccel = function(accel) {
	this.rotation += accel;
}

Player.prototype.update = function(input) {
	if (input.keys[68]) {//D
		this.thrustAccel(0.01);
	}
	if (input.keys[65]) {//A
		this.thrustAccel(-0.01);
	}
	if (input.keys[87]) {//W
		this.thrust(1)
	}
	if (input.keys[83]) {//S
		this.thrust(-1);
	}

	this.x += this.velX;
	this.y += this.velY;
	this.angle += this.rotation;

	this.camera.x = -(this.x - this.canvas.width / 2 - this.width / 2);
	this.camera.y = -(this.y - this.canvas.height / 2 - this.height / 2);
};

Player.prototype.draw = function (ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
	ctx.restore();
}

module.exports = Player;