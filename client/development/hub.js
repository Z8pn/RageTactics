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
		},1000);

	}
	loadData(safeZones,weapons,vehicles) {
		this._safezones = safeZones;
		this._allowedVehicles = vehicles;
		this._allowedWeapons = weapons;
	}
	checkSafezones() {

	}
}



mp.events.add('render', (nametags) => {
	if (mp.players.local.getVariable("hub") == true) {
			

	}
});	





mp.events.add("HUB:LoadData", (safeZones,weapons,vehicles) => {
    safeZones = JSON.parse(safeZones);
    weapons = JSON.parse(weapons);
    vehicles = JSON.parse(vehicles);
    HUB.loadData(safeZones,weapons,vehicles);
});