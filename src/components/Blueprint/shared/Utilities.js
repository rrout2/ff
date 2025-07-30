"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoImage = logoImage;
var images_1 = require("../../../consts/images");
function logoImage(team, className) {
    var _a;
    return (<img src={(_a = images_1.teamLogos.get(team !== null && team !== void 0 ? team : '')) !== null && _a !== void 0 ? _a : images_1.blankLogo} className={className}/>);
}
