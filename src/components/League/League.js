"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeaguePage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var sleeper_api_1 = require("../../sleeper-api/sleeper-api");
var League_module_css_1 = require("./League.module.css");
var TeamPreview_1 = require("../Team/TeamPreview/TeamPreview");
var material_1 = require("@mui/material");
var urlParams_1 = require("../../consts/urlParams");
var Menu_1 = require("../Menu/Menu");
var hooks_1 = require("../../hooks/hooks");
var icons_material_1 = require("@mui/icons-material");
// dynasty-ff/#league?leagueId=...
function LeaguePage() {
    var setSearchParams = (0, react_router_dom_1.useSearchParams)()[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _a = (0, react_1.useState)(''), input = _a[0], setInput = _a[1];
    var league = (0, hooks_1.useLeague)(leagueId);
    var _b = (0, react_1.useState)([]), rosters = _b[0], setRosters = _b[1];
    (0, react_1.useEffect)(function () {
        if (!leagueId)
            return;
        (0, sleeper_api_1.getRosters)(leagueId).then(function (rosters) { return setRosters(rosters); });
    }, [leagueId]);
    function teamPreviewComponent(roster, index) {
        return (<div key={roster.owner_id}>
                <TeamPreview_1.default roster={roster} index={index} leagueId={leagueId}/>
            </div>);
    }
    function inputComponent() {
        return (<>
                <material_1.FormControl>
                    <material_1.TextField label={'League ID'} margin="normal" onChange={function (event) { return setInput(event.target.value); }} onKeyUp={function (e) {
                if (e.key !== 'Enter')
                    return;
                setSearchParams(function (searchParams) {
                    searchParams.set(urlParams_1.LEAGUE_ID, input);
                    return searchParams;
                });
            }} autoFocus/>
                </material_1.FormControl>
                <material_1.Button variant="outlined" endIcon={<icons_material_1.OpenInNew />} onClick={function () {
                window.open('https://support.sleeper.com/en/articles/4121798-how-do-i-find-my-league-id', '_blank');
            }}>
                    How to Find Sleeper League ID
                </material_1.Button>
            </>);
    }
    function rostersComponent() {
        return (<div className={League_module_css_1.default.allRosters}>
                {rosters === null || rosters === void 0 ? void 0 : rosters.map(function (roster, index) {
                return teamPreviewComponent(roster, index);
            })}
            </div>);
    }
    return (<div className={League_module_css_1.default.leaguePage}>
            {!leagueId && inputComponent()}
            <div className={League_module_css_1.default.menuWrapper}>
                <div className={League_module_css_1.default.flexSpace}/>
                <div className={League_module_css_1.default.leagueName}>{league === null || league === void 0 ? void 0 : league.name}</div>
                <div className={League_module_css_1.default.flexSpace}>{!!leagueId && <Menu_1.default />}</div>
            </div>

            {rostersComponent()}
        </div>);
}
