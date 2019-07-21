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
},{}],3:[function(require,module,exports){
"use strict";


mp.gameplayCam = mp.cameras.new('gameplay');
mp.defaultCam = mp.cameras.new('default');
console.log = function(...a) {
    a = a.map(function(e) {
        return JSON.stringify(e);
    })
    mp.gui.chat.push("DeBuG:" + a.join(" "))
};
mp.lerp = function(a, b, n) {
    return (1 - n) * a + n * b;
}
require("./vector.js")
require("./scaleforms/index.js");


mp.CamManager = require("./libs/camerasManager.js"); 
mp.clientState = "waiting";
var natives = require("./natives.js");
var CEFBrowser = require("./browser.js");
require("./lobby.js")
require("./login.js")
require("./hub.js")


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
},{"./browser.js":1,"./hub.js":2,"./libs/camerasManager.js":4,"./lobby.js":5,"./login.js":6,"./natives.js":7,"./scaleforms/index.js":11,"./vector.js":12}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
//Lobbies
var CEFBrowser = require("./browser.js");
var cache = {};
cache.maps = [];
cache.lobbies = [];
mp.gpGameStarted = false;
mp.events.add("UI:Lobbies", (allMaps, current_lobbies) => {
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
    CEFBrowser.call("cef_loadlobby")
    CEFBrowser.cursor(true);
    mp.gpGameStarted = false;
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.transitionToBlurred(1);
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
    //LobbyManager:Join
});
mp.events.add("GP:StartCam", () => {
    if (mp.gpGameStarted == false) {
        mp.gpGameStarted = true;
        let camera4 = mp.cameras.new('default', new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z), new mp.Vector3(), 70);
        camera4.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
        camera4.setActive(true);
        camera4.setActiveWithInterp(mp.defaultCam.handle, 5000, 0, 0);
        mp.defaultCam = camera4;
        CEFBrowser.call("cef_hidewaitingLobby");
        setTimeout(function() {
            mp.game.cam.renderScriptCams(false, false, 0, true, false);
        },4500);
    }
});
mp.events.add("GP:ScaleForm", (s) => {
    if (mp.gpGameStarted == true) {
        mp.game.ui.messages.showShard(s, "Countdown..", 1, 0, 2000);
    }
});
mp.events.add("GP:LobbyCam", (lobbyCam) => {
    if (mp.gpGameStarted == false) {
        lobbyCam = JSON.parse(lobbyCam);
        let camera3 = mp.cameras.new('default', new mp.Vector3(lobbyCam.x, lobbyCam.y, lobbyCam.z), new mp.Vector3(), 70);
        camera3.pointAtCoord(lobbyCam.px, lobbyCam.py, lobbyCam.pz);
        camera3.setActive(true);
        camera3.setActiveWithInterp(mp.defaultCam.handle, 5000, 0, 0);
        mp.players.local.freezePosition(true);
        mp.defaultCam = camera3;
    }
});
mp.events.add("GP:LobbyUpdate", (lobbyData) => {
    if (mp.gpGameStarted == false) {
        lobbyData = JSON.parse(lobbyData);
        CEFBrowser.call("cef_waitingLobby", lobbyData);
    }
});
mp.events.add("GP:StartGame", () => {
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
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
})


var GP_CheckFailed = 0;
var GP_LastCheck = 0;
var GP_TimeStamp = 0;

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
    }
}
setInterval(function() {
    GP_CheckConnectivity();
}, 1000)
mp.events.add("GP:Ping", () => {
    GP_TimeStamp = Date.now();
});
},{"./browser.js":1}],6:[function(require,module,exports){
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
        camera2.setActive(true);
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
},{"./browser.js":1}],7:[function(require,module,exports){
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
module.exports = natives;
},{}],8:[function(require,module,exports){
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
},{"./Scaleform.js":10}],9:[function(require,module,exports){
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
},{"./Scaleform.js":10}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{"./BigMessage.js":8,"./MidsizedMessage.js":9,"./Scaleform.js":10}],12:[function(require,module,exports){
mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    var degrees = (rz + rot) * (Math.PI / 180);
    nVector.x = this.x + dist * Math.cos(degrees);
    nVector.y = this.y + dist * Math.sin(degrees);
    return nVector;
}
mp.Vector3.prototype.rotPoint = function(pos) {
    var temp = new mp.Vector3(this.x, this.y, this.z);
    var temp1 = new mp.Vector3(pos.x, pos.y, pos.z);
    var gegenkathete = temp1.z - temp.z
    var a = temp.x - temp1.x;
    var b = temp.y - temp1.y;
    var ankathete = Math.sqrt(a * a + b * b);
    var winkel = Math.atan2(gegenkathete, ankathete) * 180 / Math.PI
    return winkel;
}
/*mp.Vector3.prototype.normalize = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x / n;
    nVector.y = this.y / n;
    nVector.z = this.z / n;
    return this;
}*/
mp.Vector3.prototype.multiply = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x * n;
    nVector.y = this.y * n;
    nVector.z = this.z * n;
    return this;
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
mp.Vector3.prototype.insidePolygon = function(polygon) {
    var x = this.x,
        y = this.y;
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0],
            yi = polygon[i][1];
        var xj = polygon[j][0],
            yj = polygon[j][1];
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
mp.vector = function(vec) {
    return new mp.Vector3(vec.x, vec.y, vec.z);
}

mp.isValid = function(val) {
    return val != null && val != undefined && val != "";
}
},{}]},{},[3]);
