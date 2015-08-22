"use strict";

function Player(x, y) {
	this.x = x;
	this.y = y;

	this.image = new Image();
	this.image.src = "images/player_ship.png";
}

Player.prototype.update = function(input) {
	//console.log(input.keys);
};

Player.prototype.draw = function (ctx, camera) {
	ctx.drawImage.apply(ctx,
		[this.image].concat(camera.transform(this.x, this.y)));
}

module.exports = Player;