var BaseTeamGamemode = require("./base.js");
var e = require('../../libs/enums.js');
class TeamElimination extends BaseTeamGamemode {
	constructor() {
		super("Team Elimination");
	}
	balanced() {
		let mode = this._balance;
		if (mode == e.AUTO_BALANCE) {
			let most_player_team = undefined;
			let most_players = 0;
			this.team.forEach(function(team, index) {
				let t_players = team.players;
				if (t_players > most_players) {
					most_players = t_players
					most_player_team = index;
				}
			})
			return most_player_team;
		} else if (mode == e.NO_BALANCE) {
			return true;
		}
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
			if ( /*!(self.players.length % self.teams.length) &&*/ (self.players.length > 0)) {
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
				self.notify("Starting...", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_5;
			} else if (self.status == e.LOBBY_COUNTDOWN_5) {
				self.notify("5", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_4;
			} else if (self.status == e.LOBBY_COUNTDOWN_4) {
				self.notify("4", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_3;
			} else if (self.status == e.LOBBY_COUNTDOWN_3) {
				self.notify("3", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_2;
			} else if (self.status == e.LOBBY_COUNTDOWN_2) {
				self.notify("2", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_1;
			} else if (self.status == e.LOBBY_COUNTDOWN_1) {
				self.notify("1", "Round " + self.round);
				self.status = e.LOBBY_COUNTDOWN_GO;
			} else if (self.status == e.LOBBY_COUNTDOWN_GO) {
				self.status = e.LOBBY_RUNNING;
				self.notify("Go!", "Round " + self.round);
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
		let sub_string = "";
		this.score.forEach(function(s, t) {
			sub_string += t + ":" + s + "\n";
		})
		if (((this.MaxRound - this.round) > 0) && (isGameOver == false)) {
			this.status = e.LOBBY_NEW_ROUND;
			this.notify("Round Over", this.winner.name + " won this round\nScore:" + sub_string);
		} else {
			this.status = e.LOBBY_CLOSING;
			this.notify("Game Over", this.winner.name + " won\nScore:" + sub_string);
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
					if (this.balanced() != team) {
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
						return e.LOBBY_BALANCE_ERR;
					}
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
module.exports = TeamElimination;