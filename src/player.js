"use strict";

function Player(x, y, camera, canvas) {
	this.x = x;
	this.y = y;
	this.camera = camera;
	this.canvas = canvas;

	this.image = new Image();
	this.image.src = "images/player_ship.png";
}

Player.prototype.update = function(input) {
	if (input.keys[68]) {
		this.x += 5;
	}
	if (input.keys[65]) {
		this.x -= 5;
	}
	if (input.keys[87]) {
		this.y -= 5;
	}
	if (input.keys[83]) {
		this.y += 5;
	}

	this.camera.x = -(this.x - this.canvas.width / 2);
	this.camera.y = -(this.y - this.canvas.height / 2);
};

Player.prototype.draw = function (ctx, camera) {
	ctx.drawImage.apply(ctx,
		[this.image].concat(camera.transform(this.x, this.y)));
}

module.exports = Player;