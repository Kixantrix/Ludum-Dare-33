"use strict";

var globals = require('./globals');
var Planet = require('./planet');
var FighterShip = require('./fighterShip');
var CivilianShip = require('./civilianShip');
var Freighter = require('./freighter');
var GunShip = require('./gunShip');
var CapitalShip = require('./capitalShip');

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

module.exports = Faction;