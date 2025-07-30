"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UnifiedModule;
exports.UnifiedInputs = UnifiedInputs;
var react_1 = require("react");
var UnifiedModule_module_css_1 = require("./UnifiedModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var CornerstonesModule_1 = require("../CornerstonesModule/CornerstonesModule");
var RosterModule_1 = require("../RosterModule/RosterModule");
var SettingsModule_1 = require("../SettingsModule/SettingsModule");
var fantasy_1 = require("../../../../../consts/fantasy");
var ExportButton_1 = require("../../../shared/ExportButton");
var SuggestedMovesModule_1 = require("../SuggestedMovesModule/SuggestedMovesModule");
var HoldsModule_1 = require("../HoldsModule/HoldsModule");
var RisersFallersModule_1 = require("../RisersFallersModule/RisersFallersModule");
var material_1 = require("@mui/material");
var PositionalGrades_1 = require("../PositionalGrades/PositionalGrades");
var ThreeYearOutlook_1 = require("../ThreeYearOutlook/ThreeYearOutlook");
var archetypes_1 = require("../../consts/archetypes");
var RookieDraft_1 = require("../../../rookieDraft/RookieDraft/RookieDraft");
var BigBoy_1 = require("../../../v1/modules/BigBoy/BigBoy");
function UnifiedModule(_a) {
    var roster = _a.roster, numRosters = _a.numRosters, teamName = _a.teamName;
    var _b = (0, CornerstonesModule_1.useCornerstones)(roster), cornerstones = _b.cornerstones, setCornerstones = _b.setCornerstones;
    var _c = (0, react_1.useState)([]), allPlayers = _c[0], setAllPlayers = _c[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var _d = (0, SuggestedMovesModule_1.useBuySells)(roster), sells = _d.sells, setSells = _d.setSells, buys = _d.buys, setBuys = _d.setBuys, plusMap = _d.plusMap, setPlusMap = _d.setPlusMap;
    var _e = (0, HoldsModule_1.useHolds)(roster), holds = _e.holds, setHolds = _e.setHolds;
    var _f = (0, RisersFallersModule_1.useRisersFallers)(roster), risers = _f.risers, setRisers = _f.setRisers, riserValues = _f.riserValues, setRiserValues = _f.setRiserValues, fallers = _f.fallers, setFallers = _f.setFallers, fallerValues = _f.fallerValues, setFallerValues = _f.setFallerValues;
    var _g = (0, hooks_1.usePositionalGrades)(), overall = _g.overall, setOverall = _g.setOverall, qb = _g.qb, setQb = _g.setQb, rb = _g.rb, setRb = _g.setRb, wr = _g.wr, setWr = _g.setWr, te = _g.te, setTe = _g.setTe;
    var _h = (0, ThreeYearOutlook_1.useThreeYearOutlook)(), outlookValues = _h.values, setOutlookValues = _h.setValues, outlook = _h.outlook, setOutlook = _h.setOutlook;
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        setAllPlayers(roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp));
    }, [roster, playerData]);
    var _j = (0, RookieDraft_1.useRookieDraft)(), draftPicks = _j.draftPicks, setDraftPicks = _j.setDraftPicks, rookieTargets = _j.rookieTargets, setRookieTargets = _j.setRookieTargets, draftStrategy = _j.draftStrategy, setDraftStrategy = _j.setDraftStrategy, draftCapitalScore = _j.draftCapitalScore, setDraftCapitalScore = _j.setDraftCapitalScore, autoPopulatedDraftStrategy = _j.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _j.setAutoPopulatedDraftStrategy, sortByRookieRank = _j.sortByRookieRank;
    var _k = (0, react_1.useState)([
        '2025 Rookie Picks',
        '2026 Rookie Picks',
    ]), rookiePickHeaders = _k[0], setRookiePickHeaders = _k[1];
    var rankStateMap = new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, (0, react_1.useState)('4th')]; }));
    return (<div>
            <ExportButton_1.default className={[
            'rosterGraphic',
            'settingsGraphic',
            'cornerstonesGraphic',
            'suggestedMovesGraphic',
            'holdsGraphic',
            'risersFallersGraphic',
            'positionalGradesGraphic',
            'threeYearOutlookGraphic',
        ]} zipName={"".concat(teamName, "_unified.zip")}/>
            <UnifiedInputs roster={roster} cornerstones={cornerstones} setCornerstones={setCornerstones} sells={sells} setSells={setSells} buys={buys} setBuys={setBuys} plusMap={plusMap} setPlusMap={setPlusMap} holds={holds} setHolds={setHolds} risers={risers} setRisers={setRisers} riserValues={riserValues} setRiserValues={setRiserValues} fallers={fallers} setFallers={setFallers} fallerValues={fallerValues} setFallerValues={setFallerValues} rankStateMap={rankStateMap} overall={overall} setOverall={setOverall} qb={qb} setQb={setQb} rb={rb} setRb={setRb} wr={wr} setWr={setWr} te={te} setTe={setTe} draftPicks={draftPicks} setDraftPicks={setDraftPicks} rookieTargets={rookieTargets} setRookieTargets={setRookieTargets} draftStrategy={draftStrategy} setDraftStrategy={setDraftStrategy} draftCapitalScore={draftCapitalScore} setDraftCapitalScore={setDraftCapitalScore} autoPopulatedDraftStrategy={autoPopulatedDraftStrategy} setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy} sortByRookieRank={sortByRookieRank} outlookValues={outlookValues} setOutlookValues={setOutlookValues} outlook={outlook} setOutlook={setOutlook} rookiePickHeaders={rookiePickHeaders} setRookiePickHeaders={setRookiePickHeaders}/>
            <CornerstonesModule_1.GraphicComponent cornerstones={cornerstones} graphicClassName="cornerstonesGraphic"/>
            <RosterModule_1.GraphicComponent allPlayers={allPlayers} rankStateMap={rankStateMap} numRosters={numRosters !== null && numRosters !== void 0 ? numRosters : 0} graphicClassName="rosterGraphic"/>
            <SettingsModule_1.GraphicComponent leagueId={leagueId} numRosters={numRosters !== null && numRosters !== void 0 ? numRosters : 0} graphicClassName="settingsGraphic"/>
            <SuggestedMovesModule_1.GraphicComponent sells={sells} buys={buys} graphicClassName="suggestedMovesGraphic" plusMap={plusMap}/>
            <HoldsModule_1.GraphicComponent holds={holds} graphicClassName="holdsGraphic"/>
            <RisersFallersModule_1.GraphicComponent risers={risers} fallers={fallers} riserValues={riserValues} fallerValues={fallerValues} graphicClassName="risersFallersGraphic"/>
            <PositionalGrades_1.GraphicComponent overall={overall} qb={qb} rb={rb} wr={wr} te={te} draftCapitalScore={draftCapitalScore} graphicClassName="positionalGradesGraphic"/>
            <ThreeYearOutlook_1.GraphicComponent values={outlookValues} outlook={outlook} graphicClassName="threeYearOutlookGraphic"/>
        </div>);
}
function UnifiedInputs(_a) {
    var _b, _c, _d, _e;
    var roster = _a.roster, cornerstones = _a.cornerstones, setCornerstones = _a.setCornerstones, sells = _a.sells, setSells = _a.setSells, buys = _a.buys, setBuys = _a.setBuys, plusMap = _a.plusMap, setPlusMap = _a.setPlusMap, holds = _a.holds, setHolds = _a.setHolds, risers = _a.risers, setRisers = _a.setRisers, riserValues = _a.riserValues, setRiserValues = _a.setRiserValues, fallers = _a.fallers, setFallers = _a.setFallers, fallerValues = _a.fallerValues, setFallerValues = _a.setFallerValues, rankStateMap = _a.rankStateMap, overall = _a.overall, setOverall = _a.setOverall, qb = _a.qb, setQb = _a.setQb, rb = _a.rb, setRb = _a.setRb, wr = _a.wr, setWr = _a.setWr, te = _a.te, setTe = _a.setTe, draftCapitalScore = _a.draftCapitalScore, setDraftCapitalScore = _a.setDraftCapitalScore, draftPicks = _a.draftPicks, setDraftPicks = _a.setDraftPicks, rookieTargets = _a.rookieTargets, setRookieTargets = _a.setRookieTargets, draftStrategy = _a.draftStrategy, setDraftStrategy = _a.setDraftStrategy, autoPopulatedDraftStrategy = _a.autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy = _a.setAutoPopulatedDraftStrategy, sortByRookieRank = _a.sortByRookieRank, outlookValues = _a.outlookValues, setOutlookValues = _a.setOutlookValues, outlook = _a.outlook, setOutlook = _a.setOutlook, archetype = _a.archetype, setArchetype = _a.setArchetype, otherSettings = _a.otherSettings, setOtherSettings = _a.setOtherSettings, rookiePickComments = _a.rookiePickComments, setRookiePickComments = _a.setRookiePickComments, rookiePickHeaders = _a.rookiePickHeaders, setRookiePickHeaders = _a.setRookiePickHeaders, suggestionsAndComments = _a.suggestionsAndComments, setSuggestionsAndComments = _a.setSuggestionsAndComments;
    (0, react_1.useEffect)(function () {
        if (!draftPicks || !setRookiePickComments)
            return;
        var thisYearInfo = draftPicks
            .filter(function (draftPick) { return draftPick.round !== '' && draftPick.pick !== ''; })
            .map(function (draftPick) {
            return "".concat(draftPick.round, ".").concat(draftPick.pick && draftPick.pick < 10 ? '0' : '').concat(draftPick.pick);
        })
            .join(', ');
        setRookiePickComments(function (oldRookiePickComments) {
            return [thisYearInfo, oldRookiePickComments[1]];
        });
    }, [draftPicks]);
    return (<material_1.Grid2 container spacing={1} style={{ width: '1000px', height: 'fit-content' }}>
            <material_1.Grid2 size={8} className={UnifiedModule_module_css_1.default.gridItem}>
                Cornerstones
                <CornerstonesModule_1.InputComponent playerIds={(_b = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _b !== void 0 ? _b : []} setCornerstones={setCornerstones} cornerstones={cornerstones}/>
            </material_1.Grid2>
            <material_1.Grid2 size={4} className={UnifiedModule_module_css_1.default.gridItem}>
                Roster
                <div>
                    <RosterModule_1.InputComponent rankStateMap={rankStateMap}/>
                </div>
            </material_1.Grid2>
            <material_1.Grid2 size={6} className={UnifiedModule_module_css_1.default.gridItem}>
                Suggested Moves
                <SuggestedMovesModule_1.InputComponent playerIds={(_c = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _c !== void 0 ? _c : []} sells={sells} setSells={setSells} buys={buys} setBuys={setBuys} plusMap={plusMap} setPlusMap={setPlusMap}/>
            </material_1.Grid2>
            <material_1.Grid2 size={3.5} className={UnifiedModule_module_css_1.default.gridItem}>
                Risers/Fallers
                <RisersFallersModule_1.InputComponent playerIds={(_d = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _d !== void 0 ? _d : []} risers={risers} setRisers={setRisers} riserValues={riserValues} setRiserValues={setRiserValues} fallers={fallers} setFallers={setFallers} fallerValues={fallerValues} setFallerValues={setFallerValues}/>
            </material_1.Grid2>
            <material_1.Grid2 size={2.5} className={UnifiedModule_module_css_1.default.gridItem} style={{ gap: '6px' }}>
                Positional Grades
                <PositionalGrades_1.InputComponent overall={overall} setOverall={setOverall} qb={qb} setQb={setQb} rb={rb} setRb={setRb} wr={wr} setWr={setWr} te={te} setTe={setTe} draftCapitalScore={draftCapitalScore} setDraftCapitalScore={setDraftCapitalScore}/>
            </material_1.Grid2>
            <material_1.Grid2 size={4} className={UnifiedModule_module_css_1.default.gridItem}>
                Holds
                <HoldsModule_1.InputComponent playerIds={(_e = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _e !== void 0 ? _e : []} holds={holds} setHolds={setHolds}/>
                <BigBoy_1.DraftCapitalInput draftPicks={draftPicks} setDraftPicks={setDraftPicks}/>
            </material_1.Grid2>
            {!archetype &&
            outlookValues &&
            setOutlookValues &&
            setOutlook &&
            outlook &&
            setOutlook && (<material_1.Grid2 size={5.5} className={UnifiedModule_module_css_1.default.gridItem}>
                        Three Year Outlook
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <ThreeYearOutlook_1.InputComponent values={outlookValues} setValues={setOutlookValues} outlook={outlook} setOutlook={setOutlook}/>
                        </div>
                    </material_1.Grid2>)}
            <material_1.Grid2 size={3} className={UnifiedModule_module_css_1.default.gridItem}>
                {!!archetype && !!setArchetype && (<>
                        Archetype
                        <material_1.Select value={archetype} onChange={function (event) {
                setArchetype(event.target.value);
            }}>
                            {archetypes_1.ALL_ARCHETYPES.map(function (arch, idx) { return (<material_1.MenuItem value={arch} key={idx}>
                                    {arch}
                                </material_1.MenuItem>); })}
                        </material_1.Select>
                    </>)}
                {!!setOtherSettings && (<>
                        Other Settings
                        <material_1.TextField value={otherSettings} onChange={function (event) {
                setOtherSettings(event.target.value);
            }} label="Other Settings"/>
                    </>)}
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        }}>
                    Rookie Pick Comment Header
                    {rookiePickHeaders.map(function (comment, idx) { return (<material_1.TextField key={idx} value={comment} onChange={function (event) {
                setRookiePickHeaders(rookiePickHeaders.map(function (currHeader, i) {
                    return i === idx
                        ? event.target.value
                        : currHeader;
                }));
            }} label={"Header ".concat(idx + 1)}/>); })}
                </div>
                {!!setRookiePickComments && !!rookiePickComments && (<div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
            }}>
                        Rookie Pick Comments
                        {rookiePickComments.map(function (comment, idx) { return (<material_1.TextField key={idx} value={comment} onChange={function (event) {
                    setRookiePickComments(rookiePickComments.map(function (currComment, i) {
                        return i === idx
                            ? event.target.value
                            : currComment;
                    }));
                }} label={rookiePickHeaders[idx]}/>); })}
                    </div>)}
            </material_1.Grid2>
            {!!setSuggestionsAndComments && !!suggestionsAndComments && (<material_1.Grid2 size={4.5} className={UnifiedModule_module_css_1.default.gridItem} style={{ gap: '6px' }}>
                    Suggestions and Comments
                    {suggestionsAndComments.map(function (comment, idx) { return (<material_1.TextField key={idx} value={comment} onChange={function (event) {
                    setSuggestionsAndComments(suggestionsAndComments.map(function (currComment, i) {
                        return i === idx
                            ? event.target.value
                            : currComment;
                    }));
                }}/>); })}
                </material_1.Grid2>)}
            <material_1.Grid2 size={12} className={UnifiedModule_module_css_1.default.gridItem}>
                <RookieDraft_1.RookieDraftInputs draftPicks={draftPicks} setDraftPicks={setDraftPicks} rookieTargets={rookieTargets} setRookieTargets={setRookieTargets} draftStrategy={draftStrategy} setDraftStrategy={setDraftStrategy} autoPopulatedDraftStrategy={autoPopulatedDraftStrategy} setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy} sortByRookieRank={sortByRookieRank}/>
            </material_1.Grid2>
        </material_1.Grid2>);
}
