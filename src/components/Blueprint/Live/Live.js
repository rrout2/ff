"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Live;
exports.Outlook = Outlook;
var react_1 = require("react");
var Live_module_css_1 = require("./Live.module.css");
var images_1 = require("../../../consts/images");
var BigBoy_1 = require("../v1/modules/BigBoy/BigBoy");
var material_1 = require("@mui/material");
function Live() {
    var _a = (0, react_1.useState)(''), archetype = _a[0], setArchetype = _a[1];
    var _b = (0, react_1.useState)(0), qbGrade = _b[0], setQbGrade = _b[1];
    var _c = (0, react_1.useState)(0), rbGrade = _c[0], setRbGrade = _c[1];
    var _d = (0, react_1.useState)(0), wrGrade = _d[0], setWrGrade = _d[1];
    var _e = (0, react_1.useState)(0), teGrade = _e[0], setTeGrade = _e[1];
    var _f = (0, react_1.useState)(['', '', '']), outlooks = _f[0], setOutlooks = _f[1];
    return (<div className={Live_module_css_1.default.container}>
            <LiveInputs archetype={archetype} setArchetype={setArchetype} qbGrade={qbGrade} setQbGrade={setQbGrade} rbGrade={rbGrade} setRbGrade={setRbGrade} wrGrade={wrGrade} setWrGrade={setWrGrade} teGrade={teGrade} setTeGrade={setTeGrade} outlooks={outlooks} setOutlooks={setOutlooks}/>
            <div className={Live_module_css_1.default.liveBlueprint}>
                <PositionalGrade position={'QB'} grade={qbGrade} className={Live_module_css_1.default.qb}/>
                <PositionalGrade position={'RB'} grade={rbGrade} className={Live_module_css_1.default.rb}/>
                <PositionalGrade position={'WR'} grade={wrGrade} className={Live_module_css_1.default.wr}/>
                <PositionalGrade position={'TE'} grade={teGrade} className={Live_module_css_1.default.te}/>
                {outlooks.map(function (outlook, idx) { return (<Outlook key={idx} outlook={outlook} className={Live_module_css_1.default["year".concat(idx + 1)]}/>); })}
                {archetype && (<img src={BigBoy_1.ARCHETYPE_TO_IMAGE.get(archetype)} className={Live_module_css_1.default.archetype}/>)}
                <img src={images_1.blankLive}/>
            </div>
        </div>);
}
function PositionalGrade(_a) {
    var position = _a.position, grade = _a.grade, className = _a.className;
    return (<div className={"".concat(Live_module_css_1.default.positionalGrade, " ").concat(className || '')}>
            <div>{position}</div>
            <div>{grade}/10</div>
        </div>);
}
function Outlook(_a) {
    var outlook = _a.outlook, className = _a.className;
    return (<div className={"".concat(Live_module_css_1.default.outlook, " ").concat(className || '')}>{outlook}</div>);
}
function LiveInputs(_a) {
    var archetype = _a.archetype, setArchetype = _a.setArchetype, qbGrade = _a.qbGrade, setQbGrade = _a.setQbGrade, rbGrade = _a.rbGrade, setRbGrade = _a.setRbGrade, wrGrade = _a.wrGrade, setWrGrade = _a.setWrGrade, teGrade = _a.teGrade, setTeGrade = _a.setTeGrade, outlooks = _a.outlooks, setOutlooks = _a.setOutlooks;
    function reset() {
        setQbGrade(0);
        setRbGrade(0);
        setWrGrade(0);
        setTeGrade(0);
        setOutlooks(['', '', '']);
        setArchetype('');
    }
    return (<div className={Live_module_css_1.default.inputs}>
            <material_1.FormControl className={Live_module_css_1.default.formControlInput}>
                <material_1.InputLabel>Archetype</material_1.InputLabel>
                <material_1.Select value={archetype} label="Archetype" onChange={function (event) {
            setArchetype(event.target.value);
        }}>
                    <material_1.MenuItem value={''} key={''}>
                        Choose an Archetype:
                    </material_1.MenuItem>
                    {Object.values(BigBoy_1.Archetype).map(function (arch, idx) { return (<material_1.MenuItem value={arch} key={idx}>
                            {arch}
                        </material_1.MenuItem>); })}
                </material_1.Select>
            </material_1.FormControl>
            <GradeInput position={'QB'} grade={qbGrade} setGrade={setQbGrade}/>
            <GradeInput position={'RB'} grade={rbGrade} setGrade={setRbGrade}/>
            <GradeInput position={'WR'} grade={wrGrade} setGrade={setWrGrade}/>
            <GradeInput position={'TE'} grade={teGrade} setGrade={setTeGrade}/>
            {outlooks.map(function (_, idx) { return (<material_1.FormControl key={idx} className={Live_module_css_1.default.formControlInput}>
                    <material_1.InputLabel>Year {idx + 1}</material_1.InputLabel>
                    <material_1.Select label={"Year ".concat(idx + 1)} value={outlooks[idx]} onChange={function (event) {
                var newOutlooks = outlooks.slice();
                newOutlooks[idx] = event.target.value;
                setOutlooks(newOutlooks);
            }}>
                        <material_1.MenuItem value={''} key={''}>
                            Choose an outlook:
                        </material_1.MenuItem>
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
            <material_1.Button onClick={reset} variant="outlined">
                Reset
            </material_1.Button>
        </div>);
}
function GradeInput(_a) {
    var position = _a.position, grade = _a.grade, setGrade = _a.setGrade;
    return (<material_1.FormControl className={Live_module_css_1.default.formControlInput}>
            <material_1.InputLabel>{"".concat(position, " Grade")}</material_1.InputLabel>
            <material_1.Select value={grade.toString()} label={"".concat(position, " Grade")} onChange={function (event) {
            setGrade(event.target.value);
        }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (grade, idx) { return (<material_1.MenuItem value={grade} key={idx}>
                        {grade}
                    </material_1.MenuItem>); })}
            </material_1.Select>
        </material_1.FormControl>);
}
