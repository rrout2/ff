"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCornerstones = useCornerstones;
exports.default = CornerstonesModule;
exports.GraphicComponent = GraphicComponent;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var CornerstonesModule_module_css_1 = require("./CornerstonesModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var colors_1 = require("../../consts/colors");
var nflTeamNames_1 = require("../../consts/nflTeamNames");
var images_1 = require("../../../../../consts/images");
var ExportButton_1 = require("../../../shared/ExportButton");
var NONE_PLAYER_ID = 'None';
function useCornerstones(roster) {
    var _a = (0, react_1.useState)([]), cornerstones = _a[0], setCornerstones = _a[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        setCornerstones(roster.players
            .map(function (p) { return playerData[p]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; })
            .slice(0, 4));
    }, [roster, playerData]);
    return { cornerstones: cornerstones, setCornerstones: setCornerstones };
}
function CornerstonesModule(props) {
    var _a;
    var roster = props.roster, teamName = props.teamName;
    var _b = useCornerstones(roster), cornerstones = _b.cornerstones, setCornerstones = _b.setCornerstones;
    return (<>
            <ExportButton_1.default className={CornerstonesModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_cornerstones.png")}/>
            <InputComponent playerIds={(_a = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _a !== void 0 ? _a : []} cornerstones={cornerstones} setCornerstones={setCornerstones}/>
            <GraphicComponent cornerstones={cornerstones}/>
        </>);
}
function GraphicComponent(_a) {
    var cornerstones = _a.cornerstones, graphicClassName = _a.graphicClassName;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPositionalAdp = (0, hooks_1.useAdpData)().getPositionalAdp;
    function cornerstoneTile(playerId) {
        if (!playerData || !playerId)
            return <></>;
        var defaultPlayer = {
            position: 'none',
            team: '',
            player_id: NONE_PLAYER_ID,
            first_name: '',
            last_name: 'N/A',
            number: 0,
        };
        var player = playerId !== NONE_PLAYER_ID ? playerData[playerId] : defaultPlayer;
        var position = player.position;
        var teamLogo = images_1.teamSilhouettes.get(player.team);
        return (<div className={CornerstonesModule_module_css_1.default.cornerstoneTile} style={{
                background: colors_1.positionToColor[position],
            }}>
                {!!teamLogo && (<img src={teamLogo} className={CornerstonesModule_module_css_1.default.teamLogo}/>)}
                <img src={player.player_id === NONE_PLAYER_ID
                ? images_1.nflSilhouette
                : "https://sleepercdn.com/content/nfl/players/".concat(player.player_id, ".jpg")} onError={function (_a) {
                var currentTarget = _a.currentTarget;
                currentTarget.onerror = null;
                currentTarget.src =
                    'https://sleepercdn.com/images/v2/icons/player_default.webp';
            }} className={CornerstonesModule_module_css_1.default.headshot}/>
                {player.player_id !== NONE_PLAYER_ID && (<div className={CornerstonesModule_module_css_1.default.positionalAdp}>
                        {player.position}{' '}
                        {getPositionalAdp("".concat(player.first_name, " ").concat(player.last_name))}
                    </div>)}
                <div className={CornerstonesModule_module_css_1.default.tileText} style={player.player_id === NONE_PLAYER_ID
                ? { color: 'black' }
                : {}}>
                    <div className={CornerstonesModule_module_css_1.default.firstName}>
                        {player.first_name.toLocaleUpperCase()}
                    </div>
                    <div className={CornerstonesModule_module_css_1.default.lastName}>
                        {player.last_name.toLocaleUpperCase()}
                    </div>
                    <div className={CornerstonesModule_module_css_1.default.teamName}>
                        {nflTeamNames_1.mapToFullTeamName.get(player.team)}
                    </div>
                    {player.player_id !== NONE_PLAYER_ID && (<div className={CornerstonesModule_module_css_1.default.number}># {player.number}</div>)}
                </div>
            </div>);
    }
    return (<div className={"".concat(CornerstonesModule_module_css_1.default.graphicComponent, " ").concat(graphicClassName !== null && graphicClassName !== void 0 ? graphicClassName : '')}>
            <div className={CornerstonesModule_module_css_1.default.graphicRow}>
                {cornerstoneTile(cornerstones[0])}
                {cornerstoneTile(cornerstones[1])}
            </div>
            <div className={CornerstonesModule_module_css_1.default.graphicRow}>
                {cornerstoneTile(cornerstones[2])}
                {cornerstoneTile(cornerstones[3])}
            </div>
        </div>);
}
function InputComponent(props) {
    var playerIds = props.playerIds, cornerstones = props.cornerstones, setCornerstones = props.setCornerstones;
    return (<PlayerSelectComponent_1.default playerIds={playerIds} nonIdPlayerOptions={[NONE_PLAYER_ID]} selectedPlayerIds={cornerstones} onChange={setCornerstones} label="Cornerstones"/>);
}
