var HUB = new class {
	constructor() {
		this._players = [];
		this._allowedWeapons = [];
		this._allowedVehicles = [];
		this._dim = 0;
		this._safezones = [];
		this._spawn = {
			x: 199.15451049804688,
			y: -1012.1060791015625,
			z: 29.303680419921875
		};
	}
	join(player) {
		let self = this;
		if (player) {
			player.setVariable("current_status", "hub");
			player.call("Lobby:Hide");
			player.interface.spawn(this._spawn.x, this._spawn.y, this._spawn.z, 0, [], 0);
			player.call("HUB:PlayerCam");
			player.dimension = 0;
			player.call("HUB:LoadData", [JSON.stringify(this._safezones), JSON.stringify(this._allowedWeapons), JSON.stringify(this._allowedVehicles)]);
			setTimeout(function() {
				if (typeof player != "object") return;
				self._players.push(player);
				player.call("GP:StartGame", [true]);
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
		if (typeof player != "object") return;
		player.call("Lobby:Hide");
	}
	isInHub(player) {
		return this._players.indexOf(player) > -1;
	}
}
module.exports = HUB;