/*var ArmourData = [];
setInterval(function() {
    mp.players.forEachInStreamRange(player => {
        if (!ArmourData[player]) {
            ArmourData[player] = 0;
        }
        if (ArmourData[player] != player.getArmour()) {
            ArmourData[player] = player.getArmour();
            if (ArmourData[player] > 0) {
                mp.gui.chat.push("Has Armour");
                player.setComponentVariation(9, 12, 1, 0);
            } else {
                player.setComponentVariation(9, 0, 0, 0);
            }
        }
    });
}, 1000);*/