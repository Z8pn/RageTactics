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