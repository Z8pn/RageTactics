var MapManager = require("../world/MapManager.js")
var e = require('../libs/enums.js');
var Lobby = class {
    constructor() {
        this._name = "";
        this._map = undefined;
        this._weapons = [];
        this._maxPlayers = 0;
        this._players = [];
        this._teams = [];
    }
    get name() {
        return this._name ;
    }
    set name(ename) {
        this._name = ename;
    }
    set map(mapName) {
        return MapManager.getMapData(mapName);
    }
    get players() {
        return this._players;
    }
    get player_count() {
        return this._players.length;
    }
    get max_players() {
        return this._maxPlayers;
    }
    get map() {
        return this._map;
    }
    get teams() {
        return this._teams;
    }
    getPlayer(player) {
        let p = this._players.find(e => {
            return e.player == player;
        })
        if (p) {
            return p;
        } else {
            return e.LOBBY_PLAYER_NOT_FOUND
        }
    }
    join(player, team) {
        if (this.teams[team]) {
            if ((this.player_count + 1) <= this.max_players) {
                console.log("team exists", team, this.teams[team])
                this._players.push({
                    player: player,
                    team: team,
                    kills: 0,
                    deaths: 0,
                    assists: 0
                })
                return e.LOBBY_JOIN_SUCCESS
            } else {
                return e.LOBBY_JOIN_FAIL_FULL
            }
        } else {
            return e.LOBBY_JOIN_FAIL_TEAM_INVALID;
        }
    }
}
var LobbyManager = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        var self = this;
        self._lobbies = [{
            map: "testmap"
            players: 15
        }];
    }
    get lobbies() {
        return this._lobbies.map(function(e) => {
            return {
                name: e.name,
                map: e.map,
                players: e.players,
                teams: e.teams
            }
        })
    }
    createLobby(map) {



    }
    deleteLobby(id) {}
    showLobby(player) {
        let maps = MapManager.maps;
        let lobbies = this.lobbies;
        player.call("UI:ShowLobby", [lobbies, maps])
    }
}
module.exports = LobbyManager;