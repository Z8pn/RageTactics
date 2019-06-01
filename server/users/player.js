var MongoDB = require("../libs/mongodb.js")
var Damage = require("./damage.js")
var Teams = require("./teams.js")
var Weapons = require("./weapons.js")
var md5 = require("md5")
var async = require("async")
var User = MongoDB.getUserModel();
var Kills = MongoDB.getKillModel();
var WeaponInventory = MongoDB.getWeaponInventoryModel();
var Player = class {
    constructor(player) {
        this._setup(player);
    }
    _setup(player) {
        var self = this;
        self._player = player;
        self._username = "";
        self._playtime = 0;
        self._warns = 0;
        self._rank = 0;
        self._userId = 0;
        self._weapons = [];
        self._damage = [];
        self._health = 1;
        self._armor = 100;
        self._loggedIn = false;
        self._skin = 'player_zero';
        self._death = 0;
        self._killStreak = 0;
        self._spawnedTimestamp = 0;
    }
    log(...args) {
        console.log("Account:Log", args)
    }
    error(...args) {
        console.error("Account:Error", args)
    }
    get id() {
        return this._userId
    }
    get loggedIn() {
        return this._loggedIn;
    }
    get player() {
        return this._player;
    }
    save() {
        let self = this;
        return new Promise(function(fulfill, reject) {
            if ((self._loggedIn == true) && (self._player)) {
                User.updateOne({
                    user_id: self._userId
                }, {
                    warns: self._warns,
                }, function(err, numberAffected, rawResponse) {
                    if (!err) {
                        self.log("Succesfully saved data", self._username)
                        if (self._player) {
                            self._player.call("Notifications:New", [{
                                title: "Save",
                                titleSize: "16px",
                                message: "Succesfully saved your Account Data",
                                messageColor: 'rgba(0,0,0,.8)',
                                position: "bottomRight",
                                close: false
                            }])
                        }
                        return fulfill("Succesfully saved data", self._username);
                    } else {
                        self.error("Account:Save Fail", err)
                        return reject("Failed saving player data");
                    }
                });
            } else {
                return fulfill("No need to save, not logged in")
            }
        })
    }
    isDead() {
        return this._death;
    }
    killStreak(type) {
        var self = this;
        if (type == "add") {
            self._killStreak += 1;
        }
        if (type == "clear") {
            self._killStreak = 0;
        }
    }
    get killCombo() {
        return this._killStreak
    }
    killed(victim, weapon, teamkill) {
        let self = this;
        mp.players.broadcast(`${self._player.name} someone`);
        self.killStreak("clear");
    }
    killBlip() {
        var self = this;
        if (self._killblip) {
            self._killblip.destroy();
            self._killblip = null;
        }
        self._killblip = mp.blips.new(84, self._player.position, {
            color: self.getTeam().blipcolor,
            shortRange: true,
            scale: 0.8,
            alpha: 200,
            name: self._player.name
        });
        setTimeout(function() {
            if (self._killblip) {
                self._killblip.destroy();
                self._killblip = null;
            }
        }, 10000)
    }
    reward(damage, killer) {
        var self = this;
        if (damage > 20) {
            let base_reward = 24
            let mul = 1 + damage / 125;
            let reward = base_reward + Math.pow(mul, 5);
            self.money += Math.floor(reward);
        }
    }
    death(killer, weapon, reason) {
        let self = this;
        if (killer == false) {
            killer = self;
            weapon = self._player.weapon;
            self._damage.push({
                hitter: self._userId,
                weapon: weapon,
                damage: self._player.health
            })
        }
        self.killStreak("clear")
        self._player.removeAllWeapons();
        self.killBlip();
        let getKillString = "You got killed by " + killer._player.name;
        if (reason == "flatten") {
            getKillString = "You got ran over by " + killer._player.name;
        }
        self._player.call("Player:Death", [getKillString]);
        mp.events.call("Combat:Kill", killer._player, self._player, weapon)
        mp.events.call("Combat:Killed", self._player, killer._player, weapon)
        self.log("Death", killer._userId)
        self._player.setVariable("spawned", false)
        self._player.health = 0;
        self._death = 1;
        // Calc DMG per Player
        let dmg = self._damage;
        let dmg_players = self._damage.reduce(function(w, current) {
            if (current.hitter != self._userId) {
                if (!w[current.hitter.toString()]) {
                    w[current.hitter] = 0;
                }
                w[current.hitter] += current.damage;
            }
            return w;
        }, [])
        mp.events.call("Combat:Rewards", dmg_players, killer._player)
        let weapons = self._weapons.map(item => item.hash).filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        });
        async.eachLimit(weapons, 1, function(weapon, callback) {
            WeaponInventory.findOneAndUpdate({
                user_id: self._userId,
                equiped: true,
                weapon: weapon
            }, {
                $inc: {
                    'duration': -1
                }
            }).exec(function(err, res) {
                if (err) return callback(err);
                return callback();
            });
        }, function(err) {
            if (err) return self.error(err);
            let kill = new Kills({
                timestamp: new Date().getTime(),
                killer_id: killer._userId,
                victim_id: self._userId,
                weapon_id: weapon,
                damage_given: self._damage
            })
            kill.save(function(err) {
                if (err) return self.error(err);
                // saved! 
                setTimeout(function() {
                    self.spawn();
                }, 1000);
            });
        });
    }
    getAvailableWeapons() {
        let lvl = this.getLevelData().level;
        let weapons = Weapons.getWeapons(lvl)
        return weapons;
    }
    loadWeapons() {
        var self = this;
        let weapons_to_give = [];
        let weapons = self.getAvailableWeapons();
        weapons_to_give.push({
            id: weapons.standart
        })
        new Promise(function(fulfill, reject) {
            WeaponInventory.find({
                user_id: self._userId
            }, async function(err, arr) {
                if (err) return reject();
                let weps = arr.filter(function(w) {
                    return (w.duration > 0) && (w.equiped == true);
                }).map(function(w) {
                    return {
                        id: w.weapon.replace("weapon_", "")
                    }
                })
                return fulfill(weps);
            });
        }).then(function(weapons) {
            weapons_to_give = weapons_to_give.concat(weapons);
            self._weapons = [];
            self._player.removeAllWeapons();
            weapons_to_give.forEach(function(weapon) {
                if (weapon.id != "") {
                    self._player.giveWeapon(mp.joaat("weapon_" + weapon.id), 1000);
                    self._weapons.push({
                        id: mp.joaat("weapon_" + weapon.id),
                        hash: "weapon_" + weapon.id
                    })
                }
            })
        }).catch(function(err) {})
    }
    buy(weapon) {
        var self = this;
        WeaponInventory.find({
            user_id: self._userId,
            weapon: weapon
        }, async function(err, arr) {
            if (!arr.length) {
                let weapon_entry = new WeaponInventory({
                    user_id: self._userId,
                    weapon: weapon,
                    duration: 20
                })
                weapon_entry.save(function(err) {
                    if (err) return self.error(err);
                    // saved! 
                    self._player.call("Notifications:New", [{
                        title: "Weapon Shop",
                        titleSize: "16px",
                        message: "You just bought a " + Weapons.getName(weapon).fullname + "<br>Duration:20 Deaths",
                        messageColor: 'rgba(0,0,0,.8)',
                        position: "bottomCenter",
                        close: false
                    }])
                    self.loadWeapons();
                });
            } else {
                WeaponInventory.findOneAndUpdate({
                    user_id: self._userId,
                    weapon: weapon,
                }, {
                    $inc: {
                        'duration': 10
                    }
                }).exec(function(err, res) {
                    if (err) return self.error(err);
                    console.log("results")
                    self._player.call("Notifications:New", [{
                        title: "Weapon Shop",
                        titleSize: "16px",
                        message: "You just bought a " + Weapons.getName(weapon).fullname + "<br>adding 10 Deaths to Weapon duration",
                        messageColor: 'rgba(0,0,0,.8)',
                        position: "bottomCenter",
                        close: false
                    }])
                    self.loadWeapons();
                });
            }
        });
    }
    buyVehicle(hash) {
        var self = this;
        let vehicles = self.getTeam().getVehicles()
        let wIndex = vehicles.findIndex(veh => {
            return veh.hash == hash;
        });
        if (wIndex > -1) {
            let vehData = vehicles[wIndex];
            if (self.money > vehData.price) {
                self._player.call("Notifications:New", [{
                    title: "Vehicle",
                    titleSize: "16px",
                    message: "You just purchased a Vehicle Spawn, spawning...",
                    messageColor: 'rgba(0,0,0,.8)',
                    position: "bottomCenter",
                    close: false
                }])
                self.money -= vehData.price;
                self.getTeam().spawnVehicle(hash, self._player)
                self._player.call("VehicleShop:Close");
                self._player.setVariable("teamColshape", false);
            }
        }
    }
    showVehicles() {
        var self = this;
        if (self._player.vehicle == undefined) {
            let vehicles = self.getTeam().getVehicles()
            self._player.call("VehicleShop:Show", [vehicles]);
        }
    }
    spawn() {
        var self = this;
        let spawnpoints = Teams[self._team].getSpawns();
        let spoint = spawnpoints[Math.floor(Math.random() * spawnpoints.length)];
        self._player.spawn(spoint.vector);
        self._player.model = mp.joaat(Teams[self._team].skins[self._skin].name);
        self._player.heading = spoint.heading;
        self._health = 100;
        self._armor = 25;
        self._player.health = 100 + self._health;
        self._player.armour = self._armor;
        self._damage = [];
        self._death = 0;
        self._player.setVariable("level", self.getLevelData().level)
        self._player.setVariable("team_color", Teams[self._team]._color_blip)
        self._player.setVariable("team_rgb_color", Teams[self._team].teamcolor)
        self._player.setVariable("team", self._team)
        self._player.setVariable("team_name", Teams[self._team].name)
        self._player.setVariable("spawned", true)
        self._player.setVariable("invincible", true)
        self._player.alpha = 255;
        self._player.call("Cam:Hide")
        self._player.call("Player:Spawn");
        self._spawnedTimestamp = Date.now();
        self.loadWeapons();
    }
    hit(hitter, weapon, bone) {
        var self = this;
        if (self._loggedIn == true) {
            if ((Date.now() - self._spawnedTimestamp) / 1000 > 15) {
                if ((self._health > 0) && (self.isDead() == 0)) {
                    let mul = 1;
                    if (bone != undefined) {
                        mul = Damage.getBoneMul(bone);
                    }
                    let damage = Math.floor(Damage.getWeaponDamage(weapon) * (mul || 1));
                    self.log("weapon", weapon)
                    self.log("damage", damage)
                    self.log("hitter", hitter._player.name)
                    if (hitter.team == self.team) {
                        damage *= 0.25;
                    }
                    if (self._player.health > self._health) {
                        self._player.health = self._health;
                    }
                    if (self._player.armour > self._armor) {
                        self._player.armour = self._armor;
                    }
                    self._health = self._player.health;
                    self._armor = self._player.armour;
                    let armor = self._armor - damage;
                    let health = self._health;
                    if (armor < 0) {
                        health += armor;
                        armor = 0;
                    }
                    self._health = health;
                    if (self._health < 0) {
                        self._health = 0;
                    }
                    self._armor = armor;
                    hitter.player.call("Combat:HitEntity")
                    if ((health <= 0) && (self.isDead() == 0)) {
                        self.death(hitter, weapon);
                    } else {
                        self._player.health = self._health + 100;
                        self._player.armour = self._armor;
                        self._damage.push({
                            hitter: hitter.player.getVariable("user_id"),
                            weapon: weapon,
                            damage: damage
                        })
                    }
                } else {
                    if ((self.isDead() == 0)) {
                        self.death(hitter, weapon);
                    }
                }
            }
        }
    }
    fireWeapon(id, ammo) {
        var self = this;
        if (id != 0) {
            // self.exp(15);
            let wIndex = self._weapons.findIndex(weapon => {
                return weapon.id == id;
            });
            if (wIndex == -1) {
                //self.error(Number(id), "Weapon Cheat", self._player.name)
                //self._player.removeWeapon(Number(id));
            }
        }
    }
    load(username) {
        var self = this;
        self._username = username;
        self._player.call("Account:HideLogin")
        self._loggedIn = true;
        User.find({
            name: self._username
        }, async function(err, arr) {
            if (arr.length) {
                let cUser = arr[0];
                self._exp = cUser.exp;
                self.money = cUser.money;
                self._playtime = cUser.playtime;
                self._warns = cUser.warns;
                self._rank = cUser.rank;
                self._userId = cUser.user_id;
                //self.spawn();
                self.askTeam();
                self._player.setVariable("user_id", self._userId)
                self._player.setVariable("loggedIn", true);
                self._player.setVariable("spawned", false)
                self._player.call("Account:LoginDone")
                //self._player.call("Cam:Hide")
                self.log("loaded player data for", self._player.name)
                console.log(self._player)
                mp.events.call("Player:Loaded", self._player)
            } else {
                self.error("Account:Load", "Failed loading player data")
            }
        }).lean()
    }
    setTeam(team, skin) {
        this._team = team;
        this._skin = skin;
        this._player.dimension = 0;
        this.spawn();
    }
    askTeam() {
        var self = this;
        self._team = 0;
        let team_data = [];
        Teams.forEach(function(team) {
            team_data.push({
                name: team.name,
                skins: team.skins,
                preview: team.getTeamPerspective()
            })
        })
        self._player.setVariable("spawned", false)
        self._player.dimension = self._userId * -1;
        self._player.call("Teams:Change", [team_data])
    }
    register(name, password_hash, salt) {
        var self = this;
        User.find({
            name: name
        }, async function(err, arr) {
            if (err) return console.log("error", err);
            if ((arr) && (arr.length)) {
                self._player.call("Account:Alert", ["Username already exsits"])
            } else {
                let hwid = self._player.serial
                let social_club = self._player.socialClub;
                let hash = password_hash;
                let UserCount = await User.find({});
                User.create({
                    user_id: UserCount.length,
                    name: name,
                    hwid: hwid,
                    social_clib: social_club,
                    password: password_hash,
                    salt: salt,
                }, function(err, rV) {
                    if (err) {
                        self._player.call("Account:Alert", ["Username already exsits"])
                        return console.log(err)
                    };
                    console.log("account created")
                    self.load(name);
                    // saved!
                });
            }
        });
    }
    login(username, password) {
        var self = this;
        self.log("Login request")
        User.find({
            name: username
        }, async function(err, arr) {
            if (arr.length) {
                let lUser = arr[0];
                let hash = md5(password + "|" + lUser.salt);
                if (hash == lUser.password) {
                    self.load(username)
                } else {
                    self.error("Account:Alert", "Password Wrong")
                    self._player.call("Account:Alert", ["Password Wrong"])
                }
            } else {
                console.log("Account:Alert", "Account does not exists")
                self._player.call("Account:Alert", ["Account does not exists"])
            }
        });
    }
}
module.exports = Player;