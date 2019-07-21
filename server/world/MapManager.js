const fs = require('fs');
var MapManager = class {
	constructor() {
		let self = this;
		console.log("Init Map Loader!")
		this._loadedMaps = [];
		this.loadMaps();
	}
	get maps() {
		let self = this;
		let m = Object.keys(self._loadedMaps).map(e => {
			return {
				name:self._loadedMaps[e].name,
				name:self._loadedMaps[e].weapons,
				name:self._loadedMaps[e].teams
			};
		});
		console.log(m);
		/*console.log("maps",Object.keys(self._loadedMaps).map(e => {
			let e = self._loadedMaps[e];
			return e.name;
		}))*/
		return m;
	}
	getMapData(name) {
		let self = this;
		let map = Object.keys(this._loadedMaps).findIndex(e => {
			e = self._loadedMaps[e];
			return e.name == name;
		})
		map = this._loadedMaps[Object.keys(this._loadedMaps)[map]];
		if (map) {
			console.log("map",map);
			return {
				name: map.name || "",
				image: map.image || "",
				max_players: map.max_players || 10,
				spawns: map.spawns || [],
				objects: map.objects || [],
				previewCam: map.previewCam || {},
				teams: map.teams || [{
					name: "Team 1",
					clothing: []
				}, {
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
		console.log("temp_map", temp_map);
		if (temp_map.spawns.length >= temp_map.max_players) {
			self._loadedMaps[fileName.replace(".js", "")] = {
				name: temp_map.name,
				objects: temp_map.objects,
				spawns: temp_map.spawns,
				teams: temp_map.teams,
				name: temp_map.name,
				image: temp_map.image,
				previewCam: temp_map.previewCam,
				max_players: temp_map.max_players
			}
			console.log("Loaded Map", temp_map.name)
		}
	}
	loadMaps() {
		let self = this;
		console.log("load dir");
		fs.readdir("./packages/RageTactics/world/maps", function(err, files) {
			console.log("err..", err);
			console.log("files..", files);
			files.forEach(function(map) {
				console.log("loading..");
				if (map.indexOf(".js") > -1) {
					if (self.isMapLoaded(map) == false) {
						console.log(map);
						self.loadMap(map);
					}
				}
			})
		});
	}
}
module.exports = new MapManager();