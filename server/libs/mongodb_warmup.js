var MongoDB = require("./mongodb.js")
var User = MongoDB.getUserModel();
/********Setup******/
var warmup = {
    count: 0,
    time: 0,
    timer: 0,
    checkTimer: 0,
    threshold: 100,
    checkTime: function() {
        return new Promise(function(fulfill, reject) {
            let start = new Date();
            User.find({}).exec().then(function(docs) {
                let end = new Date();
                return fulfill((end - start))
            }).catch(function() {
                return reject();
            })
        })
    },
    check: function() {
        var self = this;
        self.checkTimer = setInterval(function() {
            self.checkTime().then(function(time) {
                console.log("- MongoDB Response Time", time+"ms")
                if (time > self.threshold) {
                    console.log("- MongoDB Instance warming up...")
                    clearInterval(self.checkTimer);
                    self.start();
                }
            });
        }, 1000);
    },
    warmup: function() {
        var self = this;
        let start = new Date();
        User.find({}).exec().then(function(docs) {
            let end = new Date();
            self.time += (end - start);
            self.count += 1;
        })
    },
    start: function() {
        var self = this;
        self.timer = setInterval(function() {
            self.warmup();
        }, 100);
    }
}
setTimeout(function() {
    warmup.start();
}, 100)