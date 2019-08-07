var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var UserModel = require('../models/user.js');
var KillModel = require('../models/kills.js');
mongoose.Promise = Promise;
class mongodb {
    constructor() {
        this._setup();
    }
    _setup() {
        var self = this;
        self._conncted = false;
        mongoose.connect('mongodb://localhost/RagaTactics?authSource=admin', {
            useCreateIndex: true,
            useNewUrlParser: true
        });
        self._db = mongoose.connection;
        self._db.on('error', console.error.bind(console, 'connection error:'));
        self._dbUserModel = UserModel;
        self._dbKillModel = KillModel;

        self._db.once('open', function() {
            self._conncted = true;
            console.log("- MongoDB Instance successfully initialized");
            require("./mongodb_warmup.js")
        });
    }
    getUserModel() {
        return this._dbUserModel;
    }
    getKillModel() {
        return this._dbKillModel;
    }
}
module.exports = new mongodb();
