$(function() {
    $("body").width($(window).width())
    $("body").height($(window).height())
    $(document).ready(function() {
        $('select').formSelect();
        $('select').on('contentChanged', function() {
            console.log("change")
            $(this).formSelect()
        });
    });
});
var Account = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this.username = "";
        this.password = "";
        this.salt = "";
    }
    generateSalt() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    getFieldValues() {
        return {
            username: $("#join_username").val(),
            password: $("#join_password").val()
        }
    }
    login() {
        console.log("login");
        let vals = this.getFieldValues();
        this.username = vals.username;
        this.password = vals.password;
        if (this.password.length < 3) {
            if ($("#join_password").hasClass("invalid") == false) {
                $("#join_password").remove("valid");
                $("#join_password").addClass("invalid");
            }
        }
        if ($("#join_password").hasClass("invalid") == false) {
            console.log("username", this.username);
            console.log("password", this.password);
            mp.trigger("Account:Login", this.username, this.password);
        } else {
            this.alert("Please Check your Password again")
        }
    }
    register() {
        this.salt = this.generateSalt();
        let vals = this.getFieldValues();
        this.username = vals.username;
        this.password = md5(vals.password + "|" + this.salt);
        if (vals.password.length < 3) {
            if ($("#join_password").hasClass("invalid") == false) {
                $("#join_password").remove("valid");
                $("#join_password").addClass("invalid");
            }
        }
        if ($("#join_password").hasClass("invalid") == false) {
            console.log("username", this.username);
            console.log("password", this.password);
            mp.trigger("Account:Register", this.username, this.password, this.salt);
        } else {
            this.alert("Please Check your Password again")
        }
    }
    alert(text) {
        $("#alert").show();
        $("#alert_text").addClass("shake");
        $("#alert_text").text(text);
        setTimeout(function() {
            $("#alert_text").removeClass("shake");
        }, 500)
    }
}
var Teams = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this.selected = 0;
        this.skin = 0;
        this.avTeams = [];
        this.oldTeam = 0;
    }
    loadTeams(teams) {
        this.avTeams = teams;
    }
    init() {
        this.selected = 0;
        this.skin = 0;
        let temp_team = this.avTeams[this.selected];
        $("#skin_name").html(temp_team.skins[this.skin].fullName);
        $("#team_name").html(temp_team.name);
        this.update();
    }
    update() {
        mp.trigger("Teams:UpdateTeamData", this.selected, this.skin);
        mp.trigger("Teams:UpdateSkin", this.avTeams[this.selected].name, this.avTeams[this.selected].skins[this.skin].name);
        $("#team_name").html(this.avTeams[this.selected].name);
        $("#skin_name").html(this.avTeams[this.selected].skins[this.skin].fullName);
        if (this.selected != this.oldTeam) {
            mp.trigger("Teams:UpdateTeam", JSON.stringify(this.avTeams[this.selected].preview));
        }
        this.oldTeam = this.selected;
    }
    nextSkin() {
        let l = this.avTeams[this.selected].skins.length;
        if ((this.skin + 1) >= l) {
            this.skin = 0;
        } else {
            this.skin += 1;
        }
        this.update();
    }
    prevSkin() {
        let l = this.avTeams[this.selected].skins.length;
        if ((this.skin - 1) < 0) {
            this.skin = l - 1;
        } else {
            this.skin -= 1;
        }
        this.update();
    }
    nextTeam() {
        let l = this.avTeams.length;
        if ((this.selected + 1) >= l) {
            this.selected = 0;
        } else {
            this.selected += 1;
        }
        this.update();
    }
    prevTeam() {
        let l = this.avTeams.length;
        if ((this.selected - 1) < 0) {
            this.selected = l - 1;
        } else {
            this.selected -= 1;
        }
        this.update();
    }
    selectTeam() {
        mp.trigger("Teams:JoinTeam");
    }
}
var WeaponShop = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this._weapons = [];
    }
    view() {
        var self = this;
        $("#shop > .buyable_weapons").html("");
        this._weapons.forEach(function(weapon) {
            let weapon_data = $(`<div class="item" data-weapon="${weapon.hash}" data-price="${weapon.price}">
                    <div class="image"><img src="./img/${weapon.hash}.png"></img></div>
                    <div class="name">${weapon.name}</div>
                    <div class="price">$${weapon.price}</div>
                    <div class="buy">
                        <span onclick="WeaponShop.buy('${weapon.hash}')">Buy</span>
                    </div>
                </div>`);
            $("#shop > .buyable_weapons").append(weapon_data);
        })
    }
    loadWeapons(weapons) {
        this._weapons = weapons;
        this.view();
    }
    buy(weapon) {
        console.log(weapon);
        mp.trigger("WeaponShop:Buy", weapon);
    }
}
var Notifications = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this._current = [];
    }
    notify(notification) {
        iziToast.show(notification);
    }
}
var VehicleShop = new class {
    constructor() {
        this._setup();
    }
    _setup() {}
    loadVehicles(groups) {
        $("#vehicles").html("");
        let html = "";
        groups.forEach(function(veh) {
            /* console.log(group);
             html += `<optgroup label="${group.name}">`;
             group.vehicles.forEach(function(veh) {*/
            html += `<option value="${veh.hash}">${veh.name} - $${veh.price}</option>  `;
            /*});
            html += `</optgroup>`;*/
        })
        $("#vehicles").html(html);
        $("#vehicles").trigger('contentChanged');
    }
    buy() {
        let veh = $("#vehicles").val();
        if (veh != undefined) {
            mp.trigger("VehicleShop:Buy", veh);
        }
    }
    close() {
        mp.trigger("VehicleShop:Close");
    }
}
var LevelProgress = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        var self = this;
        self._maxEXP = 6;
        self._currentEXP = 5;
        self._minEXP = 1;
        self._currentLevel = 0;
    }
    view() {
        var self = this;
        $("#progress > .level_progress > .level").html("Current Level: " + self._currentLevel)
        $("#progress > .level_progress > .next-level").html("Next Level: " + parseInt(self._currentLevel + 1))
        let width = 100 / (self._maxEXP - self._minEXP) * (self._currentEXP - self._minEXP);
        console.log("width", width)
        $("#progress > .level_progress > .progress-bar > span").css({
            "width": width + "%"
        })
        $("#progress > .level_progress > .points").html((self._currentEXP - self._minEXP) + " EXP/" + (self._maxEXP - self._minEXP) + " EXP")
    }
    loadData(data) {
        var self = this;
        self._maxEXP = data.max;
        self._currentEXP = data.current;
        self._minEXP = data.min;
        self._currentLevel = data.level;
        self.view();
    }
}

