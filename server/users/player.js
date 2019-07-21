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
        self._player = player;
        self._username = undefined;
        self._lobby = undefined;
        self._dbUser = undefined;
        self._spawned = false;
        self._State = false;
        self._health = 100;
        self._armor = 100;
        self.weapons = [];
    }
    set armor(a) {
        this._armor = a;
        this._player.armour = this._armor;
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
    }
    get getState() {
        return this._State;
    }
    updateState(state) {
        this._State = state;
    }
    log(...args) {
        console.log("Account:Log", args)
    }
    error(...args) {
        console.error("Account:Error", args)
    }
    spawn(x, y, z, heading, clothing,dim) {
        let self = this;
        if (self.isSpawned == false) {
            self._player.spawn(new mp.Vector3(x, y, z));
            self._player.model = mp.joaat('mp_m_freemode_01');
            //self._player.model = mp.joaat('mp_f_freemode_01');
            self._player.heading = heading || 0;
            self.health = 100;
            self.armor = 100;
            self.weapons = [];
            /*
            self.isSpawned = true;
            self._player.alpha = 255;
            */
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
        console.log("TODO:SetWeapons");
    }
    get id() {
        return this._userId
    }
    get loggedIn() {
        return this._loggedIn;
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
        console.log("allMaps", allMaps);
        console.log("current_lobbies", current_lobbies);
        console.log("Lobby show");
        self._State = "lobby";
        self._player.setVariable("current_status", "lobby");
        self._player.call("UI:Lobbies", [JSON.stringify(allMaps), JSON.stringify(current_lobbies)])
    }
    register(username, password) {
        var self = this;
        self.log("register request", username, password)
        User.register(self._player, username, password, function(err, result) {
            if (!err) {
                if (result) {
                    console.log("registered");
                    self._dbUser = result;
                    self._player.call("Account:HideLogin");
                    //self.sendLobbyData();
                    HUB.join(self._player);
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
                    self._player.call("Account:HideLogin");
                    //self.sendLobbyData();
                    HUB.join(self._player);

                } else {
                    self._player.call("UI:Error", ["Unefined Error"])
                }
            } else {
                self._player.call("UI:Error", [err])
            }
        })
    }
}
module.exports = Player;