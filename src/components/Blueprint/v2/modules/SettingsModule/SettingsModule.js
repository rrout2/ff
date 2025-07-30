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
exports.default = SettingsModule;
exports.GraphicComponent = GraphicComponent;
var SettingsModule_module_css_1 = require("./SettingsModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var fantasy_1 = require("../../../../../consts/fantasy");
var ExportButton_1 = require("../../../shared/ExportButton");
var colors_1 = require("../../consts/colors");
function SettingsModule(props) {
    var leagueId = props.leagueId, teamName = props.teamName, numRosters = props.numRosters;
    return (<>
            <ExportButton_1.default className={SettingsModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_settings.png")}/>
            <GraphicComponent leagueId={leagueId} numRosters={numRosters}/>
        </>);
}
function GraphicComponent(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var graphicClassName = _a.graphicClassName, leagueId = _a.leagueId, numRosters = _a.numRosters, _o = _a.transparent, transparent = _o === void 0 ? false : _o;
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettingsFromId)(leagueId);
    function multiColorBackground(background) {
        if (background.length === 4) {
            return (<div className={SettingsModule_module_css_1.default.multiColorBackground}>
                    <div className={SettingsModule_module_css_1.default.colorRow}>
                        <div style={{
                    backgroundColor: background[0],
                }} className={SettingsModule_module_css_1.default.sizeOfFour}/>
                        <div style={{
                    backgroundColor: background[1],
                }} className={SettingsModule_module_css_1.default.sizeOfFour}/>
                    </div>
                    <div className={SettingsModule_module_css_1.default.colorRow}>
                        <div style={{
                    backgroundColor: background[2],
                }} className={SettingsModule_module_css_1.default.sizeOfFour}/>
                        <div style={{
                    backgroundColor: background[3],
                }} className={SettingsModule_module_css_1.default.sizeOfFour}/>
                    </div>
                </div>);
        }
        return (<div className={SettingsModule_module_css_1.default.multiColorBackground}>
                <div className={SettingsModule_module_css_1.default.colorRow}>
                    <div style={{
                backgroundColor: background[0],
            }} className={SettingsModule_module_css_1.default.sizeOfThree}/>
                    <div style={{
                backgroundColor: background[1],
            }} className={SettingsModule_module_css_1.default.sizeOfThree}/>
                    <div style={{
                backgroundColor: background[2],
            }} className={SettingsModule_module_css_1.default.sizeOfThree}/>
                </div>
            </div>);
    }
    function multiColoredTile(value) {
        var background = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            background[_i - 1] = arguments[_i];
        }
        return (<div className={SettingsModule_module_css_1.default.multiColoredTileContainer}>
                {multiColorBackground(background)}
                <div className={SettingsModule_module_css_1.default.multiColorValue}>{value}</div>
            </div>);
    }
    function settingTile(value) {
        var background = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            background[_i - 1] = arguments[_i];
        }
        if (background.length === 1) {
            return (<div className={SettingsModule_module_css_1.default.settingTile} style={{ backgroundColor: background[0] }}>
                    {value}
                </div>);
        }
        else {
            return multiColoredTile.apply(void 0, __spreadArray([value], background, false));
        }
    }
    function numFlexes() {
        var _a, _b, _c;
        return (((_a = rosterSettings.get(fantasy_1.FLEX)) !== null && _a !== void 0 ? _a : 0) +
            ((_b = rosterSettings.get(fantasy_1.WR_RB_FLEX)) !== null && _b !== void 0 ? _b : 0) +
            ((_c = rosterSettings.get(fantasy_1.WR_TE_FLEX)) !== null && _c !== void 0 ? _c : 0));
    }
    return (<div className={"".concat(SettingsModule_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            {settingTile(numRosters !== null && numRosters !== void 0 ? numRosters : 0, colors_1.color.white)}
            {settingTile(((_c = (_b = league === null || league === void 0 ? void 0 : league.scoring_settings) === null || _b === void 0 ? void 0 : _b.rec) !== null && _c !== void 0 ? _c : 0).toFixed(1), colors_1.color.white)}
            {settingTile(((_e = (_d = league === null || league === void 0 ? void 0 : league.scoring_settings) === null || _d === void 0 ? void 0 : _d.bonus_rec_te) !== null && _e !== void 0 ? _e : 0).toFixed(1), colors_1.color.white)}
            {settingTile((_f = rosterSettings.get(fantasy_1.QB)) !== null && _f !== void 0 ? _f : 0, colors_1.color.qb)}
            {settingTile((_g = rosterSettings.get(fantasy_1.RB)) !== null && _g !== void 0 ? _g : 0, colors_1.color.rb)}
            {settingTile((_h = rosterSettings.get(fantasy_1.WR)) !== null && _h !== void 0 ? _h : 0, colors_1.color.wr)}
            {settingTile((_j = rosterSettings.get(fantasy_1.TE)) !== null && _j !== void 0 ? _j : 0, colors_1.color.te)}
            {settingTile(numFlexes(), colors_1.color.rb, colors_1.color.wr, colors_1.color.te)}
            {settingTile((_k = rosterSettings.get(fantasy_1.SUPER_FLEX)) !== null && _k !== void 0 ? _k : 0, colors_1.color.qb, colors_1.color.rb, colors_1.color.wr, colors_1.color.te)}
            {settingTile((_l = rosterSettings.get(fantasy_1.BENCH)) !== null && _l !== void 0 ? _l : 0, colors_1.color.red)}
            {settingTile((_m = league === null || league === void 0 ? void 0 : league.settings.taxi_slots) !== null && _m !== void 0 ? _m : 0, colors_1.color.red)}
        </div>);
}
