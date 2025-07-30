"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RosterModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var colors_1 = require("../../../../../consts/colors");
var fantasy_1 = require("../../../../../consts/fantasy");
var hooks_1 = require("../../../../../hooks/hooks");
var RosterModule_module_css_1 = require("./RosterModule.module.css");
var material_1 = require("@mui/material");
var ExportButton_1 = require("../../../shared/ExportButton");
function RosterModule(_a) {
    var roster = _a.roster, numRosters = _a.numRosters, teamName = _a.teamName;
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    var rankStateMap = new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, (0, react_1.useState)('4th')]; }));
    if (!playerData)
        return <></>;
    var allPlayers = roster.players
        .map(function (playerId) { return playerData[playerId]; })
        .sort(sortByAdp);
    return (<>
            <InputComponent rankStateMap={rankStateMap}/>
            <ExportButton_1.default className={RosterModule_module_css_1.default.fullRoster} pngName={"".concat(teamName, "_roster.png")}/>
            <GraphicComponent allPlayers={allPlayers} rankStateMap={rankStateMap} numRosters={numRosters}/>
        </>);
}
function GraphicComponent(_a) {
    var graphicClassName = _a.graphicClassName, allPlayers = _a.allPlayers, rankStateMap = _a.rankStateMap, numRosters = _a.numRosters, _b = _a.transparent, transparent = _b === void 0 ? false : _b;
    var getPositionalAdp = (0, hooks_1.useAdpData)().getPositionalAdp;
    function positionalAdpToColor(adp) {
        if (adp <= 20) {
            return '#39B54A';
        }
        if (adp <= 40) {
            return '#F5EE31';
        }
        if (adp <= 60) {
            return '#F7941D';
        }
        if (adp === Infinity) {
            return 'gray';
        }
        return '#D82A29';
    }
    return (<div className={"".concat(RosterModule_module_css_1.default.fullRoster, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            {fantasy_1.FANTASY_POSITIONS.map(function (pos) {
            var _a;
            return (<div className={RosterModule_module_css_1.default.positionColumn} key={pos}>
                    <div className={RosterModule_module_css_1.default.positionHeader} style={{
                    color: colors_1.COLORS.get(pos),
                }}>
                        <div>{pos}</div>
                        <div className={RosterModule_module_css_1.default.postionalRank}>
                            {(_a = rankStateMap.get(pos)) === null || _a === void 0 ? void 0 : _a[0]} / {numRosters !== null && numRosters !== void 0 ? numRosters : 0}
                        </div>
                    </div>
                    {allPlayers
                    .filter(function (player) { return !!player && player.position === pos; })
                    .map(function (player) {
                    var fullName = "".concat(player.first_name, " ").concat(player.last_name);
                    var positionalAdp = getPositionalAdp(fullName);
                    return (<div className={RosterModule_module_css_1.default.rosterPlayer} key={player.player_id}>
                                    <div>{fullName.toUpperCase()}</div>
                                    <div style={{
                            color: positionalAdpToColor(positionalAdp),
                        }}>
                                        {positionalAdp === Infinity
                            ? '-'
                            : positionalAdp}
                                    </div>
                                </div>);
                })
                    .slice(0, 10)}
                </div>);
        })}
        </div>);
}
function InputComponent(_a) {
    var rankStateMap = _a.rankStateMap;
    return (<>
            {fantasy_1.FANTASY_POSITIONS.map(function (pos) {
            return (<material_1.FormControl style={{ margin: '4px' }} key={pos}>
                        <material_1.InputLabel>{pos}</material_1.InputLabel>
                        <material_1.Select label={pos} value={rankStateMap.get(pos)[0]} onChange={function (e) {
                    rankStateMap.get(pos)[1](e.target.value);
                }}>
                            <material_1.MenuItem value={'1st'}>1st</material_1.MenuItem>
                            <material_1.MenuItem value={'2nd'}>2nd</material_1.MenuItem>
                            <material_1.MenuItem value={'3rd'}>3rd</material_1.MenuItem>
                            <material_1.MenuItem value={'4th'}>4th</material_1.MenuItem>
                            <material_1.MenuItem value={'5th'}>5th</material_1.MenuItem>
                            <material_1.MenuItem value={'6th'}>6th</material_1.MenuItem>
                            <material_1.MenuItem value={'7th'}>7th</material_1.MenuItem>
                            <material_1.MenuItem value={'8th'}>8th</material_1.MenuItem>
                            <material_1.MenuItem value={'9th'}>9th</material_1.MenuItem>
                            <material_1.MenuItem value={'10th'}>10th</material_1.MenuItem>
                            <material_1.MenuItem value={'11th'}>11th</material_1.MenuItem>
                            <material_1.MenuItem value={'12th'}>12th</material_1.MenuItem>
                            <material_1.MenuItem value={'13th'}>13th</material_1.MenuItem>
                            <material_1.MenuItem value={'14th'}>14th</material_1.MenuItem>
                            <material_1.MenuItem value={'15th'}>15th</material_1.MenuItem>
                            <material_1.MenuItem value={'16th'}>16th</material_1.MenuItem>
                        </material_1.Select>
                    </material_1.FormControl>);
        })}
        </>);
}
