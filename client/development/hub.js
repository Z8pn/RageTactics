//mp.gpGameStarted
var HUB = new class {
	constructor() {
		this._safezones = [];
		this._allowedWeapons = [];
		this._allowedVehicles = [];


	}
	loadData(safeZones,weapons,vehicles) {
		this._safezones = safeZones;
		this._allowedVehicles = vehicles;
		this._allowedWeapons = weapons;
	}


}








mp.events.add("HUB:LoadData", (safeZones,weapons,vehicles) => {
    safeZones = JSON.parse(safeZones);
    weapons = JSON.parse(weapons);
    vehicles = JSON.parse(vehicles);
    HUB.loadData(safeZones,weapons,vehicles);
});