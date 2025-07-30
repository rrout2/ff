"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
exports.default = NewGenerator;
var react_1 = require("react");
var hooks_1 = require("../../../hooks/hooks");
var sleeper_api_1 = require("../../../sleeper-api/sleeper-api");
var TeamPage_1 = require("../../Team/TeamPage/TeamPage");
var material_1 = require("@mui/material");
var urlParams_1 = require("../../../consts/urlParams");
var RosterModule_1 = require("./modules/RosterModule/RosterModule");
var SettingsModule_1 = require("./modules/SettingsModule/SettingsModule");
var CornerstonesModule_1 = require("./modules/CornerstonesModule/CornerstonesModule");
var UnifiedModule_1 = require("./modules/UnifiedModule/UnifiedModule");
var SuggestedMovesModule_1 = require("./modules/SuggestedMovesModule/SuggestedMovesModule");
var HoldsModule_1 = require("./modules/HoldsModule/HoldsModule");
var RisersFallersModule_1 = require("./modules/RisersFallersModule/RisersFallersModule");
var PositionalGrades_1 = require("./modules/PositionalGrades/PositionalGrades");
var ThreeYearOutlook_1 = require("./modules/ThreeYearOutlook/ThreeYearOutlook");
var BigBoy_1 = require("./modules/BigBoy/BigBoy");
var NonSleeperInput_1 = require("../shared/NonSleeperInput");
var fantasy_1 = require("../../../consts/fantasy");
var Module;
(function (Module) {
    Module["Unspecified"] = "unspecified";
    Module["Roster"] = "roster";
    Module["Settings"] = "settings";
    Module["Cornerstones"] = "cornerstones";
    Module["SuggestedMoves"] = "suggestedmoves";
    Module["Unified"] = "unified";
    Module["Holds"] = "holds";
    Module["RisersFallers"] = "risersfallers";
    Module["PositionalGrades"] = "positionalgrades";
    Module["ThreeYearOutlook"] = "threeyearoutlook";
    Module["BigBoy"] = "bigboy";
})(Module || (exports.Module = Module = {}));
function NewGenerator() {
    var _a = (0, hooks_1.useLeagueIdFromUrl)(), leagueId = _a[0], setLeagueId = _a[1];
    var _b = (0, react_1.useState)(leagueId), leagueIdWrapper = _b[0], setLeagueIdWrapper = _b[1];
    var _c = (0, hooks_1.useTeamIdFromUrl)(), teamId = _c[0], setTeamId = _c[1];
    var _d = (0, hooks_1.useParamFromUrl)('module', Module.Unspecified), module = _d[0], setModule = _d[1];
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var _e = (0, react_1.useState)([]), allUsers = _e[0], setAllUsers = _e[1];
    var _f = (0, react_1.useState)(), specifiedUser = _f[0], setSpecifiedUser = _f[1];
    var _g = (0, react_1.useState)(), roster = _g[0], setRoster = _g[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX);
    (0, react_1.useEffect)(function () {
        if (!leagueId || !rosters)
            return;
        var ownerIds = new Set(rosters.map(function (r) { return r.owner_id; }));
        (0, sleeper_api_1.getAllUsers)(leagueId).then(function (users) {
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            return setAllUsers(users.filter(function (u) { return ownerIds.has(u.user_id); }));
        });
    }, [leagueId, rosters]);
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId() || +teamId >= allUsers.length) {
            return;
        }
        setSpecifiedUser(allUsers === null || allUsers === void 0 ? void 0 : allUsers[+teamId]);
    }, [allUsers, teamId]);
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId())
            return;
        if (+teamId >= allUsers.length) {
            // if the teamId is out of bounds, reset it
            setTeamId('0');
        }
    }, [allUsers, teamId]);
    (0, react_1.useEffect)(function () {
        if (!rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !playerData ||
            allUsers.length === 0) {
            return;
        }
        function getRosterFromTeamIdx(idx) {
            if (allUsers.length === 0 || !rosters)
                return;
            var ownerId = allUsers[idx].user_id;
            return rosters.find(function (r) { return r.owner_id === ownerId; });
        }
        if (+teamId >= allUsers.length)
            return;
        var newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster)
            throw new Error('roster not found');
        setRoster(newRoster);
    }, [rosters, teamId, playerData, allUsers]);
    var _h = (0, hooks_1.usePositionalRanks)(rosters, roster), qbRank = _h.qbRank, rbRank = _h.rbRank, wrRank = _h.wrRank, teRank = _h.teRank;
    var _j = (0, hooks_1.useNonSleeper)(rosters, specifiedUser, setRoster), nonSleeperIds = _j.nonSleeperIds, setNonSleeperIds = _j.setNonSleeperIds, nonSleeperRosterSettings = _j.nonSleeperRosterSettings, setNonSleeperRosterSettings = _j.setNonSleeperRosterSettings, ppr = _j.ppr, setPpr = _j.setPpr, teBonus = _j.teBonus, setTeBonus = _j.setTeBonus, numRosters = _j.numRosters, setNumRosters = _j.setNumRosters, taxiSlots = _j.taxiSlots, setTaxiSlots = _j.setTaxiSlots, teamName = _j.teamName, setTeamName = _j.setTeamName, setSearchParams = _j.setSearchParams;
    function hasTeamId() {
        return teamId !== '' && teamId !== urlParams_1.NONE_TEAM_ID;
    }
    function moduleSelectComponent() {
        return (<material_1.FormControl style={{
                margin: '4px',
                maxWidth: '800px',
            }}>
                <material_1.InputLabel>Module</material_1.InputLabel>
                <material_1.Select value={module} label="Module" onChange={function (event) {
                setModule(event.target.value);
            }}>
                    <material_1.MenuItem value={Module.Unspecified} key={'chooseamodule'}>
                        Choose a module:
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Unified} key={Module.Unified}>
                        Unified
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Roster} key={Module.Roster}>
                        Roster
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Settings} key={Module.Settings}>
                        Settings
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Cornerstones} key={Module.Cornerstones}>
                        Cornerstones
                    </material_1.MenuItem>

                    <material_1.MenuItem value={Module.SuggestedMoves} key={Module.SuggestedMoves}>
                        Suggested Moves
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Holds} key={Module.Holds}>
                        Holds
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.RisersFallers} key={Module.RisersFallers}>
                        Risers/Fallers
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.PositionalGrades} key={Module.PositionalGrades}>
                        Positional Grades
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.ThreeYearOutlook} key={Module.ThreeYearOutlook}>
                        Three Year Outlook
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.BigBoy} key={Module.BigBoy}>
                        Big Boy
                    </material_1.MenuItem>
                </material_1.Select>
            </material_1.FormControl>);
    }
    return (<div>
            {!leagueId && (<>
                    <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                        <material_1.TextField value={leagueIdWrapper} onChange={function (e) { return setLeagueIdWrapper(e.target.value); }} onKeyDown={function (e) {
                if (e.key === 'Enter') {
                    setLeagueId(leagueIdWrapper);
                }
            }} label="Sleeper ID"/>
                        <material_1.Button variant="outlined" onClick={function () { return setLeagueId(leagueIdWrapper); }} disabled={!leagueIdWrapper}>
                            {'submit'}
                        </material_1.Button>
                    </div>
                    or
                    <NonSleeperInput_1.NonSleeperInput nonSleeperIds={nonSleeperIds} setNonSleeperIds={setNonSleeperIds} teamName={teamName} setTeamName={setTeamName} nonSleeperRosterSettings={nonSleeperRosterSettings} setNonSleeperRosterSettings={setNonSleeperRosterSettings} ppr={ppr} setPpr={setPpr} teBonus={teBonus} setTeBonus={setTeBonus} numRosters={numRosters} setNumRosters={setNumRosters} taxiSlots={taxiSlots} setTaxiSlots={setTaxiSlots}/>
                </>)}
            {!!leagueId && (<>
                    <material_1.Button variant="outlined" onClick={function () {
                setSearchParams(function (searchParams) {
                    searchParams.delete(urlParams_1.LEAGUE_ID);
                    return searchParams;
                });
                setLeagueIdWrapper('');
                setLeagueId('');
            }}>
                        {'New League'}
                    </material_1.Button>
                    {<TeamPage_1.TeamSelectComponent teamId={teamId} setTeamId={setTeamId} allUsers={allUsers} specifiedUser={specifiedUser} style={{
                    margin: '4px',
                }}/>}
                </>)}
            {moduleSelectComponent()}
            {module === Module.Roster && !!roster && (<RosterModule_1.default roster={roster} numRosters={numRosters} teamName={teamName}/>)}
            {module === Module.Settings && (<SettingsModule_1.default leagueId={leagueId} teamName={teamName} numRosters={numRosters}/>)}
            {module === Module.Cornerstones && (<CornerstonesModule_1.default roster={roster} teamName={teamName}/>)}
            {module === Module.Unified && (<UnifiedModule_1.default roster={roster} numRosters={numRosters} teamName={teamName}/>)}
            {module === Module.SuggestedMoves && (<SuggestedMovesModule_1.default roster={roster} teamName={teamName}/>)}
            {module === Module.Holds && (<HoldsModule_1.default roster={roster} teamName={teamName}/>)}
            {module === Module.RisersFallers && (<RisersFallersModule_1.default roster={roster} teamName={teamName}/>)}
            {module === Module.PositionalGrades && (<PositionalGrades_1.default teamName={teamName} roster={roster} leagueSize={numRosters}/>)}
            {module === Module.ThreeYearOutlook && (<ThreeYearOutlook_1.default teamName={teamName}/>)}
            {module === Module.BigBoy && (<BigBoy_1.default roster={roster} numRosters={numRosters} teamName={teamName} qbRank={qbRank} rbRank={rbRank} wrRank={wrRank} teRank={teRank} isSuperFlex={isSuperFlex}/>)}
        </div>);
}
