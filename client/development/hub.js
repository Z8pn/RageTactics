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
mp.events.add("HUB:PlayerCam", () => {
	mp.players.local.freezePosition(true);
	let cur_x = mp.defaultCam.getCoord().x;
	let cur_y = mp.defaultCam.getCoord().y;
	let cur_z = mp.defaultCam.getCoord().z;
	let camera2 = mp.cameras.new('default', new mp.Vector3(cur_x, cur_y, cur_z + 100), new mp.Vector3(), 60);
	camera2.pointAtCoord(cur_x, cur_y, cur_z);
	camera2.setActive(true);
	mp.defaultCam = camera2;
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
	//
	setTimeout(function() {
		let camera3 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 300), new mp.Vector3(), 60);
		camera3.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
		camera3.setActiveWithInterp(mp.defaultCam.handle, 1000, 1, 1);
		mp.defaultCam = camera3;
		setTimeout(function() {
			let camera4 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 1), new mp.Vector3(), 60);
			camera4.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
			mp.game.cam.doScreenFadeOut(3500);
			camera4.setActiveWithInterp(mp.defaultCam.handle, 3500, 1, 1);
			mp.defaultCam = camera4;
			setTimeout(function() {
				mp.game.cam.renderScriptCams(false, false, 0, true, false);
				setTimeout(function() {
					mp.game.cam.doScreenFadeIn(500);
				}, 200)
			}, 3500);
		}, 1100)
	}, 100)
});