(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Ball = require('./ball');
var globals = require('./globals');

function Asteroid(x, y, size, pool) {
	Ball.apply(this, [x, y]);

	this.width = size;
	this.height = size;
	this.radius = size / 2;

	this.mass = size;
	this.maxhp = size;
	this.hp = size;

	this.pool = pool;

	this.crashSound = new Audio("sounds/AsteroidCrash.wav");
	this.explodeSound = new Audio("sounds/AsteroidExplosion.wav");

	this.type = 'asteroid';
}

Asteroid.prototype = Object.create(Ball.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.explode = function() {
	this.pool.remove(this);

	var dx, dy;
	dx = Math.abs(this.x - globals.camera.center().x);
	dy = Math.abs(this.y - globals.camera.center().y);

	if (dx + dy < 100) {
		this.explodeSound.volume = 1;
	} else {
		this.explodeSound.volume = 100 / (dx + dy);
	}
	this.explodeSound.play();
}

Asteroid.prototype.onHit = function (damage, source) {
	this.hp -= damage;
	if(this.hp <= 0) {
		if(source) {
			source.points += 5;
		}
		this.pool.remove(this);
	}
}

Asteroid.prototype.onCollide = function(object) {
	var dx, dy;
	dx = Math.abs(this.x - globals.camera.center().x);
	dy = Math.abs(this.y - globals.camera.center().y);

	if (dx + dy < 100) {
		this.crashSound.volume = 1;
	} else {
		this.crashSound.volume = 100 / (dx + dy);
	}
	this.crashSound.play();
}

Asteroid.prototype.update = function() {
	if(this.velX < 0.1 && this.velX > -0.1) {
		this.velX = 0;
	} else {
		this.velX = this.velX * 0.99;
	}

	if(this.velY < 0.1 && this.velY > -0.1) {
		this.velY = 0;
	} else {
		this.velY = this.velY * 0.99;
	}

	if(this.rotation < 0.001 && this.rotation > -0.001) {
		this.rotation = 0;
	} else {
		this.rotation *= 0.99;
	}
	
	this.x += this.velX;
	this.y += this.velY;
	this.angle += this.rotation;
};

Asteroid.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'brown';
	ctx.fill();
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText(this.boxX + ", " + this.boxY, 0, 0);
	ctx.restore();
};

module.exports = Asteroid;
},{"./ball":5,"./globals":13}],2:[function(require,module,exports){
"use strict";

var Asteroid = require('./asteroid');
var objectBoxes = require('./objectBoxes');

// Creates a field of astroids
function AsteroidField(x, y, size, num_asteroids) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.num_asteroids = num_asteroids;

	this.asteroids = [];

	for(var i = 0; i < num_asteroids; i++) {
		this.asteroids.push(new Asteroid(Math.abs(Math.random() * size) + this.x, Math.abs(Math.random() * size) + this.y, 10 + Math.abs(Math.random() * 100), this));
	}
}	

AsteroidField.prototype.remove = function(asteroid) {
	var indexOf = this.asteroids.indexOf(asteroid);
	this.asteroids.splice(indexOf, 1);
	objectBoxes.removeObject(asteroid);
}

AsteroidField.prototype.draw = function(ctx, canvas) {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].draw(ctx, canvas);
	}
};

AsteroidField.prototype.update = function() {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].update();
	}
};

module.exports = AsteroidField;
},{"./asteroid":1,"./objectBoxes":18}],3:[function(require,module,exports){
"use strict";

var Asteroid = require('./asteroid');
var objectBoxes = require('./objectBoxes');

// Creates a field of astroids
function AsteroidRing(x, y, innerRadius, outerRadius, num_asteroids) {
	this.x = x;
	this.y = y;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.num_asteroids = num_asteroids;

	this.asteroids = [];

	for(var i = 0; i < num_asteroids; i++) {
		var angle = Math.random() * 2 * Math.PI;
		var radius = Math.random() * (this.outerRadius - this.innerRadius);
		this.asteroids.push(new Asteroid(Math.floor((radius + innerRadius) * Math.cos(angle) + this.x), 
			Math.floor((radius + innerRadius) * Math.sin(angle) + this.y), 10 + Math.abs(Math.random() * 100), this));
	}
}	

AsteroidRing.prototype.remove = function(asteroid) {
	var indexOf = this.asteroids.indexOf(asteroid);
	this.asteroids.splice(indexOf, 1);
	objectBoxes.removeObject(asteroid);
}

AsteroidRing.prototype.draw = function(ctx, canvas) {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].draw(ctx, canvas);
	}
};

AsteroidRing.prototype.update = function() {
	for(var i = 0; i < this.asteroids.length; i++) {
		this.asteroids[i].update();
	}
};

module.exports = AsteroidRing;
},{"./asteroid":1,"./objectBoxes":18}],4:[function(require,module,exports){
"use strict";
var Point = require('./point')['Point'];

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
        for(var i = Math.floor((camera.left()) / 2000 - 2); i < Math.floor((camera.right()) / 2000 + 2); i++) {
            for(var j = Math.floor((camera.top()) / 2000 - 2); j < Math.floor((camera.bottom()) / 2000 + 2); j++) {
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

    // Gen large stars coords
    for(var i = 0; i < numBigStars; i++) {
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        this.bigStars.push(new Point(x, y));
    }

    // Gen small stars coords
    for(var i = 0; i < numSmallStars; i++) {   
        var x = Math.floor(Math.random() * this.width);
        var y = Math.floor(Math.random() * this.height);
        this.smallStars.push(new Point(x, y));
    }
    
    // Draw the field
    this.draw = function(camera, ctx) {
        // Draw a white rectangle for each small star
        for(var i = 0; i < this.smallStars.length; i++) {
            var transCoords = camera.transform(this.x + this.smallStars[i].x, this.y + this.smallStars[i].y);
            ctx.fillStyle = "white";
            ctx.fillRect(transCoords[0], transCoords[1], this.smallStarWidth, this.smallStarWidth);
        }
        // Draw a yellow rectangle for each large star
        for(var i = 0; i < this.bigStars.length; i++) {
            var transCoords = camera.transform(this.x + this.bigStars[i].x, this.y + this.bigStars[i].y);
            ctx.fillStyle = "yellow";
            ctx.fillRect(transCoords[0], transCoords[1], this.largeStarWidth, this.largeStarWidth);
        }
    }
}

module.exports = Background;
},{"./point":21}],5:[function(require,module,exports){
'use strict';

var boxSize = require('./variables').boxSize;

function Ball(x, y) {
	this.x = x;
	this.y = y;

	this.boxX = Math.floor(x / boxSize);
	this.boxY = Math.floor(y / boxSize);

	this.angle = 0;

	this.velX = 0;
	this.velY = 0;
	this.rotation = 0;

	this.width = 64;
	this.height = 64;
	this.radius = 32;

	this.mass = 32;
	this.maxhp = 32;
	this.hp = 32;
}

Ball.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.restore();
};

Ball.prototype.onHit = function(damage, source) {
	
}

module.exports = Ball;
},{"./variables":25}],6:[function(require,module,exports){
"use strict";
var Point = require('./point')['Point'];

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
    	return new Point((x - this.x) / this.getZScale(), (y - this.y) / this.getZScale());
    }  

    this.applyTransform = function(ctx) {
        var scale = this.getZScale();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);
    }

    // Returns a scaling factor for size of items on 2d plane based on z index.
    this.getZScale = function() {
    	return 1.0 * DEFAULT_DEPTH / this.z;
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
    	return -this.x / this.getZScale();
    }
    this.right = function() {
    	return -this.x / this.getZScale() + this.canvas.width / this.getZScale();
    }
    this.top = function() {
    	return -this.y / this.getZScale();
    }

    this.bottom = function() {
    	return -this.y / this.getZScale() + this.canvas.height / this.getZScale();
    }

    this.center = function() {
        if (arguments.length === 2) {
            this.x = -arguments[0] * this.getZScale() + this.canvas.width / 2;
            this.y = -arguments[1] * this.getZScale() + this.canvas.height / 2;
            return;
        }

        return {
            x: -this.x + this.canvas.width / this.getZScale() / 2,
            y: -this.y + this.canvas.height / this.getZScale() / 2
        }
    }
}

module.exports = Camera;
},{"./point":21}],7:[function(require,module,exports){
"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function CapitalShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.05;
	this.width = 500;
	this.height = 500;
	this.radius = 250;

	this.hp = 1000;
	this.maxhp = 1000;
	this.maxShields = 500;
	this.shields = 500;

	this.image = this.faction.images['capitalShip'];

	this.name = faction.name + " " + "capitalShip " + num;

	this.weapon = new Weapon(100, 150, 20);

	this.enemies = faction.enemies;

}

CapitalShip.prototype = Object.create(Ship.prototype);
CapitalShip.prototype.constructor = CapitalShip;

// Remove function
CapitalShip.prototype.remove = function() {
	this.faction.remove(this);
}

module.exports = CapitalShip;
},{"./globals":13,"./ship":24,"./weapon":26}],8:[function(require,module,exports){
'use strict';

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function CivilianShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.1;
	this.maxVel = 15;

	this.width = 120;
	this.height = 120;
	this.radius = 120 / 2;

	this.hp = 120;
	this.maxhp = 120;
	this.maxShields = 30;
	this.shields = 30;

	this.enemies = faction.enemies;

	this.image = this.faction.images['civilian'];

	this.name = faction.name + " " + "civilian " + num;

	this.weapon = null;

	this.destinationIndex = 0;
	this.destinations = this.faction.civilianRoute;
}

CivilianShip.prototype = Object.create(Ship.prototype);
CivilianShip.prototype.constructor = CivilianShip;

// Remove function
CivilianShip.prototype.remove = function() {
	this.faction.remove(this);
}

CivilianShip.prototype.update = function() {
	var destination = this.destinations[this.destinationIndex];
	var dx = destination.x - this.x;
	var dy = destination.y - this.y;
	var distanceToDestination = Math.abs(dx) + Math.abs(dy);

	this.regenShields();

	if (distanceToDestination < 400) {
		var stopped = Math.abs(this.velX) + Math.abs(this.velY) < 5;
		if (stopped) {
			// REACHED THE DESTINATION.

			this.destinationIndex += 1;
			this.destinationIndex %= this.destinations.length;

			destination = this.destinations[this.destinationIndex];

			dx = destination.x - this.x;
			dy = destination.y - this.y;
		}
	}

	this.turnTo(destination, function () {
		var decelerationX = -0.5 * Math.sin(this.angle);
		var decelerationY = 0.5 * Math.cos(this.angle);
		var finaldx = dx + this.velX * this.velX / decelerationX / 2;
		var finaldy = dy + this.velY * this.velY / decelerationY / 2;

		var dot = finaldx * decelerationX + finaldy * decelerationY;

		if (dot > 1) {
			this.thrust(-2);
		} else if (dot < -1) {
			this.thrust(1);
		} else if (dot > 0) {
			this.thrust(-0.5);
		}
	}.bind(this));


	if(!this.thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
}
module.exports = CivilianShip;
},{"./globals":13,"./ship":24,"./weapon":26}],9:[function(require,module,exports){
"use strict";

var globals = require('./globals');
var Planet = require('./planet');
var FighterShip = require('./fighterShip');
var CivilianShip = require('./civilianShip');
var Freighter = require('./freighter');
var GunShip = require('./gunShip');
var CapitalShip = require('./capitalShip');
var objectBoxes = require('./objectBoxes');

var factionNames = ["Organics", "Purple", "Dark Gray", "Red", "Blue", "Green", "Orange", "Gray"];

var factionInfo = require('./factionInfo');
var camera = globals.camera;
var canvas = globals.canvas;

function Faction(name) {
	this.name = name;

	var basePlanet = factionInfo[name].planet;
	this.basePlanet = new Planet(basePlanet.x, basePlanet.y, basePlanet.size, basePlanet.src, basePlanet.hasRing);

	this.civilianRoute = factionInfo[name].civilianRoute;
	// Map of enemies and booleans. Eg, this.enemies['orange'] = true
	this.enemies = {};

	// Generate all ship objects, add to box
	this.ships = [];

	// Image resource of all ships so we can recycle images
	this.images = {};
	
	// Civilians
	for(var i = 0; i < factionInfo[name].ships.civilian.num; i++) {
		this.images.civilian = new Image;
		this.images.civilian.src = factionInfo[name].ships.civilian.src;
		this.ships.push(new CivilianShip(this.basePlanet.x + i * 150, this.basePlanet.y + 120, camera, canvas, this, i));
	}

	// Freighters
	for(var i = 0; i < factionInfo[name].ships.freighter.num; i++) {
		this.images.freighter = new Image;
		this.images.freighter.src = factionInfo[name].ships.freighter.src;
		this.ships.push(new Freighter(this.basePlanet.x + i * 400, this.basePlanet.y + 300, camera, canvas, this, i));
	}

	// Fighters
	for(var i = 0; i < factionInfo[name].ships.fighter.num; i++) {
		this.images.fighter = new Image;
		this.images.fighter.src = factionInfo[name].ships.fighter.src;
		this.ships.push(new FighterShip(this.basePlanet.x + i * 120, this.basePlanet.y, camera, canvas, this, i, this.ships[i]));
	}

	// Gunships
	for(var i = 0; i < factionInfo[name].ships.gunShip.num; i++) {
		this.images.gunShip = new Image;
		this.images.gunShip.src = factionInfo[name].ships.gunShip.src;
		this.ships.push(new GunShip(this.basePlanet.x + i * 300, this.basePlanet.y + 700, camera, canvas, this, i));
	}

	// Capital Ships
	for(var i = 0; i < factionInfo[name].ships.capitalShip.num; i++) {
		this.images.capitalShip = new Image;
		this.images.capitalShip.src = factionInfo[name].ships.capitalShip.src;
		this.ships.push(new CapitalShip(this.basePlanet.x + i * 600, this.basePlanet.y + 1300, camera, canvas, this, i));
	}
}

// Draws ships
Faction.prototype.drawShips = function(ctx, camera) {
	for(var i = 0; i < this.ships.length; i++) {
		this.ships[i].draw(ctx, camera);
	}
}

// Draws planet
Faction.prototype.drawPlanet = function(ctx, camera) {
	this.basePlanet.draw(ctx, camera);
}

Faction.prototype.update = function(objects) {
	for(var i = 0; i < this.ships.length; i++) {
		this.ships[i].update(objects);
	}
}

Faction.prototype.remove = function(ship) {
	var indexOf = this.ships.indexOf(ship);
	this.ships.splice(indexOf, 1);
	objectBoxes.removeObject(ship);
}

module.exports = Faction;
},{"./capitalShip":7,"./civilianShip":8,"./factionInfo":10,"./fighterShip":11,"./freighter":12,"./globals":13,"./gunShip":14,"./objectBoxes":18,"./planet":19}],10:[function(require,module,exports){
var factionInfo = {
	"Organics": {
		"planet": {
			"x": 4000,
			"y": 3000,
			"size": 750,
			"src": "images/planets/p4shaded.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: 4000,
				y: 3000
			}, {
				x: 3000,
				y: -1000
			}, {
				x: 10000,
				y: 0
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/alien3.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/alien4.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/alien2.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/alien1.png"
			}
		}
	},

	"Purple": {
		"planet": {
			"x": -10000,
			"y": 0,
			"size": 500,
			"src": "images/planets/p10shaded.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: -10500,
				y: 0
			}, {
				x: 2500,
				y: -1000
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/att5.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/att3.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/blue1.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/blue2.png"
			}
		}
	},

	"Gray": {
		"planet": {
			"x": -1000,
			"y": -2000,
			"size": 600,
			"src": "images/planets/p9shaded.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: -1000,
				y: 2000
			}, {
				x: 4000,
				y: 3000
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/wship-4.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/wship-2.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/xspr5.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/wship1.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/wship-3.png"
			}
		}
	},

	"Red": {
		"planet": {
			"x": 750,
			"y": 10000,
			"size": 800,
			"src": "images/planets/redplanet.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: 1000,
				y: 10000
			}, {
				x: 7000,
				y: 5000
			}, {
				x: 4000,
				y: 3000
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/RD2.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/RD3.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/RD1.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/att2.png"
			}
		}
	},

	"Blue": {
		"planet": {
			"x": 3000,
			"y": -1000,
			"size": 600,
			"src": "images/planets/p2shaded.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: -9500,
				y: 0
			}, {
				x: 3500,
				y: -1000
			}
		],
		"ships": {

			"fighter": {
				"num": 5,
				"src": "images/spaceships/blueship2.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/blueship4.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/blueship3.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/blueship1.png"
			}
		}
	},

	"Green": {
		"planet": {
			"x": 10000,
			"y": 0,
			"size": 800,
			"src": "images/planets/greenplanet.png",
			"hasRing": false
		},
		"civilianRoute": [
			{
				x: 10000,
				y: 0
			}, {
				x: 6000,
				y: 1000
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/greenship2.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/greenship3.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/greenship4.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/greenship1.png"
			}
		}
	},

	"Orange": {
		"planet": {
			"x": 7000,
			"y": 5000,
			"size": 1200,
			"src": "images/planets/p3shaded.png",
			"hasRing": true 
		},
		"civilianRoute": [
			{
				x: 7000,
				y: 5500
			}, {
				x: 6500,
				y: 5000
			}, {
				x: 6500,
				y: 3000
			}, {
				x: 6000,
				y: 3000
			}, {
				x: 7500,
				y: 5000
			}
		],
		"ships": {
			"fighter": {
				"num": 5,
				"src": "images/spaceships/smallorange.png"
			},
			"civilian": {
				"num": 2,
				"src": "images/spaceships/orangeship3.png"
			},
			"freighter": {
				"num": 2,
				"src": "images/spaceships/heavyfreighter.png"
			},
			"gunShip": {
				"num": 3,
				"src": "images/spaceships/orangeship2.png"
			},
			"capitalShip": {
				"num": 1,
				"src": "images/spaceships/orangeship.png"
			}
		}
	}
};

