(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const absolute_path = "package://RageTactics/cef/";
class CEFBrowser {
    constructor(url) {
        this._setup(url);
    }
    _setup(url) {
        let self = this;
        self.browser = mp.browsers.new(absolute_path + url);
        self.cursorState = false;
       // console.log("new instance");

    }
    call() {
        let args = Array.prototype.slice.call(arguments);
        let full = args[0];
        let callArgs = "(";
        for (let i = 1; i < args.length; i++) {
            switch (typeof args[i]) {
                case 'string':
                    {  
                        callArgs += "\'" + args[i] + "\'";
                        break;
                    }
                case 'number':
                case 'boolean':
                    {
                        callArgs += args[i];
                        break;
                    }
                case 'object':
                    {
                        callArgs += JSON.stringify(args[i]);
                        break;
                    }
            }
            if (i < (args.length - 1)) {
                callArgs += ",";
            }
        }
        callArgs += ");";
        full += callArgs;
        this.browser.execute(full);
    }
    active(toggle) {
        this.browser.active = toggle;
    }
    get isActive() {
        return this.browser.active;
    }
    cursor(state) {
        this.cursorState = state;
        mp.gui.cursor.visible = state;
    }
    clear() {
        this.load("empty.html")
    }
    load(path) {
        let self = this;
        self.browser.url = absolute_path + path;
    }
}
module.exports = new CEFBrowser("index.html");
},{}],2:[function(require,module,exports){
const statNames = ["SP0_STAMINA﻿", "SP0_STRENGTH", "SP0_LUNG_CAPACITY", "SP0_WHEELIE_ABILITY", "SP0_FLYING_ABILITY", "SP0_SHOOTING_ABILITY", "SP0_STEALTH_ABILITY"];
// maybe playerReady can be used instead, haven't tested
mp.events.add("playerSpawn", () => {
    for (const stat of statNames) mp.game.stats.statSetInt(mp.game.joaat(stat), 100, false);
});
var player_bones = {
    "SKEL_L_UpperArm": {
        bone_id: 45509,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_UpperArm": {
        bone_id: 40269,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Forearm": {
        bone_id: 61163,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_Forearm": {
        bone_id: 28252,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_Head": {
        bone_id: 31086,
        threshold: 0.15,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_Hand": {
        bone_id: 57005,
        threshold: 0.06,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Hand": {
        bone_id: 18905,
        threshold: 0.06,
        offset: {
            x: 0,
            y: 0,
            z: 0.05
        }
    },
    "SKEL_R_Clavicle": {
        bone_id: 10706,
        threshold: 0.1,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Clavicle": {
        bone_id: 64729,
        threshold: 0.1,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_Spine0": {
        bone_id: 23553,
        threshold: 0.15,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_Spine1": {
        bone_id: 24816,
        threshold: 0.15,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_Spine2": {
        bone_id: 24817,
        threshold: 0.15,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_Spine3": {
        bone_id: 24818,
        threshold: 0.15,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_Calf": {
        bone_id: 36864,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Calf": {
        bone_id: 63931,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Thigh": {
        bone_id: 58271,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_Thigh": {
        bone_id: 51826,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_R_Foot": {
        bone_id: 52301,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    "SKEL_L_Foot": {
        bone_id: 14201,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    }
}

function getWeaponDetails(weapon) {
    if (shotgunSpreadData[weapon]) return shotgunSpreadData[weapon]
    else return {
        spray: 1.5,
        max_dist: 30
    };
}

function getIsHitOnBone(hitPosition, target) {
    let nearest_bone = "";
    let nearest_bone_dist = 99;
    if (target != null) {
        for (let bone in player_bones) {
            let bone_id = player_bones[bone].bone_id;
            let offset = player_bones[bone].offset;
            let threshold = player_bones[bone].threshold;
            let headPos = mp.players.local.getBoneCoords(12844, 0, 0, 0);
            let pos = target.getBoneCoords(bone_id, offset.x, offset.y, offset.z);
            let raycast = mp.raycasting.testPointToPoint(hitPosition, pos, mp.players.local, (2));
            let hit_dist = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, pos.x, pos.y, pos.z);
            if (hit_dist < 1.6) {
                let vector = new mp.Vector3(hitPosition.x - headPos.x, hitPosition.y - headPos.y, hitPosition.z - headPos.z);
                let dist_aim = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, headPos.x, headPos.y, headPos.z);
                let vectorNear = vector.normalize(dist_aim);
                //....
                let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x, headPos.y, headPos.z);
                let vectorAtPos = vectorNear.multiply(dist);
                let aimdist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z)
                if (nearest_bone_dist > aimdist) {
                    if (aimdist <= threshold) {
                        nearest_bone = bone;
                        nearest_bone_dist = aimdist;
                    }
                }
            }
        }
    }
    return {
        hit: (nearest_bone != "" ? true : false),
        bone: nearest_bone,
        dist: nearest_bone_dist
    };
}

