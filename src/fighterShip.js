"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var helpers = require('./helpers');
var xPlusYDistance = require('./point')['xPlusYDistance'];
var Weapon = require('./weapon');

function FighterShip(x, y, camera, canvas, faction, num, friendlyTarget) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;
	this.friendlyTarget = friendlyTarget;

	this.maxRotationSpeed = 0.4;
	this.width = 90;
	this.height = 90;
	this.radius = 90 / 2;

	this.hp = 90;
	this.maxhp = 90;
	this.maxShields = 30;
	this.shields = 30;

	this.image = this.faction.images['fighter'];

	this.name = faction.name + " " + "fighter " + num;

	this.weapon = new Weapon(20, 15, 40);

	this.enemies = faction.enemies;

}

FighterShip.prototype = Object.create(Ship.prototype);
FighterShip.prototype.constructor = FighterShip;

FighterShip.prototype.update = function(objects) {
	this.rotationApplied = false;
	this.thrustApplied = false;

	this.regenShields();

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

	var target;
	var distance;
	var friendly;

	// Head towards closest enemy is far away
	if(closestEnemy.enemy && closestEnemy.distance < 500) {
		target = closestEnemy.enemy;
		distance = closestEnemy.distance;
		friendly = false;
	} else {
		target = this.friendlyTarget;
		friendly = true;
		distance = xPlusYDistance(this.x, this.y, this.friendlyTarget.x, this.friendlyTarget.y);
	}
	if(distance < 250) { // Back away
		this.thrust(-1);

	} else {
		/*var distance = closestEnemy.distance;
		var ratio = distance / this.oldDistance;*/
		var angle = this.oldAngle;
		/*if (ratio < 0.9 || ratio > 1.1) {*/
			angle = helpers.angle(this, target);
			/*this.oldDistance = distance;
			this.oldAngle = angle;
		}*/
		var angleDiff = helpers.angleDiff(this.angle, angle);

		//console.log('angleDiff', angleDiff);

		var decelerateRotation;
		if (this.rotation !== 0) {
			decelerateRotation = -this.rotation / Math.abs(this.rotation) * 0.005;
		} else {
			decelerateRotation = -0.01;
		}

		if (this.rotation > 0.1) { //Slow down
			this.thrustAccel(decelerateRotation);
			if (Math.abs(angleDiff) < 0.3) this.thrust(0.5);
			return;
		} else {
			var finalAngle = angleDiff - this.rotation * this.rotation / decelerateRotation / 2;
			finalAngle = helpers.mod((finalAngle + Math.PI), (Math.PI * 2)) - Math.PI;
			//console.log('finalAngle', finalAngle);
			if (finalAngle > Math.PI / 2 || finalAngle < -Math.PI / 2) {
				if (Math.abs(this.rotation) > 0.05) {
					this.thrustAccel(decelerateRotation);
				} else {
					this.thrustAccel(-angleDiff / Math.abs(angleDiff) * 0.01);
				}
			} else if (finalAngle > 0.01) {
				this.thrustAccel(-0.01);
			} else if (finalAngle < -0.01) {
				this.thrustAccel(0.01);
			} else {
				this.thrustAccel(decelerateRotation);
				if (angleDiff < 0.3 && angleDiff > -0.3) {
					this.thrust(0.5);
					if (closestEnemy.distance < 500) {
						this.weapon.fire(this);
					}
				}
			}
		}
	}

	if(!this.thrustApplied) {
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

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
};
// Remove function
FighterShip.prototype.remove = function() {
	this.faction.remove(this);
}

module.exports = FighterShip;