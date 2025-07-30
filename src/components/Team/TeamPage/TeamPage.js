"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamPage;
exports.TeamSelectComponent = TeamSelectComponent;
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var TeamPage_module_css_1 = require("./TeamPage.module.css");
var react_1 = require("react");
var hooks_1 = require("../../../hooks/hooks");
var urlParams_1 = require("../../../consts/urlParams");
var PlayerPreview_1 = require("../../Player/PlayerPreview/PlayerPreview");
var Menu_1 = require("../../Menu/Menu");
var fantasy_1 = require("../../../consts/fantasy");
// dynasty-ff#/team?leagueId=...&teamId=...
function TeamPage() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var _b = (0, react_1.useState)(''), teamId = _b[0], setTeamId = _b[1];
    var _c = (0, react_1.useState)(), roster = _c[0], setRoster = _c[1];
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _d = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _d.startingLineup, bench = _d.bench;
    (0, react_1.useEffect)(function () {
        var teamIdFromUrl = searchParams.get(urlParams_1.TEAM_ID);
        if (teamIdFromUrl)
            setTeamId(teamIdFromUrl);
    }, [searchParams]);
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    // start fetching all users from league
    var allUsers = (0, hooks_1.useFetchUsers)(rosters).data;
    // fetch specified user, unless already have allUsers
    var fetchedUser = (0, hooks_1.useFetchUser)(teamId, rosters, 
    /* disabled = */ !!allUsers).data;
    var specifiedUser = allUsers ? allUsers[+teamId] : fetchedUser;
    (0, react_1.useEffect)(function () {
        if (!rosters || rosters.length === 0 || !hasTeamId())
            return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);
    (0, react_1.useEffect)(function () {
        if (searchParams.get(urlParams_1.TEAM_ID) === teamId)
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.TEAM_ID, teamId);
            return searchParams;
        });
    }, [teamId]);
    function humanReadablePosition(position) {
        switch (position) {
            case fantasy_1.FLEX:
                return 'WR/RB/TE';
            case fantasy_1.WR_RB_FLEX:
                return 'WR/RB';
            case fantasy_1.WR_TE_FLEX:
                return 'WR/TE';
            case fantasy_1.SUPER_FLEX:
                return 'QB/WR/RB/TE';
        }
        return position;
    }
    function rosterComponent() {
        var projectedStarters = Array.from(startingLineup).map(function (_a) {
            var player = _a.player, position = _a.position;
            return (<div className={TeamPage_module_css_1.default.starterRow}>
                    <div className={TeamPage_module_css_1.default.starterPosition}>
                        {humanReadablePosition(position)}
                    </div>
                    <PlayerPreview_1.default player={player} leagueId={leagueId}/>
                </div>);
        });
        var projectedBench = bench.map(function (p) { return (<div className={TeamPage_module_css_1.default.starterRow}>
                <div className={TeamPage_module_css_1.default.starterPosition}>BN</div>
                <PlayerPreview_1.default player={p} leagueId={leagueId}/>
            </div>); });
        return (<>
                <div>{projectedStarters}</div>
                <div className={TeamPage_module_css_1.default.bench}>{projectedBench}</div>
            </>);
    }
    function returnToLeaguePageButton() {
        return (<material_1.Button variant="outlined" onClick={function () {
                navigate("../league?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
            }}>
                Return to League Page
            </material_1.Button>);
    }
    function hasTeamId() {
        return teamId !== '' && teamId !== urlParams_1.NONE_TEAM_ID;
    }
    return (<div className={TeamPage_module_css_1.default.teamPage}>
            {<div className={TeamPage_module_css_1.default.menuWrapper}>
                    <div className={TeamPage_module_css_1.default.flexSpace}/>
                    <div className={TeamPage_module_css_1.default.teamPageContent}>
                        <div className={TeamPage_module_css_1.default.teamPageRoster}>
                            {(specifiedUser || allUsers) && (<TeamSelectComponent teamId={teamId} setTeamId={setTeamId} allUsers={allUsers} specifiedUser={specifiedUser}/>)}
                            {hasTeamId() && specifiedUser && rosterComponent()}
                            {!specifiedUser && !allUsers && (<material_1.CircularProgress />)}
                        </div>
                    </div>
                    <div className={TeamPage_module_css_1.default.flexSpace}>
                        <Menu_1.default />
                    </div>
                </div>}
            {returnToLeaguePageButton()}
        </div>);
}
function getDisplayName(user) {
    var _a;
    return "".concat(((_a = user === null || user === void 0 ? void 0 : user.metadata) === null || _a === void 0 ? void 0 : _a.team_name) || (user === null || user === void 0 ? void 0 : user.display_name));
}
function TeamSelectComponent(_a) {
    var teamId = _a.teamId, setTeamId = _a.setTeamId, allUsers = _a.allUsers, specifiedUser = _a.specifiedUser, style = _a.style;
    return (<material_1.FormControl style={style}>
            <material_1.InputLabel>Team</material_1.InputLabel>
            <material_1.Select value={teamId} label="Team" onChange={function (event) {
            setTeamId(event.target.value);
        }}>
                <material_1.MenuItem value={urlParams_1.NONE_TEAM_ID} key={'chooseateam'}>
                    Choose a team:
                </material_1.MenuItem>
                {!allUsers && specifiedUser && (<material_1.MenuItem value={teamId} key={teamId}>
                        {getDisplayName(specifiedUser)}
                    </material_1.MenuItem>)}
                {allUsers === null || allUsers === void 0 ? void 0 : allUsers.map(function (u, idx) { return (<material_1.MenuItem value={idx} key={idx}>
                        {getDisplayName(u)}
                    </material_1.MenuItem>); })}
            </material_1.Select>
        </material_1.FormControl>);
}
