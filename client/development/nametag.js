mp.nametags.enabled = false;
mp.gui.chat.colors = true;
var blips = [];
mp.events.add('render', (nametags) => {
    if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true)) {
        if (mp.players.local.getVariable("team") != undefined) {
            mp.players.forEachInStreamRange(function(player) {
               // if (player != mp.players.local) {
                    if (player.getVariable("team") == mp.players.local.getVariable("team")) {
                        if (!blips[player.id]) {
                            blips[player.id] = mp.blips.new(1, player.position, {
                                color: 3,
                                shortRange: true,
                                scale: 0.4,
                                alpha: 100,
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
                //}
            });
        }
        let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
        if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true) && (mp.players.local.getVariable("death") == false)) {
            mp.players.forEachInStreamRange((player) => {
                //if (player != mp.players.local) {
                if (mp.game.system.vdist2(startPosition.x, startPosition.y, startPosition.z, player.position.x, player.position.y, player.position.z) < 600) {
                    if ((player.getVariable("loggedIn") == true) && (player.getVariable("spawned") == true)) {
                        let endPosition = player.getBoneCoords(12844, 0, 0, 0);
                        let hitData = mp.raycasting.testPointToPoint(startPosition, endPosition, mp.players.local, (1 | 16 | 256));
                        if (!hitData) {
                            let color = [255, 255, 255, 200];
                            let eloScore = player.getVariable("eloScore") || 0;
                            let r = mp.lerp(170, 255, 1 / 100 * player.getHealth())
                            let g = mp.lerp(30, 255, 1 / 100 * player.getHealth())
                            let b = mp.lerp(30, 255, 1 / 100 * player.getHealth())
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
                            pos.z += 0.4;
                            let dist = mp.game.system.vdist2(lPos.x, lPos.y, lPos.z, pos.x, pos.y, pos.z);
                            let c_dist = 1 / 800 * dist;
                            let size = mp.lerp(0.5, 0.06, c_dist)
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
                            mp.game.graphics.drawText("Score " + eloScore, [0, 0.03], {
                                font: 4,
                                color: [255, 255, 255, 200],
                                scale: [size / 2, size / 2],
                                outline: true
                            });
                            mp.game.graphics.clearDrawOrigin()
                        }
                    }
                }
                //}
            })
        }
    }
})