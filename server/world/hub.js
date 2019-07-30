var HUB = new class {
	constructor() {
		this._players = [];
		this._allowedWeapons = [];
		this._allowedVehicles = [];
		this._dim = 0;
		this._safezones = [];
		this._spawn = {
			x:-184.00881958007812, y:-1077.828857421875, z:42.13929748535156
		};
	}
	join(player) {
		let self = this;
		if (player) {
			player.setVariable("current_status", "hub");
			player.call("Lobby:Hide");
			player.interface.spawn(this._spawn.x, this._spawn.y, this._spawn.z, 0, [], 0);
			player.call("HUB:PlayerCam");
			player.alpha = 255;
			player.dimension = 0;
			player.call("HUB:LoadData", [JSON.stringify(this._safezones), JSON.stringify(this._allowedWeapons), JSON.stringify(this._allowedVehicles)]);
			setTimeout(function() {
				if (player) {
					self._players.push(player);
					player.call("GP:StartGame", [true]);
				}
			}, 5000)
		}
	}
	addSafeZone(x, y, z, tx, ty, tz) {
		this._safezones.push({
			x: x,
			y: y,
			z: z,
			tx: tx,
			ty: ty,
			tz: tz
		});
	}
	leave(player) {
		if (!player) return;
		player.call("Lobby:Hide");
	}
	isInHub(player) {
		return this._players.indexOf(player) > -1;
	}
}
module.exports = HUB;