let enum_count = 1;
var enums = {
	LOGIN_OK:enum_count++,
	LOGIN_FAILED:enum_count++,
	LOGIN_PASSWORD_WRONG:enum_count++,
	LOGIN_NOT_FOUND:enum_count++,
    REGISTERED_OK:enum_count++,
    REGISTERED_FAILED:enum_count++,
    REGISTERED_PASSWORD_WRONG:enum_count++,
    REGISTERED_ACCOUNT_EXISTS:enum_count++,
    KILLED:enum_count++,
    KILL:enum_count++,
    LOBBY_JOIN_SUCCESS:enum_count++,
    LOBBY_JOIN_FAIL_FULL:enum_count++,
    LOBBY_JOIN_FAIL_TEAM_INVALID:enum_count++,
    LOBBY_PLAYER_NOT_FOUND:enum_count++,
}
Object.keys(enums).forEach(function(key, value) {
	global[key] = enums[key];
})
module.exports = enums;