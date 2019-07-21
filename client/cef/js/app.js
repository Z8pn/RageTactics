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
        return this._lobbies.filter(function(a) {
            return a.id == id;
        })
    }
    load(l) {
        this._lobbies = l;
        this.view();
    }
    view() {
        $("#lobbies").html("");
        this._lobbies = this._lobbies.sort(function(a, b) {
            return a.id - b.id;
        })
        let html = "";
        this._lobbies.forEach(function(lobby) {
            console.log(lobby);
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
                <div class="status">
                    ${lobby.status}
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
    interact(id) {
        if (this._lobbyView == false) {
            let lobby = this.getLobbyById(id)[0];
            if (lobby) {
                $("#modal_lobby").find(".title").html(lobby.name);
                $("#modal_lobby").find(".teams > .info").html("Select a Team");
                // $("#modal_lobby").find(".teams > .list").html("");
                let html = "";
                lobby.teams.forEach(function(team, index) {
                    html += `
                        <div class="team" onclick="LobbyManager.select_team('${id}',${index})">
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
    select_team(id, team_index) {
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
        $("#lobbies").hide();
        $("#modal_lobby").hide();
    }
    show() {
        $("#lobbies").show();
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

function cef_hidewaitingLobby() {
    $("#lobby_waiting").hide();
}

function cef_waitingLobby(teams) {
    console.log("cef_waitingLobby", teams);
    let xHtml = `<div class="info">Waiting for players...</div>`;
    teams.forEach(function(team) {
        xHtml += `<div class="team"><div class="name">${team.name}</div><div class="players">`
        team.players.forEach(function(player) {
            xHtml += `<div class="player"><div class="name">${player.name}</div><div class="ping">${player.ping}ms</div></div>`
        })
        xHtml += `</div></div>`
    })
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

function cef_loadlobby() {
    $("#lobbies").show();
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