var ObjectLoader = new class {
	constructor() {
		let self = this;
		self._loadedObjects = [];
		self._toLoad = [];
		self._progress = {
			toLoad: 1000,
			loaded: 5
		}
		self._loadTimer = 100;
		self._lastLoad = Date.now();
		self._active = false;
		self._renderEvent = undefined;
		self._lobby = -1;
	}
	toggleRender(state) {
		let self = this;
		if (!state) state = !self._active;
		if (state == true) {
			self._active = true;
			if (!self._renderEvent) {
				self._renderEvent = new mp.Event('render', () => {
					self.render();
				});
			}
		} else {
			self._active = false;
			self._renderEvent.destroy();
			self._renderEvent = undefined;
		}
	}
	render() {
		let self = this;
		if (self._active == true) {
			let max_width = 0.1;
			let max_height = 0.008;
			mp.game.graphics.drawRect(0.5, 0.5, max_width, max_height, 0, 0, 0, 150);
			let cur_width = max_width / self._progress.toLoad * self._progress.loaded;
			mp.game.graphics.drawRect(0.5 - max_width / 2 + (cur_width / 2), 0.5, cur_width, max_height, 0, 255, 0, 150);
			mp.game.graphics.drawText(`Loading Objects (${ self._progress.loaded}/${self._progress.toLoad})`, [0.5, 0.52], {
				font: 4,
				color: [255, 255, 255, 185],
				scale: [0.3, 0.3],
				outline: true,
				centre: true
			});
			if ((Date.now() - self._lastLoad) >= self._loadTimer) {
				self._lastLoad = Date.now();
				let nextObject = self._toLoad.pop();
				if (nextObject) {
					mp.game.streaming.requestModel(mp.game.joaat(nextObject.model));
					if (mp.game.streaming.hasModelLoaded(mp.game.joaat(nextObject.model))) {
						let temp_object = mp.objects.new(mp.game.joaat(nextObject.model), new mp.Vector3(nextObject.x, nextObject.y, nextObject.z), {
							rotation: new mp.Vector3(nextObject.rx, nextObject.ry, nextObject.rz),
							alpha: 255,
							dimension: mp.players.local.dimension
						});
						temp_object.freezePosition(true);
						self._loadedObjects.push(temp_object)
						self._progress.loaded += 1;
					}
				}
				if (self._progress.loaded == self._progress.toLoad) {
					self.loaded();
				}
			}
		}
	}
	unload() {
		this._loadedObjects.forEach(function(object) {
			object.destroy();
		})
	}
	loaded() {
		console.log("loaded");
		this.toggleRender(false);
		mp.events.callRemote("LobbyManager:LoadingFinished", this._lobby);
	}
	load(lobbyId, arrObjects) {
		this._toLoad = arrObjects
		this._lobby = lobbyId;
		this._progress = {
			toLoad: arrObjects.length,
			loaded: 0
		}
		this.toggleRender(true);
	}
}
module.exports = ObjectLoader;