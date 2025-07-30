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
exports.LookToTradeModule = LookToTradeModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var LookToTradeModule_module_css_1 = require("./LookToTradeModule.module.css");
var ExportButton_1 = require("../../../shared/ExportButton");
var hooks_1 = require("../../../../../hooks/hooks");
var react_1 = require("react");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var material_1 = require("@mui/material");
var SUGGESTIONS = [
    'Bellcow',
    'Better DC',
    'Certainty',
    'Consistency',
    'Cornerstone Asset',
    'Developmental Asset',
    'Diversify Team Investment',
    'Downtier',
    'Downtier/Rushing QB',
    'Elite TE',
    'Higher Ceiling',
    'Higher Upside',
    'Other Position',
    'Pivot',
    'Proven Asset',
    'QB',
    'RB',
    'Rushing QB',
    'Safer Long Term Asset',
    'Safer Situation',
    'Starting Asset',
    'WR',
    'WR1',
    'WR / RB',
    'Younger Asset',
];
function LookToTradeModule(props) {
    var roster = props.roster, teamName = props.teamName, graphicComponentClass = props.graphicComponentClass;
    var _a = (0, react_1.useState)([
        [],
        [],
        [],
    ]), playersToTrade = _a[0], setPlayersToTrade = _a[1];
    var _b = (0, react_1.useState)([
        'placeholder',
        'placeholder',
        'placeholder',
    ]), inReturn = _b[0], setInReturn = _b[1];
    return (<>
            <div className={LookToTradeModule_module_css_1.default.body}>
                <GraphicComponent playersToTrade={playersToTrade} inReturn={inReturn} graphicComponentClass={graphicComponentClass} transparent={false}/>
                <div className={LookToTradeModule_module_css_1.default.inputComponent}>
                    <InputComponent playersToTrade={playersToTrade} setPlayersToTrade={setPlayersToTrade} inReturn={inReturn} setInReturn={setInReturn} roster={roster}/>
                </div>
            </div>
            {!graphicComponentClass && (<ExportButton_1.default className={LookToTradeModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_looktotrade.png")}/>)}
        </>);
}
var COLORS = ['#3CB6E9', '#EC336D', '#8AC73E'];
function GraphicComponent(_a) {
    var playersToTrade = _a.playersToTrade, inReturn = _a.inReturn, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent;
    var playerData = (0, hooks_1.usePlayerData)();
    if (!playerData)
        return <></>;
    function tradeSuggestion(send, receive, color, idx) {
        return (<div className={LookToTradeModule_module_css_1.default.suggestion} key={idx}>
                <div className={LookToTradeModule_module_css_1.default.send}>
                    <span className={LookToTradeModule_module_css_1.default.whiteBullet}>◦</span>
                    {send}
                </div>
                <div className={LookToTradeModule_module_css_1.default.receive} style={{ backgroundColor: color }}>
                    {receive}
                </div>
            </div>);
    }
    var playerIdReducer = function (acc, currPlayerId, idx, arr) {
        var displayValue;
        if (idx > 0 &&
            currPlayerId.startsWith('Rookie Pick ') &&
            arr[idx - 1].startsWith('Rookie Pick ')) {
            displayValue = currPlayerId.substring('Rookie Pick '.length);
        }
        else {
            var player = playerData[currPlayerId];
            displayValue = !player
                ? currPlayerId
                : "".concat(player.first_name, " ").concat(player.last_name);
        }
        if (idx + 1 !== arr.length) {
            // don't add a slash at the end
            return "".concat(acc).concat(displayValue, "/");
        }
        return "".concat(acc).concat(displayValue);
    };
    var shortenedPlayerIdReducer = function (acc, currPlayerId, idx, arr) {
        var displayValue;
        if (idx > 0 &&
            currPlayerId.startsWith('Rookie Pick ') &&
            arr[idx - 1].startsWith('Rookie Pick ')) {
            displayValue = currPlayerId.substring('Rookie Pick '.length);
        }
        else {
            var player = playerData[currPlayerId];
            displayValue = !player
                ? currPlayerId
                : "".concat(player.first_name[0], ". ").concat(player.last_name);
        }
        if (idx + 1 !== arr.length) {
            // don't add a slash at the end
            return "".concat(acc).concat(displayValue, "/");
        }
        return "".concat(acc).concat(displayValue);
    };
    return (<div className={"".concat(LookToTradeModule_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : LookToTradeModule_module_css_1.default.background)}>
            <div className={LookToTradeModule_module_css_1.default.title}>LOOK TO TRADE:</div>
            {[0, 1, 2].map(function (idx) {
            var tradeAwayString = playersToTrade[idx].reduce(playerIdReducer, '');
            var shortenedTradeAwayString = playersToTrade[idx].reduce(shortenedPlayerIdReducer, '');
            return tradeSuggestion(tradeAwayString.length < 26
                ? tradeAwayString
                : shortenedTradeAwayString, inReturn[idx].toLocaleUpperCase(), COLORS[idx], idx);
        })}
        </div>);
}
function InputComponent(_a) {
    var playersToTrade = _a.playersToTrade, setPlayersToTrade = _a.setPlayersToTrade, roster = _a.roster, inReturn = _a.inReturn, setInReturn = _a.setInReturn;
    function inReturnComponent(idx) {
        return (<material_1.FormControl style={{
                margin: '4px',
            }}>
                <material_1.Autocomplete options={SUGGESTIONS} inputValue={inReturn[idx]} onInputChange={function (_event, newInputValue) {
                var newInReturn = __spreadArray([], inReturn, true);
                newInReturn[idx] = newInputValue;
                setInReturn(newInReturn);
            }} renderInput={function (params) { return (<material_1.TextField {...params} label="Suggestion"/>); }} freeSolo/>
            </material_1.FormControl>);
    }
    function inputComponent() {
        var nonIdPlayerOptions = [];
        for (var i = 1; i < 15; i++) {
            nonIdPlayerOptions.push("Rookie Pick 1.".concat(i < 10 ? "0".concat(i) : "".concat(i)));
        }
        nonIdPlayerOptions.push('2025 1st');
        nonIdPlayerOptions.push('2026 1st');
        return (<>
                {playersToTrade.map(function (_, idx) {
                var _a;
                return (<react_1.Fragment key={idx}>
                        <PlayerSelectComponent_1.default playerIds={(_a = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _a !== void 0 ? _a : []} selectedPlayerIds={playersToTrade[idx]} onChange={function (newPlayerIds) {
                        var newSelections = __spreadArray([], playersToTrade, true);
                        newSelections[idx] = newPlayerIds;
                        setPlayersToTrade(newSelections);
                    }} nonIdPlayerOptions={nonIdPlayerOptions}/>
                        {inReturnComponent(idx)}
                    </react_1.Fragment>);
            })}
            </>);
    }
    return inputComponent();
}
