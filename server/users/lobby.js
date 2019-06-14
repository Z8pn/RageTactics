var MapManager = require("../world/MapManager.js")
var Lobby = class {
    constructor() {
        this._members = [];
        this._map = undefined;
        this._weapons = [];
    }
    get map() {
        return this._map;
    }
    get member() {
        return this._member;
    }
}
var LobbyManager = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        var self = this;
        self._lobbies = [{
            map:"testmap"
            players:15
        }];
    }
    get lobbies() {
        return this._lobbies.map(function(e) => {
            return {
                map: e.map,
                players: e.players
            }
        })
    }
    createLobby() {}
    deleteLobby(id) {}
    showLobby(player) {
        let maps = MapManager.maps;
        let lobbies = this.lobbies;
        player.call("UI:ShowLobby", [lobbies, maps])
    }
}
module.exports = LobbyManager;