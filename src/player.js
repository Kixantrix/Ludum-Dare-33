"use strict";

var Ball = require('./ball');

function Player(x, y, camera, canvas) {
	Ball.apply(this, [x, y]);
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.camera = camera;
	this.canvas = canvas;

	this.velX = 0;
	this.velY = 0;
	// Max linear velocity of ship (x and y hypotenuse)
	this.maxVel = 5;

	this.rotation = 0;
	// Max rotation speed of ship
	this.maxRotationSpeed = 0.2;

	this.image = new Image();
	this.image.src = "images/spaceships/player_ship.png";
	this.width = 64;
	this.height = 64;
	this.radius = 24;

	this.image.width = this.width;
	this.image.height = this.height;

	this.name = "Player";
}

Player.prototype = Object.create(Ball.prototype);
Player.prototype.constructor = Player;

Player.prototype.thrust = function(accel) {
	var newVelX = this.velX + Math.sin(this.angle) * accel;
	var newVelY = this.velY - Math.cos(this.angle) * accel;
	var newVel = Math.sqrt(Math.pow(newVelX, 2) + Math.pow(newVelY, 2));
	var oldVel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
	if((newVel < this.maxVel) || (newVel < oldVel)) {
		this.velX = newVelX;
		this.velY = newVelY;
	}
	// Thrust has been applied
	return true;
}

Player.prototype.thrustAccel = function(accel) {

	if(Math.abs(this.rotation + accel) < this.maxRotationSpeed) {
		this.rotation += accel;
	}
	return true;
}


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