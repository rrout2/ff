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
exports.useRisersFallers = useRisersFallers;
exports.default = RisersFallersModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var RisersFallersModule_module_css_1 = require("./RisersFallersModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var StyledNumberInput_1 = require("../../../shared/StyledNumberInput");
var ExportButton_1 = require("../../../shared/ExportButton");
var images_1 = require("../../../../../consts/images");
function useRisersFallers(roster) {
    var _a = (0, react_1.useState)([]), risers = _a[0], setRisers = _a[1];
    var _b = (0, react_1.useState)([30, 20, 10]), riserValues = _b[0], setRiserValues = _b[1];
    var _c = (0, react_1.useState)([]), fallers = _c[0], setFallers = _c[1];
    var _d = (0, react_1.useState)([-10, -20, -30]), fallerValues = _d[0], setFallerValues = _d[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        var players = roster.players
            .map(function (p) { return playerData[p]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; });
        setRisers(players.slice(0, 3));
        setFallers(players.slice(3, 6));
    }, [roster, playerData]);
    return {
        risers: risers,
        setRisers: setRisers,
        riserValues: riserValues,
        setRiserValues: setRiserValues,
        fallers: fallers,
        setFallers: setFallers,
        fallerValues: fallerValues,
        setFallerValues: setFallerValues,
    };
}
function RisersFallersModule(_a) {
    var roster = _a.roster, teamName = _a.teamName;
    var _b = useRisersFallers(roster), risers = _b.risers, setRisers = _b.setRisers, riserValues = _b.riserValues, setRiserValues = _b.setRiserValues, fallers = _b.fallers, setFallers = _b.setFallers, fallerValues = _b.fallerValues, setFallerValues = _b.setFallerValues;
    return (<div>
            <ExportButton_1.default className={RisersFallersModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_risers_fallers.png")}/>
            <InputComponent playerIds={(roster === null || roster === void 0 ? void 0 : roster.players) || []} risers={risers} setRisers={setRisers} fallers={fallers} setFallers={setFallers} riserValues={riserValues} setRiserValues={setRiserValues} fallerValues={fallerValues} setFallerValues={setFallerValues}/>
            <GraphicComponent risers={risers} fallers={fallers} riserValues={riserValues} fallerValues={fallerValues}/>
        </div>);
}
function GraphicComponent(_a) {
    var risers = _a.risers, fallers = _a.fallers, riserValues = _a.riserValues, fallerValues = _a.fallerValues, graphicClassName = _a.graphicClassName, _b = _a.transparent, transparent = _b === void 0 ? false : _b;
    var playerData = (0, hooks_1.usePlayerData)();
    var reds = [images_1.shortRed, images_1.mediumRed, images_1.longRed];
    var greens = [images_1.shortGreen, images_1.mediumGreen, images_1.longGreen].reverse();
    var greenWidths = [72, 60, 42];
    var redWidths = __spreadArray([], greenWidths, true).reverse();
    for (var i = 0; i < greenWidths.length; i++) {
        greenWidths[i] = greenWidths[i] * 1.6;
        redWidths[i] = redWidths[i] * 1.6;
    }
    if (!playerData)
        return <></>;
    function maybeShortenedName(player) {
        var fullName = "".concat(player.first_name, " ").concat(player.last_name);
        if (fullName.length >= 15) {
            return "".concat(player.first_name[0], ". ").concat(player.last_name);
        }
        return fullName;
    }
    return (<div className={"".concat(RisersFallersModule_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            <div className={"".concat(RisersFallersModule_module_css_1.default.wholeColumn, " ").concat(RisersFallersModule_module_css_1.default.columnBorder)}>
                <div className={"".concat(RisersFallersModule_module_css_1.default.columnSection, " ").concat(RisersFallersModule_module_css_1.default.nameColumn, " ").concat(RisersFallersModule_module_css_1.default.alignFlexEnd)}>
                    {risers.map(function (playerId) { return (<div key={playerId}>
                            {maybeShortenedName(playerData[playerId])}
                        </div>); })}
                </div>
                <div className={"".concat(RisersFallersModule_module_css_1.default.arrowContainer, " ").concat(RisersFallersModule_module_css_1.default.alignFlexEnd)}>
                    <div className={RisersFallersModule_module_css_1.default.columnSection} style={{ width: '100%' }}>
                        {fallerValues.map(function (value, idx) { return (<div key={idx} className={RisersFallersModule_module_css_1.default.valueAndArrow}>
                                <div></div>
                                <div className={"".concat(RisersFallersModule_module_css_1.default.arrowImage, " ").concat(RisersFallersModule_module_css_1.default.alignFlexEnd)}>
                                    <img src={reds[idx]} style={{
                width: "".concat(redWidths[idx], "px"),
                height: '32px',
            }}/>
                                </div>
                            </div>); })}
                    </div>
                </div>
            </div>
            <div className={RisersFallersModule_module_css_1.default.wholeColumn}>
                <div className={RisersFallersModule_module_css_1.default.arrowContainer}>
                    <div className={RisersFallersModule_module_css_1.default.columnSection} style={{ width: '100%' }}>
                        {riserValues.map(function (value, idx) { return (<div key={idx} className={RisersFallersModule_module_css_1.default.valueAndArrow}>
                                <div className={RisersFallersModule_module_css_1.default.arrowImage}>
                                    <img src={greens[idx]} style={{
                width: "".concat(greenWidths[idx], "px"),
                height: '29px',
            }}/>
                                </div>
                            </div>); })}
                    </div>
                </div>
                <div className={"".concat(RisersFallersModule_module_css_1.default.columnSection, " ").concat(RisersFallersModule_module_css_1.default.nameColumn)}>
                    {fallers.map(function (playerId) { return (<div key={playerId}>
                            {maybeShortenedName(playerData[playerId])}
                        </div>); })}
                </div>
            </div>
        </div>);
}
function InputComponent(_a) {
    var playerIds = _a.playerIds, risers = _a.risers, setRisers = _a.setRisers, fallers = _a.fallers, setFallers = _a.setFallers, riserValues = _a.riserValues, setRiserValues = _a.setRiserValues, fallerValues = _a.fallerValues, setFallerValues = _a.setFallerValues;
    return (<>
            {risers.map(function (riser, idx) {
            return (<div className={RisersFallersModule_module_css_1.default.inputRow} key={idx}>
                        <StyledNumberInput_1.default key={idx} value={riserValues[idx]} onChange={function (_, value) {
                    var newRiserValues = __spreadArray([], riserValues, true);
                    newRiserValues[idx] = value || 0;
                    setRiserValues(newRiserValues);
                }} min={0} step={0.1}/>
                        <PlayerSelectComponent_1.default label={"Riser ".concat(idx + 1)} playerIds={playerIds} selectedPlayerIds={[riser]} onChange={function (_a) {
                    var riser = _a[0];
                    var newRisers = __spreadArray([], risers, true);
                    newRisers[idx] = riser;
                    setRisers(newRisers);
                }} multiple={false}/>
                    </div>);
        })}
            {fallers.map(function (faller, idx) {
            return (<div className={RisersFallersModule_module_css_1.default.inputRow} key={idx}>
                        <StyledNumberInput_1.default value={fallerValues[idx]} onChange={function (_, value) {
                    var newFallerValues = __spreadArray([], fallerValues, true);
                    newFallerValues[idx] = value || 0;
                    setFallerValues(newFallerValues);
                }} max={0} step={0.1}/>
                        <PlayerSelectComponent_1.default label={"Faller ".concat(idx + 1)} playerIds={playerIds} selectedPlayerIds={[faller]} onChange={function (_a) {
                    var faller = _a[0];
                    var newFallers = __spreadArray([], fallers, true);
                    newFallers[idx] = faller;
                    setFallers(newFallers);
                }} multiple={false}/>
                    </div>);
        })}
        </>);
}