module.exports = factionInfo;
},{}],11:[function(require,module,exports){
"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var helpers = require('./helpers');
var xPlusYDistance = require('./point')['xPlusYDistance'];
var Weapon = require('./weapon');

function FighterShip(x, y, camera, canvas, faction, num, friendlyTarget) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;
	this.friendlyTarget = friendlyTarget;

	this.maxRotationSpeed = 0.4;
	this.width = 90;
	this.height = 90;
	this.radius = 90 / 2;

	this.hp = 90;
	this.maxhp = 90;
	this.maxShields = 30;
	this.shields = 30;

	this.image = this.faction.images['fighter'];

	this.name = faction.name + " " + "fighter " + num;

	this.weapon = new Weapon(20, 15, 40);

	this.enemies = faction.enemies;

}

FighterShip.prototype = Object.create(Ship.prototype);
FighterShip.prototype.constructor = FighterShip;

FighterShip.prototype.update = function(objects) {
	this.rotationApplied = false;
	this.thrustApplied = false;

	this.regenShields();

	// Find closest enemy
	var closestEnemy = {};
	for(var i = 0; i < objects.length; i++) {
		if(this.enemies[objects[i].name]) {
			var distance = xPlusYDistance(objects[i].x, objects[i].y, this.x, this.y);
			if(!closestEnemy.enemy || closestEnemy.distance > distance) {
				closestEnemy.enemy = objects[i];
				closestEnemy.distance = distance;
			}
		}
	}

	var target;
	var distance;
	var friendly;

	// Head towards closest enemy is far away
	if(closestEnemy.enemy && closestEnemy.distance < 1000) {
		target = closestEnemy.enemy;
		distance = closestEnemy.distance;
		friendly = false;
	} else {
		target = this.friendlyTarget;
		friendly = true;
		distance = xPlusYDistance(this.x, this.y, this.friendlyTarget.x, this.friendlyTarget.y);
	}
	if(distance < 250) { // Back away
		this.thrust(-1);

	} else {
		/*var distance = closestEnemy.distance;
		var ratio = distance / this.oldDistance;*/
		var angle = this.oldAngle;
		/*if (ratio < 0.9 || ratio > 1.1) {*/
			angle = helpers.angle(this, target);
			/*this.oldDistance = distance;
			this.oldAngle = angle;
		}*/
		var angleDiff = helpers.angleDiff(this.angle, angle);

		//console.log('angleDiff', angleDiff);

		var decelerateRotation;
		if (this.rotation !== 0) {
			decelerateRotation = -this.rotation / Math.abs(this.rotation) * 0.005;
		} else {
			decelerateRotation = -0.01;
		}

		if (this.rotation > 0.1) { //Slow down
			this.thrustAccel(decelerateRotation);
			if (Math.abs(angleDiff) < 0.3) this.thrust(0.5);
			return;
		} else {
			var finalAngle = angleDiff - this.rotation * this.rotation / decelerateRotation / 2;
			finalAngle = helpers.mod((finalAngle + Math.PI), (Math.PI * 2)) - Math.PI;
			//console.log('finalAngle', finalAngle);
			if (finalAngle > Math.PI / 2 || finalAngle < -Math.PI / 2) {
				if (Math.abs(this.rotation) > 0.05) {
					this.thrustAccel(decelerateRotation);
				} else {
					this.thrustAccel(-angleDiff / Math.abs(angleDiff) * 0.01);
				}
			} else if (finalAngle > 0.01) {
				this.thrustAccel(-0.01);
			} else if (finalAngle < -0.01) {
				this.thrustAccel(0.01);
			} else {
				this.thrustAccel(decelerateRotation);
				if (angleDiff < 0.3 && angleDiff > -0.3) {
					this.thrust(0.5);
					if (closestEnemy.distance < 500) {
						this.weapon.fire(this);
					}
				}
			}
		}
	}

	if(!this.thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
};
// Remove function
FighterShip.prototype.remove = function() {
	this.faction.remove(this);
}

module.exports = FighterShip;
},{"./globals":13,"./helpers":15,"./point":21,"./ship":24,"./weapon":26}],12:[function(require,module,exports){
"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function Freighter(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.05;
	this.maxVel = 12;

	this.width = 300;
	this.height = 300;
	this.radius = 150;

	this.hp = 500;
	this.maxhp = 500;
	this.maxShields = 100;
	this.shields = 100;

	this.image = this.faction.images['freighter'];

	this.name = faction.name + " " + "freighter " + num;

	this.enemies = faction.enemies;

	this.weapon = null;

	this.destinationIndex = 0;
	this.destinations = this.faction.civilianRoute;
	this.destinationCountdown = 50;
}

Freighter.prototype = Object.create(Ship.prototype);
Freighter.prototype.constructor = Freighter;

Freighter.prototype.update = function() {
	this.regenShields();
	var destination = this.destinations[this.destinationIndex];
	var dx = destination.x - this.x;
	var dy = destination.y - this.y;
	var distanceToDestination = Math.abs(dx) + Math.abs(dy);

	if (distanceToDestination < 400) {
		var stopped = Math.abs(this.velX) + Math.abs(this.velY) < 5;
		if (stopped) {
			this.destinationCountdown--;
			if (this.destinationCountdown <= 0) {
				// REACHED THE DESTINATION.

				this.destinationIndex += 1;
				this.destinationIndex %= this.destinations.length;

				destination = this.destinations[this.destinationIndex];

				dx = destination.x - this.x;
				dy = destination.y - this.y;
				this.destinationCountdown = 50;
			}
		}
	}

	this.turnTo(destination, function () {
		var decelerationX = -0.5 * Math.sin(this.angle);
		var decelerationY = 0.5 * Math.cos(this.angle);
		var finaldx = dx + this.velX * this.velX / decelerationX / 2;
		var finaldy = dy + this.velY * this.velY / decelerationY / 2;

		var dot = finaldx * decelerationX + finaldy * decelerationY;

		if (dot > 1) {
			this.thrust(-2);
		} else if (dot < -1) {
			this.thrust(1);
		} else if (dot > 0) {
			this.thrust(-0.5);
		}
	}.bind(this));


	if(!this.thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
}
// Remove function
Freighter.prototype.remove = function() {
	this.faction.remove(this);
}

module.exports = Freighter;
},{"./globals":13,"./ship":24,"./weapon":26}],13:[function(require,module,exports){
'use strict'

var globals = {};
module.exports = globals;
},{}],14:[function(require,module,exports){
"use strict";

var Ship = require('./ship');
var globals = require('./globals');
var Weapon = require('./weapon');

function GunShip(x, y, camera, canvas, faction, num) {
	Ship.apply(this, [x, y, camera, canvas, ""]);
	this.faction = faction;

	this.maxRotationSpeed = 0.2;
	this.width = 250;
	this.height = 250;
	this.radius = 125;

	this.hp = 300;
	this.maxhp = 300;
	this.maxShields = 100;
	this.shields = 100;

	this.image = this.faction.images['gunShip'];

	this.name = faction.name + " " + "gunShip " + num;

	this.weapon = new Weapon(50, 60, 20);

	this.enemies = faction.enemies;

}

GunShip.prototype = Object.create(Ship.prototype);
GunShip.prototype.constructor = GunShip;

// Remove function
GunShip.prototype.remove = function() {
	this.faction.remove(this);
}

module.exports = GunShip;
},{"./globals":13,"./ship":24,"./weapon":26}],15:[function(require,module,exports){
'use strict';

var helpers = {
	angle: function (object1, object2) {
		var dx = object2.x - object1.x;
		var dy = object2.y - object1.y;

		return Math.PI / 2 + Math.atan2(dy, dx);
	},
	angleDiff: function (angle1, angle2) {
		return helpers.mod((angle1 - angle2 + Math.PI), (Math.PI * 2)) - Math.PI;
	},
	mod: function mod(n, k) {
		return ((n % k) + k) % k;
	}
}

module.exports = helpers;
},{}],16:[function(require,module,exports){
'use strict';

function Input(canvas) {
	canvas.parentElement.onkeydown = this.onkeydown.bind(this);
	canvas.parentElement.onkeyup = this.onkeyup.bind(this);

	this.keys = {};
}

Input.prototype.onkeydown = function(e) {
	this.keys[e.keyCode] = true;
	//console.log(this.keys);
}

Input.prototype.onkeyup = function(e) {
	this.keys[e.keyCode] = false;
}

module.exports = Input;
},{}],17:[function(require,module,exports){
(function (global){
"use strict";

// Object imports
var Player = require('./player');
var Ball = require('./ball');
var Camera = require('./camera');
var Point = require('./point')['Point'];
var Background = require('./background');
var Input = require('./input');
var Asteroid = require('./asteroid');
var AsteroidField = require('./asteroidField');
var AsteroidRing = require('./asteroidRing');
var Planet = require('./planet');
var Faction = require('./faction');
var factionInfo = require('./factionInfo');

// Globals import
var globals = require('./globals');

// Variables import
var boxSize = require('./variables').boxSize;

// Drawing tools
var canvas;
var ctx;

var objectBoxes = require('./objectBoxes');
var CivilianShip = require('./civilianShip');

// Variables for global objects
var camera;
var miniMapCamera;
var background;
window.paused = false;
var player;
var input;
var asteroidField;
var asteroidRing;
var planets;
var projectilePool;
var factions;

// On load/constructor for game
window.onload = function () {
    window.globals = globals;
	canvas = document.getElementById('game-canvas');
	canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 10;
	console.log(canvas);
	ctx = canvas.getContext("2d");

    // Initialize variables and environment
	camera = new Camera(0, 0, 1, canvas);
    globals.camera = camera;
    miniMapCamera = new Camera(0, 0, 10);
    global.miniMapCamera = miniMapCamera;
    globals.canvas = canvas;

	player = new Player(50, 50, camera, canvas);
    input = new Input(canvas);

    background = new Background();
    asteroidField = new AsteroidField(-800, -10000, 2000, 150);
    asteroidRing = new AsteroidRing(-4000, 4000, 700, 900, 100);
    factions = [];
    planets = [];    
    for(name in factionInfo) {
        var faction = new Faction(name);
        factions.push(faction);
        planets.push(faction.basePlanet);
    }
    /*
    planets.push(new Planet(-4000, 0, 500, "images/planets/greenplanet.png", false)); 
    planets.push(new Planet(-2000, 500, 750, "images/planets/p1shaded.png", true));
    planets.push(new Planet(1000, 3000, 300, "images/planets/p2shaded.png", false));
    planets.push(new Planet(2000, 1700, 600, "images/planets/p3shaded.png", true));
    planets.push(new Planet(1500, -1500, 950, "images/planets/p4shaded.png", false));
    */
    var box = [player].concat(asteroidField.asteroids).concat(asteroidRing.asteroids);
    
    for(var i = 0; i < planets.length; i++) {
        box = box.concat(planets[i].getAsteroids());
    }

    for(var i = 0; i < factions.length; i++) {
        box = box.concat(factions[i].ships);
    }

    var ProjectilePool = require('./projectilePool');
    projectilePool = new ProjectilePool();
    globals.projectilePool = projectilePool;
    box.concat(projectilePool.projectiles);
    initializeObjectBoxes(box);

    globals.objectBoxes = objectBoxes;
    globals.frameCount = 0;
};

// Initializes collision boxes for objects in scenario
function initializeObjectBoxes(objects) {
    for (var i = 0; i < objects.length; i++) {
        objectBoxes.addObject(objects[i]);
    }
}

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
    	if (window.paused) return;
      update();
      draw();
  }, step);

// Update information for each object and running collisions.
function update() {
    if (input.keys[27]) {//ESC
        paused = true;
    }

    globals.frameCount++;

    var objects = [player]
    objects = objects.concat(asteroidField.asteroids);
    objects = objects.concat(asteroidRing.asteroids);
    objects = objects.concat(projectilePool.projectiles);
    for(var i = 0; i < planets.length; i++) {
        objects = objects.concat(planets[i].getAsteroids());
    }
    for(var i = 0; i < factions.length; i++) {
        objects = objects.concat(factions[i].ships);
    }

    player.update(input);
    for(var i = 0; i < factions.length; i++) {
        factions[i].update(objects);
    }
    asteroidField.update();
    asteroidRing.update();
    doCollisions(objects);
}

var boxes = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0]];

// Checks for collisions between objects. If they exist, completes momentum transfers.
function doCollisions(objects) {
    var currentT = 0;
    var minT;
    var minObject1, minObject2;
    while (currentT < 1) {
        minT = 1 - currentT;
        minObject1 = undefined;
        minObject2 = undefined;
        for (var i = 0; i < objects.length; i++) {
            for (var index = 0; index < boxes.length; index++) {
                var boxX = boxes[index][0];
                var boxY = boxes[index][1];
                var boxXnew = boxX + objects[i].boxX;
                var boxYnew = boxY + objects[i].boxY;
                if (!objectBoxes[[boxXnew, boxYnew]] ||
                    !objectBoxes[[boxXnew, boxYnew]].length) continue;
                for (var j = 0; j < objectBoxes[[boxXnew, boxYnew]].length; j++) {
                    var object2 = objectBoxes[[boxXnew, boxYnew]][j];
                    var dx = object2.x - objects[i].x;
                    var dy = object2.y - objects[i].y;

                    var dvx = object2.velX - objects[i].velX;
                    var dvy = object2.velY - objects[i].velY;

                    var ri = objects[i].radius;
                    var rj = object2.radius;
                    var r = ri + rj;

                    var b = 2 * (dvx * dx + dvy * dy);
                    if (b > 0) {
                        continue;
                    }

                    var a = (dvx * dvx + dvy * dvy);
                    var c = (dx * dx + dy * dy - r * r);

                    var discriminant = b * b - 4 * a * c;
                    if (discriminant < 0) {
                        continue;
                    }

                    var t = (-b - Math.sqrt(discriminant)) / 2 / a;
                    //console.log(t, minT);
                    if (t > 1 || t <= 0) continue;
                    //if (t < 1 && t > 0)
                    //    console.log("THERE WILL BE A COLLISION");
                    if (t < minT) {
                        minT = t;
                        minObject1 = objects[i];
                        minObject2 = object2;
                    }
                }
            }
        }

        //console.log(minT, minObject1);

        if (minObject1) {
            moveObjects(objects, minT);
            currentT += minT;
            doReaction(minObject1, minObject2);
        } else {
            moveObjects(objects, 1 - currentT);
            currentT = 1;
        }
    }
}

// Moves objects, resorting boxes and adjucting things.
function moveObjects(objects, t) {
    var oldBoxX, oldBoxY;
    for (var i = 0; i < objects.length; i++) {
        oldBoxX = objects[i].boxX;
        oldBoxY = objects[i].boxY;

        objects[i].x += objects[i].velX * t;
        objects[i].y += objects[i].velY * t;

        var newBoxX = Math.floor(objects[i].x / boxSize);
        var newBoxY = Math.floor(objects[i].y / boxSize);

        if (newBoxX !== oldBoxX || newBoxY !== oldBoxY) {
            objectBoxes.removeObject(objects[i]);
            objects[i].boxX = newBoxX;
            objects[i].boxY = newBoxY;
            objectBoxes.addObject(objects[i]);
        }
    }
}

// Collision between two objects
function doReaction(object1, object2) {
    var dx = object2.x - object1.x;
    var dy = object2.y - object1.y;

    var dvx = object2.velX - object1.velX;
    var dvy = object2.velY - object1.velY;

    var vx1 = object1.velX;
    var vy1 = object1.velY;

    var length = (dvx * dx + dvy * dy);
    length /= (dx * dx + dy * dy);

    var totalMass = (object1.mass + object2.mass);

    object1.velX += (length) * dx * object2.mass / totalMass * 2;
    object1.velY += (length) * dy * object2.mass / totalMass * 2;
    object2.velX = vx1 + dvx - (length) * dx * object1.mass / totalMass * 2;
    object2.velY = vy1 + dvy - (length) * dy * object1.mass / totalMass * 2;

    if (object1.onCollide) object1.onCollide(object2);
    if (object2.onCollide) object2.onCollide(object1);
}

// Drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(input.keys[77]) {
        drawMiniMap()
    } else {
        drawBackground();
        drawChars();
    }
    
}

// Draw background assets
function drawBackground() {
    background.draw(camera, ctx);

    for(var i = 0; i < planets.length; i++) {
        planets[i].draw(ctx, camera);
    }
    
    asteroidField.draw(ctx, camera);
    asteroidRing.draw(ctx, camera);
}

// Draw characters
function drawChars() {
    projectilePool.draw(ctx, camera);
    for(var i = 0; i < factions.length; i++) {
        factions[i].drawShips(ctx, camera);
    }
    player.draw(ctx, camera);
}

