"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PlayerTarget = PlayerTarget;
exports.isRookiePickId = isRookiePickId;
exports.rookiePickIdToString = rookiePickIdToString;
exports.PlayersToTargetModule = PlayersToTargetModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var PlayersToTargetModule_module_css_1 = require("./PlayersToTargetModule.module.css");
var ExportButton_1 = require("../../../shared/ExportButton");
var hooks_1 = require("../../../../../hooks/hooks");
var Utilities_1 = require("../../../shared/Utilities");
var material_1 = require("@mui/material");
var react_1 = require("react");
var PlayerSearch_1 = require("../../../../Player/Search/PlayerSearch");
function PlayersToTargetModule(props) {
    var teamName = props.teamName, graphicComponentClass = props.graphicComponentClass;
    var _a = (0, react_1.useState)([
        '10229',
        '5849',
        '4866',
        '10859',
    ]), playerSuggestions = _a[0], setPlayerSuggestions = _a[1];
    return (<div style={{ display: 'flex', flexDirection: 'column' }}>
            <GraphicComponent playerSuggestions={playerSuggestions} graphicComponentClass={graphicComponentClass} transparent={false}/>
            <InputComponent playerSuggestions={playerSuggestions} setPlayerSuggestions={setPlayerSuggestions}/>
            {!graphicComponentClass && (<ExportButton_1.default className={PlayersToTargetModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_playerstotarget.png")}/>)}
        </div>);
}
function PlayerTarget(_a) {
    var playerId = _a.playerId, smaller = _a.smaller;
    var playerData = (0, hooks_1.usePlayerData)();
    if (!playerData) {
        return <></>;
    }
    var isRookiePick = isRookiePickId(playerId);
    var player = playerData[playerId];
    if (!player && !isRookiePick) {
        throw new Error("Unexpected player ID: '".concat(playerId, "'"));
    }
    var pos = isRookiePick ? 'RP' : player.position;
    var fullName = isRookiePick
        ? rookiePickIdToString(playerId)
        : "".concat(player.first_name, " ").concat(player.last_name);
    var longNameLimit = smaller ? 14 : 15;
    var displayName = !isRookiePick && fullName.length >= longNameLimit
        ? "".concat(player.first_name[0], ". ").concat(player.last_name)
        : fullName;
    return (<div>
            <div className={PlayersToTargetModule_module_css_1.default.playerTargetBody}>
                <div className={"".concat(smaller
            ? PlayersToTargetModule_module_css_1.default.positionChipSmaller
            : PlayersToTargetModule_module_css_1.default.positionChip, " ").concat(PlayersToTargetModule_module_css_1.default[pos])}>
                    {pos}
                </div>
                {(0, Utilities_1.logoImage)(isRookiePick ? 'RP' : player === null || player === void 0 ? void 0 : player.team, smaller ? PlayersToTargetModule_module_css_1.default.teamLogoSmaller : PlayersToTargetModule_module_css_1.default.teamLogo)}
                <div className={smaller ? PlayersToTargetModule_module_css_1.default.targetNameSmaller : PlayersToTargetModule_module_css_1.default.targetName}>
                    {displayName}
                </div>
            </div>
            <div className={smaller ? PlayersToTargetModule_module_css_1.default.subtitleSmaller : PlayersToTargetModule_module_css_1.default.subtitle}>{"".concat(pos, " - ").concat(isRookiePick
            ? playerId.substring(playerId.length - 4) // pull year from ID
            : player.team)}</div>
        </div>);
}
function GraphicComponent(_a) {
    var playerSuggestions = _a.playerSuggestions, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent;
    var playerData = (0, hooks_1.usePlayerData)();
    function graphicComponent() {
        if (!playerData)
            return <></>;
        return (<div className={"".concat(PlayersToTargetModule_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : PlayersToTargetModule_module_css_1.default.background)}>
                {playerSuggestions.map(function (playerId, idx) { return (<div key={idx}>
                        <PlayerTarget playerId={playerId}/>
                    </div>); })}
            </div>);
    }
    return graphicComponent();
}
function InputComponent(_a) {
    var playerSuggestions = _a.playerSuggestions, setPlayerSuggestions = _a.setPlayerSuggestions, label = _a.label, styles = _a.styles;
    var inputStateList = playerSuggestions.map(function (suggestionId) {
        return (0, react_1.useState)(suggestionId);
    });
    var playerData = (0, hooks_1.usePlayerData)();
    var _b = (0, react_1.useState)([]), allPlayers = _b[0], setAllPlayers = _b[1];
    (0, react_1.useEffect)(function () {
        var players = [];
        for (var playerId in playerData) {
            var player = playerData[playerId];
            players.push(player);
        }
        setAllPlayers(players);
    }, [playerData]);
    function playerAutocomplete(idx) {
        if (!playerData)
            return <></>;
        var opts = allPlayers
            .filter(function (p) { return !!p.team; })
            .sort(PlayerSearch_1.sortBySearchRank)
            .map(function (p) { return p.player_id; });
        opts.push('RP-2025');
        opts.push('RP-2026');
        opts.push('RP-FIRST-2025');
        opts.push('RP-FIRST-2026');
        var _a = inputStateList[idx], inputValue = _a[0], setInputValue = _a[1];
        return (<material_1.FormControl style={__assign({ margin: '4px' }, styles)}>
                <material_1.Autocomplete options={opts} getOptionLabel={function (option) {
                if (isRookiePickId(option)) {
                    return rookiePickIdToString(option);
                }
                var p = playerData[option];
                return "".concat(p.first_name, " ").concat(p.last_name);
            }} autoHighlight value={playerSuggestions[idx]} onChange={function (_event, newInputValue, reason) {
                if (reason === 'clear' || newInputValue === null) {
                    return;
                }
                var newPlayerSuggestions = __spreadArray([], playerSuggestions, true);
                newPlayerSuggestions[idx] = newInputValue;
                setPlayerSuggestions(newPlayerSuggestions);
            }} inputValue={inputValue} onInputChange={function (_event, value, _reason) {
                setInputValue(value);
            }} renderInput={function (params) { return (<material_1.TextField {...params} label={label !== null && label !== void 0 ? label : 'Choose a Player'}/>); }}/>
            </material_1.FormControl>);
    }
    return (<>
            {playerSuggestions.map(function (_, idx) { return (<react_1.Fragment key={idx}>{playerAutocomplete(idx)}</react_1.Fragment>); })}
        </>);
}
function isRookiePickId(id) {
    return (id.substring(0, 3) === 'RP-' ||
        id.includes('Rookie Pick') ||
        id.includes(' 1st'));
}
function rookiePickIdToString(rookiePickId) {
    if (!isRookiePickId(rookiePickId)) {
        throw new Error("Expected rookie pick ID to begin with 'RP-', instead got '".concat(rookiePickId, "'"));
    }
    if (rookiePickId.substring(3, 9) === 'FIRST-') {
        return "".concat(rookiePickId.substring(9), " 1sts");
    }
    return "".concat(rookiePickId.substring(3), " Rookie Picks");
}
