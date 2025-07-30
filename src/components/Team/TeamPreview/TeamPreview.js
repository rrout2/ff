"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamPreview;
var react_1 = require("react");
var sleeper_api_1 = require("../../../sleeper-api/sleeper-api");
var icons_material_1 = require("@mui/icons-material");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var TeamPreview_module_css_1 = require("./TeamPreview.module.css");
var hooks_1 = require("../../../hooks/hooks");
var urlParams_1 = require("../../../consts/urlParams");
function TeamPreview(_a) {
    var roster = _a.roster, index = _a.index, leagueId = _a.leagueId;
    var ownerId = roster.owner_id;
    var isEven = index % 2 === 0;
    var _b = (0, react_1.useState)(), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(false), isExpanded = _c[0], setIsExpanded = _c[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        (0, sleeper_api_1.getUser)(ownerId).then(function (user) { return setUser(user); });
    }, [ownerId]);
    function expandableContent() {
        if (!playerData)
            return <>Loading...</>;
        var players = roster.players;
        return players
            .map(function (p) { return playerData[p]; })
            .sort(function (a, b) {
            return a.position.localeCompare(b.position) ||
                a.last_name.localeCompare(b.last_name);
        })
            .map(function (player) { return (<div key={player.player_id}>
                    {player.position} {player.first_name} {player.last_name}
                </div>); });
    }
    return (<>
            <div className={TeamPreview_module_css_1.default.teamPreviewHeader +
            ' ' +
            (isEven ? TeamPreview_module_css_1.default.even : TeamPreview_module_css_1.default.odd)} onClick={function () {
            navigate("../team?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId, "&").concat(urlParams_1.TEAM_ID, "=").concat(index));
        }}>
                {user && (<img className={TeamPreview_module_css_1.default.avatarThumbnail} src={"https://sleepercdn.com/avatars/thumbs/".concat(user.avatar)}/>)}
                {user === null || user === void 0 ? void 0 : user.display_name}
                <span className={TeamPreview_module_css_1.default.dropdownArrow}>
                    <material_1.IconButton onClick={function (event) {
            event.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
                        {isExpanded && <icons_material_1.ArrowDropUp />}
                        {!isExpanded && <icons_material_1.ArrowDropDown />}
                    </material_1.IconButton>
                </span>
            </div>
            {isExpanded && (<div className={TeamPreview_module_css_1.default.expandableContent}>
                    {expandableContent()}
                </div>)}
        </>);
}
