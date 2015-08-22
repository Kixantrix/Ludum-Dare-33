"use strict";

function Player(x, y, camera, canvas) {
	this.x = x;
	this.y = y;
	this.camera = camera;
	this.canvas = canvas;

	this.velX = 0;
	this.velY = 0;
	this.angle = 0;

	this.image = new Image();
	this.image.src = "images/player_ship.png";
}

Player.prototype.thrust = function(accel) {
	this.velX += Math.sin(this.angle) * accel;
	this.velY -= Math.cos(this.angle) * accel;
}

Player.prototype.update = function(input) {
	if (input.keys[68]) {//D
		this.angle += 0.1;
	}
	if (input.keys[65]) {//A
		this.angle -= 0.1;
	}
	if (input.keys[87]) {//W
		this.thrust(1)
	}
	if (input.keys[83]) {//S
		this.thrust(-1);
	}

	this.x += this.velX;
	this.y += this.velY;

	this.camera.x = -(this.x - this.canvas.width / 2);
	this.camera.y = -(this.y - this.canvas.height / 2);
};

Player.prototype.draw = function (ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y)
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, 0, 0);
	ctx.restore();
}

module.exports = Player;