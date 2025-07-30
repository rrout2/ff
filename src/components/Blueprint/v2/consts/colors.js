"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionToColor = exports.color = void 0;
var color;
(function (color) {
    color["white"] = "#FFFFFF";
    color["qb"] = "#FCB040";
    color["rb"] = "#32C6F4";
    color["wr"] = "#AF76B3";
    color["te"] = "#D7DF21";
    color["red"] = "#D55455";
    color["none"] = "gray";
})(color || (exports.color = color = {}));
var positionToColor = {
    QB: color.qb,
    RB: color.rb,
    WR: color.wr,
    TE: color.te,
    none: color.none,
};
exports.positionToColor = positionToColor;
