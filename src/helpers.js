'use strict';

var helpers = {
	angle: function (object1, object2) {
		var dx = object2.enemy.x - object1.x;
		var dy = object2.enemy.y - object1.y;

		return Math.PI / 2 + Math.atan2(dy, dx);
	},
	angleDiff: function (angle1, angle2) {
		return helpers.mod((angle1 - angle2 + Math.PI), (Math.PI * 2)) - Math.PI;
	},
	mod: function mod(n, k) {
		return ((n % k) + k) % k;
	}
}

module.exports = helpers;