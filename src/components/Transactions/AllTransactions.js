"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AllTransactions;
var hooks_1 = require("../../hooks/hooks");
var sleeper_api_1 = require("../../sleeper-api/sleeper-api");
var react_1 = require("react");
var PlayerPreview_1 = require("../Player/PlayerPreview/PlayerPreview");
var AllTransactions_module_css_1 = require("./AllTransactions.module.css");
var Menu_1 = require("../Menu/Menu");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var urlParams_1 = require("../../consts/urlParams");
function AllTransactions() {
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var allUsers = (0, hooks_1.useFetchUsers)(rosters).data;
    var playerData = (0, hooks_1.usePlayerData)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)([]), transactions = _a[0], setTransactions = _a[1];
    (0, react_1.useEffect)(function () {
        if (!leagueId)
            return;
        (0, sleeper_api_1.getTransacations)(leagueId).then(function (txns) { return setTransactions(txns); });
    }, [leagueId]);
    function findUser(userId) {
        if (!allUsers)
            return;
        return allUsers[userId - 1];
    }
    function getAddsByUser(_a) {
        var adds = _a.adds, draft_picks = _a.draft_picks;
        var addsByUser = new Map();
        for (var playerId in adds) {
            var user = findUser(adds[playerId]);
            if (!addsByUser.has(user)) {
                addsByUser.set(user, []);
            }
            addsByUser.set(user, __spreadArray([playerId], addsByUser.get(user), true));
        }
        draft_picks.forEach(function (pick) {
            var user = findUser(pick.owner_id);
            if (!addsByUser.has(user)) {
                addsByUser.set(user, []);
            }
            addsByUser.set(user, __spreadArray([pick], addsByUser.get(user), true));
        });
        return addsByUser;
    }
    function getDropsByUser(_a) {
        var drops = _a.drops, draft_picks = _a.draft_picks;
        var dropsByUser = new Map();
        for (var playerId in drops) {
            var user = findUser(drops[playerId]);
            if (!dropsByUser.has(user)) {
                dropsByUser.set(user, []);
            }
            dropsByUser.set(user, __spreadArray([playerId], dropsByUser.get(user), true));
        }
        draft_picks.forEach(function (pick) {
            var user = findUser(pick.previous_owner_id);
            if (!dropsByUser.has(user)) {
                dropsByUser.set(user, []);
            }
            dropsByUser.set(user, __spreadArray([pick], dropsByUser.get(user), true));
        });
        return dropsByUser;
    }
    function addDropPiece(addDrop) {
        if (!playerData)
            return <></>;
        if (typeof addDrop === 'string') {
            return (<PlayerPreview_1.default player={playerData[addDrop]} leagueId={leagueId} hideHeadshot={true}/>);
        }
        return <div>{"".concat(addDrop.season, " Round ").concat(addDrop.round)}</div>;
    }
    function singleTransactionComponent(t) {
        if (!playerData || !allUsers)
            return <></>;
        var addsByUser = getAddsByUser(t);
        var dropsByUser = getDropsByUser(t);
        if (addsByUser.size === 0)
            return <></>;
        var isWaiverMove = t.roster_ids.length === 1;
        var addedText = isWaiverMove ? 'added' : 'received';
        var droppedText = isWaiverMove ? 'dropped' : 'sent';
        return (<div key={t.transaction_id} className={AllTransactions_module_css_1.default.singleton}>
                {t.roster_ids.map(function (userId, idx) {
                var user = findUser(userId);
                if (!user) {
                    return <></>;
                }
                var adds = addsByUser.get(user);
                var drops = dropsByUser.get(user);
                return (<>
                            <div className={AllTransactions_module_css_1.default.teamLabel +
                        (idx > 0 ? " ".concat(AllTransactions_module_css_1.default.notFirst) : '')} onClick={function () {
                        var teamId = allUsers.findIndex(function (u) { return u.user_id === user.user_id; });
                        navigate("../team?".concat(urlParams_1.LEAGUE_ID, "=").concat(leagueId, "&").concat(urlParams_1.TEAM_ID, "=").concat(teamId));
                    }}>
                                {user.display_name}
                            </div>
                            {!!adds && (<>
                                    {addedText}
                                    {adds.map(addDropPiece)}
                                </>)}
                            {!!drops && (<>
                                    {droppedText}
                                    {drops.map(addDropPiece)}
                                </>)}
                        </>);
            })}
            </div>);
    }
    return (<div className={AllTransactions_module_css_1.default.menuWrapper}>
            <div className={AllTransactions_module_css_1.default.flexSpace}/>
            <div>
                {transactions.map(singleTransactionComponent)}
                {!(playerData && allUsers) && <material_1.CircularProgress />}
            </div>
            <div className={AllTransactions_module_css_1.default.flexSpace}>
                <Menu_1.default />
            </div>
        </div>);
}
