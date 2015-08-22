"use strict";

function Player(x, y) {
	this.x = x;
	this.y = y;

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
};

Player.prototype.draw = function (ctx, camera) {
	ctx.drawImage.apply(ctx,
		[this.image].concat(camera.transform(this.x, this.y)));
}

module.exports = Player;