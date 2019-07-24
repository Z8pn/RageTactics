var MongoDB = require("../libs/mongodb.js")
var Damage = require("./damage.js")
var LobbyManager = require("./lobby.js")
//var Weapons = require("./weapons.js")
var MapManager = require("../world/MapManager.js")
var HUB = require("../world/hub.js")
var async = require("async")
var User = MongoDB.getUserModel();
var Kills = MongoDB.getKillModel();
var Player = class {
    constructor(player) {
        this._setup(player);
    }
    _setup(player) {
        var self = this;
        self._id = 0;
        self._player = player;
        self._death = false;
        self._username = undefined;
        self._lobby = undefined;
        self._dbUser = undefined;
        self._spawned = false;
        self._State = false;
        self._health = 100;
        self._armor = 100;
        self._damage = [];
        self.weapons = [];
        self._curLobby = -1;
    }
    log(...args) {
        console.log("Account:Log", args)
    }
    error(...args) {
        console.error("Account:Error", args)
    }
    addDamage(attacker_id, weapon, damage, bodypart) {
        console.log("addDamage", attacker_id, weapon, damage, bodypart);
        this._damage.push({
            attacker_id: attacker_id,
            weapon: weapon,
            damage: damage,
            bodypart: bodypart
        })
    }
    set lobby(id) {
        this._curLobby = id;
    }
    get lobby() {
        return this._curLobby;
    }
    get damage() {
        return this._damage;
    }
    get id() {
        return this._id;
    }
    set armor(a) {
        this._armor = a;
        this._player.armour = this._armor;
        this._player.call("AC:SetArmor", [this._armor]);
    }
    get armor() {
        return this._armor;
    }
    get health() {
        return this._health;
    }
    set health(h) {
        this._health = h;
        this._player.health = 100 + this._health;
        this._player.call("AC:SetHealth", [this._health]);
    }
    get getState() {
        return this._State;
    }
    updateState(state) {
        this._State = state;
    }
    syncHealth(nHP) {
        this.health = nHP;
    }
    syncArmor(nAr) {
        this.armor = nAr;
    }
    isDead() {
        return this._death;
    }
    assist(killer) {
        let self = this;
        let allDamage = self.damage;
        let damage_does = [];
        allDamage.forEach(function(e) {
            if (!damage_does[e.attacker_id]) damage_does[e.attacker_id] = 0;
            if (typeof e.damage == "number") {
                damage_does[e.attacker_id] += e.damage;
            }
        })
        damage_does = Object.keys(damage_does).sort((a, b) => {
            let a_dmg = damage_does[a];
            let b_dmg = damage_does[b];
            return a_dmg - b_dmg;
        })
        console.log("damage_does", damage_does[0]);
        return damage_does[0];
    }
    death(attacker, weapon, bodypart) {
        if (!attacker) attacker = this._player;
        if (!weapon) weapon = "none";
        if (!bodypart) bodypart = "none";
        this._death = true;
        this.health = 0;
        this.armor = 0;
        this.addDamage(attacker.interface.id, weapon, "DEAD", bodypart)
        this._player.removeAllWeapons();
        console.log("health", this.health);
        console.log("armor", this.armor);
        attacker.call("Combat:Kill");
        this._player.setVariable("death", true);
        let lobby = LobbyManager.getLobbyByID(this.lobby);
        if (lobby) {
            console.log("foudn lobby");
            lobby.killed(this._player, attacker);
            this._player.alpha = 0;
        }
    }
    hit(attacker, weapon, bodypart) {
        let self = this;
        if (self.isDead() == 0) {
            //console.log("attacker", attacker);
            console.log("weapon", weapon);
            console.log("bodypart", bodypart);
            //calc dmg
            let damage = 1;
            damage = Damage.getWeaponDamage(weapon);
            let mul = Damage.getBoneMul(bodypart);
            damage *= mul;
            let health = self.health;
            let armor = self.armor - damage;
            if (armor < 0) {
                health += armor;
                armor = 0;
            }
            self.armor = armor;
            self.health = health;
            if (self.health < 0) {
                self.health = 0;
            }
            self._player.call("Combat:Hitted", [damage]);
            attacker.call("Combat:Hit", [damage]);
            self.addDamage(attacker.interface.id, weapon, damage, bodypart)
            if ((self.health <= 0) && (self.isDead() == 0)) {
                self.death(attacker, weapon, bodypart);
            }
        }
    }
    fireWeapon(weapon, ammo) {
        let self = this;
        let wIndex = self.weapons.findIndex(e => {
            return e.weapon == weapon;
        });
        if (wIndex > -1) {
            console.log("wIndex", wIndex);
            console.log("weapon", weapon);
            self.weapons[wIndex].ammo -= 1;
            if (self.weapons[wIndex].ammo >= ammo) {
                console.log("ammo", self.weapons[wIndex].ammo);
                console.log("rammo", ammo);
                self.weapons[wIndex].ammo = ammo;
            }
        } else {
            console.log("cheat");
            self._player.removeWeapon(weapon);
        }
    }
    spawn(x, y, z, heading, clothing, dim) {
        let self = this;
        if (self.isSpawned == false) {
            self._player.spawn(new mp.Vector3(x, y, z));
            self._player.model = mp.joaat('mp_m_freemode_01');
            //self._player.model = mp.joaat('mp_f_freemode_01');
            self._player.heading = heading || 0;
            self.health = 100;
            self.armor = 100;
            self.weapons = [];
            self._player.alpha = 255;
            self._damage = [];
            self._death = false;
            /*
            self.isSpawned = true;
            */
            self._player.setVariable("death", false);
            self._player.setVariable("spawned", true);
            self._player.dimension = dim || 0;
            clothing.forEach(function(part) {
                self._player.setClothes(part.componentNumber, part.drawable, part.texture, part.palette);
            })
            return true;
        } else {
            return false;
        }
    }
    setEquipment(weapons) {
        let self = this;
        console.log("TODO:SetWeapons");
        self.weapons = [];
        weapons.forEach(function(weapon) {
            console.log(weapon);
            self._player.giveWeapon(weapon.hash, weapon.ammo);
            self.weapons.push({
                weapon: weapon.hash,
                ammo: weapon.ammo
            })
        })
    }
    get loggedIn() {
        return this._loggedIn;
    }
    set loggedIn(t) {
        this._loggedIn = t;
        this._player.setVariable("loggedIn", t);
    }
    get isSpawned() {
        return this._spawned;
    }
    get player() {
        return this._player;
    }
    sendLobbyData() {
        var self = this;
        let allMaps = MapManager.maps;
        let current_lobbies = LobbyManager.lobbies;
        console.log("Lobby show");
        self._State = "lobby";
        self._player.setVariable("current_status", "lobby");
        self._player.call("Lobby:Update", [JSON.stringify(allMaps), JSON.stringify(current_lobbies)])
    }
    register(username, password) {
        var self = this;
        self.log("register request", username, password)
        User.register(self._player, username, password, function(err, result) {
            if (!err) {
                if (result) {
                    console.log("registered");
                    self._dbUser = result;
                    self._id = result.id;
                    self._player.call("Account:HideLogin");
                    self.sendLobbyData();
                    HUB.join(self._player);
                    self.loggedIn = true;
                } else {
                    console.log("Unefined Error");
                    self._player.call("UI:Error", ["Unefined Error"])
                }
            } else {
                console.log(err);
                self._player.call("UI:Error", [err])
            }
        });
    }
    login(username, password) {
        var self = this;
        self.log("Login request")
        User.login(username, password, function(err, result) {
            if (!err) {
                if (result) {
                    self._dbUser = result;
                    self._id = result.id;
                    self._player.call("Account:HideLogin");
                    self.sendLobbyData();
                    HUB.join(self._player);
                    self.loggedIn = true;
                } else {
                    self._player.call("UI:Error", ["Unefined Error"])
                }
            } else {
                self._player.call("UI:Error", [err])
            }
        })
    }
}
mp.events.add("Combat:FireWeapon", function(player, currentWeapon, remainingAmmo) {
    if (player.interface) {
        console.log("Combat:FireWeapon", currentWeapon, remainingAmmo);
        player.interface.fireWeapon(currentWeapon, remainingAmmo);
    }
});
mp.events.add("Combat:Hit", function(player, target, currentWeapon, hitBone) {
    if ((target) && (currentWeapon)) {
        if (target.type == "player") {
            if ((player.interface) && (target.interface)) {
                console.log("Combat:Hit", target.name, currentWeapon, hitBone);
                target.interface.hit(player, currentWeapon, hitBone);
            }
        } else if (target.type == "vehicle") {
            console.log("veh hit");
        }
    }
});
mp.events.add("User:RequestLobby", function(player) {
    if (player.interface) {
        console.log("sendLobbyData");
        player.interface.sendLobbyData();
    }
});
mp.events.add("User:ResyncHealth", function(player, hp) {
    if (player.interface) {
        console.log("User:ResyncHealth", hp);
        player.interface.syncHealth(hp)
    }
});
mp.events.add("User:ResyncArmor", function(player, a) {
    if (player.interface) {
        console.log("User:ResyncArmor", a);
        player.interface.syncArmor(a)
    }
});
mp.events.add("User:Suicide", function(player, a) {
    if (player.interface) {
        console.log("User:Suicide", a);
        player.interface.death()
    }
});
module.exports = Player;