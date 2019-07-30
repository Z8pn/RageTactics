//Lobbies
var CEFBrowser = require("./browser.js");
var natives = require("./natives.js");
var ObjectLoader = require("./object_loader.js")
var cache = {};
cache.maps = [];
cache.lobbies = [];
mp.gpGameStarted = false;
mp.events.add("Lobby:Update", (allMaps, current_lobbies) => {
    let maps = JSON.parse(allMaps);
    let lobbies = JSON.parse(current_lobbies);
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
    CEFBrowser.call("cef_loadLobbies", lobbies)
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
mp.events.add("Lobby:StartCam", () => {
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
mp.events.add("Lobby:ShardMessage", (string, substring,time = 2000) => {
    mp.game.ui.messages.showShard(string, substring, 1, 0, time);
});
mp.events.add("Lobby:PreviewCam", (lobbyCam) => { 
    mp.gpGameStarted = true;
    console.log("Lobby:PreviewCam", JSON.stringify(lobbyCam));
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
mp.events.add("Lobby:WaitingUpdate", (timeTillStart) => {
    if (mp.gpGameStarted == true) {
        CEFBrowser.call("cef_waitingLobby", timeTillStart);
    }
});
mp.events.add("Lobby:Scoreboard", (json_Scoreboar) => {
    if (mp.gpGameStarted == true) {
    	console.log("show scoreboard");

    	//json_Scoreboar
        //CEFBrowser.call("cef_waitingLobby", timeTillStart);
    } else {
    	//disable scoreboard
    }
});
/*Object Loading*/
mp.events.add("Lobby:LoadObjects", (id, objects) => {
    console.log("Lobby:LoadObjects", id, objects);
    //LobbyManager:Join
    ObjectLoader.load(id, JSON.parse(objects));
});
mp.events.add("Lobby:UnloadObjects", (id) => {
    console.log("Unloading objects");
    ObjectLoader.unload();
});
