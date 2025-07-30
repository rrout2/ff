"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StyledNumberInput;
var Unstable_NumberInput_1 = require("@mui/base/Unstable_NumberInput");
var material_1 = require("@mui/material");
var Add_1 = require("@mui/icons-material/Add");
var Remove_1 = require("@mui/icons-material/Remove");
function StyledNumberInput(props) {
    return (<Unstable_NumberInput_1.Unstable_NumberInput slots={{
            input: material_1.TextField,
            incrementButton: material_1.IconButton,
            decrementButton: material_1.IconButton,
        }} slotProps={{
            root: {
                style: { display: 'flex' },
            },
            input: {
                style: { width: props.width || '70px' },
                label: props.label,
            },
            incrementButton: {
                children: <Add_1.default />,
                style: { order: '1' },
            },
            decrementButton: {
                children: <Remove_1.default />,
            },
        }} {...props}/>);
}
