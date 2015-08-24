"use strict";

var Ball = require('./ball');

var globals = require('./globals');
var Projectile = require('./projectile');
var Ship = require('./ship');

function Player(x, y, camera, canvas) {
	Ship.apply(this, [x, y, camera, canvas, "images/spaceships/player_ship.png"]);
	this.name = "Player";
	this.crashSound = new Audio("sounds/Explosion20.wav");
	this.crashSound.volume = 0.5;
	this.maxVel = 30;
}

Player.prototype = Object.create(Ship.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(input) {
	var rotationApplied = false;
	var thrustApplied = false;

	this.regenShields();

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

	if (input.keys[32]) {// space
		this.fire();
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

	this.camera.z = 1 + Math.sqrt(Math.abs(this.velX) + Math.abs(this.velY)) / 10;
	if (this.camera.z > 10) this.camera.z = 10;

	this.camera.center(this.x + this.width / 2, this.y + this.height / 2);
};

Player.prototype.onCollide = function (object) {
	this.crashSound.play();
}

Player.prototype.draw = function(ctx, camera) {
	Ship.prototype.draw.call(this, ctx, camera);
	this.drawHealthBar(ctx);
	ctx.fillText(this.x + ", " + this.y, 10, 10);

}

Player.prototype.drawHealthBar = function(ctx) {
	var x = 100
	var y = globals.canvas.height - 200;
	var shieldWidth = 260 * this.shields / this.maxShields;
	var healthWidth = 260 * this.hp / this.maxhp;
	ctx.fillStyle = "#151B54";
	ctx.fillRect(x, y, 300, 100);
	ctx.fillStyle = "#368BC1";
	ctx.fillRect(x + 20, y + 20, shieldWidth, 25);
	ctx.fillStyle = "white";
	ctx.font = "20px sansserif";
	ctx.fillText(this.shields + " / " + this.maxShields, x + 30, y + 40);
	ctx.fillStyle = "#52D017";
	ctx.fillRect(x + 20, y + 55, healthWidth, 25);
	ctx.fillStyle = "white";
	ctx.fillText(this.hp + " / " + this.maxhp, x + 30, y + 75);
}

module.exports = Player;