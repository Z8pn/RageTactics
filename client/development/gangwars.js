var natives = require("./natives.js")

function inside(point, vs) {
    let x = point[0],
        y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0],
            yi = vs[i][1];
        let xj = vs[j][0],
            yj = vs[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
var Gangturf = class {
    constructor(name, id, x, y, range, color, rot, owner) {
        this._setup(name, id, x, y, range, color, rot, owner);
    }
    _setup(name, id, x, y, range, color, rot, owner) {
        var self = this;
        self.name = name;
        self.id = id;
        self.range = range;
        self.color = color;
        self.position = {
            x: x,
            y: y,
            z: 123
        };
        self.rotation = rot;
        self.blip = null;
        self._colshape = null;
        self._status = true;
        self._entered = false;
        self._isEntering = false;
        self._inColshape = false;
        self._timerCheck;
        self._owner = owner;
        self.loadArea();

    }
    loadArea() {
        var self = this;
        self.blip = mp.game.ui.addBlipForRadius(self.position.x, self.position.y, 1, self.range);
        natives.SET_BLIP_SPRITE(self.blip, 5);
        natives.SET_BLIP_ALPHA(self.blip, 70);
        self._colshape = mp.colshapes.newCircle(self.position.x, self.position.y, self.range * 1.5);
        natives.SET_BLIP_COLOUR(self.blip, self.color);

    }
    render() {
        var self = this;
        if (self.blip) {
            natives.SET_BLIP_ROTATION(self.blip, self.rotation)
            //natives.SET_BLIP_COORDS(self.blip, 250, 900, 1)
        }
        /*if (self.blip) {
            if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, 0, self.position.x, self.position.y, 0, true) < self.range * 1.5) {
                var range = Math.sqrt(((self.range * 1.2) * (self.range * 1.2)) + (((self.range * 1.2) / 2) * ((self.range * 1.2) / 2)));
                let degrees = (self.rotation + 45) * (Math.PI / 180);
                let top_right = {
                    x: self.position.x + range * Math.cos(degrees),
                    y: self.position.y + range * Math.sin(degrees)
                }
                degrees = (self.rotation + 135) * (Math.PI / 180);
                let top_left = {
                    x: self.position.x + range * Math.cos(degrees),
                    y: self.position.y + range * Math.sin(degrees)
                }
                degrees = (self.rotation + 225) * (Math.PI / 180);
                let bottom_left = {
                    x: self.position.x + range * Math.cos(degrees),
                    y: self.position.y + range * Math.sin(degrees)
                }
                degrees = (self.rotation + 315) * (Math.PI / 180);
                let bottom_right = {
                    x: self.position.x + range * Math.cos(degrees),
                    y: self.position.y + range * Math.sin(degrees)
                }
                let z = mp.game.gameplay.getGroundZFor3dCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, false);
                mp.game.graphics.drawLine(bottom_right.x, bottom_right.y, z, bottom_right.x, bottom_right.y, z + 25, 0, 255, 0, 255);
                mp.game.graphics.drawLine(top_left.x, top_left.y, z, top_left.x, top_left.y, z + 25, 0, 0, 255, 255);
                for (var i = z; i < z + 25; i += 0.5) {
                    mp.game.graphics.drawLine(top_left.x, top_left.y, i, top_right.x, top_right.y, i, 255, 0, 0, 255);
                    mp.game.graphics.drawLine(top_right.x, top_right.y, i, bottom_right.x, bottom_right.y, i, 255, 0, 0, 255);
                    mp.game.graphics.drawLine(bottom_right.x, bottom_right.y, i, bottom_left.x, bottom_left.y, i, 255, 0, 0, 255);
                    mp.game.graphics.drawLine(bottom_left.x, bottom_left.y, i, top_left.x, top_left.y, i, 255, 0, 0, 255);
                }
            }
            if (self.isInsideArea()) {
                mp.game.graphics.drawText("Entered " + self.id, [self.position.x, self.position.y, mp.players.local.position.z], {
                    font: 7,
                    color: [255, 255, 255, 185],
                    scale: [0.4, 0.4],
                    outline: true,
                    centre: true
                });
            }
        }*/
    }
    updateArea(status, ...args) {
        var self = this;
        if (status == "attack") {
            self._status = "attack";
            natives.SET_BLIP_FLASHES(self.blip, true)
            return;
        }
        if (status == "normal") {
            self._status = "normal";
            natives.SET_BLIP_FLASHES(self.blip, false)
            return;
        }
        if (status == "conquered") {
            self._status = "conquered";
            self._owner = args[1];
            natives.SET_BLIP_FLASHES(self.blip, false)
            natives.SET_BLIP_COLOUR(self.blip, args[0])
            return;
        }
    }
    destroy() {
        mp.game.ui.removeBlip(this.blip);
        this._colshape.destroy();
    }
    isTurfArea(shape) {
        return (shape == this._colshape)
    }
    isOwner(gang) {
        return (gang == this._owner)
    }
    check() {
        var self = this;
        if ((!self._entered)) {
            if (self.isInsideArea() && (self.isNearGround() == true)) {
                self._entered = true;
                mp.events.call("Gangarea:Enter", self);
                mp.events.callRemote("Gangarea:Enter", self.id);
            }
        } else if (self._entered == true) {
            if (!self.isInsideArea() || (self.isNearGround() == false)) {
                self._entered = false;
                mp.events.call("Gangarea:Leave", self);
                mp.events.callRemote("Gangarea:Leave", self.id);
            }
        }
    }
    enter() {
        var self = this;
        self._timerCheck = setInterval(function() {
            self.check();
        }, 1000);
    }
    leave() {
        var self = this;
        clearInterval(self._timerCheck);
        self.check();
    }
    isNearGround() {
        let self = this;
        let ground = mp.game.gameplay.getGroundZFor3dCoord(self.position.x, self.position.y, 9000, 0, false);
        let max_diff = 75;
        let dist = mp.game.system.vdist(0, 0, ground, 0, 0, mp.players.local.position.z);
        if (dist <= max_diff) {
            return true;
        }
        return false;
    }
    isInsideArea() {
        var self = this;
        let player = {
            x: mp.players.local.position.x,
            y: mp.players.local.position.y,
            z: mp.players.local.position.z
        };
        var range = Math.sqrt(((self.range * 1.2) * (self.range * 1.2)) + (((self.range * 1.2) / 2) * ((self.range * 1.2) / 2)));
        let degrees = (self.rotation + 45) * (Math.PI / 180);
        let top_right = {
            x: self.position.x + range * Math.cos(degrees),
            y: self.position.y + range * Math.sin(degrees)
        }
        degrees = (self.rotation + 135) * (Math.PI / 180);
        let top_left = {
            x: self.position.x + range * Math.cos(degrees),
            y: self.position.y + range * Math.sin(degrees)
        }
        degrees = (self.rotation + 225) * (Math.PI / 180);
        let bottom_left = {
            x: self.position.x + range * Math.cos(degrees),
            y: self.position.y + range * Math.sin(degrees)
        }
        degrees = (self.rotation + 315) * (Math.PI / 180);
        let bottom_right = {
            x: self.position.x + range * Math.cos(degrees),
            y: self.position.y + range * Math.sin(degrees)
        }
        let turf = [
            [top_right.x, top_right.y],
            [top_left.x, top_left.y],
            [bottom_left.x, bottom_left.y],
            [bottom_right.x, bottom_right.y]
        ]
        if (inside([player.x, player.y], turf)) {
            return true;
        }
        return false;
    }
}
//
var gangturfs = [];
mp.events.add("playerEnterColshape", function(shape) {
    let turfEntered;
    gangturfs.forEach(function(turf, id) {
        if (turf.isTurfArea(shape) == true) {
            turfEntered = turf;
        }
    });
    if (turfEntered) {
        if (turfEntered.isTurfArea(shape)) {
            turfEntered.enter()
        }
    }
});
mp.events.add("playerExitColshape", function(shape) {
    let turfExitted;
    gangturfs.forEach(function(turf, id) {
        if (turf.isTurfArea(shape) == true) {
            turfExitted = turf;
        }
    });
    if (turfExitted) {
        if (turfExitted.isTurfArea(shape)) {
            turfExitted.leave()
        }
    }
});
mp.events.add('render', () => {
    gangturfs.forEach(function(turf, id) {
        turf.render();
    })
})

function clearBlips() {
    natives.SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT(true);
    let last_blip = natives.GET_FIRST_BLIP_INFO_ID(5);
    while (natives.DOES_BLIP_EXIST(last_blip)) {
        mp.game.ui.removeBlip(last_blip);
        last_blip = natives.GET_NEXT_BLIP_INFO_ID(5);
    }
    mp.game.wait(50);
}
mp.events.add("GangAreas:Create", function(turfs) {
    clearBlips();
    if (turfs.length > 0) {
        turfs.forEach(function(turf) {
            if (turf.turf_id != undefined) {
                //mp.gui.chat.push("turf " + JSON.stringify(turf))
                gangturfs[gangturfs.length + 1] = new Gangturf(turf.name, turf.turf_id, turf.position.x, turf.position.y, turf.range, turf.color, turf.rotation, turf.owner)
            }
        })
    }
});
/*mp.events.add("OnClientGangAreaEnter", function(area) {
    TurfDisplay.setCurrentArea(area)
});
mp.events.add("OnClientGangAreaLeave", function(area) {
    TurfDisplay.setCurrentArea(null)
});*/
/*mp.events.add("OnGangAreaStatusChange", function(id, status) {
    let turfData;
    gangturfs.forEach(function(turf) {
        if (id == turf.id) { 
            turfData = turf;
        }
    });
    if (turfData) {
        turfData.updateArea(status)
    }
});
mp.events.add("OnGangAreaUpdate", function(id, attacker_score, owner_count, attacker_id, owner_id) {
    let turfData;
    gangturfs.forEach(function(turf) {
        if (id == turf.id) {
            turfData = turf;
        }
    });
    if (turfData) {
        TurfDisplay.setTurfScores(turfData.id, attacker_score, owner_count)
        turfData.updateArea("attack")
    }
})
mp.events.add("OnGangAreaFinish", function(id, color, newOwner) {
    let turfData;
    gangturfs.forEach(function(turf) {
        if (id == turf.id) {
            turfData = turf;
        }
    });
    if (turfData) {
        turfData.updateArea("conquered", color, newOwner)
        TurfDisplay.clearTurfScores(id)
    }
});*/