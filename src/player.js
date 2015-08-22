function Player(x, y) {
	this.x = x;
	this.y = y;

	this.image = new Image();
	this.image.src = "images/player_ship.png";
	this.draw = function (ctx, camera) {
		ctx.drawImage.apply(ctx, [this.image].concat(camera.transform(this.x, this.y)));
	}
}

module.exports = Player;