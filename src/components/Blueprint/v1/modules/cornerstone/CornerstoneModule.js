"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCornerstones = useCornerstones;
exports.CornerstoneModule = CornerstoneModule;
exports.GraphicComponent = GraphicComponent;
exports.AllPositionalSelectors = AllPositionalSelectors;
var CornerstoneModule_module_css_1 = require("./CornerstoneModule.module.css");
var ExportButton_1 = require("../../../shared/ExportButton");
var fantasy_1 = require("../../../../../consts/fantasy");
var hooks_1 = require("../../../../../hooks/hooks");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var react_1 = require("react");
function useCornerstones(roster) {
    var playerData = (0, hooks_1.usePlayerData)();
    var _a = (0, hooks_1.useAdpData)(), getAdp = _a.getAdp, sortByAdp = _a.sortByAdp;
    var _b = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, []]; }))), cornerstones = _b[0], setCornerstones = _b[1];
    function isCornerstone(player) {
        if (!player)
            return false;
        var adp = getAdp("".concat(player.first_name, " ").concat(player.last_name));
        switch (player.position) {
            case fantasy_1.QB:
                return adp <= 75;
            case fantasy_1.RB:
                return adp <= 75 && player.age < 27;
            case fantasy_1.WR:
                return adp <= 75 && player.age < 28;
            case fantasy_1.TE:
                return adp <= 75 && player.age < 29;
            default:
                return false;
        }
    }
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        var cornerstones = roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(isCornerstone)
            .sort(sortByAdp);
        setCornerstones(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [
            pos,
            cornerstones
                .filter(function (player) {
                return player.fantasy_positions.includes(pos);
            })
                .map(function (player) { return player.player_id; })
                .slice(0, 3),
        ]; })));
    }, [roster, playerData]);
    return { cornerstones: cornerstones, setCornerstones: setCornerstones };
}
function CornerstoneModule(props) {
    var roster = props.roster, teamName = props.teamName, graphicComponentClass = props.graphicComponentClass;
    var _a = useCornerstones(roster), cornerstones = _a.cornerstones, setCornerstones = _a.setCornerstones;
    return (<div style={{ display: 'flex', flexDirection: 'column' }}>
            <GraphicComponent cornerstones={cornerstones} graphicComponentClass={graphicComponentClass} transparent={false}/>
            {!graphicComponentClass && (<ExportButton_1.default className={CornerstoneModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_cornerstones.png")}/>)}
            <AllPositionalSelectors cornerstones={cornerstones} setCornerstones={setCornerstones} roster={roster}/>
        </div>);
}
function GraphicComponent(_a) {
    var cornerstones = _a.cornerstones, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent;
    var playerData = (0, hooks_1.usePlayerData)();
    if (!playerData)
        return <></>;
    return (<div className={"".concat(CornerstoneModule_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : CornerstoneModule_module_css_1.default.background)}>
            <div className={CornerstoneModule_module_css_1.default.positions}>
                {fantasy_1.FANTASY_POSITIONS.map(function (pos) { return (<div className={CornerstoneModule_module_css_1.default.column} key={pos}>
                        <div className={"".concat(CornerstoneModule_module_css_1.default.positionChip, " ").concat(CornerstoneModule_module_css_1.default[pos])}>
                            {pos}
                        </div>
                        <div className={CornerstoneModule_module_css_1.default.cornerstoneList}>
                            {cornerstones
                .get(pos)
                .map(function (playerId) { return playerData[playerId]; })
                .map(function (player) {
                return (<div key={player.player_id}>
                                            {"".concat(player.first_name, " ").concat(player.last_name).toLocaleUpperCase()}
                                        </div>);
            })}
                        </div>
                    </div>); })}
            </div>
        </div>);
}
function AllPositionalSelectors(_a) {
    var cornerstones = _a.cornerstones, setCornerstones = _a.setCornerstones, roster = _a.roster;
    return (<>
            {fantasy_1.FANTASY_POSITIONS.map(function (pos) {
            var _a, _b;
            return (<PlayerSelectComponent_1.default key={pos} playerIds={(_a = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _a !== void 0 ? _a : []} selectedPlayerIds={(_b = cornerstones.get(pos)) !== null && _b !== void 0 ? _b : []} position={pos} onChange={function (newPlayerIds) {
                    cornerstones.set(pos, newPlayerIds);
                    setCornerstones(new Map(cornerstones));
                }}/>);
        })}
        </>);
}
