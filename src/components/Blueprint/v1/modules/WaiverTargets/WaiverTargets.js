"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WaiverTargets;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var WaiverTargets_module_css_1 = require("./WaiverTargets.module.css");
var material_1 = require("@mui/material");
function WaiverTargets() {
    var _a = (0, react_1.useState)(''), target = _a[0], setTarget = _a[1];
    return (<>
            <InputComponent target={target} setTarget={setTarget}/>
            <GraphicComponent target={target}/>
        </>);
}
function GraphicComponent(_a) {
    var target = _a.target;
    return (<div className={WaiverTargets_module_css_1.default.graphicComponent}>
            <div className={WaiverTargets_module_css_1.default.targetText}>
                {target.toLocaleUpperCase()}
            </div>
        </div>);
}
function InputComponent(_a) {
    var target = _a.target, setTarget = _a.setTarget;
    return (<material_1.TextField style={{ margin: '4px' }} label={'Waiver Target'} value={target} onChange={function (e) {
            setTarget(e.target.value);
        }}/>);
}
