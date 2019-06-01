var mongoose = require('mongoose');
var user = mongoose.Schema({
    user_id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    hwid: String,
    social_club: String,
    password: String,
    salt: String,
    warns: {
        type: Number,
        default: 0
    },
    playtime: {
        type: Number,
        default: 0
    }
}, {
    autoIndex: true
});
var kills = mongoose.Schema({
    timestamp: Date,
    killer_id: Number,
    victim_id: Number,
    weapon_id: Number,
    damage_given: Array
});

user.index({
    user_id: 1,
    name: 1
});
kills.index({
    timestamp: 1
});
module.exports = {
    user: user,
    kills: kills
};