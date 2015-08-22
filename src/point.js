"use strict";

// Creates a point
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function xPlusYDistance(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function hypoDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angleTo(x1, y1, x2, y2) {

}

module.exports = {'Point': Point, 'xPlusYDistance': xPlusYDistance, 'hypoDistance': hypoDistance, 'angleTo': angleTo};