function isWallbugging(target_position) {
    let gun_pos = mp.players.local.getBoneCoords(40269, 0, 0, 0);
    let raycast = mp.raycasting.testPointToPoint(target_position, gun_pos, mp.players.local, -1);
    if (raycast) {
        let hit_pos = raycast.position;
        let entry_point = new mp.Vector3(hit_pos.x - gun_pos.x, hit_pos.y - gun_pos.y, hit_pos.z - gun_pos.z);
        let entry_dist = mp.game.system.vdist(hit_pos.x, hit_pos.y, hit_pos.z, gun_pos.x, gun_pos.y, gun_pos.z);
        let entry_normalize = entry_point.normalize(entry_dist / 2);
        let entry_final_point = entry_normalize.multiply(entry_dist / 2);
        let entry_point_vector = new mp.Vector3(hit_pos.x + entry_final_point.x, hit_pos.y + entry_final_point.y, hit_pos.z + entry_final_point.z)
        let exit_point_vector = new mp.Vector3(hit_pos.x - entry_final_point.x, hit_pos.y - entry_final_point.y, hit_pos.z - entry_final_point.z)
        let entry_point_pos = mp.raycasting.testPointToPoint(entry_point_vector, exit_point_vector, mp.players.local, -1);
        let exit_point_pos = mp.raycasting.testPointToPoint(exit_point_vector, entry_point_vector, mp.players.local, -1);
        if ((entry_point_pos) && (exit_point_pos)) {
            let dist = mp.game.system.vdist(entry_point_pos.position.x, entry_point_pos.position.y, entry_point_pos.position.z, exit_point_pos.position.x, exit_point_pos.position.y, exit_point_pos.position.z)
            if (dist < 0.45) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function calculateShotgunPelletsOnPlayers() {
    let hitted_entity = null;
    var gun_pos = mp.players.local.getBoneCoords(40269, 0, 0, 0);
    let aim_point = mp.players.local.aimingAt;
    let raycast = mp.raycasting.testPointToPoint(aim_point, gun_pos, mp.players.local, -1);
    if (!raycast) {
        mp.players.forEachInStreamRange((ped) => {
            if (mp.players.local != ped) {
                let pos = ped.getWorldPositionOfBone(ped.getBoneIndexByName("IK_Head"));
                let raycast1 = mp.raycasting.testPointToPoint(gun_pos, pos, mp.players.local, -1);
                if (!raycast1) {
                    let headPos = mp.players.local.getBoneCoords(12844, 0, 0, 0);
                    let vector = new mp.Vector3(aim_point.x - headPos.x, aim_point.y - headPos.y, aim_point.z - headPos.z);
                    let dist_aim = mp.game.system.vdist(aim_point.x, aim_point.y, aim_point.z, headPos.x, headPos.y, headPos.z);
                    let vectorNear = vector.normalize(dist_aim);
                    //....
                    let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x, headPos.y, headPos.z);
                    let vectorAtPos = vectorNear.multiply(dist);
                    let aim_vector = new mp.Vector3(headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z);
                    let spray_dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z)
                    let ped_dist = mp.game.system.vdist(pos.x, pos.y, pos.z, gun_pos.x, gun_pos.y, gun_pos.z)
                    let w_data = getWeaponDetails(Number(mp.players.local.weapon));
                    if (w_data) {
                        let spray_size = lerp(0.5, w_data.spray, 1 / w_data.max_dist * ped_dist)
                        if (spray_size > w_data.spray) spray_size = w_data.spray;
                        let would_hit = false;
                        if (spray_size > spray_dist) would_hit = true;
                        if (would_hit == true) {
                            hitted_entity = ped;
                        }
                    }
                }
            }
        });
    }
    return hitted_entity;
}
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    let weapon_hash = mp.players.local.weapon;
    let ammo = mp.players.local.getAmmoInClip(weapon_hash);
    mp.events.callRemote("Combat:FireWeapon", weapon_hash.toString(), ammo);
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    targetEntity = mp.players.local;
    if (isWallbugging(targetPosition) == false) {
        if (targetEntity) {
            let bone = getIsHitOnBone(targetPosition, targetEntity).bone;
            mp.events.callRemote("Combat:Hit", targetEntity, weapon_hash.toString(), bone.toString());
        } else {
            if (mp.game.weapon.getWeapontypeGroup(weapon_hash) == 860033945) {
                let shotgunHitEntity = calculateShotgunPelletsOnPlayers();
                if (shotgunHitEntity != null) {
                    mp.events.callRemote("Combat:Hit", shotgunHitEntity, weapon_hash.toString());
                }
            }
        }
    }
});
var curHealth = 100;
var curArmor = 100;
mp.events.add('AC:SetHealth', (h) => {
    curHealth = h;
    console.log("curHealth", h);
});
mp.events.add('AC:SetArmor', (a) => {
    curArmor = a;
    console.log("curArmor", a);
});
var timerHitmarker = 0;
var timerHitmarkerDeath = 0;
mp.events.add("render", () => {
    mp.game.player.resetStamina();
    if (!mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        mp.game.graphics.requestStreamedTextureDict("hud_reticle", true);
    }
    if (mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        if ((Date.now() / 1000 - timerHitmarker) <= 0.1) {
            mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 255, 255, 255, 150);
        }
        if ((Date.now() / 1000 - timerHitmarkerDeath) <= 0.1) {
            mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 255, 100, 100, 150);
        }
    }
    if (curHealth > mp.players.local.getHealth()) {
        curHealth = mp.players.local.getHealth()
        console.log("trigger hp set", curHealth);
        mp.events.callRemote("User:ResyncHealth", curHealth);
    }
    if (curArmor > mp.players.local.getArmour()) {
        curArmor = mp.players.local.getArmour()
        mp.events.callRemote("User:ResyncArmor", curArmor);
        console.log("trigger armor set", curArmor);
    }
    if ((curHealth == 0) && (mp.players.local.getHealth() != 0)) {
        mp.players.local.setHealth(curHealth);
        console.log("set death");
    }
});
mp.events.add("Combat:Hit", (dmg) => {
    console.log("Combat:Hit", dmg);
    timerHitmarker = Date.now() / 1000;
});
mp.events.add("Combat:Kill", () => {
    console.log("Combat:Kill");
    timerHitmarkerDeath = Date.now() / 1000;
});
mp.events.add("Combat:Hitted", (dmg) => {
    mp.players.local.setOnlyDamagedByPlayer(false);
    mp.players.local.setProofs(true, false, false, false, false, false, false, false);
    console.log("Combat:Hitted", dmg);
});



},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
"use strict";


mp.gameplayCam = mp.cameras.new('gameplay');
mp.defaultCam = mp.cameras.new('default');
console.log = function(...a) {
    a = a.map(function(e) {
        return JSON.stringify(e);
    })
    mp.gui.chat.push("DeBuG:" + a.join(" "))
};
require("./vector.js")
require("./scaleforms/index.js");


