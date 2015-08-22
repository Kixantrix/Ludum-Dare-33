"use strict";

var canvas;
var ctx;

// Dynamic resize of canvas
window.onload = function () {
	canvas = document.getElementById('game-canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	console.log(canvas);
};

// Dynamic resize of canvas
window.onresize = function() {
    if(window.innerWidth >= 500 && window.innerHeight >= 500) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;    
    } else {
	   canvas.width = 500;
	   canvas.height = 500;
    }
};

var FPS = 30;
var spf = 1000.0 / FPS
    // Draw Loop
    setInterval(function() {
      update();
      draw();
  }, spf);

// Update information for 
function update() {
}

// Drawing function
function draw() {
    drawBackground();
    drawChars();
}

// Draw background assets
function drawBackground() {

}

// Draw characters
function drawChars() {

}

// Camera for game, used to transform draw calls for different perspectives of the map
function camera(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

    // Applies camera transformations from x y positions to camera
    // Positions
    this.transform = function(x, y) {
    	return new point(x * this.getZScale() + this.x, 
    		y * this.getZScale() + this.y);
    }

    // Retreives original coordinates before transformation 
    this.antiTransform = function(x, y) {
    	return new point((x - this.x) / this.getZScale(), (y - this.y) / this.getZScale());
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
}
