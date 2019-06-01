var Teams = class {
    constructor(id, team_name, color, rgba_color) {
        this._setup(id, team_name, color, rgba_color);
    }
    _setup(id, team_name, color, rgba_color) {
        var self = this;
        self._spawns = [];
        self._skins = [];
        self._skin = "player_zero"
        self._team_name = team_name
        self._team_id = id
        self._vehicles = [];
        self._vehSpawns = [];
        self._color_blip = color;
        self._team_color = rgba_color
        self._blip;
        self._teamPreview = {};
        self._vehRequestPoints = [];
    }
    get name() {
        return this._team_name;
    }
    get blipcolor() {
        return this._color_blip;
    }
    get teamcolor() {
        return this._team_color;
    }
    get getSkin() {
        return this._skin;
    }
    get skins() {
        return this._skins;
    }
    setTeamPreview(pr) {
        this._teamPreview = pr
    }
    getTeamPerspective() {
        return this._teamPreview;
    }
    addSkin(name, fullName) {
        this._skin = name;
        this._skins.push({
            name: name,
            fullName: name
        })
    }
    addSpawn(x, y, z, heading) {
        var self = this;
        if (self._spawns.length == 0) {
            self._blip = mp.blips.new(40, new mp.Vector3(x, y, z), {
                color: self._color_blip,
                shortRange: true,
                scale: 0.8,
                alpha: 200,
                name: self._team_name
            });

            //self._blip.setSecondaryColour(self._team_color[0],self._team_color[1],self._team_color[2]);
        }
        self._spawns.push({
            vector: new mp.Vector3(x, y, z),
            heading: heading
        })
    }
    getSpawns() {
        return this._spawns;
    }
    spawnVehicle(hash, player) {
        var self = this;
        let spoint = self._vehSpawns[Math.floor(Math.random() * self._vehSpawns.length)];
        let veh = mp.vehicles.new(mp.joaat(hash), spoint.vector, {
            heading: spoint.rotation.z,
            alpha: 255,
            locked: false,
            engine: true,
            dimension: 0
        });
        console.log(self.name.split(" ")[0])
        veh.numberPlate = self.name;
        veh.setColorRGB(self.teamcolor[0], self.teamcolor[1], self.teamcolor[2], self.teamcolor[0], self.teamcolor[1], self.teamcolor[2]);
        player.putIntoVehicle(veh, -1);
        player.call("Player:Collision", [false]);
        setTimeout(function() {
            if (player) {
                player.call("Player:Collision", [true]);
            }
        }, 5000)
    }
    getVehicles() {
        return this._vehicles;
    }
    addVehicle(name, hash, price) {
        this._vehicles.push({
            name: name,
            hash: hash,
            price: price
        })
    }
    addVehicleSpawn(x, y, z, rx, ry, rz) {
        this._vehSpawns.push({
            vector: new mp.Vector3(x, y, z),
            rotation: new mp.Vector3(rx, ry, rz)
        })
    }
    addVehicleRequest(x, y, z) {
        let marker = mp.markers.new(30, new mp.Vector3(x, y, z), 0.8, {
            direction: 0,
            rotation: 0,
            color: this._team_color,
            visible: true,
            dimension: 0
        });
        let blip_marker = mp.blips.new(225, new mp.Vector3(x, y, z), {
            color: this._color_blip,
            shortRange: true,
            scale: 0.6,
            alpha: 200,
            name: "Vehicle Spawner"
        });
        let sphere = mp.colshapes.newSphere(x, y, z, 3);
        this._vehRequestPoints.push({
            marker: marker,
            blip: blip_marker,
            sphere: sphere
        })
    }
    isVehicleSphere(sphere) {
        var self = this;
        let is = false;
        self._vehRequestPoints.forEach(function(req_area) {
            if (req_area.sphere == sphere) {
                is = true;
            }
        })
        return is;
    }
}
let Team0 = new Teams(0, "Grove Family", 2, [0, 255, 0, 150])
Team0.addSkin("g_m_y_famca_01")
Team0.addSkin("mp_m_famdd_01")
Team0.addSkin("g_m_y_famdnf_01")
Team0.addSkin("g_m_y_famfor_01")
Team0.addSkin("g_f_y_families_01")
Team0.addSpawn(116.59832000732422, -1949.697509765625, 20.735055923461914, 44.79591369628906)
Team0.addSpawn(115.71552276611328, -1951.604736328125, 20.75131607055664, 45.07765579223633)
Team0.addSpawn(118.21424102783203, -1948.7218017578125, 20.75132179260254, 53.0471076965332)
Team0.addSpawn(116.22909545898438, -1947.9951171875, 20.663249969482422, 63.54594039916992)
Team0.addSpawn(114.29813385009766, -1949.2603759765625, 20.62253189086914, 49.742000579833984)
Team0.addSpawn(113.84412384033203, -1953.78076171875, 20.74776840209961, 41.83926773071289)
Team0.addSpawn(117.85425567626953, -1949.6688232421875, 20.751346588134766, 61.307186126708984)
Team0.addSpawn(117.58488464355469, -1947.97021484375, 20.724506378173828, 56.90988540649414)
Team0.setTeamPreview({
    spawn: new mp.Vector3(124.32235717773438, -1929.8084716796875, 21.382474899291992),
    heading: 118.17200469970703,
    cam: new mp.Vector3(120.8061294555664, -1933.76611328125, 22.041791915893555)
})
Team0.addVehicleRequest(102.70580291748047, -1957.9132080078125, 20.74250030517578)
Team0.addVehicleSpawn(95.28962707519531, -1946.3494873046875, 20.371864318847656, -1.261785864830017, 2.1300737857818604, 27.786224365234375)
Team0.addVehicleSpawn(90.0562744140625, -1936.45361328125, 20.364835739135742, -1.3696986436843872, 2.166205644607544, 33.6043701171875)
Team0.addVehicleSpawn(102.11577606201172, -1927.5953369140625, 20.356220245361328, 2.138760566711426, -0.2594470679759979, 76.32766723632812)
Team0.addVehicleSpawn(111.1279067993164, -1930.6558837890625, 20.358156204223633, 2.185952663421631, -1.5344860553741455, 56.92333984375)
Team0.addVehicleSpawn(111.43936920166016, -1936.784423828125, 20.509254455566406, 0.48685598373413086, -0.8640323281288147, 48.18731689453125)
Team0.addVehicleSpawn(92.34866333007812, -1962.9906005859375, 20.47746467590332, 0.6947620511054993, -0.25000229477882385, 318.49432373046875)
Team0.addVehicleSpawn(76.25228881835938, -1922.3455810546875, 20.61853790283203, -3.4441983699798584, -0.2938590347766876, 49.479644775390625)
let Team1 = new Teams(1, "Ballas Family", 27, [202, 63, 244, 150])
Team1.addSkin("g_m_y_ballaeast_01")
Team1.addSkin("g_m_y_ballaorig_01")
Team1.addSkin("g_f_y_ballas_01")
Team1.addSkin("ig_ballasog")
Team1.addSkin("csb_ballasog")
Team1.addSkin("csb_ballasog")
Team1.addSkin("g_m_y_ballasout_01")
Team1.addSpawn(-217.9830780029297, -1616.106689453125, 34.869319915771484, 351.969482421875)
Team1.addSpawn(-219.01551818847656, -1614.0367431640625, 34.86933517456055, 351.2758483886719)
Team1.addSpawn(-215.1938934326172, -1614.4140625, 34.86933517456055, 345.0415344238281)
Team1.addSpawn(-215.9968719482422, -1612.5203857421875, 34.86933517456055, 343.18145751953125)
Team1.addSpawn(-217.09872436523438, -1610.8309326171875, 34.86933517456055, 345.8436279296875)
Team1.addSpawn(-219.91355895996094, -1609.6060791015625, 34.86933517456055, 349.6305847167969)
Team1.addSpawn(-214.17787170410156, -1610.208251953125, 34.86933517456055, 342.8190612792969)
Team1.addSpawn(-218.8954315185547, -1612.4398193359375, 34.86933517456055, 340.74249267578125)
Team1.addSpawn(-217.41026306152344, -1613.322509765625, 34.86933517456055, 333.043212890625)
Team1.addSpawn(-215.8159637451172, -1613.7760009765625, 34.86933517456055, 333.0245666503906)
Team1.addSpawn(-214.33982849121094, -1613.0191650390625, 34.86964797973633, 340.31134033203125)
Team1.addSpawn(-215.85830688476562, -1614.445556640625, 34.869346618652344, 338.6845397949219)
Team1.addSpawn(-218.4362335205078, -1613.782958984375, 34.869384765625, 329.37542724609375)
Team1.addSpawn(-219.36721801757812, -1614.6116943359375, 34.869354248046875, 10.610732078552246)
Team1.setTeamPreview({
    spawn: new mp.Vector3(-222.347412109375, -1600.977294921875, 38.054443359375),
    heading: 264.8731994628906,
    cam: new mp.Vector3(-216.51866149902344, -1600.869384765625, 39.959999084472656)
})
Team1.addVehicleRequest(-211.0395965576172, -1606.91357421875, 34.86930465698242)
Team1.addVehicleSpawn(-185.8209228515625, -1599.5672607421875, 33.78681564331055, -2.0540623664855957, 0.18778471648693085, 162.78204345703125)
Team1.addVehicleSpawn(-187.12034606933594, -1605.9044189453125, 33.56795120239258, -1.8736238479614258, 1.626427412033081, 167.065673828125)
Team1.addVehicleSpawn(-188.3369140625, -1613.4022216796875, 33.31761169433594, -1.3854931592941284, 1.1934242248535156, 181.7303009033203)
Team1.addVehicleSpawn(-188.4014892578125, -1620.69921875, 33.10496139526367, -4.2980265617370605, 1.6761970520019531, 181.46954345703125)
Team1.addVehicleSpawn(-200.0098876953125, -1633.4473876953125, 33.184288024902344, -5.503805160522461, -3.6128244400024414, 271.9508361816406)
Team1.addVehicleSpawn(-199.25469970703125, -1636.91943359375, 33.12013626098633, 2.4944307804107666, -2.207763910293579, 272.4095458984375)
Team1.addVehicleSpawn(-184.47225952148438, -1591.9501953125, 34.09882736206055, -2.991912364959717, 0.5158155560493469, 199.7707977294922)
Team1.addVehicleSpawn(-177.86021423339844, -1607.3231201171875, 33.26784133911133, -3.568424701690674, -3.9231526851654053, 165.2388916015625)
Team1.addVehicleSpawn(-178.3974151611328, -1614.31494140625, 33.01579284667969, -1.938744306564331, -3.144310474395752, 177.22784423828125)
Team1.addVehicleSpawn(-178.34759521484375, -1621.574462890625, 32.83185577392578, -0.817544162273407, -1.2111037969589233, 180.7987060546875)
Team1.addVehicleSpawn(-178.30029296875, -1629.6900634765625, 32.74848937988281, -0.5672088861465454, -2.2719297409057617, 181.73040771484375)
Team1.addVehicleSpawn(-178.72483825683594, -1638.890380859375, 32.775875091552734, -0.2034439593553543, -4.659687042236328, 177.678955078125)
Team1.addVehicleSpawn(-178.67738342285156, -1645.6328125, 32.768829345703125, -0.4374789595603943, -4.511752605438232, 176.2677001953125)
Team0.addVehicle("Rhino", "rhino", 25000)
Team1.addVehicle("Rhino", "rhino", 25000)
Team0.addVehicle("Bati", "bati", 150)
Team1.addVehicle("Bati", "bati", 150)
Team0.addVehicle("Cheburek", "cheburek", 150)
Team1.addVehicle("Cheburek", "cheburek", 150)
module.exports = [Team0, Team1]