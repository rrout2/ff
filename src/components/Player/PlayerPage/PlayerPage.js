"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var hooks_1 = require("../../../hooks/hooks");
var PlayerPage_module_css_1 = require("./PlayerPage.module.css");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var urlParams_1 = require("../../../consts/urlParams");
var Menu_1 = require("../../Menu/Menu");
// /dynasty-ff#/player?playerId=...&leagueId=...
function PlayerPage() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    var _a = (0, react_1.useState)(''), playerId = _a[0], setPlayerId = _a[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _b = (0, react_1.useState)(''), teamId = _b[0], setTeamId = _b[1];
    var player = (0, hooks_1.usePlayer)(playerId);
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var _c = (0, hooks_1.useFetchUser)(teamId, rosters), user = _c.data, isFetchUserLoading = _c.isLoading;
    // O(N * M)
    function findRoster() {
        if (!rosters)
            return -1;
        return rosters.findIndex(function (roster) {
            var _a;
            return roster.players.includes((_a = player === null || player === void 0 ? void 0 : player.player_id) !== null && _a !== void 0 ? _a : '');
        });
    }
    (0, react_1.useEffect)(function () {
        var _a;
        setPlayerId((_a = searchParams.get(urlParams_1.PLAYER_ID)) !== null && _a !== void 0 ? _a : '');
    }, [searchParams]);
    (0, react_1.useEffect)(function () {
        if (teamId !== '' || !leagueId || !player)
            return;
        setTeamId(findRoster().toString());
    }, [leagueId, teamId, player === null || player === void 0 ? void 0 : player.player_id]);
    return (<div className={PlayerPage_module_css_1.default.playerPage}>
            <div className={PlayerPage_module_css_1.default.flexSpace}>
                <material_1.IconButton onClick={function () {
            navigate("search?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }}>
                    <icons_material_1.Search />
                </material_1.IconButton>
            </div>

            <div className={PlayerPage_module_css_1.default.playerProfile}>
                {player && (<img className={PlayerPage_module_css_1.default.headshot} src={"https://sleepercdn.com/content/nfl/players/thumb/".concat(player.player_id, ".jpg")} onError={function (_a) {
                var currentTarget = _a.currentTarget;
                currentTarget.onerror = null;
                currentTarget.src =
                    'https://sleepercdn.com/images/v2/icons/player_default.webp';
            }}/>)}
                <div>
                    {player === null || player === void 0 ? void 0 : player.first_name} {player === null || player === void 0 ? void 0 : player.last_name}
                </div>
                <div>
                    {player === null || player === void 0 ? void 0 : player.position}
                    {player === null || player === void 0 ? void 0 : player.depth_chart_order} on {player === null || player === void 0 ? void 0 : player.team}
                </div>
                <div>{player === null || player === void 0 ? void 0 : player.status}</div>
                <div>Age: {player === null || player === void 0 ? void 0 : player.age}</div>
                <div>Year: {player === null || player === void 0 ? void 0 : player.years_exp}</div>
                <div>{player === null || player === void 0 ? void 0 : player.college}</div>
                {!!player && (<material_1.Button endIcon={<icons_material_1.OpenInNew />} onClick={function () {
                window.open("https://www.google.com/search?q=".concat(player === null || player === void 0 ? void 0 : player.first_name, "+").concat(player === null || player === void 0 ? void 0 : player.last_name, "&tbm=nws"), '_blank');
            }} variant="outlined">
                        News
                    </material_1.Button>)}
                {!!player && (<material_1.Button onClick={function () {
                navigate("../nfl?".concat(urlParams_1.TEAM_CODE, "=").concat(player === null || player === void 0 ? void 0 : player.team, "&").concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
            }} variant="outlined">
                        View {player === null || player === void 0 ? void 0 : player.team} Depth Chart
                    </material_1.Button>)}
                {!isFetchUserLoading && (<material_1.Button onClick={function () {
                navigate("../team?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId, "&").concat(urlParams_1.TEAM_ID, "=").concat(teamId));
            }} variant="outlined" disabled={!user}>
                        {user
                ? "View ".concat(user === null || user === void 0 ? void 0 : user.display_name, "'s Full Team")
                : 'View Full Team'}
                    </material_1.Button>)}
            </div>
            <div className={"".concat(PlayerPage_module_css_1.default.flexSpace, " ").concat(PlayerPage_module_css_1.default.menuIcon)}>
                <Menu_1.default />
            </div>
        </div>);
}
