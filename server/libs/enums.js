var enums = {
	LOGIN_OK:1,
	LOGIN_FAILED:2,
	LOGIN_PASSWORD_WRONG:3,
	LOGIN_NOT_FOUND:6,
    REGISTERED_OK:4,
    REGISTERED_FAILED:5,
    REGISTERED_PASSWORD_WRONG:6,
    REGISTERED_ACCOUNT_EXISTS:7,
    KILLED:8,
    KILL:9
}
Object.keys(enums).forEach(function(key, value) {
	global[key] = enums[key];
})
module.exports = enums;