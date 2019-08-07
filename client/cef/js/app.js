let enum_count = 1;
var e = {
	LOBBY_BALANCE_ERR: enum_count++,
	LOBBY_CREATING: enum_count++,
	LOBBY_WAITING: enum_count++,
	LOBBY_READY: enum_count++,
	LOBBY_STARTING: enum_count++,
	LOBBY_PREPARING: enum_count++,
	LOBBY_RUNNING: enum_count++,
	LOBBY_COUNTDOWN: enum_count++,
	LOBBY_COUNTDOWN_5: enum_count++,
	LOBBY_COUNTDOWN_4: enum_count++,
	LOBBY_COUNTDOWN_3: enum_count++,
	LOBBY_COUNTDOWN_2: enum_count++,
	LOBBY_COUNTDOWN_1: enum_count++,
	LOBBY_COUNTDOWN_GO: enum_count++,
	LOBBY_ENDING: enum_count++,
	LOBBY_NEW_ROUND: enum_count++,
	LOBBY_NEW_ROUND_STARTING: enum_count++,
	LOBBY_CLOSING: enum_count++,
	LOBBY_CLOSED: enum_count++,
	LOGIN_OK: enum_count++,
	LOGIN_FAILED: enum_count++,
	LOGIN_PASSWORD_WRONG: enum_count++,
	LOGIN_NOT_FOUND: enum_count++,
	REGISTERED_OK: enum_count++,
	REGISTERED_FAILED: enum_count++,
	REGISTERED_PASSWORD_WRONG: enum_count++,
	REGISTERED_ACCOUNT_EXISTS: enum_count++,
	KILLED: enum_count++,
	KILL: enum_count++,
	LOBBY_LEAVE_SUCCESS: enum_count++,
	LOBBY_LEAVE_FAIL: enum_count++,
	LOBBY_JOIN_SUCCESS: enum_count++,
	LOBBY_NOT_EXISTS: enum_count++,
	LOBBY_JOIN_FAIL_FULL: enum_count++,
	LOBBY_JOIN_FAIL_TEAM_INVALID: enum_count++,
	LOBBY_JOIN_FAIL_TEAM_FULL: enum_count++,
	LOBBY_PLAYER_NOT_FOUND: enum_count++,
	LOBBY_MAP_NOT_FOUND: enum_count++,
	LOBBY_MAP_FOUND: enum_count++,
	LOBBY_MAP_MODE_INVALID: enum_count++,
	AUTO_BALANCE: enum_count++,
	NO_BALANCE: enum_count++,
	BALANCE_OK: enum_count++,
}

function translate_enum(en) {
	let enum1 = en.split("translate:")[1];
	let name = Object.keys(e).find(en1 => {
		return e[en1] == enum1;
	})
	return name;
}
$(function() {
	$("body").width($(window).width())
	$("body").height($(window).height())
});
var Account = new class {
	constructor() {
		this._setup();
	}
	_setup() {
		this.username = "";
		this.password = "";
		this.salt = "";
	}
	generateSalt() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
	getFieldValues() {
		return {
			username: $("#join_username").val(),
			password: $("#join_password").val()
		}
	}
	login() {
		console.log("login");
		let vals = this.getFieldValues();
		this.username = vals.username;
		this.password = vals.password;
		if (this.password.length < 3) {
			if ($("#join_password").hasClass("invalid") == false) {
				$("#join_password").remove("valid");
				$("#join_password").addClass("invalid");
			}
		}
		if ($("#join_password").hasClass("invalid") == false) {
			console.log("username", this.username);
			console.log("password", this.password);
			mp.trigger("Account:Login", this.username, this.password);
		} else {
			this.alert("Please Check your Password again")
		}
	}
	register() {
		this.salt = this.generateSalt();
		let vals = this.getFieldValues();
		this.username = vals.username;
		this.password = vals.password;
		if (vals.password.length < 3) {
			if ($("#join_password").hasClass("invalid") == false) {
				$("#join_password").remove("valid");
				$("#join_password").addClass("invalid");
			}
		}
		if ($("#join_password").hasClass("invalid") == false) {
			console.log("username", this.username);
			console.log("password", this.password);
			mp.trigger("Account:Register", this.username, this.password);
		} else {
			this.alert("Please Check your Password again")
		}
	}
	alert(text) {
		$("#alert").show();
		$("#alert_text").addClass("shake");
		$("#alert_text").text(text);
		setTimeout(function() {
			$("#alert_text").removeClass("shake");
		}, 500)
	}
}

