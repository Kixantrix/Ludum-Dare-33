"use strict";
var Player = require('./main');

// Background object
function Background() {
    this.default_width = 2000;
    this.default_height = 2000;

    this.starFields = {};

    // Draws background made up of fields
    this.draw = function(camera, ctx) {
        fields = findFields(camera);
        for(int i = 0; i < fields.length; i++) {
            fields[i].draw(camera, ctx);
        }
    }

    // Finds all fields viewable by camera
    this.findFields = function(camera) {
        canvas = document.getElementById('game-canvas');
        var edges = [];
        for(var i = 0; i < Math.floor(canvas.width / this.default_width + 1); i++) {
            for(var j = 0; j < Math.floor(canvas.height / this.default_width + 1); j++) {
                edges.add(this.getStarField(Math.floor((camera.x - 1000)); 
            }
        }
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
    
    // Draw the field
    this.draw = function(camera, ctx) {
        // Draw a white rectangle for each small star
        for(var i = 0; i < this.numSmallStars; i++) {
            var transCoords = camera.transform(this.x + this.smallStars[i].x, this.y + this.smallStars[i].y);
            ctx.fillStyle = "white";
            ctx.fillRect(transCoords[0], transCoords[1], this.smallStarWidth, this.largeStarWidth);
        }
        // Draw a yellow rectangle for each large star
        for(var i = 0; i < this.numLargeStars; i++) {
            var transCoords = camera.transform(this.x + this.bigStars[i].x, this.y + this.bigStars[i].y);
            ctx.fillStyle = "yellow";
            ctx.fillRect(transCoords[0], transCoords[1], this.largeStarWidth, this.largeStarWidth);
        }
    }
}

module.exports = Background;