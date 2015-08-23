"use strict";

var Ball = require('./ball');
var Ship = require('./ship');

function Player(x, y, camera, canvas) {
	Ship.apply(this, [x, y, camera, canvas, "images/spaceships/player_ship.png"]);
	this.name = "Player";
	this.maxVel = 15;
}

Player.prototype = Object.create(Ship.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(input) {
	var rotationApplied = false;
	var thrustApplied = false;

	if (input.keys[68]) {//D
		rotationApplied = this.thrustAccel(0.01);
	}
	if (input.keys[65]) {//A
		rotationApplied = this.thrustAccel(-0.01);
	}

	if (input.keys[87]) {//W
		thrustApplied = this.thrust(1);
	}

	if (input.keys[83]) {//S
		thrustApplied = this.thrust(-1);
	}

	if(!thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	}

	this.angle += this.rotation;

	this.camera.x = -(this.x - this.canvas.width / 2 - this.width / 2);
	this.camera.y = -(this.y - this.canvas.height / 2 - this.height / 2);
};

Player.prototype.draw = function(ctx, camera) {
	Ship.prototype.draw.call(this, ctx, camera);

	ctx.fillText(this.x + ", " + this.y, 10, 10);
}

module.exports = Player;