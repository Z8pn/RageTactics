mp.players.local.mugshotboard = {
    show: (title, topText, midText, bottomText, rank = -1) => mp.events.call("ShowMugshotBoard", title, topText, midText, bottomText, rank),
    hide: () => mp.events.call("HideMugshotBoard"),
    anim: () => mp.events.call("setMugshotAnimation")
};
const scriptConst = {
    boardPropName: "prop_police_id_board",
    textPropName: "prop_police_id_text",
    renderTargetName: "ID_Text",
    animDictionary: "mp_character_creation@lineup@male_a",
    animName: "loop_raised"
};
let scriptHandles = {
    boardHandle: null,
    textHandle: null,
    scaleformHandle: null,
    renderTargetID: null
};
mp.events.add("setMugshotAnimation", () => {
    // animation
    mp.game.streaming.requestAnimDict(scriptConst.animDictionary);
    while (!mp.game.streaming.hasAnimDictLoaded(scriptConst.animDictionary)) mp.game.wait(0);
    mp.players.local.taskPlayAnim(scriptConst.animDictionary, scriptConst.animName, 8.0, -8.0, -1, 1, 0.0, false, false, false);
});
mp.events.add("ShowMugshotBoard", (title, topText, midText, bottomText, rank = -1) => {
    if (scriptHandles.boardHandle == null) {
        // create props
        scriptHandles.boardHandle = mp.objects.new(mp.game.joaat(scriptConst.boardPropName), mp.players.local.position, {
            rotation: new mp.Vector3(),
            alpha: 255,
            dimension: mp.players.local.dimension
        });
        scriptHandles.textHandle = mp.objects.new(mp.game.joaat(scriptConst.textPropName), mp.players.local.position, {
            rotation: new mp.Vector3(),
            alpha: 255,
            dimension: mp.players.local.dimension
        });
        // load scaleform & set up the content
        scriptHandles.scaleformHandle = mp.game.graphics.requestScaleformMovie("mugshot_board_01");
        while (!mp.game.graphics.hasScaleformMovieLoaded(scriptHandles.scaleformHandle)) mp.game.wait(0);
        mp.game.graphics.pushScaleformMovieFunction(scriptHandles.scaleformHandle, "SET_BOARD");
        mp.game.graphics.pushScaleformMovieFunctionParameterString(title);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(midText);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(bottomText);
        mp.game.graphics.pushScaleformMovieFunctionParameterString(topText);
        mp.game.graphics.pushScaleformMovieFunctionParameterInt(0);
        if (rank > -1) mp.game.graphics.pushScaleformMovieFunctionParameterInt(rank);
        mp.game.graphics.popScaleformMovieFunctionVoid();
        // set up rendertarget
        mp.game.ui.registerNamedRendertarget(scriptConst.renderTargetName, false);
        mp.game.ui.linkNamedRendertarget(mp.game.joaat(scriptConst.textPropName));
        scriptHandles.renderTargetID = mp.game.ui.getNamedRendertargetRenderId(scriptConst.renderTargetName);
        // attach to the player
        scriptHandles.boardHandle.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true);
        scriptHandles.textHandle.attachTo(mp.players.local.handle, mp.players.local.getBoneIndex(28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true);
        // animation
        mp.game.streaming.requestAnimDict(scriptConst.animDictionary);
        while (!mp.game.streaming.hasAnimDictLoaded(scriptConst.animDictionary)) mp.game.wait(0);
        mp.players.local.taskPlayAnim(scriptConst.animDictionary, scriptConst.animName, 8.0, -8.0, -1, 1, 0.0, false, false, false);
        hasMugshotBoard = true;
    }
});
mp.events.add("HideMugshotBoard", () => {
    if (scriptHandles.boardHandle != null) scriptHandles.boardHandle.destroy();
    if (scriptHandles.textHandle != null) scriptHandles.textHandle.destroy();
    if (scriptHandles.scaleformHandle != null) mp.game.graphics.setScaleformMovieAsNoLongerNeeded(scriptHandles.scaleformHandle);
    if (scriptHandles.renderTargetID != null) mp.game.ui.releaseNamedRendertarget(mp.game.joaat(scriptConst.renderTargetName)); // should be renderTargetName string but says "expected Number", whatever
    scriptHandles.boardHandle = null;
    scriptHandles.textHandle = null;
    scriptHandles.scaleformHandle = null;
    scriptHandles.renderTargetID = null;
    mp.players.local.stopAnimTask(scriptConst.animDictionary, scriptConst.animName, -4.0);
    if (mp.game.streaming.hasAnimDictLoaded(scriptConst.animDictionary)) mp.game.streaming.removeAnimDict(scriptConst.animDictionary);
    hasMugshotBoard = false;
});
mp.events.add("render", () => {
    if (scriptHandles.scaleformHandle != null && scriptHandles.renderTargetID != null) {
        mp.game.ui.setTextRenderId(scriptHandles.renderTargetID);
        mp.game.graphics.drawScaleformMovie(scriptHandles.scaleformHandle, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255, 0);
        mp.game.ui.setTextRenderId(1);
    }
});