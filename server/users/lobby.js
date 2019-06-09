
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
    }
    createLobby() {

    }
    deleteLobby(id) {

    }
    
}
module.exports = LobbyManager;