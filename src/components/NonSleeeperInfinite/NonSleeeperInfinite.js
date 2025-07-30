"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NonSleeeperInfinite;
var react_1 = require("react");
var hooks_1 = require("../../hooks/hooks");
var NonSleeperInput_1 = require("../Blueprint/shared/NonSleeperInput");
function NonSleeeperInfinite() {
    var _a = (0, react_1.useState)(), _roster = _a[0], setRoster = _a[1];
    var _b = (0, hooks_1.useNonSleeper)(undefined, undefined, setRoster), nonSleeperIds = _b.nonSleeperIds, setNonSleeperIds = _b.setNonSleeperIds, nonSleeperRosterSettings = _b.nonSleeperRosterSettings, setNonSleeperRosterSettings = _b.setNonSleeperRosterSettings, ppr = _b.ppr, setPpr = _b.setPpr, teBonus = _b.teBonus, setTeBonus = _b.setTeBonus, numRosters = _b.numRosters, setNumRosters = _b.setNumRosters, taxiSlots = _b.taxiSlots, setTaxiSlots = _b.setTaxiSlots, teamName = _b.teamName, setTeamName = _b.setTeamName;
    return (<div>
            <NonSleeperInput_1.NonSleeperInput nonSleeperIds={nonSleeperIds} setNonSleeperIds={setNonSleeperIds} teamName={teamName} setTeamName={setTeamName} nonSleeperRosterSettings={nonSleeperRosterSettings} setNonSleeperRosterSettings={setNonSleeperRosterSettings} ppr={ppr} setPpr={setPpr} teBonus={teBonus} setTeBonus={setTeBonus} numRosters={numRosters} setNumRosters={setNumRosters} taxiSlots={taxiSlots} setTaxiSlots={setTaxiSlots}/>
        </div>);
}
