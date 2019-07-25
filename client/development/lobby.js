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
});
mp.events.add("Lobby:Show", (state) => {
    if (state) {
        CEFBrowser.cursor(true);
        CEFBrowser.call("cef_loadlobby")
        mp.game.ui.displayRadar(false);
        mp.game.ui.displayHud(false);
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
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);
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
});
mp.events.add("GP:ScaleForm", (time, round) => {
    mp.game.ui.messages.showShard(time, "Round " + round, 1, 0, 2000);
});
mp.events.add("GP:LobbyCam", (lobbyCam) => {
    mp.gpGameStarted = true;
    console.log("GP:LobbyCam", JSON.stringify(lobbyCam));
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);
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
    if (mp.gpGameStarted == true) {
        lobbyData = JSON.parse(lobbyData);
        CEFBrowser.call("cef_waitingLobby", lobbyData, timeTillStart);
    }
});
var temp_bodies = [];
mp.events.add("GP:StartGame", (hub) => {
    if (!hub) mp.gpGameStarted = true;
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
mp.events.add("render",() => {
    mp.peds.forEachInStreamRange(cPed => {
        if (cPed.IsDummy) {
            cPed.freezePosition(false);
            cPed.setNoCollision(mp.players.local.handle, false);
            cPed.setCanRagdoll(true);
            cPed.setRagdollOnCollision(true);
            cPed.setCanRagdollFromPlayerImpact(true);
            cPed.setInvincible(false);
            cPed.setCanBeDamaged(true);
            cPed.setOnlyDamagedByPlayer(false);
            cPed.taskSetBlockingOfNonTemporaryEvents(true);
            cPed.setToRagdoll(5000, 10000, 0, false, false, false)
        }
    })
});
mp.events.add("GP:DummyBody", (x, y, z, model, heading, clothing, move_mul) => {
    clothing = JSON.parse(clothing);
    let cur = new mp.Vector3(x, y, z);
    let Ped = mp.peds.new(model, cur, heading - 180, mp.players.local.dimension);
    Ped.IsDummy = true;
    Ped.freezePosition(false);
    Ped.setNoCollision(mp.players.local.handle, false);
    Ped.setCanRagdoll(true);
    Ped.setToRagdoll(5000, 10000, 0, false, false, false)
    let n_cur = cur.findRot(0, 5, heading - 90);
    Ped.setVelocity((cur.x - n_cur.x) * move_mul, (cur.y - n_cur.y) * move_mul, (cur.z - n_cur.z) * move_mul);
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
    mp.gpGameStarted = true;
});