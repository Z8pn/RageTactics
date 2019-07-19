const fs = require('fs');
var MapManager = class {
	constructor() {
		let self = this;
		this._loadedMaps = [];
		this.loadMaps();
	}
	get maps() {
		return this._loadedMaps.map(e => e.name);
	}
	getMapData(name) {
		let map = this._loadedMaps.find(e => {
			return e.name == name;
		})
		if (map) {
			return {
				spawns: map.spawnpoints || [],
				objects: map.objects || [],
				teams: map.teams || [{
					name: "Team 1",
					clothing: []
				},{
					name: "Team 2",
					clothing: []
				}]
			}
		} else {
			return false;
		}
	}
	isMapLoaded(fileName) {
		return this._loadedMaps[fileName.replace(".js", "")] != undefined;
	}
	loadMap(fileName) {
		let self = this;
		console.log("loadmap", fileName);
		let temp_map = require("./maps/" + fileName);
		self._loadedMaps[fileName.replace(".js", "")] = {
			name: temp_map.name,
			objects: temp_map.objects
		}
		console.log("Loaded Map", temp_map.name)
	}
	loadMaps() {
		let self = this;
		fs.readdir("./maps", function(err, files) {
			files.forEach(function(map) {
				if (map.indexOf(".js") > -1) {
					if (self.isMapLoaded(map) == false) {
						self.loadMap(map);
					}
				}
			})
		});
	}
}
module.exports = new MapManager();