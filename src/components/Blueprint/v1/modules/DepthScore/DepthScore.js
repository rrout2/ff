"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDepthScore = calculateDepthScore;
exports.DepthScore = DepthScore;
exports.GraphicComponent = GraphicComponent;
exports.OverrideComponent = OverrideComponent;
var DepthScore_module_css_1 = require("./DepthScore.module.css");
var ExportButton_1 = require("../../../shared/ExportButton");
var material_1 = require("@mui/material");
var react_1 = require("react");
var hooks_1 = require("../../../../../hooks/hooks");
var THRESHOLD = 150;
function DepthScore(_a) {
    var roster = _a.roster, teamName = _a.teamName, graphicComponentClass = _a.graphicComponentClass;
    var _b = (0, react_1.useState)(-1), override = _b[0], setOverride = _b[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var league = (0, hooks_1.useLeague)(leagueId);
    var rosterSettings = (0, hooks_1.useRosterSettings)(league);
    var _c = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players), bench = _c.bench, benchString = _c.benchString;
    return (<div style={{ display: 'flex', flexDirection: 'column' }}>
            {!graphicComponentClass && (<ExportButton_1.default className={DepthScore_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_depth_score.png")}/>)}
            <OverrideComponent override={override} setOverride={setOverride} roster={roster}/>
            <GraphicComponent override={override} graphicComponentClass={graphicComponentClass} transparent={false} benchString={benchString} bench={bench}/>
        </div>);
}
function GraphicComponent(_a) {
    var override = _a.override, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent, benchString = _a.benchString, bench = _a.bench;
    var _b = (0, react_1.useState)(-1), score = _b[0], setScore = _b[1];
    (0, react_1.useEffect)(function () {
        if (!bench.length)
            return;
        setScore(calculateDepthScoreOrOverride());
    }, [bench, override]);
    var getPlayerValue = (0, hooks_1.usePlayerValues)().getPlayerValue;
    function calculateDepthScoreOrOverride() {
        if (override >= 0)
            return override;
        return calculateDepthScore(bench, getPlayerValue);
    }
    var longBench = benchString.length > 305;
    return (<div className={"".concat(DepthScore_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : DepthScore_module_css_1.default.background)}>
            <div className={DepthScore_module_css_1.default.title}>DEPTH SCORE:</div>
            <div className={DepthScore_module_css_1.default.scoreSection}>
                <div className={DepthScore_module_css_1.default.scoreBar}>
                    <div className={DepthScore_module_css_1.default.scoreFill} style={{ width: "".concat(score, "0%") }}/>
                </div>
                <div className={DepthScore_module_css_1.default.score}>{score}/10</div>
            </div>
            <div className={"".concat(DepthScore_module_css_1.default.benchString).concat(longBench ? " ".concat(DepthScore_module_css_1.default.longBench) : '')}>
                {benchString}
            </div>
        </div>);
}
function OverrideComponent(_a) {
    var override = _a.override, setOverride = _a.setOverride, roster = _a.roster;
    var _b = (0, react_1.useState)(-1), initialScore = _b[0], setInitialScore = _b[1];
    var leagueId = (0, hooks_1.useLeagueIdFromUrl)()[0];
    var rosterSettings = (0, hooks_1.useRosterSettingsFromId)(leagueId);
    var bench = (0, hooks_1.useProjectedLineup)(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players).bench;
    var getPlayerValue = (0, hooks_1.usePlayerValues)().getPlayerValue;
    (0, react_1.useEffect)(function () {
        if (!bench.length)
            return;
        setInitialScore(calculateDepthScore(bench, getPlayerValue));
    }, [bench]);
    return (<material_1.FormControl style={{ margin: '8px' }}>
            <material_1.InputLabel>Override</material_1.InputLabel>
            <material_1.Select value={override} label={'Override'} onChange={function (e) {
            setOverride(+e.target.value);
        }}>
                <material_1.MenuItem value={-1}>None ({initialScore})</material_1.MenuItem>
                {Array.from({ length: 11 }, function (_, index) { return (<material_1.MenuItem key={index} value={index}>
                        {index}
                    </material_1.MenuItem>); })}
            </material_1.Select>
        </material_1.FormControl>);
}
function calculateDepthScore(bench, getPlayerValue) {
    var score = bench.reduce(function (acc, curr) {
        var playerValue = getPlayerValue("".concat(curr.first_name, " ").concat(curr.last_name));
        if (!playerValue)
            return acc;
        return acc + +playerValue.Value;
    }, 0);
    return Math.min(Math.round((10 * score) / THRESHOLD), 10);
}
