function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}
mp.nametags.enabled = false;
mp.gui.chat.colors = true;

mp.events.add('render', (nametags) => {
    if ((mp.players.local.getVariable("loggedIn") == true) && (mp.players.local.getVariable("spawned") == true)) {
        mp.players.forEachInStreamRange((player) => {
            //if (player != mp.players.local) {
            mp.game.graphics.setDrawOrigin(pos.x, pos.y, pos.z, 0);
            mp.game.graphics.drawText(player.name, [0, 0], {
                font: 4,
                color: color,
                scale: [size, size],
                outline: true
            });
            mp.game.graphics.clearDrawOrigin();
            //}
        })
    }
})