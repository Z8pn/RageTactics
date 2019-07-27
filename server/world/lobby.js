var MapManager = require("./MapManager.js")
var HUB = require("./hub.js")
var e = require('../libs/enums.js');
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
var TeamElimination = class {
	constructor() {
		let self = this;
		self.mode = "Team Elimination";
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
	}
	clear() {
		clearInterval(this._tick);
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
		if (this._cLoaded) {
			clearInterval(this._cLoaded);
		}
		console.log("length", self.players.length)
		let players = self.players.map(e => {
			return e.client;
		});
		players.forEach(function(player) {
			console.log("player", player.name);
			LobbyManager.leaveLobby(player, self.id);
		})
	}
	get score() {
		return this._score;
	}
	addPointToTeam(team) {
		if (this._score[team] == undefined) this._score[team] = 0;
		this._score[team] += 1;
		console.log("team score for team", team, this._score[team]);
	}
	get winner() {
		let self = this;
		let winner = undefined;
		let hScore = 0;
		this.teams.forEach(function(e, i) {
			if (self.score[e.name] > hScore) {
				hScore = self.score[e.name];
				winner = e;
			}
		});
		return winner;
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
		console.log("set map", map)
		if (map) {
			this._map = map.name;
			this._image = map.image;
			this._maxPlayers = map.max_players;
			this.objects = map.objects;
			this._spawnpoints = map.spawns;
			this._teams = map.teams;
			this._previewCam = map.previewCam;
			this.weapons = map.weapons;
			console.log("set lobby to " + mapName);
			return e.LOBBY_MAP_FOUND;
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
	mapScoreboard() {
		let self = this;
		let scoreboard = [];
		scoreboard.map = self.map;
		scoreboard.round = self.round;
		scoreboard.max_rounds = self.MaxRounds;
		scoreboard.round_time = self.round_duration;
		scoreboard.max_round_time = self._orgLobbyCooldown;
		scoreboard.teams = self.teams;
		scoreboard.players = self.players.map(e => {
			return {
				name: e.client.name,
				dead: e.dead,
				kills: e.kills,
				deaths: e.deaths,
				ping: e.client.ping
			}
		})
		self.players.forEach(function(player) {
			player.client.call("Lobby:Scoreboard", [JSON.stringify(scoreboard)]);
		});
	}
	update_status() {
		let self = this;
		if ((self.player_count == 0) && (self.status == e.LOBBY_RUNNING)) {
			if (!self._idleTick) self._idleTick = 0;
			self._idleTick += 1;
			if (self._idleTick > 120) LobbyManager.clear(self.id);
		}
		if (self.status == e.LOBBY_CREATING) {
			console.log("LOBBY WAITING");
			self.status = e.LOBBY_WAITING;
		} else if (self.status == e.LOBBY_WAITING) {
			if (!(self.players.length % self.teams.length) && (self.players.length > 1)) {
				self._lobbyWaitCooldown -= 1;
				if (self._lobbyWaitCooldown < 1) {
					console.log("LOBBY_STARTING");
					self.status = e.LOBBY_STARTING;
					self._lobbyWaitCooldown = self._orgLobbyCooldown;
				}
			}
		}
		if (self.status == e.LOBBY_NEW_ROUND_STARTING) {
			self._roundCooldown -= 1;
			if (self._roundCooldown < 1) {
				console.log("LOBBY_NEW_ROUND STARTING");
				self._roundCooldown = 15;
				self.status = e.LOBBY_STARTING;
				self._round += 1;
			}
		}
	}
	tick() {
		let self = this;
		self.update_status();
		self.mapScoreboard();
		let tPlayerNames = [];
		if (self.status == e.LOBBY_WAITING) {
			self._teams.forEach(function(e, i) {
				let temp_team = {
					name: e.name,
					players: []
				};
				self.players.forEach(function(e) {
					if (e.team == i) {
						temp_team.players.push({
							name: e.client.name,
							ping: e.client.ping
						})
					}
				});
				tPlayerNames.push(temp_team)
			});
		}
		if (self.status == e.LOBBY_RUNNING) {
			self.round_duration -= 1;
			if (self.round_duration <= 0) {
				self.round_duration = self._orgRoundDuration;
				self.end();
			}
		}
		if (self.players.length > 0) {
			self.players.forEach(function(player) {
				if (player.ready == 0) {
					player.ready = 1;
					player.client.dimension = self._dim;
					player.client.setVariable("current_status", "cam");
					player.client.call("Lobby:PreviewCam", [JSON.stringify(self._previewCam)]);
					player.client.call("Lobby:LoadObjects", [self.id, JSON.stringify(self.objects)]);
				} else {
					player.client.call("GP:Ping");
				}
				if (self.status == e.LOBBY_WAITING) {
					player.client.call("Lobby:WaitingUpdate", [self._lobbyWaitCooldown]);
				}
			})
			if (self.status == e.LOBBY_NEW_ROUND) {
				self._teamsDead = [];
				self.players.forEach(function(player) {
					player.client.dimension = self._dim;
					player.client.setVariable("current_status", "cam");
					player.client.call("Lobby:PreviewCam", [JSON.stringify(self._previewCam)]);
					/*if (player.ready == 1) {
						player.ready = 0;
					}*/
				});
				console.log(" new round ")
				self.status = e.LOBBY_NEW_ROUND_STARTING;
			} else if (self.status == e.LOBBY_CLOSING) {
				if (!self._closingTime) self._closingTime = 15;
				if (self._closingTime == 15) {
					console.log("winner", self.winner);
					self.players.forEach(function(player) {
						if (player.ready == 1) {
							player.client.setVariable("current_status", "cam");
							player.client.call("Lobby:PreviewCam", [JSON.stringify(self._previewCam)]);
						}
					});
				}
				self._closingTime -= 1;
				console.log(self._closingTime);
				if (self._closingTime == 0) {
					self._closingTime = undefined;
					console.log("LOBBY_ENDING");
					self.status = e.LOBBY_CLOSED;
					LobbyManager.deleteLobby(self.id);
				}
			} else if (self.status == e.LOBBY_STARTING) {
				self.prepare();
				console.log("prepare()");
			} else if (self.status == e.LOBBY_COUNTDOWN) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["Starting...", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_5;
			} else if (self.status == e.LOBBY_COUNTDOWN_5) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["5", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_4;
			} else if (self.status == e.LOBBY_COUNTDOWN_4) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["4", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_3;
			} else if (self.status == e.LOBBY_COUNTDOWN_3) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["3", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_2;
			} else if (self.status == e.LOBBY_COUNTDOWN_2) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["2", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_1;
			} else if (self.status == e.LOBBY_COUNTDOWN_1) {
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["1", self.round]);
				});
				self.status = e.LOBBY_COUNTDOWN_GO;
			} else if (self.status == e.LOBBY_COUNTDOWN_GO) {
				self.status = e.LOBBY_RUNNING;
				self.players.forEach(function(player) {
					player.client.call("Lobby:Countdown", ["Go!", self.round]);
				});
				self.start();
			}
		}
	}
	loaded(player) {
		if (this._players_ready.indexOf(player) == -1) {
			this._players_ready.push(player);
		}
	}
	start() {
		let self = this;
		self.players.forEach(function(player) {
			player.client.setVariable("current_status", "ingame");
			player.client.call("GP:StartGame");
		});
	}
	prepare() {
		let self = this;
		if (self.status == e.LOBBY_STARTING) {
			self.status = e.LOBBY_PREPARING;
			console.log("status" + e.LOBBY_PREPARING);
			let spawns = JSON.parse(JSON.stringify(self._spawnpoints));
			self._teams.forEach(function(e, i) {
				console.log("team", e.name);
				let team_spawns = spawns.filter(e => {
					return e.team == i;
				})
				let team = i;
				let clothing = e.clothing;
				self.players.forEach(function(e) {
					if (e.team == team) {
						let spawn_pos = team_spawns.pop();
						if (spawn_pos) {
							e.dead = 0;
							e.client.interface.spawn(spawn_pos.x, spawn_pos.y, spawn_pos.z, spawn_pos.heading, clothing);
							e.client.interface.setEquipment(self.weapons);
							e.client.setVariable("team", team);
							e.client.setVariable("current_status", "cam");
							e.client.call("Lobby:StartCam");
							e.client.dimension = self._dim;
						} else {
							self.reset();
						}
					}
				});
			});
			self._tempTries = 100;
			self._cLoaded = setInterval(function() {
				if (self._players_ready.length == self._players.length) {
					clearInterval(self._cLoaded);
					self.status = e.LOBBY_COUNTDOWN;
				}
				self._tempTries -= 1;
				if (self._tempTries < 1) {
					clearInterval(self._cLoaded);
					self.reset();
				}
			}, 5000);
		}
	}
	roundreport() {
		console.log("TODO REPORT ROUND");
	}
	isOver() {
		let self = this;
		let rounds = this.MaxRound;
		let winner = undefined;
		let hScore = 0;
		this.teams.forEach(function(e, i) {
			if (self.score[e.name] > hScore) {
				hScore = self.score[e.name];
				winner = e.name;
			}
		});
		if (hScore > rounds / 2) {
			console.log("not winnable");
			return true;
		} else {
			console.log("still winnable")
			return false;
		}
	}
	end(winningTeam) {
		console.log("round enderino winner", winningTeam);
		//calc game score
		if (winningTeam != undefined) {
			let winningTeamArr = this.teams.find(function(e, i) {
				return winningTeam == i;
			});
			if (winningTeamArr) {
				this.addPointToTeam(winningTeamArr.name);
			}
		} else if (winningTeam == undefined) {
			console.log("calculate points by kills");
		}
		console.log("SCORE", this.score);
		//calc game score
		this.roundreport();
		let isGameOver = this.isOver();
		mp.players.broadcast(`Winner :${this.winner.name}`);
		console.log("isGameOver", isGameOver);
		if (((this.MaxRound - this.round) > 0) && (isGameOver == false)) {
			this.status = e.LOBBY_NEW_ROUND;
		} else {
			this.status = e.LOBBY_CLOSING;
		}
	}
	killed(victim, killer) {
		let self = this;
		if (self.status == e.LOBBY_RUNNING) {
			let pos = victim.position;
			let model = victim.model;
			let heading = victim.heading;
			let action = victim.action;
			let victim_ref = victim;
			let killer_ref = killer;
			let move_mul = 0;
			if (action == "jumping") {
				move_mul = 2;
			}
			if (action == "moving") {
				move_mul = 1.5;
			}
			if (action == "moving_aiming") {
				move_mul = 1.1;
			}
			if (action == "moving_reloading") {
				move_mul = 1;
			}
			if (action == "aiming") {
				move_mul = 0.4;
			}
			victim.position.z -= 5;
			victim = this.players.find(function(player) {
				return player.client == victim_ref;
			});
			console.log("victim", victim);
			killer = this.players.find(function(player) {
				return player.client == killer_ref;
			});
			killer.kills += 1;
			victim.deaths += 1;
			victim.dead = 1;
			let assist_player = victim_ref.interface.assist(killer_ref);
			if (assist_player) {
				let a_player = this.players.find(function(player) {
					return player.client.id == assist_player;
				});
				if (a_player) {
					a_player.assists += 1;
				}
			}
			console.log("killer", killer);
			let victim_team = this.teams.find(function(e, i) {
				return victim.team == i;
			});
			let killer_team = this.teams.find(function(e, i) {
				return killer.team == i;
			});
			console.log("KILLED VICTIM KILLER");
			console.log("team", victim_team);
			let clothes = JSON.stringify(victim_team.clothing);
			this.players.forEach(function(player) {
				player.client.call("GP:DummyBody", [pos.x, pos.y, pos.z, model, heading, clothes, move_mul]);
			});
			if (!this._teamsDead[victim_team]) {
				this._teamsDead[victim_team] = [];
			}
			this._teamsDead[victim_team].push(victim);
			if (this._teamsDead[victim_team].length >= victim_team.players) {
				console.log(victim_team.name, "team 0 survivors");
				console.log(killer_team.name, "team winner");
				if (victim_team == killer_team) {
					self.end();
				} else {
					self.end(killer.team);
				}
			}
			let otherTeammates = this.players.filter(player => {
				return player.team == victim.team && player != victim;
			}).map(e => {
				return e.client;
			})
			if (otherTeammates) {
				console.log("can spectate", otherTeammates);
				victim_ref.call("GP:Spectatable", [otherTeammates, /*Only show FOV*/ , true])
			}
		}
	}
	getPlayer(player) {
		let p = this._players.find(e => {
			return e.client == player;
		})[0];
		if (p) {
			return p;
		} else {
			return e.LOBBY_PLAYER_NOT_FOUND
		}
	}
	leave(player) {
		let self = this;
		let pIndex = this.players.findIndex(function(e, i) {
			return (e.client == player);
		});
		if (pIndex > -1) {
			player.interface.lobby = -1;
			console.log("pIndex", pIndex)
			this.players.splice(pIndex, 1);
			return e.LOBBY_LEAVE_SUCCESS;
		} else {
			return e.LOBBY_LEAVE_FAIL;
		}
	}
	join(player, team) {
		if (this.teams[team]) {
			if ((this.player_count + 1) <= this.max_players) {
				console.log("team exists", team, this.teams[team])
				if ((this.teams[team].players + 1) <= this.teams[team].max) {
					if (this.player_count == 0) {
						this.host = player;
					}
					this._lobbyWaitCooldown = this._orgLobbyCooldown;
					player.interface.lobby = this.id;
					this._players.push({
						client: player,
						team: team,
						kills: 0,
						deaths: 0,
						assists: 0,
						dead: 0,
						ready: 0
					})
					player.setVariable("current_status", "lobby");
					return e.LOBBY_JOIN_SUCCESS
				} else {
					return e.LOBBY_JOIN_FAIL_TEAM_FULL;
				}
			} else {
				return e.LOBBY_JOIN_FAIL_FULL
			}
		} else {
			return e.LOBBY_JOIN_FAIL_TEAM_INVALID;
		}
	}
}
let TestLobby1 = new TeamElimination();
setTimeout(function() {
	TestLobby1.name = "TestLobby1";
	TestLobby1.setMap("LS Supply");
	TestLobby1.MaxRounds = 5;
}, 1000)
let TestLobby2 = new TeamElimination();
setTimeout(function() {
	TestLobby2.name = "TestLobby2";
	TestLobby2.setMap("Korz Center");
	TestLobby2.MaxRounds = 3;
}, 1000)
let TestLobby3 = new TeamElimination();
setTimeout(function() {
	TestLobby3.name = "TestLobby3";
	TestLobby3.setMap("Hafen");
	TestLobby3.MaxRounds = 1;
}, 1000)
var LobbyManager = new class {
	constructor() {
		this._setup();
	}
	_setup() {
		var self = this;
		self._lobbies = [TestLobby1, TestLobby2, TestLobby3];
	}
	getLobbyByID(id) {
		return this._lobbies.find(e => {
			return e.id == id;
		})
	}
	get lobbies() {
		return this._lobbies.map(e => {
			return {
				name: e.name,
				image: e.image,
				id: e.id,
				players: e.player_count,
				max_players: e.max_players,
				map: e.map,
				status: e.status,
				teams: e.teams,
				rounds: e.MaxRound,
				mode: e.mode
			};
		})
	}
	getLobbyPlayerIsIn(player) {
		console.log("TODO getLobbyPlayerIsIn(lobby.js)")
		return;
	}
	createLobby(player, lobby_data) {
		let lobby;
		if (lobby_data.gamemode = "tem") {
			lobby = new TeamElimination();
			lobby.name = lobby_data.lobby_name;
			let map_valid = lobby.setMap(lobby_data.map_name);
			if (map_valid == e.LOBBY_MAP_FOUND) {
				lobby.round_duration = lobby_data.round_duration;
				lobby.MaxRounds = lobby_data.max_rounds;
			}
		}
		if (lobby) {
			self._lobbies.push(lobby);
			return {
				name: lobby.name,
				image: lobby.image,
				id: lobby.id,
				players: lobby.player_count,
				max_players: lobby.max_players,
				map: lobby.map,
				status: lobby.status,
				teams: lobby.teams,
				rounds: lobby.MaxRound,
				mode: lobby.mode
			};
		}
		return false;
	}
	deleteLobby(id) {
		let self = this;
		console.log("TODO DELETE LOBBY", id);
		let lobby = this.getLobbyByID(id);
		if (lobby) {
			let index = this._lobbies.findIndex(e => {
				return e.id == id;
			});
			console.log("index", index);
			lobby.reset();
			setTimeout(() => {
				self._lobbies[index] = undefined;
				delete self._lobbies[index];
				self._lobbies.splice(index, 1);
			}, 5000);
		}
	}
	leaveLobby(player, id) {
		console.log("leaveLobby");
		if (player.interface) {
			console.log("leaveLobby 1");
			let lobby = this.getLobbyByID(id);
			if (lobby) {
				console.log("Lobby exists");
				if (player) {
					let lobbyRequest = lobby.leave(player);
					console.log("lobbyRequest", lobbyRequest)
					if (lobbyRequest == e.LOBBY_LEAVE_SUCCESS) {
						console.log("leave succesful")
						player.call("Lobby:UnloadObjects", [lobby.id]);
						HUB.join(player);
					}
				}
			}
		}
	}
	joinLobby(player, id, teamIndex) {
		if (player.interface) {
			console.log("joinLobby", player.interface.lobby);
			if (player.interface.lobby == -1) {
				let lobby = this.getLobbyByID(id);
				if (lobby) {
					if (lobby.status != e.LOBBY_CLOSED) {
						console.log("Lobby exists");
						let lobbyRequest = lobby.join(player, teamIndex);
						if (lobbyRequest == e.LOBBY_JOIN_SUCCESS) {
							console.log("join success", e.LOBBY_JOIN_SUCCESS);
							player.call("Lobby:Hide");
						} else {
							player.call("Lobby:Error", [JSON.stringify({
								title: "Error",
								message: "translate:" + lobbyRequest,
								timeout: 5000,
								color: "red"
							})]);
						}
					} else {
						player.call("Lobby:Error", [JSON.stringify({
							title: "Error",
							message: "translate:" + e.LOBBY_CLOSED,
							timeout: 5000,
							color: "red"
						})]);
					}
				} else {
					player.call("Lobby:Error", [JSON.stringify({
						title: "Error",
						message: "translate:" + e.LOBBY_NOT_EXISTS,
						timeout: 5000,
						color: "red"
					})]);
				}
			}
		}
	}
}
mp.events.add("LobbyManager:LoadingFinished", function(player, lID) {
	if (player.interface) {
		console.log("LobbyManager:LoadingFinished");
		let lobby = LobbyManager.getLobbyByID(lID);
		if (lobby) {
			lobby.loaded(player);
		}
	}
});
mp.events.add("LobbyManager:Join", function(player, id, teamIndex) {
	if (player.interface) {
		if (player.interface.lobby == -1) {
			if (HUB.isInHub(player)) {
				console.log("join lobby");
				LobbyManager.joinLobby(player, id, teamIndex);
			} else {
				console.log("Player not in Hub");
			}
		}
	}
});
module.exports = LobbyManager;