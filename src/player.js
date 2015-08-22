"use strict";

function Player(x, y, camera, canvas) {
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.camera = camera;
	this.canvas = canvas;

	this.velX = 0;
	this.velY = 0;
	// Max linear velocity of ship (x and y hypotenuse)
	this.maxVel = 40;

	this.rotation = 0;
	// Max rotation speed of ship
	this.maxRotationSpeed = 0.2;

	this.image = new Image();
	this.image.src = "images/player_ship.png";
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
	var rotationApplied = false;
	var thrustApplied = false;

	if (input.keys[68]) {//D
		if(this.rotation < this.maxRotationSpeed) {
			this.thrustAccel(0.01);
			rotationApplied = true;
		}
	}
	if (input.keys[65]) {//A
		if(this.rotation > -1 * this.maxRotationSpeed) {
			this.thrustAccel(-0.01);
			rotationApplied = true;
		}
	}

	if (input.keys[87]) {//W
		var accel = 1;
		var newVelX = this.velX + Math.sin(this.angle) * accel;
		var newVelY = this.velY - Math.cos(this.angle) * accel;
		var newVel = Math.sqrt(Math.pow(newVelX, 2) + Math.pow(newVelY, 2));
		var oldVel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
		if((newVel < this.maxVel) || (newVel < oldVel)) {
			this.thrust(accel)
			thrustApplied = true;
		}
	}

	if (input.keys[83]) {//S
		var accel = -1
		var newVelX = this.velX + Math.sin(this.angle) * accel;
		var newVelY = this.velY - Math.cos(this.angle) * accel;
		var newVel = Math.sqrt(Math.pow(newVelX, 2) + Math.pow(newVelY, 2));
		var oldVel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
		if((newVel < this.maxVel) || (newVel < oldVel)) {
			this.thrust(accel)
			thrustApplied = true;
		}
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