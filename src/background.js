"use strict";
var Point = require('./point');

// Background object
function Background() {
    this.default_width = 2000;
    this.default_height = 2000;

    this.starFields = {};

    // Draws background made up of fields
    this.draw = function(camera, ctx) {
        var fields = this.findFields(camera);
        for(var i = 0; i < fields.length; i++) {
            (fields[i].draw)(camera, ctx);
        }
    }

    // Returns array of all fields viewable by camera
    this.findFields = function(camera) {
        var canvas = document.getElementById('game-canvas');
        var edges = [];
        for(var i = Math.floor((camera.x - canvas.width / 2) / 2000); i < Math.floor((camera.x + canvas.width / 2) / 2000 + 1); i++) {
            for(var j = Math.floor((camera.y - canvas.height / 2) / 2000); j < Math.floor((camera.y + canvas.height / 2) / 2000 + 1); j++) {
                edges.push(this.getStarField(i * 2000,
                    j * 2000));
            }
        }
        return edges;
    }

    // Retreives starfield at x, y coordinate
    this.getStarField = function(x, y) {
        var key = x + " " + y;
        if (!this.starFields[key]) {
            this.starFields[key] = new StarField(x, y, this.default_width, this.default_height, 5, 15, 200, 50);
        }
        return this.starFields[key];
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
        var x = Math.floor(Math.random() * this.width) - this.width;
        var y = Math.floor(Math.random() * this.height) - this.height;
        this.bigStars.push(new Point(x, y));
    }

    // Gen large stars coords
    for(var i = 0; i < numSmallStars; i++) {   
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        this.smallStars.push(new Point(x, y));
    }
    
    // Draw the field
    this.draw = function(camera, ctx) {
        //console.log("x: " + camera.x + " " + this.x + " " + "y: " + camera.y + " " + this.y);
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