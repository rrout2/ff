"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
exports.default = BlueprintGenerator;
var react_1 = require("react");
var hooks_1 = require("../../../hooks/hooks");
var sleeper_api_1 = require("../../../sleeper-api/sleeper-api");
var BlueprintGenerator_module_css_1 = require("./BlueprintGenerator.module.css");
var TeamPage_1 = require("../../Team/TeamPage/TeamPage");
var urlParams_1 = require("../../../consts/urlParams");
var CornerstoneModule_1 = require("./modules/cornerstone/CornerstoneModule");
var material_1 = require("@mui/material");
var PlayersToTargetModule_1 = require("./modules/playerstotarget/PlayersToTargetModule");
var Settings_1 = require("./modules/settings/Settings");
var Starters_1 = require("./modules/Starters/Starters");
var DepthScore_1 = require("./modules/DepthScore/DepthScore");
var ExportButton_1 = require("../shared/ExportButton");
var fantasy_1 = require("../../../consts/fantasy");
var BigBoy_1 = require("./modules/BigBoy/BigBoy");
var PositionalGrades_1 = require("./modules/PositionalGrades/PositionalGrades");
var LookToTradeModule_1 = require("./modules/looktotrade/LookToTradeModule");
var WaiverTargets_1 = require("./modules/WaiverTargets/WaiverTargets");
var NonSleeperInput_1 = require("../shared/NonSleeperInput");
var Module;
(function (Module) {
    Module["Unspecified"] = "";
    Module["Cornerstone"] = "cornerstones";
    Module["LookToTrade"] = "looktotrade";
    Module["PlayersToTarget"] = "playerstotarget";
    Module["Settings"] = "settings";
    Module["Starters"] = "starters";
    Module["PositionalGrades"] = "positionalgrades";
    Module["DepthScore"] = "depthscore";
    Module["Unified"] = "unified";
    Module["BigBoy"] = "bigboy";
    Module["WaiverTargets"] = "waivertargets";
})(Module || (exports.Module = Module = {}));
function BlueprintGenerator() {
    var _a, _b;
    var _c = (0, hooks_1.useLeagueIdFromUrl)(), leagueId = _c[0], setLeagueId = _c[1];
    var _d = (0, react_1.useState)(leagueId), inputValue = _d[0], setInputValue = _d[1];
    var _e = (0, hooks_1.useTeamIdFromUrl)(), teamId = _e[0], setTeamId = _e[1];
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var _f = (0, react_1.useState)([]), allUsers = _f[0], setAllUsers = _f[1];
    var _g = (0, react_1.useState)(), roster = _g[0], setRoster = _g[1];
    var league = (0, hooks_1.useLeague)(leagueId);
    var playerData = (0, hooks_1.usePlayerData)();
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _h = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _h.startingLineup, bench = _h.bench, benchString = _h.benchString;
    var _j = (0, react_1.useState)(), specifiedUser = _j[0], setSpecifiedUser = _j[1];
    var _k = (0, hooks_1.useModuleFromUrl)(), module = _k[0], setModule = _k[1];
    var _l = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, -1]; }))), positionalGradeOverrides = _l[0], setPositionalGradeOverrides = _l[1];
    var _m = (0, react_1.useState)([
        [],
        [],
        [],
    ]), playersToTrade = _m[0], setPlayersToTrade = _m[1];
    var _o = (0, react_1.useState)([
        'placeholder',
        'placeholder',
        'placeholder',
    ]), inReturn = _o[0], setInReturn = _o[1];
    var _p = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, []]; }))), cornerstones = _p[0], setCornerstones = _p[1];
    var _q = (0, react_1.useState)(-1), depthScoreOverride = _q[0], setDepthScoreOverride = _q[1];
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId() || +teamId >= allUsers.length) {
            return;
        }
        setSpecifiedUser(allUsers === null || allUsers === void 0 ? void 0 : allUsers[+teamId]);
    }, [allUsers, teamId]);
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !hasTeamId()) {
            return;
        }
        if (+teamId >= allUsers.length) {
            // if the teamId is out of bounds, reset it
            setTeamId('0');
        }
    }, [allUsers, teamId]);
    function getRosterFromTeamIdx(idx) {
        if (allUsers.length === 0 || !rosters)
            return;
        var ownerId = allUsers[idx].user_id;
        return rosters.find(function (r) { return r.owner_id === ownerId; });
    }
    (0, react_1.useEffect)(function () {
        if (!rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !playerData ||
            allUsers.length === 0 ||
            +teamId >= allUsers.length) {
            return;
        }
        var newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster)
            throw new Error('roster not found');
        setRoster(newRoster);
    }, [rosters, teamId, playerData, allUsers]);
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
    var _r = (0, react_1.useState)([
        '10229',
        '5849',
        '4866',
        '10859',
    ]), playerSuggestions = _r[0], setPlayerSuggestions = _r[1];
    (0, hooks_1.useTitle)('Blueprint Generator');
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX);
    var _s = (0, hooks_1.useNonSleeper)(rosters, specifiedUser, setRoster), nonSleeperIds = _s.nonSleeperIds, setNonSleeperIds = _s.setNonSleeperIds, nonSleeperRosterSettings = _s.nonSleeperRosterSettings, setNonSleeperRosterSettings = _s.setNonSleeperRosterSettings, ppr = _s.ppr, setPpr = _s.setPpr, teBonus = _s.teBonus, setTeBonus = _s.setTeBonus, numRosters = _s.numRosters, setNumRosters = _s.setNumRosters, taxiSlots = _s.taxiSlots, setTaxiSlots = _s.setTaxiSlots, teamName = _s.teamName, setTeamName = _s.setTeamName, setSearchParams = _s.setSearchParams;
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
                    <material_1.MenuItem value={''} key={'chooseamodule'}>
                        Choose a module:
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Unified} key={'unified'}>
                        Unified
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.BigBoy} key={'bigboy'}>
                        Big Boy
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Cornerstone} key={'cornerstones'}>
                        Cornerstones
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.LookToTrade} key={'looktotrade'}>
                        Look to Trade
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.PlayersToTarget} key={'playerstotarget'}>
                        Players to Target
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Settings} key={'settings'}>
                        Settings
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.Starters} key={'starters'}>
                        Starters
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.PositionalGrades} key={'positionalgrades'}>
                        Positional Grades
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.DepthScore} key={'depthscore'}>
                        Depth Score
                    </material_1.MenuItem>
                    <material_1.MenuItem value={Module.WaiverTargets} key={'waivertargets'}>
                        Waiver Targets
                    </material_1.MenuItem>
                </material_1.Select>
            </material_1.FormControl>);
    }
    function rosterComponent() {
        if (!playerData)
            return <></>;
        return roster === null || roster === void 0 ? void 0 : roster.players.map(function (playerId) { return playerData[playerId]; }).filter(function (player) { return !!player; }).sort(sortByAdp).map(function (player) {
            return (<div>{"".concat(player.position, " - ").concat(player.first_name, " ").concat(player.last_name)}</div>);
        });
    }
    function settingsComponent() {
        var _a, _b, _c, _d, _e, _f;
        if (!playerData)
            return <></>;
        var scoringSettings = league === null || league === void 0 ? void 0 : league.scoring_settings;
        if (!scoringSettings)
            return <></>;
        var wrtFlex = (_a = rosterSettings.get(fantasy_1.FLEX)) !== null && _a !== void 0 ? _a : 0;
        var wrFlex = (_b = rosterSettings.get(fantasy_1.WR_RB_FLEX)) !== null && _b !== void 0 ? _b : 0;
        var wtFlex = (_c = rosterSettings.get(fantasy_1.WR_TE_FLEX)) !== null && _c !== void 0 ? _c : 0;
        return (<div>
                <div>QB: {rosterSettings.get(fantasy_1.QB)}</div>
                <div>RB: {rosterSettings.get(fantasy_1.RB)}</div>
                <div>WR: {rosterSettings.get(fantasy_1.WR)}</div>
                <div>TE: {rosterSettings.get(fantasy_1.TE)}</div>
                <div>FLEX: {wrtFlex + wrFlex + wtFlex}</div>
                <div>BN: {rosterSettings.get(fantasy_1.BENCH)}</div>
                <div>TEAMS: {(_d = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _d !== void 0 ? _d : 0}</div>
                <div>SF: {rosterSettings.has(fantasy_1.SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {(_e = scoringSettings.rec) !== null && _e !== void 0 ? _e : 0}</div>
                <div>TEP: {(_f = scoringSettings.bonus_rec_te) !== null && _f !== void 0 ? _f : 0}</div>
                <div>TAXI: {league.settings.taxi_slots}</div>
            </div>);
    }
    function unifiedView() {
        var _a, _b, _c;
        var hasId = hasTeamId();
        if (!hasId)
            return <></>;
        return (<>
                <div className={BlueprintGenerator_module_css_1.default.offScreen}>
                    <CornerstoneModule_1.GraphicComponent cornerstones={cornerstones} graphicComponentClass={'cornerstoneGraphic'} transparent={false}/>
                    <LookToTradeModule_1.GraphicComponent inReturn={inReturn} playersToTrade={playersToTrade} graphicComponentClass={'lookToTradeGraphic'} transparent={false}/>
                    <PlayersToTargetModule_1.GraphicComponent playerSuggestions={playerSuggestions} graphicComponentClass={'playersToTargetGraphic'} transparent={false}/>
                    <Settings_1.GraphicComponent numRosters={(_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0} graphicComponentClass="settingsGraphic" transparent={false}/>
                    <Starters_1.StartersGraphic startingLineup={startingLineup} transparent={false} graphicComponentClass={'startersGraphic'}/>
                    <PositionalGrades_1.GraphicComponent overrides={positionalGradeOverrides} roster={roster} graphicComponentClass={'positionalGradesGraphic'} transparent={false} isSuperFlex={isSuperFlex} leagueSize={(_b = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _b !== void 0 ? _b : 0}/>
                    <DepthScore_1.GraphicComponent override={depthScoreOverride} graphicComponentClass={'depthScoreGraphic'} transparent={false} bench={bench} benchString={benchString}/>
                </div>
                <material_1.Grid container spacing={1}>
                    <material_1.Grid item xs={6}>
                        <div className={BlueprintGenerator_module_css_1.default.inputModule}>
                            Cornerstones:
                            <CornerstoneModule_1.AllPositionalSelectors cornerstones={cornerstones} setCornerstones={setCornerstones} roster={roster}/>
                        </div>
                    </material_1.Grid>
                    <material_1.Grid item xs={3}>
                        <div className={BlueprintGenerator_module_css_1.default.inputModule}>
                            Players to Target:
                            <PlayersToTargetModule_1.InputComponent playerSuggestions={playerSuggestions} setPlayerSuggestions={setPlayerSuggestions}/>
                        </div>
                    </material_1.Grid>
                    <material_1.Grid item xs={3}>
                        <div className={BlueprintGenerator_module_css_1.default.inputModule}>
                            Positional Grade Override:
                            <PositionalGrades_1.OverrideComponent overrides={positionalGradeOverrides} setOverrides={setPositionalGradeOverrides} isSuperFlex={isSuperFlex} leagueSize={(_c = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _c !== void 0 ? _c : 0} roster={roster}/>
                        </div>
                    </material_1.Grid>
                    <material_1.Grid item xs={6}>
                        <div className={BlueprintGenerator_module_css_1.default.inputModule}>
                            Look to Trade:
                            <LookToTradeModule_1.InputComponent playersToTrade={playersToTrade} setPlayersToTrade={setPlayersToTrade} inReturn={inReturn} setInReturn={setInReturn} roster={roster}/>
                        </div>
                    </material_1.Grid>
                    <material_1.Grid item xs={2}>
                        <div className={BlueprintGenerator_module_css_1.default.inputModule}>
                            Depth Score Override:
                            <DepthScore_1.OverrideComponent override={depthScoreOverride} setOverride={setDepthScoreOverride} roster={roster}/>
                        </div>
                    </material_1.Grid>
                    <material_1.Grid item xs={4} className={BlueprintGenerator_module_css_1.default.extraInfo}>
                        <div>{rosterComponent()}</div>
                        <div style={{ textAlign: 'end' }}>
                            {settingsComponent()}
                        </div>
                    </material_1.Grid>
                </material_1.Grid>
            </>);
    }
    return (<div className={BlueprintGenerator_module_css_1.default.blueprintPage}>
            {!leagueId && (<>
                    <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                        <material_1.TextField value={inputValue} onChange={function (e) { return setInputValue(e.target.value); }} onKeyDown={function (e) {
                if (e.key === 'Enter') {
                    setLeagueId(inputValue);
                }
            }} label="Sleeper ID"/>
                        <material_1.Button variant="outlined" onClick={function () { return setLeagueId(inputValue); }} disabled={!inputValue}>
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
                setInputValue('');
                setLeagueId('');
            }} style={{ width: '180px' }}>
                        {'New League'}
                    </material_1.Button>
                    {<TeamPage_1.TeamSelectComponent teamId={teamId} setTeamId={setTeamId} allUsers={allUsers} specifiedUser={specifiedUser} style={{
                    margin: '4px',
                    maxWidth: '800px',
                }}/>}
                </>)}
            {moduleSelectComponent()}
            {module === Module.Unified && (<ExportButton_1.default className={[
                'cornerstoneGraphic',
                'lookToTradeGraphic',
                'playersToTargetGraphic',
                'settingsGraphic',
                'startersGraphic',
                'positionalGradesGraphic',
                'depthScoreGraphic',
            ]} zipName={teamName}/>)}
            {module === Module.Unified && unifiedView()}
            {hasTeamId() && module === Module.Cornerstone && (<CornerstoneModule_1.CornerstoneModule roster={roster} teamName={teamName}/>)}
            {hasTeamId() && module === Module.LookToTrade && (<LookToTradeModule_1.LookToTradeModule roster={roster} teamName={teamName}/>)}
            {hasTeamId() && module === Module.PlayersToTarget && (<PlayersToTargetModule_1.PlayersToTargetModule teamName={teamName}/>)}
            {hasTeamId() && module === Module.Settings && (<Settings_1.Settings roster={roster} leagueId={leagueId} numRosters={(_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0} teamName={teamName}/>)}
            {hasTeamId() && module === Module.Starters && (<Starters_1.StartersModule roster={roster} teamName={teamName}/>)}
            {hasTeamId() && module === Module.PositionalGrades && (<PositionalGrades_1.PositionalGrades roster={roster} teamName={teamName} isSuperFlex={isSuperFlex} leagueSize={(_b = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _b !== void 0 ? _b : 0}/>)}
            {hasTeamId() && module === Module.DepthScore && (<DepthScore_1.DepthScore roster={roster} teamName={teamName}/>)}
            {module === Module.BigBoy && (<BigBoy_1.default roster={roster} teamName={teamName} numRosters={numRosters}/>)}
            {hasTeamId() && module === Module.WaiverTargets && (<WaiverTargets_1.default />)}
        </div>);
}