function isOdd(num) {
	return num % 2;
}
var LobbyManager = new class {
	constructor() {
		this._lobbies = [];
		this._lobbyView = false;
	}
	getLobbyById(id) {
		return this._lobbies.find(e => {
			return e.id == id;
		})
	}
	load(l) {
		this._lobbies = l;
		this.view();
	}
	view() {
		this._lobbies = this._lobbies.sort(function(a, b) {
			return a.id - b.id;
		})
		let html = "";
		this._lobbies.forEach(function(lobby) {
			html += `<div class="lobby" data-id='${lobby.id}' onclick='LobbyManager.interact("${lobby.id}")'>
				<div class="background">
					<img src="${lobby.image}"></img>
				</div>
				<div class="name">
					${lobby.name}
				</div>
				<div class="players">
					${lobby.players} / ${lobby.max_players}
				</div>
				<div class="map">
					${lobby.map}
				</div>
				<div class="mode">
					${lobby.mode}
				</div>
				<div class="status">
					${translate_enum(lobby.status)}
				</div>
				<div class="rounds">
					Best of ${lobby.rounds}
				</div>
				<div class="id">
					#${lobby.id}
				</div>
			</div>`
		});
		$("#lobbies").html(html);
	}
	notify(type) {
		let message = "";
		let title = "";
		if (type == 1) message = "Auto-Balance is on, please join the other Team.";
		if (title != "") {
			iziToast.show({
				title: '',
				titleSize: '16px',
				message: message,
				theme: 'dark', // dark
				position: 'bottomCenter' // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
			});
		}
	}
	balanced(lobby) {
		let mode = lobby.balance;
		if (mode == e.AUTO_BALANCE) {
			let most_player_team = undefined;
			let most_players = 0;
			lobby.teams.forEach(function(team, index) {
				let t_players = team.players;
				if (t_players > most_players) {
					most_players = t_players;
					most_player_team = index;
				}
			})
			return most_player_team;
		} else if (mode == e.NO_BALANCE) {
			return e.BALANCE_OK;
		}
	}
	interact(id) {
		if (this._lobbyView == false) {
			console.log("interact with", id);
			let lobby = this.getLobbyById(id);
			if (lobby) {
				$("#modal_lobby").find(".title").html(lobby.name);
				$("#modal_lobby").find(".teams > .info").html("Select a Team");
				// $("#modal_lobby").find(".teams > .list").html("");
				let html = "";
				let balance = this.balanced(lobby);
				console.log("balance", balance);
				lobby.teams.forEach(function(team, index) { //${balance != index ?"LobbyManager.select_team('${id}',${index})" : "LobbyManager.notify(1)"  }
					html += `
						<div class="team  ${balance != index ? "": "disabled"}" onclick=" ${balance != index ? "LobbyManager.select_team(" + index+ ")" : "LobbyManager.notify(1)"  }">
							<div class="name">
								${team.name}
							</div>
							<div class="players">
								${team.players} /  ${team.max}
							</div>
						</div>`
				});
				$("#modal_lobby").find(".teams > .list").html(html);
				let bHtml = "";
				if (lobby.players + 1 <= lobby.max_players) {
					bHtml += `
					<div onclick="LobbyManager.join('${id}')" class="button">
						Join
					</div>`
				}
				bHtml += `
					<div onclick="LobbyManager.close()" class="button red">
						Close
					</div>`
				$("#modal_lobby").find(".buttons").html(bHtml);
				$("#modal_lobby").show()
				this._lobbyView = true;
			}
		}
	}
	select_team(team_index) {
		this._selectedTeam = team_index;
		console.log("this._selectedTeam", this._selectedTeam);
		if (this._selectedTeam > -1) {
			$("#modal_lobby").find(".teams > .list > div").each(function(i, e) {
				$(e).removeClass("selected");
				if (i == team_index) {
					$(e).addClass("selected");
				}
			})
		}
	}
	join(id) {
		if (this._selectedTeam > -1) {
			mp.trigger("Lobby:Join", id, this._selectedTeam);
			console.log("laod modal");
		}
	}
	close() {
		this._lobbyView = false;
		this._selectedTeam = -1;
		$("#modal_lobby").hide();
	}
	hide() {
		this.close();
		$("#lobby_view").hide();
	}
	show() {
		$("#lobby_view").show();
	}
}
//LobbyManager.load();
function cef_loadLobbies(n) {
	console.log("loaded lobbies", n)
	LobbyManager.load(n);
}

function cef_loadlobby() {
	LobbyManager.show();
}

function cef_hidelobby() {
	LobbyManager.hide();
}
let tts;

function cef_hidewaitingLobby() {
	$("#lobby_waiting").hide();
	tts = undefined;
}

function cef_waitingLobby(timeToStart) {
	if (tts == undefined) tts = timeToStart;
	let s_string = `<div class="info">Waiting for players...</div>`;
	if (tts != timeToStart) {
		tts = timeToStart;
		s_string = "<div class='info'>Waiting for more players (Starting in " + parseInt(tts) + ")</div>";
	}
	let xHtml = s_string;
	$("#lobby_waiting").html(xHtml);
	$("#lobby_waiting").show();
}

function cef_notification(n) {
	iziToast.show(n);
}

function cef_loadlogin(name) {
	console.log("cef_loadlogin", name)
	$("#join_username").val(name)
	$("#loading").animate({
		opacity: 0
	}, 100, function() {
		$("#login").show();
		$("#login").addClass("show");
	});
}

function cef_hidelogin() {
	$("#login").removeClass("show");
	$("#login").animate({
		opacity: 0,
		height: "0px"
	}, 300, function() {
		$("#login").hide();
	});
}

function alert_login(text) {
	Account.alert(text)
}