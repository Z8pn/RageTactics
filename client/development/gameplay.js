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
mp.events.add("render", () => {
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