const HUD_CASH = 3;
const SET_TEXT_OUTLINE = "0x2513DFB0FB8400FE";

const moneyColor = [114, 204, 114, 255];
const moneyNegativeColor = [224, 50, 50, 255];
const moneyChangePlus = [240, 240, 240, 255];
const moneyChangeMinus = [194, 80, 80, 255];

const drawX = 0.9999;
const drawY = 0.04;
const fontScale = 0.562;
const diffDisplayTime = 3500; // in milliseconds

let moneySet = false;
let currentMoney = 0;
let currentMoneyText = "$0";
let changeColor = moneyChangePlus;
let changeText = "";
let changeTime = 0;

function drawText(text, drawXY, font, color, scale) {
    mp.game.ui.setTextEntry("STRING");
    mp.game.ui.addTextComponentSubstringPlayerName(text);
    mp.game.ui.setTextFont(font);
    mp.game.ui.setTextScale(scale, scale);
    mp.game.ui.setTextColour(color[0], color[1], color[2], color[3]);
    mp.game.ui.setTextRightJustify(true);
    mp.game.ui.setTextWrap(0, drawXY[0]);
    mp.game.invoke(SET_TEXT_OUTLINE);
    mp.game.ui.drawText(drawXY[0], drawXY[1]);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

mp.events.add("HUD:UpdateMoney", (value) => {
    if (!moneySet) {
        moneySet = true;
    } else {
        let diff = value - currentMoney;
        if (diff < 0) {
            changeColor = moneyChangeMinus;
            changeText = `-$${numberWithCommas(Math.abs(diff))}`;
            changeTime = Date.now() + diffDisplayTime;
        } else if (diff > 0) {
            changeColor = moneyChangePlus;
            changeText = `+$${numberWithCommas(diff)}`;
            changeTime = Date.now() + diffDisplayTime;
        }
    }

    currentMoney = value;
    if (currentMoney < 0) {
        currentMoneyText = `-$${numberWithCommas(Math.abs(currentMoney))}`;
    } else {
        currentMoneyText = `$${numberWithCommas(currentMoney)}`;
    }
});

mp.events.add("render", () => {
    // hide default money hud just in case
    mp.game.ui.hideHudComponentThisFrame(HUD_CASH);

    // calculate draw coords with safezone
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let finalDrawX = drawX - (1.0 - safeZone) * 0.5;
    let finalDrawY = drawY + (1.0 - safeZone) * 0.5;

    // draw money hud
    drawText(currentMoneyText, [finalDrawX, finalDrawY], 7, (currentMoney < 0) ? moneyNegativeColor : moneyColor, fontScale);

    // draw diff hud
    if (Date.now() < changeTime) drawText(changeText, [finalDrawX, finalDrawY + 0.038], 7, changeColor, fontScale);
});