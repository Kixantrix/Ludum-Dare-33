"use strict";
var point = require('./point');

var DEFAULT_DEPTH = 1;

// Camera for game, used to transform draw calls for different perspectives of the map
function Camera(x, y, z, canvas) {
	this.x = x;
	this.y = y;
	this.z = z;
    this.canvas = canvas;

    // Applies camera transformations from x y positions to camera
    // Positions
    this.transform = function(x, y) {
    	return [x * this.getZScale() + this.x, 
    		y * this.getZScale() + this.y];
    }

    // Retreives original coordinates before transformation 
    this.antiTransform = function(x, y) {
    	return new point((x - this.x) / this.getZScale(), (y - this.y) / this.getZScale());
    }  

    this.applyTransform = function(ctx) {
        ctx.translate(this.x, this.y);
        var scale = this.getZScale();
        ctx.scale(scale, scale);
    }

    // Returns a scaling factor for size of items on 2d plane based on z index.
    this.getZScale = function() {
    	return 1.0 * DEFAULT_DEPTH / z;
    }

    // Changes X position
    this.moveX = function(x) {
    	this.x = x;
    }

    // Changes Y position
    this.moveY = function(y) {
    	this.y = y;
    }

    // Changes Z position
    this.moveZ = function(z) {
    	this.z = z;
    }

    this.left = function() {
    	return -this.x;
    }
    this.right = function() {
    	return -this.x + this.canvas.width / this.getZScale();
    }
    this.top = function() {
    	return -this.y;
    }

    this.bottom = function() {
    	return -this.y + this.canvas.height / this.getZScale();
    }
}

module.exports = Camera;