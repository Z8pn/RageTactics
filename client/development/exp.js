module.exports = new class {
    constructor() {
        this._setup();
    }
    _setup(url) {
        this.hudComponentID = 19;
        this.rankBarColor = 27;
    }
    showEXPBar(currentRankLimit, nextRankLimit, lastRankEXP,currentXP,currentLvl) {
        if (!mp.game.graphics.hasHudScaleformLoaded(this.hudComponentID)) {
            mp.game.graphics.requestHudScaleform(this.hudComponentID);
            while (!mp.game.graphics.hasHudScaleformLoaded(this.hudComponentID)) mp.game.wait(0);
            mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(this.hudComponentID, "SET_COLOUR");
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(this.rankBarColor);
            mp.game.graphics.popScaleformMovieFunctionVoid();
        }
        mp.game.graphics.pushScaleformMovieFunctionFromHudComponent(this.hudComponentID, "SET_RANK_SCORES");
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(currentRankLimit);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(nextRankLimit);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(lastRankEXP);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(currentXP);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(currentLvl);
        mp.game.graphics.popScaleformMovieFunctionVoid();
    }
}