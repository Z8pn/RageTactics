mp.Vector3.prototype.findRot = function(rz, dist, rot) {
    var degrees = (rz + rot) * (Math.PI / 180);
    this.x = this.x + dist * Math.cos(degrees);
    this.y = this.y + dist * Math.sin(degrees);
    return this;
}
mp.Vector3.prototype.normalize = function(n) {
    this.x = this.x / n;
    this.y = this.y / n;
    this.z = this.z / n;
    return this;
}
mp.Vector3.prototype.multiply = function(n) {
    this.x = this.x * n;
    this.y = this.y * n;
    this.z = this.z * n;
    return this;
}
mp.Vector3.prototype.dist = function(to) {
    let a = this.x - to.x;
    let b = this.y - to.y;
    let c = this.z - to.z;
    return Math.sqrt(a * a + b * b + c * c);;
}
mp.Vector3.prototype.getOffset = function(to) {
    this.x = this.x - to.x;
    this.y = this.y - to.y;
    this.z = this.z - to.z;
    return new mp.Vector3(x, y, z);
}
mp.Vector3.prototype.ground = function() {
    this.z = mp.game.gameplay.getGroundZFor3dCoord(this.x, this.y, this.z, 0, false)
    return this;
}