'use strict';

function Input(canvas) {
	canvas.parentElement.onkeydown = this.onkeydown.bind(this);
	canvas.parentElement.onkeyup = this.onkeyup.bind(this);

	this.keys = {};
}

Input.prototype.onkeydown = function(e) {
	this.keys[e.keyCode] = true;
	console.log(this.keys);
}

Input.prototype.onkeyup = function(e) {
	this.keys[e.keyCode] = false;
}

module.exports = Input;