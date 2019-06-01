function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}
mp.nametags.enabled = false;
mp.gui.chat.colors = true;
let blips = [];
mp.events.add('entityStreamOut', (entity) => {
    if (entity.type == 'player') {
        if (blips[entity.id]) {
            blips[entity.id].destroy();
            blips[entity.id] = null;
            delete blips[entity.id];
        }
    }
});
mp.events.add('render', (nametags) => {
    if (mp.players.local.getVariable("team") != undefined) {
        mp.players.forEachInStreamRange(function(player) {
            if (player != mp.players.local) {
                if (player.getVariable("team") == mp.players.local.getVariable("team")) {
                    if (!blips[player.id]) {
                        blips[player.id] = mp.blips.new(1, player.position, {
                            color: player.getVariable("team_color") || 0,
                            shortRange: true,
                            scale: 0.8,
                            alpha: 200,
                            name: "Ally"
                        });
                        blips[player.id].setShowHeadingIndicator(true);
                        blips[player.id].setCategory(1);
                    }
                    blips[player.id].setCoords(player.position);
                    blips[player.id].setRotation(player.getPhysicsHeading());
                } else {
                    if (blips[player.id]) {
                        blips[player.id].destroy();
                        blips[player.id] = null;
                        delete blips[player.id];
                    }
                }
            }
        });
    }
    let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true)) {
        mp.players.forEachInStreamRange((player) => {
            //if (player != mp.players.local) {
            if (mp.game.system.vdist2(startPosition.x, startPosition.y, startPosition.z, player.position.x, player.position.y, player.position.z) < 600) {
                if ((player.getVariable("loggedIn") == true) && (player.getVariable("spawned") == true)) {
                    let endPosition = player.getBoneCoords(12844, 0, 0, 0);
                    let hitData = mp.raycasting.testPointToPoint(startPosition, endPosition, mp.players.local, (1 | 16 | 256));
                    if (!hitData) {
                        if (player.getVariable("team_rgb_color") && player.getVariable("team_name")) {
                            let color = [255, 255, 255, 200];
                            let team_color = player.getVariable("team_rgb_color");
                            let level = player.getVariable("level");
                            team_color[3] = 180;
                            let r = lerp(170, 255, 1 / 100 * player.getHealth())
                            let g = lerp(30, 255, 1 / 100 * player.getHealth())
                            let b = lerp(30, 255, 1 / 100 * player.getHealth())
                            if ((1 / 100 * player.getHealth()) < 0.2) {
                                color[0] = 170;
                                color[1] = 30;
                                color[2] = 30;
                            } else {
                                color[0] = r;
                                color[1] = g;
                                color[2] = b;
                            }
                            let lPos = mp.players.local.position;
                            let pos = player.getWorldPositionOfBone(player.getBoneIndexByName("IK_Head"));
                            if (player.isInAnyVehicle(false) && (player.vehicle != null)) {
                                let opos = null;
                                if (player.vehicle.getPedInSeat(-1) == player.handle) {
                                    opos = player.vehicle.getWorldPositionOfBone(player.vehicle.getBoneIndexByName("seat_dside_f"))
                                } else if (player.vehicle.getPedInSeat(0) == player.handle) {
                                    opos = player.vehicle.getWorldPositionOfBone(player.vehicle.getBoneIndexByName("seat_pside_f"))
                                } else if (player.vehicle.getPedInSeat(1) == player.handle) {
                                    opos = player.vehicle.getWorldPositionOfBone(player.vehicle.getBoneIndexByName("seat_dside_r"))
                                } else if (player.vehicle.getPedInSeat(2) == player.handle) {
                                    opos = player.vehicle.getWorldPositionOfBone(player.vehicle.getBoneIndexByName("seat_pside_r"))
                                }
                                if (opos != null) {
                                    let offset = player.vehicle.getOffsetFromGivenWorldCoords(opos.x, opos.y, opos.z);
                                    let dist = mp.game.system.vdist2(opos.x, opos.y, opos.z, pos.x, pos.y, pos.z);
                                    if (dist < 25) {
                                        pos = player.vehicle.getOffsetFromInWorldCoords(offset.x, offset.y, offset.z + 1.2);
                                    } else {
                                        pos.z += 0.5;
                                    }
                                }
                            } else {
                                pos.z += 0.4;
                            }
                            let dist = mp.game.system.vdist2(lPos.x, lPos.y, lPos.z, pos.x, pos.y, pos.z);
                            let c_dist = 1 / 800 * dist;
                            let size = lerp(0.5, 0.06, c_dist)
                            if (size > 0.5) {
                                size = 0.5;
                            } else if (size < 0.06) {
                                size = 0.06;
                            }
                            mp.game.graphics.setDrawOrigin(pos.x, pos.y, pos.z, 0);
                            mp.game.graphics.drawText(player.name, [0, 0], {
                                font: 4,
                                color: color,
                                scale: [size, size],
                                outline: true
                            });
                            let top = size;
                            if (level != undefined) {
                                mp.game.graphics.drawText("Level " + level, [0, (0.055) * top], {
                                    font: 4,
                                    color: [255, 255, 255, 200],
                                    scale: [size * 0.6, size * 0.6],
                                    outline: true
                                });
                                top += (size * 0.6);
                            }
                            mp.game.graphics.drawText(player.getVariable("team_name"), [0, (0.055) * top], {
                                font: 4,
                                color: team_color,
                                scale: [size * 0.6, size * 0.6],
                                outline: true
                            });
                            mp.game.graphics.clearDrawOrigin()
                        }
                    }
                }
            }
            //}
        })
    }
})