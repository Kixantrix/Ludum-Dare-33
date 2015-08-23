"use strict";

var Ball = require('./ball');
var xPlusYDistance = require('./point')['xPlusYDistance'];
var Weapon = require('./weapon');

function Ship(x, y, camera, canvas, src) {
	Ball.apply(this, [x, y]);
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.camera = camera;
	this.canvas = canvas;

	this.velX = 0;
	this.velY = 0;
	// Max linear velocity of ship (x and y hypotenuse)
	this.maxVel = 20;

	this.rotation = 0;
	// Max rotation speed of ship
	this.maxRotationSpeed = 0.4;
	this.width = 128;
	this.height = 128;
	this.radius = 128 / 2;

	// Hit points
	this.hp = 128;

	this.image = new Image();
	this.image.src = src;
	

	this.enemies = {};
	this.enemies['Player'] = true;
	this.name = "Enemy";

	this.weapon = new Weapon(50, 30, 20);
}

Ship.prototype = Object.create(Ball.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.thrust = function(accel) {
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

// Fire method
Ship.prototype.fire = function() {
	if(this.weapon) {
		this.weapon.fire(this);
	}
}

Ship.prototype.thrustAccel = function(accel) {

	if(Math.abs(this.rotation + accel) < this.maxRotationSpeed) {
		this.rotation += accel;
	}
	return true;
}

function mod(n, k) {
	return ((n % k) + k) % k;
}

Ship.prototype.update = function(objects) {
	var rotationApplied = false;
	var thrustApplied = false;

	// Find closest enemy
	var closestEnemy = {};
	for(var i = 0; i < objects.length; i++) {
		if(this.enemies[objects[i].name]) {
			var distance = xPlusYDistance(objects[i].x, objects[i].y, this.x, this.y);
			if(!closestEnemy.enemy || closestEnemy.distance > distance) {
				closestEnemy.enemy = objects[i];
				closestEnemy.distance = distance;
			}
		}
	}

	// Head towards closest enemy is far away
	if(closestEnemy.enemy) {
		var enemy = closestEnemy.enemy;
		if(closestEnemy[distance] < 10) { // Back away
			// RUN AWAY?

		} else {
			var angleDiff;
			var dx = closestEnemy.enemy.x - this.x;
			var dy = closestEnemy.enemy.y - this.y;

			var angle = Math.PI / 2 + Math.atan2(dy, dx);
			var angleDiff = mod((this.angle - angle + Math.PI), (Math.PI * 2)) - Math.PI;

			console.log('angleDiff', angleDiff);

			var decelerateRotation;
			if (this.rotation !== 0) {
				decelerateRotation = -this.rotation / Math.abs(this.rotation) * 0.01;
			} else {
				decelerateRotation = -0.01;
			}

			if (this.rotation > 0.1) { //Slow down
				this.thrustAccel(decelerateRotation);
				if (Math.abs(angleDiff) < 0.3) this.thrust(0.5);
				return;
			} else {
				var finalAngle = angleDiff - this.rotation * this.rotation / decelerateRotation / 2;
				finalAngle = mod((finalAngle + Math.PI), (Math.PI * 2)) - Math.PI;
				console.log('finalAngle', finalAngle);
				if (finalAngle > Math.PI / 2 || finalAngle < -Math.PI / 2) {
					if (Math.abs(this.rotation) > 0.05) {
						this.thrustAccel(decelerateRotation);
					} else {
						this.thrustAccel(-angleDiff / Math.abs(angleDiff) * 0.01);
					}
				} else if (finalAngle > 0.01) {
					this.thrustAccel(-0.01);
					console.log('left');
				} else if (finalAngle < -0.01) {
					this.thrustAccel(0.01);
					console.log('right');
				} else {
					if (angleDiff < 0.3 && angleDiff > -0.3)
						this.thrust(0.5);
				}
			}


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
	
	this.angle += this.rotation;
};

Ship.prototype.draw = function (ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height	);
	ctx.restore();
}

module.exports = Ship;