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
        var bottom = this.getStarField(camera.x )
    }

    // Retreives starfield at x, y coordinate
    this.getStarField = function(x, y) {
        var key = x + " " + y;
        if (!starFields[key]) {
            starFields[key] = new StarField(x, y, this.default_width, this.default_height, 5, 15, 200, 50);
        }
        return starFields[key];
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
    for(var i = 0; i < numBigStars; i++) {
        x = Math.floor(Math.Random() * this.width) - this.width;
        y = Math.floor(Math.Random() * this.height) - this.height;
        bigStars.add(new Point(x, y));
    }

    // Gen large stars coords
    for(var i = 0; i < numSmallStars; i++) {   
        x = Math.floor(Math.Random() * this.width);
        y = Math.floor(Math.Random() * this.height);
        smallStars.add(new Point(x, y));
    }
    
    this.draw = function(camera, ctx) {
        for(var i = 0; i < numSmallStars; i++) {
            var transCoords = camera.transform(this.x + smallStars[i].x, this.y + smallStars[i].y);
            ctx.fillRect(transCoords[0], transCoords[1], this.smallStarWidth, this.largeStarWidth);
        }
        for(var i = 0; i < numSmallStars; i++) {
            
        }
        var transCoords = camera.transform(this.x, this.y);
        ctx.rect(transCoords[0], transCoords[1], )
    }
}

module.exports = Background;