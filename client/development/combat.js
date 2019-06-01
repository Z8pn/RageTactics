require("./vector.js")
// Combat Stuff
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
    },
    "SKEL_Pelvis": {
        bone_id: 11816,
        threshold: 0.08,
        offset: {
            x: 0,
            y: 0,
            z: 0
        }
    }
}

function getVehiclePassangerEntityFromPosition(hPos, veh) {
    let inVehPlayers = [];
    mp.players.forEachInStreamRange((player) => {
        if (player.vehicle == veh) {
            inVehPlayers.push(player);
        }
    });
    let targetEntity = {
        dist: 9999,
        target: null
    }
    inVehPlayers.forEach(function(player) {
        let pPos = player.position;
        let dist = mp.game.system.vdist2(hPos.x, hPos.y, hPos.z, pPos.x, pPos.y, pPos.z);
        if (dist < targetEntity.dist) {
            targetEntity.dist = dist;
            targetEntity.target = player;
        }
    })
    return targetEntity
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
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    let weapon_hash = mp.players.local.weapon;
    //
    let ammo = mp.players.local.getAmmoInClip(weapon_hash);
    mp.events.callRemote("Combat:FireWeapon", weapon_hash.toString(), ammo);
    mp.game.player.setTargetingMode(1);
    mp.game.player.setLockon(false);
    mp.game.player.setLockonRangeOverride(0.0);
    // mp.events.callRemote("Combat:HitEntity", mp.players.local, weapon_hash.toString(), undefined);
    if (targetEntity) {
        if (targetEntity.isInAnyVehicle(false)) {
            let vehicle = targetEntity.vehicle;
            let result = getVehiclePassangerEntityFromPosition(targetPosition, vehicle)
            let entityHit = getIsHitOnBone(targetPosition, result.target)
            if (entityHit.hit == true) {
                mp.events.callRemote("Combat:HitEntity", result.target, weapon_hash.toString(), entityHit.bone);
            } else {
                mp.events.callRemote("Combat:HitEntity", vehicle, weapon_hash.toString());
            }
        } else {
            let entityHit = getIsHitOnBone(targetPosition, targetEntity)
            mp.events.callRemote("Combat:HitEntity", targetEntity, weapon_hash.toString(), entityHit.bone);
        }
    }
});
var timerHitmarker = 0;
mp.events.add("render", () => {
    mp.game.player.resetStamina();
    if (!mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        mp.game.graphics.requestStreamedTextureDict("hud_reticle", true);
    }
    if (mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
        if ((Date.now() / 1000 - timerHitmarker) <= 0.1) {
            mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 255, 255, 255, 150);
        }
    }
});
mp.events.add("Combat:HitEntity", () => {
    timerHitmarker = Date.now() / 1000;
});
mp.events.add("Combat:Hitted", (dmg) => {});