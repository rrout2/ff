"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerSearch;
exports.sortBySearchRank = sortBySearchRank;
var material_1 = require("@mui/material");
var PlayerSearch_module_css_1 = require("./PlayerSearch.module.css");
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var hooks_1 = require("../../../hooks/hooks");
var urlParams_1 = require("../../../consts/urlParams");
var PlayerPreview_1 = require("../PlayerPreview/PlayerPreview");
var Menu_1 = require("../../Menu/Menu");
// dynasty-ff#/player/search?leagueId=...
function PlayerSearch() {
    var _a = (0, react_1.useState)(''), searchInput = _a[0], setSearchInput = _a[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _b = (0, react_1.useState)([]), searchOutputList = _b[0], setSearchOutputList = _b[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        if (!searchInput)
            setSearchOutputList([]);
        var searchResults = new Set();
        for (var playerId in playerData) {
            var player = playerData[playerId];
            if (player.search_full_name &&
                player.search_full_name.includes(searchInput)) {
                searchResults.add(player);
            }
        }
        setSearchOutputList(Array.from(searchResults).sort(sortBySearchRank));
    }, [searchInput]);
    function searchResults() {
        if (!playerData || !searchInput)
            return <>{searchInput}</>;
        return (<>
                {searchOutputList.map(function (player) {
                return (<PlayerPreview_1.default player={player} leagueId={leagueId} hideHeadshot={true}/>);
            })}
            </>);
    }
    return (<div className={PlayerSearch_module_css_1.default.playerSearch}>
            <div className={PlayerSearch_module_css_1.default.menuWrapper}>
                <div className={PlayerSearch_module_css_1.default.flexSpace}/>
                <material_1.TextField className={PlayerSearch_module_css_1.default.input} onChange={function (e) {
            setSearchInput(e.target.value.toLowerCase().replace(/\s/g, ''));
        }} onKeyUp={function (event) {
            if (event.key !== 'Enter')
                return;
            if (searchOutputList.length === 0)
                return;
            navigate("../player?".concat(urlParams_1.PLAYER_ID, "=").concat(searchOutputList[0].player_id, "&").concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }} label={'Search for a player'} autoFocus/>
                <div className={PlayerSearch_module_css_1.default.flexSpace}>
                    <Menu_1.default />
                </div>
            </div>

            {searchResults()}
        </div>);
}
function sortBySearchRank(a, b) {
    return a.search_rank - b.search_rank;
}
