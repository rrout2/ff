"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Infinite;
var Infinite_module_css_1 = require("./Infinite.module.css");
var images_1 = require("../../../../consts/images");
var hooks_1 = require("../../../../hooks/hooks");
var Starters_1 = require("../../v1/modules/Starters/Starters");
var PositionalGrades_1 = require("../../v1/modules/PositionalGrades/PositionalGrades");
var CornerstoneModule_1 = require("../../v1/modules/cornerstone/CornerstoneModule");
var sleeper_api_1 = require("../../../../sleeper-api/sleeper-api");
var ExportButton_1 = require("../../shared/ExportButton");
var RosterTier_1 = require("../RosterTier/RosterTier");
var BuySellHold_1 = require("../BuySellHold/BuySellHold");
var fantasy_1 = require("../../../../consts/fantasy");
var TeamPage_1 = require("../../../Team/TeamPage/TeamPage");
var react_1 = require("react");
var urlParams_1 = require("../../../../consts/urlParams");
function Infinite() {
    var _a, _b;
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _c = (0, hooks_1.useTeamIdFromUrl)(), teamId = _c[0], setTeamId = _c[1];
    var userId = (0, hooks_1.useUserIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var _d = (0, hooks_1.useRoster)(rosters, teamId, leagueId), roster = _d.roster, user = _d.user, setRoster = _d.setRoster;
    var cornerstones = (0, CornerstoneModule_1.useCornerstones)(roster).cornerstones;
    var _e = (0, react_1.useState)([]), allUsers = _e[0], setAllUsers = _e[1];
    var _f = (0, react_1.useState)(), specifiedUser = _f[0], setSpecifiedUser = _f[1];
    var _g = (0, react_1.useState)(false), isNonSleeper = _g[0], setIsNonSleeper = _g[1];
    var _h = (0, react_1.useState)([]), buys = _h[0], setBuys = _h[1];
    var getAdp = (0, hooks_1.useAdpData)().getAdp;
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
    (0, react_1.useEffect)(function () {
        if (!allUsers.length || !userId) {
            return;
        }
        var userIndex = allUsers.findIndex(function (u) { return u.user_id === userId; });
        setTeamId('' + userIndex);
        setSpecifiedUser(allUsers[userIndex]);
    }, [allUsers, userId]);
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
    var _j = (0, hooks_1.useNonSleeper)(rosters, specifiedUser, setRoster), nonSleeperRosterSettings = _j.nonSleeperRosterSettings, numRosters = _j.numRosters, nonSleeperTeamName = _j.teamName;
    var _k = (0, hooks_1.useProjectedLineup)(isNonSleeper ? nonSleeperRosterSettings : rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _k.startingLineup, benchString = _k.benchString, setStartingLineup = _k.setStartingLineup;
    (0, react_1.useEffect)(function () {
        setStartingLineup(startingLineup.slice(0, 14));
    }, [startingLineup.length]);
    (0, react_1.useEffect)(function () {
        setIsNonSleeper(!leagueId);
    }, [leagueId]);
    var getVerdict = (0, hooks_1.useBuySellData)().getVerdict;
    var _l = (0, react_1.useState)(0), buyPercent = _l[0], setBuyPercent = _l[1];
    var _m = (0, react_1.useState)(0), sellPercent = _m[0], setSellPercent = _m[1];
    var _o = (0, react_1.useState)(0), holdPercent = _o[0], setHoldPercent = _o[1];
    var playerData = (0, hooks_1.usePlayerData)();
    (0, react_1.useEffect)(function () {
        if (!(roster === null || roster === void 0 ? void 0 : roster.players) || !playerData)
            return;
        var verdicts = roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(function (p) { return !!p && getAdp("".concat(p.first_name, " ").concat(p.last_name)) <= 144; })
            .map(function (p) { return getVerdict("".concat(p.first_name, " ").concat(p.last_name)); })
            .filter(function (v) { return !!v; });
        setBuyPercent(Math.round((100 *
            verdicts.filter(function (v) { return v && v.verdict.includes('Buy'); })
                .length) /
            verdicts.length));
        setSellPercent(Math.round((100 *
            verdicts.filter(function (v) { return v && v.verdict.includes('Sell'); })
                .length) /
            verdicts.length));
        setHoldPercent(Math.round((100 *
            verdicts.filter(function (v) { return v && v.verdict.includes('Hold'); })
                .length) /
            verdicts.length));
    }, [roster, playerData, getVerdict]);
    var currentDate = new Date();
    var isSuperFlex = !isNonSleeper
        ? rosterSettings.has(fantasy_1.SUPER_FLEX) || ((_a = rosterSettings.get(fantasy_1.QB)) !== null && _a !== void 0 ? _a : 0) > 1
        : nonSleeperRosterSettings.has(fantasy_1.SUPER_FLEX) ||
            ((_b = nonSleeperRosterSettings.get(fantasy_1.QB)) !== null && _b !== void 0 ? _b : 0) > 1;
    var tier = (0, RosterTier_1.useRosterTierAndPosGrades)(isSuperFlex, numRosters, roster).tier;
    function hasTeamId() {
        return teamId !== '' && teamId !== urlParams_1.NONE_TEAM_ID;
    }
    function getBenchStringClass() {
        var longBenchString = benchString.length >= 440;
        var mediumBenchString = benchString.length >= 321;
        return "".concat(Infinite_module_css_1.default.benchStringGraphic, " ").concat(longBenchString
            ? Infinite_module_css_1.default.benchStringGraphicSmallest
            : mediumBenchString
                ? Infinite_module_css_1.default.benchStringGraphicSmaller
                : '');
    }
    return (<>
            <ExportButton_1.default className={Infinite_module_css_1.default.fullBlueprint} pngName={"".concat((0, sleeper_api_1.getTeamName)(user), "_infinite.png")} disabled={startingLineup.every(function (_a) {
            var player = _a.player;
            return player.first_name === '';
        })}/>
            {leagueId && (<TeamPage_1.TeamSelectComponent teamId={teamId} setTeamId={setTeamId} allUsers={allUsers} specifiedUser={specifiedUser} style={{
                margin: '4px',
                maxWidth: '800px',
            }}/>)}
            <span>{buys.map(function (b) { return b.playerId; }).join(',')}</span>
            <div className={Infinite_module_css_1.default.fullBlueprint}>
                <div className={Infinite_module_css_1.default.startersGraphic}>
                    <Starters_1.StartersGraphic startingLineup={startingLineup} transparent={true} infinite/>
                </div>
                <div className={Infinite_module_css_1.default.cornerstoneGraphic}>
                    <CornerstoneModule_1.GraphicComponent cornerstones={cornerstones} transparent={true}/>
                </div>
                <div className={getBenchStringClass()}>{benchString}</div>
                <TeamNameComponent teamName={isNonSleeper ? nonSleeperTeamName : (0, sleeper_api_1.getTeamName)(user)}/>
                <div className={Infinite_module_css_1.default.positionalGradesGraphic}>
                    <PositionalGrades_1.GraphicComponent transparent={true} roster={roster} isSuperFlex={isSuperFlex} leagueSize={numRosters} numStarters={startingLineup.length}/>
                </div>
                <div className={Infinite_module_css_1.default.rosterTierGraphic}>
                    <RosterTier_1.default isSuperFlex={isSuperFlex} leagueSize={numRosters} roster={roster}/>
                </div>
                <BuySellHoldComponent isSuperFlex={isSuperFlex} leagueSize={numRosters} roster={roster} setBuys={setBuys}/>
                <div className={Infinite_module_css_1.default.monthYear}>
                    {currentDate.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
        })}
                </div>
                <div className={"".concat(Infinite_module_css_1.default.buys, " ").concat(Infinite_module_css_1.default.marketValueAnalysis)}>
                    BUYS: {buyPercent}%
                </div>
                <div className={"".concat(Infinite_module_css_1.default.sells, " ").concat(Infinite_module_css_1.default.marketValueAnalysis)}>
                    SELLS: {sellPercent}%
                </div>
                <div className={"".concat(Infinite_module_css_1.default.holds, " ").concat(Infinite_module_css_1.default.marketValueAnalysis)}>
                    HOLDS: {holdPercent}%
                </div>
                <div className={"".concat(Infinite_module_css_1.default.buys, " ").concat(Infinite_module_css_1.default.bshComment)}>
                    Players domain has ranked higher than market
                </div>
                <div className={"".concat(Infinite_module_css_1.default.sells, " ").concat(Infinite_module_css_1.default.bshComment)}>
                    Players domain has ranked lower than market
                </div>
                <div className={"".concat(Infinite_module_css_1.default.holds, " ").concat(Infinite_module_css_1.default.bshComment)}>
                    Players domain has ranked equal to market
                </div>
                <div className={Infinite_module_css_1.default.tradeMeterGraphic}>
                    <TradeMeterComponent sellPercent={sellPercent} tier={tier}/>
                </div>
                <img src={images_1.domainLogo} className={Infinite_module_css_1.default.domainLogo}/>
                <img src={images_1.blankInfiniteV4} className={Infinite_module_css_1.default.blankBp}/>
            </div>
        </>);
}
var TradeMeterComponent = function (_a) {
    var sellPercent = _a.sellPercent, tier = _a.tier;
    var activity = 'low';
    var rotationDegrees = 0;
    switch (tier) {
        case RosterTier_1.RosterTier.Elite:
            if (sellPercent > 49) {
                activity = 'mid';
            }
            else if (sellPercent > 19) {
                activity = 'lowmid';
            }
            else {
                activity = 'low';
            }
            break;
        case RosterTier_1.RosterTier.Championship:
            if (sellPercent > 49) {
                activity = 'midhigh';
            }
            else if (sellPercent > 39) {
                activity = 'mid';
            }
            else if (sellPercent > 19) {
                activity = 'lowmid';
            }
            else {
                activity = 'low';
            }
            break;
        case RosterTier_1.RosterTier.Competitive:
            if (sellPercent > 49) {
                activity = 'high';
            }
            else if (sellPercent > 39) {
                activity = 'midhigh';
            }
            else if (sellPercent > 19) {
                activity = 'mid';
            }
            else if (sellPercent > 9) {
                activity = 'lowmid';
            }
            else {
                activity = 'low';
            }
            break;
        case RosterTier_1.RosterTier.Reload:
            if (sellPercent > 39) {
                activity = 'high';
            }
            else if (sellPercent > 19) {
                activity = 'midhigh';
            }
            else if (sellPercent > 9) {
                activity = 'mid';
            }
            else {
                activity = 'lowmid';
            }
            break;
        case RosterTier_1.RosterTier.Rebuild:
            if (sellPercent > 19) {
                activity = 'high';
            }
            else if (sellPercent > 9) {
                activity = 'midhigh';
            }
            else {
                activity = 'mid';
            }
            break;
    }
    switch (activity) {
        case 'high':
            rotationDegrees = 30;
            break;
        case 'midhigh':
            rotationDegrees = 0;
            break;
        case 'mid':
            rotationDegrees = -33;
            break;
        case 'lowmid':
            rotationDegrees = -71;
            break;
        case 'low':
            rotationDegrees = -100;
            break;
    }
    return (<div className={Infinite_module_css_1.default.tradeMeter}>
            <img src={images_1.tradeMeterNeedle} className={Infinite_module_css_1.default.tradeMeterNeedle} style={{ transform: "rotate(".concat(rotationDegrees, "deg)") }}/>
            <img src={images_1.tradeMeterButton} className={Infinite_module_css_1.default.tradeMeterButton}/>
        </div>);
};
var countEmojis = function (str) {
    // This regex matches most emoji patterns including:
    // - Single unicode emojis
    // - Compound emojis (e.g. family combinations)
    // - Emojis with skin tone modifiers
    var emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
    return (str.match(emojiRegex) || []).length;
};
var TeamNameComponent = function (_a) {
    var teamName = _a.teamName;
    if (!teamName)
        return <></>;
    // Emojis count as 2 characters since they are wider.
    var teamNameSize = teamName.length + countEmojis(teamName);
    var longName = teamNameSize >= 14 && teamNameSize < 23;
    var veryLongName = teamNameSize >= 23;
    return (<div className={"".concat(Infinite_module_css_1.default.teamNameGraphic, " ").concat(longName ? Infinite_module_css_1.default.smallerTeamName : '', " ").concat(veryLongName ? Infinite_module_css_1.default.smallestTeamName : '')}>
            {teamName}
        </div>);
};
var BuySellHoldComponent = function (_a) {
    var isSuperFlex = _a.isSuperFlex, leagueSize = _a.leagueSize, roster = _a.roster, setBuys = _a.setBuys;
    var _b = (0, BuySellHold_1.useBuySells)(isSuperFlex, leagueSize, roster), buys = _b.buys, sells = _b.sells;
    (0, react_1.useEffect)(function () {
        if (setBuys) {
            setBuys(buys);
        }
    }, [setBuys, buys]);
    var column1 = '640px';
    var column2 = '1002px';
    var row1 = '1102px';
    var row2 = '1246px';
    var row3 = '1478px';
    return (<>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column1, top: row1 }}>
                <BuySellHold_1.BuySellTile {...buys[0]}/>
            </div>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column1, top: row2 }}>
                <BuySellHold_1.BuySellTile {...buys[1]}/>
            </div>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column2, top: row1 }}>
                <BuySellHold_1.BuySellTile {...buys[2]}/>
            </div>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column2, top: row2 }}>
                <BuySellHold_1.BuySellTile {...buys[3]}/>
            </div>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column1, top: row3 }}>
                <BuySellHold_1.BuySellTile {...sells[0]}/>
            </div>
            <div className={Infinite_module_css_1.default.buySellHoldGraphic} style={{ left: column2, top: row3 }}>
                <BuySellHold_1.BuySellTile {...sells[1]}/>
            </div>
        </>);
};
