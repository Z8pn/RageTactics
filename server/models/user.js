var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var e = require('../libs/enums.js');
var uuidv1 = require('uuid/v1');
var UserSchema = mongoose.Schema({
    id: {
        "type": String,
        default: function genUUID() {
            return uuidv1();
        }
    },
    name: {
        type: String,
        unique: true
    },
    hwid: String,
    social_club: String,
    password: String,
    warns: {
        type: Number,
        default: 0
    },
    playtime: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    }
}, {
    autoIndex: true
});
UserSchema.index({
    id: 1,
    name: 1
});
/**
 * Hash the password
 * task: overwrite .password with bcrypt hash
 **/
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
/**
 * Authenticate the User
 * Add method to UserSchema
 * task: find user and check if password is correct
 **/
UserSchema.statics.login = function(username, password, callback) {
    User.findOne({
        name: username
    }).exec(function(err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            var err = new Error(e.LOGIN_NOT_FOUND);
            err.status = 401;
            return callback(err);
        }
        console.log(user.test())
        bcrypt.compare(password, user.password, function(err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback(e.LOGIN_PASSWORD_WRONG);
            }
        })
    });
}
/**
 * Create Account
 * task: create user account
 **/
UserSchema.statics.register = async function(player, name, password, callback) {
    User.findOne({
        name: name
    }).exec(async function(err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            try {
                let dbUser = await new User({
                    name: name,
                    password: password,
                    hwid: player.serial,
                    social_club: player.socialClub
                }).save();
                return callback(null, dbUser);
            } catch (err) {
                return callback(err);
            }
        } else {
            return callback(e.REGISTERED_ACCOUNT_EXISTS)
        }
    });
}
/*
 *
 */
UserSchema.methods.test = function() {
    console.log("test", this);
    return "0"
};
/*
 * 
 */
var User = mongoose.model('User', UserSchema)
module.exports = User;