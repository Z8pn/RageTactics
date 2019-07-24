//test
var PlayerClass = require("./users/player.js")
var LobbyManager = require("./users/lobby.js")
//var Gangwar = require("./users/gangwar.js")
//var Weapons = require("./users/weapons.js")
var Lobby = require("./users/lobby.js")
var getDeathReason = require("./libs/death_reasons.js")

var players = [];
mp.events.add("ServerAccount:Ready", function(player) {
    player.setVariable("loggedIn", false);
    players[player.id] = new PlayerClass(player);
    player.interface = players[player.id]
    player.call("Server:RequestLogin");
    player.position.x = 9000;
    player.position.y = 9000;
});
mp.events.add("playerQuit", function(player, exitType, reason) {
    console.log("disconnect",exitType, reason)
    if (players[player.id]) {
        let player_id = player.id;

        if (player.interface.lobby) {
            LobbyManager.leaveLobby(player, player.interface.lobby);
        }






        players[player_id] = null;
        console.log("Data Saving")
        
    }
});
mp.events.add("ServerAccount:Login", function(player, username, password) {
    console.log(players[player.id]);
    if (players[player.id]) {
        players[player.id].login(username, password)
    }
});
mp.events.add("ServerAccount:Register", function(player, username, password) {
    console.log(players[player.id]);
    if (players[player.id]) {
        players[player.id].register(username, password)
    }
});








var fs = require("fs");
var saveFile = "savedpos.txt";
mp.events.addCommand("savepos", (player, name = "No name") => {
    let pos = (player.vehicle) ? player.vehicle.position : player.position;
    let rot = (player.vehicle) ? player.vehicle.rotation : player.heading;
    rot = (player.vehicle) ? `${rot.x}, ${rot.y}, ${rot.z}` : player.heading
    fs.appendFile(saveFile, `${pos.x}, ${pos.y}, ${pos.z}, ${rot}\r\n`, (err) => {
        if (err) {
            player.notify(`~r~SavePos Error: ~w~${err.message}`);
        } else {
            player.notify(`~g~Position saved. ~w~(${name})`);
        }
    });
});
