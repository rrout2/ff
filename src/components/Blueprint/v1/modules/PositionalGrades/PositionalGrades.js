"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeByPosition = gradeByPosition;
exports.PositionalGrades = PositionalGrades;
exports.GraphicComponent = GraphicComponent;
exports.OverrideComponent = OverrideComponent;
var PositionalGrades_module_css_1 = require("./PositionalGrades.module.css");
var ExportButton_1 = require("../../../shared/ExportButton");
var material_1 = require("@mui/material");
var fantasy_1 = require("../../../../../consts/fantasy");
var images_1 = require("../../../../../consts/images");
var react_1 = require("react");
var hooks_1 = require("../../../../../hooks/hooks");
// from google spreadsheet
var THRESHOLDS = {
    SF: new Map([
        [
            fantasy_1.QB,
            new Map([
                [1, 20],
                [2, 35],
                [3, 55],
                [4, 70],
                [5, 85],
                [6, 100],
                [7, 120],
                [8, 145],
                [9, 170],
                [10, 200],
            ]),
        ],
        [
            fantasy_1.RB,
            new Map([
                [1, 1],
                [2, 15],
                [3, 33],
                [4, 45],
                [5, 58],
                [6, 72],
                [7, 90],
                [8, 108],
                [9, 126],
                [10, 144],
            ]),
        ],
        [
            fantasy_1.WR,
            new Map([
                [1, 0],
                [2, 30],
                [3, 50],
                [4, 70],
                [5, 90],
                [6, 110],
                [7, 130],
                [8, 155],
                [9, 185],
                [10, 225],
            ]),
        ],
    ]),
    ONE_QB: new Map([
        [
            fantasy_1.QB,
            new Map([
                [1, 14.275],
                [2, 28.75],
                [3, 43.125],
                [4, 57.5],
                [5, 71.875],
                [6, 86.25],
                [7, 100.625],
                [8, 115],
                [9, 129.375],
                [10, 143.75],
            ]),
        ],
        [
            fantasy_1.RB,
            new Map([
                [1, 1],
                [2, 15],
                [3, 33],
                [4, 45],
                [5, 58],
                [6, 72],
                [7, 90],
                [8, 108],
                [9, 126],
                [10, 144],
            ]),
        ],
        [
            fantasy_1.WR,
            new Map([
                [1, 0],
                [2, 30],
                [3, 50],
                [4, 70],
                [5, 90],
                [6, 110],
                [7, 130],
                [8, 155],
                [9, 185],
                [10, 225],
            ]),
        ],
    ]),
};
/**
 * Given number starting players = num of teams * num of starters.
 * Small: <= 80
 * Medium: 81 - 119
 * Large: >= 120
 */
