"use strict";

var canvas;
var ctx;
var camera;
var paused = false;

var DEFAULT_DEPTH = 1;

// Dynamic resize of canvas
window.onload = function () {
	canvas = document.getElementById('game-canvas');
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 10;
	console.log(canvas);
	ctx = canvas.getContext("2d");

	camera = new Camera(0, 0, 1);
};

// Dynamic resize of canvas
window.onresize = function() {
    if(window.innerWidth >= 500 && window.innerHeight >= 500) {
        canvas.width = window.innerWidth - 10;
        canvas.height = window.innerHeight - 10;    
    } else {
        canvas.width = 500;
        canvas.height = 500;
    }
};

var FPS = 30;
var step = 1000.0 / FPS
    // Draw Loop
    setInterval(function() {
    	if (paused) return;
      update();
      draw();
  }, step);

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
	for (var x = camera.left(); x < camera.right(); x += 40) {
		ctx.moveTo.apply(ctx, camera.transform(x, camera.top()));
		ctx.lineTo.apply(ctx, camera.transform(x, camera.bottom()));
	}
	for (var y = camera.top(); y < camera.bottom(); y += 40) {
		ctx.moveTo.apply(ctx, camera.transform(camera.left(), y));
		ctx.lineTo.apply(ctx, camera.transform(camera.right(), y));
	}
	ctx.strokeStyle = "#eee";
	ctx.stroke();


}

// Draw characters
function drawChars() {

}

// Background object
function Background() {
    this.default_width = 2000;
    this.default_height = 2000;


    this.draw = function(camera) {

    }


}

// A field of stars as one chunk of width and height
function StarField(width, height, numSmallStars, numBigStars) {
    this.bigStars = [];
    this.smallStars = [];

    for(var i; i < numSmallStars; i++) {

    }

    for(var i; i < numSmallStars; i++) {
        
    }

}

// Camera for game, used to transform draw calls for different perspectives of the map
function Camera(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

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
    	return this.x;
    }
    this.right = function() {
    	return this.x + canvas.width / this.getZScale();
    }
    this.top = function() {
    	return this.y;
    }

    this.bottom = function() {
    	return this.y + canvas.height / this.getZScale();
    }
}

// Creates a point
function point(x, y) {
    this.x = x;
    this.y = y;
}
