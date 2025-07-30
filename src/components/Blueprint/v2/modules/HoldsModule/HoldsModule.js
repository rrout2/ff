"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHolds = useHolds;
exports.default = HoldsModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var HoldsModule_module_css_1 = require("./HoldsModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var SuggestedMovesModule_1 = require("../SuggestedMovesModule/SuggestedMovesModule");
var ExportButton_1 = require("../../../shared/ExportButton");
function useHolds(roster) {
    var _a = (0, react_1.useState)([]), holds = _a[0], setHolds = _a[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        setHolds(roster.players
            .map(function (p) { return playerData[p]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; })
            .slice(0, 2));
    }, [roster, playerData]);
    return { holds: holds, setHolds: setHolds };
}
function HoldsModule(_a) {
    var _b;
    var roster = _a.roster, teamName = _a.teamName;
    var _c = useHolds(roster), holds = _c.holds, setHolds = _c.setHolds;
    return (<>
            <ExportButton_1.default className={HoldsModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_holds.png")}/>
            <InputComponent playerIds={(_b = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _b !== void 0 ? _b : []} holds={holds} setHolds={setHolds}/>
            <GraphicComponent holds={holds}/>
        </>);
}
function GraphicComponent(_a) {
    var holds = _a.holds, graphicClassName = _a.graphicClassName;
    return (<div className={"".concat(HoldsModule_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')}>
            {holds.map(function (holdId, idx) { return (<div key={idx} className={HoldsModule_module_css_1.default.holdColumn}>
                    <SuggestedMovesModule_1.HoldTile playerId={holdId}/>
                </div>); })}
        </div>);
}
function InputComponent(_a) {
    var playerIds = _a.playerIds, holds = _a.holds, setHolds = _a.setHolds;
    return (<div className={HoldsModule_module_css_1.default.inputComponent}>
            <PlayerSelectComponent_1.default label="Holds" playerIds={playerIds} selectedPlayerIds={holds} onChange={setHolds} nonIdPlayerOptions={[]} multiple={true} maxSelections={2}/>
        </div>);
}
