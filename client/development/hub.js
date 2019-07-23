//mp.gpGameStarted
var HUB = new class {
	constructor() {
		let self = this;
		this._safezones = [];
		this._allowedWeapons = [];
		this._allowedVehicles = [];
		this._inSafeZone = false;
		this._safeZoneTImer = setInterval(function() {
			self.checkSafezones();
		}, 1000);
	}
	loadData(safeZones, weapons, vehicles) {
		this._safezones = safeZones;
		this._allowedVehicles = vehicles;
		this._allowedWeapons = weapons;
	}
	checkSafezones() {}
}
mp.events.add('render', (nametags) => {
	if (mp.players.local.getVariable("current_status") == "hub") {
		mp.gpGameStarted = false;
	}
	if (mp.players.local.getVariable("current_status") == "cam") {
		mp.game.controls.disableAllControlActions(0);
	}
});
var LobbyState = false;
mp.keys.bind(0x72, false, function() {
	if (mp.gpGameStarted == false) {
		console.log("show lobby");
		mp.events.call("Lobby:Show", !LobbyState);
		LobbyState = !LobbyState;
	}
});
mp.events.add("HUB:LoadData", (safeZones, weapons, vehicles) => {
	safeZones = JSON.parse(safeZones);
	weapons = JSON.parse(weapons);
	vehicles = JSON.parse(vehicles);
	HUB.loadData(safeZones, weapons, vehicles);
});