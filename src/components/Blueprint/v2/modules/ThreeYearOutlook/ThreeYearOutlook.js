"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThreeYearOutlook = exports.OutlookType = void 0;
exports.default = ThreeYearOutlook;
exports.InputComponent = InputComponent;
exports.GraphicComponent = GraphicComponent;
var react_1 = require("react");
var ThreeYearOutlook_module_css_1 = require("./ThreeYearOutlook.module.css");
var react_konva_1 = require("react-konva");
var StyledNumberInput_1 = require("../../../shared/StyledNumberInput");
var material_1 = require("@mui/material");
var ExportButton_1 = require("../../../shared/ExportButton");
var OutlookType;
(function (OutlookType) {
    OutlookType["RELOAD"] = "RELOAD";
    OutlookType["CONTEND"] = "CONTEND";
    OutlookType["REBUILD"] = "REBUILD";
})(OutlookType || (exports.OutlookType = OutlookType = {}));
var ALL_OUTLOOKS = Object.values(OutlookType);
var useThreeYearOutlook = function () {
    var _a = (0, react_1.useState)([
        50, 60, 65, 90, 80, 85, 85, 50, 25, 30,
    ]), values = _a[0], setValues = _a[1];
    var _b = (0, react_1.useState)([
        OutlookType.RELOAD,
        OutlookType.CONTEND,
        OutlookType.REBUILD,
    ]), outlook = _b[0], setOutlook = _b[1];
    return {
        values: values,
        setValues: setValues,
        outlook: outlook,
        setOutlook: setOutlook,
    };
};
exports.useThreeYearOutlook = useThreeYearOutlook;
function ThreeYearOutlook(_a) {
    var teamName = _a.teamName;
    var _b = (0, exports.useThreeYearOutlook)(), values = _b.values, setValues = _b.setValues, outlook = _b.outlook, setOutlook = _b.setOutlook;
    return (<div>
            <ExportButton_1.default pngName={"".concat(teamName, "_three_year_outlook.png")} className={'threeYearOutlookPng'}/>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <InputComponent values={values} setValues={setValues} outlook={outlook} setOutlook={setOutlook}/>
            </div>
            <GraphicComponent values={values} outlook={outlook} graphicClassName="threeYearOutlookPng"/>
        </div>);
}
function InputComponent(_a) {
    var values = _a.values, setValues = _a.setValues, outlook = _a.outlook, setOutlook = _a.setOutlook;
    return (<>
            <div className={ThreeYearOutlook_module_css_1.default.outlookInputColumn}>
                {values.map(function (value, idx) { return (<StyledNumberInput_1.default key={idx} value={value} onChange={function (_, newValue) {
                setValues(values.map(function (currValue, i) {
                    return i === idx ? newValue !== null && newValue !== void 0 ? newValue : 0 : currValue;
                }));
            }} min={0} max={100} label={'Value ' + (idx + 1)}/>); })}
            </div>
            <div className={ThreeYearOutlook_module_css_1.default.outlookInputColumn}>
                {outlook.map(function (_, idx) {
            return (<material_1.FormControl>
                            <material_1.InputLabel>Year {idx + 1}</material_1.InputLabel>
                            <material_1.Select key={idx} value={outlook[idx]} onChange={function (e) {
                    var newOutlook = outlook.slice();
                    newOutlook[idx] = e.target
                        .value;
                    setOutlook(newOutlook);
                }} label={'Year ' + (idx + 1)}>
                                {ALL_OUTLOOKS.map(function (outlookType, idx) { return (<material_1.MenuItem value={outlookType} key={idx}>
                                        {outlookType}
                                    </material_1.MenuItem>); })}
                            </material_1.Select>
                        </material_1.FormControl>);
        })}
            </div>
        </>);
}
function GraphicComponent(_a) {
    var graphicClassName = _a.graphicClassName, outlook = _a.outlook, values = _a.values, _b = _a.transparent, transparent = _b === void 0 ? false : _b;
    var width = 600;
    var height = 400;
    function outlookTypeToColor(outlook) {
        switch (outlook) {
            case OutlookType.RELOAD:
                return '#F58020';
            case OutlookType.CONTEND:
                return '#D7DF21';
            case OutlookType.REBUILD:
                return 'red';
        }
    }
    var GraphLine = function (_a) {
        var startIdx = _a.startIdx, endIdx = _a.endIdx, outlook = _a.outlook;
        return (<react_konva_1.Arrow points={values
                .slice(startIdx, endIdx + 1)
                .map(function (val, idx) {
                return [
                    ((startIdx + idx) * width) / 9,
                    height - val * (height / 100),
                ];
            })
                .flat()} fill={outlookTypeToColor(outlook)} stroke={outlookTypeToColor(outlook)} strokeWidth={12} lineCap={'round'} pointerWidth={endIdx < values.length - 1 ? 0 : 10} pointerLength={endIdx < values.length - 1 ? 0 : 10}/>);
    };
    var TextLabel = function (_a) {
        var idx = _a.idx, outlook = _a.outlook;
        return (<react_konva_1.Text x={(idx * width) / 3} y={(3 * height) / 4} width={200} height={50} fontSize={28} fontFamily="Erbaum Bold" fill={outlookTypeToColor(outlook)} align="center" verticalAlign="middle" text={outlook}/>);
    };
    return (<react_konva_1.Stage width={width + 20} height={height} className={"".concat(ThreeYearOutlook_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            <react_konva_1.Layer>
                <react_konva_1.Line points={[width / 3, height, width / 3, 0]} stroke={'gray'} dash={[10, 10]}/>
                <react_konva_1.Line points={[(2 * width) / 3, height, (2 * width) / 3, 0]} stroke={'gray'} dash={[10, 10]}/>
                <react_konva_1.Shape sceneFunc={function (context, shape) {
            context.beginPath();
            context.moveTo(0, height);
            values.forEach(function (value, idx) {
                context.lineTo((idx * width) / 9, height - value * (height / 100));
            });
            context.lineTo(width, height);
            context.closePath();
            context.fillStrokeShape(shape);
        }} fill={'gray'} opacity={0.5}/>
                {outlook.map(function (outlookType, idx) { return (<GraphLine key={idx} startIdx={idx * 3} endIdx={(idx + 1) * 3} outlook={outlookType}/>); })}
                {outlook.map(function (outlookType, idx) { return (<TextLabel key={idx} outlook={outlookType} idx={idx}/>); })}
            </react_konva_1.Layer>
        </react_konva_1.Stage>);
}
