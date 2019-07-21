
var HUB = new class {
	constructor() {
		this._players = [];
		this._allowedWeapons = [];
		this._allowedVehicles = [];
		this._dim = 0;
		this._safezones = [];
		this._spawn = {x:199.15451049804688, y:-1012.1060791015625, z:29.303680419921875};
	}
	join(player) {
		player.setVariable("hub",true);
        player.call("Lobby:Hide");
        player.class.spawn(this._spawn.x,this._spawn.y,this._spawn.z, 0, [],0);
        player.call("GP:StartGame");
        player.call("HUB:LoadData",[JSON.stringify(this._safezones),JSON.stringify(this._allowedWeapons),JSON.stringify(this._allowedVehicles)]);
	}
	addSafeZone(x,y,z,tx,ty,tz) {
		this._safezones.push({x:x,y:y:z:z,tx:tx,ty:ty,tz:tz});

	}
	leave(player) {
		player.setVariable("hub",false);
        player.call("Lobby:Hide");
	}
	isInHub(player) {
		return false;
	}
}



module.exports = HUB;