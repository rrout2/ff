"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RosterTier = void 0;
exports.useRosterTierAndPosGrades = useRosterTierAndPosGrades;
var react_1 = require("react");
var fantasy_1 = require("../../../../consts/fantasy");
var hooks_1 = require("../../../../hooks/hooks");
var PositionalGrades_1 = require("../../v1/modules/PositionalGrades/PositionalGrades");
var RosterTier_module_css_1 = require("./RosterTier.module.css");
function getTierColor(tier) {
    switch (tier) {
        case RosterTier.Rebuild:
            return '#ee2924';
        case RosterTier.Reload:
            return '#f15a29';
        case RosterTier.Competitive:
            return '#f1bb1f';
        case RosterTier.Championship:
            return '#8dc63f';
        case RosterTier.Elite:
            return '#009444';
        default:
            return '#000000';
    }
}
var RosterTier;
(function (RosterTier) {
    RosterTier["Unknown"] = "UNKNOWN";
    RosterTier["Rebuild"] = "REBUILD";
    RosterTier["Reload"] = "RELOAD";
    RosterTier["Competitive"] = "COMPETITIVE";
    RosterTier["Championship"] = "CHAMPIONSHIP";
    RosterTier["Elite"] = "ELITE";
})(RosterTier || (exports.RosterTier = RosterTier = {}));
function useRosterTierAndPosGrades(isSuperFlex, leagueSize, roster) {
    var getPlayerValue = (0, hooks_1.usePlayerValues)().getPlayerValue;
    var playerData = (0, hooks_1.usePlayerData)();
    var _a = (0, react_1.useState)(RosterTier.Unknown), tier = _a[0], setTier = _a[1];
    var _b = (0, react_1.useState)(-1), qbGrade = _b[0], setQbGrade = _b[1];
    var _c = (0, react_1.useState)(-1), rbGrade = _c[0], setRbGrade = _c[1];
    var _d = (0, react_1.useState)(-1), wrGrade = _d[0], setWrGrade = _d[1];
    var _e = (0, react_1.useState)(-1), teGrade = _e[0], setTeGrade = _e[1];
    (0, react_1.useEffect)(function () {
        if (!playerData || !roster || !leagueSize)
            return;
        setQbGrade((0, PositionalGrades_1.gradeByPosition)(fantasy_1.QB, getPlayerValue, isSuperFlex, leagueSize, playerData, roster));
        setRbGrade((0, PositionalGrades_1.gradeByPosition)(fantasy_1.RB, getPlayerValue, isSuperFlex, leagueSize, playerData, roster));
        setWrGrade((0, PositionalGrades_1.gradeByPosition)(fantasy_1.WR, getPlayerValue, isSuperFlex, leagueSize, playerData, roster));
        setTeGrade((0, PositionalGrades_1.gradeByPosition)(fantasy_1.TE, getPlayerValue, isSuperFlex, leagueSize, playerData, roster));
    }, [
        isSuperFlex,
        leagueSize,
        getPlayerValue,
        playerData,
        roster,
        PositionalGrades_1.gradeByPosition,
    ]);
    function calculateRosterTier() {
        var rosterGrade = (qbGrade + teGrade + wrGrade + rbGrade) / 4;
        if (rosterGrade < 4) {
            return RosterTier.Rebuild;
        }
        if (rosterGrade < 5) {
            return RosterTier.Reload;
        }
        if (rosterGrade < 6.5) {
            return RosterTier.Competitive;
        }
        if (rosterGrade < 8.5) {
            return RosterTier.Championship;
        }
        return RosterTier.Elite;
    }
    (0, react_1.useEffect)(function () {
        if (qbGrade === -1 ||
            teGrade === -1 ||
            wrGrade === -1 ||
            rbGrade === -1) {
            return;
        }
        setTier(calculateRosterTier());
    }, [qbGrade, teGrade, wrGrade, rbGrade]);
    return { tier: tier, qbGrade: qbGrade, rbGrade: rbGrade, wrGrade: wrGrade, teGrade: teGrade };
}
var RosterTierComponent = function (_a) {
    var isSuperFlex = _a.isSuperFlex, leagueSize = _a.leagueSize, roster = _a.roster;
    var tier = useRosterTierAndPosGrades(isSuperFlex, leagueSize, roster).tier;
    return (<div className={RosterTier_module_css_1.default.rosterTier} style={{ color: getTierColor(tier) }}>
            {tier}
        </div>);
};
exports.default = RosterTierComponent;
