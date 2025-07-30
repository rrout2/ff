"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlayerSelectComponent;
var material_1 = require("@mui/material");
var hooks_1 = require("../../../hooks/hooks");
var react_1 = require("react");
function PlayerSelectComponent(props) {
    var _a, _b;
    var playerIds = props.playerIds, selectedPlayerIds = props.selectedPlayerIds, onChange = props.onChange, position = props.position, nonIdPlayerOptions = props.nonIdPlayerOptions, label = props.label, multiple = props.multiple, maxSelections = props.maxSelections, styles = props.styles;
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    var playerData = (0, hooks_1.usePlayerData)();
    var _c = (0, react_1.useState)([]), allPlayerOptions = _c[0], setAllPlayerOptions = _c[1];
    (0, react_1.useEffect)(function () {
        if (!playerData)
            return;
        var playerOpts = playerIds
            .map(function (playerId) { return playerData[playerId]; })
            .filter(function (player) { return !!player; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; });
        if (nonIdPlayerOptions) {
            playerOpts.push.apply(playerOpts, nonIdPlayerOptions);
        }
        setAllPlayerOptions(playerOpts);
    }, [playerIds, playerData, nonIdPlayerOptions]);
    if (!playerData || allPlayerOptions.length === 0)
        return <></>;
    return (<material_1.FormControl style={__assign({ margin: '4px', minWidth: '100px' }, styles)}>
            <material_1.InputLabel>{(_a = label !== null && label !== void 0 ? label : position) !== null && _a !== void 0 ? _a : 'Player'}</material_1.InputLabel>
            <material_1.Select value={selectedPlayerIds} label={(_b = label !== null && label !== void 0 ? label : position) !== null && _b !== void 0 ? _b : 'Player'} onChange={function (e) {
            var value = e.target.value;
            var newPlayerIds = typeof value === 'string' ? value.split(',') : value;
            if (multiple &&
                maxSelections &&
                newPlayerIds.length > maxSelections) {
                return;
            }
            onChange(newPlayerIds);
        }} multiple={multiple !== null && multiple !== void 0 ? multiple : true}>
                {allPlayerOptions.map(function (option, idx) {
            var player = playerData[option];
            var value = !player ? option : player.player_id;
            var display = !player
                ? option
                : "".concat(player.first_name, " ").concat(player.last_name);
            return (<material_1.MenuItem value={value} key={idx}>
                            {display}
                        </material_1.MenuItem>);
        })}
            </material_1.Select>
        </material_1.FormControl>);
}
