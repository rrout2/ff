"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerBar;
var react_1 = require("react");
var PlayerBar_module_css_1 = require("./PlayerBar.module.css");
var hooks_1 = require("../../../../hooks/hooks");
var Utilities_1 = require("../../shared/Utilities");
var images_1 = require("../../../../consts/images");
var NONE_PLAYER_ID = 'None';
function PlayerBar(_a) {
    var playerId = _a.playerId;
    var playerData = (0, hooks_1.usePlayerData)();
    if (!playerData) {
        return <></>;
    }
    var player = playerData[playerId];
    if (!player) {
        console.warn("Unexpected player ID: '".concat(playerId, "'"));
        return <></>;
    }
    var pos = player === null || player === void 0 ? void 0 : player.position;
    var fullName = "".concat(player.first_name, " ").concat(player.last_name);
    var longNameLimit = 15;
    var displayName = fullName.length >= longNameLimit
        ? "".concat(player.first_name[0], ". ").concat(player.last_name)
        : fullName;
    return (<div className={PlayerBar_module_css_1.default.playerBar}>
            <img src={player.player_id === NONE_PLAYER_ID
            ? images_1.nflSilhouette
            : "https://sleepercdn.com/content/nfl/players/".concat(player.player_id, ".jpg")} onError={function (_a) {
            var currentTarget = _a.currentTarget;
            currentTarget.onerror = null;
            currentTarget.src =
                'https://sleepercdn.com/images/v2/icons/player_default.webp';
        }} className={PlayerBar_module_css_1.default.headshot}/>
            <div className={PlayerBar_module_css_1.default.playerInfo}>
                <div className={PlayerBar_module_css_1.default.name}>{displayName}</div>
                <div className={PlayerBar_module_css_1.default.positionAndTeam}>
                    <div className={"".concat(PlayerBar_module_css_1.default.positionChip, " ").concat(PlayerBar_module_css_1.default[pos])}>
                        {pos}
                    </div>
                    <div className={PlayerBar_module_css_1.default.team}>
                        {mapCityAbbreviationToFullName(player.team)}
                    </div>
                </div>
            </div>
            {(0, Utilities_1.logoImage)(player.team, PlayerBar_module_css_1.default.teamLogo)}
        </div>);
}
function mapCityAbbreviationToFullName(cityAbbreviation) {
    switch (cityAbbreviation === null || cityAbbreviation === void 0 ? void 0 : cityAbbreviation.toUpperCase()) {
        case 'ARI':
            return 'ARIZONA';
        case 'ATL':
            return 'ATLANTA';
        case 'BAL':
            return 'BALTIMORE';
        case 'BUF':
            return 'BUFFALO';
        case 'CAR':
            return 'CAROLINA';
        case 'CHI':
            return 'CHICAGO';
        case 'CIN':
            return 'CINCINNATI';
        case 'CLE':
            return 'CLEVELAND';
        case 'DAL':
            return 'DALLAS';
        case 'DEN':
            return 'DENVER';
        case 'DET':
            return 'DETROIT';
        case 'GB':
            return 'GREEN BAY';
        case 'HOU':
            return 'HOUSTON';
        case 'IND':
            return 'INDIANAPOLIS';
        case 'JAC':
        case 'JAX':
            return 'JACKSONVILLE';
        case 'KC':
            return 'KANSAS CITY';
        case 'LAC':
            return 'LA CHARGERS';
        case 'LAR':
            return 'LA RAMS';
        case 'MIA':
            return 'MIAMI';
        case 'MIN':
            return 'MINNESOTA';
        case 'NE':
            return 'NEW ENGLAND';
        case 'NO':
            return 'NEW ORLEANS';
        case 'NYG':
            return 'NY GIANTS';
        case 'NYJ':
            return 'NY JETS';
        case 'PHI':
            return 'PHILADELPHIA';
        case 'PIT':
            return 'PITTSBURGH';
        case 'LV':
            return 'LAS VEGAS';
        case 'SF':
            return 'SAN FRANCISCO';
        case 'SEA':
            return 'SEATTLE';
        case 'TB':
            return 'TAMPA BAY';
        case 'TEN':
            return 'TENNESSEE';
        case 'WSH':
        case 'WAS':
            return 'WASHINGTON';
        default:
            return (cityAbbreviation === null || cityAbbreviation === void 0 ? void 0 : cityAbbreviation.toUpperCase()) || '';
    }
}
