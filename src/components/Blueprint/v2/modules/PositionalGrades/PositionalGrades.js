"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PositionalGrades;
exports.InputComponent = InputComponent;
exports.GraphicComponent = GraphicComponent;
var PositionalGrades_module_css_1 = require("./PositionalGrades.module.css");
var react_konva_1 = require("react-konva");
var StyledNumberInput_1 = require("../../../shared/StyledNumberInput");
var ExportButton_1 = require("../../../shared/ExportButton");
var colors_1 = require("../../../../../consts/colors");
var hooks_1 = require("../../../../../hooks/hooks");
var CENTER = [300, 300];
function PositionalGrades(_a) {
    var teamName = _a.teamName, roster = _a.roster, leagueSize = _a.leagueSize;
    var _b = (0, hooks_1.usePositionalGrades)(roster, leagueSize), overall = _b.overall, setOverall = _b.setOverall, qb = _b.qb, setQb = _b.setQb, rb = _b.rb, setRb = _b.setRb, wr = _b.wr, setWr = _b.setWr, te = _b.te, setTe = _b.setTe, depth = _b.depth, setDepth = _b.setDepth;
    return (<>
            <ExportButton_1.default className={PositionalGrades_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_positional_grades.png")}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <InputComponent overall={overall} setOverall={setOverall} qb={qb} setQb={setQb} rb={rb} setRb={setRb} wr={wr} setWr={setWr} te={te} setTe={setTe} draftCapitalScore={depth} setDraftCapitalScore={setDepth}/>
            </div>
            <GraphicComponent overall={overall} qb={qb} rb={rb} wr={wr} te={te} draftCapitalScore={depth}/>
        </>);
}
function InputComponent(_a) {
    var overall = _a.overall, setOverall = _a.setOverall, qb = _a.qb, setQb = _a.setQb, rb = _a.rb, setRb = _a.setRb, wr = _a.wr, setWr = _a.setWr, te = _a.te, setTe = _a.setTe, draftCapitalScore = _a.draftCapitalScore, setDraftCapitalScore = _a.setDraftCapitalScore;
    return (<>
            <StyledNumberInput_1.default value={overall} onChange={function (_, value) { return setOverall(value || 0); }} label="Overall" min={0} max={10}/>
            <StyledNumberInput_1.default value={qb} onChange={function (_, value) { return setQb(value || 0); }} label="QB" min={0} max={10}/>
            <StyledNumberInput_1.default value={rb} onChange={function (_, value) { return setRb(value || 0); }} label="RB" min={0} max={10}/>
            <StyledNumberInput_1.default value={wr} onChange={function (_, value) { return setWr(value || 0); }} label="WR" min={0} max={10}/>
            <StyledNumberInput_1.default value={te} onChange={function (_, value) { return setTe(value || 0); }} label="TE" min={0} max={10}/>
            <StyledNumberInput_1.default value={draftCapitalScore} onChange={function (_, value) { return setDraftCapitalScore(value || 0); }} label="DC" min={0} max={10}/>
        </>);
}
function GraphicComponent(_a) {
    var overall = _a.overall, qb = _a.qb, rb = _a.rb, wr = _a.wr, te = _a.te, draftCapitalScore = _a.draftCapitalScore, graphicClassName = _a.graphicClassName, _b = _a.transparent, transparent = _b === void 0 ? false : _b;
    var hexRadius = 250;
    var coordinates = [
        {
            x: CENTER[0],
            y: CENTER[1] - hexRadius * (overall / 10),
            grade: overall,
            position: 'overall',
        },
        {
            x: CENTER[0] + hexRadius * Math.cos(Math.PI / 6) * (qb / 10),
            y: CENTER[1] - hexRadius * Math.sin(Math.PI / 6) * (qb / 10),
            grade: qb,
            position: 'QB',
        },
        {
            x: CENTER[0] + hexRadius * Math.cos(Math.PI / 6) * (rb / 10),
            y: CENTER[1] + hexRadius * Math.sin(Math.PI / 6) * (rb / 10),
            grade: rb,
            position: 'RB',
        },
        {
            x: CENTER[0],
            y: CENTER[1] + hexRadius * (wr / 10),
            grade: wr,
            position: 'WR',
        },
        {
            x: CENTER[0] - hexRadius * Math.cos(Math.PI / 6) * (te / 10),
            y: CENTER[1] + hexRadius * Math.sin(Math.PI / 6) * (te / 10),
            grade: te,
            position: 'TE',
        },
        {
            x: CENTER[0] -
                hexRadius * Math.cos(Math.PI / 6) * (draftCapitalScore / 10),
            y: CENTER[1] -
                hexRadius * Math.sin(Math.PI / 6) * (draftCapitalScore / 10),
            grade: draftCapitalScore,
            position: 'draftCapital',
        },
    ];
    return (<react_konva_1.Stage width={600} height={600} className={"".concat(PositionalGrades_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            <react_konva_1.Layer>
                <BackgroundHexagon radius={500}/>
                <BackgroundHexagon radius={400}/>
                <BackgroundHexagon radius={300}/>
                <BackgroundHexagon radius={200}/>
                <BackgroundHexagon radius={100}/>
                <GradeShape coordinates={coordinates}/>
                <GradeCircles coordinates={coordinates}/>
                <GradeLabels coordinates={coordinates}/>
            </react_konva_1.Layer>
        </react_konva_1.Stage>);
}
var GradeShape = function (_a) {
    var coordinates = _a.coordinates;
    return (<react_konva_1.Shape sceneFunc={function (context, shape) {
            context.beginPath();
            coordinates.forEach(function (_a) {
                var x = _a.x, y = _a.y;
                context.lineTo(x, y);
            });
            context.closePath();
            context.fillStrokeShape(shape);
        }} stroke={'white'} strokeWidth={3} fill={'#0D2544'} opacity={0.7}/>);
};
var GradeCircles = function (_a) {
    var coordinates = _a.coordinates;
    return (<>
            {coordinates.map(function (_a) {
            var x = _a.x, y = _a.y, position = _a.position;
            return (<react_konva_1.Shape key={position} sceneFunc={function (context, shape) {
                    context.beginPath();
                    context.arc(x, y, 20, 0, 2 * Math.PI);
                    context.closePath();
                    context.fillStrokeShape(shape);
                }} stroke={'#023049'} fill={colors_1.COLORS.get(position)}/>);
        })}
        </>);
};
var GradeLabels = function (_a) {
    var coordinates = _a.coordinates;
    return (<>
            {coordinates.map(function (_a) {
            var x = _a.x, y = _a.y, grade = _a.grade, position = _a.position;
            return (<react_konva_1.Text key={position} x={x - 25} y={y - 23} width={50} height={50} fontSize={20} fontFamily="Erbaum" fill={'#023049'} align="center" verticalAlign="middle" text={grade.toString()}/>);
        })}
        </>);
};
var BackgroundHexagon = function (_a) {
    var radius = _a.radius;
    return (<react_konva_1.RegularPolygon x={CENTER[0]} y={CENTER[1]} sides={6} radius={radius} width={radius} height={radius} stroke={'gray'} strokeWidth={3}/>);
};