function drawMiniMap() {
    miniMapCamera.x = camera.x * camera.z / miniMapCamera.z + canvas.width / 2;
    miniMapCamera.y = camera.y * camera.z / miniMapCamera.z + canvas.height / 2;

    for(var i = 0; i < planets.length; i++) {
        planets[i].draw(ctx, miniMapCamera);
    }
    
    asteroidField.draw(ctx, miniMapCamera);
    asteroidRing.draw(ctx, miniMapCamera);

    for(var i = 0; i < factions.length; i++) {
        factions[i].drawShips(ctx, miniMapCamera);
    }
    projectilePool.draw(ctx, miniMapCamera);
    player.draw(ctx, miniMapCamera);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./asteroid":1,"./asteroidField":2,"./asteroidRing":3,"./background":4,"./ball":5,"./camera":6,"./civilianShip":8,"./faction":9,"./factionInfo":10,"./globals":13,"./input":16,"./objectBoxes":18,"./planet":19,"./player":20,"./point":21,"./projectilePool":23,"./variables":25}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
"use strict";

var AsteroidRing = require('./asteroidRing');
var Ball = require('./ball');

function Planet(x, y, radius, src, hasRing) {
	Ball.apply(this, [x, y]);
	this.radius = radius;
	this.src = src;
	this.hasRing = hasRing;
	if(this.hasRing) {
		this.ring = new AsteroidRing(this.x, this.y, this.radius + 100, this.radius + Math.floor(Math.random() * 300), this.radius / 30);
	}

	this.image = new Image();
	this.image.src = this.src;

	this.factions = {};
	this.factions["neutral"] = true;
}

Planet.prototype = Object.create(Ball.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.getAsteroids = function() {
	var asteroids = [];
	if(this.hasRing) {
		asteroids = asteroids.concat(this.ring.asteroids);
	}
	return asteroids;
}

Planet.prototype.draw = function(ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.radius / 2, -this.radius / 2, this.radius, this.radius);
	ctx.restore();

	if(this.hasRing) {
		this.ring.draw(ctx, camera);
	}
	
};

module.exports = Planet;
},{"./asteroidRing":3,"./ball":5}],20:[function(require,module,exports){
"use strict";

var Ball = require('./ball');

var globals = require('./globals');
var Projectile = require('./projectile');
var Ship = require('./ship');

function Player(x, y, camera, canvas) {
	Ship.apply(this, [x, y, camera, canvas, "images/spaceships/player_ship.png"]);
	this.name = "Player";
	this.crashSound = new Audio("sounds/Explosion20.wav");
	this.crashSound.volume = 0.5;
	this.maxVel = 30;
	this.points = 0;
}

Player.prototype = Object.create(Ship.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(input) {
	var rotationApplied = false;
	var thrustApplied = false;

	this.regenShields();

	if (input.keys[68]) {//D
		rotationApplied = this.thrustAccel(0.01);
	}
	if (input.keys[65]) {//A
		rotationApplied = this.thrustAccel(-0.01);
	}

	if (input.keys[87]) {//W
		thrustApplied = this.thrust(1);
	}

	if (input.keys[83]) {//S
		thrustApplied = this.thrust(-1);
	}

	if (input.keys[32]) {// space
		this.fire();
	}	

	if(!thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	}

	this.angle += this.rotation;

	this.camera.z = 1 + Math.sqrt(Math.abs(this.velX) + Math.abs(this.velY)) / 10;
	if (this.camera.z > 10) this.camera.z = 10;

	this.camera.center(this.x + this.width / 2, this.y + this.height / 2);
};

Player.prototype.onCollide = function (object) {
	this.crashSound.play();
}

Player.prototype.draw = function(ctx, camera) {
	Ship.prototype.draw.call(this, ctx, camera);
	this.drawHealthBar(ctx);
	ctx.fillText(this.x + ", " + this.y, 50, 50);
	ctx.textAlign = "left";      
	ctx.fillText("Points: " + this.points, globals.canvas.width / 2, globals.canvas.height - 50);

}

Player.prototype.drawHealthBar = function(ctx) {
	var x = 100
	var y = globals.canvas.height - 200;
	var shieldWidth = 260 * this.shields / this.maxShields;
	var healthWidth = 260 * this.hp / this.maxhp;
	ctx.fillStyle = "#151B54";
	ctx.fillRect(x, y, 300, 100);
	ctx.fillStyle = "#368BC1";
	ctx.fillRect(x + 20, y + 20, shieldWidth, 25);
	ctx.fillStyle = "white";
	ctx.font = "20px sansserif";
	ctx.fillText(this.shields + " / " + this.maxShields, x + 30, y + 40);
	ctx.fillStyle = "#52D017";
	ctx.fillRect(x + 20, y + 55, healthWidth, 25);
	ctx.fillStyle = "white";
	ctx.fillText(this.hp + " / " + this.maxhp, x + 30, y + 75);
}

module.exports = Player;
},{"./ball":5,"./globals":13,"./projectile":22,"./ship":24}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
'use strict';

var Ball = require('./ball');

function Projectile(x, y, velX, velY, pool, origin, damage) {
	Ball.apply(this, [x, y]);
	this.velX = velX;
	this.velY = velY;
	this.radius = 8;
	this.width = 16;
	this.height = 16;
	this.origin = origin;
	this.mass = 2;
	this.damage = damage;

	this.pool = pool;
	this.pool.addProjectile(this);

	this.type = 'projectile';
}

Projectile.prototype = Object.create(Ball.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.onCollide = function(object) {
	object.onHit(this.damage, this.origin);
	this.remove();
}

Projectile.prototype.remove = function() {
	this.pool.remove(this);
}

module.exports = Projectile;
},{"./ball":5}],23:[function(require,module,exports){
'use strict';

var objectBoxes = require('./objectBoxes');

function ProjectilePool() {
	this.projectiles = [];
}

ProjectilePool.prototype.addProjectile = function(projectile) {
	this.projectiles.push(projectile);
	objectBoxes.addObject(projectile);
}

ProjectilePool.prototype.remove = function(projectile) {
	var index = this.projectiles.indexOf(projectile);
	this.projectiles.splice(index, 1);
	objectBoxes.removeObject(projectile);
}

ProjectilePool.prototype.draw = function (ctx, camera) {
	for (var i = 0; i < this.projectiles.length; i++) {
		this.projectiles[i].draw(ctx, camera);
	}
}

ProjectilePool.prototype.update = function(input) {
	for (var i = 0; i < this.projectiles.length; i++) {
		this.projectiles[i].update(input);
	}
};

module.exports = ProjectilePool;
},{"./objectBoxes":18}],24:[function(require,module,exports){
"use strict";

var helpers = require('./helpers');

var Ball = require('./ball');
var xPlusYDistance = require('./point')['xPlusYDistance'];
var Weapon = require('./weapon');

function Ship(x, y, camera, canvas, src) {
	Ball.apply(this, [x, y]);
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.camera = camera;
	this.canvas = canvas;
	this.lastRegen = -1000;


	this.velX = 0;
	this.velY = 0;
	// Max linear velocity of ship (x and y hypotenuse)
	this.maxVel = 20;

	this.rotation = 0;
	// Max rotation speed of ship
	this.maxRotationSpeed = 0.4;
	this.width = 128;
	this.height = 128;
	this.radius = 128 / 2;

	// Hit points
	this.hp = 128;
	this.maxhp = this.hp;
	this.maxShields = 50;
	this.shields = 50;

	this.points = this.maxhp;

	this.image = new Image();
	this.image.src = src;
	

	this.enemies = {};
	this.enemies['Player'] = true;
	this.name = "Enemy";

	this.oldDistance = 100000000000000;
	this.oldAngle = 0;

	this.weapon = new Weapon(50, 30, 20);
}

Ship.prototype = Object.create(Ball.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.thrust = function(accel) {
	var newVelX = this.velX + Math.sin(this.angle) * accel;
	var newVelY = this.velY - Math.cos(this.angle) * accel;
	var newVel = Math.sqrt(Math.pow(newVelX, 2) + Math.pow(newVelY, 2));
	var oldVel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
	if((newVel < this.maxVel) || (newVel < oldVel)) {
		this.velX = newVelX;
		this.velY = newVelY;
	} else {
		this.velX = newVelX * this.maxVel / newVel;
		this.velY = newVelY * this.maxVel / newVel;
	}
	this.thrustApplied = true;
}

// Fire method
Ship.prototype.fire = function() {
	if(this.weapon) {
		this.weapon.fire(this);
	}
}

Ship.prototype.onHit = function (damage, source) {
	if (source.name === this.name || source.name.split(' ')[0] === this.faction) {

	} else if(source){
		this.enemies[source.name] = true;
	}
	if(damage > this.shields) {
		damage -= this.shields;
		this.shields = 0;
		this.hp -= damage;
		if(this.hp <= 0) {
			if(source) {
				source.points += this.points;
			}
			this.remove();
		}
	} else {
		this.shields -= damage;
	}
}

Ship.prototype.remove = function() {
}

Ship.prototype.regenShields = function() {
	if(globals.frameCount - this.lastRegen > 15) {
		this.lastRegen = globals.frameCount;
		if(this.shields < this.maxShields) {
			this.shields++;
		}		
	}
}

Ship.prototype.thrustAccel = function(accel) {

	if(Math.abs(this.rotation + accel) < this.maxRotationSpeed) {
		this.rotation += accel;
	}

	this.rotationApplied = true;
}

Ship.prototype.update = function(objects) {
	this.rotationApplied = false;
	this.thrustApplied = false;

	this.regenShields();

	// Find closest enemy
	var closestEnemy = {};
	for(var i = 0; i < objects.length; i++) {
		if(this.enemies[objects[i].name]) {
			var distance = xPlusYDistance(objects[i].x, objects[i].y, this.x, this.y);
			if(!closestEnemy.enemy || closestEnemy.distance > distance) {
				closestEnemy.enemy = objects[i];
				closestEnemy.distance = distance;
			}
		}
	}

	// Head towards closest enemy is far away
	if(closestEnemy.enemy) {
		var enemy = closestEnemy.enemy;
		if(closestEnemy.distance < 10) { // Back away
			// RUN AWAY?

		} else {
			/*var distance = closestEnemy.distance;
			var ratio = distance / this.oldDistance;*/
			var angle = this.oldAngle;
			/*if (ratio < 0.9 || ratio > 1.1) {*/
				angle = helpers.angle(this, closestEnemy.enemy);
				/*this.oldDistance = distance;
				this.oldAngle = angle;
			}*/
			var angleDiff = helpers.angleDiff(this.angle, angle);

			//console.log('angleDiff', angleDiff);

			var decelerateRotation;
			if (this.rotation !== 0) {
				decelerateRotation = -this.rotation / Math.abs(this.rotation) * 0.005;
			} else {
				decelerateRotation = -0.01;
			}

			if (this.rotation > 0.1) { //Slow down
				this.thrustAccel(decelerateRotation);
				if (Math.abs(angleDiff) < 0.3) this.thrust(0.5);
				return;
			} else {
				var finalAngle = angleDiff - this.rotation * this.rotation / decelerateRotation / 2;
				finalAngle = helpers.mod((finalAngle + Math.PI), (Math.PI * 2)) - Math.PI;
				//console.log('finalAngle', finalAngle);
				if (finalAngle > Math.PI / 2 || finalAngle < -Math.PI / 2) {
					if (Math.abs(this.rotation) > 0.05) {
						this.thrustAccel(decelerateRotation);
					} else {
						this.thrustAccel(-angleDiff / Math.abs(angleDiff) * 0.01);
					}
				} else if (finalAngle > 0.01) {
					this.thrustAccel(-0.01);
				} else if (finalAngle < -0.01) {
					this.thrustAccel(0.01);
				} else {
					this.thrustAccel(decelerateRotation);
					if (angleDiff < 0.3 && angleDiff > -0.3) {
						this.thrust(0.5);
						if (closestEnemy.distance < 500 + this.height) {
							this.weapon.fire(this);
						}
					}
				}
			}


		}
	}

	if(!this.thrustApplied) {
		if(this.velX < 0.1 && this.velX > -0.1) {
			this.velX = 0;
		} else {
			this.velX = this.velX * 0.99;
		}

		if(this.velY < 0.1 && this.velY > -0.1) {
			this.velY = 0;
		} else {
			this.velY = this.velY * 0.99;
		}
	}

	if(!this.rotationApplied) {
		if(this.rotation < 0.001 && this.rotation > -0.001) {
			this.rotation = 0;
		} else {
			this.rotation *= 0.99;
		}
	} 
	
	this.angle += this.rotation;
};

Ship.prototype.turnTo = function(object, alignedCallback) {
	var angle = helpers.angle(this, object);
	var angleDiff = helpers.angleDiff(this.angle, angle);

	//console.log('angleDiff', angleDiff);

	var decelerateRotation;
	if (this.rotation !== 0) {
		decelerateRotation = -this.rotation / Math.abs(this.rotation) * 0.005;
	} else {
		decelerateRotation = -0.01;
	}

	if (this.rotation > 0.1) { //Slow down
		this.thrustAccel(decelerateRotation);
		if (Math.abs(angleDiff) < 0.3) this.thrust(0.5);
		return;
	} else {
		var finalAngle = angleDiff - this.rotation * this.rotation / decelerateRotation / 2;
		finalAngle = helpers.mod((finalAngle + Math.PI), (Math.PI * 2)) - Math.PI;
		//console.log('finalAngle', finalAngle);
		if (finalAngle > Math.PI / 2 || finalAngle < -Math.PI / 2) {
			if (Math.abs(this.rotation) > 0.05) {
				this.thrustAccel(decelerateRotation);
			} else {
				this.thrustAccel(-angleDiff / Math.abs(angleDiff) * 0.01);
			}
		} else if (finalAngle > 0.01) {
			this.thrustAccel(-0.01);
		} else if (finalAngle < -0.01) {
			this.thrustAccel(0.01);
		} else {
			this.thrustAccel(decelerateRotation);
			if (angleDiff < 0.3 && angleDiff > -0.3) {
				if (alignedCallback) alignedCallback();
			}
		}
	}
};

Ship.prototype.draw = function (ctx, camera) {
	ctx.save();

	camera.applyTransform(ctx);
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);

	ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height	);
	ctx.restore();
}

module.exports = Ship;
},{"./ball":5,"./helpers":15,"./point":21,"./weapon":26}],25:[function(require,module,exports){
'use strict';

module.exports = {
	boxSize: 450
};
},{}],26:[function(require,module,exports){
"use strict";

var Projectile = require('./projectile');
var globals = require('./globals');

function Weapon(damage, rof, speed) {
	// 10 Damage per shot
	this.damage = damage;

	// 5 Wait frames between shots
	this.rof = rof;

	// Last frame shot was fired initiated to negative
	this.lastFire = -1000;

	this.speed = speed;
}

// Shoots a projectile from the gun if cooldown is over.
Weapon.prototype.fire = function(origin) {
	if((globals.frameCount - this.lastFire) > this.rof) {
		this.lastFire = globals.frameCount;
		new Projectile(origin.x, origin.y,
			Math.sin(origin.angle) * this.speed + origin.velX,
			 -Math.cos(origin.angle) * this.speed + origin.velY,
			  globals.projectilePool, origin, this.damage);
	}
}

module.exports = Weapon;
},{"./globals":13,"./projectile":22}]},{},[17])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hc3Rlcm9pZC5qcyIsInNyYy9hc3Rlcm9pZEZpZWxkLmpzIiwic3JjL2FzdGVyb2lkUmluZy5qcyIsInNyYy9iYWNrZ3JvdW5kLmpzIiwic3JjL2JhbGwuanMiLCJzcmMvY2FtZXJhLmpzIiwic3JjL2NhcGl0YWxTaGlwLmpzIiwic3JjL2NpdmlsaWFuU2hpcC5qcyIsInNyYy9mYWN0aW9uLmpzIiwic3JjL2ZhY3Rpb25JbmZvLmpzIiwic3JjL2ZpZ2h0ZXJTaGlwLmpzIiwic3JjL2ZyZWlnaHRlci5qcyIsInNyYy9nbG9iYWxzLmpzIiwic3JjL2d1blNoaXAuanMiLCJzcmMvaGVscGVycy5qcyIsInNyYy9pbnB1dC5qcyIsInNyYy9tYWluLmpzIiwic3JjL29iamVjdEJveGVzLmpzIiwic3JjL3BsYW5ldC5qcyIsInNyYy9wbGF5ZXIuanMiLCJzcmMvcG9pbnQuanMiLCJzcmMvcHJvamVjdGlsZS5qcyIsInNyYy9wcm9qZWN0aWxlUG9vbC5qcyIsInNyYy9zaGlwLmpzIiwic3JjL3ZhcmlhYmxlcy5qcyIsInNyYy93ZWFwb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKTtcbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbmZ1bmN0aW9uIEFzdGVyb2lkKHgsIHksIHNpemUsIHBvb2wpIHtcblx0QmFsbC5hcHBseSh0aGlzLCBbeCwgeV0pO1xuXG5cdHRoaXMud2lkdGggPSBzaXplO1xuXHR0aGlzLmhlaWdodCA9IHNpemU7XG5cdHRoaXMucmFkaXVzID0gc2l6ZSAvIDI7XG5cblx0dGhpcy5tYXNzID0gc2l6ZTtcblx0dGhpcy5tYXhocCA9IHNpemU7XG5cdHRoaXMuaHAgPSBzaXplO1xuXG5cdHRoaXMucG9vbCA9IHBvb2w7XG5cblx0dGhpcy5jcmFzaFNvdW5kID0gbmV3IEF1ZGlvKFwic291bmRzL0FzdGVyb2lkQ3Jhc2gud2F2XCIpO1xuXHR0aGlzLmV4cGxvZGVTb3VuZCA9IG5ldyBBdWRpbyhcInNvdW5kcy9Bc3Rlcm9pZEV4cGxvc2lvbi53YXZcIik7XG5cblx0dGhpcy50eXBlID0gJ2FzdGVyb2lkJztcbn1cblxuQXN0ZXJvaWQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYWxsLnByb3RvdHlwZSk7XG5Bc3Rlcm9pZC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBc3Rlcm9pZDtcblxuQXN0ZXJvaWQucHJvdG90eXBlLmV4cGxvZGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5wb29sLnJlbW92ZSh0aGlzKTtcblxuXHR2YXIgZHgsIGR5O1xuXHRkeCA9IE1hdGguYWJzKHRoaXMueCAtIGdsb2JhbHMuY2FtZXJhLmNlbnRlcigpLngpO1xuXHRkeSA9IE1hdGguYWJzKHRoaXMueSAtIGdsb2JhbHMuY2FtZXJhLmNlbnRlcigpLnkpO1xuXG5cdGlmIChkeCArIGR5IDwgMTAwKSB7XG5cdFx0dGhpcy5leHBsb2RlU291bmQudm9sdW1lID0gMTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLmV4cGxvZGVTb3VuZC52b2x1bWUgPSAxMDAgLyAoZHggKyBkeSk7XG5cdH1cblx0dGhpcy5leHBsb2RlU291bmQucGxheSgpO1xufVxuXG5Bc3Rlcm9pZC5wcm90b3R5cGUub25IaXQgPSBmdW5jdGlvbiAoZGFtYWdlLCBzb3VyY2UpIHtcblx0dGhpcy5ocCAtPSBkYW1hZ2U7XG5cdGlmKHRoaXMuaHAgPD0gMCkge1xuXHRcdGlmKHNvdXJjZSkge1xuXHRcdFx0c291cmNlLnBvaW50cyArPSA1O1xuXHRcdH1cblx0XHR0aGlzLnBvb2wucmVtb3ZlKHRoaXMpO1xuXHR9XG59XG5cbkFzdGVyb2lkLnByb3RvdHlwZS5vbkNvbGxpZGUgPSBmdW5jdGlvbihvYmplY3QpIHtcblx0dmFyIGR4LCBkeTtcblx0ZHggPSBNYXRoLmFicyh0aGlzLnggLSBnbG9iYWxzLmNhbWVyYS5jZW50ZXIoKS54KTtcblx0ZHkgPSBNYXRoLmFicyh0aGlzLnkgLSBnbG9iYWxzLmNhbWVyYS5jZW50ZXIoKS55KTtcblxuXHRpZiAoZHggKyBkeSA8IDEwMCkge1xuXHRcdHRoaXMuY3Jhc2hTb3VuZC52b2x1bWUgPSAxO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuY3Jhc2hTb3VuZC52b2x1bWUgPSAxMDAgLyAoZHggKyBkeSk7XG5cdH1cblx0dGhpcy5jcmFzaFNvdW5kLnBsYXkoKTtcbn1cblxuQXN0ZXJvaWQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRpZih0aGlzLnZlbFggPCAwLjEgJiYgdGhpcy52ZWxYID4gLTAuMSkge1xuXHRcdHRoaXMudmVsWCA9IDA7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy52ZWxYID0gdGhpcy52ZWxYICogMC45OTtcblx0fVxuXG5cdGlmKHRoaXMudmVsWSA8IDAuMSAmJiB0aGlzLnZlbFkgPiAtMC4xKSB7XG5cdFx0dGhpcy52ZWxZID0gMDtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnZlbFkgPSB0aGlzLnZlbFkgKiAwLjk5O1xuXHR9XG5cblx0aWYodGhpcy5yb3RhdGlvbiA8IDAuMDAxICYmIHRoaXMucm90YXRpb24gPiAtMC4wMDEpIHtcblx0XHR0aGlzLnJvdGF0aW9uID0gMDtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnJvdGF0aW9uICo9IDAuOTk7XG5cdH1cblx0XG5cdHRoaXMueCArPSB0aGlzLnZlbFg7XG5cdHRoaXMueSArPSB0aGlzLnZlbFk7XG5cdHRoaXMuYW5nbGUgKz0gdGhpcy5yb3RhdGlvbjtcbn07XG5cbkFzdGVyb2lkLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBjYW1lcmEpIHtcblx0Y3R4LnNhdmUoKTtcblxuXHRjYW1lcmEuYXBwbHlUcmFuc2Zvcm0oY3R4KTtcblx0Y3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG5cdGN0eC5yb3RhdGUodGhpcy5hbmdsZSk7XG5cblx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRjdHguYXJjKDAsIDAsIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XG5cdGN0eC5maWxsU3R5bGUgPSAnYnJvd24nO1xuXHRjdHguZmlsbCgpO1xuXHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0Y3R4LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuXHRjdHguZmlsbFRleHQodGhpcy5ib3hYICsgXCIsIFwiICsgdGhpcy5ib3hZLCAwLCAwKTtcblx0Y3R4LnJlc3RvcmUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXN0ZXJvaWQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBc3Rlcm9pZCA9IHJlcXVpcmUoJy4vYXN0ZXJvaWQnKTtcbnZhciBvYmplY3RCb3hlcyA9IHJlcXVpcmUoJy4vb2JqZWN0Qm94ZXMnKTtcblxuLy8gQ3JlYXRlcyBhIGZpZWxkIG9mIGFzdHJvaWRzXG5mdW5jdGlvbiBBc3Rlcm9pZEZpZWxkKHgsIHksIHNpemUsIG51bV9hc3Rlcm9pZHMpIHtcblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcblx0dGhpcy5zaXplID0gc2l6ZTtcblx0dGhpcy5udW1fYXN0ZXJvaWRzID0gbnVtX2FzdGVyb2lkcztcblxuXHR0aGlzLmFzdGVyb2lkcyA9IFtdO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBudW1fYXN0ZXJvaWRzOyBpKyspIHtcblx0XHR0aGlzLmFzdGVyb2lkcy5wdXNoKG5ldyBBc3Rlcm9pZChNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogc2l6ZSkgKyB0aGlzLngsIE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiBzaXplKSArIHRoaXMueSwgMTAgKyBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogMTAwKSwgdGhpcykpO1xuXHR9XG59XHRcblxuQXN0ZXJvaWRGaWVsZC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oYXN0ZXJvaWQpIHtcblx0dmFyIGluZGV4T2YgPSB0aGlzLmFzdGVyb2lkcy5pbmRleE9mKGFzdGVyb2lkKTtcblx0dGhpcy5hc3Rlcm9pZHMuc3BsaWNlKGluZGV4T2YsIDEpO1xuXHRvYmplY3RCb3hlcy5yZW1vdmVPYmplY3QoYXN0ZXJvaWQpO1xufVxuXG5Bc3Rlcm9pZEZpZWxkLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBjYW52YXMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYXN0ZXJvaWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5hc3Rlcm9pZHNbaV0uZHJhdyhjdHgsIGNhbnZhcyk7XG5cdH1cbn07XG5cbkFzdGVyb2lkRmllbGQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5hc3Rlcm9pZHMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmFzdGVyb2lkc1tpXS51cGRhdGUoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3Rlcm9pZEZpZWxkOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQXN0ZXJvaWQgPSByZXF1aXJlKCcuL2FzdGVyb2lkJyk7XG52YXIgb2JqZWN0Qm94ZXMgPSByZXF1aXJlKCcuL29iamVjdEJveGVzJyk7XG5cbi8vIENyZWF0ZXMgYSBmaWVsZCBvZiBhc3Ryb2lkc1xuZnVuY3Rpb24gQXN0ZXJvaWRSaW5nKHgsIHksIGlubmVyUmFkaXVzLCBvdXRlclJhZGl1cywgbnVtX2FzdGVyb2lkcykge1xuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLmlubmVyUmFkaXVzID0gaW5uZXJSYWRpdXM7XG5cdHRoaXMub3V0ZXJSYWRpdXMgPSBvdXRlclJhZGl1cztcblx0dGhpcy5udW1fYXN0ZXJvaWRzID0gbnVtX2FzdGVyb2lkcztcblxuXHR0aGlzLmFzdGVyb2lkcyA9IFtdO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBudW1fYXN0ZXJvaWRzOyBpKyspIHtcblx0XHR2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG5cdFx0dmFyIHJhZGl1cyA9IE1hdGgucmFuZG9tKCkgKiAodGhpcy5vdXRlclJhZGl1cyAtIHRoaXMuaW5uZXJSYWRpdXMpO1xuXHRcdHRoaXMuYXN0ZXJvaWRzLnB1c2gobmV3IEFzdGVyb2lkKE1hdGguZmxvb3IoKHJhZGl1cyArIGlubmVyUmFkaXVzKSAqIE1hdGguY29zKGFuZ2xlKSArIHRoaXMueCksIFxuXHRcdFx0TWF0aC5mbG9vcigocmFkaXVzICsgaW5uZXJSYWRpdXMpICogTWF0aC5zaW4oYW5nbGUpICsgdGhpcy55KSwgMTAgKyBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogMTAwKSwgdGhpcykpO1xuXHR9XG59XHRcblxuQXN0ZXJvaWRSaW5nLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihhc3Rlcm9pZCkge1xuXHR2YXIgaW5kZXhPZiA9IHRoaXMuYXN0ZXJvaWRzLmluZGV4T2YoYXN0ZXJvaWQpO1xuXHR0aGlzLmFzdGVyb2lkcy5zcGxpY2UoaW5kZXhPZiwgMSk7XG5cdG9iamVjdEJveGVzLnJlbW92ZU9iamVjdChhc3Rlcm9pZCk7XG59XG5cbkFzdGVyb2lkUmluZy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCwgY2FudmFzKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmFzdGVyb2lkcy5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuYXN0ZXJvaWRzW2ldLmRyYXcoY3R4LCBjYW52YXMpO1xuXHR9XG59O1xuXG5Bc3Rlcm9pZFJpbmcucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5hc3Rlcm9pZHMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLmFzdGVyb2lkc1tpXS51cGRhdGUoKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3Rlcm9pZFJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50JylbJ1BvaW50J107XG5cbi8vIEJhY2tncm91bmQgb2JqZWN0XG5mdW5jdGlvbiBCYWNrZ3JvdW5kKCkge1xuICAgIHRoaXMuZGVmYXVsdF93aWR0aCA9IDIwMDA7XG4gICAgdGhpcy5kZWZhdWx0X2hlaWdodCA9IDIwMDA7XG5cbiAgICB0aGlzLnN0YXJGaWVsZHMgPSB7fTtcblxuICAgIC8vIERyYXdzIGJhY2tncm91bmQgbWFkZSB1cCBvZiBmaWVsZHNcbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbihjYW1lcmEsIGN0eCkge1xuICAgICAgICB2YXIgZmllbGRzID0gdGhpcy5maW5kRmllbGRzKGNhbWVyYSk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIChmaWVsZHNbaV0uZHJhdykoY2FtZXJhLCBjdHgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhcnJheSBvZiBhbGwgZmllbGRzIHZpZXdhYmxlIGJ5IGNhbWVyYVxuICAgIHRoaXMuZmluZEZpZWxkcyA9IGZ1bmN0aW9uKGNhbWVyYSkge1xuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUtY2FudmFzJyk7XG4gICAgICAgIHZhciBlZGdlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSBNYXRoLmZsb29yKChjYW1lcmEubGVmdCgpKSAvIDIwMDAgLSAyKTsgaSA8IE1hdGguZmxvb3IoKGNhbWVyYS5yaWdodCgpKSAvIDIwMDAgKyAyKTsgaSsrKSB7XG4gICAgICAgICAgICBmb3IodmFyIGogPSBNYXRoLmZsb29yKChjYW1lcmEudG9wKCkpIC8gMjAwMCAtIDIpOyBqIDwgTWF0aC5mbG9vcigoY2FtZXJhLmJvdHRvbSgpKSAvIDIwMDAgKyAyKTsgaisrKSB7XG4gICAgICAgICAgICAgICAgZWRnZXMucHVzaCh0aGlzLmdldFN0YXJGaWVsZChpICogMjAwMCxcbiAgICAgICAgICAgICAgICAgICAgaiAqIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWRnZXM7XG4gICAgfVxuXG4gICAgLy8gUmV0cmVpdmVzIHN0YXJmaWVsZCBhdCB4LCB5IGNvb3JkaW5hdGVcbiAgICB0aGlzLmdldFN0YXJGaWVsZCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdmFyIGtleSA9IHggKyBcIiBcIiArIHk7XG4gICAgICAgIGlmICghdGhpcy5zdGFyRmllbGRzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhckZpZWxkc1trZXldID0gbmV3IFN0YXJGaWVsZCh4LCB5LCB0aGlzLmRlZmF1bHRfd2lkdGgsIHRoaXMuZGVmYXVsdF9oZWlnaHQsIDUsIDE1LCAyMDAsIDUwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGFyRmllbGRzW2tleV07XG4gICAgfVxuXG5cbn1cblxuLy8gQSBmaWVsZCBvZiBzdGFycyBhcyBvbmUgY2h1bmsgb2Ygd2lkdGggYW5kIGhlaWdodFxuZnVuY3Rpb24gU3RhckZpZWxkKHgsIHksIHdpZHRoLCBoZWlnaHQsIHNtYWxsU3RhcldpZHRoLCBsYXJnZVN0YXJXaWR0aCwgbnVtU21hbGxTdGFycywgbnVtQmlnU3RhcnMpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgLy8gQXJyYXlzIG9mIHN0YXJzXG4gICAgdGhpcy5iaWdTdGFycyA9IFtdO1xuICAgIHRoaXMuc21hbGxTdGFycyA9IFtdO1xuXG4gICAgLy8gV2lkdGggb2YgdGhlIGVudGlyZSBmaWVsZFxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIFdpZHRoIG9mIGVhY2gga2luZCBvZiBzdGFyXG4gICAgdGhpcy5zbWFsbFN0YXJXaWR0aCA9IHNtYWxsU3RhcldpZHRoO1xuICAgIHRoaXMubGFyZ2VTdGFyV2lkdGggPSBsYXJnZVN0YXJXaWR0aDtcblxuICAgIC8vIEdlbiBsYXJnZSBzdGFycyBjb29yZHNcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbnVtQmlnU3RhcnM7IGkrKykge1xuICAgICAgICB2YXIgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgpO1xuICAgICAgICB2YXIgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5iaWdTdGFycy5wdXNoKG5ldyBQb2ludCh4LCB5KSk7XG4gICAgfVxuXG4gICAgLy8gR2VuIHNtYWxsIHN0YXJzIGNvb3Jkc1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBudW1TbWFsbFN0YXJzOyBpKyspIHsgICBcbiAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoKTtcbiAgICAgICAgdmFyIHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuc21hbGxTdGFycy5wdXNoKG5ldyBQb2ludCh4LCB5KSk7XG4gICAgfVxuICAgIFxuICAgIC8vIERyYXcgdGhlIGZpZWxkXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oY2FtZXJhLCBjdHgpIHtcbiAgICAgICAgLy8gRHJhdyBhIHdoaXRlIHJlY3RhbmdsZSBmb3IgZWFjaCBzbWFsbCBzdGFyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnNtYWxsU3RhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0cmFuc0Nvb3JkcyA9IGNhbWVyYS50cmFuc2Zvcm0odGhpcy54ICsgdGhpcy5zbWFsbFN0YXJzW2ldLngsIHRoaXMueSArIHRoaXMuc21hbGxTdGFyc1tpXS55KTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QodHJhbnNDb29yZHNbMF0sIHRyYW5zQ29vcmRzWzFdLCB0aGlzLnNtYWxsU3RhcldpZHRoLCB0aGlzLnNtYWxsU3RhcldpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEcmF3IGEgeWVsbG93IHJlY3RhbmdsZSBmb3IgZWFjaCBsYXJnZSBzdGFyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmJpZ1N0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNDb29yZHMgPSBjYW1lcmEudHJhbnNmb3JtKHRoaXMueCArIHRoaXMuYmlnU3RhcnNbaV0ueCwgdGhpcy55ICsgdGhpcy5iaWdTdGFyc1tpXS55KTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInllbGxvd1wiO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHRyYW5zQ29vcmRzWzBdLCB0cmFuc0Nvb3Jkc1sxXSwgdGhpcy5sYXJnZVN0YXJXaWR0aCwgdGhpcy5sYXJnZVN0YXJXaWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBib3hTaXplID0gcmVxdWlyZSgnLi92YXJpYWJsZXMnKS5ib3hTaXplO1xuXG5mdW5jdGlvbiBCYWxsKHgsIHkpIHtcblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcblxuXHR0aGlzLmJveFggPSBNYXRoLmZsb29yKHggLyBib3hTaXplKTtcblx0dGhpcy5ib3hZID0gTWF0aC5mbG9vcih5IC8gYm94U2l6ZSk7XG5cblx0dGhpcy5hbmdsZSA9IDA7XG5cblx0dGhpcy52ZWxYID0gMDtcblx0dGhpcy52ZWxZID0gMDtcblx0dGhpcy5yb3RhdGlvbiA9IDA7XG5cblx0dGhpcy53aWR0aCA9IDY0O1xuXHR0aGlzLmhlaWdodCA9IDY0O1xuXHR0aGlzLnJhZGl1cyA9IDMyO1xuXG5cdHRoaXMubWFzcyA9IDMyO1xuXHR0aGlzLm1heGhwID0gMzI7XG5cdHRoaXMuaHAgPSAzMjtcbn1cblxuQmFsbC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCwgY2FtZXJhKSB7XG5cdGN0eC5zYXZlKCk7XG5cblx0Y2FtZXJhLmFwcGx5VHJhbnNmb3JtKGN0eCk7XG5cdGN0eC50cmFuc2xhdGUodGhpcy54LCB0aGlzLnkpO1xuXHRjdHgucm90YXRlKHRoaXMuYW5nbGUpO1xuXG5cdGN0eC5iZWdpblBhdGgoKTtcblx0Y3R4LmFyYygwLCAwLCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuXHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0Y3R4LmZpbGwoKTtcblx0Y3R4LnJlc3RvcmUoKTtcbn07XG5cbkJhbGwucHJvdG90eXBlLm9uSGl0ID0gZnVuY3Rpb24oZGFtYWdlLCBzb3VyY2UpIHtcblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsbDsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vcG9pbnQnKVsnUG9pbnQnXTtcblxudmFyIERFRkFVTFRfREVQVEggPSAxO1xuXG4vLyBDYW1lcmEgZm9yIGdhbWUsIHVzZWQgdG8gdHJhbnNmb3JtIGRyYXcgY2FsbHMgZm9yIGRpZmZlcmVudCBwZXJzcGVjdGl2ZXMgb2YgdGhlIG1hcFxuZnVuY3Rpb24gQ2FtZXJhKHgsIHksIHosIGNhbnZhcykge1xuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLnogPSB6O1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgLy8gQXBwbGllcyBjYW1lcmEgdHJhbnNmb3JtYXRpb25zIGZyb20geCB5IHBvc2l0aW9ucyB0byBjYW1lcmFcbiAgICAvLyBQb3NpdGlvbnNcbiAgICB0aGlzLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICBcdHJldHVybiBbeCAqIHRoaXMuZ2V0WlNjYWxlKCkgKyB0aGlzLngsIFxuICAgIFx0XHR5ICogdGhpcy5nZXRaU2NhbGUoKSArIHRoaXMueV07XG4gICAgfVxuXG4gICAgLy8gUmV0cmVpdmVzIG9yaWdpbmFsIGNvb3JkaW5hdGVzIGJlZm9yZSB0cmFuc2Zvcm1hdGlvbiBcbiAgICB0aGlzLmFudGlUcmFuc2Zvcm0gPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgXHRyZXR1cm4gbmV3IFBvaW50KCh4IC0gdGhpcy54KSAvIHRoaXMuZ2V0WlNjYWxlKCksICh5IC0gdGhpcy55KSAvIHRoaXMuZ2V0WlNjYWxlKCkpO1xuICAgIH0gIFxuXG4gICAgdGhpcy5hcHBseVRyYW5zZm9ybSA9IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgICB2YXIgc2NhbGUgPSB0aGlzLmdldFpTY2FsZSgpO1xuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyBhIHNjYWxpbmcgZmFjdG9yIGZvciBzaXplIG9mIGl0ZW1zIG9uIDJkIHBsYW5lIGJhc2VkIG9uIHogaW5kZXguXG4gICAgdGhpcy5nZXRaU2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICBcdHJldHVybiAxLjAgKiBERUZBVUxUX0RFUFRIIC8gdGhpcy56O1xuICAgIH1cblxuICAgIC8vIENoYW5nZXMgWCBwb3NpdGlvblxuICAgIHRoaXMubW92ZVggPSBmdW5jdGlvbih4KSB7XG4gICAgXHR0aGlzLnggPSB4O1xuICAgIH1cblxuICAgIC8vIENoYW5nZXMgWSBwb3NpdGlvblxuICAgIHRoaXMubW92ZVkgPSBmdW5jdGlvbih5KSB7XG4gICAgXHR0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIC8vIENoYW5nZXMgWiBwb3NpdGlvblxuICAgIHRoaXMubW92ZVogPSBmdW5jdGlvbih6KSB7XG4gICAgXHR0aGlzLnogPSB6O1xuICAgIH1cblxuICAgIHRoaXMubGVmdCA9IGZ1bmN0aW9uKCkge1xuICAgIFx0cmV0dXJuIC10aGlzLnggLyB0aGlzLmdldFpTY2FsZSgpO1xuICAgIH1cbiAgICB0aGlzLnJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgXHRyZXR1cm4gLXRoaXMueCAvIHRoaXMuZ2V0WlNjYWxlKCkgKyB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuZ2V0WlNjYWxlKCk7XG4gICAgfVxuICAgIHRoaXMudG9wID0gZnVuY3Rpb24oKSB7XG4gICAgXHRyZXR1cm4gLXRoaXMueSAvIHRoaXMuZ2V0WlNjYWxlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5ib3R0b20gPSBmdW5jdGlvbigpIHtcbiAgICBcdHJldHVybiAtdGhpcy55IC8gdGhpcy5nZXRaU2NhbGUoKSArIHRoaXMuY2FudmFzLmhlaWdodCAvIHRoaXMuZ2V0WlNjYWxlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IC1hcmd1bWVudHNbMF0gKiB0aGlzLmdldFpTY2FsZSgpICsgdGhpcy5jYW52YXMud2lkdGggLyAyO1xuICAgICAgICAgICAgdGhpcy55ID0gLWFyZ3VtZW50c1sxXSAqIHRoaXMuZ2V0WlNjYWxlKCkgKyB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IC10aGlzLnggKyB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMuZ2V0WlNjYWxlKCkgLyAyLFxuICAgICAgICAgICAgeTogLXRoaXMueSArIHRoaXMuY2FudmFzLmhlaWdodCAvIHRoaXMuZ2V0WlNjYWxlKCkgLyAyXG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcbnZhciBXZWFwb24gPSByZXF1aXJlKCcuL3dlYXBvbicpO1xuXG5mdW5jdGlvbiBDYXBpdGFsU2hpcCh4LCB5LCBjYW1lcmEsIGNhbnZhcywgZmFjdGlvbiwgbnVtKSB7XG5cdFNoaXAuYXBwbHkodGhpcywgW3gsIHksIGNhbWVyYSwgY2FudmFzLCBcIlwiXSk7XG5cdHRoaXMuZmFjdGlvbiA9IGZhY3Rpb247XG5cblx0dGhpcy5tYXhSb3RhdGlvblNwZWVkID0gMC4wNTtcblx0dGhpcy53aWR0aCA9IDUwMDtcblx0dGhpcy5oZWlnaHQgPSA1MDA7XG5cdHRoaXMucmFkaXVzID0gMjUwO1xuXG5cdHRoaXMuaHAgPSAxMDAwO1xuXHR0aGlzLm1heGhwID0gMTAwMDtcblx0dGhpcy5tYXhTaGllbGRzID0gNTAwO1xuXHR0aGlzLnNoaWVsZHMgPSA1MDA7XG5cblx0dGhpcy5pbWFnZSA9IHRoaXMuZmFjdGlvbi5pbWFnZXNbJ2NhcGl0YWxTaGlwJ107XG5cblx0dGhpcy5uYW1lID0gZmFjdGlvbi5uYW1lICsgXCIgXCIgKyBcImNhcGl0YWxTaGlwIFwiICsgbnVtO1xuXG5cdHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbigxMDAsIDE1MCwgMjApO1xuXG5cdHRoaXMuZW5lbWllcyA9IGZhY3Rpb24uZW5lbWllcztcblxufVxuXG5DYXBpdGFsU2hpcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNoaXAucHJvdG90eXBlKTtcbkNhcGl0YWxTaGlwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENhcGl0YWxTaGlwO1xuXG4vLyBSZW1vdmUgZnVuY3Rpb25cbkNhcGl0YWxTaGlwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5mYWN0aW9uLnJlbW92ZSh0aGlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYXBpdGFsU2hpcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xudmFyIFdlYXBvbiA9IHJlcXVpcmUoJy4vd2VhcG9uJyk7XG5cbmZ1bmN0aW9uIENpdmlsaWFuU2hpcCh4LCB5LCBjYW1lcmEsIGNhbnZhcywgZmFjdGlvbiwgbnVtKSB7XG5cdFNoaXAuYXBwbHkodGhpcywgW3gsIHksIGNhbWVyYSwgY2FudmFzLCBcIlwiXSk7XG5cdHRoaXMuZmFjdGlvbiA9IGZhY3Rpb247XG5cblx0dGhpcy5tYXhSb3RhdGlvblNwZWVkID0gMC4xO1xuXHR0aGlzLm1heFZlbCA9IDE1O1xuXG5cdHRoaXMud2lkdGggPSAxMjA7XG5cdHRoaXMuaGVpZ2h0ID0gMTIwO1xuXHR0aGlzLnJhZGl1cyA9IDEyMCAvIDI7XG5cblx0dGhpcy5ocCA9IDEyMDtcblx0dGhpcy5tYXhocCA9IDEyMDtcblx0dGhpcy5tYXhTaGllbGRzID0gMzA7XG5cdHRoaXMuc2hpZWxkcyA9IDMwO1xuXG5cdHRoaXMuZW5lbWllcyA9IGZhY3Rpb24uZW5lbWllcztcblxuXHR0aGlzLmltYWdlID0gdGhpcy5mYWN0aW9uLmltYWdlc1snY2l2aWxpYW4nXTtcblxuXHR0aGlzLm5hbWUgPSBmYWN0aW9uLm5hbWUgKyBcIiBcIiArIFwiY2l2aWxpYW4gXCIgKyBudW07XG5cblx0dGhpcy53ZWFwb24gPSBudWxsO1xuXG5cdHRoaXMuZGVzdGluYXRpb25JbmRleCA9IDA7XG5cdHRoaXMuZGVzdGluYXRpb25zID0gdGhpcy5mYWN0aW9uLmNpdmlsaWFuUm91dGU7XG59XG5cbkNpdmlsaWFuU2hpcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNoaXAucHJvdG90eXBlKTtcbkNpdmlsaWFuU2hpcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaXZpbGlhblNoaXA7XG5cbi8vIFJlbW92ZSBmdW5jdGlvblxuQ2l2aWxpYW5TaGlwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5mYWN0aW9uLnJlbW92ZSh0aGlzKTtcbn1cblxuQ2l2aWxpYW5TaGlwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbnNbdGhpcy5kZXN0aW5hdGlvbkluZGV4XTtcblx0dmFyIGR4ID0gZGVzdGluYXRpb24ueCAtIHRoaXMueDtcblx0dmFyIGR5ID0gZGVzdGluYXRpb24ueSAtIHRoaXMueTtcblx0dmFyIGRpc3RhbmNlVG9EZXN0aW5hdGlvbiA9IE1hdGguYWJzKGR4KSArIE1hdGguYWJzKGR5KTtcblxuXHR0aGlzLnJlZ2VuU2hpZWxkcygpO1xuXG5cdGlmIChkaXN0YW5jZVRvRGVzdGluYXRpb24gPCA0MDApIHtcblx0XHR2YXIgc3RvcHBlZCA9IE1hdGguYWJzKHRoaXMudmVsWCkgKyBNYXRoLmFicyh0aGlzLnZlbFkpIDwgNTtcblx0XHRpZiAoc3RvcHBlZCkge1xuXHRcdFx0Ly8gUkVBQ0hFRCBUSEUgREVTVElOQVRJT04uXG5cblx0XHRcdHRoaXMuZGVzdGluYXRpb25JbmRleCArPSAxO1xuXHRcdFx0dGhpcy5kZXN0aW5hdGlvbkluZGV4ICU9IHRoaXMuZGVzdGluYXRpb25zLmxlbmd0aDtcblxuXHRcdFx0ZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uc1t0aGlzLmRlc3RpbmF0aW9uSW5kZXhdO1xuXG5cdFx0XHRkeCA9IGRlc3RpbmF0aW9uLnggLSB0aGlzLng7XG5cdFx0XHRkeSA9IGRlc3RpbmF0aW9uLnkgLSB0aGlzLnk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50dXJuVG8oZGVzdGluYXRpb24sIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVjZWxlcmF0aW9uWCA9IC0wLjUgKiBNYXRoLnNpbih0aGlzLmFuZ2xlKTtcblx0XHR2YXIgZGVjZWxlcmF0aW9uWSA9IDAuNSAqIE1hdGguY29zKHRoaXMuYW5nbGUpO1xuXHRcdHZhciBmaW5hbGR4ID0gZHggKyB0aGlzLnZlbFggKiB0aGlzLnZlbFggLyBkZWNlbGVyYXRpb25YIC8gMjtcblx0XHR2YXIgZmluYWxkeSA9IGR5ICsgdGhpcy52ZWxZICogdGhpcy52ZWxZIC8gZGVjZWxlcmF0aW9uWSAvIDI7XG5cblx0XHR2YXIgZG90ID0gZmluYWxkeCAqIGRlY2VsZXJhdGlvblggKyBmaW5hbGR5ICogZGVjZWxlcmF0aW9uWTtcblxuXHRcdGlmIChkb3QgPiAxKSB7XG5cdFx0XHR0aGlzLnRocnVzdCgtMik7XG5cdFx0fSBlbHNlIGlmIChkb3QgPCAtMSkge1xuXHRcdFx0dGhpcy50aHJ1c3QoMSk7XG5cdFx0fSBlbHNlIGlmIChkb3QgPiAwKSB7XG5cdFx0XHR0aGlzLnRocnVzdCgtMC41KTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKSk7XG5cblxuXHRpZighdGhpcy50aHJ1c3RBcHBsaWVkKSB7XG5cdFx0aWYodGhpcy52ZWxYIDwgMC4xICYmIHRoaXMudmVsWCA+IC0wLjEpIHtcblx0XHRcdHRoaXMudmVsWCA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVsWCA9IHRoaXMudmVsWCAqIDAuOTk7XG5cdFx0fVxuXG5cdFx0aWYodGhpcy52ZWxZIDwgMC4xICYmIHRoaXMudmVsWSA+IC0wLjEpIHtcblx0XHRcdHRoaXMudmVsWSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVsWSA9IHRoaXMudmVsWSAqIDAuOTk7XG5cdFx0fVxuXHR9XG5cblx0aWYoIXRoaXMucm90YXRpb25BcHBsaWVkKSB7XG5cdFx0aWYodGhpcy5yb3RhdGlvbiA8IDAuMDAxICYmIHRoaXMucm90YXRpb24gPiAtMC4wMDEpIHtcblx0XHRcdHRoaXMucm90YXRpb24gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uICo9IDAuOTk7XG5cdFx0fVxuXHR9IFxuXHRcblx0dGhpcy5hbmdsZSArPSB0aGlzLnJvdGF0aW9uO1xufVxubW9kdWxlLmV4cG9ydHMgPSBDaXZpbGlhblNoaXA7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG52YXIgUGxhbmV0ID0gcmVxdWlyZSgnLi9wbGFuZXQnKTtcbnZhciBGaWdodGVyU2hpcCA9IHJlcXVpcmUoJy4vZmlnaHRlclNoaXAnKTtcbnZhciBDaXZpbGlhblNoaXAgPSByZXF1aXJlKCcuL2NpdmlsaWFuU2hpcCcpO1xudmFyIEZyZWlnaHRlciA9IHJlcXVpcmUoJy4vZnJlaWdodGVyJyk7XG52YXIgR3VuU2hpcCA9IHJlcXVpcmUoJy4vZ3VuU2hpcCcpO1xudmFyIENhcGl0YWxTaGlwID0gcmVxdWlyZSgnLi9jYXBpdGFsU2hpcCcpO1xudmFyIG9iamVjdEJveGVzID0gcmVxdWlyZSgnLi9vYmplY3RCb3hlcycpO1xuXG52YXIgZmFjdGlvbk5hbWVzID0gW1wiT3JnYW5pY3NcIiwgXCJQdXJwbGVcIiwgXCJEYXJrIEdyYXlcIiwgXCJSZWRcIiwgXCJCbHVlXCIsIFwiR3JlZW5cIiwgXCJPcmFuZ2VcIiwgXCJHcmF5XCJdO1xuXG52YXIgZmFjdGlvbkluZm8gPSByZXF1aXJlKCcuL2ZhY3Rpb25JbmZvJyk7XG52YXIgY2FtZXJhID0gZ2xvYmFscy5jYW1lcmE7XG52YXIgY2FudmFzID0gZ2xvYmFscy5jYW52YXM7XG5cbmZ1bmN0aW9uIEZhY3Rpb24obmFtZSkge1xuXHR0aGlzLm5hbWUgPSBuYW1lO1xuXG5cdHZhciBiYXNlUGxhbmV0ID0gZmFjdGlvbkluZm9bbmFtZV0ucGxhbmV0O1xuXHR0aGlzLmJhc2VQbGFuZXQgPSBuZXcgUGxhbmV0KGJhc2VQbGFuZXQueCwgYmFzZVBsYW5ldC55LCBiYXNlUGxhbmV0LnNpemUsIGJhc2VQbGFuZXQuc3JjLCBiYXNlUGxhbmV0Lmhhc1JpbmcpO1xuXG5cdHRoaXMuY2l2aWxpYW5Sb3V0ZSA9IGZhY3Rpb25JbmZvW25hbWVdLmNpdmlsaWFuUm91dGU7XG5cdC8vIE1hcCBvZiBlbmVtaWVzIGFuZCBib29sZWFucy4gRWcsIHRoaXMuZW5lbWllc1snb3JhbmdlJ10gPSB0cnVlXG5cdHRoaXMuZW5lbWllcyA9IHt9O1xuXG5cdC8vIEdlbmVyYXRlIGFsbCBzaGlwIG9iamVjdHMsIGFkZCB0byBib3hcblx0dGhpcy5zaGlwcyA9IFtdO1xuXG5cdC8vIEltYWdlIHJlc291cmNlIG9mIGFsbCBzaGlwcyBzbyB3ZSBjYW4gcmVjeWNsZSBpbWFnZXNcblx0dGhpcy5pbWFnZXMgPSB7fTtcblx0XG5cdC8vIENpdmlsaWFuc1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgZmFjdGlvbkluZm9bbmFtZV0uc2hpcHMuY2l2aWxpYW4ubnVtOyBpKyspIHtcblx0XHR0aGlzLmltYWdlcy5jaXZpbGlhbiA9IG5ldyBJbWFnZTtcblx0XHR0aGlzLmltYWdlcy5jaXZpbGlhbi5zcmMgPSBmYWN0aW9uSW5mb1tuYW1lXS5zaGlwcy5jaXZpbGlhbi5zcmM7XG5cdFx0dGhpcy5zaGlwcy5wdXNoKG5ldyBDaXZpbGlhblNoaXAodGhpcy5iYXNlUGxhbmV0LnggKyBpICogMTUwLCB0aGlzLmJhc2VQbGFuZXQueSArIDEyMCwgY2FtZXJhLCBjYW52YXMsIHRoaXMsIGkpKTtcblx0fVxuXG5cdC8vIEZyZWlnaHRlcnNcblx0Zm9yKHZhciBpID0gMDsgaSA8IGZhY3Rpb25JbmZvW25hbWVdLnNoaXBzLmZyZWlnaHRlci5udW07IGkrKykge1xuXHRcdHRoaXMuaW1hZ2VzLmZyZWlnaHRlciA9IG5ldyBJbWFnZTtcblx0XHR0aGlzLmltYWdlcy5mcmVpZ2h0ZXIuc3JjID0gZmFjdGlvbkluZm9bbmFtZV0uc2hpcHMuZnJlaWdodGVyLnNyYztcblx0XHR0aGlzLnNoaXBzLnB1c2gobmV3IEZyZWlnaHRlcih0aGlzLmJhc2VQbGFuZXQueCArIGkgKiA0MDAsIHRoaXMuYmFzZVBsYW5ldC55ICsgMzAwLCBjYW1lcmEsIGNhbnZhcywgdGhpcywgaSkpO1xuXHR9XG5cblx0Ly8gRmlnaHRlcnNcblx0Zm9yKHZhciBpID0gMDsgaSA8IGZhY3Rpb25JbmZvW25hbWVdLnNoaXBzLmZpZ2h0ZXIubnVtOyBpKyspIHtcblx0XHR0aGlzLmltYWdlcy5maWdodGVyID0gbmV3IEltYWdlO1xuXHRcdHRoaXMuaW1hZ2VzLmZpZ2h0ZXIuc3JjID0gZmFjdGlvbkluZm9bbmFtZV0uc2hpcHMuZmlnaHRlci5zcmM7XG5cdFx0dGhpcy5zaGlwcy5wdXNoKG5ldyBGaWdodGVyU2hpcCh0aGlzLmJhc2VQbGFuZXQueCArIGkgKiAxMjAsIHRoaXMuYmFzZVBsYW5ldC55LCBjYW1lcmEsIGNhbnZhcywgdGhpcywgaSwgdGhpcy5zaGlwc1tpXSkpO1xuXHR9XG5cblx0Ly8gR3Vuc2hpcHNcblx0Zm9yKHZhciBpID0gMDsgaSA8IGZhY3Rpb25JbmZvW25hbWVdLnNoaXBzLmd1blNoaXAubnVtOyBpKyspIHtcblx0XHR0aGlzLmltYWdlcy5ndW5TaGlwID0gbmV3IEltYWdlO1xuXHRcdHRoaXMuaW1hZ2VzLmd1blNoaXAuc3JjID0gZmFjdGlvbkluZm9bbmFtZV0uc2hpcHMuZ3VuU2hpcC5zcmM7XG5cdFx0dGhpcy5zaGlwcy5wdXNoKG5ldyBHdW5TaGlwKHRoaXMuYmFzZVBsYW5ldC54ICsgaSAqIDMwMCwgdGhpcy5iYXNlUGxhbmV0LnkgKyA3MDAsIGNhbWVyYSwgY2FudmFzLCB0aGlzLCBpKSk7XG5cdH1cblxuXHQvLyBDYXBpdGFsIFNoaXBzXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBmYWN0aW9uSW5mb1tuYW1lXS5zaGlwcy5jYXBpdGFsU2hpcC5udW07IGkrKykge1xuXHRcdHRoaXMuaW1hZ2VzLmNhcGl0YWxTaGlwID0gbmV3IEltYWdlO1xuXHRcdHRoaXMuaW1hZ2VzLmNhcGl0YWxTaGlwLnNyYyA9IGZhY3Rpb25JbmZvW25hbWVdLnNoaXBzLmNhcGl0YWxTaGlwLnNyYztcblx0XHR0aGlzLnNoaXBzLnB1c2gobmV3IENhcGl0YWxTaGlwKHRoaXMuYmFzZVBsYW5ldC54ICsgaSAqIDYwMCwgdGhpcy5iYXNlUGxhbmV0LnkgKyAxMzAwLCBjYW1lcmEsIGNhbnZhcywgdGhpcywgaSkpO1xuXHR9XG59XG5cbi8vIERyYXdzIHNoaXBzXG5GYWN0aW9uLnByb3RvdHlwZS5kcmF3U2hpcHMgPSBmdW5jdGlvbihjdHgsIGNhbWVyYSkge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5zaGlwcy5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuc2hpcHNbaV0uZHJhdyhjdHgsIGNhbWVyYSk7XG5cdH1cbn1cblxuLy8gRHJhd3MgcGxhbmV0XG5GYWN0aW9uLnByb3RvdHlwZS5kcmF3UGxhbmV0ID0gZnVuY3Rpb24oY3R4LCBjYW1lcmEpIHtcblx0dGhpcy5iYXNlUGxhbmV0LmRyYXcoY3R4LCBjYW1lcmEpO1xufVxuXG5GYWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvYmplY3RzKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5zaGlwc1tpXS51cGRhdGUob2JqZWN0cyk7XG5cdH1cbn1cblxuRmFjdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oc2hpcCkge1xuXHR2YXIgaW5kZXhPZiA9IHRoaXMuc2hpcHMuaW5kZXhPZihzaGlwKTtcblx0dGhpcy5zaGlwcy5zcGxpY2UoaW5kZXhPZiwgMSk7XG5cdG9iamVjdEJveGVzLnJlbW92ZU9iamVjdChzaGlwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGYWN0aW9uOyIsInZhciBmYWN0aW9uSW5mbyA9IHtcblx0XCJPcmdhbmljc1wiOiB7XG5cdFx0XCJwbGFuZXRcIjoge1xuXHRcdFx0XCJ4XCI6IDQwMDAsXG5cdFx0XHRcInlcIjogMzAwMCxcblx0XHRcdFwic2l6ZVwiOiA3NTAsXG5cdFx0XHRcInNyY1wiOiBcImltYWdlcy9wbGFuZXRzL3A0c2hhZGVkLnBuZ1wiLFxuXHRcdFx0XCJoYXNSaW5nXCI6IGZhbHNlXG5cdFx0fSxcblx0XHRcImNpdmlsaWFuUm91dGVcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHR4OiA0MDAwLFxuXHRcdFx0XHR5OiAzMDAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IDMwMDAsXG5cdFx0XHRcdHk6IC0xMDAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IDEwMDAwLFxuXHRcdFx0XHR5OiAwXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInNoaXBzXCI6IHtcblx0XHRcdFwiZmlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDUsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYWxpZW4zLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJjaXZpbGlhblwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDIsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYWxpZW40LnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJmcmVpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAyLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2hlYXZ5ZnJlaWdodGVyLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJndW5TaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMyxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9hbGllbjIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNhcGl0YWxTaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMSxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9hbGllbjEucG5nXCJcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJQdXJwbGVcIjoge1xuXHRcdFwicGxhbmV0XCI6IHtcblx0XHRcdFwieFwiOiAtMTAwMDAsXG5cdFx0XHRcInlcIjogMCxcblx0XHRcdFwic2l6ZVwiOiA1MDAsXG5cdFx0XHRcInNyY1wiOiBcImltYWdlcy9wbGFuZXRzL3AxMHNoYWRlZC5wbmdcIixcblx0XHRcdFwiaGFzUmluZ1wiOiBmYWxzZVxuXHRcdH0sXG5cdFx0XCJjaXZpbGlhblJvdXRlXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0eDogLTEwNTAwLFxuXHRcdFx0XHR5OiAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IDI1MDAsXG5cdFx0XHRcdHk6IC0xMDAwXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInNoaXBzXCI6IHtcblx0XHRcdFwiZmlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDUsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYXR0NS5wbmdcIlxuXHRcdFx0fSxcblx0XHRcdFwiY2l2aWxpYW5cIjoge1xuXHRcdFx0XHRcIm51bVwiOiAyLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2F0dDMucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImZyZWlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDIsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvaGVhdnlmcmVpZ2h0ZXIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImd1blNoaXBcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAzLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2JsdWUxLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJjYXBpdGFsU2hpcFwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDEsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYmx1ZTIucG5nXCJcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJHcmF5XCI6IHtcblx0XHRcInBsYW5ldFwiOiB7XG5cdFx0XHRcInhcIjogLTEwMDAsXG5cdFx0XHRcInlcIjogLTIwMDAsXG5cdFx0XHRcInNpemVcIjogNjAwLFxuXHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvcGxhbmV0cy9wOXNoYWRlZC5wbmdcIixcblx0XHRcdFwiaGFzUmluZ1wiOiBmYWxzZVxuXHRcdH0sXG5cdFx0XCJjaXZpbGlhblJvdXRlXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0eDogLTEwMDAsXG5cdFx0XHRcdHk6IDIwMDBcblx0XHRcdH0sIHtcblx0XHRcdFx0eDogNDAwMCxcblx0XHRcdFx0eTogMzAwMFxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJzaGlwc1wiOiB7XG5cdFx0XHRcImZpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiA1LFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL3dzaGlwLTQucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNpdmlsaWFuXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMixcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy93c2hpcC0yLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJmcmVpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAyLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL3hzcHI1LnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJndW5TaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMyxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy93c2hpcDEucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNhcGl0YWxTaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMSxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy93c2hpcC0zLnBuZ1wiXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdFwiUmVkXCI6IHtcblx0XHRcInBsYW5ldFwiOiB7XG5cdFx0XHRcInhcIjogNzUwLFxuXHRcdFx0XCJ5XCI6IDEwMDAwLFxuXHRcdFx0XCJzaXplXCI6IDgwMCxcblx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3BsYW5ldHMvcmVkcGxhbmV0LnBuZ1wiLFxuXHRcdFx0XCJoYXNSaW5nXCI6IGZhbHNlXG5cdFx0fSxcblx0XHRcImNpdmlsaWFuUm91dGVcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHR4OiAxMDAwLFxuXHRcdFx0XHR5OiAxMDAwMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiA3MDAwLFxuXHRcdFx0XHR5OiA1MDAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IDQwMDAsXG5cdFx0XHRcdHk6IDMwMDBcblx0XHRcdH1cblx0XHRdLFxuXHRcdFwic2hpcHNcIjoge1xuXHRcdFx0XCJmaWdodGVyXCI6IHtcblx0XHRcdFx0XCJudW1cIjogNSxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9SRDIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNpdmlsaWFuXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMixcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9SRDMucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImZyZWlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDIsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvaGVhdnlmcmVpZ2h0ZXIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImd1blNoaXBcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAzLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL1JEMS5wbmdcIlxuXHRcdFx0fSxcblx0XHRcdFwiY2FwaXRhbFNoaXBcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAxLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2F0dDIucG5nXCJcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJCbHVlXCI6IHtcblx0XHRcInBsYW5ldFwiOiB7XG5cdFx0XHRcInhcIjogMzAwMCxcblx0XHRcdFwieVwiOiAtMTAwMCxcblx0XHRcdFwic2l6ZVwiOiA2MDAsXG5cdFx0XHRcInNyY1wiOiBcImltYWdlcy9wbGFuZXRzL3Ayc2hhZGVkLnBuZ1wiLFxuXHRcdFx0XCJoYXNSaW5nXCI6IGZhbHNlXG5cdFx0fSxcblx0XHRcImNpdmlsaWFuUm91dGVcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHR4OiAtOTUwMCxcblx0XHRcdFx0eTogMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiAzNTAwLFxuXHRcdFx0XHR5OiAtMTAwMFxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJzaGlwc1wiOiB7XG5cblx0XHRcdFwiZmlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDUsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYmx1ZXNoaXAyLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJjaXZpbGlhblwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDIsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvYmx1ZXNoaXA0LnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJmcmVpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAyLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2hlYXZ5ZnJlaWdodGVyLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJndW5TaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMyxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9ibHVlc2hpcDMucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNhcGl0YWxTaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMSxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9ibHVlc2hpcDEucG5nXCJcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0XCJHcmVlblwiOiB7XG5cdFx0XCJwbGFuZXRcIjoge1xuXHRcdFx0XCJ4XCI6IDEwMDAwLFxuXHRcdFx0XCJ5XCI6IDAsXG5cdFx0XHRcInNpemVcIjogODAwLFxuXHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvcGxhbmV0cy9ncmVlbnBsYW5ldC5wbmdcIixcblx0XHRcdFwiaGFzUmluZ1wiOiBmYWxzZVxuXHRcdH0sXG5cdFx0XCJjaXZpbGlhblJvdXRlXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0eDogMTAwMDAsXG5cdFx0XHRcdHk6IDBcblx0XHRcdH0sIHtcblx0XHRcdFx0eDogNjAwMCxcblx0XHRcdFx0eTogMTAwMFxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJzaGlwc1wiOiB7XG5cdFx0XHRcImZpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiA1LFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2dyZWVuc2hpcDIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNpdmlsaWFuXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMixcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9ncmVlbnNoaXAzLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJmcmVpZ2h0ZXJcIjoge1xuXHRcdFx0XHRcIm51bVwiOiAyLFxuXHRcdFx0XHRcInNyY1wiOiBcImltYWdlcy9zcGFjZXNoaXBzL2hlYXZ5ZnJlaWdodGVyLnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJndW5TaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMyxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9ncmVlbnNoaXA0LnBuZ1wiXG5cdFx0XHR9LFxuXHRcdFx0XCJjYXBpdGFsU2hpcFwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDEsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvZ3JlZW5zaGlwMS5wbmdcIlxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRcIk9yYW5nZVwiOiB7XG5cdFx0XCJwbGFuZXRcIjoge1xuXHRcdFx0XCJ4XCI6IDcwMDAsXG5cdFx0XHRcInlcIjogNTAwMCxcblx0XHRcdFwic2l6ZVwiOiAxMjAwLFxuXHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvcGxhbmV0cy9wM3NoYWRlZC5wbmdcIixcblx0XHRcdFwiaGFzUmluZ1wiOiB0cnVlIFxuXHRcdH0sXG5cdFx0XCJjaXZpbGlhblJvdXRlXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0eDogNzAwMCxcblx0XHRcdFx0eTogNTUwMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiA2NTAwLFxuXHRcdFx0XHR5OiA1MDAwXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IDY1MDAsXG5cdFx0XHRcdHk6IDMwMDBcblx0XHRcdH0sIHtcblx0XHRcdFx0eDogNjAwMCxcblx0XHRcdFx0eTogMzAwMFxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiA3NTAwLFxuXHRcdFx0XHR5OiA1MDAwXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInNoaXBzXCI6IHtcblx0XHRcdFwiZmlnaHRlclwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDUsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvc21hbGxvcmFuZ2UucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNpdmlsaWFuXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMixcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9vcmFuZ2VzaGlwMy5wbmdcIlxuXHRcdFx0fSxcblx0XHRcdFwiZnJlaWdodGVyXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMixcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9oZWF2eWZyZWlnaHRlci5wbmdcIlxuXHRcdFx0fSxcblx0XHRcdFwiZ3VuU2hpcFwiOiB7XG5cdFx0XHRcdFwibnVtXCI6IDMsXG5cdFx0XHRcdFwic3JjXCI6IFwiaW1hZ2VzL3NwYWNlc2hpcHMvb3Jhbmdlc2hpcDIucG5nXCJcblx0XHRcdH0sXG5cdFx0XHRcImNhcGl0YWxTaGlwXCI6IHtcblx0XHRcdFx0XCJudW1cIjogMSxcblx0XHRcdFx0XCJzcmNcIjogXCJpbWFnZXMvc3BhY2VzaGlwcy9vcmFuZ2VzaGlwLnBuZ1wiXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rpb25JbmZvOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG52YXIgeFBsdXNZRGlzdGFuY2UgPSByZXF1aXJlKCcuL3BvaW50JylbJ3hQbHVzWURpc3RhbmNlJ107XG52YXIgV2VhcG9uID0gcmVxdWlyZSgnLi93ZWFwb24nKTtcblxuZnVuY3Rpb24gRmlnaHRlclNoaXAoeCwgeSwgY2FtZXJhLCBjYW52YXMsIGZhY3Rpb24sIG51bSwgZnJpZW5kbHlUYXJnZXQpIHtcblx0U2hpcC5hcHBseSh0aGlzLCBbeCwgeSwgY2FtZXJhLCBjYW52YXMsIFwiXCJdKTtcblx0dGhpcy5mYWN0aW9uID0gZmFjdGlvbjtcblx0dGhpcy5mcmllbmRseVRhcmdldCA9IGZyaWVuZGx5VGFyZ2V0O1xuXG5cdHRoaXMubWF4Um90YXRpb25TcGVlZCA9IDAuNDtcblx0dGhpcy53aWR0aCA9IDkwO1xuXHR0aGlzLmhlaWdodCA9IDkwO1xuXHR0aGlzLnJhZGl1cyA9IDkwIC8gMjtcblxuXHR0aGlzLmhwID0gOTA7XG5cdHRoaXMubWF4aHAgPSA5MDtcblx0dGhpcy5tYXhTaGllbGRzID0gMzA7XG5cdHRoaXMuc2hpZWxkcyA9IDMwO1xuXG5cdHRoaXMuaW1hZ2UgPSB0aGlzLmZhY3Rpb24uaW1hZ2VzWydmaWdodGVyJ107XG5cblx0dGhpcy5uYW1lID0gZmFjdGlvbi5uYW1lICsgXCIgXCIgKyBcImZpZ2h0ZXIgXCIgKyBudW07XG5cblx0dGhpcy53ZWFwb24gPSBuZXcgV2VhcG9uKDIwLCAxNSwgNDApO1xuXG5cdHRoaXMuZW5lbWllcyA9IGZhY3Rpb24uZW5lbWllcztcblxufVxuXG5GaWdodGVyU2hpcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNoaXAucHJvdG90eXBlKTtcbkZpZ2h0ZXJTaGlwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZpZ2h0ZXJTaGlwO1xuXG5GaWdodGVyU2hpcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob2JqZWN0cykge1xuXHR0aGlzLnJvdGF0aW9uQXBwbGllZCA9IGZhbHNlO1xuXHR0aGlzLnRocnVzdEFwcGxpZWQgPSBmYWxzZTtcblxuXHR0aGlzLnJlZ2VuU2hpZWxkcygpO1xuXG5cdC8vIEZpbmQgY2xvc2VzdCBlbmVteVxuXHR2YXIgY2xvc2VzdEVuZW15ID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodGhpcy5lbmVtaWVzW29iamVjdHNbaV0ubmFtZV0pIHtcblx0XHRcdHZhciBkaXN0YW5jZSA9IHhQbHVzWURpc3RhbmNlKG9iamVjdHNbaV0ueCwgb2JqZWN0c1tpXS55LCB0aGlzLngsIHRoaXMueSk7XG5cdFx0XHRpZighY2xvc2VzdEVuZW15LmVuZW15IHx8IGNsb3Nlc3RFbmVteS5kaXN0YW5jZSA+IGRpc3RhbmNlKSB7XG5cdFx0XHRcdGNsb3Nlc3RFbmVteS5lbmVteSA9IG9iamVjdHNbaV07XG5cdFx0XHRcdGNsb3Nlc3RFbmVteS5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHZhciB0YXJnZXQ7XG5cdHZhciBkaXN0YW5jZTtcblx0dmFyIGZyaWVuZGx5O1xuXG5cdC8vIEhlYWQgdG93YXJkcyBjbG9zZXN0IGVuZW15IGlzIGZhciBhd2F5XG5cdGlmKGNsb3Nlc3RFbmVteS5lbmVteSAmJiBjbG9zZXN0RW5lbXkuZGlzdGFuY2UgPCAxMDAwKSB7XG5cdFx0dGFyZ2V0ID0gY2xvc2VzdEVuZW15LmVuZW15O1xuXHRcdGRpc3RhbmNlID0gY2xvc2VzdEVuZW15LmRpc3RhbmNlO1xuXHRcdGZyaWVuZGx5ID0gZmFsc2U7XG5cdH0gZWxzZSB7XG5cdFx0dGFyZ2V0ID0gdGhpcy5mcmllbmRseVRhcmdldDtcblx0XHRmcmllbmRseSA9IHRydWU7XG5cdFx0ZGlzdGFuY2UgPSB4UGx1c1lEaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgdGhpcy5mcmllbmRseVRhcmdldC54LCB0aGlzLmZyaWVuZGx5VGFyZ2V0LnkpO1xuXHR9XG5cdGlmKGRpc3RhbmNlIDwgMjUwKSB7IC8vIEJhY2sgYXdheVxuXHRcdHRoaXMudGhydXN0KC0xKTtcblxuXHR9IGVsc2Uge1xuXHRcdC8qdmFyIGRpc3RhbmNlID0gY2xvc2VzdEVuZW15LmRpc3RhbmNlO1xuXHRcdHZhciByYXRpbyA9IGRpc3RhbmNlIC8gdGhpcy5vbGREaXN0YW5jZTsqL1xuXHRcdHZhciBhbmdsZSA9IHRoaXMub2xkQW5nbGU7XG5cdFx0LyppZiAocmF0aW8gPCAwLjkgfHwgcmF0aW8gPiAxLjEpIHsqL1xuXHRcdFx0YW5nbGUgPSBoZWxwZXJzLmFuZ2xlKHRoaXMsIHRhcmdldCk7XG5cdFx0XHQvKnRoaXMub2xkRGlzdGFuY2UgPSBkaXN0YW5jZTtcblx0XHRcdHRoaXMub2xkQW5nbGUgPSBhbmdsZTtcblx0XHR9Ki9cblx0XHR2YXIgYW5nbGVEaWZmID0gaGVscGVycy5hbmdsZURpZmYodGhpcy5hbmdsZSwgYW5nbGUpO1xuXG5cdFx0Ly9jb25zb2xlLmxvZygnYW5nbGVEaWZmJywgYW5nbGVEaWZmKTtcblxuXHRcdHZhciBkZWNlbGVyYXRlUm90YXRpb247XG5cdFx0aWYgKHRoaXMucm90YXRpb24gIT09IDApIHtcblx0XHRcdGRlY2VsZXJhdGVSb3RhdGlvbiA9IC10aGlzLnJvdGF0aW9uIC8gTWF0aC5hYnModGhpcy5yb3RhdGlvbikgKiAwLjAwNTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVjZWxlcmF0ZVJvdGF0aW9uID0gLTAuMDE7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucm90YXRpb24gPiAwLjEpIHsgLy9TbG93IGRvd25cblx0XHRcdHRoaXMudGhydXN0QWNjZWwoZGVjZWxlcmF0ZVJvdGF0aW9uKTtcblx0XHRcdGlmIChNYXRoLmFicyhhbmdsZURpZmYpIDwgMC4zKSB0aGlzLnRocnVzdCgwLjUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgZmluYWxBbmdsZSA9IGFuZ2xlRGlmZiAtIHRoaXMucm90YXRpb24gKiB0aGlzLnJvdGF0aW9uIC8gZGVjZWxlcmF0ZVJvdGF0aW9uIC8gMjtcblx0XHRcdGZpbmFsQW5nbGUgPSBoZWxwZXJzLm1vZCgoZmluYWxBbmdsZSArIE1hdGguUEkpLCAoTWF0aC5QSSAqIDIpKSAtIE1hdGguUEk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmaW5hbEFuZ2xlJywgZmluYWxBbmdsZSk7XG5cdFx0XHRpZiAoZmluYWxBbmdsZSA+IE1hdGguUEkgLyAyIHx8IGZpbmFsQW5nbGUgPCAtTWF0aC5QSSAvIDIpIHtcblx0XHRcdFx0aWYgKE1hdGguYWJzKHRoaXMucm90YXRpb24pID4gMC4wNSkge1xuXHRcdFx0XHRcdHRoaXMudGhydXN0QWNjZWwoZGVjZWxlcmF0ZVJvdGF0aW9uKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKC1hbmdsZURpZmYgLyBNYXRoLmFicyhhbmdsZURpZmYpICogMC4wMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZmluYWxBbmdsZSA+IDAuMDEpIHtcblx0XHRcdFx0dGhpcy50aHJ1c3RBY2NlbCgtMC4wMSk7XG5cdFx0XHR9IGVsc2UgaWYgKGZpbmFsQW5nbGUgPCAtMC4wMSkge1xuXHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKDAuMDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy50aHJ1c3RBY2NlbChkZWNlbGVyYXRlUm90YXRpb24pO1xuXHRcdFx0XHRpZiAoYW5nbGVEaWZmIDwgMC4zICYmIGFuZ2xlRGlmZiA+IC0wLjMpIHtcblx0XHRcdFx0XHR0aGlzLnRocnVzdCgwLjUpO1xuXHRcdFx0XHRcdGlmIChjbG9zZXN0RW5lbXkuZGlzdGFuY2UgPCA1MDApIHtcblx0XHRcdFx0XHRcdHRoaXMud2VhcG9uLmZpcmUodGhpcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYoIXRoaXMudGhydXN0QXBwbGllZCkge1xuXHRcdGlmKHRoaXMudmVsWCA8IDAuMSAmJiB0aGlzLnZlbFggPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFggPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFggPSB0aGlzLnZlbFggKiAwLjk5O1xuXHRcdH1cblxuXHRcdGlmKHRoaXMudmVsWSA8IDAuMSAmJiB0aGlzLnZlbFkgPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFkgPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFkgPSB0aGlzLnZlbFkgKiAwLjk5O1xuXHRcdH1cblx0fVxuXG5cdGlmKCF0aGlzLnJvdGF0aW9uQXBwbGllZCkge1xuXHRcdGlmKHRoaXMucm90YXRpb24gPCAwLjAwMSAmJiB0aGlzLnJvdGF0aW9uID4gLTAuMDAxKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yb3RhdGlvbiAqPSAwLjk5O1xuXHRcdH1cblx0fSBcblx0XG5cdHRoaXMuYW5nbGUgKz0gdGhpcy5yb3RhdGlvbjtcbn07XG4vLyBSZW1vdmUgZnVuY3Rpb25cbkZpZ2h0ZXJTaGlwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5mYWN0aW9uLnJlbW92ZSh0aGlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaWdodGVyU2hpcDsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG52YXIgV2VhcG9uID0gcmVxdWlyZSgnLi93ZWFwb24nKTtcblxuZnVuY3Rpb24gRnJlaWdodGVyKHgsIHksIGNhbWVyYSwgY2FudmFzLCBmYWN0aW9uLCBudW0pIHtcblx0U2hpcC5hcHBseSh0aGlzLCBbeCwgeSwgY2FtZXJhLCBjYW52YXMsIFwiXCJdKTtcblx0dGhpcy5mYWN0aW9uID0gZmFjdGlvbjtcblxuXHR0aGlzLm1heFJvdGF0aW9uU3BlZWQgPSAwLjA1O1xuXHR0aGlzLm1heFZlbCA9IDEyO1xuXG5cdHRoaXMud2lkdGggPSAzMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMzAwO1xuXHR0aGlzLnJhZGl1cyA9IDE1MDtcblxuXHR0aGlzLmhwID0gNTAwO1xuXHR0aGlzLm1heGhwID0gNTAwO1xuXHR0aGlzLm1heFNoaWVsZHMgPSAxMDA7XG5cdHRoaXMuc2hpZWxkcyA9IDEwMDtcblxuXHR0aGlzLmltYWdlID0gdGhpcy5mYWN0aW9uLmltYWdlc1snZnJlaWdodGVyJ107XG5cblx0dGhpcy5uYW1lID0gZmFjdGlvbi5uYW1lICsgXCIgXCIgKyBcImZyZWlnaHRlciBcIiArIG51bTtcblxuXHR0aGlzLmVuZW1pZXMgPSBmYWN0aW9uLmVuZW1pZXM7XG5cblx0dGhpcy53ZWFwb24gPSBudWxsO1xuXG5cdHRoaXMuZGVzdGluYXRpb25JbmRleCA9IDA7XG5cdHRoaXMuZGVzdGluYXRpb25zID0gdGhpcy5mYWN0aW9uLmNpdmlsaWFuUm91dGU7XG5cdHRoaXMuZGVzdGluYXRpb25Db3VudGRvd24gPSA1MDtcbn1cblxuRnJlaWdodGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2hpcC5wcm90b3R5cGUpO1xuRnJlaWdodGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZyZWlnaHRlcjtcblxuRnJlaWdodGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZWdlblNoaWVsZHMoKTtcblx0dmFyIGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbnNbdGhpcy5kZXN0aW5hdGlvbkluZGV4XTtcblx0dmFyIGR4ID0gZGVzdGluYXRpb24ueCAtIHRoaXMueDtcblx0dmFyIGR5ID0gZGVzdGluYXRpb24ueSAtIHRoaXMueTtcblx0dmFyIGRpc3RhbmNlVG9EZXN0aW5hdGlvbiA9IE1hdGguYWJzKGR4KSArIE1hdGguYWJzKGR5KTtcblxuXHRpZiAoZGlzdGFuY2VUb0Rlc3RpbmF0aW9uIDwgNDAwKSB7XG5cdFx0dmFyIHN0b3BwZWQgPSBNYXRoLmFicyh0aGlzLnZlbFgpICsgTWF0aC5hYnModGhpcy52ZWxZKSA8IDU7XG5cdFx0aWYgKHN0b3BwZWQpIHtcblx0XHRcdHRoaXMuZGVzdGluYXRpb25Db3VudGRvd24tLTtcblx0XHRcdGlmICh0aGlzLmRlc3RpbmF0aW9uQ291bnRkb3duIDw9IDApIHtcblx0XHRcdFx0Ly8gUkVBQ0hFRCBUSEUgREVTVElOQVRJT04uXG5cblx0XHRcdFx0dGhpcy5kZXN0aW5hdGlvbkluZGV4ICs9IDE7XG5cdFx0XHRcdHRoaXMuZGVzdGluYXRpb25JbmRleCAlPSB0aGlzLmRlc3RpbmF0aW9ucy5sZW5ndGg7XG5cblx0XHRcdFx0ZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uc1t0aGlzLmRlc3RpbmF0aW9uSW5kZXhdO1xuXG5cdFx0XHRcdGR4ID0gZGVzdGluYXRpb24ueCAtIHRoaXMueDtcblx0XHRcdFx0ZHkgPSBkZXN0aW5hdGlvbi55IC0gdGhpcy55O1xuXHRcdFx0XHR0aGlzLmRlc3RpbmF0aW9uQ291bnRkb3duID0gNTA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dGhpcy50dXJuVG8oZGVzdGluYXRpb24sIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGVjZWxlcmF0aW9uWCA9IC0wLjUgKiBNYXRoLnNpbih0aGlzLmFuZ2xlKTtcblx0XHR2YXIgZGVjZWxlcmF0aW9uWSA9IDAuNSAqIE1hdGguY29zKHRoaXMuYW5nbGUpO1xuXHRcdHZhciBmaW5hbGR4ID0gZHggKyB0aGlzLnZlbFggKiB0aGlzLnZlbFggLyBkZWNlbGVyYXRpb25YIC8gMjtcblx0XHR2YXIgZmluYWxkeSA9IGR5ICsgdGhpcy52ZWxZICogdGhpcy52ZWxZIC8gZGVjZWxlcmF0aW9uWSAvIDI7XG5cblx0XHR2YXIgZG90ID0gZmluYWxkeCAqIGRlY2VsZXJhdGlvblggKyBmaW5hbGR5ICogZGVjZWxlcmF0aW9uWTtcblxuXHRcdGlmIChkb3QgPiAxKSB7XG5cdFx0XHR0aGlzLnRocnVzdCgtMik7XG5cdFx0fSBlbHNlIGlmIChkb3QgPCAtMSkge1xuXHRcdFx0dGhpcy50aHJ1c3QoMSk7XG5cdFx0fSBlbHNlIGlmIChkb3QgPiAwKSB7XG5cdFx0XHR0aGlzLnRocnVzdCgtMC41KTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKSk7XG5cblxuXHRpZighdGhpcy50aHJ1c3RBcHBsaWVkKSB7XG5cdFx0aWYodGhpcy52ZWxYIDwgMC4xICYmIHRoaXMudmVsWCA+IC0wLjEpIHtcblx0XHRcdHRoaXMudmVsWCA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVsWCA9IHRoaXMudmVsWCAqIDAuOTk7XG5cdFx0fVxuXG5cdFx0aWYodGhpcy52ZWxZIDwgMC4xICYmIHRoaXMudmVsWSA+IC0wLjEpIHtcblx0XHRcdHRoaXMudmVsWSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVsWSA9IHRoaXMudmVsWSAqIDAuOTk7XG5cdFx0fVxuXHR9XG5cblx0aWYoIXRoaXMucm90YXRpb25BcHBsaWVkKSB7XG5cdFx0aWYodGhpcy5yb3RhdGlvbiA8IDAuMDAxICYmIHRoaXMucm90YXRpb24gPiAtMC4wMDEpIHtcblx0XHRcdHRoaXMucm90YXRpb24gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uICo9IDAuOTk7XG5cdFx0fVxuXHR9IFxuXHRcblx0dGhpcy5hbmdsZSArPSB0aGlzLnJvdGF0aW9uO1xufVxuLy8gUmVtb3ZlIGZ1bmN0aW9uXG5GcmVpZ2h0ZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmZhY3Rpb24ucmVtb3ZlKHRoaXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZyZWlnaHRlcjsiLCIndXNlIHN0cmljdCdcblxudmFyIGdsb2JhbHMgPSB7fTtcbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsczsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG52YXIgV2VhcG9uID0gcmVxdWlyZSgnLi93ZWFwb24nKTtcblxuZnVuY3Rpb24gR3VuU2hpcCh4LCB5LCBjYW1lcmEsIGNhbnZhcywgZmFjdGlvbiwgbnVtKSB7XG5cdFNoaXAuYXBwbHkodGhpcywgW3gsIHksIGNhbWVyYSwgY2FudmFzLCBcIlwiXSk7XG5cdHRoaXMuZmFjdGlvbiA9IGZhY3Rpb247XG5cblx0dGhpcy5tYXhSb3RhdGlvblNwZWVkID0gMC4yO1xuXHR0aGlzLndpZHRoID0gMjUwO1xuXHR0aGlzLmhlaWdodCA9IDI1MDtcblx0dGhpcy5yYWRpdXMgPSAxMjU7XG5cblx0dGhpcy5ocCA9IDMwMDtcblx0dGhpcy5tYXhocCA9IDMwMDtcblx0dGhpcy5tYXhTaGllbGRzID0gMTAwO1xuXHR0aGlzLnNoaWVsZHMgPSAxMDA7XG5cblx0dGhpcy5pbWFnZSA9IHRoaXMuZmFjdGlvbi5pbWFnZXNbJ2d1blNoaXAnXTtcblxuXHR0aGlzLm5hbWUgPSBmYWN0aW9uLm5hbWUgKyBcIiBcIiArIFwiZ3VuU2hpcCBcIiArIG51bTtcblxuXHR0aGlzLndlYXBvbiA9IG5ldyBXZWFwb24oNTAsIDYwLCAyMCk7XG5cblx0dGhpcy5lbmVtaWVzID0gZmFjdGlvbi5lbmVtaWVzO1xuXG59XG5cbkd1blNoaXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTaGlwLnByb3RvdHlwZSk7XG5HdW5TaGlwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEd1blNoaXA7XG5cbi8vIFJlbW92ZSBmdW5jdGlvblxuR3VuU2hpcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZmFjdGlvbi5yZW1vdmUodGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR3VuU2hpcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBoZWxwZXJzID0ge1xuXHRhbmdsZTogZnVuY3Rpb24gKG9iamVjdDEsIG9iamVjdDIpIHtcblx0XHR2YXIgZHggPSBvYmplY3QyLnggLSBvYmplY3QxLng7XG5cdFx0dmFyIGR5ID0gb2JqZWN0Mi55IC0gb2JqZWN0MS55O1xuXG5cdFx0cmV0dXJuIE1hdGguUEkgLyAyICsgTWF0aC5hdGFuMihkeSwgZHgpO1xuXHR9LFxuXHRhbmdsZURpZmY6IGZ1bmN0aW9uIChhbmdsZTEsIGFuZ2xlMikge1xuXHRcdHJldHVybiBoZWxwZXJzLm1vZCgoYW5nbGUxIC0gYW5nbGUyICsgTWF0aC5QSSksIChNYXRoLlBJICogMikpIC0gTWF0aC5QSTtcblx0fSxcblx0bW9kOiBmdW5jdGlvbiBtb2Qobiwgaykge1xuXHRcdHJldHVybiAoKG4gJSBrKSArIGspICUgaztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhlbHBlcnM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBJbnB1dChjYW52YXMpIHtcblx0Y2FudmFzLnBhcmVudEVsZW1lbnQub25rZXlkb3duID0gdGhpcy5vbmtleWRvd24uYmluZCh0aGlzKTtcblx0Y2FudmFzLnBhcmVudEVsZW1lbnQub25rZXl1cCA9IHRoaXMub25rZXl1cC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMua2V5cyA9IHt9O1xufVxuXG5JbnB1dC5wcm90b3R5cGUub25rZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXHR0aGlzLmtleXNbZS5rZXlDb2RlXSA9IHRydWU7XG5cdC8vY29uc29sZS5sb2codGhpcy5rZXlzKTtcbn1cblxuSW5wdXQucHJvdG90eXBlLm9ua2V5dXAgPSBmdW5jdGlvbihlKSB7XG5cdHRoaXMua2V5c1tlLmtleUNvZGVdID0gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIE9iamVjdCBpbXBvcnRzXG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJyk7XG52YXIgQ2FtZXJhID0gcmVxdWlyZSgnLi9jYW1lcmEnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vcG9pbnQnKVsnUG9pbnQnXTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi9iYWNrZ3JvdW5kJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgQXN0ZXJvaWQgPSByZXF1aXJlKCcuL2FzdGVyb2lkJyk7XG52YXIgQXN0ZXJvaWRGaWVsZCA9IHJlcXVpcmUoJy4vYXN0ZXJvaWRGaWVsZCcpO1xudmFyIEFzdGVyb2lkUmluZyA9IHJlcXVpcmUoJy4vYXN0ZXJvaWRSaW5nJyk7XG52YXIgUGxhbmV0ID0gcmVxdWlyZSgnLi9wbGFuZXQnKTtcbnZhciBGYWN0aW9uID0gcmVxdWlyZSgnLi9mYWN0aW9uJyk7XG52YXIgZmFjdGlvbkluZm8gPSByZXF1aXJlKCcuL2ZhY3Rpb25JbmZvJyk7XG5cbi8vIEdsb2JhbHMgaW1wb3J0XG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xuXG4vLyBWYXJpYWJsZXMgaW1wb3J0XG52YXIgYm94U2l6ZSA9IHJlcXVpcmUoJy4vdmFyaWFibGVzJykuYm94U2l6ZTtcblxuLy8gRHJhd2luZyB0b29sc1xudmFyIGNhbnZhcztcbnZhciBjdHg7XG5cbnZhciBvYmplY3RCb3hlcyA9IHJlcXVpcmUoJy4vb2JqZWN0Qm94ZXMnKTtcbnZhciBDaXZpbGlhblNoaXAgPSByZXF1aXJlKCcuL2NpdmlsaWFuU2hpcCcpO1xuXG4vLyBWYXJpYWJsZXMgZm9yIGdsb2JhbCBvYmplY3RzXG52YXIgY2FtZXJhO1xudmFyIG1pbmlNYXBDYW1lcmE7XG52YXIgYmFja2dyb3VuZDtcbndpbmRvdy5wYXVzZWQgPSBmYWxzZTtcbnZhciBwbGF5ZXI7XG52YXIgaW5wdXQ7XG52YXIgYXN0ZXJvaWRGaWVsZDtcbnZhciBhc3Rlcm9pZFJpbmc7XG52YXIgcGxhbmV0cztcbnZhciBwcm9qZWN0aWxlUG9vbDtcbnZhciBmYWN0aW9ucztcblxuLy8gT24gbG9hZC9jb25zdHJ1Y3RvciBmb3IgZ2FtZVxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuZ2xvYmFscyA9IGdsb2JhbHM7XG5cdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNhbnZhcycpO1xuXHRjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDEwO1xuXHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTA7XG5cdGNvbnNvbGUubG9nKGNhbnZhcyk7XG5cdGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAvLyBJbml0aWFsaXplIHZhcmlhYmxlcyBhbmQgZW52aXJvbm1lbnRcblx0Y2FtZXJhID0gbmV3IENhbWVyYSgwLCAwLCAxLCBjYW52YXMpO1xuICAgIGdsb2JhbHMuY2FtZXJhID0gY2FtZXJhO1xuICAgIG1pbmlNYXBDYW1lcmEgPSBuZXcgQ2FtZXJhKDAsIDAsIDEwKTtcbiAgICBnbG9iYWwubWluaU1hcENhbWVyYSA9IG1pbmlNYXBDYW1lcmE7XG4gICAgZ2xvYmFscy5jYW52YXMgPSBjYW52YXM7XG5cblx0cGxheWVyID0gbmV3IFBsYXllcig1MCwgNTAsIGNhbWVyYSwgY2FudmFzKTtcbiAgICBpbnB1dCA9IG5ldyBJbnB1dChjYW52YXMpO1xuXG4gICAgYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kKCk7XG4gICAgYXN0ZXJvaWRGaWVsZCA9IG5ldyBBc3Rlcm9pZEZpZWxkKC04MDAsIC0xMDAwMCwgMjAwMCwgMTUwKTtcbiAgICBhc3Rlcm9pZFJpbmcgPSBuZXcgQXN0ZXJvaWRSaW5nKC00MDAwLCA0MDAwLCA3MDAsIDkwMCwgMTAwKTtcbiAgICBmYWN0aW9ucyA9IFtdO1xuICAgIHBsYW5ldHMgPSBbXTsgICAgXG4gICAgZm9yKG5hbWUgaW4gZmFjdGlvbkluZm8pIHtcbiAgICAgICAgdmFyIGZhY3Rpb24gPSBuZXcgRmFjdGlvbihuYW1lKTtcbiAgICAgICAgZmFjdGlvbnMucHVzaChmYWN0aW9uKTtcbiAgICAgICAgcGxhbmV0cy5wdXNoKGZhY3Rpb24uYmFzZVBsYW5ldCk7XG4gICAgfVxuICAgIC8qXG4gICAgcGxhbmV0cy5wdXNoKG5ldyBQbGFuZXQoLTQwMDAsIDAsIDUwMCwgXCJpbWFnZXMvcGxhbmV0cy9ncmVlbnBsYW5ldC5wbmdcIiwgZmFsc2UpKTsgXG4gICAgcGxhbmV0cy5wdXNoKG5ldyBQbGFuZXQoLTIwMDAsIDUwMCwgNzUwLCBcImltYWdlcy9wbGFuZXRzL3Axc2hhZGVkLnBuZ1wiLCB0cnVlKSk7XG4gICAgcGxhbmV0cy5wdXNoKG5ldyBQbGFuZXQoMTAwMCwgMzAwMCwgMzAwLCBcImltYWdlcy9wbGFuZXRzL3Ayc2hhZGVkLnBuZ1wiLCBmYWxzZSkpO1xuICAgIHBsYW5ldHMucHVzaChuZXcgUGxhbmV0KDIwMDAsIDE3MDAsIDYwMCwgXCJpbWFnZXMvcGxhbmV0cy9wM3NoYWRlZC5wbmdcIiwgdHJ1ZSkpO1xuICAgIHBsYW5ldHMucHVzaChuZXcgUGxhbmV0KDE1MDAsIC0xNTAwLCA5NTAsIFwiaW1hZ2VzL3BsYW5ldHMvcDRzaGFkZWQucG5nXCIsIGZhbHNlKSk7XG4gICAgKi9cbiAgICB2YXIgYm94ID0gW3BsYXllcl0uY29uY2F0KGFzdGVyb2lkRmllbGQuYXN0ZXJvaWRzKS5jb25jYXQoYXN0ZXJvaWRSaW5nLmFzdGVyb2lkcyk7XG4gICAgXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHBsYW5ldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm94ID0gYm94LmNvbmNhdChwbGFuZXRzW2ldLmdldEFzdGVyb2lkcygpKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm94ID0gYm94LmNvbmNhdChmYWN0aW9uc1tpXS5zaGlwcyk7XG4gICAgfVxuXG4gICAgdmFyIFByb2plY3RpbGVQb29sID0gcmVxdWlyZSgnLi9wcm9qZWN0aWxlUG9vbCcpO1xuICAgIHByb2plY3RpbGVQb29sID0gbmV3IFByb2plY3RpbGVQb29sKCk7XG4gICAgZ2xvYmFscy5wcm9qZWN0aWxlUG9vbCA9IHByb2plY3RpbGVQb29sO1xuICAgIGJveC5jb25jYXQocHJvamVjdGlsZVBvb2wucHJvamVjdGlsZXMpO1xuICAgIGluaXRpYWxpemVPYmplY3RCb3hlcyhib3gpO1xuXG4gICAgZ2xvYmFscy5vYmplY3RCb3hlcyA9IG9iamVjdEJveGVzO1xuICAgIGdsb2JhbHMuZnJhbWVDb3VudCA9IDA7XG59O1xuXG4vLyBJbml0aWFsaXplcyBjb2xsaXNpb24gYm94ZXMgZm9yIG9iamVjdHMgaW4gc2NlbmFyaW9cbmZ1bmN0aW9uIGluaXRpYWxpemVPYmplY3RCb3hlcyhvYmplY3RzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9iamVjdEJveGVzLmFkZE9iamVjdChvYmplY3RzW2ldKTtcbiAgICB9XG59XG5cbi8vIER5bmFtaWMgcmVzaXplIG9mIGNhbnZhc1xud2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPj0gNTAwICYmIHdpbmRvdy5pbm5lckhlaWdodCA+PSA1MDApIHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSAxMDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwOyAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgICBjYW52YXMud2lkdGggPSA1MDA7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSA1MDA7XG4gICAgfVxufTtcblxudmFyIEZQUyA9IDMwO1xudmFyIHN0ZXAgPSAxMDAwLjAgLyBGUFNcbiAgICAvLyBEcmF3IExvb3BcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBcdGlmICh3aW5kb3cucGF1c2VkKSByZXR1cm47XG4gICAgICB1cGRhdGUoKTtcbiAgICAgIGRyYXcoKTtcbiAgfSwgc3RlcCk7XG5cbi8vIFVwZGF0ZSBpbmZvcm1hdGlvbiBmb3IgZWFjaCBvYmplY3QgYW5kIHJ1bm5pbmcgY29sbGlzaW9ucy5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBpZiAoaW5wdXQua2V5c1syN10pIHsvL0VTQ1xuICAgICAgICBwYXVzZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdsb2JhbHMuZnJhbWVDb3VudCsrO1xuXG4gICAgdmFyIG9iamVjdHMgPSBbcGxheWVyXVxuICAgIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdChhc3Rlcm9pZEZpZWxkLmFzdGVyb2lkcyk7XG4gICAgb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KGFzdGVyb2lkUmluZy5hc3Rlcm9pZHMpO1xuICAgIG9iamVjdHMgPSBvYmplY3RzLmNvbmNhdChwcm9qZWN0aWxlUG9vbC5wcm9qZWN0aWxlcyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHBsYW5ldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KHBsYW5ldHNbaV0uZ2V0QXN0ZXJvaWRzKCkpO1xuICAgIH1cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb2JqZWN0cyA9IG9iamVjdHMuY29uY2F0KGZhY3Rpb25zW2ldLnNoaXBzKTtcbiAgICB9XG5cbiAgICBwbGF5ZXIudXBkYXRlKGlucHV0KTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmFjdGlvbnNbaV0udXBkYXRlKG9iamVjdHMpO1xuICAgIH1cbiAgICBhc3Rlcm9pZEZpZWxkLnVwZGF0ZSgpO1xuICAgIGFzdGVyb2lkUmluZy51cGRhdGUoKTtcbiAgICBkb0NvbGxpc2lvbnMob2JqZWN0cyk7XG59XG5cbnZhciBib3hlcyA9IFtbLTEsIC0xXSwgWzAsIC0xXSwgWzEsIC0xXSwgWy0xLCAwXSwgWzAsIDBdXTtcblxuLy8gQ2hlY2tzIGZvciBjb2xsaXNpb25zIGJldHdlZW4gb2JqZWN0cy4gSWYgdGhleSBleGlzdCwgY29tcGxldGVzIG1vbWVudHVtIHRyYW5zZmVycy5cbmZ1bmN0aW9uIGRvQ29sbGlzaW9ucyhvYmplY3RzKSB7XG4gICAgdmFyIGN1cnJlbnRUID0gMDtcbiAgICB2YXIgbWluVDtcbiAgICB2YXIgbWluT2JqZWN0MSwgbWluT2JqZWN0MjtcbiAgICB3aGlsZSAoY3VycmVudFQgPCAxKSB7XG4gICAgICAgIG1pblQgPSAxIC0gY3VycmVudFQ7XG4gICAgICAgIG1pbk9iamVjdDEgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1pbk9iamVjdDIgPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGJveGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHZhciBib3hYID0gYm94ZXNbaW5kZXhdWzBdO1xuICAgICAgICAgICAgICAgIHZhciBib3hZID0gYm94ZXNbaW5kZXhdWzFdO1xuICAgICAgICAgICAgICAgIHZhciBib3hYbmV3ID0gYm94WCArIG9iamVjdHNbaV0uYm94WDtcbiAgICAgICAgICAgICAgICB2YXIgYm94WW5ldyA9IGJveFkgKyBvYmplY3RzW2ldLmJveFk7XG4gICAgICAgICAgICAgICAgaWYgKCFvYmplY3RCb3hlc1tbYm94WG5ldywgYm94WW5ld11dIHx8XG4gICAgICAgICAgICAgICAgICAgICFvYmplY3RCb3hlc1tbYm94WG5ldywgYm94WW5ld11dLmxlbmd0aCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvYmplY3RCb3hlc1tbYm94WG5ldywgYm94WW5ld11dLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmplY3QyID0gb2JqZWN0Qm94ZXNbW2JveFhuZXcsIGJveFluZXddXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGR4ID0gb2JqZWN0Mi54IC0gb2JqZWN0c1tpXS54O1xuICAgICAgICAgICAgICAgICAgICB2YXIgZHkgPSBvYmplY3QyLnkgLSBvYmplY3RzW2ldLnk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGR2eCA9IG9iamVjdDIudmVsWCAtIG9iamVjdHNbaV0udmVsWDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGR2eSA9IG9iamVjdDIudmVsWSAtIG9iamVjdHNbaV0udmVsWTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmkgPSBvYmplY3RzW2ldLnJhZGl1cztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJqID0gb2JqZWN0Mi5yYWRpdXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciByID0gcmkgKyByajtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IDIgKiAoZHZ4ICogZHggKyBkdnkgKiBkeSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IChkdnggKiBkdnggKyBkdnkgKiBkdnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IChkeCAqIGR4ICsgZHkgKiBkeSAtIHIgKiByKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzY3JpbWluYW50ID0gYiAqIGIgLSA0ICogYSAqIGM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gKC1iIC0gTWF0aC5zcXJ0KGRpc2NyaW1pbmFudCkpIC8gMiAvIGE7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codCwgbWluVCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ID4gMSB8fCB0IDw9IDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAvL2lmICh0IDwgMSAmJiB0ID4gMClcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coXCJUSEVSRSBXSUxMIEJFIEEgQ09MTElTSU9OXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodCA8IG1pblQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblQgPSB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluT2JqZWN0MSA9IG9iamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5PYmplY3QyID0gb2JqZWN0MjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2cobWluVCwgbWluT2JqZWN0MSk7XG5cbiAgICAgICAgaWYgKG1pbk9iamVjdDEpIHtcbiAgICAgICAgICAgIG1vdmVPYmplY3RzKG9iamVjdHMsIG1pblQpO1xuICAgICAgICAgICAgY3VycmVudFQgKz0gbWluVDtcbiAgICAgICAgICAgIGRvUmVhY3Rpb24obWluT2JqZWN0MSwgbWluT2JqZWN0Mik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlT2JqZWN0cyhvYmplY3RzLCAxIC0gY3VycmVudFQpO1xuICAgICAgICAgICAgY3VycmVudFQgPSAxO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNb3ZlcyBvYmplY3RzLCByZXNvcnRpbmcgYm94ZXMgYW5kIGFkanVjdGluZyB0aGluZ3MuXG5mdW5jdGlvbiBtb3ZlT2JqZWN0cyhvYmplY3RzLCB0KSB7XG4gICAgdmFyIG9sZEJveFgsIG9sZEJveFk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9sZEJveFggPSBvYmplY3RzW2ldLmJveFg7XG4gICAgICAgIG9sZEJveFkgPSBvYmplY3RzW2ldLmJveFk7XG5cbiAgICAgICAgb2JqZWN0c1tpXS54ICs9IG9iamVjdHNbaV0udmVsWCAqIHQ7XG4gICAgICAgIG9iamVjdHNbaV0ueSArPSBvYmplY3RzW2ldLnZlbFkgKiB0O1xuXG4gICAgICAgIHZhciBuZXdCb3hYID0gTWF0aC5mbG9vcihvYmplY3RzW2ldLnggLyBib3hTaXplKTtcbiAgICAgICAgdmFyIG5ld0JveFkgPSBNYXRoLmZsb29yKG9iamVjdHNbaV0ueSAvIGJveFNpemUpO1xuXG4gICAgICAgIGlmIChuZXdCb3hYICE9PSBvbGRCb3hYIHx8IG5ld0JveFkgIT09IG9sZEJveFkpIHtcbiAgICAgICAgICAgIG9iamVjdEJveGVzLnJlbW92ZU9iamVjdChvYmplY3RzW2ldKTtcbiAgICAgICAgICAgIG9iamVjdHNbaV0uYm94WCA9IG5ld0JveFg7XG4gICAgICAgICAgICBvYmplY3RzW2ldLmJveFkgPSBuZXdCb3hZO1xuICAgICAgICAgICAgb2JqZWN0Qm94ZXMuYWRkT2JqZWN0KG9iamVjdHNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBDb2xsaXNpb24gYmV0d2VlbiB0d28gb2JqZWN0c1xuZnVuY3Rpb24gZG9SZWFjdGlvbihvYmplY3QxLCBvYmplY3QyKSB7XG4gICAgdmFyIGR4ID0gb2JqZWN0Mi54IC0gb2JqZWN0MS54O1xuICAgIHZhciBkeSA9IG9iamVjdDIueSAtIG9iamVjdDEueTtcblxuICAgIHZhciBkdnggPSBvYmplY3QyLnZlbFggLSBvYmplY3QxLnZlbFg7XG4gICAgdmFyIGR2eSA9IG9iamVjdDIudmVsWSAtIG9iamVjdDEudmVsWTtcblxuICAgIHZhciB2eDEgPSBvYmplY3QxLnZlbFg7XG4gICAgdmFyIHZ5MSA9IG9iamVjdDEudmVsWTtcblxuICAgIHZhciBsZW5ndGggPSAoZHZ4ICogZHggKyBkdnkgKiBkeSk7XG4gICAgbGVuZ3RoIC89IChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICB2YXIgdG90YWxNYXNzID0gKG9iamVjdDEubWFzcyArIG9iamVjdDIubWFzcyk7XG5cbiAgICBvYmplY3QxLnZlbFggKz0gKGxlbmd0aCkgKiBkeCAqIG9iamVjdDIubWFzcyAvIHRvdGFsTWFzcyAqIDI7XG4gICAgb2JqZWN0MS52ZWxZICs9IChsZW5ndGgpICogZHkgKiBvYmplY3QyLm1hc3MgLyB0b3RhbE1hc3MgKiAyO1xuICAgIG9iamVjdDIudmVsWCA9IHZ4MSArIGR2eCAtIChsZW5ndGgpICogZHggKiBvYmplY3QxLm1hc3MgLyB0b3RhbE1hc3MgKiAyO1xuICAgIG9iamVjdDIudmVsWSA9IHZ5MSArIGR2eSAtIChsZW5ndGgpICogZHkgKiBvYmplY3QxLm1hc3MgLyB0b3RhbE1hc3MgKiAyO1xuXG4gICAgaWYgKG9iamVjdDEub25Db2xsaWRlKSBvYmplY3QxLm9uQ29sbGlkZShvYmplY3QyKTtcbiAgICBpZiAob2JqZWN0Mi5vbkNvbGxpZGUpIG9iamVjdDIub25Db2xsaWRlKG9iamVjdDEpO1xufVxuXG4vLyBEcmF3aW5nIGZ1bmN0aW9uXG5mdW5jdGlvbiBkcmF3KCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBcbiAgICBpZihpbnB1dC5rZXlzWzc3XSkge1xuICAgICAgICBkcmF3TWluaU1hcCgpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZHJhd0JhY2tncm91bmQoKTtcbiAgICAgICAgZHJhd0NoYXJzKCk7XG4gICAgfVxuICAgIFxufVxuXG4vLyBEcmF3IGJhY2tncm91bmQgYXNzZXRzXG5mdW5jdGlvbiBkcmF3QmFja2dyb3VuZCgpIHtcbiAgICBiYWNrZ3JvdW5kLmRyYXcoY2FtZXJhLCBjdHgpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHBsYW5ldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGxhbmV0c1tpXS5kcmF3KGN0eCwgY2FtZXJhKTtcbiAgICB9XG4gICAgXG4gICAgYXN0ZXJvaWRGaWVsZC5kcmF3KGN0eCwgY2FtZXJhKTtcbiAgICBhc3Rlcm9pZFJpbmcuZHJhdyhjdHgsIGNhbWVyYSk7XG59XG5cbi8vIERyYXcgY2hhcmFjdGVyc1xuZnVuY3Rpb24gZHJhd0NoYXJzKCkge1xuICAgIHByb2plY3RpbGVQb29sLmRyYXcoY3R4LCBjYW1lcmEpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBmYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmYWN0aW9uc1tpXS5kcmF3U2hpcHMoY3R4LCBjYW1lcmEpO1xuICAgIH1cbiAgICBwbGF5ZXIuZHJhdyhjdHgsIGNhbWVyYSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdNaW5pTWFwKCkge1xuICAgIG1pbmlNYXBDYW1lcmEueCA9IGNhbWVyYS54ICogY2FtZXJhLnogLyBtaW5pTWFwQ2FtZXJhLnogKyBjYW52YXMud2lkdGggLyAyO1xuICAgIG1pbmlNYXBDYW1lcmEueSA9IGNhbWVyYS55ICogY2FtZXJhLnogLyBtaW5pTWFwQ2FtZXJhLnogKyBjYW52YXMuaGVpZ2h0IC8gMjtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwbGFuZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBsYW5ldHNbaV0uZHJhdyhjdHgsIG1pbmlNYXBDYW1lcmEpO1xuICAgIH1cbiAgICBcbiAgICBhc3Rlcm9pZEZpZWxkLmRyYXcoY3R4LCBtaW5pTWFwQ2FtZXJhKTtcbiAgICBhc3Rlcm9pZFJpbmcuZHJhdyhjdHgsIG1pbmlNYXBDYW1lcmEpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGZhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZhY3Rpb25zW2ldLmRyYXdTaGlwcyhjdHgsIG1pbmlNYXBDYW1lcmEpO1xuICAgIH1cbiAgICBwcm9qZWN0aWxlUG9vbC5kcmF3KGN0eCwgbWluaU1hcENhbWVyYSk7XG4gICAgcGxheWVyLmRyYXcoY3R4LCBtaW5pTWFwQ2FtZXJhKTtcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBPYmplY3RCb3hlcygpIHtcblxufVxuXG5PYmplY3RCb3hlcy5wcm90b3R5cGUuYWRkT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmICghdGhpc1tbb2JqZWN0LmJveFgsIG9iamVjdC5ib3hZXV0pXG4gICAgICAgIHRoaXNbW29iamVjdC5ib3hYLCBvYmplY3QuYm94WV1dID0gW107XG4gICAgdGhpc1tbb2JqZWN0LmJveFgsIG9iamVjdC5ib3hZXV0ucHVzaChvYmplY3QpO1xufVxuXG5PYmplY3RCb3hlcy5wcm90b3R5cGUucmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXHR2YXIgb2xkQm94WCA9IG9iamVjdC5ib3hYO1xuXHR2YXIgb2xkQm94WSA9IG9iamVjdC5ib3hZO1xuXHRpZiAoIW9iamVjdEJveGVzW1tvbGRCb3hYLCBvbGRCb3hZXV0pIHJldHVybjtcblx0dmFyIGluZGV4ID0gb2JqZWN0Qm94ZXNbW29sZEJveFgsIG9sZEJveFldXS5pbmRleE9mKG9iamVjdCk7XG4gICAgb2JqZWN0Qm94ZXNbW29sZEJveFgsIG9sZEJveFldXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGlmIChvYmplY3RCb3hlc1tbb2xkQm94WCwgb2xkQm94WV1dLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgb2JqZWN0Qm94ZXNbW29sZEJveFgsIG9sZEJveFldXTtcbiAgICB9XG59XG5cbnZhciBvYmplY3RCb3hlcyA9IG5ldyBPYmplY3RCb3hlcygpO1xubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RCb3hlczsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFzdGVyb2lkUmluZyA9IHJlcXVpcmUoJy4vYXN0ZXJvaWRSaW5nJyk7XG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpO1xuXG5mdW5jdGlvbiBQbGFuZXQoeCwgeSwgcmFkaXVzLCBzcmMsIGhhc1JpbmcpIHtcblx0QmFsbC5hcHBseSh0aGlzLCBbeCwgeV0pO1xuXHR0aGlzLnJhZGl1cyA9IHJhZGl1cztcblx0dGhpcy5zcmMgPSBzcmM7XG5cdHRoaXMuaGFzUmluZyA9IGhhc1Jpbmc7XG5cdGlmKHRoaXMuaGFzUmluZykge1xuXHRcdHRoaXMucmluZyA9IG5ldyBBc3Rlcm9pZFJpbmcodGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgMTAwLCB0aGlzLnJhZGl1cyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwMCksIHRoaXMucmFkaXVzIC8gMzApO1xuXHR9XG5cblx0dGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHR0aGlzLmltYWdlLnNyYyA9IHRoaXMuc3JjO1xuXG5cdHRoaXMuZmFjdGlvbnMgPSB7fTtcblx0dGhpcy5mYWN0aW9uc1tcIm5ldXRyYWxcIl0gPSB0cnVlO1xufVxuXG5QbGFuZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYWxsLnByb3RvdHlwZSk7XG5QbGFuZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUGxhbmV0O1xuXG5QbGFuZXQucHJvdG90eXBlLmdldEFzdGVyb2lkcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYXN0ZXJvaWRzID0gW107XG5cdGlmKHRoaXMuaGFzUmluZykge1xuXHRcdGFzdGVyb2lkcyA9IGFzdGVyb2lkcy5jb25jYXQodGhpcy5yaW5nLmFzdGVyb2lkcyk7XG5cdH1cblx0cmV0dXJuIGFzdGVyb2lkcztcbn1cblxuUGxhbmV0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBjYW1lcmEpIHtcblx0Y3R4LnNhdmUoKTtcblxuXHRjYW1lcmEuYXBwbHlUcmFuc2Zvcm0oY3R4KTtcblx0Y3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG5cdGN0eC5yb3RhdGUodGhpcy5hbmdsZSk7XG5cblx0Y3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAtdGhpcy5yYWRpdXMgLyAyLCAtdGhpcy5yYWRpdXMgLyAyLCB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMpO1xuXHRjdHgucmVzdG9yZSgpO1xuXG5cdGlmKHRoaXMuaGFzUmluZykge1xuXHRcdHRoaXMucmluZy5kcmF3KGN0eCwgY2FtZXJhKTtcblx0fVxuXHRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxhbmV0OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpO1xudmFyIFByb2plY3RpbGUgPSByZXF1aXJlKCcuL3Byb2plY3RpbGUnKTtcbnZhciBTaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmZ1bmN0aW9uIFBsYXllcih4LCB5LCBjYW1lcmEsIGNhbnZhcykge1xuXHRTaGlwLmFwcGx5KHRoaXMsIFt4LCB5LCBjYW1lcmEsIGNhbnZhcywgXCJpbWFnZXMvc3BhY2VzaGlwcy9wbGF5ZXJfc2hpcC5wbmdcIl0pO1xuXHR0aGlzLm5hbWUgPSBcIlBsYXllclwiO1xuXHR0aGlzLmNyYXNoU291bmQgPSBuZXcgQXVkaW8oXCJzb3VuZHMvRXhwbG9zaW9uMjAud2F2XCIpO1xuXHR0aGlzLmNyYXNoU291bmQudm9sdW1lID0gMC41O1xuXHR0aGlzLm1heFZlbCA9IDMwO1xuXHR0aGlzLnBvaW50cyA9IDA7XG59XG5cblBsYXllci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNoaXAucHJvdG90eXBlKTtcblBsYXllci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQbGF5ZXI7XG5cblBsYXllci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0dmFyIHJvdGF0aW9uQXBwbGllZCA9IGZhbHNlO1xuXHR2YXIgdGhydXN0QXBwbGllZCA9IGZhbHNlO1xuXG5cdHRoaXMucmVnZW5TaGllbGRzKCk7XG5cblx0aWYgKGlucHV0LmtleXNbNjhdKSB7Ly9EXG5cdFx0cm90YXRpb25BcHBsaWVkID0gdGhpcy50aHJ1c3RBY2NlbCgwLjAxKTtcblx0fVxuXHRpZiAoaW5wdXQua2V5c1s2NV0pIHsvL0Fcblx0XHRyb3RhdGlvbkFwcGxpZWQgPSB0aGlzLnRocnVzdEFjY2VsKC0wLjAxKTtcblx0fVxuXG5cdGlmIChpbnB1dC5rZXlzWzg3XSkgey8vV1xuXHRcdHRocnVzdEFwcGxpZWQgPSB0aGlzLnRocnVzdCgxKTtcblx0fVxuXG5cdGlmIChpbnB1dC5rZXlzWzgzXSkgey8vU1xuXHRcdHRocnVzdEFwcGxpZWQgPSB0aGlzLnRocnVzdCgtMSk7XG5cdH1cblxuXHRpZiAoaW5wdXQua2V5c1szMl0pIHsvLyBzcGFjZVxuXHRcdHRoaXMuZmlyZSgpO1xuXHR9XHRcblxuXHRpZighdGhydXN0QXBwbGllZCkge1xuXHRcdGlmKHRoaXMudmVsWCA8IDAuMSAmJiB0aGlzLnZlbFggPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFggPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFggPSB0aGlzLnZlbFggKiAwLjk5O1xuXHRcdH1cblxuXHRcdGlmKHRoaXMudmVsWSA8IDAuMSAmJiB0aGlzLnZlbFkgPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFkgPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFkgPSB0aGlzLnZlbFkgKiAwLjk5O1xuXHRcdH1cblx0fVxuXG5cdGlmKCFyb3RhdGlvbkFwcGxpZWQpIHtcblx0XHRpZih0aGlzLnJvdGF0aW9uIDwgMC4wMDEgJiYgdGhpcy5yb3RhdGlvbiA+IC0wLjAwMSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbiA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucm90YXRpb24gKj0gMC45OTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLmFuZ2xlICs9IHRoaXMucm90YXRpb247XG5cblx0dGhpcy5jYW1lcmEueiA9IDEgKyBNYXRoLnNxcnQoTWF0aC5hYnModGhpcy52ZWxYKSArIE1hdGguYWJzKHRoaXMudmVsWSkpIC8gMTA7XG5cdGlmICh0aGlzLmNhbWVyYS56ID4gMTApIHRoaXMuY2FtZXJhLnogPSAxMDtcblxuXHR0aGlzLmNhbWVyYS5jZW50ZXIodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMik7XG59O1xuXG5QbGF5ZXIucHJvdG90eXBlLm9uQ29sbGlkZSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblx0dGhpcy5jcmFzaFNvdW5kLnBsYXkoKTtcbn1cblxuUGxheWVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBjYW1lcmEpIHtcblx0U2hpcC5wcm90b3R5cGUuZHJhdy5jYWxsKHRoaXMsIGN0eCwgY2FtZXJhKTtcblx0dGhpcy5kcmF3SGVhbHRoQmFyKGN0eCk7XG5cdGN0eC5maWxsVGV4dCh0aGlzLnggKyBcIiwgXCIgKyB0aGlzLnksIDUwLCA1MCk7XG5cdGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjsgICAgICBcblx0Y3R4LmZpbGxUZXh0KFwiUG9pbnRzOiBcIiArIHRoaXMucG9pbnRzLCBnbG9iYWxzLmNhbnZhcy53aWR0aCAvIDIsIGdsb2JhbHMuY2FudmFzLmhlaWdodCAtIDUwKTtcblxufVxuXG5QbGF5ZXIucHJvdG90eXBlLmRyYXdIZWFsdGhCYXIgPSBmdW5jdGlvbihjdHgpIHtcblx0dmFyIHggPSAxMDBcblx0dmFyIHkgPSBnbG9iYWxzLmNhbnZhcy5oZWlnaHQgLSAyMDA7XG5cdHZhciBzaGllbGRXaWR0aCA9IDI2MCAqIHRoaXMuc2hpZWxkcyAvIHRoaXMubWF4U2hpZWxkcztcblx0dmFyIGhlYWx0aFdpZHRoID0gMjYwICogdGhpcy5ocCAvIHRoaXMubWF4aHA7XG5cdGN0eC5maWxsU3R5bGUgPSBcIiMxNTFCNTRcIjtcblx0Y3R4LmZpbGxSZWN0KHgsIHksIDMwMCwgMTAwKTtcblx0Y3R4LmZpbGxTdHlsZSA9IFwiIzM2OEJDMVwiO1xuXHRjdHguZmlsbFJlY3QoeCArIDIwLCB5ICsgMjAsIHNoaWVsZFdpZHRoLCAyNSk7XG5cdGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG5cdGN0eC5mb250ID0gXCIyMHB4IHNhbnNzZXJpZlwiO1xuXHRjdHguZmlsbFRleHQodGhpcy5zaGllbGRzICsgXCIgLyBcIiArIHRoaXMubWF4U2hpZWxkcywgeCArIDMwLCB5ICsgNDApO1xuXHRjdHguZmlsbFN0eWxlID0gXCIjNTJEMDE3XCI7XG5cdGN0eC5maWxsUmVjdCh4ICsgMjAsIHkgKyA1NSwgaGVhbHRoV2lkdGgsIDI1KTtcblx0Y3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcblx0Y3R4LmZpbGxUZXh0KHRoaXMuaHAgKyBcIiAvIFwiICsgdGhpcy5tYXhocCwgeCArIDMwLCB5ICsgNzUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gQ3JlYXRlcyBhIHBvaW50XG5mdW5jdGlvbiBQb2ludCh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xufVxuXG5mdW5jdGlvbiB4UGx1c1lEaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xuXHRyZXR1cm4gTWF0aC5hYnMoeDEgLSB4MikgKyBNYXRoLmFicyh5MSAtIHkyKTtcbn1cblxuZnVuY3Rpb24gaHlwb0Rpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XG5cdHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKSk7XG59XG5cbmZ1bmN0aW9uIGFuZ2xlVG8oeDEsIHkxLCB4MiwgeTIpIHtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsnUG9pbnQnOiBQb2ludCwgJ3hQbHVzWURpc3RhbmNlJzogeFBsdXNZRGlzdGFuY2UsICdoeXBvRGlzdGFuY2UnOiBoeXBvRGlzdGFuY2UsICdhbmdsZVRvJzogYW5nbGVUb307IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpO1xuXG5mdW5jdGlvbiBQcm9qZWN0aWxlKHgsIHksIHZlbFgsIHZlbFksIHBvb2wsIG9yaWdpbiwgZGFtYWdlKSB7XG5cdEJhbGwuYXBwbHkodGhpcywgW3gsIHldKTtcblx0dGhpcy52ZWxYID0gdmVsWDtcblx0dGhpcy52ZWxZID0gdmVsWTtcblx0dGhpcy5yYWRpdXMgPSA4O1xuXHR0aGlzLndpZHRoID0gMTY7XG5cdHRoaXMuaGVpZ2h0ID0gMTY7XG5cdHRoaXMub3JpZ2luID0gb3JpZ2luO1xuXHR0aGlzLm1hc3MgPSAyO1xuXHR0aGlzLmRhbWFnZSA9IGRhbWFnZTtcblxuXHR0aGlzLnBvb2wgPSBwb29sO1xuXHR0aGlzLnBvb2wuYWRkUHJvamVjdGlsZSh0aGlzKTtcblxuXHR0aGlzLnR5cGUgPSAncHJvamVjdGlsZSc7XG59XG5cblByb2plY3RpbGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYWxsLnByb3RvdHlwZSk7XG5Qcm9qZWN0aWxlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb2plY3RpbGU7XG5cblByb2plY3RpbGUucHJvdG90eXBlLm9uQ29sbGlkZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHRvYmplY3Qub25IaXQodGhpcy5kYW1hZ2UsIHRoaXMub3JpZ2luKTtcblx0dGhpcy5yZW1vdmUoKTtcbn1cblxuUHJvamVjdGlsZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucG9vbC5yZW1vdmUodGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdGlsZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBvYmplY3RCb3hlcyA9IHJlcXVpcmUoJy4vb2JqZWN0Qm94ZXMnKTtcblxuZnVuY3Rpb24gUHJvamVjdGlsZVBvb2woKSB7XG5cdHRoaXMucHJvamVjdGlsZXMgPSBbXTtcbn1cblxuUHJvamVjdGlsZVBvb2wucHJvdG90eXBlLmFkZFByb2plY3RpbGUgPSBmdW5jdGlvbihwcm9qZWN0aWxlKSB7XG5cdHRoaXMucHJvamVjdGlsZXMucHVzaChwcm9qZWN0aWxlKTtcblx0b2JqZWN0Qm94ZXMuYWRkT2JqZWN0KHByb2plY3RpbGUpO1xufVxuXG5Qcm9qZWN0aWxlUG9vbC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24ocHJvamVjdGlsZSkge1xuXHR2YXIgaW5kZXggPSB0aGlzLnByb2plY3RpbGVzLmluZGV4T2YocHJvamVjdGlsZSk7XG5cdHRoaXMucHJvamVjdGlsZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0b2JqZWN0Qm94ZXMucmVtb3ZlT2JqZWN0KHByb2plY3RpbGUpO1xufVxuXG5Qcm9qZWN0aWxlUG9vbC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uIChjdHgsIGNhbWVyYSkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvamVjdGlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLnByb2plY3RpbGVzW2ldLmRyYXcoY3R4LCBjYW1lcmEpO1xuXHR9XG59XG5cblByb2plY3RpbGVQb29sLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvamVjdGlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLnByb2plY3RpbGVzW2ldLnVwZGF0ZShpbnB1dCk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdGlsZVBvb2w7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG5cbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJyk7XG52YXIgeFBsdXNZRGlzdGFuY2UgPSByZXF1aXJlKCcuL3BvaW50JylbJ3hQbHVzWURpc3RhbmNlJ107XG52YXIgV2VhcG9uID0gcmVxdWlyZSgnLi93ZWFwb24nKTtcblxuZnVuY3Rpb24gU2hpcCh4LCB5LCBjYW1lcmEsIGNhbnZhcywgc3JjKSB7XG5cdEJhbGwuYXBwbHkodGhpcywgW3gsIHldKTtcblx0dGhpcy54ID0geDtcblx0dGhpcy55ID0geTtcblx0dGhpcy5hbmdsZSA9IDA7XG5cdHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuXHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcblx0dGhpcy5sYXN0UmVnZW4gPSAtMTAwMDtcblxuXG5cdHRoaXMudmVsWCA9IDA7XG5cdHRoaXMudmVsWSA9IDA7XG5cdC8vIE1heCBsaW5lYXIgdmVsb2NpdHkgb2Ygc2hpcCAoeCBhbmQgeSBoeXBvdGVudXNlKVxuXHR0aGlzLm1heFZlbCA9IDIwO1xuXG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHQvLyBNYXggcm90YXRpb24gc3BlZWQgb2Ygc2hpcFxuXHR0aGlzLm1heFJvdGF0aW9uU3BlZWQgPSAwLjQ7XG5cdHRoaXMud2lkdGggPSAxMjg7XG5cdHRoaXMuaGVpZ2h0ID0gMTI4O1xuXHR0aGlzLnJhZGl1cyA9IDEyOCAvIDI7XG5cblx0Ly8gSGl0IHBvaW50c1xuXHR0aGlzLmhwID0gMTI4O1xuXHR0aGlzLm1heGhwID0gdGhpcy5ocDtcblx0dGhpcy5tYXhTaGllbGRzID0gNTA7XG5cdHRoaXMuc2hpZWxkcyA9IDUwO1xuXG5cdHRoaXMucG9pbnRzID0gdGhpcy5tYXhocDtcblxuXHR0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG5cdHRoaXMuaW1hZ2Uuc3JjID0gc3JjO1xuXHRcblxuXHR0aGlzLmVuZW1pZXMgPSB7fTtcblx0dGhpcy5lbmVtaWVzWydQbGF5ZXInXSA9IHRydWU7XG5cdHRoaXMubmFtZSA9IFwiRW5lbXlcIjtcblxuXHR0aGlzLm9sZERpc3RhbmNlID0gMTAwMDAwMDAwMDAwMDAwO1xuXHR0aGlzLm9sZEFuZ2xlID0gMDtcblxuXHR0aGlzLndlYXBvbiA9IG5ldyBXZWFwb24oNTAsIDMwLCAyMCk7XG59XG5cblNoaXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYWxsLnByb3RvdHlwZSk7XG5TaGlwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNoaXA7XG5cblNoaXAucHJvdG90eXBlLnRocnVzdCA9IGZ1bmN0aW9uKGFjY2VsKSB7XG5cdHZhciBuZXdWZWxYID0gdGhpcy52ZWxYICsgTWF0aC5zaW4odGhpcy5hbmdsZSkgKiBhY2NlbDtcblx0dmFyIG5ld1ZlbFkgPSB0aGlzLnZlbFkgLSBNYXRoLmNvcyh0aGlzLmFuZ2xlKSAqIGFjY2VsO1xuXHR2YXIgbmV3VmVsID0gTWF0aC5zcXJ0KE1hdGgucG93KG5ld1ZlbFgsIDIpICsgTWF0aC5wb3cobmV3VmVsWSwgMikpO1xuXHR2YXIgb2xkVmVsID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMudmVsWCwgMikgKyBNYXRoLnBvdyh0aGlzLnZlbFksIDIpKTtcblx0aWYoKG5ld1ZlbCA8IHRoaXMubWF4VmVsKSB8fCAobmV3VmVsIDwgb2xkVmVsKSkge1xuXHRcdHRoaXMudmVsWCA9IG5ld1ZlbFg7XG5cdFx0dGhpcy52ZWxZID0gbmV3VmVsWTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnZlbFggPSBuZXdWZWxYICogdGhpcy5tYXhWZWwgLyBuZXdWZWw7XG5cdFx0dGhpcy52ZWxZID0gbmV3VmVsWSAqIHRoaXMubWF4VmVsIC8gbmV3VmVsO1xuXHR9XG5cdHRoaXMudGhydXN0QXBwbGllZCA9IHRydWU7XG59XG5cbi8vIEZpcmUgbWV0aG9kXG5TaGlwLnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24oKSB7XG5cdGlmKHRoaXMud2VhcG9uKSB7XG5cdFx0dGhpcy53ZWFwb24uZmlyZSh0aGlzKTtcblx0fVxufVxuXG5TaGlwLnByb3RvdHlwZS5vbkhpdCA9IGZ1bmN0aW9uIChkYW1hZ2UsIHNvdXJjZSkge1xuXHRpZiAoc291cmNlLm5hbWUgPT09IHRoaXMubmFtZSB8fCBzb3VyY2UubmFtZS5zcGxpdCgnICcpWzBdID09PSB0aGlzLmZhY3Rpb24pIHtcblxuXHR9IGVsc2UgaWYoc291cmNlKXtcblx0XHR0aGlzLmVuZW1pZXNbc291cmNlLm5hbWVdID0gdHJ1ZTtcblx0fVxuXHRpZihkYW1hZ2UgPiB0aGlzLnNoaWVsZHMpIHtcblx0XHRkYW1hZ2UgLT0gdGhpcy5zaGllbGRzO1xuXHRcdHRoaXMuc2hpZWxkcyA9IDA7XG5cdFx0dGhpcy5ocCAtPSBkYW1hZ2U7XG5cdFx0aWYodGhpcy5ocCA8PSAwKSB7XG5cdFx0XHRpZihzb3VyY2UpIHtcblx0XHRcdFx0c291cmNlLnBvaW50cyArPSB0aGlzLnBvaW50cztcblx0XHRcdH1cblx0XHRcdHRoaXMucmVtb3ZlKCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHRoaXMuc2hpZWxkcyAtPSBkYW1hZ2U7XG5cdH1cbn1cblxuU2hpcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG59XG5cblNoaXAucHJvdG90eXBlLnJlZ2VuU2hpZWxkcyA9IGZ1bmN0aW9uKCkge1xuXHRpZihnbG9iYWxzLmZyYW1lQ291bnQgLSB0aGlzLmxhc3RSZWdlbiA+IDE1KSB7XG5cdFx0dGhpcy5sYXN0UmVnZW4gPSBnbG9iYWxzLmZyYW1lQ291bnQ7XG5cdFx0aWYodGhpcy5zaGllbGRzIDwgdGhpcy5tYXhTaGllbGRzKSB7XG5cdFx0XHR0aGlzLnNoaWVsZHMrKztcblx0XHR9XHRcdFxuXHR9XG59XG5cblNoaXAucHJvdG90eXBlLnRocnVzdEFjY2VsID0gZnVuY3Rpb24oYWNjZWwpIHtcblxuXHRpZihNYXRoLmFicyh0aGlzLnJvdGF0aW9uICsgYWNjZWwpIDwgdGhpcy5tYXhSb3RhdGlvblNwZWVkKSB7XG5cdFx0dGhpcy5yb3RhdGlvbiArPSBhY2NlbDtcblx0fVxuXG5cdHRoaXMucm90YXRpb25BcHBsaWVkID0gdHJ1ZTtcbn1cblxuU2hpcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob2JqZWN0cykge1xuXHR0aGlzLnJvdGF0aW9uQXBwbGllZCA9IGZhbHNlO1xuXHR0aGlzLnRocnVzdEFwcGxpZWQgPSBmYWxzZTtcblxuXHR0aGlzLnJlZ2VuU2hpZWxkcygpO1xuXG5cdC8vIEZpbmQgY2xvc2VzdCBlbmVteVxuXHR2YXIgY2xvc2VzdEVuZW15ID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodGhpcy5lbmVtaWVzW29iamVjdHNbaV0ubmFtZV0pIHtcblx0XHRcdHZhciBkaXN0YW5jZSA9IHhQbHVzWURpc3RhbmNlKG9iamVjdHNbaV0ueCwgb2JqZWN0c1tpXS55LCB0aGlzLngsIHRoaXMueSk7XG5cdFx0XHRpZighY2xvc2VzdEVuZW15LmVuZW15IHx8IGNsb3Nlc3RFbmVteS5kaXN0YW5jZSA+IGRpc3RhbmNlKSB7XG5cdFx0XHRcdGNsb3Nlc3RFbmVteS5lbmVteSA9IG9iamVjdHNbaV07XG5cdFx0XHRcdGNsb3Nlc3RFbmVteS5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEhlYWQgdG93YXJkcyBjbG9zZXN0IGVuZW15IGlzIGZhciBhd2F5XG5cdGlmKGNsb3Nlc3RFbmVteS5lbmVteSkge1xuXHRcdHZhciBlbmVteSA9IGNsb3Nlc3RFbmVteS5lbmVteTtcblx0XHRpZihjbG9zZXN0RW5lbXkuZGlzdGFuY2UgPCAxMCkgeyAvLyBCYWNrIGF3YXlcblx0XHRcdC8vIFJVTiBBV0FZP1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8qdmFyIGRpc3RhbmNlID0gY2xvc2VzdEVuZW15LmRpc3RhbmNlO1xuXHRcdFx0dmFyIHJhdGlvID0gZGlzdGFuY2UgLyB0aGlzLm9sZERpc3RhbmNlOyovXG5cdFx0XHR2YXIgYW5nbGUgPSB0aGlzLm9sZEFuZ2xlO1xuXHRcdFx0LyppZiAocmF0aW8gPCAwLjkgfHwgcmF0aW8gPiAxLjEpIHsqL1xuXHRcdFx0XHRhbmdsZSA9IGhlbHBlcnMuYW5nbGUodGhpcywgY2xvc2VzdEVuZW15LmVuZW15KTtcblx0XHRcdFx0Lyp0aGlzLm9sZERpc3RhbmNlID0gZGlzdGFuY2U7XG5cdFx0XHRcdHRoaXMub2xkQW5nbGUgPSBhbmdsZTtcblx0XHRcdH0qL1xuXHRcdFx0dmFyIGFuZ2xlRGlmZiA9IGhlbHBlcnMuYW5nbGVEaWZmKHRoaXMuYW5nbGUsIGFuZ2xlKTtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZygnYW5nbGVEaWZmJywgYW5nbGVEaWZmKTtcblxuXHRcdFx0dmFyIGRlY2VsZXJhdGVSb3RhdGlvbjtcblx0XHRcdGlmICh0aGlzLnJvdGF0aW9uICE9PSAwKSB7XG5cdFx0XHRcdGRlY2VsZXJhdGVSb3RhdGlvbiA9IC10aGlzLnJvdGF0aW9uIC8gTWF0aC5hYnModGhpcy5yb3RhdGlvbikgKiAwLjAwNTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlY2VsZXJhdGVSb3RhdGlvbiA9IC0wLjAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5yb3RhdGlvbiA+IDAuMSkgeyAvL1Nsb3cgZG93blxuXHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKGRlY2VsZXJhdGVSb3RhdGlvbik7XG5cdFx0XHRcdGlmIChNYXRoLmFicyhhbmdsZURpZmYpIDwgMC4zKSB0aGlzLnRocnVzdCgwLjUpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgZmluYWxBbmdsZSA9IGFuZ2xlRGlmZiAtIHRoaXMucm90YXRpb24gKiB0aGlzLnJvdGF0aW9uIC8gZGVjZWxlcmF0ZVJvdGF0aW9uIC8gMjtcblx0XHRcdFx0ZmluYWxBbmdsZSA9IGhlbHBlcnMubW9kKChmaW5hbEFuZ2xlICsgTWF0aC5QSSksIChNYXRoLlBJICogMikpIC0gTWF0aC5QSTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnZmluYWxBbmdsZScsIGZpbmFsQW5nbGUpO1xuXHRcdFx0XHRpZiAoZmluYWxBbmdsZSA+IE1hdGguUEkgLyAyIHx8IGZpbmFsQW5nbGUgPCAtTWF0aC5QSSAvIDIpIHtcblx0XHRcdFx0XHRpZiAoTWF0aC5hYnModGhpcy5yb3RhdGlvbikgPiAwLjA1KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKGRlY2VsZXJhdGVSb3RhdGlvbik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMudGhydXN0QWNjZWwoLWFuZ2xlRGlmZiAvIE1hdGguYWJzKGFuZ2xlRGlmZikgKiAwLjAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoZmluYWxBbmdsZSA+IDAuMDEpIHtcblx0XHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKC0wLjAxKTtcblx0XHRcdFx0fSBlbHNlIGlmIChmaW5hbEFuZ2xlIDwgLTAuMDEpIHtcblx0XHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKDAuMDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMudGhydXN0QWNjZWwoZGVjZWxlcmF0ZVJvdGF0aW9uKTtcblx0XHRcdFx0XHRpZiAoYW5nbGVEaWZmIDwgMC4zICYmIGFuZ2xlRGlmZiA+IC0wLjMpIHtcblx0XHRcdFx0XHRcdHRoaXMudGhydXN0KDAuNSk7XG5cdFx0XHRcdFx0XHRpZiAoY2xvc2VzdEVuZW15LmRpc3RhbmNlIDwgNTAwICsgdGhpcy5oZWlnaHQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy53ZWFwb24uZmlyZSh0aGlzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0fVxuXHR9XG5cblx0aWYoIXRoaXMudGhydXN0QXBwbGllZCkge1xuXHRcdGlmKHRoaXMudmVsWCA8IDAuMSAmJiB0aGlzLnZlbFggPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFggPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFggPSB0aGlzLnZlbFggKiAwLjk5O1xuXHRcdH1cblxuXHRcdGlmKHRoaXMudmVsWSA8IDAuMSAmJiB0aGlzLnZlbFkgPiAtMC4xKSB7XG5cdFx0XHR0aGlzLnZlbFkgPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbFkgPSB0aGlzLnZlbFkgKiAwLjk5O1xuXHRcdH1cblx0fVxuXG5cdGlmKCF0aGlzLnJvdGF0aW9uQXBwbGllZCkge1xuXHRcdGlmKHRoaXMucm90YXRpb24gPCAwLjAwMSAmJiB0aGlzLnJvdGF0aW9uID4gLTAuMDAxKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yb3RhdGlvbiAqPSAwLjk5O1xuXHRcdH1cblx0fSBcblx0XG5cdHRoaXMuYW5nbGUgKz0gdGhpcy5yb3RhdGlvbjtcbn07XG5cblNoaXAucHJvdG90eXBlLnR1cm5UbyA9IGZ1bmN0aW9uKG9iamVjdCwgYWxpZ25lZENhbGxiYWNrKSB7XG5cdHZhciBhbmdsZSA9IGhlbHBlcnMuYW5nbGUodGhpcywgb2JqZWN0KTtcblx0dmFyIGFuZ2xlRGlmZiA9IGhlbHBlcnMuYW5nbGVEaWZmKHRoaXMuYW5nbGUsIGFuZ2xlKTtcblxuXHQvL2NvbnNvbGUubG9nKCdhbmdsZURpZmYnLCBhbmdsZURpZmYpO1xuXG5cdHZhciBkZWNlbGVyYXRlUm90YXRpb247XG5cdGlmICh0aGlzLnJvdGF0aW9uICE9PSAwKSB7XG5cdFx0ZGVjZWxlcmF0ZVJvdGF0aW9uID0gLXRoaXMucm90YXRpb24gLyBNYXRoLmFicyh0aGlzLnJvdGF0aW9uKSAqIDAuMDA1O1xuXHR9IGVsc2Uge1xuXHRcdGRlY2VsZXJhdGVSb3RhdGlvbiA9IC0wLjAxO1xuXHR9XG5cblx0aWYgKHRoaXMucm90YXRpb24gPiAwLjEpIHsgLy9TbG93IGRvd25cblx0XHR0aGlzLnRocnVzdEFjY2VsKGRlY2VsZXJhdGVSb3RhdGlvbik7XG5cdFx0aWYgKE1hdGguYWJzKGFuZ2xlRGlmZikgPCAwLjMpIHRoaXMudGhydXN0KDAuNSk7XG5cdFx0cmV0dXJuO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBmaW5hbEFuZ2xlID0gYW5nbGVEaWZmIC0gdGhpcy5yb3RhdGlvbiAqIHRoaXMucm90YXRpb24gLyBkZWNlbGVyYXRlUm90YXRpb24gLyAyO1xuXHRcdGZpbmFsQW5nbGUgPSBoZWxwZXJzLm1vZCgoZmluYWxBbmdsZSArIE1hdGguUEkpLCAoTWF0aC5QSSAqIDIpKSAtIE1hdGguUEk7XG5cdFx0Ly9jb25zb2xlLmxvZygnZmluYWxBbmdsZScsIGZpbmFsQW5nbGUpO1xuXHRcdGlmIChmaW5hbEFuZ2xlID4gTWF0aC5QSSAvIDIgfHwgZmluYWxBbmdsZSA8IC1NYXRoLlBJIC8gMikge1xuXHRcdFx0aWYgKE1hdGguYWJzKHRoaXMucm90YXRpb24pID4gMC4wNSkge1xuXHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKGRlY2VsZXJhdGVSb3RhdGlvbik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRocnVzdEFjY2VsKC1hbmdsZURpZmYgLyBNYXRoLmFicyhhbmdsZURpZmYpICogMC4wMSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChmaW5hbEFuZ2xlID4gMC4wMSkge1xuXHRcdFx0dGhpcy50aHJ1c3RBY2NlbCgtMC4wMSk7XG5cdFx0fSBlbHNlIGlmIChmaW5hbEFuZ2xlIDwgLTAuMDEpIHtcblx0XHRcdHRoaXMudGhydXN0QWNjZWwoMC4wMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudGhydXN0QWNjZWwoZGVjZWxlcmF0ZVJvdGF0aW9uKTtcblx0XHRcdGlmIChhbmdsZURpZmYgPCAwLjMgJiYgYW5nbGVEaWZmID4gLTAuMykge1xuXHRcdFx0XHRpZiAoYWxpZ25lZENhbGxiYWNrKSBhbGlnbmVkQ2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cblNoaXAucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoY3R4LCBjYW1lcmEpIHtcblx0Y3R4LnNhdmUoKTtcblxuXHRjYW1lcmEuYXBwbHlUcmFuc2Zvcm0oY3R4KTtcblx0Y3R4LnRyYW5zbGF0ZSh0aGlzLngsIHRoaXMueSk7XG5cdGN0eC5yb3RhdGUodGhpcy5hbmdsZSk7XG5cblx0Y3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAtdGhpcy53aWR0aCAvIDIsIC10aGlzLmhlaWdodCAvIDIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XHQpO1xuXHRjdHgucmVzdG9yZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Ym94U2l6ZTogNDUwXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUHJvamVjdGlsZSA9IHJlcXVpcmUoJy4vcHJvamVjdGlsZScpO1xudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxuZnVuY3Rpb24gV2VhcG9uKGRhbWFnZSwgcm9mLCBzcGVlZCkge1xuXHQvLyAxMCBEYW1hZ2UgcGVyIHNob3Rcblx0dGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XG5cblx0Ly8gNSBXYWl0IGZyYW1lcyBiZXR3ZWVuIHNob3RzXG5cdHRoaXMucm9mID0gcm9mO1xuXG5cdC8vIExhc3QgZnJhbWUgc2hvdCB3YXMgZmlyZWQgaW5pdGlhdGVkIHRvIG5lZ2F0aXZlXG5cdHRoaXMubGFzdEZpcmUgPSAtMTAwMDtcblxuXHR0aGlzLnNwZWVkID0gc3BlZWQ7XG59XG5cbi8vIFNob290cyBhIHByb2plY3RpbGUgZnJvbSB0aGUgZ3VuIGlmIGNvb2xkb3duIGlzIG92ZXIuXG5XZWFwb24ucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbihvcmlnaW4pIHtcblx0aWYoKGdsb2JhbHMuZnJhbWVDb3VudCAtIHRoaXMubGFzdEZpcmUpID4gdGhpcy5yb2YpIHtcblx0XHR0aGlzLmxhc3RGaXJlID0gZ2xvYmFscy5mcmFtZUNvdW50O1xuXHRcdG5ldyBQcm9qZWN0aWxlKG9yaWdpbi54LCBvcmlnaW4ueSxcblx0XHRcdE1hdGguc2luKG9yaWdpbi5hbmdsZSkgKiB0aGlzLnNwZWVkICsgb3JpZ2luLnZlbFgsXG5cdFx0XHQgLU1hdGguY29zKG9yaWdpbi5hbmdsZSkgKiB0aGlzLnNwZWVkICsgb3JpZ2luLnZlbFksXG5cdFx0XHQgIGdsb2JhbHMucHJvamVjdGlsZVBvb2wsIG9yaWdpbiwgdGhpcy5kYW1hZ2UpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2VhcG9uOyJdfQ==
