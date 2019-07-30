var MapManager = require("./MapManager.js")
var HUB = require("./hub.js")
var e = require('../libs/enums.js');
var TeamElimination = require("./gamemodes/TeamElimination.js")


let TestLobby1 = new TeamElimination();
setTimeout(function() {
	TestLobby1.name = "TestLobby1";
	TestLobby1.setMap("LS Supply");
	TestLobby1.MaxRounds = e.AUTO_BALANCE;
}, 1000)
let TestLobby2 = new TeamElimination();
setTimeout(function() {
	TestLobby2.name = "TestLobby2";
	TestLobby2.setMap("Korz Center");
	TestLobby2.MaxRounds = 3;
	TestLobby3.balance = e.NO_BALANCE;
}, 1000)
let TestLobby3 = new TeamElimination();
setTimeout(function() {
	TestLobby3.name = "TestLobby3";
	TestLobby3.setMap("Hafen");
	TestLobby3.MaxRounds = 1;
	TestLobby3.balance = e.AUTO_BALANCE;
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
				mode: e.mode,
				balance:e.balance
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
			this._lobbies.push(lobby);
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