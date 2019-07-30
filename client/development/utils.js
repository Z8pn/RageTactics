mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let degrees = (rz + rot) * (Math.PI / 180);
    nVector.x = this.x + dist * Math.cos(degrees);
    nVector.y = this.y + dist * Math.sin(degrees);
    return nVector;
}
mp.Vector3.prototype.rotPoint = function(pos) {
    let temp = new mp.Vector3(this.x, this.y, this.z);
    let temp1 = new mp.Vector3(pos.x, pos.y, pos.z);
    let gegenkathete = temp1.z - temp.z
    let a = temp.x - temp1.x;
    let b = temp.y - temp1.y;
    let ankathete = Math.sqrt(a * a + b * b);
    let winkel = Math.atan2(gegenkathete, ankathete) * 180 / Math.PI
    return winkel;
}
mp.Vector3.prototype.toPixels = function() {
    let clientScreen = mp.game.graphics.getScreenActiveResolution(0, 0);
    let toScreen = mp.game.graphics.world3dToScreen2d(new mp.Vector3(pos.x, pos.y, pos.z)) || {
        x: 0,
        y: 0
    };
    return {
        x: Math.floor(clientScreen.x * toScreen.x) + "px",
        y: Math.floor(clientScreen.y * toScreen.y) + "px"
    };
}
mp.Vector3.prototype.lerp = function(vector2, deltaTime) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x + (vector2.x - this.x) * deltaTime
    nVector.y = this.y + (vector2.y - this.y) * deltaTime
    nVector.z = this.z + (vector2.z - this.z) * deltaTime
    return nVector;
}
mp.Vector3.prototype.multiply = function(n) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = this.x * n;
    nVector.y = this.y * n;
    nVector.z = this.z * n;
    return nVector;
}
mp.Vector3.prototype.dist = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    let c = this.z - to.z;
    return Math.sqrt(a * a + b * b + c * c);;
}
mp.Vector3.prototype.quad = function() {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    nVector.x = Math.sign(this.x) * this.x * this.x;
    nVector.y = Math.sign(this.y) * this.y * this.y;
    nVector.z = Math.sign(this.z) * this.z * this.z;
    return nVector;
}


mp.Vector3.prototype.dist2d = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    return Math.sqrt(a * a + b * b);
}
mp.Vector3.prototype.getOffset = function(to) {
    let x = this.x - to.x;
    let y = this.y - to.y;
    let z = this.z - to.z;
    return new mp.Vector3(x, y, z);
}
mp.Vector3.prototype.cross = function(to) {
    let vector = new mp.Vector3(0, 0, 0);
    vector.x = this.y * to.z - this.z * to.y;
    vector.y = this.z * to.x - this.x * to.z;
    vector.z = this.x * to.y - this.y * to.x;
    return vector;
}
mp.Vector3.prototype.normalize = function() {
    let vector = new mp.Vector3(0, 0, 0);
    let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    vector.x = this.x / mag;
    vector.y = this.y / mag;
    vector.z = this.z / mag;
    return vector;
}
mp.Vector3.prototype.dot = function(to) {
    return this.x * to.x + this.y * to.y + this.z * to.z;
}
mp.Vector3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
mp.Vector3.prototype.angle = function(to) {
    return Math.acos(this.normalize().dot(to.normalize()));
}
mp.Vector3.prototype.ground = function() {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let z = mp.game.gameplay.getGroundZFor3dCoord(nVector.x, nVector.y, nVector.z, 0, false)
    let z1 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x + 0.01, nVector.y + 0.01, nVector.z, 0, false)
    let z2 = mp.game.gameplay.getGroundZFor3dCoord(nVector.x - 0.01, nVector.y - 0.01, nVector.z, 0, false)
    nVector.z = z;
    if ((z + 0.1 < z1) || (z + 0.1 < z2)) {
        if (z1 < z2) {
            nVector.z = z2;
        } else {
            nVector.z = z1;
        }
    }
    return nVector;
}
mp.Vector3.prototype.ground2 = function(ignore) {
    let nVector = new mp.Vector3(this.x, this.y, this.z);
    let r = mp.raycasting.testPointToPoint(nVector.add(0, 0, 1), nVector.sub(0, 0, 100), ignore.handle, (1 | 16));
    if ((r) && (r.position)) {
        nVector = mp.vector(r.position);
    }
    return nVector;
}
mp.Vector3.prototype.sub = function(x, y, z) {
    return new mp.Vector3(this.x - x, this.y - y, this.z - z);
};
mp.Vector3.prototype.add = function(x, y, z) {
    return new mp.Vector3(this.x + x, this.y + y, this.z + z);
};
mp.Vector3.prototype.insidePolygon = function(polygon) {
    let x = this.x,
        y = this.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
            yi = polygon[i][1];
        let xj = polygon[j][0],
            yj = polygon[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
mp.vector = function(vec) {
    return new mp.Vector3(vec.x, vec.y, vec.z);
}
Array.prototype.shuffle = function() {
    let i = this.length;
    while (i) {
        let j = Math.floor(Math.random() * i);
        let t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}
mp.isValid = function(val) {
    return val != null && val != undefined && val != "";
}
mp.lerp = function(a, b, n) {
    return (1 - n) * a + n * b;
}




mp.game.graphics.drawSpriteAbsolute = function(textureDict, textureName, screenX, screenY, scaleX, scaleY, heading, colorR, colorG, colorB, alpha) {
    //2560x1440
    scaleX = 1.0 / 2560 * scaleX;
    scaleY = 1.0 / 1440 * scaleY;
    return mp.game.graphics.drawSprite(textureDict, textureName, screenX, screenY, scaleX, scaleY, heading, colorR, colorG, colorB, alpha);
}

mp.game.graphics.getMinimapAnchor = () => {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;
    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };
    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}