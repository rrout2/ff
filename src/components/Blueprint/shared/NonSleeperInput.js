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
exports.NonSleeperInput = NonSleeperInput;
var material_1 = require("@mui/material");
var fantasy_1 = require("../../../consts/fantasy");
var hooks_1 = require("../../../hooks/hooks");
var PlayerSelectComponent_1 = require("./PlayerSelectComponent");
var StyledNumberInput_1 = require("./StyledNumberInput");
var react_1 = require("react");
function NonSleeperInput(_a) {
    var nonSleeperIds = _a.nonSleeperIds, setNonSleeperIds = _a.setNonSleeperIds, teamName = _a.teamName, setTeamName = _a.setTeamName, nonSleeperRosterSettings = _a.nonSleeperRosterSettings, setNonSleeperRosterSettings = _a.setNonSleeperRosterSettings, ppr = _a.ppr, setPpr = _a.setPpr, teBonus = _a.teBonus, setTeBonus = _a.setTeBonus, numRosters = _a.numRosters, setNumRosters = _a.setNumRosters, taxiSlots = _a.taxiSlots, setTaxiSlots = _a.setTaxiSlots;
    var allPlayers = (0, hooks_1.useAllPlayers)();
    var _b = (0, react_1.useState)(''), player = _b[0], setPlayer = _b[1];
    var _c = (0, react_1.useState)(false), playerAdded = _c[0], setPlayerAdded = _c[1];
    (0, react_1.useEffect)(function () {
        setPlayerAdded(nonSleeperIds.includes(player));
    }, [nonSleeperIds, player]);
    return (<>
            <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
                <PlayerSearchInput player={player} setPlayer={setPlayer}/>
                <material_1.Button disabled={!player} onClick={function () {
            if (playerAdded) {
                setNonSleeperIds(nonSleeperIds.filter(function (id) { return id !== player; }));
            }
            else {
                setNonSleeperIds(__spreadArray(__spreadArray([], nonSleeperIds, true), [player], false));
            }
        }}>
                    {playerAdded ? 'Remove' : 'Add'}
                </material_1.Button>
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
                <material_1.TextField value={teamName} onChange={function (e) { return setTeamName(e.target.value); }} label="Team Name"/>
                <PlayerSelectComponent_1.default playerIds={allPlayers} selectedPlayerIds={nonSleeperIds} onChange={setNonSleeperIds} multiple={true} label="Non-Sleeper Roster" styles={{ minWidth: '200px' }}/>
            </div>
            <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        }}>
                    {[fantasy_1.QB, fantasy_1.RB, fantasy_1.WR, fantasy_1.TE, fantasy_1.FLEX, fantasy_1.SUPER_FLEX, fantasy_1.BENCH].map(function (position) { return (<StyledNumberInput_1.default key={position} value={nonSleeperRosterSettings.get(position)} onChange={function (_, value) {
                var newMap = new Map(nonSleeperRosterSettings);
                newMap.set(position, value || 0);
                setNonSleeperRosterSettings(newMap);
            }} label={position} min={0} max={100}/>); })}
                </div>
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        }}>
                    <StyledNumberInput_1.default value={ppr} onChange={function (_, value) {
            setPpr(value || 0);
        }} label="PPR" step={0.5} min={0} max={10}/>
                    <StyledNumberInput_1.default value={teBonus} onChange={function (_, value) {
            setTeBonus(value || 0);
        }} label="TE Bonus" step={0.5} min={0} max={10}/>
                    <StyledNumberInput_1.default value={numRosters} onChange={function (_, value) {
            setNumRosters(value || 0);
        }} label="League Size" step={1} min={2} max={100}/>
                    <StyledNumberInput_1.default value={taxiSlots} onChange={function (_, value) {
            setTaxiSlots(value || 0);
        }} label="Taxi Slots" step={1} min={0} max={10}/>
                </div>
            </div>
        </>);
}
function PlayerSearchInput(_a) {
    var player = _a.player, setPlayer = _a.setPlayer;
    var allPlayers = (0, hooks_1.useAllPlayers)();
    var playerData = (0, hooks_1.usePlayerData)();
    var _b = (0, react_1.useState)(''), inputValue = _b[0], setInputValue = _b[1];
    if (!playerData)
        return <></>;
    return (<material_1.FormControl style={{ margin: '4px', minWidth: '200px', width: 'fit-content' }}>
            <material_1.Autocomplete options={allPlayers} getOptionLabel={function (option) {
            var p = playerData[option];
            if (!p)
                return '';
            return "".concat(p.first_name, " ").concat(p.last_name);
        }} autoHighlight value={player} onChange={function (_event, newInputValue, reason) {
            if (reason === 'clear' || newInputValue === null) {
                return;
            }
            setPlayer(newInputValue);
        }} inputValue={inputValue} onInputChange={function (_event, value, _reason) {
            setInputValue(value);
        }} renderInput={function (params) { return (<material_1.TextField {...params} label={'Search for Player'}/>); }}/>
        </material_1.FormControl>);
}
