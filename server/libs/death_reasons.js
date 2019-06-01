function getDeathReason(reason) {
    let msgGroup;
    switch (reason) {
        case mp.joaat("weapon_unarmed"):
        case mp.joaat("weapon_bat"):
        case mp.joaat("weapon_nightstick"):
        case mp.joaat("weapon_hammer"):
        case mp.joaat("weapon_crowbar"):
        case mp.joaat("weapon_golfclub"):
        case mp.joaat("weapon_knuckle"):
        case mp.joaat("weapon_hatchet"):
        case mp.joaat("weapon_poolcue"):
        case mp.joaat("weapon_wrench"):
        case mp.joaat("weapon_flashlight"):
        case mp.joaat("weapon_bottle"):
        case mp.joaat("weapon_battleaxe"):
        case mp.joaat("weapon_machete"):
            msgGroup = "melee";
            break;
        case mp.joaat("weapon_molotov"):
            msgGroup = "molotov";
            break;
        case mp.joaat("weapon_knife"):
        case mp.joaat("weapon_dagger"):
        case mp.joaat("weapon_switchblade"):
            msgGroup = "knife";
            break;
        case mp.joaat("weapon_pistol"):
        case mp.joaat("weapon_combatpistol"):
        case mp.joaat("weapon_appistol"):
        case mp.joaat("weapon_snspistol"):
        case mp.joaat("weapon_snspistol_mk2"):
        case mp.joaat("weapon_heavypistol"):
        case mp.joaat("weapon_vintagepistol"):
        case mp.joaat("weapon_marksmanpistol"):
        case mp.joaat("weapon_machinepistol"):
        case mp.joaat("weapon_revolver"):
        case mp.joaat("weapon_revolver_mk2"):
        case mp.joaat("weapon_pistol50"):
        case mp.joaat("weapon_pistol_mk2"):
        case mp.joaat("weapon_doubleaction"):
            msgGroup = "pistol";
            break;
        case mp.joaat("weapon_smg"):
        case mp.joaat("weapon_microsmg"):
        case mp.joaat("weapon_combatpdw"):
        case mp.joaat("weapon_minismg"):
        case mp.joaat("weapon_assaultsmg"):
        case mp.joaat("weapon_gusenberg"):
        case mp.joaat("weapon_smg_mk2"):
            msgGroup = "smg";
            break;
        case mp.joaat("weapon_assaultrifle"):
        case mp.joaat("weapon_carbinerifle"):
        case mp.joaat("weapon_carbinerifle_mk2"):
        case mp.joaat("weapon_advancedrifle"):
        case mp.joaat("weapon_assaultrifle_mk2"):
        case mp.joaat("weapon_specialcarbine"):
        case mp.joaat("weapon_specialcarbine_mk2"):
        case mp.joaat("weapon_bullpuprifle"):
        case mp.joaat("weapon_bullpuprifle_mk2"):
        case mp.joaat("weapon_musket"):
        case mp.joaat("weapon_compactrifle"):
            msgGroup = "rifle";
            break;
        case mp.joaat("weapon_mg"):
        case mp.joaat("weapon_combatmg"):
        case mp.joaat("weapon_combatmg_mk2"):
        case mp.joaat("vehicle_weapon_player_bullet"):
        case mp.joaat("vehicle_weapon_ruiner_bullet"):
        case mp.joaat("vehicle_weapon_cannon_blazer"):
        case mp.joaat("vehicle_weapon_oppressor_mg"):
        case mp.joaat("vehicle_weapon_ardent_mg"):
        case mp.joaat("vehicle_weapon_nightshark_mg"):
        case mp.joaat("vehicle_weapon_microlight_mg"):
        case mp.joaat("vehicle_weapon_tula_nosemg"):
        case mp.joaat("vehicle_weapon_tula_mg"):
        case mp.joaat("vehicle_weapon_tula_dualmg"):
        case mp.joaat("vehicle_weapon_deluxo_mg"):
        case mp.joaat("vehicle_weapon_subcar_mg"):
        case mp.joaat("vehicle_weapon_comet_mg"):
        case mp.joaat("vehicle_weapon_revolter_mg"):
        case mp.joaat("vehicle_weapon_savestra_mg"):
        case mp.joaat("vehicle_weapon_viseris_mg"):
        case mp.joaat("vehicle_weapon_caracara_mg"):
        case mp.joaat("vehicle_weapon_bombushka_dualmg"):
        case mp.joaat("vehicle_weapon_dogfighter_mg"):
        case mp.joaat("vehicle_weapon_mogul_nose"):
        case mp.joaat("vehicle_weapon_mogul_dualnose"):
        case mp.joaat("vehicle_weapon_mogul_turret"):
        case mp.joaat("vehicle_weapon_mogul_dualturret"):
        case mp.joaat("vehicle_weapon_rogue_mg"):
        case mp.joaat("vehicle_weapon_seabreeze_mg"):
        case mp.joaat("vehicle_weapon_vigilante_mg"):
        case mp.joaat("vehicle_weapon_dune_mg"):
            msgGroup = "mg";
            break;
        case mp.joaat("weapon_pumpshotgun"):
        case mp.joaat("weapon_pumpshotgun_mk2"):
        case mp.joaat("weapon_sawnoffshotgun"):
        case mp.joaat("weapon_assaultshotgun"):
        case mp.joaat("weapon_bullpupshotgun"):
        case mp.joaat("weapon_heavyshotgun"):
        case mp.joaat("weapon_dbshotgun"):
        case mp.joaat("weapon_autoshotgun"):
            msgGroup = "shotgun";
            break;
        case mp.joaat("weapon_heavysniper"):
        case mp.joaat("weapon_remotesniper"):
        case mp.joaat("weapon_sniperrifle"):
        case mp.joaat("weapon_marksmanrifle"):
        case mp.joaat("weapon_marksmanrifle_mk2"):
        case mp.joaat("weapon_heavysniper_mk2"):
            msgGroup = "sniper";
            break;
        case mp.joaat("weapon_explosion"):
        case mp.joaat("weapon_grenadelauncher"):
        case mp.joaat("weapon_flaregun"):
        case mp.joaat("weapon_rpg"):
        case mp.joaat("weapon_vehicle_rocket"):
        case mp.joaat("weapon_railgun"):
        case mp.joaat("weapon_firework"):
        case mp.joaat("weapon_hominglauncher"):
        case mp.joaat("weapon_compactlauncher"):
        case mp.joaat("weapon_airstrike_rocket"):
        case mp.joaat("vehicle_weapon_turret_technical"):
        case mp.joaat("vehicle_weapon_space_rocket"):
        case mp.joaat("vehicle_weapon_player_laser"):
        case mp.joaat("vehicle_weapon_player_buzzard"):
        case mp.joaat("weapon_passenger_rocket"):
        case mp.joaat("vehicle_weapon_plane_rocket"):
        case mp.joaat("vehicle_weapon_player_savage"):
        case mp.joaat("vehicle_weapon_tank"):
        case mp.joaat("vehicle_weapon_ruiner_rocket"):
        case mp.joaat("vehicle_weapon_turret_boxville"):
        case mp.joaat("vehicle_weapon_turret_insurgent"):
        case mp.joaat("vehicle_weapon_player_lazer"):
        case mp.joaat("vehicle_weapon_oppressor_missile"):
        case mp.joaat("vehicle_weapon_tampa_missile"):
        case mp.joaat("vehicle_weapon_tampa_mortar"):
        case mp.joaat("vehicle_weapon_akula_turret_single"):
        case mp.joaat("vehicle_weapon_akula_turret_dual"):
        case mp.joaat("vehicle_weapon_akula_missile"):
        case mp.joaat("vehicle_weapon_akula_barrage"):
        case mp.joaat("vehicle_weapon_avenger_cannon"):
        case mp.joaat("vehicle_weapon_barrage_top_mg"):
        case mp.joaat("vehicle_weapon_barrage_rear_mg"):
        case mp.joaat("vehicle_weapon_barrage_rear_gl"):
        case mp.joaat("vehicle_weapon_cherno_missile"):
        case mp.joaat("vehicle_weapon_deluxo_missile"):
        case mp.joaat("vehicle_weapon_khanjali_cannon"):
        case mp.joaat("vehicle_weapon_khanjali_cannon_heavy"):
        case mp.joaat("vehicle_weapon_khanjali_mg"):
        case mp.joaat("vehicle_weapon_khanjali_gl"):
        case mp.joaat("vehicle_weapon_subcar_missile"):
        case mp.joaat("vehicle_weapon_subcar_torpedo"):
        case mp.joaat("vehicle_weapon_thruster_missile"):
        case mp.joaat("vehicle_weapon_bomb_standard_wide"):
        case mp.joaat("vehicle_weapon_volatol_dualmg"):
        case mp.joaat("vehicle_weapon_bombushka_cannon"):
        case mp.joaat("vehicle_weapon_dogfighter_missile"):
        case mp.joaat("vehicle_weapon_hunter_mg"):
        case mp.joaat("vehicle_weapon_hunter_missile"):
        case mp.joaat("vehicle_weapon_hunter_barrage"):
        case mp.joaat("vehicle_weapon_hunter_cannon"):
        case mp.joaat("vehicle_weapon_rogue_cannon"):
        case mp.joaat("vehicle_weapon_rogue_missile"):
        case mp.joaat("vehicle_weapon_vigilante_missile"):
        case mp.joaat("vehicle_weapon_nose_turret_valkyrie"):
        case mp.joaat("vehicle_weapon_dune_grenadelauncher"):
        case mp.joaat("vehicle_weapon_halftrack_dualmg"):
        case mp.joaat("vehicle_weapon_halftrack_quadmg"):
        case mp.joaat("vehicle_weapon_apc_cannon"):
        case mp.joaat("vehicle_weapon_apc_missile"):
        case mp.joaat("vehicle_weapon_apc_mg"):
            msgGroup = "heavy";
            break;
        case mp.joaat("weapon_minigun"):
        case mp.joaat("vehicle_weapon_turret_limo"):
        case mp.joaat("vehicle_weapon_tampa_fixedminigun"):
        case mp.joaat("vehicle_weapon_tampa_dualminigun"):
        case mp.joaat("vehicle_weapon_insurgent_minigun"):
        case mp.joaat("vehicle_weapon_technical_minigun"):
        case mp.joaat("vehicle_weapon_havok_minigun"):
        case mp.joaat("vehicle_weapon_tula_minigun"):
        case mp.joaat("vehicle_weapon_akula_minigun"):
        case mp.joaat("vehicle_weapon_barrage_top_minigun"):
        case mp.joaat("vehicle_weapon_barrage_rear_minigun"):
        case mp.joaat("vehicle_weapon_thruster_mg"):
        case mp.joaat("vehicle_weapon_caracara_minigun"):
        case mp.joaat("vehicle_weapon_turret_valkyrie"):
        case mp.joaat("vehicle_weapon_dune_minigun"):
            msgGroup = "minigun";
            break;
        case mp.joaat("weapon_stickybomb"):
        case mp.joaat("weapon_grenade"):
        case mp.joaat("weapon_proxmine"):
        case mp.joaat("weapon_pipebomb"):
            msgGroup = "explosive";
            break;
        case mp.joaat("vehicle_weapon_rotors"):
            msgGroup = "rotor";
            break;
        case mp.joaat("weapon_rammed_by_car"):
        case mp.joaat("weapon_run_over_by_car"):
            msgGroup = "flatten";
            break;
        default:
            msgGroup = "noidea";
    }
    return msgGroup;
}
module.exports = getDeathReason;