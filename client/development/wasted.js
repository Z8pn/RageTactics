module.exports = new class {
    constructor() {
        this._setup();
    }
    _setup(url) {
        this.screenFX = "DeathFailMPIn";
        this.textDelay = 750;
        this.camEffect = 1;
    }
    show(text) {
        mp.game.audio.playSoundFrontend(-1, "Bed", "WastedSounds", true);
        mp.game.graphics.startScreenEffect(this.screenFX, 0, true);
        mp.game.cam.setCamEffect(this.camEffect);
        mp.game.ui.messages.showShard("~r~Wasted", text,1,0,2000);
    }
    hide() {
        mp.game.graphics.stopScreenEffect(this.screenFX);
        mp.game.cam.setCamEffect(0);
    }
}