function getStarterPoolSizeMultiplier(numTeams, numStarters, pos, isSuperFlex) {
    var starterSize = numTeams * numStarters;
    if (isSuperFlex) {
        if (starterSize <= 80) {
            return LEAGUE_SIZE_MULTIPLIERS.SF.SMALL.get(pos);
        }
        else if (starterSize <= 119) {
            return LEAGUE_SIZE_MULTIPLIERS.SF.MEDIUM.get(pos);
        }
        else {
            return LEAGUE_SIZE_MULTIPLIERS.SF.LARGE.get(pos);
        }
    }
    else {
        if (starterSize <= 80) {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.SMALL.get(pos);
        }
        else if (starterSize <= 119) {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.MEDIUM.get(pos);
        }
        else {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.LARGE.get(pos);
        }
    }
}
var LEAGUE_SIZE_MULTIPLIERS = {
    SF: {
        SMALL: new Map([
            [fantasy_1.QB, 0.85],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 0.9],
            [fantasy_1.WR, 0.9],
        ]),
        MEDIUM: new Map([
            [fantasy_1.QB, 0.95],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 0.95],
            [fantasy_1.WR, 0.95],
        ]),
        LARGE: new Map([
            [fantasy_1.QB, 1],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 1],
            [fantasy_1.WR, 1],
        ]),
    },
    ONE_QB: {
        SMALL: new Map([
            [fantasy_1.QB, 0.8],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 0.9],
            [fantasy_1.WR, 0.9],
        ]),
        MEDIUM: new Map([
            [fantasy_1.QB, 0.85],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 0.95],
            [fantasy_1.WR, 0.95],
        ]),
        LARGE: new Map([
            [fantasy_1.QB, 0.9],
            [fantasy_1.TE, 1],
            [fantasy_1.RB, 1],
            [fantasy_1.WR, 1],
        ]),
    },
};
function PositionalGrades(_a) {
    var roster = _a.roster, teamName = _a.teamName, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent, isSuperFlex = _a.isSuperFlex, leagueSize = _a.leagueSize;
    var _b = (0, react_1.useState)(new Map(fantasy_1.FANTASY_POSITIONS.map(function (pos) { return [pos, -1]; }))), overrides = _b[0], setOverrides = _b[1];
    return (<div>
            {!graphicComponentClass && (<ExportButton_1.default className={PositionalGrades_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_positional_grades.png")}/>)}
            <OverrideComponent overrides={overrides} setOverrides={setOverrides} roster={roster} isSuperFlex={isSuperFlex} leagueSize={leagueSize}/>
            <GraphicComponent overrides={overrides} roster={roster} graphicComponentClass={graphicComponentClass} transparent={transparent} isSuperFlex={isSuperFlex} leagueSize={leagueSize}/>
        </div>);
}
function GraphicComponent(_a) {
    var overrides = _a.overrides, roster = _a.roster, graphicComponentClass = _a.graphicComponentClass, transparent = _a.transparent, isSuperFlex = _a.isSuperFlex, leagueSize = _a.leagueSize, numStarters = _a.numStarters;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPlayerValue = (0, hooks_1.usePlayerValues)().getPlayerValue;
    function gradeToSliderHeight(grade) {
        return grade * 27.5 - 25;
    }
    function scaleAndSliderColumn(grade, position) {
        if (grade < 0 || grade > 10) {
            console.error("grade out of range [0, 10]: '".concat(grade, "'"));
        }
        return (<div className={PositionalGrades_module_css_1.default.column} key={position}>
                <div className={PositionalGrades_module_css_1.default.scaleAndSlider}>
                    <img src={images_1.scale} className={PositionalGrades_module_css_1.default.scale}/>
                    <img src={images_1.slider} className={"".concat(PositionalGrades_module_css_1.default.slider)} style={{
                bottom: "".concat(gradeToSliderHeight(grade), "px"),
            }}/>
                </div>
                <div className={"".concat(PositionalGrades_module_css_1.default.chip, " ").concat(PositionalGrades_module_css_1.default[position])}>
                    {position}
                </div>
                <div className={PositionalGrades_module_css_1.default.grade}>
                    {grade}
                    <span className={PositionalGrades_module_css_1.default.slash}>/</span>10
                </div>
            </div>);
    }
    return (<div className={"".concat(PositionalGrades_module_css_1.default.graphicComponent, " ").concat(graphicComponentClass !== null && graphicComponentClass !== void 0 ? graphicComponentClass : '', " ").concat(transparent ? '' : PositionalGrades_module_css_1.default.background)}>
            {fantasy_1.FANTASY_POSITIONS.map(function (position) {
            var grade = 0;
            if (overrides && overrides.get(position) >= 0) {
                grade = overrides.get(position);
            }
            else {
                grade = gradeByPosition(position, getPlayerValue, isSuperFlex, leagueSize, playerData, roster, numStarters);
            }
            return scaleAndSliderColumn(grade, position);
        })}
        </div>);
}
function OverrideComponent(_a) {
    var overrides = _a.overrides, setOverrides = _a.setOverrides, roster = _a.roster, isSuperFlex = _a.isSuperFlex, leagueSize = _a.leagueSize;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPlayerValue = (0, hooks_1.usePlayerValues)().getPlayerValue;
    function overrideSelector(pos) {
        if (!fantasy_1.SUPER_FLEX_SET.has(pos)) {
            throw new Error("Unknown position '".concat(pos, "'"));
        }
        return (<material_1.FormControl key={pos} style={{ margin: '4px' }}>
                <material_1.InputLabel>{pos}</material_1.InputLabel>
                <material_1.Select value={overrides.get(pos)} label={pos} onChange={function (e) {
                var newOverrides = new Map(overrides);
                if (!e)
                    return;
                newOverrides.set(pos, +e.target.value);
                setOverrides(newOverrides);
            }}>
                    <material_1.MenuItem value={-1}>
                        None (
                        {gradeByPosition(pos, getPlayerValue, isSuperFlex, leagueSize, playerData, roster)}
                        )
                    </material_1.MenuItem>
                    {Array.from({ length: 11 }, function (_, index) { return (<material_1.MenuItem key={index} value={index}>
                            {index}
                        </material_1.MenuItem>); })}
                </material_1.Select>
            </material_1.FormControl>);
    }
    return <>{fantasy_1.FANTASY_POSITIONS.map(function (pos) { return overrideSelector(pos); })}</>;
}
function scoreAndBumpByPosition(pos, getPlayerValue, isSuperFlex, leagueSize, playerData, roster, numStarters) {
    var _a, _b, _c;
    if (!fantasy_1.SUPER_FLEX_SET.has(pos)) {
        throw new Error("Unknown position '".concat(pos, "'"));
    }
    if (pos === fantasy_1.TE) {
        throw new Error('Should use manual TE calculation');
    }
    if (!playerData || !roster || !roster.players)
        return { score: 0, bump: 0 };
    var totalBump = 0;
    var multiplier = getStarterPoolSizeMultiplier(leagueSize, (_c = (_b = (_a = roster === null || roster === void 0 ? void 0 : roster.starters) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : numStarters) !== null && _c !== void 0 ? _c : 0, pos, isSuperFlex);
    return {
        score: multiplier *
            roster.players
                .map(function (playerId) { return playerData[playerId]; })
                .filter(function (player) { return !!player && player.fantasy_positions.includes(pos); })
                .reduce(function (acc, player) {
                var fullName = "".concat(player.first_name, " ").concat(player.last_name);
                var playerValue = getPlayerValue(fullName);
                if (!playerValue) {
                    console.warn("cannot find PlayerValue for player with name = '".concat(fullName, "'"));
                    return acc;
                }
                if (isSuperFlex) {
                    totalBump += +playerValue.sfBonus;
                }
                else {
                    totalBump += +playerValue.oneQbBonus;
                }
                return acc + +playerValue.Value;
            }, 0),
        bump: totalBump,
    };
}
function gradeByPosition(pos, getPlayerValue, isSuperFlex, leagueSize, playerData, roster, numStarters) {
    if (!playerData || !roster || !roster.players)
        return 0;
    if (pos === fantasy_1.TE) {
        return Math.max.apply(Math, roster.players
            .map(function (playerId) { return playerData[playerId]; })
            .filter(function (player) { return !!player; })
            .map(function (player) {
            var _a;
            return ((_a = getPlayerValue("".concat(player.first_name, " ").concat(player.last_name))) === null || _a === void 0 ? void 0 : _a.teValue) || 0;
        }));
    }
    var _a = scoreAndBumpByPosition(pos, getPlayerValue, !!isSuperFlex, leagueSize, playerData, roster, numStarters), score = _a.score, bump = _a.bump;
    // console.log('score', score);
    // console.log('bump', bump);
    if (!fantasy_1.SUPER_FLEX_SET.has(pos)) {
        throw new Error("Unknown position '".concat(pos, "'"));
    }
    var thresholdByGrade = isSuperFlex
        ? THRESHOLDS.SF.get(pos)
        : THRESHOLDS.ONE_QB.get(pos);
    if (!thresholdByGrade) {
        throw new Error("Unknown position '".concat(pos, "'"));
    }
    var rawGrade = 0;
    var minDiff = Infinity;
    // Choose the closest grade
    for (var i = 10; i > 0; i--) {
        var diff = Math.abs(score - thresholdByGrade.get(i));
        if (diff < minDiff) {
            rawGrade = i;
            minDiff = diff;
        }
    }
    var unbumpedLimit = 10;
    if (pos === fantasy_1.QB && !isSuperFlex) {
        unbumpedLimit = 8;
    }
    var cappedGrade = Math.round(Math.min(rawGrade, unbumpedLimit));
    return Math.min(cappedGrade + bump, 10);
}
