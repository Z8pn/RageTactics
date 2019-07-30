var CEFBrowser = require("./browser.js");
var natives = require("./natives.js");
mp.loginDone = false;
mp.events.add("Server:RequestLogin", () => {
    mp.players.local.position = new mp.Vector3(-161.94371032714844, -1080.49365234375, 33.31964111328125);
    mp.players.local.setAlpha(0);
    mp.players.local.freezePosition(true);
    mp.defaultCam = mp.cameras.new('default', new mp.Vector3(-445.6517639160156, -923.17626953125, 91.62439727783203), new mp.Vector3(), 60);
    mp.defaultCam.pointAtCoord(-228.10328674316406, -1031.739501953125, 71.0535659790039);
    mp.defaultCam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    //mp.game.graphics.transitionToBlurred(1);
    mp.game.graphics.transitionFromBlurred(1);
    CEFBrowser.cursor(true);
    setTimeout(function() {
        CEFBrowser.call("cef_loadlogin", mp.players.local.name)
        let camera4 = mp.cameras.new('default', new mp.Vector3(-123.29566192626953, -1318.5665283203125, 110.64939880371094), new mp.Vector3(), 60);
        camera4.pointAtCoord(-147.02239990234375, -1157.9698486328125, 67.40867614746094);
        camera4.setActiveWithInterp(mp.defaultCam.handle, 60*1000*10, 1, 1);
        mp.defaultCam = camera4;
        mp.loginDone = false;
    }, 100);
});
mp.events.add("Account:HideLogin", () => {
    CEFBrowser.cursor(false);
    CEFBrowser.call("cef_hidelogin")
    mp.loginDone = true;
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