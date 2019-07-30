"use strict";


mp.events.add("entityStreamIn", (entity) =>    
{
   if(entity.streamInHandler)
   {
       entity.streamInHandler(entity);
   }
});

mp.game.vehicle.setRandomTrains(true) 
mp.game.vehicle.setRandomBoats(true) 

mp.gameplayCam = mp.cameras.new('gameplay');
mp.defaultCam = mp.cameras.new('default');
console.log = function(...a) {
    a = a.map(function(e) {
        return JSON.stringify(e);
    })
    mp.gui.chat.push("DeBuG:" + a.join(" "))
};
require("./utils.js")
require("./anticheat.js")
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
require("./gameplay.js")


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

