var MapManager = require("../MapManager.js")
var e = require('../../libs/enums.js');
var NumberManager = new class {
	constructor() {
		this._usedIds = [];
		this._useddims = [];
	}
	new_id(length) {
		var result, i, j;
		result = '';
		for (j = 0; j < length; j++) {
			i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
			result = result + i;
		}
		return result;
	}
	gen_id(length) {
		let self = this;
		let id = self.new_id(length);
		while (self._usedIds[id]) {
			id = self.new_id();
		}
		this._usedIds[id] = true;
		return id;
	}
	new_dim() {
		return (Math.floor(Math.random() * (10000 - 1)) + 1) * -1;
	}
	gen_dim() {
		let self = this;
		let dim = self.new_dim();
		while (self._useddims[dim]) {
			dim = self.new_dim();
		}
		this._useddims[dim] = true;
		return dim;
	}
	clear_dim(dim) {
		this._useddims[dim] = true;
	}
}
class BaseTeamGamemode {
	constructor(GameMode) {
		let self = this;
		self.mode = GameMode;
		self._host = undefined;
		self._name = "";
		self._image = "";
		self._image = "";
		self._map = undefined;
		self._weapons = [];
		self._max_players = 0;
		self._players = [];
		self._players_ready = [];
		self._teamsDead = [];
		self._teams = [];
		self._dim = NumberManager.gen_dim();
		self._status = e.LOBBY_CREATING;
		self._id = NumberManager.gen_id(5);
		self._score = [];
		self._objects = [];
		self._spawnpoints = [];
		self._round = 1;
		self._balance = 0;
		self._MaxRounds = 1;
		self._orgRoundDuration = 5 * 60;
		self._roundDuration = self._orgRoundDuration; // 5 Minutes;
		self._orgLobbyCooldown = 5; // wait til start
		self._lobbyWaitCooldown = self._orgLobbyCooldown;
		self._previewCam = {
			x: 0,
			y: 0,
			z: 0,
			px: 0,
			py: 0,
			pz: 0
		};
		self._tick = setInterval(function() {
			self.tick();
		}, 1000)
		self._roundCooldown = 15;
		console.log(`Created ${self.mode} Lobby`)
	}
	get gameTick() {
		return this._roundDuration;
	}
	notify(string, substring,time = 2000) {
		this.players.forEach(function(player) {
			player.client.call("Lobby:ShardMessage", [string, substring,time]);
		});
	}
	tick() {
		console.log("default game tick");
	}
	clear() {
		clearInterval(this._tick);
	}
	get balance() {
		return this._balance;
	}
	set balance(type) {
		this._balance = type;
	}
	set host(player) {
		this._host = player;
		player.setVariable("host", this._id);
	}
	get host() {
		return this._host;
	}
	get objects() {
		return this._objects;
	}
	set objects(arr_objects) {
		this._objects = arr_objects;
	}
	get weapons() {
		return this._weapons;
	}
	set weapons(arr_weapons) {
		this._weapons = arr_weapons;
	}
	get dead_players() {
		return this._teamsDead;
	}
	reset() {
		let self = this;
		this._lobbyWaitCooldown = this._orgLobbyCooldown;
		this._teamsDead = [];
		this._round = 1;
		this.tick = function() {
			console.log("default game tick");
		}
		if (this._cLoaded) {
			clearInterval(this._cLoaded);
		}
		this._score = [];
		console.log("length", self.players.length)
		/*let players = self.players.map(e => {
			return e.client;
		});
		players.forEach(function(player) {
			console.log("player", player.name);
			LobbyManager.leaveLobby(player, self.id);
		})*/
	}
	get score() {
		return this._score;
	}
	get round() {
		return this._round;
	}
	get MaxRound() {
		return this._MaxRounds;
	}
	set MaxRounds(rs) {
		this._MaxRounds = rs;
	}
	get round_duration() {
		return this._roundDuration;
	}
	set round_duration(dur) {
		this._roundDuration = dur;
	}
	set status(s) {
		this._status = s;
	}
	get status() {
		return this._status;
	}
	get image() {
		return this._image;
	}
	get name() {
		return this._name;
	}
	set name(ename) {
		this._name = ename;
	}
	get id() {
		return this._id;
	}
	setMap(mapName) {
		let map = MapManager.getMapData(mapName);
		if (map) {
			if (map.mode == this.mode) {
				this._map = map.name;
				this._image = map.image;
				this._maxPlayers = map.max_players;
				this.objects = map.objects;
				this._spawnpoints = map.spawns;
				this._teams = map.teams;
				this._previewCam = map.previewCam;
				this.weapons = map.weapons;
				return e.LOBBY_MAP_FOUND;
			} else {
				return e.LOBBY_MAP_MODE_INVALID;
			}
		} else {
			return e.LOBBY_MAP_NOT_FOUND
		}
	}
	get map() {
		return this._map;
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
	get teams() {
		let temp_teams = this._teams.map(e => {
			let t = { ...e
			};
			t.players = 0;
			return t;
		});
		this.players.forEach(function(player) {
			temp_teams[player.team].players += 1;
		});
		return temp_teams;
	}
	leave(player) {
		let self = this;
		let pIndex = this.players.findIndex(function(e, i) {
			return (e.client == player);
		});
		if (pIndex > -1) {
			player.interface.lobby = -1;
			this.players.splice(pIndex, 1);
			return e.LOBBY_LEAVE_SUCCESS;
		} else {
			return e.LOBBY_LEAVE_FAIL;
		}
	}
	join(player) {
		if ((this.player_count + 1) <= this.max_players) {
			if (this.player_count == 0) {
				this.host = player;
			}
			player.interface.lobby = this.id;
			this._players.push({
				client: player,
				ready: 0
			})
			player.setVariable("current_status", "lobby");
			return e.LOBBY_JOIN_SUCCESS
		} else {
			return e.LOBBY_JOIN_FAIL_FULL
		}
	}
}
module.exports = BaseTeamGamemode;