"use strict";
var Player = require('./main');

// Background object
function Background() {
    this.default_width = 2000;
    this.default_height = 2000;

    this.starFields = {}

    this.draw = function(camera, ctx) {

    }

    this.findEdges = function(camera) {

    }


}

// A field of stars as one chunk of width and height
function StarField(x, y, width, height, smallStarWidth, largeStarWidth, numSmallStars, numBigStars) {
    this.x = x;
    this.y = y;
    // Arrays of stars
    this.bigStars = [];
    this.smallStars = [];

    // Width of the entire field
    this.width = width;
    this.height = height;

    // Width of each kind of star
    this.smallStarWidth = smallStarWidth;
    this.largeStarWidth = largeStarWidth;

    // Gen small stars coords
    for(var i; i < numBigStars; i++) {
        x = Math.floor(Math.Random() * width);
        y = Math.floor(Math.Random() * height);
        bigStars.add(new Point(x, y));
    }

    // Gen large stars coords
    for(var i; i < numSmallStars; i++) {   
        x = Math.floor(Math.Random() * width);
        y = Math.floor(Math.Random() * height);
        smallStars.add(new Point(x, y));
    }
    
    this.draw = function(camera, ctx) {

    }
}