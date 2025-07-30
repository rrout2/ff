"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartersModule = StartersModule;
exports.StartersGraphic = StartersGraphic;
exports.InputComponent = InputComponent;
var Starters_module_css_1 = require("./Starters.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var ExportButton_1 = require("../../../shared/ExportButton");
var Utilities_1 = require("../../../shared/Utilities");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var fantasy_1 = require("../../../../../consts/fantasy");
var images_1 = require("../../../../../consts/images");
function StartersModule(props) {
    var roster = props.roster, teamName = props.teamName, graphicComponentClass = props.graphicComponentClass;
    (0, hooks_1.useTitle)('Starters - Blueprint Generator');
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var rosterSettings = (0, hooks_1.useRosterSettingsFromId)(leagueId);
    var _a = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _a.startingLineup, setStartingLineup = _a.setStartingLineup;
    return (<>
            {!graphicComponentClass && (<ExportButton_1.default className={Starters_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_starters.png")}/>)}
            <InputComponent startingLineup={startingLineup} setStartingLineup={setStartingLineup} roster={roster}/>
            <StartersGraphic startingLineup={startingLineup} transparent={false} graphicComponentClass={graphicComponentClass}/>
        </>);
}
function InputComponent(props) {
    var startingLineup = props.startingLineup, setStartingLineup = props.setStartingLineup, roster = props.roster;
    var playerData = (0, hooks_1.usePlayerData)();
    if (!playerData)
        return <></>;
    function isPlayerInPosition(player, position) {
        switch (position) {
            case fantasy_1.WR_RB_FLEX:
                return player.position === fantasy_1.WR || player.position === fantasy_1.RB;
            case fantasy_1.WR_TE_FLEX:
                return player.position === fantasy_1.WR || player.position === fantasy_1.TE;
            case fantasy_1.FLEX:
                return fantasy_1.FLEX_SET.has(player.position);
            case fantasy_1.SUPER_FLEX:
                return fantasy_1.SUPER_FLEX_SET.has(player.position);
            default:
                return !!player && player.position === position;
        }
    }
    return (<>
            {startingLineup.map(function (_a, idx) {
            var _b;
            var player = _a.player, position = _a.position;
            return (<PlayerSelectComponent_1.default key={idx} playerIds={((_b = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _b !== void 0 ? _b : [])
                    .map(function (p) { return playerData[p]; })
                    .filter(function (p) { return !!p; })
                    .filter(function (p) { return isPlayerInPosition(p, position); })
                    .map(function (p) { return p.player_id; })} selectedPlayerIds={[player.player_id]} onChange={function (_a) {
                    var newPlayerId = _a[0];
                    setStartingLineup(function (oldLineup) {
                        var newLineup = __spreadArray([], oldLineup, true);
                        newLineup[idx] = {
                            player: playerData[newPlayerId],
                            position: position,
                        };
                        return newLineup;
                    });
                }} multiple={false} maxSelections={1} label={position}/>);
        })}
        </>);
}
function StartersGraphic(props) {
    var startingLineup = props.startingLineup, transparent = props.transparent, graphicComponentClass = props.graphicComponentClass, infinite = props.infinite;
    var getVerdict = (0, hooks_1.useBuySellData)().getVerdict;
    function playerTarget(player, position, idx) {
        var _a;
        var diplayPosition = position;
        if (position === 'WRRB_FLEX' || position === 'REC_FLEX') {
            diplayPosition = 'FLEX';
        }
        if (position === 'SUPER_FLEX') {
            diplayPosition = 'SF';
        }
        var fullName = "".concat(player.first_name, " ").concat(player.last_name);
        var displayName = fullName.length >= 19
            ? "".concat(player.first_name[0], ". ").concat(player.last_name)
            : fullName;
        var team = (_a = player.team) !== null && _a !== void 0 ? _a : 'FA';
        return (<div className={Starters_module_css_1.default.playerTargetBody} key={"".concat(player.player_id, " ").concat(idx)}>
                <div className={"".concat(Starters_module_css_1.default.positionChip, " ").concat(Starters_module_css_1.default[diplayPosition])}>
                    {diplayPosition}
                </div>
                {player.player_id && (0, Utilities_1.logoImage)(team, Starters_module_css_1.default.teamLogo)}
                <div className={Starters_module_css_1.default.targetName}>{displayName}</div>
                {!infinite && (<div className={Starters_module_css_1.default.subtitle}>{"".concat(player.position, " - ").concat(team)}</div>)}
                {infinite && player.player_id && (<DifferenceChip verdict={getVerdict(fullName)}/>)}
            </div>);
    }
    return (<div className={"".concat(Starters_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : Starters_module_css_1.default.background)}>
            {startingLineup === null || startingLineup === void 0 ? void 0 : startingLineup.map(function (_a, idx) {
            var player = _a.player, position = _a.position;
            return playerTarget(player, position, idx);
        })}
        </div>);
}
function DifferenceChip(_a) {
    var verdict = _a.verdict;
    var color = 'gray';
    var plusMinus = '';
    if (verdict === null || verdict === void 0 ? void 0 : verdict.verdict.includes('Buy')) {
        color = '#8DC63F';
        plusMinus = '+';
    }
    else if (verdict === null || verdict === void 0 ? void 0 : verdict.verdict.includes('Sell')) {
        color = '#EF4136';
        plusMinus = '-';
    }
    else {
        color = '#F3C01D';
        plusMinus = '=';
    }
    return (<div className={Starters_module_css_1.default.differenceChip} style={{ color: color }}>
            <img src={images_1.domainShield} className={Starters_module_css_1.default.domainShield}/>
            {plusMinus && <div>{plusMinus}</div>}
        </div>);
}
