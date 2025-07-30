"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NflTeam;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var hooks_1 = require("../../hooks/hooks");
var PlayerPreview_1 = require("../Player/PlayerPreview/PlayerPreview");
var urlParams_1 = require("../../consts/urlParams");
var material_1 = require("@mui/material");
var NflTeam_module_css_1 = require("./NflTeam.module.css");
var Menu_1 = require("../Menu/Menu");
// dynasty-ff#/nfl?teamCode=...&leagueId=...
function NflTeam() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(''), teamCode = _b[0], setTeamCode = _b[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _c = (0, react_1.useState)([]), teamPlayers = _c[0], setTeamPlayers = _c[1];
    var playerData = (0, hooks_1.usePlayerData)();
    (0, react_1.useEffect)(function () {
        var _a;
        setTeamCode((_a = searchParams.get(urlParams_1.TEAM_CODE)) !== null && _a !== void 0 ? _a : 'Choose a team:');
    }, [searchParams]);
    (0, react_1.useEffect)(function () {
        if (!teamCode || teamCode === 'Choose a team:') {
            setTeamPlayers([]);
            return;
        }
        var players = [];
        for (var playerId in playerData) {
            var player = playerData[playerId];
            if (player.team === teamCode) {
                players.push(player);
            }
        }
        players.sort(function (playerA, playerB) {
            // 1) By NFL position
            var posSort = playerA.position.localeCompare(playerB.position);
            if (posSort)
                return posSort;
            // 2) By depth chart position
            if (playerB.depth_chart_order && playerA.depth_chart_order) {
                return playerA.depth_chart_order - playerB.depth_chart_order;
            }
            // 3) Prefer non-null depth chart positions
            if (!playerB.depth_chart_order || !playerA.depth_chart_order) {
                if (playerA.depth_chart_order)
                    return -1;
                if (playerB.depth_chart_order)
                    return 1;
            }
            // 4) Same NFL position + null depth chart position
            return 0;
        });
        setTeamPlayers(players);
    }, [playerData, teamCode]);
    function rosterComponent() {
        return teamPlayers.map(function (p) { return (<PlayerPreview_1.default player={p} leagueId={leagueId}/>); });
    }
    function inputComponent() {
        return (<material_1.FormControl>
                <material_1.InputLabel>Team</material_1.InputLabel>
                <material_1.Select value={teamCode} label="Team" onChange={function (event) {
                setTeamCode(event.target.value);
                setSearchParams(function (searchParams) {
                    searchParams.set(urlParams_1.TEAM_CODE, event.target.value);
                    return searchParams;
                });
            }}>
                    <material_1.MenuItem value={'Choose a team:'}>Choose a team:</material_1.MenuItem>
                    <material_1.MenuItem value={'ARI'}>ARI</material_1.MenuItem>
                    <material_1.MenuItem value={'ATL'}>ATL</material_1.MenuItem>
                    <material_1.MenuItem value={'BAL'}>BAL</material_1.MenuItem>
                    <material_1.MenuItem value={'BUF'}>BUF</material_1.MenuItem>
                    <material_1.MenuItem value={'CAR'}>CAR</material_1.MenuItem>
                    <material_1.MenuItem value={'CHI'}>CHI</material_1.MenuItem>
                    <material_1.MenuItem value={'CIN'}>CIN</material_1.MenuItem>
                    <material_1.MenuItem value={'CLE'}>CLE</material_1.MenuItem>
                    <material_1.MenuItem value={'DAL'}>DAL</material_1.MenuItem>
                    <material_1.MenuItem value={'DEN'}>DEN</material_1.MenuItem>
                    <material_1.MenuItem value={'DET'}>DET</material_1.MenuItem>
                    <material_1.MenuItem value={'GB'}>GB</material_1.MenuItem>
                    <material_1.MenuItem value={'HOU'}>HOU</material_1.MenuItem>
                    <material_1.MenuItem value={'IND'}>IND</material_1.MenuItem>
                    <material_1.MenuItem value={'JAX'}>JAX</material_1.MenuItem>
                    <material_1.MenuItem value={'KC'}>KC</material_1.MenuItem>
                    <material_1.MenuItem value={'LV'}>LV</material_1.MenuItem>
                    <material_1.MenuItem value={'LAC'}>LAC</material_1.MenuItem>
                    <material_1.MenuItem value={'LAR'}>LAR</material_1.MenuItem>
                    <material_1.MenuItem value={'MIA'}>MIA</material_1.MenuItem>
                    <material_1.MenuItem value={'MIN'}>MIN</material_1.MenuItem>
                    <material_1.MenuItem value={'NE'}>NE</material_1.MenuItem>
                    <material_1.MenuItem value={'NO'}>NO</material_1.MenuItem>
                    <material_1.MenuItem value={'NYG'}>NYG</material_1.MenuItem>
                    <material_1.MenuItem value={'NYJ'}>NYJ</material_1.MenuItem>
                    <material_1.MenuItem value={'PHI'}>PHI</material_1.MenuItem>
                    <material_1.MenuItem value={'PIT'}>PIT</material_1.MenuItem>
                    <material_1.MenuItem value={'SF'}>SF</material_1.MenuItem>
                    <material_1.MenuItem value={'SEA'}>SEA</material_1.MenuItem>
                    <material_1.MenuItem value={'TB'}>TB</material_1.MenuItem>
                    <material_1.MenuItem value={'TEN'}>TEN</material_1.MenuItem>
                    <material_1.MenuItem value={'WAS'}>WAS</material_1.MenuItem>
                </material_1.Select>
            </material_1.FormControl>);
    }
    return (<div className={NflTeam_module_css_1.default.nflTeam}>
            <div className={NflTeam_module_css_1.default.menuWrapper}>
                <div className={NflTeam_module_css_1.default.flexSpace}/>
                <div>{inputComponent()}</div>
                <div className={NflTeam_module_css_1.default.flexSpace}>
                    <Menu_1.default />
                </div>
            </div>

            {rosterComponent()}
        </div>);
}
