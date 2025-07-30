"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerPreview;
var urlParams_1 = require("../../../consts/urlParams");
var react_router_dom_1 = require("react-router-dom");
var PlayerPreview_module_css_1 = require("./PlayerPreview.module.css");
function PlayerPreview(_a) {
    var player = _a.player, leagueId = _a.leagueId, _b = _a.hideHeadshot, hideHeadshot = _b === void 0 ? false : _b, _c = _a.clickable, clickable = _c === void 0 ? true : _c;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var playerPath = "../player?".concat(urlParams_1.PLAYER_ID, "=").concat(player.player_id, "&").concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId);
    return (<div key={player.player_id} className={PlayerPreview_module_css_1.default.playerRow +
            ' ' +
            PlayerPreview_module_css_1.default[player.position] +
            (clickable ? " ".concat(PlayerPreview_module_css_1.default.clickable) : '')} onClick={clickable
            ? function () {
                navigate(playerPath);
            }
            : undefined} onKeyUp={function (event) {
            if (event.key !== 'Enter')
                return;
            navigate(playerPath);
        }} tabIndex={0}>
            {!hideHeadshot && (<img className={PlayerPreview_module_css_1.default.headshot} src={"https://sleepercdn.com/content/nfl/players/thumb/".concat(player.player_id, ".jpg")} onError={function (_a) {
                var currentTarget = _a.currentTarget;
                currentTarget.onerror = null;
                currentTarget.src =
                    'https://sleepercdn.com/images/v2/icons/player_default.webp';
            }}/>)}
            {player.position} {player.first_name} {player.last_name}
        </div>);
}
