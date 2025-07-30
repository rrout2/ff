"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuySells = useBuySells;
exports.default = SuggestedMovesModule;
exports.GraphicComponent = GraphicComponent;
exports.SellTile = SellTile;
exports.HoldTile = HoldTile;
exports.InputComponent = InputComponent;
var react_1 = require("react");
var SuggestedMovesModule_module_css_1 = require("./SuggestedMovesModule.module.css");
var hooks_1 = require("../../../../../hooks/hooks");
var PlayerSelectComponent_1 = require("../../../shared/PlayerSelectComponent");
var PlayersToTargetModule_1 = require("../../../v1/modules/playerstotarget/PlayersToTargetModule");
var colors_1 = require("../../consts/colors");
var nflTeamNames_1 = require("../../consts/nflTeamNames");
var ExportButton_1 = require("../../../shared/ExportButton");
var fantasy_1 = require("../../../../../consts/fantasy");
var images_1 = require("../../../../../consts/images");
var material_1 = require("@mui/material");
function useBuySells(roster) {
    var _a = (0, react_1.useState)([]), sells = _a[0], setSells = _a[1];
    var _b = (0, react_1.useState)([
        '10229',
        '5849',
        '4866',
        '10859',
        '11565',
        '11638',
    ]), buys = _b[0], setBuys = _b[1];
    var playerData = (0, hooks_1.usePlayerData)();
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    var _c = (0, react_1.useState)(new Map(buys.map(function (b) { return [b, false]; }))), plusMap = _c[0], setPlusMap = _c[1];
    (0, react_1.useEffect)(function () {
        if (!roster || !playerData)
            return;
        setSells(roster.players
            .map(function (p) { return playerData[p]; })
            .filter(function (p) { return !!p; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; })
            .slice(0, 3));
    }, [roster, playerData]);
    return { sells: sells, setSells: setSells, buys: buys, setBuys: setBuys, plusMap: plusMap, setPlusMap: setPlusMap };
}
function SuggestedMovesModule(_a) {
    var _b;
    var roster = _a.roster, teamName = _a.teamName;
    var _c = useBuySells(roster), sells = _c.sells, setSells = _c.setSells, buys = _c.buys, setBuys = _c.setBuys, plusMap = _c.plusMap, setPlusMap = _c.setPlusMap;
    return (<>
            <ExportButton_1.default className={SuggestedMovesModule_module_css_1.default.graphicComponent} pngName={"".concat(teamName, "_suggestedmoves.png")}/>
            <InputComponent playerIds={(_b = roster === null || roster === void 0 ? void 0 : roster.players) !== null && _b !== void 0 ? _b : []} sells={sells} setSells={setSells} buys={buys} setBuys={setBuys} plusMap={plusMap} setPlusMap={setPlusMap}/>
            <GraphicComponent sells={sells} buys={buys} plusMap={plusMap}/>
        </>);
}
function GraphicComponent(_a) {
    var sells = _a.sells, buys = _a.buys, graphicClassName = _a.graphicClassName, plusMap = _a.plusMap, _b = _a.transparent, transparent = _b === void 0 ? false : _b;
    return (<div className={"".concat(SuggestedMovesModule_module_css_1.default.graphicComponent, " ").concat(graphicClassName || '')} style={{ backgroundColor: transparent ? 'transparent' : '#005D91' }}>
            {sells.length > 0 &&
            sells.map(function (s, idx) {
                var _a, _b;
                return (<div key={idx} className={SuggestedMovesModule_module_css_1.default.buySellColumn}>
                        <SellTile playerId={s}/>
                        {idx * 2 < buys.length && (<BuyTile playerId={buys[idx * 2]} plus={(_a = plusMap.get(buys[idx * 2])) !== null && _a !== void 0 ? _a : false}/>)}
                        {idx * 2 + 1 < buys.length && (<BuyTile playerId={buys[idx * 2 + 1]} plus={(_b = plusMap.get(buys[idx * 2 + 1])) !== null && _b !== void 0 ? _b : false}/>)}
                    </div>);
            })}
        </div>);
}
function SellTile(_a) {
    var playerId = _a.playerId;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPositionalAdp = (0, hooks_1.useAdpData)().getPositionalAdp;
    if (!playerData)
        return <></>;
    var player = playerData[playerId];
    if (!player) {
        console.warn("Player ".concat(playerId, " not found in player data"));
        if ((0, PlayersToTargetModule_1.isRookiePickId)(playerId)) {
            player = {
                first_name: '',
                last_name: playerId,
                position: 'none',
                sport: 'nfl',
                team: 'TBD',
                player_id: playerId,
            };
        }
        else {
            return <></>;
        }
    }
    return (<div className={SuggestedMovesModule_module_css_1.default.sellHoldTile} style={{ background: colors_1.positionToColor[player.position] }}>
            <div className={SuggestedMovesModule_module_css_1.default.sellLabelCol}>
                {<div className={SuggestedMovesModule_module_css_1.default.sellLabel}>
                        <img src={images_1.sellIcon} className={SuggestedMovesModule_module_css_1.default.sellIcon}/>
                        &nbsp;SELL
                    </div>}
            </div>
            <div className={SuggestedMovesModule_module_css_1.default.sellTileText}>
                {fantasy_1.FANTASY_POSITIONS.includes(player.position) && (<div className={SuggestedMovesModule_module_css_1.default.positionalAdp}>
                        {player.position}&nbsp;
                        {getPositionalAdp("".concat(player.first_name, " ").concat(player.last_name))}
                    </div>)}
                <div className={SuggestedMovesModule_module_css_1.default.playerName}>
                    {player.first_name} {player.last_name}
                </div>
                <div className={SuggestedMovesModule_module_css_1.default.teamName}>
                    {getTeamDisplayName(player)}
                </div>
            </div>
            <div style={{ width: '70px', height: '100%' }}/>
        </div>);
}
function HoldTile(_a) {
    var playerId = _a.playerId;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPositionalAdp = (0, hooks_1.useAdpData)().getPositionalAdp;
    if (!playerData)
        return <></>;
    var player = playerData[playerId];
    if (!player) {
        console.warn("Player ".concat(playerId, " not found in player data"));
        if ((0, PlayersToTargetModule_1.isRookiePickId)(playerId)) {
            player = {
                first_name: '',
                last_name: playerId,
                position: 'none',
                sport: 'nfl',
                team: 'TBD',
                player_id: playerId,
            };
        }
        else {
            return <></>;
        }
    }
    function getDisplayName() {
        var longName = "".concat(player.first_name, " ").concat(player.last_name);
        var shortName = "".concat(player.first_name[0], ". ").concat(player.last_name);
        return longName.length >= 17 ? shortName : longName;
    }
    return (<div className={SuggestedMovesModule_module_css_1.default.sellHoldTile} style={{ background: colors_1.positionToColor[player.position] }}>
            <div className={SuggestedMovesModule_module_css_1.default.holdTileTextAndHeadshot}>
                <img className={SuggestedMovesModule_module_css_1.default.holdPlayerImg} src={getImageSrc(player)} onError={function (_a) {
            var currentTarget = _a.currentTarget;
            currentTarget.onerror = null;
            currentTarget.src =
                'https://sleepercdn.com/images/v2/icons/player_default.webp';
        }}/>
                <div className={SuggestedMovesModule_module_css_1.default.holdTileText}>
                    <div className={SuggestedMovesModule_module_css_1.default.holdLabel}>
                        <img src={images_1.holdIcon} className={SuggestedMovesModule_module_css_1.default.sellIcon}/>
                        &nbsp;HOLD
                    </div>
                    <div className={SuggestedMovesModule_module_css_1.default.playerName}>{getDisplayName()}</div>
                    <div className={SuggestedMovesModule_module_css_1.default.teamName}>
                        {getTeamDisplayName(player)}
                    </div>
                </div>
            </div>
            <div className={SuggestedMovesModule_module_css_1.default.holdPositionalAdpColumn}>
                {fantasy_1.FANTASY_POSITIONS.includes(player.position) && (<div className={SuggestedMovesModule_module_css_1.default.positionalAdp}>
                        {player.position}&nbsp;
                        {getPositionalAdp("".concat(player.first_name, " ").concat(player.last_name))}
                    </div>)}
            </div>
        </div>);
}
function getImageSrc(player) {
    if ((0, PlayersToTargetModule_1.isRookiePickId)(player.player_id)) {
        return images_1.nflLogo;
    }
    return "https://sleepercdn.com/content/nfl/players/".concat(player.player_id, ".jpg");
}
function BuyTile(_a) {
    var playerId = _a.playerId, plus = _a.plus;
    var playerData = (0, hooks_1.usePlayerData)();
    var getPositionalAdp = (0, hooks_1.useAdpData)().getPositionalAdp;
    if (!playerData)
        return <></>;
    var player = playerData[playerId];
    if (!player) {
        console.warn("Player ".concat(playerId, " not found in player data"));
        if ((0, PlayersToTargetModule_1.isRookiePickId)(playerId)) {
            player = {
                first_name: '',
                last_name: (0, PlayersToTargetModule_1.rookiePickIdToString)(playerId),
                position: 'none',
                sport: 'nfl',
                team: 'TBD',
                player_id: playerId,
            };
        }
        else {
            return null;
        }
    }
    function getDisplayName() {
        var longName = "".concat(player.first_name, " ").concat(player.last_name).concat(plus ? ' (+)' : '');
        var shortName = "".concat(player.first_name[0], ". ").concat(player.last_name).concat(plus ? ' (+)' : '');
        return longName.length >= 20 ? shortName : longName;
    }
    return (<div className={SuggestedMovesModule_module_css_1.default.buyTileContainer}>
            <div className={SuggestedMovesModule_module_css_1.default.buyTileColumn}>
                <div className={SuggestedMovesModule_module_css_1.default.buyTile} style={{
            background: colors_1.positionToColor[player.position],
        }}>
                    {fantasy_1.FANTASY_POSITIONS.includes(player.position) && (<div className={SuggestedMovesModule_module_css_1.default.positionalAdp}>
                            {player.position}&nbsp;
                            {getPositionalAdp("".concat(player.first_name, " ").concat(player.last_name))}
                        </div>)}
                    <div className={SuggestedMovesModule_module_css_1.default.playerName}>{getDisplayName()}</div>
                    <div className={SuggestedMovesModule_module_css_1.default.teamName}>
                        {getTeamDisplayName(player)}
                    </div>
                </div>
            </div>
            <img className={SuggestedMovesModule_module_css_1.default.playerImg} src={getImageSrc(player)} onError={function (_a) {
            var currentTarget = _a.currentTarget;
            currentTarget.onerror = null;
            currentTarget.src =
                'https://sleepercdn.com/images/v2/icons/player_default.webp';
        }}/>
            <div className={SuggestedMovesModule_module_css_1.default.buyLabel}>
                BUY&nbsp;
                <img src={images_1.buyIcon} className={SuggestedMovesModule_module_css_1.default.sellIcon}/>
            </div>
        </div>);
}
function InputComponent(props) {
    var playerIds = props.playerIds, sells = props.sells, setSells = props.setSells, buys = props.buys, setBuys = props.setBuys, plusMap = props.plusMap, setPlusMap = props.setPlusMap;
    var playerData = (0, hooks_1.usePlayerData)();
    var nonIdPlayerOptions = [];
    for (var i = 1; i < 15; i++) {
        nonIdPlayerOptions.push("Rookie Pick 1.".concat(i < 10 ? "0".concat(i) : "".concat(i)));
    }
    nonIdPlayerOptions.push('2025 1st');
    nonIdPlayerOptions.push('2026 1st');
    return (<div style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
            <PlayerSelectComponent_1.default playerIds={playerIds} nonIdPlayerOptions={nonIdPlayerOptions} selectedPlayerIds={sells} onChange={setSells} label="Sells"/>
            <div className={SuggestedMovesModule_module_css_1.default.buyInput}>
                <div className={SuggestedMovesModule_module_css_1.default.playerBuyColumnInput}>
                    <PlayersToTargetModule_1.InputComponent playerSuggestions={buys} setPlayerSuggestions={setBuys} label="Buy"/>
                </div>
                <div className={SuggestedMovesModule_module_css_1.default.buyPlusColumn}>
                    {plusMap &&
            setPlusMap &&
            playerData &&
            buys.map(function (playerId) {
                var _a;
                var plus = (_a = plusMap.get(playerId)) !== null && _a !== void 0 ? _a : false;
                return (<material_1.FormControlLabel key={playerId} label={'plus?'} control={<material_1.Switch checked={plus} onChange={function () {
                            return setPlusMap(new Map(plusMap).set(playerId, !plus));
                        }}/>}/>);
            })}
                </div>
            </div>
        </div>);
}
function getTeamDisplayName(player) {
    var fullTeamName = nflTeamNames_1.mapToFullTeamName.get(player.team);
    if (!player.number) {
        if (fullTeamName)
            return fullTeamName;
        return '';
    }
    return "#".concat(player.number, " ").concat(nflTeamNames_1.mapToFullTeamName.get(player.team));
}
