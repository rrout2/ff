"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankToString = void 0;
exports.default = BigBoy;
var react_1 = require("react");
var BigBoy_module_css_1 = require("./BigBoy.module.css");
var images_1 = require("../../../../../consts/images");
var hooks_1 = require("../../../../../hooks/hooks");
var CornerstonesModule_1 = require("../CornerstonesModule/CornerstonesModule");
var RosterModule_1 = require("../RosterModule/RosterModule");
var SettingsModule_1 = require("../SettingsModule/SettingsModule");
var fantasy_1 = require("../../../../../consts/fantasy");
var ExportButton_1 = require("../../../shared/ExportButton");
var SuggestedMovesModule_1 = require("../SuggestedMovesModule/SuggestedMovesModule");
var HoldsModule_1 = require("../HoldsModule/HoldsModule");
var RisersFallersModule_1 = require("../RisersFallersModule/RisersFallersModule");
var PositionalGrades_1 = require("../PositionalGrades/PositionalGrades");
var UnifiedModule_1 = require("../UnifiedModule/UnifiedModule");
var material_1 = require("@mui/material");
var archetypes_1 = require("../../consts/archetypes");
var urlParams_1 = require("../../../../../consts/urlParams");
var react_router_dom_1 = require("react-router-dom");
var RookieDraft_1 = require("../../../rookieDraft/RookieDraft/RookieDraft");
var BuySellHold_1 = require("../../../infinite/BuySellHold/BuySellHold");
var RookieDraft_module_css_1 = require("../../../rookieDraft/RookieDraft/RookieDraft.module.css");
function BigBoy(_a) {
    var roster = _a.roster, numRosters = _a.numRosters, teamName = _a.teamName, qbRank = _a.qbRank, rbRank = _a.rbRank, wrRank = _a.wrRank, teRank = _a.teRank, isSuperFlex = _a.isSuperFlex;
    var _b = (0, CornerstonesModule_1.useCornerstones)(roster), cornerstones = _b.cornerstones, setCornerstones = _b.setCornerstones;
    var _c = (0, SuggestedMovesModule_1.useBuySells)(roster), sells = _c.sells, setSells = _c.setSells, buys = _c.buys, setBuys = _c.setBuys, plusMap = _c.plusMap, setPlusMap = _c.setPlusMap;
    var _d = (0, HoldsModule_1.useHolds)(roster), holds = _d.holds, setHolds = _d.setHolds;
    var _e = (0, RisersFallersModule_1.useRisersFallers)(roster), risers = _e.risers, setRisers = _e.setRisers, riserValues = _e.riserValues, setRiserValues = _e.setRiserValues, fallers = _e.fallers, setFallers = _e.setFallers, fallerValues = _e.fallerValues, setFallerValues = _e.setFallerValues;
    var _f = (0, hooks_1.usePositionalGrades)(roster, numRosters), overall = _f.overall, setOverall = _f.setOverall, qb = _f.qb, setQb = _f.setQb, rb = _f.rb, setRb = _f.setRb, wr = _f.wr, setWr = _f.setWr, te = _f.te, setTe = _f.setTe;
    var _g = (0, react_1.useState)(false), showRookieBP = _g[0], setShowRookieBP = _g[1];
    var _h = (0, RookieDraft_1.useRookieDraft)(), draftPicks = _h.draftPicks, setDraftPicks = _h.setDraftPicks, rookieTargets = _h.rookieTargets, setRookieTargets = _h.setRookieTargets, draftStrategy = _h.draftStrategy, setDraftStrategy = _h.setDraftStrategy, outlooks = _h.outlooks, setOutlooks = _h.setOutlooks, draftCapitalScore = _h.draftCapitalScore, setDraftCapitalScore = _h.setDraftCapitalScore, autoPopulatedDraftStrategy = _h.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _h.setAutoPopulatedDraftStrategy, sortByRookieRank = _h.sortByRookieRank;
    (0, react_1.useEffect)(function () {
        setOverall(Math.min(10, Math.round((qb + rb + wr + te + draftCapitalScore) / 5) + 1));
    }, [qb, rb, wr, te, draftCapitalScore]);
    var rankStateMap = new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, (0, react_1.useState)('4th')]; }));
    (0, react_1.useEffect)(function () {
        if (qbRank === -1)
            return;
        rankStateMap.get(fantasy_1.QB)[1]((0, exports.rankToString)(qbRank));
    }, [qbRank]);
    (0, react_1.useEffect)(function () {
        if (rbRank === -1)
            return;
        rankStateMap.get(fantasy_1.RB)[1]((0, exports.rankToString)(rbRank));
    }, [rbRank]);
    (0, react_1.useEffect)(function () {
        if (wrRank === -1)
            return;
        rankStateMap.get(fantasy_1.WR)[1]((0, exports.rankToString)(wrRank));
    }, [wrRank]);
    (0, react_1.useEffect)(function () {
        if (teRank === -1)
            return;
        rankStateMap.get(fantasy_1.TE)[1]((0, exports.rankToString)(teRank));
    }, [teRank]);
    var archetypev1 = (0, hooks_1.useArchetype)(qb, rb, wr, te, isSuperFlex).archetype;
    var _j = (0, react_1.useState)(archetypes_1.Archetype.FutureValue), archetype = _j[0], setArchetype = _j[1];
    (0, react_1.useEffect)(function () {
        setArchetype((0, archetypes_1.getArchetypeFromV1Archetype)(archetypev1));
    }, [archetypev1]);
    (0, react_1.useEffect)(function () {
        setOutlooks((0, archetypes_1.getOutlookFromArchetype)(archetype));
    }, [archetype]);
    var _k = (0, react_1.useState)(''), otherSettings = _k[0], setOtherSettings = _k[1];
    var _l = (0, react_1.useState)([
        'comment 1',
        'comment 2',
    ]), rookiePickComments = _l[0], setRookiePickComments = _l[1];
    var _m = (0, react_1.useState)([
        '2025 Rookie Picks',
        '2026 Rookie Picks',
    ]), rookiePickHeaders = _m[0], setRookiePickHeaders = _m[1];
    var _o = (0, react_1.useState)([
        'suggestion 1',
        'suggestion 2',
        'suggestion 3',
        'suggestion 4',
        'suggestion 5',
        'suggestion 6',
    ]), suggestionsAndComments = _o[0], setSuggestionsAndComments = _o[1];
    var _p = (0, react_1.useState)(false), showPreview = _p[0], setShowPreview = _p[1];
    var _q = (0, react_router_dom_1.useSearchParams)(), searchParams = _q[0], setSearchParams = _q[1];
    var playerData = (0, hooks_1.usePlayerData)();
    (0, react_1.useEffect)(function () {
        if (!playerData || !searchParams.get(urlParams_1.CORNERSTONES))
            return;
        // not sure why this is necessary
        setTimeout(loadFromUrl, 200);
    }, [playerData, searchParams]);
    var PreviewToggle = function () {
        return (<material_1.FormGroup>
                <material_1.FormControlLabel control={<material_1.Switch checked={showPreview} onChange={function (e) { return setShowPreview(e.target.checked); }} inputProps={{ 'aria-label': 'controlled' }}/>} label="Show Preview"/>
            </material_1.FormGroup>);
    };
    function ToggleShowRookieBP() {
        return (<material_1.FormGroup>
                <material_1.FormControlLabel control={<material_1.Switch checked={showRookieBP} onChange={function (e) { return setShowRookieBP(e.target.checked); }} inputProps={{ 'aria-label': 'controlled' }}/>} label="Show Rookie BP?"/>
            </material_1.FormGroup>);
    }
    var FullBlueprintWithProps = function (_a) {
        var isPreview = _a.isPreview;
        return (<FullBlueprint roster={roster} cornerstones={cornerstones} sells={sells} buys={buys} plusMap={plusMap} holds={holds} risers={risers} riserValues={riserValues} fallers={fallers} fallerValues={fallerValues} rankStateMap={rankStateMap} overall={overall} qb={qb} rb={rb} wr={wr} te={te} draftCapitalScore={draftCapitalScore} numRosters={numRosters} teamName={teamName} archetype={archetype} otherSettings={otherSettings} rookiePickComments={rookiePickComments} rookiePickHeaders={rookiePickHeaders} suggestionsAndComments={suggestionsAndComments} isPreview={isPreview}/>);
    };
    function saveToUrl() {
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.CORNERSTONES, cornerstones.join('-'));
            searchParams.set(urlParams_1.SELLS, sells.join('-'));
            searchParams.set(urlParams_1.BUYS, buys.join('-'));
            searchParams.set(urlParams_1.PLUS_MAP, buys.map(function (buy) { return (plusMap.get(buy) ? 'T' : 'F'); }).join('-'));
            searchParams.set(urlParams_1.HOLDS, holds.join('-'));
            searchParams.set(urlParams_1.RISERS, risers.join('-'));
            searchParams.set(urlParams_1.FALLERS, fallers.join('-'));
            searchParams.set(urlParams_1.RISER_VALUES, riserValues.join('-'));
            searchParams.set(urlParams_1.FALLER_VALUES, fallerValues.map(function (val) { return Math.abs(val); }).join('-'));
            searchParams.set(urlParams_1.POSITIONAL_GRADES, [overall, qb, rb, wr, te, draftCapitalScore].join('-'));
            searchParams.set(urlParams_1.QB_RANK, rankStateMap.get(fantasy_1.QB)[0]);
            searchParams.set(urlParams_1.RB_RANK, rankStateMap.get(fantasy_1.RB)[0]);
            searchParams.set(urlParams_1.WR_RANK, rankStateMap.get(fantasy_1.WR)[0]);
            searchParams.set(urlParams_1.TE_RANK, rankStateMap.get(fantasy_1.TE)[0]);
            searchParams.set(urlParams_1.ARCHETYPE, archetype);
            searchParams.set(urlParams_1.OTHER_SETTINGS, otherSettings);
            searchParams.set(urlParams_1.ROOKIE_PICK_COMMENTS, rookiePickComments.join('-'));
            searchParams.set(urlParams_1.SUGGESTIONS_AND_COMMENTS, suggestionsAndComments.join('-'));
            return searchParams;
        });
    }
    function loadFromUrl() {
        setCornerstones((searchParams.get(urlParams_1.CORNERSTONES) || '').split('-'));
        setSells((searchParams.get(urlParams_1.SELLS) || '').split('-'));
        var buysSplit = (searchParams.get(urlParams_1.BUYS) || '').split('-');
        var newBuys = [];
        for (var i = 0; i < buysSplit.length; i++) {
            // combine "RP" with the following player ID
            if (buysSplit[i] === 'RP' && i + 1 < buysSplit.length) {
                newBuys.push("RP-".concat(buysSplit[i + 1]));
                i++;
            }
            else {
                newBuys.push(buysSplit[i]);
            }
        }
        setBuys(newBuys);
        var plusList = (searchParams.get(urlParams_1.PLUS_MAP) || '')
            .split('-')
            .map(function (val) { return (val === 'T' ? true : false); });
        var newPlusMap = new Map();
        newBuys.forEach(function (buy, idx) {
            newPlusMap.set(buy, plusList[idx]);
        });
        setPlusMap(newPlusMap);
        setHolds((searchParams.get(urlParams_1.HOLDS) || '').split('-'));
        setRisers((searchParams.get(urlParams_1.RISERS) || '').split('-'));
        setFallers((searchParams.get(urlParams_1.FALLERS) || '').split('-'));
        setRiserValues((searchParams.get(urlParams_1.RISER_VALUES) || '')
            .split('-')
            .map(function (val) { return Math.round(+val * 10) / 10; }));
        setFallerValues((searchParams.get(urlParams_1.FALLER_VALUES) || '')
            .split('-')
            .map(function (val) { return Math.round(-val * 10) / 10; }));
        var posGrades = (searchParams.get(urlParams_1.POSITIONAL_GRADES) || '').split('-');
        setOverall(+posGrades[0]);
        setQb(+posGrades[1]);
        setRb(+posGrades[2]);
        setWr(+posGrades[3]);
        setTe(+posGrades[4]);
        setDraftCapitalScore(+posGrades[5]);
        rankStateMap.get(fantasy_1.QB)[1](searchParams.get(urlParams_1.QB_RANK) || '4th');
        rankStateMap.get(fantasy_1.RB)[1](searchParams.get(urlParams_1.RB_RANK) || '4th');
        rankStateMap.get(fantasy_1.WR)[1](searchParams.get(urlParams_1.WR_RANK) || '4th');
        rankStateMap.get(fantasy_1.TE)[1](searchParams.get(urlParams_1.TE_RANK) || '4th');
        setArchetype(searchParams.get(urlParams_1.ARCHETYPE));
        setOtherSettings(searchParams.get(urlParams_1.OTHER_SETTINGS) || '');
        var newRookiePickComments = searchParams.get(urlParams_1.ROOKIE_PICK_COMMENTS);
        if (newRookiePickComments) {
            setRookiePickComments(newRookiePickComments.split('-'));
        }
        var newSuggestionsAndComments = searchParams.get(urlParams_1.SUGGESTIONS_AND_COMMENTS);
        if (newSuggestionsAndComments) {
            setSuggestionsAndComments(newSuggestionsAndComments.split('-'));
        }
    }
    function clearUrlSave() {
        setSearchParams(function (searchParams) {
            searchParams.delete(urlParams_1.CORNERSTONES);
            searchParams.delete(urlParams_1.SELLS);
            searchParams.delete(urlParams_1.BUYS);
            searchParams.delete(urlParams_1.PLUS_MAP);
            searchParams.delete(urlParams_1.HOLDS);
            searchParams.delete(urlParams_1.RISERS);
            searchParams.delete(urlParams_1.FALLERS);
            searchParams.delete(urlParams_1.RISER_VALUES);
            searchParams.delete(urlParams_1.FALLER_VALUES);
            searchParams.delete(urlParams_1.POSITIONAL_GRADES);
            searchParams.delete(urlParams_1.QB_RANK);
            searchParams.delete(urlParams_1.RB_RANK);
            searchParams.delete(urlParams_1.WR_RANK);
            searchParams.delete(urlParams_1.TE_RANK);
            searchParams.delete(urlParams_1.ARCHETYPE);
            searchParams.delete(urlParams_1.OTHER_SETTINGS);
            searchParams.delete(urlParams_1.ROOKIE_PICK_COMMENTS);
            searchParams.delete(urlParams_1.SUGGESTIONS_AND_COMMENTS);
            return searchParams;
        });
    }
    var rookieDraftGraphic = (<RookieDraft_1.RookieDraftGraphic archetype={(0, archetypes_1.getV1ArchetypeFromArchetype)(archetype)} teamName={teamName || ''} outlooks={outlooks} teamNeeds={(0, BuySellHold_1.getPositionalOrder)({
            qbGrade: qb,
            rbGrade: rb,
            wrGrade: wr,
            teGrade: te,
        })} draftPicks={draftPicks} rookieTargets={rookieTargets} draftStrategy={draftStrategy} draftCapitalScore={draftCapitalScore}/>);
    return (<div>
            <ExportButton_1.default className={BigBoy_module_css_1.default.exportableClass} pngName={"".concat(teamName, "_blueprint.png")} label="Download Blueprint"/>
            <ExportButton_1.default className={[
            BigBoy_module_css_1.default.exportableClass,
            RookieDraft_module_css_1.default.rookieDraftGraphic,
        ]} zipName={"".concat(teamName, "_blueprint.zip")} label="Download v2 BP & Rookie Draft BP"/>
            <material_1.Tooltip title="Save to URL">
                <material_1.Button variant={'outlined'} onClick={saveToUrl}>
                    {'Save'}
                </material_1.Button>
            </material_1.Tooltip>
            <material_1.Tooltip title="Clear Save from URL">
                <span>
                    <material_1.Button variant={'outlined'} onClick={clearUrlSave} disabled={!searchParams.get(urlParams_1.CORNERSTONES)}>
                        {'Clear'}
                    </material_1.Button>
                </span>
            </material_1.Tooltip>
            <PreviewToggle />
            <ToggleShowRookieBP />
            <UnifiedModule_1.UnifiedInputs roster={roster} cornerstones={cornerstones} setCornerstones={setCornerstones} sells={sells} setSells={setSells} buys={buys} setBuys={setBuys} plusMap={plusMap} setPlusMap={setPlusMap} holds={holds} setHolds={setHolds} risers={risers} setRisers={setRisers} riserValues={riserValues} setRiserValues={setRiserValues} fallers={fallers} setFallers={setFallers} fallerValues={fallerValues} setFallerValues={setFallerValues} rankStateMap={rankStateMap} overall={overall} setOverall={setOverall} qb={qb} setQb={setQb} rb={rb} setRb={setRb} wr={wr} setWr={setWr} te={te} setTe={setTe} draftPicks={draftPicks} setDraftPicks={setDraftPicks} rookieTargets={rookieTargets} setRookieTargets={setRookieTargets} draftStrategy={draftStrategy} setDraftStrategy={setDraftStrategy} draftCapitalScore={draftCapitalScore} setDraftCapitalScore={setDraftCapitalScore} autoPopulatedDraftStrategy={autoPopulatedDraftStrategy} setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy} sortByRookieRank={sortByRookieRank} archetype={archetype} setArchetype={setArchetype} otherSettings={otherSettings} setOtherSettings={setOtherSettings} rookiePickComments={rookiePickComments} setRookiePickComments={setRookiePickComments} rookiePickHeaders={rookiePickHeaders} setRookiePickHeaders={setRookiePickHeaders} suggestionsAndComments={suggestionsAndComments} setSuggestionsAndComments={setSuggestionsAndComments}/>
            {showPreview && <FullBlueprintWithProps isPreview={true}/>}
            {showRookieBP && rookieDraftGraphic}
            <div className={BigBoy_module_css_1.default.offScreen}>
                <FullBlueprintWithProps isPreview={false}/>
                {rookieDraftGraphic}
            </div>
        </div>);
}
function FullBlueprint(_a) {
    var roster = _a.roster, numRosters = _a.numRosters, rankStateMap = _a.rankStateMap, cornerstones = _a.cornerstones, risers = _a.risers, fallers = _a.fallers, riserValues = _a.riserValues, fallerValues = _a.fallerValues, sells = _a.sells, buys = _a.buys, plusMap = _a.plusMap, holds = _a.holds, overall = _a.overall, qb = _a.qb, rb = _a.rb, wr = _a.wr, te = _a.te, draftCapitalScore = _a.draftCapitalScore, teamName = _a.teamName, archetype = _a.archetype, otherSettings = _a.otherSettings, rookiePickComments = _a.rookiePickComments, rookiePickHeaders = _a.rookiePickHeaders, suggestionsAndComments = _a.suggestionsAndComments, isPreview = _a.isPreview;
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _b = (0, react_1.useState)([]), allPlayers = _b[0], setAllPlayers = _b[1];
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        setAllPlayers(roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp));
    }, [roster, playerData]);
    function getBlueprintCode() {
        var isSuperflex = rosterSettings.has(fantasy_1.SUPER_FLEX);
        return "".concat((0, archetypes_1.getStartOfCode)(archetype), "-").concat(numRosters !== null && numRosters !== void 0 ? numRosters : 0, "-").concat(isSuperflex ? 'SF' : '1Q');
    }
    return (<div className={isPreview ? undefined : BigBoy_module_css_1.default.exportableClass}>
            <div className={"".concat(BigBoy_module_css_1.default.fullBlueprint, " ").concat(isPreview ? BigBoy_module_css_1.default.previewSize : BigBoy_module_css_1.default.fullSize)}>
                <div className={BigBoy_module_css_1.default.teamName}>{teamName}</div>
                <div className={BigBoy_module_css_1.default.otherSettings}>{otherSettings}</div>
                <div className={BigBoy_module_css_1.default.rookiePickHeader1}>
                    {rookiePickHeaders[0]}
                </div>
                <div className={BigBoy_module_css_1.default.rookiePickComment1} style={{
            fontSize: rookiePickComments[0].length > 60 ? '12px' : '16px',
        }}>
                    {rookiePickComments[0]}
                </div>
                <div className={BigBoy_module_css_1.default.rookiePickHeader2}>
                    {rookiePickHeaders[1]}
                </div>
                <div className={BigBoy_module_css_1.default.rookiePickComment2} style={{
            fontSize: rookiePickComments[1].length > 60 ? '12px' : '16px',
        }}>
                    {rookiePickComments[1]}
                </div>
                <div className={BigBoy_module_css_1.default.suggestionsAndComments}>
                    <ul>
                        {suggestionsAndComments.map(function (suggestion, i) {
            return !!suggestion && <li key={i}>{suggestion}</li>;
        })}
                    </ul>
                </div>
                <div className={BigBoy_module_css_1.default.rosterGraphic}>
                    <RosterModule_1.GraphicComponent allPlayers={allPlayers} numRosters={numRosters !== null && numRosters !== void 0 ? numRosters : 0} rankStateMap={rankStateMap} transparent={true}/>
                </div>
                <div className={BigBoy_module_css_1.default.settingsGraphic}>
                    <SettingsModule_1.GraphicComponent leagueId={leagueId} numRosters={numRosters !== null && numRosters !== void 0 ? numRosters : 0} transparent={true}/>
                </div>
                <div className={BigBoy_module_css_1.default.cornerstonesGraphic}>
                    <CornerstonesModule_1.GraphicComponent cornerstones={cornerstones}/>
                </div>
                <div className={BigBoy_module_css_1.default.risersFallersGraphic}>
                    <RisersFallersModule_1.GraphicComponent risers={risers} riserValues={riserValues} fallers={fallers} fallerValues={fallerValues} transparent={true}/>
                </div>
                <div className={BigBoy_module_css_1.default.suggestedMovesGraphic}>
                    <SuggestedMovesModule_1.GraphicComponent transparent={true} sells={sells} buys={buys} plusMap={plusMap}/>
                </div>
                <div className={BigBoy_module_css_1.default.holdsGraphic}>
                    <HoldsModule_1.GraphicComponent holds={holds}/>
                </div>
                <div className={BigBoy_module_css_1.default.positionalGradesGraphic}>
                    <PositionalGrades_1.GraphicComponent overall={overall} qb={qb} rb={rb} wr={wr} te={te} draftCapitalScore={draftCapitalScore} transparent={true}/>
                </div>
                <div className={BigBoy_module_css_1.default.threeYearOutlook}>
                    <div className={BigBoy_module_css_1.default.graphCrop}>
                        <img src={(0, archetypes_1.getGraphFromArchetype)(archetype)} className={BigBoy_module_css_1.default.graph}/>
                    </div>
                </div>
                <div className={BigBoy_module_css_1.default.archetypeGraphLabel} style={{ color: (0, archetypes_1.getColorFromArchetype)(archetype) }}>
                    ⎯⎯&nbsp;&nbsp;
                    {(0, archetypes_1.getLabelFromArchetype)(archetype).toUpperCase()}
                    &nbsp;&nbsp;⎯⎯
                </div>
                <div className={BigBoy_module_css_1.default.dvm}>
                    <img src={(0, archetypes_1.getDvmFromArchetype)(archetype)}/>
                </div>
                <div className={BigBoy_module_css_1.default.bpCode}>{getBlueprintCode()}</div>
                <img src={images_1.blankBlueprintV2}/>
            </div>
        </div>);
}
var rankToString = function (rank) {
    switch (rank) {
        case -1:
            throw new Error('Rank cannot be -1');
        case 0:
            return '1st';
        case 1:
            return '2nd';
        case 2:
            return '3rd';
        case 3:
            return '4th';
        case 4:
            return '5th';
        case 5:
            return '6th';
        case 6:
            return '7th';
        case 7:
            return '8th';
        case 8:
            return '9th';
        case 9:
            return '10th';
        case 10:
            return '11th';
        case 11:
            return '12th';
        case 12:
            return '13th';
        case 13:
            return '14th';
        case 14:
            return '15th';
        case 15:
            return '16th';
        default:
            return "".concat(rank + 1).concat(rank % 10 === 0 ? 'st' : rank % 10 === 1 ? 'nd' : 'th');
    }
};
exports.rankToString = rankToString;
