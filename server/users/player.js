var MongoDB = require("../libs/mongodb.js")
var Damage = require("./damage.js")
var LobbyManager = require("./lobby.js")
//var Weapons = require("./weapons.js")
var MapManager = require("../world/MapManager.js")
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
        let allMaps = MapManager.maps;
        let current_lobbies = LobbyManager.lobbies;
        console.log("allMaps",allMaps);
        console.log("current_lobbies",current_lobbies);
        console.log("Lobby show");
        self._State = "lobby";
        self._player.setVariable("current_status","lobby");
        self._player.call("UI:Lobbies", [JSON.stringify(allMaps),JSON.stringify(current_lobbies)])
    }
    register(username, password) {
        var self = this;
        self.log("register request",username,password)
        User.register(self._player, username, password, function(err, result) {
            if (!err) {
                if (result) {
                    console.log("registered");
                    self._dbUser = result;
                    self._player.call("Account:HideLogin");
                   // self.showLobby();
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