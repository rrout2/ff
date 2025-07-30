"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Menu;
var hooks_1 = require("../../hooks/hooks");
var material_1 = require("@mui/material");
var Menu_1 = require("@mui/icons-material/Menu");
var react_1 = require("react");
var material_2 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var urlParams_1 = require("../../consts/urlParams");
function Menu() {
    var _a = (0, react_1.useState)(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleClick = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleClose = function () {
        setAnchorEl(null);
    };
    return (<>
            <material_1.IconButton onClick={handleClick}>
                <Menu_1.default />
            </material_1.IconButton>
            <material_2.Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose} MenuListProps={{
            'aria-labelledby': 'basic-button',
        }}>
                <material_2.MenuItem onClick={function () {
            navigate("../league?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }}>
                    League
                </material_2.MenuItem>
                <material_2.MenuItem onClick={function () {
            navigate("../team?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId, "&").concat(urlParams_1.TEAM_ID, "=").concat(urlParams_1.NONE_TEAM_ID));
        }}>
                    Team
                </material_2.MenuItem>
                <material_2.MenuItem onClick={function () {
            navigate("../player/search?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }}>
                    Player Search
                </material_2.MenuItem>
                <material_2.MenuItem onClick={function () {
            navigate("../nfl?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }}>
                    NFL Depth Charts
                </material_2.MenuItem>
                <material_2.MenuItem onClick={function () {
            navigate("../transactions?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId));
        }}>
                    Transaction Log
                </material_2.MenuItem>
                <material_2.MenuItem onClick={function () {
            navigate("../league?".concat(urlParams_1.LEAGUE_ID, "="));
        }}>
                    View New League
                </material_2.MenuItem>
            </material_2.Menu>
        </>);
}