mp.CamManager = require("./libs/camerasManager.js"); 
mp.clientState = "waiting";
var natives = require("./natives.js");
var CEFBrowser = require("./browser.js");
require("./lobby.js")
require("./login.js")
require("./hub.js")
require("./nametag.js")
require("./combat.js")


// Account Stuff
mp.gui.chat.show(false);
mp.events.callRemote("ServerAccount:Ready");
mp.game.graphics.transitionToBlurred(1);

mp.gui.chat.enabled = false;
mp.gui.execute("const _enableChatInput = enableChatInput;enableChatInput = (enable) => { mp.trigger('chatEnabled', enable); _enableChatInput(enable) };");
mp.events.add('chatEnabled', (isEnabled) => {
    mp.gui.chat.enabled = isEnabled;
});
mp.localPlayer = mp.players.local;
mp.localPlayer.getPos = function() {
    return mp.vector(this.position);
}
mp.ui = {};
mp.ui.ready = false;
mp.gameplayCam.setAffectsAiming(true);

mp.events.add('chatEnabled', (isEnabled) => {



});
},{"./browser.js":1,"./combat.js":2,"./hub.js":3,"./libs/camerasManager.js":5,"./lobby.js":6,"./login.js":7,"./nametag.js":8,"./natives.js":9,"./scaleforms/index.js":13,"./vector.js":14}],5:[function(require,module,exports){
const CamerasManagerInfo = {
    gameplayCamera: null,
    activeCamera: null,
    interpCamera: null,
    interpActive: false,
    _events: new Map(),
    cameras: new Map([
        ['testCamera', mp.cameras.new('default', new mp.Vector3(), new mp.Vector3(), 50.0)],
    ])
};

mp.events.add('render', () => {
    if (CamerasManagerInfo.interpCamera && CamerasManager.doesExist(CamerasManagerInfo.interpCamera) && !CamerasManagerInfo.activeCamera.isInterpolating()) {

        CamerasManager.fireEvent('stopInterp', CamerasManagerInfo.activeCamera);

        CamerasManagerInfo.interpCamera.setActive(false);
        CamerasManagerInfo.interpCamera.destroy();
        CamerasManagerInfo.interpCamera = null;
    }
});

const cameraSerialize = (camera) => {
    camera.setActiveCamera = (toggle) => {
        CamerasManager.setActiveCamera(camera, toggle);
    };

    camera.setActiveCameraWithInterp = (position, rotation, duration, easeLocation, easeRotation) => {
        CamerasManager.setActiveCameraWithInterp(camera, position, rotation, duration, easeLocation, easeRotation);
    };
};

class CamerasManager {

    static on(eventName, eventFunction) {
        if (CamerasManagerInfo._events.has(eventName)) {
            const event = CamerasManagerInfo._events.get(eventName);

            if (!event.has(eventFunction)) {
                event.add(eventFunction);
            }
        } else {
            CamerasManagerInfo._events.set(eventName, new Set([eventFunction]));
        }
    }

    static fireEvent(eventName, ...args) {
        if (CamerasManagerInfo._events.has(eventName)) {
            const event = CamerasManagerInfo._events.get(eventName);

            event.forEach(eventFunction => {
                eventFunction(...args);
            });
        }
    }

    static getCamera(name) {

        const camera = CamerasManagerInfo.cameras.get(name);

        if (typeof camera.setActiveCamera !== 'function') {
            cameraSerialize(camera);
        }

        return camera;
    }

    static setCamera(name, camera) {
        CamerasManagerInfo.cameras.set(name, camera);
    }

    static hasCamera(name) {
        return CamerasManagerInfo.cameras.has(name);
    }

    static destroyCamera(camera) {
        if (this.doesExist(camera)) {
            if (camera === this.activeCamera) {
                this.activeCamera.setActive(false);
            }
            camera.destroy();
        }
    }

    static createCamera(name, type, position, rotation, fov) {
        const cam = mp.cameras.new(type, position, rotation, fov);
        cameraSerialize(cam);
        CamerasManagerInfo.cameras.set(name, cam);
        return cam;
    }

    static setActiveCamera(activeCamera, toggle) {
        if (!toggle) {
            if (this.doesExist(CamerasManagerInfo.activeCamera)) {
                CamerasManagerInfo.activeCamera = null;
                activeCamera.setActive(false);
                mp.game.cam.renderScriptCams(false, false, 0, false, false);
            }

            if (this.doesExist(CamerasManagerInfo.interpCamera)) {
                CamerasManagerInfo.interpCamera.setActive(false);
                CamerasManagerInfo.interpCamera.destroy();
                CamerasManagerInfo.interpCamera = null;
            }

        } else {
            if (this.doesExist(CamerasManagerInfo.activeCamera)) {
                CamerasManagerInfo.activeCamera.setActive(false);
            }
            CamerasManagerInfo.activeCamera = activeCamera;
            activeCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
        }
    }

    static setActiveCameraWithInterp(activeCamera, position, rotation, duration, easeLocation, easeRotation) {

        if (this.doesExist(CamerasManagerInfo.activeCamera)) {
            CamerasManagerInfo.activeCamera.setActive(false);
        }

        if (this.doesExist(CamerasManagerInfo.interpCamera)) {

            CamerasManager.fireEvent('stopInterp', CamerasManagerInfo.interpCamera);

            CamerasManagerInfo.interpCamera.setActive(false);
            CamerasManagerInfo.interpCamera.destroy();
            CamerasManagerInfo.interpCamera = null;
        }
        const interpCamera = mp.cameras.new('default', activeCamera.getCoord(), activeCamera.getRot(2), activeCamera.getFov());
        activeCamera.setCoord(position.x, position.y, position.z);
        activeCamera.setRot(rotation.x, rotation.y, rotation.z, 2);
        activeCamera.stopPointing();

        CamerasManagerInfo.activeCamera = activeCamera;
        CamerasManagerInfo.interpCamera = interpCamera;
        activeCamera.setActiveWithInterp(interpCamera.handle, duration, easeLocation, easeRotation);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);

        CamerasManager.fireEvent('startInterp', CamerasManagerInfo.interpCamera);
    }

    static doesExist(camera) {
        return mp.cameras.exists(camera) && camera.doesExist();
    }

    static get activeCamera() {
        return CamerasManagerInfo.activeCamera;
    }

    static get gameplayCam() {
        if (!CamerasManagerInfo.gameplayCamera) {
            CamerasManagerInfo.gameplayCamera = mp.cameras.new("gameplay");
        }
        return CamerasManagerInfo.gameplayCamera;
    }
}

const proxyHandler = {
    get: (target, name, receiver) => typeof CamerasManager[name] !== 'undefined' ? CamerasManager[name] : CamerasManagerInfo.cameras.get(name)
};

exports = new Proxy({}, proxyHandler);
},{}],6:[function(require,module,exports){
//Lobbies
var CEFBrowser = require("./browser.js");
var natives = require("./natives.js");
var cache = {};
cache.maps = [];
cache.lobbies = [];
mp.gpGameStarted = false;
mp.events.add("Lobby:Update", (allMaps, current_lobbies) => {
    cache.maps = JSON.parse(allMaps);
    cache.lobbies = JSON.parse(current_lobbies);
    /*mp.players.local.position = new mp.Vector3(0, 0, 0);
    mp.players.local.setAlpha(0);
    mp.players.local.freezePosition(true);
    let camera2 = mp.cameras.new('default', new mp.Vector3(0, 0, 100), new mp.Vector3(), 70);
    camera2.pointAtCoord(0, 100, 50);
    camera2.setActive(true);
    camera2.setActiveWithInterp(mp.defaultCam.handle, 5000, 0, 0);
    mp.defaultCam = camera2;
    let camera3 = mp.cameras.new('default', new mp.Vector3(0, 100, 100), new mp.Vector3(), 70);
    camera3.pointAtCoord(0, 400, 50);
    camera3.setActive(true);
    camera3.setActiveWithInterp(mp.defaultCam.handle, 60 * 1000 * 10, 0, 0);
    mp.defaultCam = camera3;*/
    CEFBrowser.call("cef_loadLobbies", cache.lobbies)
    mp.gpGameStarted = false;
});
mp.events.add("Lobby:Show", (state) => {
    if (state) {
        mp.game.ui.displayHud(false);
        CEFBrowser.cursor(true);
        CEFBrowser.call("cef_loadlobby")
        mp.game.ui.displayRadar(false);
        mp.game.graphics.transitionToBlurred(1);
    } else {
        mp.game.ui.displayHud(true);
        CEFBrowser.cursor(false);
        CEFBrowser.call("cef_hidelobby")
        mp.game.ui.displayRadar(true);
        mp.game.graphics.transitionFromBlurred(1);
    }
});
mp.events.add("Lobby:Reset", () => {
    mp.gpGameStarted = false;
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
})
mp.events.add("Lobby:Hide", () => {
    CEFBrowser.cursor(false);
    CEFBrowser.call("cef_hidelobby")
});
mp.events.add("Lobby:Join", (id, teamIndex) => {
    console.log("Join Lobby", id, teamIndex);
    //LobbyManager:Join
    mp.events.callRemote("LobbyManager:Join", id, teamIndex);
});
mp.events.add("Lobby:LoadObjects", (id, objects) => {
    console.log("Lobby:LoadObjects", id, objects);
    mp.events.callRemote("LobbyManager:LoadingFinished", id);
    //LobbyManager:Join
});
mp.events.add("GP:StartCam", () => {
    //if (mp.gpGameStarted == false) {
    mp.gpGameStarted = true;
    CEFBrowser.call("cef_hidewaitingLobby");
    let cur_z = mp.defaultCam.getCoord().z;
    let camera2 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, cur_z), new mp.Vector3(), 60);
    camera2.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
    camera2.setActiveWithInterp(mp.defaultCam.handle, 500, 1, 1);
    mp.defaultCam = camera2;
    setTimeout(function() {
        let camera4 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.5), new mp.Vector3(), 70);
        camera4.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
        camera4.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        mp.game.cam.doScreenFadeOut(3500);
        camera4.setActiveWithInterp(mp.defaultCam.handle, 3500, 1, 1);
        mp.defaultCam = camera4;
        setTimeout(function() {
            mp.game.cam.renderScriptCams(false, false, 0, true, false);
            setTimeout(function() {
                mp.game.cam.doScreenFadeIn(500);
            }, 200)
        }, 3500);
    }, 1000);
    // }
});
mp.events.add("GP:ScaleForm", (time, round) => {
    if (mp.gpGameStarted == true) {
        mp.game.ui.messages.showShard(time, "Round " + round, 1, 0, 2000);
    }
});
mp.events.add("GP:LobbyCam", (lobbyCam) => {
    console.log("GP:LobbyCam", JSON.stringify(lobbyCam));
    lobbyCam = JSON.parse(lobbyCam);
    mp.players.local.freezePosition(true);
    // game_start
    let camera2 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 2), new mp.Vector3(), 60);
    camera2.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
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
            mp.players.local.position = new mp.Vector3(lobbyCam.x, lobbyCam.y, lobbyCam.z + 15);
            let camera4 = mp.cameras.new('default', new mp.Vector3(lobbyCam.x, lobbyCam.y, lobbyCam.z), new mp.Vector3(), 60);
            camera4.pointAtCoord(lobbyCam.px, lobbyCam.py, lobbyCam.pz);
            camera4.setActiveWithInterp(mp.defaultCam.handle, 5000, 1, 1);
            mp.defaultCam = camera4;
        }, 1100)
    }, 100)
});
mp.events.add("GP:LobbyUpdate", (lobbyData, timeTillStart) => {
    if (mp.gpGameStarted == false) {
        lobbyData = JSON.parse(lobbyData);
        CEFBrowser.call("cef_waitingLobby", lobbyData, timeTillStart);
    }
});
var temp_bodies = [];
mp.events.add("GP:StartGame", () => {
    //mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    mp.players.local.setOnlyDamagedByPlayer(false);
    mp.players.local.setProofs(true, false, false, false, false, false, false, false);
    mp.game.player.setHealthRechargeMultiplier(0.0);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    mp.game.ui.setMinimapVisible(false);
    mp.gui.chat.show(true);
    mp.players.local.freezePosition(false);
    mp.game.graphics.transitionFromBlurred(1);
    mp.game.gameplay.setFadeOutAfterDeath(false);
    temp_bodies.forEach(function(cPed, i) {
        cPed.destroy();
        temp_bodies.splice(i);
    })
})
mp.events.add('render', (nametags) => {
    mp.peds.forEachInStreamRange(cPed => {
        if (cPed.IsDummy) {
            cPed.setNoCollision(mp.players.local.handle, false);
            cPed.setCanRagdoll(true);
            cPed.setRagdollOnCollision(true);
            cPed.setCanRagdollFromPlayerImpact(true);
            cPed.setInvincible(false);
            cPed.setCanBeDamaged(true);
            cPed.setOnlyDamagedByPlayer(false);
            cPed.setToRagdoll(1, 1, 0, false, false, false)
        }
    })
});
mp.events.add("GP:DummyBody", (x, y, z, model, heading, clothing) => {
    clothing = JSON.parse(clothing);
    let cur = new mp.Vector3(x, y, z);
    let Ped = mp.peds.new(model, cur, heading + 90, mp.players.local.dimension);
    Ped.IsDummy = true;
    Ped.freezePosition(false);
    Ped.setNoCollision(mp.players.local.handle, false);
    Ped.setCanRagdoll(true);
    Ped.setToRagdoll(1, 1, 0, false, false, false)
    let n_cur = cur.findRot(0, 2, heading - 90);
    Ped.setVelocity((cur.x - n_cur.x), (cur.y - n_cur.y), (cur.z - n_cur.z));
    clothing.forEach(function(part) {
        Ped.setComponentVariation(part.componentNumber, part.drawable, part.texture, part.palette);
    })
    let time = 60 * 60 * 1000;
    temp_bodies.push(Ped);
});
var GP_CheckFailed = 0;
var GP_LastCheck = 0;
var GP_TimeStamp = 0;
var LB_Updates = -1;