function cef_loadvehicles(vehs) {
    VehicleShop.loadVehicles(vehs)
}

function cef_showvehicles() {
    $("#vehicle_spawner").show();
    $("#vehicle_spawner").animate({
        opacity: 1
    }, 100, function() {});
}

function cef_hidevehicles() {
    $("#vehicle_spawner").animate({
        opacity: 0
    }, 300, function() {
        $("#vehicle_spawner").hide();
    });
}

function cef_loadlevels(leveldata) {
    LevelProgress.loadData(leveldata)
}

function cef_showlevels() {
    $("#progress").show();
    $("#progress").animate({
        opacity: 0.9
    }, 100, function() {});
}

function cef_hidelevels() {
    $("#progress").animate({
        opacity: 0
    }, 300, function() {
        $("#progress").hide();
    });
}

function notify(n) {
    Notifications.notify(n)
}

function cef_loadlogin(name) {
    $("#join_username").val(name)
    $("#loading").animate({
        opacity: 0
    }, 100, function() {
        $("#login").show();
        $("#login").addClass("show");
    });
}

function cef_hidelogin() {
    $("#login").removeClass("show");
    $("#login").animate({
        opacity: 0,
        height: "0px"
    }, 300, function() {
        $("#login").hide();
    });
}

function cef_loadteams(teams) {
    Teams.loadTeams(teams);
}

function cef_showteam() {
    $("#team").show();
    Teams.init();
    $("#team").animate({
        opacity: 0.9
    }, 100, function() {});
}

function cef_hideteam() {
    $("#team").animate({
        opacity: 0
    }, 300, function() {
        $("#team").hide();
    });
}

function cef_loadweapons(weapons) {
    WeaponShop.loadWeapons(weapons)
}

function cef_showweaponshop() {
    $("#shop").show();
    $("#shop").animate({
        opacity: 0.9
    }, 300, function() {});
}

function cef_hideweaponshop() {
    $("#shop").animate({
        opacity: 0
    }, 300, function() {
        $("#shop").hide();
    });
}

function alert_login(text) {
    Account.alert(text)
}