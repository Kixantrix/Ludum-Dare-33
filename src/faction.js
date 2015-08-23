"use strict";

var globals = require('./globals');

var factionNames = ["Organics", "Purple", "Dark Gray", "Red", "Blue", "Green", "Orange", "Gray"];

var factionInfo = {
	"Organics": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/alien3.png";
			},
			"civilian": {
				"src": "images/spaceships/alien4.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/alien2.png";
			},
			"capitalShip": {
				"src": "images/spaceships/alien1.png"
			}
		}
	},

	"Purple": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/att5.png";
			},
			"civilian": {
				"src": "images/spaceships/att3.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/blue1.png";
			},
			"capitalShip": {
				"src": "images/spaceships/blue2.png"
			}
		}
	},

	"Gray": {
		"ships": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/wship-4.png";
			},
			"civilian": {
				"src": "images/spaceships/wship-2.png";
			},
			"freighter": {
				"src": "images/spaceships/xspr5.png";
			},
			"gunShip": {
				"src": "images/spaceships/wship1.png";
			},
			"capitalShip": {
				"src": "images/spaceships/wship-3.png"
			}
		}
	},

	"Red": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/RD2.png";
			},
			"civilian": {
				"src": "images/spaceships/RD3.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/RD1.png";
			},
			"capitalShip": {
				"src": "images/spaceships/att2.png"
			}
		}
	},

	"Blue": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/blueship2.png";
			},
			"civilian": {
				"src": "images/spaceships/blueship4.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/blueship3.png";
			},
			"capitalShip": {
				"src": "images/spaceships/blueship1.png"
			}
		}
	},

	"Green": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/greenship2.png";
			},
			"civilian": {
				"src": "images/spaceships/greenship3.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/greenship4.png";
			},
			"capitalShip": {
				"src": "images/spaceships/greenship1.png"
			}
		}
	},

	"Orange": {
		"ships": {
			"fighter": {
				"src": "images/spaceships/smallorange.png";
			},
			"civilian": {
				"src": "images/spaceships/orangeship3.png";
			},
			"freighter": {
				"src": "images/spaceships/heavyfreighter.png";
			},
			"gunShip": {
				"src": "images/spaceships/orangeship2.png";
			},
			"capitalShip": {
				"src": "images/spaceships/orangeship.png"
			}
		}
	}
}

function Faction(name) {

}

module.exports = Faction;