function GP_CheckConnectivity() {
    if (mp.gpGameStarted == true) {
        if (GP_TimeStamp + 1000 > GP_LastCheck) {
            GP_LastCheck = Date.now();
            if (GP_CheckFailed > 0) {
                GP_CheckFailed -= 1;
                if (GP_CheckFailed == 0) {
                    console.log("TODO: ReInit after Timeout");
                    mp.players.local.freezePosition(false);
                    mp.game.graphics.transitionFromBlurred(1);
                }
            }
        } else {
            GP_CheckFailed++;
            if (GP_CheckFailed > 5) {
                console.log("Set to Inactive...");
                mp.players.local.freezePosition(true);
                mp.game.graphics.transitionToBlurred(1);
            }
        }
    } else {
        if (mp.players.local.getVariable("spawned")) {
            LB_Updates++;
            if (LB_Updates > 5) {
                LB_Updates = 0;
                console.log("request lobby");
                mp.events.callRemote("User:RequestLobby");
            }
        }
    }
}
setInterval(function() {
    GP_CheckConnectivity();
}, 1000)
mp.events.add("GP:Ping", () => {
    GP_TimeStamp = Date.now();
});
},{"./browser.js":1,"./natives.js":9}],7:[function(require,module,exports){
var CEFBrowser = require("./browser.js");
mp.events.add("Server:RequestLogin", () => {
    mp.players.local.position = new mp.Vector3(-76.66345977783203, -818.8128051757812, 327.5135498046875);
    mp.players.local.setAlpha(0);
    mp.players.local.freezePosition(true);
    mp.defaultCam = mp.cameras.new('default', new mp.Vector3(749.273193359375, 1294.376708984375, 391.9619445800781), new mp.Vector3(), 70);
    mp.defaultCam.pointAtCoord(485.366455078125, -1569.3214111328125, 203.82797241210938);
    mp.defaultCam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.transitionToBlurred(1);
    CEFBrowser.cursor(true);
    setTimeout(function() {
        CEFBrowser.call("cef_loadlogin", mp.players.local.name)
        let camera2 = mp.cameras.new('default', new mp.Vector3(-93.45111846923828, -826.1639404296875, 333.6698303222656), new mp.Vector3(), 70);
        camera2.pointAtCoord(-76.66345977783203, -818.8128051757812, 327.5135498046875);
        camera2.setActiveWithInterp(mp.defaultCam.handle, 60 * 1000 * 10, 0, 0);
        mp.defaultCam = camera2;
        mp.game.streaming.setHdArea(-76.66345977783203, -818.8128051757812, 327.5135498046875, 327.5135498046875);
        mp.game.streaming.loadScene(-76.66345977783203, -818.8128051757812, 327.5135498046875);
    }, 100);
});

mp.events.add("Account:HideLogin", () => {
    CEFBrowser.cursor(false);
    CEFBrowser.call("cef_hidelogin")
});

mp.events.add("Account:Login", (username, password) => {
    mp.events.callRemote("ServerAccount:Login", username, password);
});
mp.events.add("Account:Register", (username, password) => {
    mp.events.callRemote("ServerAccount:Register", username, password);
});
mp.events.add("UI:Error", function(...args) {
    let s = {
        title: 'Error',
        message: args[0],
        position: 'bottomCenter', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    }
    CEFBrowser.call("cef_notification", s)
});
},{"./browser.js":1}],8:[function(require,module,exports){
mp.nametags.enabled = false;
mp.gui.chat.colors = true;
var blips = [];
mp.events.add('render', (nametags) => {
    if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true)) {
        if (mp.players.local.getVariable("team") != undefined) {
            mp.players.forEachInStreamRange(function(player) {
               // if (player != mp.players.local) {
                    if (player.getVariable("team") == mp.players.local.getVariable("team")) {
                        if (!blips[player.id]) {
                            blips[player.id] = mp.blips.new(1, player.position, {
                                color: 3,
                                shortRange: true,
                                scale: 0.4,
                                alpha: 100,
                                name: "Ally"
                            });
                            blips[player.id].setShowHeadingIndicator(true);
                            blips[player.id].setCategory(1);
                        }
                        blips[player.id].setCoords(player.position);
                        blips[player.id].setRotation(player.getPhysicsHeading());
                    } else {
                        if (blips[player.id]) {
                            blips[player.id].destroy();
                            blips[player.id] = null;
                            delete blips[player.id];
                        }
                    }
                //}
            });
        }
        let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
        if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true) && (mp.players.local.getVariable("death") == false)) {
            mp.players.forEachInStreamRange((player) => {
                //if (player != mp.players.local) {
                if (mp.game.system.vdist2(startPosition.x, startPosition.y, startPosition.z, player.position.x, player.position.y, player.position.z) < 600) {
                    if ((player.getVariable("loggedIn") == true) && (player.getVariable("spawned") == true)) {
                        let endPosition = player.getBoneCoords(12844, 0, 0, 0);
                        let hitData = mp.raycasting.testPointToPoint(startPosition, endPosition, mp.players.local, (1 | 16 | 256));
                        if (!hitData) {
                            let color = [255, 255, 255, 200];
                            let eloScore = player.getVariable("eloScore") || 0;
                            let r = mp.lerp(170, 255, 1 / 100 * player.getHealth())
                            let g = mp.lerp(30, 255, 1 / 100 * player.getHealth())
                            let b = mp.lerp(30, 255, 1 / 100 * player.getHealth())
                            if ((1 / 100 * player.getHealth()) < 0.2) {
                                color[0] = 170;
                                color[1] = 30;
                                color[2] = 30;
                            } else {
                                color[0] = r;
                                color[1] = g;
                                color[2] = b;
                            }
                            let lPos = mp.players.local.position;
                            let pos = player.getWorldPositionOfBone(player.getBoneIndexByName("IK_Head"));
                            pos.z += 0.4;
                            let dist = mp.game.system.vdist2(lPos.x, lPos.y, lPos.z, pos.x, pos.y, pos.z);
                            let c_dist = 1 / 800 * dist;
                            let size = mp.lerp(0.5, 0.06, c_dist)
                            if (size > 0.5) {
                                size = 0.5;
                            } else if (size < 0.06) {
                                size = 0.06;
                            }
                            mp.game.graphics.setDrawOrigin(pos.x, pos.y, pos.z, 0);
                            mp.game.graphics.drawText(player.name, [0, 0], {
                                font: 4,
                                color: color,
                                scale: [size, size],
                                outline: true
                            });
                            mp.game.graphics.drawText("Score " + eloScore, [0, 0.03], {
                                font: 4,
                                color: [255, 255, 255, 200],
                                scale: [size / 2, size / 2],
                                outline: true
                            });
                            mp.game.graphics.clearDrawOrigin()
                        }
                    }
                }
                //}
            })
        }
    }
})
},{}],9:[function(require,module,exports){
var natives = {};

mp.game.graphics.clearDrawOrigin = () => mp.game.invoke('0xFF0B610F6BE0D7AF'); // 26.07.2018 // GTA 1.44 
natives.START_PLAYER_TELEPORT = (player, x, y, z, heading, p5, p6, p7) => mp.game.invoke("0xAD15F075A4DA0FDE", player, x, y, z, heading, p5, p6, p7);
natives.CHANGE_PLAYER_PED = (ped,p1,p2) => mp.game.invoke("0x048189FAC643DEEE", ped,p1,p2);
natives.SET_PED_CURRENT_WEAPON_VISIBLE = (ped,  visible,  deselectWeapon,  p3,  p4) => mp.game.invoke("0x0725A4CCFDED9A70",  ped,  visible,  deselectWeapon,  p3,  p4);
natives.SET_BLIP_SPRITE = (blip, sprite) => mp.game.invoke("0xDF735600A4696DAF", blip, sprite); // SET_BLIP_SPRITE
natives.SET_BLIP_ALPHA = (blip, a) => mp.game.invoke("0x45FF974EEE1C8734", blip, a); // SET_BLIP_ALPHA
natives.SET_BLIP_COLOUR = (blip, c) => mp.game.invoke("0x03D7FB09E75D6B7E", blip, c); // SET_BLIP_COLOUR
natives.SET_BLIP_ROTATION = (blip, r) => mp.game.invoke("0xF87683CDF73C3F6E", blip, r); // SET_BLIP_ROTATION
natives.SET_BLIP_FLASHES = (blip, f) => mp.game.invoke("0xB14552383D39CE3E", blip, f); // SET_BLIP_FLASHES
natives.SET_BLIP_FLASH_TIMER = (blip, t) => mp.game.invoke("0xD3CD6FD297AE87CC", blip, t); // SET_BLIP_FLASH_TIMER
natives.SET_BLIP_COORDS = (blip, x, y, z) => mp.game.invoke("0xAE2AF67E9D9AF65D", blip, x, y, z); // SET_BLIP_COORDS
natives.SET_CURSOR_LOCATION = (x, y) => mp.game.invoke("0xFC695459D4D0E219", x, y); // SET_CURSOR_LOCATION 
natives.SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT = (toggle) => mp.game.invoke("0xB98236CAAECEF897", toggle); // SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT
natives.GET_FIRST_BLIP_INFO_ID = (i) => mp.game.invoke("0x1BEDE233E6CD2A1F", i); // GET_FIRST_BLIP_INFO_ID
natives.GET_NEXT_BLIP_INFO_ID = (i) => mp.game.invoke("0x14F96AA50D6FBEA7", i); // GET_NEXT_BLIP_INFO_ID
natives.DOES_BLIP_EXIST = (blip) => mp.game.invoke("0xA6DB27D19ECBB7DA", blip); // DOES_BLIP_EXIST
natives.GET_NUMBER_OF_ACTIVE_BLIPS = () => mp.game.invoke("0x9A3FF3DE163034E8"); // GET_NUMBER_OF_ACTIVE_BLIPS
natives.SET_BLIP_SCALE = (blip,scale) => mp.game.invoke("0xD38744167B2FA257",blip,scale); // SET_BLIP_SCALE
natives.SET_ENTITY_NO_COLLISION_ENTITY = (entity1, entity2, collision) => mp.game.invoke("0xA53ED5520C07654A", entity1.handle, entity2.handle, collision); // SET_ENTITY_NO_COLLISION_ENTITY
natives.SET_PED_TO_RAGDOLL = ( ped,  time1,  time2,  ragdollType,  p4,  p5,  p6) => mp.game.invoke("0xAE99FB955581844A", ped,  time1,  time2,  ragdollType,  p4,  p5,  p6); // SET_PED_TO_RAGDOLL
module.exports = natives;
},{}],10:[function(require,module,exports){
var messageScaleform = require("./Scaleform.js");
let bigMessageScaleform = null;
let bigMsgInit = 0;
let bigMsgDuration = 5000;
let bigMsgAnimatedOut = false;
 
mp.events.add("ShowWeaponPurchasedMessage", (title, weaponName, weaponHash, time = 5000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    bigMessageScaleform.callFunction("SHOW_WEAPON_PURCHASED", title, weaponName, weaponHash);

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("ShowPlaneMessage", (title, planeName, planeHash, time = 5000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    bigMessageScaleform.callFunction("SHOW_PLANE_MESSAGE", title, planeName, planeHash);

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("ShowShardMessage", (title, message, titleColor, bgColor, time = 5000) => {
    if (bigMessageScaleform == null) bigMessageScaleform = new messageScaleform("mp_big_message_freemode");
    bigMessageScaleform.callFunction("SHOW_SHARD_CENTERED_MP_MESSAGE", title, message, titleColor, bgColor);

    bigMsgInit = Date.now();
    bigMsgDuration = time;
    bigMsgAnimatedOut = false;
});

mp.events.add("render", () => {
    if (bigMessageScaleform != null) {
        bigMessageScaleform.renderFullscreen();

        if (bigMsgInit > 0 && Date.now() - bigMsgInit > bigMsgDuration) {
            if (!bigMsgAnimatedOut) {
                bigMessageScaleform.callFunction("TRANSITION_OUT");
                bigMsgAnimatedOut = true;
                bigMsgDuration += 750;
            } else {
                bigMsgInit = 0;
                bigMessageScaleform.dispose();
                bigMessageScaleform = null;
            }
        }
    }
});
},{"./Scaleform.js":12}],11:[function(require,module,exports){
var messageScaleform = require("./Scaleform.js");
let midsizedMessageScaleform = null;
let msgInit = 0;
let msgDuration = 5000;
let msgAnimatedOut = false;
let msgBgColor = 0;

mp.events.add("ShowMidsizedMessage", (title, message, time = 5000) => {
    if (midsizedMessageScaleform == null) midsizedMessageScaleform = new messageScaleform("midsized_message");
    midsizedMessageScaleform.callFunction("SHOW_MIDSIZED_MESSAGE", title, message);

    msgInit = Date.now();
    msgDuration = time;
    msgAnimatedOut = false;
});

mp.events.add("ShowMidsizedShardMessage", (title, message, bgColor, useDarkerShard, condensed, time = 5000) => {
    if (midsizedMessageScaleform == null) midsizedMessageScaleform = new messageScaleform("midsized_message");
    midsizedMessageScaleform.callFunction("SHOW_SHARD_MIDSIZED_MESSAGE", title, message, bgColor, useDarkerShard, condensed);

    msgInit = Date.now();
    msgDuration = time;
    msgAnimatedOut = false;
    msgBgColor = bgColor;
});

mp.events.add("render", () => {
    if (midsizedMessageScaleform != null) {
        midsizedMessageScaleform.renderFullscreen();

        if (msgInit > 0 && Date.now() - msgInit > msgDuration) {
            if (!msgAnimatedOut) {
                midsizedMessageScaleform.callFunction("SHARD_ANIM_OUT", msgBgColor);
                msgAnimatedOut = true;
                msgDuration += 750;
            } else {
                msgInit = 0;
                midsizedMessageScaleform.dispose();
                midsizedMessageScaleform = null;
            }
        }
    }
});
},{"./Scaleform.js":12}],12:[function(require,module,exports){
class BasicScaleform {
    constructor(scaleformName) {
        this.handle = mp.game.graphics.requestScaleformMovie(scaleformName);
        while (!mp.game.graphics.hasScaleformMovieLoaded(this.handle)) mp.game.wait(0);
    }

    // thanks kemperrr
    callFunction(functionName, ...args) {
        mp.game.graphics.pushScaleformMovieFunction(this.handle, functionName);

        args.forEach(arg => {
            switch(typeof arg) {
                case "string": {
                    mp.game.graphics.pushScaleformMovieFunctionParameterString(arg);
                    break;
                }

                case "boolean": {
                    mp.game.graphics.pushScaleformMovieFunctionParameterBool(arg);
                    break;
                }

                case "number": {
                    if(Number(arg) === arg && arg % 1 !== 0) {
                        mp.game.graphics.pushScaleformMovieFunctionParameterFloat(arg);
                    } else {
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(arg);
                    }
                }
            }
        });

        mp.game.graphics.popScaleformMovieFunctionVoid();
    }

    renderFullscreen() {
        mp.game.graphics.drawScaleformMovieFullscreen(this.handle, 255, 255, 255, 255, false);
    }

    dispose() {
        mp.game.graphics.setScaleformMovieAsNoLongerNeeded(this.handle);
    }
}

module.exports = BasicScaleform;
},{}],13:[function(require,module,exports){
var messageScaleform = require("./Scaleform.js");
require("./BigMessage.js");
require("./MidsizedMessage.js");

mp.game.ui.messages = {
    showShard: (title, message, titleColor, bgColor, time = 5000) => mp.events.call("ShowShardMessage", title, message, titleColor, bgColor, time),
    showWeaponPurchased: (title, weaponName, weaponHash, time = 5000) => mp.events.call("ShowWeaponPurchasedMessage", title, weaponName, weaponHash, time),
    showPlane: (title, planeName, planeHash, time = 5000) => mp.events.call("ShowPlaneMessage", title, planeName, planeHash, time),
    showMidsized: (title, message, time = 5000) => mp.events.call("ShowMidsizedMessage", title, message, time),
    showMidsizedShard: (title, message, bgColor, useDarkerShard, condensed, time = 5000) => mp.events.call("ShowMidsizedShardMessage", title, message, bgColor, useDarkerShard, condensed, time)
};
},{"./BigMessage.js":10,"./MidsizedMessage.js":11,"./Scaleform.js":12}],14:[function(require,module,exports){
mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let degrees = (rz + rot) * (Math.PI / 180);
    nVector.x = this.x + dist * Math.cos(degrees);
    nVector.y = this.y + dist * Math.sin(degrees);
    return nVector;
}
mp.Vector3.prototype.rotPoint = function(pos) {
    let temp = new mp.Vector3(this.x, this.y, this.z);
    let temp1 = new mp.Vector3(pos.x, pos.y, pos.z);
    let gegenkathete = temp1.z - temp.z
    let a = temp.x - temp1.x;
    let b = temp.y - temp1.y;
    let ankathete = Math.sqrt(a * a + b * b);
    let winkel = Math.atan2(gegenkathete, ankathete) * 180 / Math.PI
    return winkel;
}
mp.Vector3.prototype.toPixels = function() {
    let clientScreen = mp.game.graphics.getScreenActiveResolution(0, 0);
    let toScreen = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x, pos.y, pos.z)) || {
        x: 0,
        y: 0
    };
    return {
        x: Math.floor(clientScreen.x * toScreen.x) + "px",
        y: Math.floor(clientScreen.y * toScreen.y) + "px"
    };
}

mp.Vector3.prototype.lerp = function(vector2, deltaTime) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x + (vector2.x - this.x) * deltaTime
    nVector.y = this.y + (vector2.y - this.y) * deltaTime
    nVector.z = this.z + (vector2.z - this.z) * deltaTime
    return nVector;
}
mp.Vector3.prototype.multiply = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x * n;
    nVector.y = this.y * n;
    nVector.z = this.z * n;
    return nVector;
}
mp.Vector3.prototype.dist = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    let c = this.z - to.z;
    return Math.sqrt(a * a + b * b + c * c);;
}
mp.Vector3.prototype.dist2d = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    return Math.sqrt(a * a + b * b);
}
mp.Vector3.prototype.getOffset = function(to) {
    let x = this.x - to.x;
    let y = this.y - to.y;
    let z = this.z - to.z;
    return new mp.Vector3(x, y, z);
}
mp.Vector3.prototype.cross = function(to) {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = this.y * to.z - this.z * to.y;
    vector.y = this.z * to.x - this.x * to.z;
    vector.z = this.x * to.y - this.y * to.x;
    return vector;
}
mp.Vector3.prototype.normalize = function() {
    let vector = new mp.Vector3(0, 0, 0);
    let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    vector.x = this.x / mag;
    vector.y = this.y / mag;
    vector.z = this.z / mag;
    return vector;
}
mp.Vector3.prototype.dot = function(to) {
    return this.x * to.x + this.y * to.y + this.z * to.z;
}
mp.Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
mp.Vector3.prototype.angle = function(to) {
    return Math.acos(this.normalize().dot(to.normalize()));
}
mp.Vector3.prototype.ground = function() {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let z = mp.game.gameplay.getGroundZFor3dCoord(nVector.x, nVector.y, nVector.z, 0, false)
    let z1 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x + 0.01, nVector.y + 0.01, nVector.z, 0, false)
    let z2 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x - 0.01, nVector.y - 0.01, nVector.z, 0, false)
    nVector.z = z;
    if ((z + 0.1 < z1) || (z + 0.1 < z2)) {
        if (z1 < z2) {
            nVector.z = z2;
        } else {
            nVector.z = z1;
        }
    }
    return nVector;
}
mp.Vector3.prototype.ground2 = function(ignore) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let r = mp.raycasting.testPointToPoint(nVector.add(0, 0, 1), nVector.sub(0, 0, 100), ignore.handle, (1 | 16));
    if ((r) && (r.position)) {
        nVector = mp.vector(r.position);
    }
    return nVector;
}
mp.Vector3.prototype.sub = function(x, y, z) {
    return new mp.Vector3(this.x - x, this.y - y, this.z - z);
};
mp.Vector3.prototype.add = function(x, y, z) {
    return new mp.Vector3(this.x + x, this.y + y, this.z + z);
};
mp.Vector3.prototype.insidePolygon = function(polygon) {
    let x = this.x,
        y = this.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
            yi = polygon[i][1];
        let xj = polygon[j][0],
            yj = polygon[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
mp.vector = function(vec) {
    return new mp.Vector3(vec.x, vec.y, vec.z);
}
Array.prototype.shuffle = function() {
    let i = this.length;
    while (i) {
        let j = Math.floor(Math.random() * i);
        let t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}
mp.isValid = function(val) {
    return val != null && val != undefined && val != "";
}
mp.lerp = function(a, b, n) {
    return (1 - n) * a + n * b;
}
},{}]},{},[4]);
