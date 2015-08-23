'use strict'

function ObjectBoxes() {

}

ObjectBoxes.prototype.addObject = function(object) {
	if (!this[[object.boxX, object.boxY]])
        this[[object.boxX, object.boxY]] = [];
    this[[object.boxX, object.boxY]].push(object);
}

ObjectBoxes.prototype.removeObject = function (object) {
	var oldBoxX = object.boxX;
	var oldBoxY = object.boxY;
	if (!objectBoxes[[oldBoxX, oldBoxY]]) return;
	var index = objectBoxes[[oldBoxX, oldBoxY]].indexOf(object);
    objectBoxes[[oldBoxX, oldBoxY]].splice(index, 1);
    if (objectBoxes[[oldBoxX, oldBoxY]].length === 0) {
        delete objectBoxes[[oldBoxX, oldBoxY]];
    }
}

var objectBoxes = new ObjectBoxes();
module.exports = objectBoxes;