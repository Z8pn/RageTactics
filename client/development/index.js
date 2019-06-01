require("./scaleforms/index.js")
require("./team_change.js")
require("./combat.js")
require("./money.js")
require("./nametag.js")
require("./crouch.js")
require("./armour.js")
require("./gangwars.js")
var natives = require("./natives.js")
var exp = require("./exp.js")
var wasted = require("./wasted.js")
var CEFBrowser = require("./browser.js");
var Browser = new CEFBrowser("package://gangwar_client/cef/index.html");

function clearBlips() {
    natives.SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT(true);
    let last_blip = natives.GET_FIRST_BLIP_INFO_ID(5);
    while (natives.DOES_BLIP_EXIST(last_blip)) {
        mp.game.ui.removeBlip(last_blip);
        last_blip = natives.GET_NEXT_BLIP_INFO_ID(5);
    }
    mp.game.wait(50);
}
// Account Stuff
mp.events.callRemote("ServerAccount:Ready");
mp.game.graphics.transitionToBlurred(1);
var LastCam;
mp.events.add("Server:RequestLogin", () => {
    clearBlips();

    LastCam = mp.cameras.new('default', new mp.Vector3(593.5968627929688, -1820.015869140625, 142.7814483642578), new mp.Vector3(), 60);
    LastCam.pointAtCoord(163.39794921875, -1788.3284912109375, 27.982322692871094);
    LastCam.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.transitionToBlurred(1);
    Browser.cursor(true);
    setTimeout(function() {
        Browser.call("cef_loadlogin", mp.players.local.name)
    }, 100);
});
mp.events.add("Account:Alert", function(...args) {
    Browser.call("alert_login", args[0])
});
mp.events.add("Account:HideLogin", () => {
    mp.game.graphics.transitionFromBlurred(500);
    Browser.cursor(false);
    Browser.call("cef_hidelogin")
});
mp.events.add("Account:LoginDone", () => {
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    mp.players.local.setOnlyDamagedByPlayer(false);
    mp.players.local.setProofs(true, false, false, false, false, false, false, false);
    mp.game.player.setHealthRechargeMultiplier(0.0);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    mp.game.ui.setMinimapVisible(false)
})
mp.events.add("Cam:Hide", () => {
    mp.game.graphics.transitionFromBlurred(100);
    LastCam.setActive(false);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    mp.game.ui.setMinimapVisible(false)
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    mp.players.local.setOnlyDamagedByPlayer(false);
    mp.players.local.setProofs(true, false, false, false, false, false, false, false);
    mp.game.player.setHealthRechargeMultiplier(0.0);
})
mp.events.add("entityStreamIn", (entity) => {
    if (entity.type !== "player") return;
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    mp.players.local.setOnlyDamagedByPlayer(false);
    mp.players.local.setProofs(true, false, false, false, false, false, false, false);
    mp.game.player.setLockonRangeOverride(0.0);
});
mp.events.add("Account:Login", (username, password) => {
    mp.events.callRemote("ServerAccount:Login", username, password);
});
mp.events.add("Account:Register", (username, hash_password, salt) => {
    mp.events.callRemote("ServerAccount:Register", username, hash_password, salt);
});
/*mp.events.add("Player:UpdateEXP", (currentRankLimit, nextRankLimit, lastRankEXP, currentXP, currentLvl) => {
    exp.showEXPBar(currentRankLimit, nextRankLimit, lastRankEXP, currentXP, currentLvl)
});*/
mp.events.add("Player:Death", (text) => {
    wasted.show(text);
});
mp.events.add("Player:Spawn", () => {
    wasted.hide();
});
mp.events.add("Player:LevelUp", function(old_level, new_level) {
    mp.game.audio.playSoundFrontend(-1, "Mission_Pass_Notify", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", true);
    Browser.call("notify", {
        title: "Congratulations",
        titleSize: "16px",
        message: `You just leveled up to Level ${new_level}`,
        messageColor: 'rgba(0,0,0,.9)',
        position: "topCenter",
        close: false
    })
});
mp.events.add("Player:UnlockWeapons", function(standart, unlocks) {
    mp.game.audio.playSoundFrontend(-1, "CHALLENGE_UNLOCKED", "HUD_AWARDS", true);
    if (standart != undefined) {
        Browser.call("notify", {
            title: "Standart",
            titleSize: "16px",
            message: `${standart} just got unlocked`,
            messageColor: 'rgba(0,50,0,.8)',
            position: "topCenter",
            backgroundColor: 'rgba(86, 206, 86, 0.9)',
            close: false
        })
    }
    if (unlocks != null) {
        if (unlocks.length > 0) {
            unlocks.forEach(function(name) {
                Browser.call("notify", {
                    title: "Buyable",
                    titleSize: "16px",
                    message: `${name} just got unlocked`,
                    messageColor: 'rgba(0,50,0,.8)',
                    position: "topCenter",
                    backgroundColor: 'rgba(86, 206, 86, 0.9)',
                    close: false
                })
            })
        }
    }
});
// Weapons Start
let weaponshop_visible = false;
mp.events.add("WeaponShop:show", (weapons) => {
    if (weaponshop_visible == false) {
        Browser.call("cef_loadweapons", weapons)
        Browser.call("cef_showweaponshop")
        weaponshop_visible = true;
        Browser.cursor(true);
    } else {
        Browser.call("cef_hideweaponshop")
        weaponshop_visible = false;
        Browser.cursor(false);
    }
});
mp.keys.bind(0x72, false, function() { // F3 Key
    mp.events.callRemote("WeaponShop:toggle", weaponshop_visible);
});
mp.events.add("WeaponShop:Buy", (weapon) => {
    mp.events.callRemote("WeaponShop:Buy", weapon);
});
mp.events.add("VehicleShop:Buy", (veh) => {
    mp.events.callRemote("VehicleShop:Buy", veh);
});
mp.events.add("VehicleShop:Close", (veh) => {
    Browser.call("cef_hidevehicles")
    Browser.cursor(false);
});
mp.events.add("VehicleShop:Show", (vehs) => {
    Browser.call("cef_loadvehicles", vehs);
    Browser.call("cef_showvehicles");
    Browser.cursor(true);
});
mp.keys.bind(0x45, false, function() { // E Key
    if (mp.players.local.getVariable("teamColshape") == true) {
        mp.events.callRemote("VehicleShop:Show");
    }
});
// Weapons End
mp.events.add("Teams:Change", (teams) => {
    mp.players.local.position = teams[0].preview.spawn
    mp.players.local.setHeading(teams[0].preview.heading)
    mp.players.local.model = mp.game.joaat(teams[0].skins[0].name);
    natives.SET_PED_CURRENT_WEAPON_VISIBLE(mp.players.local.handle, false, true, true, true)
    mp.players.local.mugshotboard.show("", "", teams[0].name, "")
    setTimeout(function() {
        let newCam = mp.cameras.new('default', teams[0].preview.cam, new mp.Vector3(), 50);
        newCam.pointAtCoord(teams[0].preview.spawn.x, teams[0].preview.spawn.y, teams[0].preview.spawn.z);
        newCam.setActiveWithInterp(LastCam.handle, 500, 1, 2); // 2000ms = 2secs, 0, 0 - idk
        LastCam = newCam;
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        Browser.cursor(true);
        Browser.call("cef_loadteams", teams)
        Browser.call("cef_showteam")
    }, 100)
});
let team_change = {
    skin: 0,
    team: 0
}
let cooldown_skin = 0;
let cooldown_team = 0;
mp.events.add("Teams:UpdateTeamData", (team, skin) => {
    team_change = {
        skin: skin,
        team: team
    }
})
mp.events.add("Teams:JoinTeam", () => {
    Browser.call("cef_hideteam")
    Browser.cursor(false);
    mp.game.graphics.transitionToBlurred(0);
    setTimeout(function() {
        mp.players.local.mugshotboard.hide();
        mp.events.callRemote("Teams:Set", team_change.team, team_change.skin);
    }, 400);
})
mp.events.add("Teams:UpdateSkin", (team_name, skin) => {
    if ((Date.now() / 1000 - cooldown_skin) >= 0.05) {
        mp.players.local.mugshotboard.hide();
        mp.players.local.model = mp.game.joaat(skin);
        mp.players.local.mugshotboard.show("", "", team_name, "")
        cooldown_skin = Date.now() / 1000;
    }
})
mp.events.add("Teams:UpdateTeam", (new_team) => {
    if ((Date.now() / 1000 - cooldown_team) >= 0.05) {
        new_team = JSON.parse(new_team);
        let newCam = mp.cameras.new('default', new_team.cam, new mp.Vector3(), 50);
        newCam.pointAtCoord(new_team.spawn.x, new_team.spawn.y, new_team.spawn.z);
        newCam.setActiveWithInterp(LastCam.handle, 500, 1, 2); // 2000ms = 2secs, 0, 0 - idk
        LastCam = newCam;
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        setTimeout(function() {
            mp.players.local.position = new_team.spawn
            mp.players.local.setHeading(new_team.heading)
            mp.players.local.mugshotboard.anim();
            natives.SET_PED_CURRENT_WEAPON_VISIBLE(mp.players.local.handle, false, true, true, true)
        }, 100)
        cooldown_team = Date.now() / 1000;
    }
})
mp.events.add("Notifications:New", (notification_data) => {
    Browser.call("notify", notification_data)
})
mp.events.add('Player:Collision', (enable) => {
    if (enable == true) {
        mp.vehicles.forEach(vehicle => {
            if (mp.players.local.vehicle) {
                mp.players.local.vehicle.setNoCollision(vehicle.handle, true);
                natives.SET_ENTITY_NO_COLLISION_ENTITY(mp.players.local.vehicle, vehicle, true)
                natives.SET_ENTITY_NO_COLLISION_ENTITY(vehicle, mp.players.local.vehicle, true)
            }
            vehicle.setAlpha(255);
        });
    } else {
        mp.vehicles.forEach(vehicle => {
            if (mp.players.local.vehicle) {
                mp.players.local.vehicle.setNoCollision(vehicle.handle, false);
                natives.SET_ENTITY_NO_COLLISION_ENTITY(vehicle, mp.players.local.vehicle, false)
                natives.SET_ENTITY_NO_COLLISION_ENTITY(mp.players.local.vehicle, vehicle, false)
            }
            vehicle.setAlpha(150);
        });
    }
});
let level_view_visible = false;
mp.keys.bind(0x73, false, function() { // F3 Key
    mp.events.callRemote("LevelView:toggle", level_view_visible);
});
mp.events.add("LevelView:Show", (data) => {
    mp.gui.chat.push("Show " + JSON.stringify(data));
    if (level_view_visible == false) {
        Browser.call("cef_loadlevels", data);
        Browser.call("cef_showlevels");
        level_view_visible = true;
        Browser.cursor(true);
    } else {
        Browser.call("cef_hidelevels")
        level_view_visible = false;
        Browser.cursor(false);
    }
});