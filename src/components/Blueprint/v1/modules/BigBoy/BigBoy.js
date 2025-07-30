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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchetypeDetails = exports.ARCHETYPE_TO_IMAGE = exports.Archetype = void 0;
exports.default = BigBoy;
exports.DraftCapitalInput = DraftCapitalInput;
var react_1 = require("react");
var images_1 = require("../../../../../consts/images");
var hooks_1 = require("../../../../../hooks/hooks");
var ExportButton_1 = require("../../../shared/ExportButton");
var BigBoy_module_css_1 = require("./BigBoy.module.css");
var RookieDraft_module_css_1 = require("../../../rookieDraft/RookieDraft/RookieDraft.module.css");
var material_1 = require("@mui/material");
var fantasy_1 = require("../../../../../consts/fantasy");
var PositionalGrades_1 = require("../PositionalGrades/PositionalGrades");
var WaiverTargets_1 = require("../WaiverTargets/WaiverTargets");
var LookToTradeModule_1 = require("../looktotrade/LookToTradeModule");
var CornerstoneModule_1 = require("../cornerstone/CornerstoneModule");
var Starters_1 = require("../Starters/Starters");
var DepthScore_1 = require("../DepthScore/DepthScore");
var Settings_1 = require("../settings/Settings");
var PlayersToTargetModule_1 = require("../playerstotarget/PlayersToTargetModule");
var StyledNumberInput_1 = require("../../../shared/StyledNumberInput");
var react_router_dom_1 = require("react-router-dom");
var urlParams_1 = require("../../../../../consts/urlParams");
var RookieDraft_1 = require("../../../rookieDraft/RookieDraft/RookieDraft");
var BuySellHold_1 = require("../../../infinite/BuySellHold/BuySellHold");
var images_2 = require("../../../../../consts/images");
var Add_1 = require("@mui/icons-material/Add");
var Remove_1 = require("@mui/icons-material/Remove");
var Archetype;
(function (Archetype) {
    Archetype["HardRebuild"] = "HARD REBUILD";
    Archetype["FutureValue"] = "FUTURE VALUE";
    Archetype["WellRounded"] = "WELL ROUNDED";
    Archetype["OneYearReload"] = "ONE YEAR RELOAD";
    Archetype["EliteValue"] = "ELITE VALUE";
    Archetype["WRFactory"] = "WR FACTORY";
    Archetype["DualEliteQB"] = "DUAL ELITE QB";
    Archetype["EliteQBTE"] = "ELITE QB/TE";
    Archetype["RBHeavy"] = "RB HEAVY";
})(Archetype || (exports.Archetype = Archetype = {}));
exports.ARCHETYPE_TO_IMAGE = new Map([
    [Archetype.DualEliteQB, images_2.dualEliteQb],
    [Archetype.EliteQBTE, images_2.eliteQbTe],
    [Archetype.EliteValue, images_2.eliteValue],
    [Archetype.FutureValue, images_2.futureValue],
    [Archetype.HardRebuild, images_2.hardRebuild],
    [Archetype.OneYearReload, images_2.oneYearReload],
    [Archetype.RBHeavy, images_2.rbHeavy],
    [Archetype.WellRounded, images_2.wellRounded],
    [Archetype.WRFactory, images_2.wrFactory],
]);
exports.ArchetypeDetails = (_a = {},
    _a[Archetype.HardRebuild] = [['REBUILD', 'REBUILD', 'CONTEND']],
    _a[Archetype.FutureValue] = [['REBUILD', 'CONTEND', 'CONTEND']],
    _a[Archetype.WellRounded] = [['CONTEND', 'CONTEND', 'REBUILD']],
    _a[Archetype.OneYearReload] = [['RELOAD', 'CONTEND', 'CONTEND']],
    _a[Archetype.EliteValue] = [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['CONTEND', 'CONTEND', 'CONTEND'],
    ],
    _a[Archetype.WRFactory] = [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['CONTEND', 'CONTEND', 'REBUILD'],
    ],
    _a[Archetype.DualEliteQB] = [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['REBUILD', 'CONTEND', 'CONTEND'],
    ],
    _a[Archetype.EliteQBTE] = [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['REBUILD', 'CONTEND', 'CONTEND'],
    ],
    _a[Archetype.RBHeavy] = [['CONTEND', 'CONTEND', 'REBUILD']],
    _a);
