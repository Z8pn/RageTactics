var mongoose = require('mongoose');
var KillSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    killer_id: Number,
    victim_id: Number,
    weapon_id: Number,
    damage_given: Array
}, {
    autoIndex: true
});
KillSchema.index({
    timestamp: 1
});
var Kill = mongoose.model('Kills', KillSchema)
module.exports = Kill;