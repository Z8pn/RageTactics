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