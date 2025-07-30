"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rankings;
exports.PlayerCard = PlayerCard;
exports.TierGraphic = TierGraphic;
var react_1 = require("react");
var Rankings_module_css_1 = require("./Rankings.module.css");
var material_1 = require("@mui/material");
var PlayersToTargetModule_1 = require("../Blueprint/v1/modules/playerstotarget/PlayersToTargetModule");
var hooks_1 = require("../../hooks/hooks");
var icons_material_1 = require("@mui/icons-material");
var images_1 = require("../../consts/images");
var ExportButton_1 = require("../Blueprint/shared/ExportButton");
var react_router_dom_1 = require("react-router-dom");
var Tier;
(function (Tier) {
    Tier["S"] = "S";
    Tier["A"] = "A";
    Tier["B"] = "B";
    Tier["C"] = "C";
    Tier["D"] = "D";
    Tier["F"] = "F";
    Tier["G"] = "G";
    Tier["H"] = "H";
})(Tier || (Tier = {}));
var ALL_TIERS = Object.values(Tier);
function Rankings() {
    var _a = (0, react_1.useState)(new Map(ALL_TIERS.map(function (tier) { return [tier, []]; }))), tiers = _a[0], setTiers = _a[1];
    var _b = (0, react_1.useState)(new Set()), allTieredPlayers = _b[0], setAllTieredPlayers = _b[1];
    var _c = (0, react_1.useState)(['10229']), playersToAdd = _c[0], setPlayersToAdd = _c[1];
    var sortByAdp = (0, hooks_1.useAdpData)().sortByAdp;
    var playerData = (0, hooks_1.usePlayerData)();
    var _d = (0, react_1.useState)(1), week = _d[0], setWeek = _d[1];
    var _e = (0, react_1.useState)([]), allPlayers = _e[0], setAllPlayers = _e[1];
    var _f = (0, react_1.useState)(true), displayRanks = _f[0], setDisplayRanks = _f[1];
    var _g = (0, react_router_dom_1.useSearchParams)(), searchParams = _g[0], setSearchParams = _g[1];
    (0, react_1.useEffect)(function () {
        var players = [];
        for (var playerId in playerData) {
            var player = playerData[playerId];
            if (!player || !player.player_id || !player.team)
                continue;
            players.push(player);
        }
        setAllPlayers(players.sort(sortByAdp));
    }, [playerData]);
    (0, react_1.useEffect)(function () {
        var newAllTieredPlayers = new Set();
        tiers.forEach(function (players, _) {
            players.forEach(function (player) {
                newAllTieredPlayers.add(player);
            });
        });
        setAllTieredPlayers(newAllTieredPlayers);
    }, [tiers]);
    (0, react_1.useEffect)(function () {
        var newTiers = new Map(tiers);
        ALL_TIERS.forEach(function (tier) {
            var tierFromUrl = searchParams.get(tierToUrlParam(tier));
            if (!tierFromUrl) {
                newTiers.delete(tier);
                return;
            }
            newTiers.set(tier, tierFromUrl.split(','));
        });
        setTiers(newTiers);
    }, [searchParams]);
    if (!playerData)
        return <></>;
    function tierToUrlParam(tier) {
        return tier.toLowerCase() + 'Tier';
    }
    function saveTiers() {
        setSearchParams(function (searchParams) {
            ALL_TIERS.forEach(function (tier) {
                if (!tiers.has(tier) || tiers.get(tier).length === 0) {
                    searchParams.delete(tierToUrlParam(tier));
                }
                else {
                    searchParams.set(tierToUrlParam(tier), tiers.get(tier).join(','));
                }
            });
            return searchParams;
        });
    }
    function hasUnsavedChanges() {
        return ALL_TIERS.some(function (tier) {
            var _a, _b;
            var urlParam = tierToUrlParam(tier);
            if (!tiers.has(tier) && searchParams.has(urlParam)) {
                return true;
            }
            if (tiers.has(tier) &&
                tiers.get(tier).length > 0 &&
                !searchParams.has(urlParam)) {
                return true;
            }
            var playersInTier = (_a = tiers.get(tier)) !== null && _a !== void 0 ? _a : [];
            var playersInUrl = (_b = searchParams.get(urlParam)) !== null && _b !== void 0 ? _b : '';
            return playersInTier.join(',') !== playersInUrl;
        });
    }
    function addToTier(tier, player) {
        if (tiers.get(tier).includes(player)) {
            return;
        }
        setTiers(function (tiers) {
            var newTiers = new Map(tiers);
            newTiers.set(tier, __spreadArray(__spreadArray([], tiers.get(tier), true), [player], false));
            newTiers.forEach(function (players, currentTier) {
                if (currentTier === tier)
                    return;
                if (players.includes(player)) {
                    newTiers.set(currentTier, players.filter(function (p) { return p !== player; }));
                }
            });
            return newTiers;
        });
    }
    function removePlayer(playerId) {
        setTiers(function (tiers) {
            var newTiers = new Map(tiers);
            newTiers.forEach(function (players, currentTier) {
                newTiers.set(currentTier, players.filter(function (p) { return p !== playerId; }));
            });
            return newTiers;
        });
    }
    function autoPopulateTiers() {
        var newTiers = new Map();
        ALL_TIERS.forEach(function (tier, idx) {
            newTiers.set(tier, __spreadArray([], allPlayers.slice(idx * 8, idx * 8 + 8).map(function (p) { return p.player_id; }), true));
        });
        setTiers(newTiers);
    }
    function getWhichTier(playerId) {
        var tier = ALL_TIERS.filter(function (tier) { return tiers.has(tier); }).find(function (tier) {
            return tiers.get(tier).includes(playerId);
        });
        if (!tier)
            return { tier: tier, idx: -1 };
        return { tier: tier, idx: tiers.get(tier).indexOf(playerId) };
    }
    function getRank(playerId) {
        var _a = getWhichTier(playerId), tier = _a.tier, idx = _a.idx;
        var numBefore = 0;
        for (var t in ALL_TIERS) {
            if (ALL_TIERS[t] === tier)
                break;
            numBefore += tiers.get(ALL_TIERS[t]).length;
        }
        return numBefore + idx + 1;
    }
    return (<div>
            <div className={Rankings_module_css_1.default.addRemoveButtons}>
                <material_1.Tooltip title="Save to URL">
                    <material_1.Button variant={'outlined'} onClick={saveTiers} disabled={!hasUnsavedChanges()}>
                        {hasUnsavedChanges() ? 'Save' : 'Saved!'}
                    </material_1.Button>
                </material_1.Tooltip>
                <material_1.Button variant={'outlined'} onClick={function () {
            if (tiers.size >= ALL_TIERS.length)
                return;
            setTiers(function (tiers) {
                var newTiers = new Map(tiers);
                newTiers.set(ALL_TIERS[tiers.size], []);
                return newTiers;
            });
        }} disabled={tiers.size >= ALL_TIERS.length}>
                    Add Tier
                </material_1.Button>
                <material_1.Button variant={'outlined'} onClick={function () {
            if (tiers.size === 0)
                return;
            setTiers(function (tiers) {
                var newTiers = new Map(tiers);
                newTiers.delete(ALL_TIERS[tiers.size - 1]);
                return newTiers;
            });
        }} disabled={tiers.size === 0}>
                    Remove Tier
                </material_1.Button>
                <material_1.FormControl>
                    <material_1.InputLabel>Week</material_1.InputLabel>
                    <material_1.Select value={week} label="Week" onChange={function (e) {
            setWeek(e.target.value);
        }}>
                        <material_1.MenuItem key={-1} value={-1}>
                            None
                        </material_1.MenuItem>
                        {Array.from({ length: 18 }, function (_, i) { return i + 1; }).map(function (i) { return (<material_1.MenuItem key={i} value={i}>
                                Week {i}
                            </material_1.MenuItem>); })}
                    </material_1.Select>
                </material_1.FormControl>
            </div>
            <div className={Rankings_module_css_1.default.playerInputRow}>
                <PlayersToTargetModule_1.InputComponent playerSuggestions={playersToAdd} setPlayerSuggestions={setPlayersToAdd} label="Player to Add" styles={{ width: '300px' }}/>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <material_1.Tooltip title="Remove from rankings">
                        <material_1.IconButton onClick={function () { return removePlayer(playersToAdd[0]); }} disabled={!allTieredPlayers.has(playersToAdd[0])}>
                            <icons_material_1.Delete />
                        </material_1.IconButton>
                    </material_1.Tooltip>
                    <material_1.Tooltip title="Move up within tier">
                        <material_1.IconButton onClick={function () {
            var _a = getWhichTier(playersToAdd[0]), tier = _a.tier, idx = _a.idx;
            if (!tier || idx <= 0)
                return;
            var newPlayers = __spreadArray([], tiers.get(tier), true);
            newPlayers.splice(idx, 1);
            newPlayers.splice(idx - 1, 0, playersToAdd[0]);
            setTiers(function (tiers) {
                var newTiers = new Map(tiers);
                newTiers.set(tier, newPlayers);
                return newTiers;
            });
        }} disabled={!allTieredPlayers.has(playersToAdd[0]) ||
            getWhichTier(playersToAdd[0]).idx <= 0}>
                            <icons_material_1.ArrowDropUp />
                        </material_1.IconButton>
                    </material_1.Tooltip>
                    <material_1.Tooltip title="Move down within tier">
                        <material_1.IconButton onClick={function () {
            var _a = getWhichTier(playersToAdd[0]), tier = _a.tier, idx = _a.idx;
            if (!tier ||
                idx < 0 ||
                idx >= tiers.get(tier).length - 1) {
                return;
            }
            var newPlayers = __spreadArray([], tiers.get(tier), true);
            newPlayers.splice(idx, 1);
            newPlayers.splice(idx + 1, 0, playersToAdd[0]);
            setTiers(function (tiers) {
                var newTiers = new Map(tiers);
                newTiers.set(tier, newPlayers);
                return newTiers;
            });
        }} disabled={(function () {
            var _a = getWhichTier(playersToAdd[0]), tier = _a.tier, idx = _a.idx;
            return (!tier ||
                idx < 0 ||
                idx >= tiers.get(tier).length - 1);
        })()}>
                            <icons_material_1.ArrowDropDown />
                        </material_1.IconButton>
                    </material_1.Tooltip>
                    <ExportButton_1.default className={"player-".concat(playersToAdd[0])} pngName={"player-".concat(playersToAdd[0], ".png")} downloadIcon={true} disabled={!allTieredPlayers.has(playersToAdd[0])}/>
                    <material_1.FormGroup>
                        <material_1.FormControlLabel control={<material_1.Switch checked={displayRanks} onChange={function (e) {
                return setDisplayRanks(e.target.checked);
            }}/>} label="Show Ranks"/>
                    </material_1.FormGroup>
                </div>
            </div>
            <div>
                <ExportButton_1.default className={ALL_TIERS.filter(function (tier) { return tiers.has(tier); }).map(function (tier) { return "".concat(tier, "-tier"); })} zipName={"all_tiers".concat(week > 0 ? "_week".concat(week) : '', ".zip")} label="Download as Zip"/>
                <ExportButton_1.default className="tierGraphics" pngName={"tier_list".concat(week > 0 ? "_week".concat(week) : '', ".png")} label="Download as Single PNG"/>
                <material_1.Button variant="outlined" onClick={autoPopulateTiers}>
                    Autopopulate Tiers by ADP
                </material_1.Button>
            </div>
            <div className={Rankings_module_css_1.default.addToTierButtons}>
                {ALL_TIERS.filter(function (tier) { return tiers.has(tier); }).map(function (tier) { return (<div className={Rankings_module_css_1.default.addToTierRow}>
                        <ExportButton_1.default className={"".concat(tier, "-tier")} pngName={"".concat(tier, "-tier.png")} downloadIcon={true}/>
                        <material_1.Button variant={'outlined'} key={tier} onClick={function () { return addToTier(tier, playersToAdd[0]); }} disabled={tiers
                .get(tier)
                .includes(playersToAdd[0])}>
                            {tier} Tier
                        </material_1.Button>
                        {tiers
                .get(tier)
                .map(function (playerId) { return playerData[playerId]; })
                .filter(function (player) { return !!player; })
                .map(function (player) { return (<span onClick={function () {
                    setPlayersToAdd([player.player_id]);
                }} className={Rankings_module_css_1.default.playerName}>
                                    {player.first_name + ' ' + player.last_name}
                                </span>); })}
                    </div>); })}
            </div>
            <div className={'tierGraphics'}>
                {ALL_TIERS.filter(function (tier) { return tiers.has(tier); }).map(function (tier) { return (<TierGraphic key={tier} tier={tier} players={tiers.get(tier)} week={week} handlePlayerClicked={function (playerId) {
                setPlayersToAdd([playerId]);
            }} getRank={displayRanks ? getRank : undefined}/>); })}
            </div>
        </div>);
}
function PlayerCard(_a) {
    var playerId = _a.playerId, opponent = _a.opponent, onClick = _a.onClick, getRank = _a.getRank;
    var playerData = (0, hooks_1.usePlayerData)();
    var _b = (0, react_1.useState)(), player = _b[0], setPlayer = _b[1];
    (0, react_1.useEffect)(function () {
        if (!playerData)
            return;
        setPlayer(playerData[playerId]);
    }, [playerId, playerData]);
    if (!player)
        return <></>;
    return (<div className={"".concat(Rankings_module_css_1.default.playerCard, " player-").concat(playerId)} onClick={onClick}>
            <img src={images_1.teamBackgrounds.get(player.team)} className={Rankings_module_css_1.default.background}/>
            <img src={"https://sleepercdn.com/content/nfl/players/".concat(player.player_id, ".jpg")} className={Rankings_module_css_1.default.headshot}/>
            {!!opponent && (<div className={Rankings_module_css_1.default.opponent}>
                    <div>VS</div>
                    <img src={images_1.teamLogos.get(opponent)} className={Rankings_module_css_1.default.opponentLogo}/>
                </div>)}
            {!!getRank && (<div className={Rankings_module_css_1.default.playerRankWrapper}>
                    <div className={Rankings_module_css_1.default.playerRank}>{getRank(playerId)}</div>
                </div>)}
            <div className={Rankings_module_css_1.default.playerCardNameWrapper}>
                <div className={Rankings_module_css_1.default.playerCardName}>
                    {"".concat(player.first_name[0], ". ").concat(player.last_name)}
                </div>
            </div>
        </div>);
}
function TierGraphic(_a) {
    var tier = _a.tier, players = _a.players, week = _a.week, handlePlayerClicked = _a.handlePlayerClicked, getRank = _a.getRank;
    var nflSchedule = (0, hooks_1.useNflSchedule)();
    var playerData = (0, hooks_1.usePlayerData)();
    if (!nflSchedule || !playerData)
        return <></>;
    function getOpponent(playerId) {
        if (!playerData)
            return;
        var player = playerData[playerId];
        if (!player)
            return;
        // No week specicifed. Skip.
        var teamSchedule = nflSchedule[player.team];
        if (week < 1)
            return;
        if (!teamSchedule) {
            console.warn("No team schedule for ".concat(player.first_name, " ").concat(player.last_name, " team ").concat(player.team));
            return;
        }
        var opp = teamSchedule["Week ".concat(week)];
        // Bye week. Skip.
        if (!opp)
            return;
        if (opp[0] === '@') {
            opp = opp.slice(1);
        }
        return opp;
    }
    return (<div className={"".concat(Rankings_module_css_1.default.tierGraphic, " ").concat(tier, "-tier")}>
            <img src={images_1.tierLogos.get(tier)} style={{ height: '300px' }}/>
            {players.map(function (playerId) {
            return (<PlayerCard key={playerId} playerId={playerId} opponent={getOpponent(playerId)} onClick={function () { return handlePlayerClicked(playerId); }} getRank={getRank}/>);
        })}
        </div>);
}
