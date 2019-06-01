var natives = require("gangwar_client/natives.js")
module.exports = new class {
    constructor() {
        this._setup();
    }
    _setup(url) {
        let self = this;
        self.noise = 0;
        self.blip = mp.game.ui.addBlipForCoord(0, 0, 0);
        natives.SET_BLIP_SPRITE(self.blip, 9);
        natives.SET_BLIP_ALPHA(self.blip, 70);
        natives.SET_BLIP_COLOUR(self.blip, 3);
        natives.SET_BLIP_SCALE(self.blip, 0);
        mp.events.add("render", () => {
            self.render()
        });
    }
    render() {
        var self = this;
        let mul = mp.players.local.getVariable("isCrouched");
        self.noise = mul ? mp.game.player.getCurrentStealthNoise() * 0.8 : mp.game.player.getCurrentStealthNoise();
        mp.game.graphics.drawText("Noise " + self.noise.toFixed(2), [0.5, 0.005], {
            font: 4,
            color: [255, 255, 255, 255],
            scale: [0.5, 0.5],
            outline: true
        });
        mp.game.graphics.drawText("Visible Distance " + Math.floor(200 * (self.noise > 1.5 ? self.noise * 0.6 : 0.2)), [0.5, 0.03], {
            font: 4,
            color: [255, 255, 255, 255],
            scale: [0.5, 0.5],
            outline: true
        });
        natives.SET_BLIP_SCALE(self.blip, self.noise / 25);
        let position = mp.players.local.position;
        natives.SET_BLIP_COORDS(self.blip, position.x, position.y, position.z)
    }
}