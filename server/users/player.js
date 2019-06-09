var MongoDB = require("../libs/mongodb.js")
var Damage = require("./damage.js")
var Teams = require("./teams.js")
var Weapons = require("./weapons.js")
var md5 = require("md5")
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
    showLobby() {
        var self = this;
    }
    register(name, password) {
        var self = this;
        User.register(self._player, username, password, function(err, result) {
            if (!err) {
                if (result) {
                    self._dbUser = result;
                    self.showLobby();
                } else {
                    self._player.call("UI:Error", ["Unefined Error"])
                }
            } else {
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
                    self.showLobby();
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