var ALL_ARCHETYPES = Object.values(Archetype);
function BigBoy(_a) {
    var roster = _a.roster, teamName = _a.teamName, numRosters = _a.numRosters;
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettingsFromId)(leagueId);
    var _b = (0, hooks_1.useAdpData)(), sortByAdp = _b.sortByAdp, getAdp = _b.getAdp, getPositionalAdp = _b.getPositionalAdp;
    var rosters = (0, hooks_1.useFetchRosters)(leagueId).data;
    var playerData = (0, hooks_1.usePlayerData)();
    var _c = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), startingLineup = _c.startingLineup, setStartingLineup = _c.setStartingLineup, bench = _c.bench, benchString = _c.benchString;
    var _d = (0, react_1.useState)(false), showPreview = _d[0], setShowPreview = _d[1];
    var _e = (0, react_1.useState)(false), showRookieBP = _e[0], setShowRookieBP = _e[1];
    var _f = (0, react_1.useState)(false), isRedraft = _f[0], setIsRedraft = _f[1];
    var _g = (0, react_1.useState)(50), rebuildContendValue = _g[0], setRebuildContendValue = _g[1];
    var _h = (0, react_1.useState)(5), draftCapitalValue = _h[0], setDraftCapitalValue = _h[1];
    var _j = (0, react_1.useState)('placeholder'), draftCapitalNotes = _j[0], setDraftCapitalNotes = _j[1];
    var _k = (0, react_1.useState)([
        'comment 1',
        'comment 2',
        'comment 3',
    ]), comments = _k[0], setComments = _k[1];
    var _l = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, -1]; }))), positionalGradeOverrides = _l[0], setPositionalGradeOverrides = _l[1];
    var _m = (0, react_1.useState)([
        [],
        [],
        [],
    ]), playersToTrade = _m[0], setPlayersToTrade = _m[1];
    var _o = (0, react_1.useState)([
        'placeholder',
        'placeholder',
        'placeholder',
    ]), inReturn = _o[0], setInReturn = _o[1];
    var _p = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, []]; }))), cornerstones = _p[0], setCornerstones = _p[1];
    function isCornerstone(player) {
        if (!player)
            return false;
        var adp = getAdp("".concat(player.first_name, " ").concat(player.last_name));
        return adp <= 75 && adp >= 0;
    }
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        var cornerstones = roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(isCornerstone)
            .sort(sortByAdp);
        setCornerstones(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [
            pos,
            cornerstones
                .filter(function (player) {
                return player.fantasy_positions.includes(pos);
            })
                .map(function (player) { return player.player_id; })
                .slice(0, 3),
        ]; })));
    }, [roster, playerData]);
    var _q = (0, react_1.useState)(-1), depthScoreOverride = _q[0], setDepthScoreOverride = _q[1];
    var _r = (0, react_1.useState)([]), outlooks = _r[0], setOutlooks = _r[1];
    var _s = (0, react_1.useState)([
        '10229',
        '5849',
        '4866',
        '10859',
    ]), playerSuggestions = _s[0], setPlayerSuggestions = _s[1];
    var _t = (0, react_1.useState)(''), otherSettings = _t[0], setOtherSettings = _t[1];
    var _u = (0, react_1.useState)(''), waiverTarget = _u[0], setWaiverTarget = _u[1];
    var _v = (0, react_router_dom_1.useSearchParams)(), searchParams = _v[0], setSearchParams = _v[1];
    (0, react_1.useEffect)(function () {
        if (!playerData || !searchParams.get(urlParams_1.STARTING_LINEUP))
            return;
        // not sure why this is necessary
        setTimeout(loadFromUrl, 200);
    }, [playerData, searchParams]);
    var _w = (0, RookieDraft_1.useRookieDraft)(), draftPicks = _w.draftPicks, setDraftPicks = _w.setDraftPicks, rookieTargets = _w.rookieTargets, setRookieTargets = _w.setRookieTargets, draftStrategy = _w.draftStrategy, setDraftStrategy = _w.setDraftStrategy, qbGrade = _w.qbGrade, rbGrade = _w.rbGrade, wrGrade = _w.wrGrade, teGrade = _w.teGrade, autoPopulatedDraftStrategy = _w.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _w.setAutoPopulatedDraftStrategy, sortByRookieRank = _w.sortByRookieRank;
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX);
    var _x = (0, hooks_1.useArchetype)(qbGrade, rbGrade, wrGrade, teGrade, isSuperFlex), archetype = _x.archetype, setArchetype = _x.setArchetype;
    (0, react_1.useEffect)(function () {
        setOutlooks(exports.ArchetypeDetails[archetype][0]);
    }, [archetype]);
    var _y = (0, react_1.useState)(''), additionalDraftNotes = _y[0], setAdditionalDraftNotes = _y[1];
    (0, react_1.useEffect)(function () {
        var thisYearInfo = draftPicks
            .filter(function (draftPick) { return draftPick.round !== '' && draftPick.pick !== ''; })
            .map(function (draftPick) {
            return "".concat(draftPick.round, ".").concat(draftPick.pick && draftPick.pick < 10 ? '0' : '').concat(draftPick.pick);
        })
            .join(', ');
        setDraftCapitalNotes("".concat(thisYearInfo).concat(thisYearInfo.length && additionalDraftNotes.length ? '; ' : '').concat(additionalDraftNotes));
    }, [draftPicks, additionalDraftNotes]);
    function shortenOutlook(outlook) {
        switch (outlook) {
            case 'REBUILD':
                return 'R';
            case 'CONTEND':
                return 'C';
            case 'RELOAD':
                return 'O';
            default:
                return '?';
        }
    }
    function expandOutlook(outlook) {
        switch (outlook) {
            case 'R':
                return 'REBUILD';
            case 'C':
                return 'CONTEND';
            case 'O':
                return 'RELOAD';
            default:
                return '';
        }
    }
    function saveToUrl() {
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.OTHER_SETTINGS, otherSettings);
            searchParams.set(urlParams_1.PLAYERS_TO_TARGET, playerSuggestions.join('-'));
            searchParams.set(urlParams_1.ARCHETYPE, archetype);
            searchParams.set(urlParams_1.OUTLOOK, outlooks.map(shortenOutlook).join('-'));
            if (depthScoreOverride > 0) {
                searchParams.set(urlParams_1.DEPTH_SCORE_OVERRIDE, depthScoreOverride.toString());
            }
            var cornerstoneList = [];
            for (var _i = 0, _a = Array.from(cornerstones.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], pos = _b[0], starters = _b[1];
                cornerstoneList.push(pos);
                cornerstoneList.push.apply(cornerstoneList, starters);
            }
            searchParams.set(urlParams_1.CORNERSTONES, cornerstoneList.join('-'));
            playersToTrade.forEach(function (players, idx) {
                searchParams.set("".concat(urlParams_1.PLAYERS_TO_TRADE, "_").concat(idx), players.filter(function (p) { return !!p; }).join('-'));
            });
            searchParams.set(urlParams_1.IN_RETURN, inReturn.join('-'));
            searchParams.set(urlParams_1.DRAFT_CAPITAL_NOTES, draftCapitalNotes);
            searchParams.set(urlParams_1.DRAFT_CAPITAL_VALUE, draftCapitalValue.toString());
            searchParams.set(urlParams_1.REBUILD_CONTEND_VALUE, rebuildContendValue.toString());
            searchParams.set(urlParams_1.POSITIONAL_GRADE_OVERRIDES, Array.from(positionalGradeOverrides.entries()).flat().join('-'));
            searchParams.set(urlParams_1.STARTING_LINEUP, startingLineup
                .reduce(function (acc, curr) {
                acc.push(curr.player.player_id);
                acc.push(curr.position);
                return acc;
            }, [])
                .join('-'));
            searchParams.set(urlParams_1.WAIVER_TARGETS, waiverTarget);
            searchParams.set(urlParams_1.COMMENTS, comments.join('-'));
            return searchParams;
        });
    }
    function clearUrlSave() {
        setSearchParams(function (searchParams) {
            searchParams.delete(urlParams_1.OTHER_SETTINGS);
            searchParams.delete(urlParams_1.PLAYERS_TO_TARGET);
            searchParams.delete(urlParams_1.ARCHETYPE);
            searchParams.delete(urlParams_1.OUTLOOK);
            searchParams.delete(urlParams_1.DEPTH_SCORE_OVERRIDE);
            searchParams.delete(urlParams_1.CORNERSTONES);
            for (var i = 0; i < 3; i++) {
                searchParams.delete("".concat(urlParams_1.PLAYERS_TO_TRADE, "_").concat(i));
            }
            searchParams.delete(urlParams_1.IN_RETURN);
            searchParams.delete(urlParams_1.DRAFT_CAPITAL_NOTES);
            searchParams.delete(urlParams_1.DRAFT_CAPITAL_VALUE);
            searchParams.delete(urlParams_1.REBUILD_CONTEND_VALUE);
            searchParams.delete(urlParams_1.POSITIONAL_GRADE_OVERRIDES);
            searchParams.delete(urlParams_1.STARTING_LINEUP);
            searchParams.delete(urlParams_1.WAIVER_TARGETS);
            searchParams.delete(urlParams_1.COMMENTS);
            return searchParams;
        });
    }
    /**
     * Combines "RP" with the following player ID in the array. This is necessary
     * because the URL params are split by "-" and "RP-2025" is a valid player ID.
     *
     * @param splitTargets The array of strings to combine
     * @returns The modified array
     */
    function combineHangingRp(splitTargets) {
        var newSplit = [];
        for (var i = 0; i < splitTargets.length; i++) {
            if (splitTargets[i] === 'RP') {
                newSplit.push("RP-".concat(splitTargets[i + 1]));
                i++;
            }
            else {
                newSplit.push(splitTargets[i]);
            }
        }
        return newSplit;
    }
    function loadFromUrl() {
        setOtherSettings(searchParams.get(urlParams_1.OTHER_SETTINGS) || '');
        setPlayerSuggestions(combineHangingRp((searchParams.get(urlParams_1.PLAYERS_TO_TARGET) || '').split('-')));
        setArchetype(searchParams.get(urlParams_1.ARCHETYPE) || Archetype.HardRebuild);
        setOutlooks((searchParams.get(urlParams_1.OUTLOOK) || '').split('-').map(expandOutlook));
        var depthScoreOverride = searchParams.get(urlParams_1.DEPTH_SCORE_OVERRIDE);
        if (depthScoreOverride) {
            setDepthScoreOverride(+depthScoreOverride);
        }
        loadCornerstones();
        playersToTrade.forEach(function (_, idx) {
            setPlayersToTrade(function (prev) {
                prev[idx] = (searchParams.get("".concat(urlParams_1.PLAYERS_TO_TRADE, "_").concat(idx)) || '').split('-');
                return prev;
            });
        });
        setInReturn((searchParams.get(urlParams_1.IN_RETURN) || '').split('-'));
        setDraftCapitalNotes(searchParams.get(urlParams_1.DRAFT_CAPITAL_NOTES) || '');
        setDraftCapitalValue(+(searchParams.get(urlParams_1.DRAFT_CAPITAL_VALUE) || '0'));
        setRebuildContendValue(+(searchParams.get(urlParams_1.REBUILD_CONTEND_VALUE) || '0'));
        loadPosGrades();
        loadStartingLineup();
        setWaiverTarget(searchParams.get(urlParams_1.WAIVER_TARGETS) || '');
        setComments((searchParams.get(urlParams_1.COMMENTS) || '').split('-'));
    }
    function loadCornerstones() {
        var hyphenSeparatedCornerstones = (searchParams.get(urlParams_1.CORNERSTONES) || '').split('-');
        var loadedCornerstones = new Map();
        var mostRecentVal = '';
        for (var _i = 0, hyphenSeparatedCornerstones_1 = hyphenSeparatedCornerstones; _i < hyphenSeparatedCornerstones_1.length; _i++) {
            var val = hyphenSeparatedCornerstones_1[_i];
            if (fantasy_1.FANTASY_POSITIONS.includes(val)) {
                loadedCornerstones.set(val, []);
                mostRecentVal = val;
            }
            else {
                loadedCornerstones.get(mostRecentVal).push(val);
            }
        }
        setCornerstones(loadedCornerstones);
    }
    function loadPosGrades() {
        var loadedPositionalGrades = new Map();
        var hyphenSeparatedPosGrades = (searchParams.get(urlParams_1.POSITIONAL_GRADE_OVERRIDES) || '').split('-');
        hyphenSeparatedPosGrades.forEach(function (str, idx) {
            if (!fantasy_1.FANTASY_POSITIONS.includes(str))
                return;
            var override = 0;
            if (hyphenSeparatedPosGrades[idx + 1] === '') {
                // means that the value is negative, since we separate by hyphen
                override = -hyphenSeparatedPosGrades[idx + 2];
            }
            else {
                override = +hyphenSeparatedPosGrades[idx + 1];
            }
            loadedPositionalGrades.set(str, override || positionalGradeOverrides.get(str));
        });
        setPositionalGradeOverrides(loadedPositionalGrades);
    }
    function loadStartingLineup() {
        var loadedStartingLineup = [];
        var hyphenSeparatedStartingLineup = (searchParams.get(urlParams_1.STARTING_LINEUP) || '').split('-');
        for (var i = 0; i < hyphenSeparatedStartingLineup.length; i += 2) {
            loadedStartingLineup.push({
                player: playerData[hyphenSeparatedStartingLineup[i]],
                position: hyphenSeparatedStartingLineup[i + 1],
            });
        }
        setStartingLineup(loadedStartingLineup);
    }
    function fullBlueprint() {
        return (<div className={BigBoy_module_css_1.default.fullBlueprint}>
                {settingsGraphicComponent()}
                {startersGraphicComponent()}
                {cornerstoneGraphicComponent()}
                {depthScoreGraphicComponent()}
                {playersToTargetGraphicComponent()}
                {positionalGradesGraphicComponent()}
                {lookToTradeGraphicComponent()}
                {teamNameComponent()}
                {archetypeComponent()}
                {isRedraft ? (<div className={BigBoy_module_css_1.default.waiverTargetsGraphic}>
                        <WaiverTargets_1.GraphicComponent target={waiverTarget}/>
                    </div>) : (threeYearOutlookComponent())}
                {contendRebuildScaleComponent()}
                {draftCapitalGradeComponent()}
                {commentsComponent()}
                <img src={isRedraft ? images_1.blankRedraftBp : images_1.blankblueprint} className={BigBoy_module_css_1.default.base}/>
            </div>);
    }
    function commentsInput() {
        return (<div className={BigBoy_module_css_1.default.inputModule}>
                Suggestions/Comments:
                {comments.map(function (comment, idx) {
                return (<material_1.TextField style={{ margin: '4px' }} key={idx} value={comment} onChange={function (e) {
                        var newComments = comments.slice();
                        newComments[idx] = e.target.value;
                        setComments(newComments);
                    }}/>);
            })}
            </div>);
    }
    function commentsComponent() {
        return (<ul className={BigBoy_module_css_1.default.commentsGraphic}>
                {comments.map(function (c, idx) {
                return <li key={idx}>{c}</li>;
            })}
            </ul>);
    }
    function draftCapitalGradeComponent() {
        return (<div className={BigBoy_module_css_1.default.draftCapitalGradeGraphic}>
                <div className={BigBoy_module_css_1.default.scaleAndSlider}>
                    <img src={images_1.draftCapitalScale}/>
                    <img src={images_1.circleSlider} className={BigBoy_module_css_1.default.otherSlider} style={{ left: "".concat(draftCapitalValue * 78, "px") }}/>
                </div>
                <div className={BigBoy_module_css_1.default.draftCapitalBackground}>
                    <img src={images_1.draftCapitalBackground}/>
                </div>
                <div className={BigBoy_module_css_1.default.draftCapitalText}>
                    {draftCapitalNotes.toUpperCase()}
                </div>
            </div>);
    }
    function draftCapitalGradeInput() {
        return (<StyledNumberInput_1.default value={draftCapitalValue} onChange={function (_, value) {
                setDraftCapitalValue(value || 0);
            }} min={0} max={10}/>);
    }
    function teamGradeNotesInput() {
        return (<material_1.TextField style={{ margin: '4px' }} label={'Team Grade Notes'} value={draftCapitalNotes} onChange={function (e) { return setDraftCapitalNotes(e.target.value); }}/>);
    }
    function contendRebuildScaleComponent() {
        return (<div className={BigBoy_module_css_1.default.rebuildContendScaleGraphic}>
                <div className={BigBoy_module_css_1.default.scaleAndSlider}>
                    <img src={isRedraft ? images_1.riskSafetyScale : images_1.rebuildContendScale}/>
                    <img src={images_1.circleSlider} className={BigBoy_module_css_1.default.slider} style={{ left: "".concat(rebuildContendValue * 5.45, "px") }}/>
                </div>
            </div>);
    }
    function contendRebuildScaleInput() {
        return (<StyledNumberInput_1.default value={rebuildContendValue} onChange={function (_, value) {
                setRebuildContendValue(value || 0);
            }} min={0} max={100}/>);
    }
    function togglePreview() {
        return (<material_1.FormGroup>
                <material_1.FormControlLabel control={<material_1.Switch checked={showPreview} onChange={function (e) { return setShowPreview(e.target.checked); }} inputProps={{ 'aria-label': 'controlled' }}/>} label="Show Preview"/>
            </material_1.FormGroup>);
    }
    function ToggleShowRookieBP() {
        return (<material_1.FormGroup>
                <material_1.FormControlLabel control={<material_1.Switch checked={showRookieBP} onChange={function (e) { return setShowRookieBP(e.target.checked); }} inputProps={{ 'aria-label': 'controlled' }}/>} label="Show Rookie BP?"/>
            </material_1.FormGroup>);
    }
    function ToggleRedraft() {
        return (<material_1.FormGroup>
                <material_1.FormControlLabel control={<material_1.Switch checked={isRedraft} onChange={function (e) { return setIsRedraft(e.target.checked); }} inputProps={{ 'aria-label': 'controlled' }}/>} label="Redraft?"/>
            </material_1.FormGroup>);
    }
    function settingsGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.settingsGraphic}>
                <Settings_1.GraphicComponent numRosters={numRosters !== null && numRosters !== void 0 ? numRosters : 0} otherSettings={otherSettings} transparent={true}/>
            </div>);
    }
    function startersGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.startersGraphic}>
                <Starters_1.StartersGraphic startingLineup={startingLineup} transparent={true}/>
            </div>);
    }
    function cornerstoneGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.cornerstoneGraphic}>
                <CornerstoneModule_1.GraphicComponent cornerstones={cornerstones} transparent={true}/>
            </div>);
    }
    function depthScoreGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.depthScoreGraphic}>
                <DepthScore_1.GraphicComponent override={depthScoreOverride} transparent={true} bench={bench} benchString={benchString}/>
            </div>);
    }
    function playersToTargetGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.playersToTargetGraphic}>
                <PlayersToTargetModule_1.GraphicComponent playerSuggestions={playerSuggestions} transparent={true}/>
            </div>);
    }
    function positionalGradesGraphicComponent() {
        var _a;
        return (<div className={BigBoy_module_css_1.default.positionalGradesGraphic}>
                <PositionalGrades_1.GraphicComponent overrides={positionalGradeOverrides} roster={roster} transparent={true} isSuperFlex={isSuperFlex} leagueSize={(_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0}/>
            </div>);
    }
    function lookToTradeGraphicComponent() {
        return (<div className={BigBoy_module_css_1.default.lookToTradeGraphic}>
                <LookToTradeModule_1.GraphicComponent inReturn={inReturn} playersToTrade={playersToTrade} transparent={true}/>
            </div>);
    }
    function archetypeComponent() {
        return (<div>
                {!isRedraft && (<div className={BigBoy_module_css_1.default.archetypeTitle}>
                        {'TEAM ARCHETYPE:'}
                    </div>)}
                <div className={BigBoy_module_css_1.default.archetype}>{archetype}</div>
                <img src={images_1.silhouette} className={BigBoy_module_css_1.default.archetypeSilhouette}/>
            </div>);
    }
    function threeYearOutlookComponent() {
        return (<div>
                <div className={BigBoy_module_css_1.default.outlookTitle}>3-YEAR OUTLOOK:</div>
                <div className={BigBoy_module_css_1.default.outlookImages}>
                    <img src={images_1.outlook1}/>
                    <img src={images_1.outlook2}/>
                    <img src={images_1.outlook3}/>
                </div>
                <div className={BigBoy_module_css_1.default.outlookChips}>
                    <div className={BigBoy_module_css_1.default.outlookChip}>
                        <div className={BigBoy_module_css_1.default.outlookYear}>YR 1</div>
                        <div className={BigBoy_module_css_1.default.outlookLabel}>{outlooks[0]}</div>
                    </div>
                    <div className={BigBoy_module_css_1.default.outlookChip}>
                        <div className={BigBoy_module_css_1.default.outlookYear}>YR 2</div>
                        <div className={BigBoy_module_css_1.default.outlookLabel}>{outlooks[1]}</div>
                    </div>
                    <div className={BigBoy_module_css_1.default.outlookChip}>
                        <div className={BigBoy_module_css_1.default.outlookYear}>YR 3</div>
                        <div className={BigBoy_module_css_1.default.outlookLabel}>{outlooks[2]}</div>
                    </div>
                </div>
            </div>);
    }
    function teamNameComponent() {
        if (!teamName)
            return <></>;
        var longName = teamName.length >= 16;
        var veryLongName = teamName.length >= 24;
        return (<div className={"".concat(BigBoy_module_css_1.default.teamNameGraphic, " ").concat(longName ? BigBoy_module_css_1.default.smallerTeamName : '', " ").concat(veryLongName ? BigBoy_module_css_1.default.smallestTeamName : '')}>
                {teamName}
            </div>);
    }
    function rosterComponent() {
        if (!playerData)
            return <></>;
        var allPlayers = roster === null || roster === void 0 ? void 0 : roster.players.map(function (playerId) { return playerData[playerId]; }).sort(sortByAdp);
        if (!allPlayers)
            return <></>;
        return (<div className={BigBoy_module_css_1.default.fullRoster}>
                {fantasy_1.FANTASY_POSITIONS.map(function (pos) { return (<div className={BigBoy_module_css_1.default.positionColumn} key={pos}>
                        <b>{pos}</b>
                        {allPlayers
                    .filter(function (player) { return !!player && player.position === pos; })
                    .map(function (player, idx) {
                    var fullName = "".concat(player.first_name, " ").concat(player.last_name);
                    var positionalAdp = getPositionalAdp(fullName);
                    return (<div className={BigBoy_module_css_1.default.rosterPlayer} key={idx}>
                                        <div>{fullName}</div>
                                        <div>
                                            {positionalAdp === Infinity
                            ? '∞'
                            : positionalAdp}
                                        </div>
                                    </div>);
                })}
                    </div>); })}
            </div>);
    }
    function settingsComponent() {
        var _a, _b, _c, _d, _e, _f;
        if (!playerData)
            return <></>;
        var scoringSettings = league === null || league === void 0 ? void 0 : league.scoring_settings;
        if (!scoringSettings)
            return <></>;
        var wrtFlex = (_a = rosterSettings.get(fantasy_1.FLEX)) !== null && _a !== void 0 ? _a : 0;
        var wrFlex = (_b = rosterSettings.get(fantasy_1.WR_RB_FLEX)) !== null && _b !== void 0 ? _b : 0;
        var wtFlex = (_c = rosterSettings.get(fantasy_1.WR_TE_FLEX)) !== null && _c !== void 0 ? _c : 0;
        return (<div>
                <div>QB: {rosterSettings.get(fantasy_1.QB)}</div>
                <div>RB: {rosterSettings.get(fantasy_1.RB)}</div>
                <div>WR: {rosterSettings.get(fantasy_1.WR)}</div>
                <div>TE: {rosterSettings.get(fantasy_1.TE)}</div>
                <div>FLEX: {wrtFlex + wrFlex + wtFlex}</div>
                <div>BN: {rosterSettings.get(fantasy_1.BENCH)}</div>
                <div>TEAMS: {(_d = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _d !== void 0 ? _d : 0}</div>
                <div>SF: {rosterSettings.has(fantasy_1.SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {(_e = scoringSettings.rec) !== null && _e !== void 0 ? _e : 0}</div>
                <div>TEP: {(_f = scoringSettings.bonus_rec_te) !== null && _f !== void 0 ? _f : 0}</div>
                <div>TAXI: {league.settings.taxi_slots}</div>
                <Settings_1.InputComponent otherSettings={otherSettings} setOtherSettings={setOtherSettings}/>
            </div>);
    }
    function inputsComponent() {
        var _a;
        return (<>
                <material_1.Grid2 container spacing={1} className={BigBoy_module_css_1.default.inputGrid}>
                    <material_1.Grid2 size={8}>
                        <div>{rosterComponent()}</div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={2.5}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Positional Grade Override:
                            <PositionalGrades_1.OverrideComponent overrides={positionalGradeOverrides} setOverrides={setPositionalGradeOverrides} roster={roster} isSuperFlex={isSuperFlex} leagueSize={(_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={1.5} className={BigBoy_module_css_1.default.extraInfo}>
                        <div style={{ textAlign: 'end', maxWidth: '120px' }}>
                            {settingsComponent()}
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={6}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Cornerstones:
                            <CornerstoneModule_1.AllPositionalSelectors cornerstones={cornerstones} setCornerstones={setCornerstones} roster={roster}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={2}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Depth Score Override:
                            <DepthScore_1.OverrideComponent override={depthScoreOverride} setOverride={setDepthScoreOverride} roster={roster}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={4}>
                        <div>{archetypeSelector()}</div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={4}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Look to Trade:
                            <LookToTradeModule_1.InputComponent playersToTrade={playersToTrade} setPlayersToTrade={setPlayersToTrade} inReturn={inReturn} setInReturn={setInReturn} roster={roster}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={3}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Players to Target:
                            <PlayersToTargetModule_1.InputComponent playerSuggestions={playerSuggestions} setPlayerSuggestions={setPlayerSuggestions}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={2.5}>
                        {isRedraft
                ? 'Risk(0) - Safety(100)'
                : 'Rebuild(0) - Contend(100)'}
                        <div>{contendRebuildScaleInput()}</div>
                        {isRedraft
                ? 'Overall Team Grade'
                : 'Draft Capital Grade'}
                        <div>{draftCapitalGradeInput()}</div>
                        {!isRedraft && (<DraftCapitalInput draftPicks={draftPicks} setDraftPicks={setDraftPicks} additionalDraftNotes={additionalDraftNotes} setAdditionalDraftNotes={setAdditionalDraftNotes}/>)}
                        {isRedraft && teamGradeNotesInput()}
                        {commentsInput()}
                    </material_1.Grid2>
                    <material_1.Grid2 size={2.5}>
                        <div className={BigBoy_module_css_1.default.inputModule}>
                            Starters:
                            <Starters_1.InputComponent startingLineup={startingLineup} setStartingLineup={setStartingLineup} roster={roster}/>
                        </div>
                    </material_1.Grid2>
                    <material_1.Grid2 size={12}>
                        <RookieDraft_1.RookieDraftInputs draftPicks={draftPicks} setDraftPicks={setDraftPicks} rookieTargets={rookieTargets} setRookieTargets={setRookieTargets} draftStrategy={draftStrategy} setDraftStrategy={setDraftStrategy} autoPopulatedDraftStrategy={autoPopulatedDraftStrategy} setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy} sortByRookieRank={sortByRookieRank}/>
                    </material_1.Grid2>
                </material_1.Grid2>
            </>);
    }
    function archetypeSelector() {
        if (outlooks.length === 0)
            return <></>;
        return (<div className={BigBoy_module_css_1.default.inputModule}>
                <material_1.FormControl style={{ margin: '4px' }}>
                    <material_1.InputLabel>
                        {isRedraft ? 'Team Build' : 'Archetype'}
                    </material_1.InputLabel>
                    <material_1.Select value={archetype} label="Archetype" onChange={function (event) {
                setArchetype(event.target.value);
            }}>
                        {ALL_ARCHETYPES.map(function (arch, idx) { return (<material_1.MenuItem value={arch} key={idx}>
                                {arch}
                            </material_1.MenuItem>); })}
                    </material_1.Select>
                </material_1.FormControl>
                {!isRedraft &&
                [0, 1, 2].map(function (idx) { return (<material_1.FormControl style={{ margin: '4px' }} key={idx}>
                            <material_1.InputLabel>Year {idx + 1}</material_1.InputLabel>
                            <material_1.Select label={"Year ".concat(idx + 1)} value={outlooks[idx]} onChange={function (event) {
                        var newOutlooks = outlooks.slice();
                        newOutlooks[idx] = event.target.value;
                        setOutlooks(newOutlooks);
                    }}>
                                <material_1.MenuItem value={'CONTEND'} key={'CONTEND'}>
                                    {'CONTEND'}
                                </material_1.MenuItem>
                                <material_1.MenuItem value={'REBUILD'} key={'REBUILD'}>
                                    {'REBUILD'}
                                </material_1.MenuItem>

                                <material_1.MenuItem value={'RELOAD'} key={'RELOAD'}>
                                    {'RELOAD'}
                                </material_1.MenuItem>
                            </material_1.Select>
                        </material_1.FormControl>); })}
                {isRedraft && (<WaiverTargets_1.InputComponent target={waiverTarget} setTarget={setWaiverTarget}/>)}
            </div>);
    }
    var qbOverride = positionalGradeOverrides.get(fantasy_1.QB) || -1;
    var rbOverride = positionalGradeOverrides.get(fantasy_1.RB) || -1;
    var wrOverride = positionalGradeOverrides.get(fantasy_1.WR) || -1;
    var teOverride = positionalGradeOverrides.get(fantasy_1.TE) || -1;
    var rookieDraftGraphic = (<RookieDraft_1.RookieDraftGraphic archetype={archetype} teamName={teamName || ''} outlooks={outlooks} teamNeeds={(0, BuySellHold_1.getPositionalOrder)({
            qbGrade: qbOverride > -1 ? qbOverride : qbGrade,
            rbGrade: rbOverride > -1 ? rbOverride : rbGrade,
            wrGrade: wrOverride > -1 ? wrOverride : wrGrade,
            teGrade: teOverride > -1 ? teOverride : teGrade,
        })} draftPicks={draftPicks} rookieTargets={rookieTargets} draftStrategy={draftStrategy} draftCapitalScore={draftCapitalValue}/>);
    return (<div className={BigBoy_module_css_1.default.BigBoy}>
            <ExportButton_1.default className={BigBoy_module_css_1.default.fullBlueprint} pngName={"".concat(teamName, "_blueprint.png")} label="Download Blueprint"/>
            <ExportButton_1.default className={[
            BigBoy_module_css_1.default.fullBlueprint,
            RookieDraft_module_css_1.default.rookieDraftGraphic,
        ]} zipName={"".concat(teamName, "_blueprint.zip")} label="Download v1 BP & Rookie Draft BP"/>
            <material_1.Tooltip title="Save to URL">
                <material_1.Button variant={'outlined'} onClick={saveToUrl}>
                    {'Save'}
                </material_1.Button>
            </material_1.Tooltip>
            <material_1.Tooltip title="Clear Save from URL">
                <material_1.Button variant={'outlined'} onClick={clearUrlSave} disabled={!searchParams.get(urlParams_1.STARTING_LINEUP)}>
                    {'Clear'}
                </material_1.Button>
            </material_1.Tooltip>
            {togglePreview()}
            <ToggleShowRookieBP />
            <ToggleRedraft />
            <div className={BigBoy_module_css_1.default.inputsAndPreview}>
                {inputsComponent()}
                {<div className={BigBoy_module_css_1.default.smaller}>
                        {showPreview && fullBlueprint()}
                        {showRookieBP && rookieDraftGraphic}
                    </div>}
            </div>
            <div className={BigBoy_module_css_1.default.offScreen}>{fullBlueprint()}</div>
            <div className={BigBoy_module_css_1.default.offScreen}>{rookieDraftGraphic}</div>
        </div>);
}
function DraftCapitalInput(_a) {
    var draftPicks = _a.draftPicks, setDraftPicks = _a.setDraftPicks, additionalDraftNotes = _a.additionalDraftNotes, setAdditionalDraftNotes = _a.setAdditionalDraftNotes;
    var rounds = __spreadArray([], Array(5).keys(), true).map(function (x) { return x + 1; });
    var picks = __spreadArray([], Array(24).keys(), true).map(function (x) { return x + 1; });
    return (<div className={BigBoy_module_css_1.default.addRemovePickButtons}>
            <material_1.Button variant="outlined" onClick={function () {
            setDraftPicks(function (oldDraftPicks) {
                return __spreadArray(__spreadArray([], oldDraftPicks, true), [
                    {
                        round: '',
                        pick: '',
                        verdict: RookieDraft_1.Verdict.None,
                    },
                ], false).sort(RookieDraft_1.sortDraftPicks);
            });
        }} endIcon={<Add_1.default />}>
                Add Pick
            </material_1.Button>
            <material_1.Button variant="outlined" onClick={function () {
            setDraftPicks(function (oldDraftPicks) {
                return oldDraftPicks.slice(0, -1).sort(RookieDraft_1.sortDraftPicks);
            });
        }} disabled={draftPicks.length <= 4} endIcon={<Remove_1.default />}>
                Remove Pick
            </material_1.Button>

            {draftPicks.map(function (draftPick, idx) { return (<div key={idx} style={{
                display: 'flex',
                gap: '4px',
            }}>
                    <material_1.FormControl key={"".concat(idx, " round")} style={{ flex: '1' }}>
                        <material_1.InputLabel>Rnd {idx + 1}</material_1.InputLabel>
                        <material_1.Select label={"Rnd ".concat(idx + 1)} value={draftPick.round.toString()} onChange={function (event) {
                var newDraftPicks = draftPicks.slice();
                if (event.target.value === '') {
                    newDraftPicks[idx].round = '';
                }
                else {
                    newDraftPicks[idx].round =
                        +event.target.value;
                }
                setDraftPicks(newDraftPicks.sort(RookieDraft_1.sortDraftPicks));
            }}>
                            <material_1.MenuItem value={''} key={''}>
                                Choose a round:
                            </material_1.MenuItem>
                            {rounds.map(function (round) { return (<material_1.MenuItem value={round} key={round}>
                                    {round}
                                </material_1.MenuItem>); })}
                        </material_1.Select>
                    </material_1.FormControl>
                    <material_1.FormControl key={"".concat(idx, " pick")} style={{ flex: '1' }}>
                        <material_1.InputLabel>Pk {idx + 1}</material_1.InputLabel>
                        <material_1.Select label={"Pk ".concat(idx + 1)} value={draftPick.pick.toString()} onChange={function (event) {
                var newDraftPicks = draftPicks.slice();
                if (event.target.value === '') {
                    newDraftPicks[idx].pick = '';
                }
                else {
                    newDraftPicks[idx].pick =
                        +event.target.value;
                }
                setDraftPicks(newDraftPicks.sort(RookieDraft_1.sortDraftPicks));
            }}>
                            <material_1.MenuItem value={''} key={''}>
                                Choose a pick:
                            </material_1.MenuItem>
                            {picks.map(function (pick) { return (<material_1.MenuItem value={pick} key={pick}>
                                    {pick}
                                </material_1.MenuItem>); })}
                        </material_1.Select>
                    </material_1.FormControl>
                </div>); })}
            {setAdditionalDraftNotes && (<material_1.TextField style={{ margin: '4px' }} label={'Additional Draft Info'} value={additionalDraftNotes} onChange={function (e) { return setAdditionalDraftNotes(e.target.value); }}/>)}
        </div>);
}
