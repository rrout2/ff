"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuySells = useBuySells;
exports.getPositionalOrder = getPositionalOrder;
exports.BuySellTile = BuySellTile;
var react_1 = require("react");
var BuySellHold_module_css_1 = require("./BuySellHold.module.css");
var images_1 = require("../../../../consts/images");
var RosterTier_1 = require("../RosterTier/RosterTier");
var fantasy_1 = require("../../../../consts/fantasy");
var hooks_1 = require("../../../../hooks/hooks");
var PlayerBar_1 = require("../PlayerBar/PlayerBar");
// Only QB buys allowed in 1QB leagues.
var ONE_QB_ALLOWSET = new Set([
    'Josh Allen',
    'Jayden Daniels',
    'Lamar Jackson',
    'Drake Maye',
    'Kyler Murray',
]);
// No TE buys if team has one of these players.
var TE_DISALLOWSET = new Set([
    'Brock Bowers',
    'George Kittle',
    'Trey McBride',
    'TJ Hockenson',
    'Sam LaPorta',
]);
var BuySellType;
(function (BuySellType) {
    BuySellType[BuySellType["SoftBuy"] = 0] = "SoftBuy";
    BuySellType[BuySellType["HardBuy"] = 1] = "HardBuy";
    BuySellType[BuySellType["SoftSell"] = 2] = "SoftSell";
    BuySellType[BuySellType["HardSell"] = 3] = "HardSell";
    BuySellType[BuySellType["Hold"] = 4] = "Hold";
})(BuySellType || (BuySellType = {}));
function useBuySells(isSuperFlex, leagueSize, roster) {
    var _a = (0, RosterTier_1.useRosterTierAndPosGrades)(isSuperFlex, leagueSize, roster), tier = _a.tier, qbGrade = _a.qbGrade, rbGrade = _a.rbGrade, wrGrade = _a.wrGrade, teGrade = _a.teGrade;
    var _b = (0, react_1.useState)([]), buys = _b[0], setBuys = _b[1];
    var _c = (0, react_1.useState)([]), sells = _c[0], setSells = _c[1];
    var _d = (0, react_1.useState)([]), holds = _d[0], setHolds = _d[1];
    var disallowedBuys = (0, hooks_1.useDisallowedBuysFromUrl)()[0];
    var _e = (0, hooks_1.useBuySellData)(), qbBuys = _e.qbBuys, rbBuys = _e.rbBuys, wrBuys = _e.wrBuys, teBuys = _e.teBuys, allSells = _e.sells, allHolds = _e.holds;
    var playerData = (0, hooks_1.usePlayerData)();
    (0, react_1.useEffect)(function () {
        if (!roster || tier === RosterTier_1.RosterTier.Unknown || !playerData)
            return;
        setBuys(calculateBuys());
        setSells(calculateSells());
        setHolds(calculateHolds());
    }, [
        qbBuys,
        rbBuys,
        wrBuys,
        teBuys,
        qbGrade,
        rbGrade,
        wrGrade,
        teGrade,
        allSells,
        allHolds,
        tier,
        playerData,
    ]);
    var getAdp = (0, hooks_1.useAdpData)().getAdp;
    var addedBelow100 = false;
    /**
     * Given a set of position scores and a roster tier, this function will calculate the number of targets to assign to each position.
     * The number of targets is based on the criteria below, and is assigned to the positions in order of highest need (lowest score).
     * - If the score is 8 or higher, assign 0 or 1 target.
     * - If the score is 6 or higher, assign 1 or 2 targets.
     * - If the score is below 6, assign 2 or 3 targets.
     * - Ensure that no more than 1 target is assigned to QB or TE.
     * - If there are remaining targets, assign them to WR.
     * @param scores an object with keys for each position and values of the scores for that position
     * @param tier the tier of the roster
     * @returns an object with the number of targets for each position
     */
    function calculateNumTradeTargets(scores, tier) {
        var tradeTargets = { QB: 0, RB: 0, WR: 0, TE: 0 };
        var remainingTargets = 4;
        // Helper function to assign targets to a position
        var assignTargets = function (position, max) {
            var maxAssignable = Math.min(max, remainingTargets);
            tradeTargets[position] = maxAssignable;
            remainingTargets -= maxAssignable;
        };
        // Sort positions by scores in ascending order of need (lower score = higher need)
        var sortedPositions = Object.entries(scores)
            .sort(function (a, b) { return a[1] - b[1]; })
            .map(function (_a) {
            var position = _a[0];
            return position;
        });
        // Assign targets based on the criteria
        for (var _i = 0, sortedPositions_1 = sortedPositions; _i < sortedPositions_1.length; _i++) {
            var position = sortedPositions_1[_i];
            var score = scores[position];
            if (remainingTargets === 0)
                break;
            if (position === fantasy_1.RB &&
                (tier === RosterTier_1.RosterTier.Rebuild || tier === RosterTier_1.RosterTier.Reload)) {
                assignTargets(position, 0);
                continue;
            }
            if (position === fantasy_1.TE) {
                var hasEliteTe = roster === null || roster === void 0 ? void 0 : roster.players.map(function (p) { return playerData[p]; }).filter(function (p) { return !!p; }).find(function (p) {
                    return TE_DISALLOWSET.has("".concat(p.first_name, " ").concat(p.last_name));
                });
                if (hasEliteTe) {
                    assignTargets(position, 0);
                    continue;
                }
            }
            if (score >= 8) {
                assignTargets(position, 1);
            }
            else if (score >= 6) {
                assignTargets(position, 2);
            }
            else {
                assignTargets(position, 3);
            }
            // Ensure no more than 1 QB or TE target
            if ((position === fantasy_1.QB || position === fantasy_1.TE) &&
                tradeTargets[position] > 1) {
                remainingTargets += tradeTargets[position] - 1;
                tradeTargets[position] = 1;
            }
        }
        if (remainingTargets > 0) {
            tradeTargets.WR += remainingTargets;
        }
        return tradeTargets;
    }
    function calculateBuys() {
        var buys = [];
        var _a = calculateNumTradeTargets({ QB: qbGrade, RB: rbGrade, WR: wrGrade, TE: teGrade }, tier), qbTargets = _a.QB, rbTargets = _a.RB, wrTargets = _a.WR, teTargets = _a.TE;
        var gradeOrder = getPositionalOrder({
            qbGrade: qbGrade,
            rbGrade: rbGrade,
            wrGrade: wrGrade,
            teGrade: teGrade,
        });
        for (var _i = 0, gradeOrder_1 = gradeOrder; _i < gradeOrder_1.length; _i++) {
            var pos = gradeOrder_1[_i];
            switch (pos) {
                case fantasy_1.QB:
                    buys.push.apply(buys, calcQbBuys(qbTargets));
                    break;
                case fantasy_1.RB:
                    buys.push.apply(buys, calcRbBuys(rbTargets));
                    break;
                case fantasy_1.WR:
                    buys.push.apply(buys, calcWrBuys(wrTargets));
                    break;
                case fantasy_1.TE:
                    buys.push.apply(buys, calcTeBuys(teTargets));
                    break;
                default:
                    throw new Error('Unknown position ' + pos);
            }
        }
        if (buys.length < 4) {
            buys.push.apply(buys, calcWrBuys(4 - buys.length, buys));
        }
        return buys;
    }
    function calcQbBuys(numToBuy) {
        if (
        // Only buy QBs if competitive in 1QB leagues
        tier !== RosterTier_1.RosterTier.Competitive &&
            tier !== RosterTier_1.RosterTier.Championship &&
            tier !== RosterTier_1.RosterTier.Elite &&
            !isSuperFlex) {
            return [];
        }
        var toBuy = [];
        for (var _i = 0, qbBuys_1 = qbBuys; _i < qbBuys_1.length; _i++) {
            var qbBuy = qbBuys_1[_i];
            if (toBuy.length >= numToBuy) {
                break;
            }
            if (roster === null || roster === void 0 ? void 0 : roster.players.includes(qbBuy.player_id)) {
                continue;
            }
            if (!isSuperFlex && !ONE_QB_ALLOWSET.has(qbBuy.name)) {
                continue;
            }
            if (disallowedBuys.includes(qbBuy.player_id)) {
                continue;
            }
            var adp = getAdp(qbBuy.name);
            if (adp > 140)
                continue;
            if (adp > 100 &&
                tier !== RosterTier_1.RosterTier.Rebuild &&
                tier !== RosterTier_1.RosterTier.Reload) {
                if (addedBelow100)
                    continue;
                addedBelow100 = true;
            }
            if (tier === RosterTier_1.RosterTier.Rebuild && adp < 48) {
                continue;
            }
            if (tier === RosterTier_1.RosterTier.Reload && adp < 36) {
                continue;
            }
            toBuy.push({
                playerId: qbBuy.player_id,
                type: qbBuy.verdict === 'Soft Buy'
                    ? BuySellType.SoftBuy
                    : BuySellType.HardBuy,
            });
        }
        return toBuy;
    }
    function calcRbBuys(numToBuy) {
        if (tier === RosterTier_1.RosterTier.Rebuild || tier === RosterTier_1.RosterTier.Reload) {
            return [];
        }
        var toBuy = [];
        for (var _i = 0, rbBuys_1 = rbBuys; _i < rbBuys_1.length; _i++) {
            var rbBuy = rbBuys_1[_i];
            if (toBuy.length >= numToBuy) {
                break;
            }
            if (roster === null || roster === void 0 ? void 0 : roster.players.includes(rbBuy.player_id)) {
                continue;
            }
            if (disallowedBuys.includes(rbBuy.player_id)) {
                continue;
            }
            var adp = getAdp(rbBuy.name);
            if (adp > 140)
                continue;
            if (adp > 100) {
                if (addedBelow100)
                    continue;
                addedBelow100 = true;
            }
            toBuy.push({
                playerId: rbBuy.player_id,
                type: rbBuy.verdict === 'Soft Buy'
                    ? BuySellType.SoftBuy
                    : BuySellType.HardBuy,
            });
        }
        return toBuy;
    }
    function calcWrBuys(numToBuy, existingWrBuys) {
        var secondPass = !!existingWrBuys;
        var toBuy = [];
        var _loop_1 = function (wrBuy) {
            if (toBuy.length >= numToBuy) {
                return "break";
            }
            if (roster === null || roster === void 0 ? void 0 : roster.players.includes(wrBuy.player_id)) {
                return "continue";
            }
            if (tier === RosterTier_1.RosterTier.Rebuild || tier === RosterTier_1.RosterTier.Reload) {
                if (wrBuy.age >= 26) {
                    return "continue";
                }
            }
            if (disallowedBuys.includes(wrBuy.player_id)) {
                return "continue";
            }
            var adp = getAdp(wrBuy.name);
            if (adp > 140)
                return "continue";
            if (adp > 100 &&
                tier !== RosterTier_1.RosterTier.Rebuild &&
                tier !== RosterTier_1.RosterTier.Reload) {
                if (addedBelow100)
                    return "continue";
                addedBelow100 = true;
            }
            if (tier === RosterTier_1.RosterTier.Rebuild && adp < 48 && !secondPass) {
                return "continue";
            }
            if (tier === RosterTier_1.RosterTier.Reload && adp < 36 && !secondPass) {
                return "continue";
            }
            if (secondPass &&
                !!existingWrBuys.find(function (b) { return b.playerId === wrBuy.player_id; })) {
                return "continue";
            }
            toBuy.push({
                playerId: wrBuy.player_id,
                type: wrBuy.verdict === 'Soft Buy'
                    ? BuySellType.SoftBuy
                    : BuySellType.HardBuy,
            });
        };
        for (var _i = 0, wrBuys_1 = wrBuys; _i < wrBuys_1.length; _i++) {
            var wrBuy = wrBuys_1[_i];
            var state_1 = _loop_1(wrBuy);
            if (state_1 === "break")
                break;
        }
        return toBuy;
    }
    function calcTeBuys(numToBuy) {
        var toBuy = [];
        for (var _i = 0, teBuys_1 = teBuys; _i < teBuys_1.length; _i++) {
            var teBuy = teBuys_1[_i];
            if (toBuy.length >= numToBuy) {
                break;
            }
            if (roster === null || roster === void 0 ? void 0 : roster.players.includes(teBuy.player_id)) {
                continue;
            }
            if (tier === RosterTier_1.RosterTier.Rebuild || tier === RosterTier_1.RosterTier.Reload) {
                if (teBuy.age >= 26) {
                    continue;
                }
            }
            if (disallowedBuys.includes(teBuy.player_id)) {
                continue;
            }
            var adp = getAdp(teBuy.name);
            if (adp > 140)
                continue;
            if (adp > 100 &&
                tier !== RosterTier_1.RosterTier.Rebuild &&
                tier !== RosterTier_1.RosterTier.Reload) {
                if (addedBelow100)
                    continue;
                addedBelow100 = true;
            }
            if (tier === RosterTier_1.RosterTier.Rebuild && adp < 48) {
                continue;
            }
            if (tier === RosterTier_1.RosterTier.Reload && adp < 36) {
                continue;
            }
            toBuy.push({
                playerId: teBuy.player_id,
                type: teBuy.verdict === 'Soft Buy'
                    ? BuySellType.SoftBuy
                    : BuySellType.HardBuy,
            });
        }
        return toBuy;
    }
    function calculateSells() {
        if (!roster)
            return [];
        return allSells
            .filter(function (sell) { return roster.players.includes(sell.player_id); })
            .filter(function (s) {
            if (isSuperFlex || s.position !== fantasy_1.QB)
                return true;
            // No QB sells lower than QB12 in 1QB formats
            return s.pos_adp <= 12;
        })
            .slice(0, 2)
            .map(function (sell) { return ({
            playerId: sell.player_id,
            type: sell.verdict === 'Soft Sell'
                ? BuySellType.SoftSell
                : BuySellType.HardSell,
            reason: sell.explanation,
        }); });
    }
    function calculateHolds() {
        if (!roster)
            return [];
        return allHolds
            .filter(function (hold) {
            return roster.players.includes(hold.player_id) &&
                getAdp(hold.name) < 140;
        })
            .slice(0, 2)
            .map(function (hold) { return ({
            playerId: hold.player_id,
            type: BuySellType.Hold,
            reason: hold.explanation,
        }); });
    }
    return { buys: buys, sells: sells, holds: holds };
}
/**
 * Sorts the positions (QB, RB, WR, TE) in order of worst grade to best.
 * @param grades grades for each position
 * @returns an array of positions, sorted by grade
 */
function getPositionalOrder(grades) {
    return Object.entries(grades)
        .sort(function (a, b) { return a[1] - b[1]; })
        .map(function (_a) {
        var pos = _a[0];
        switch (pos) {
            case 'qbGrade':
                return fantasy_1.QB;
            case 'rbGrade':
                return fantasy_1.RB;
            case 'wrGrade':
                return fantasy_1.WR;
            case 'teGrade':
                return fantasy_1.TE;
            default:
                throw new Error('Unknown position ' + pos);
        }
    });
}
function mapToImgSrc(type) {
    switch (type) {
        case BuySellType.SoftBuy:
            return images_1.softBuy;
        case BuySellType.HardBuy:
            return images_1.hardBuy;
        case BuySellType.SoftSell:
            return images_1.softSell;
        case BuySellType.HardSell:
            return images_1.hardSell;
        case BuySellType.Hold:
            throw new Error('Hold should not be mapped to an image');
    }
}
function BuySellTile(_a) {
    var playerId = _a.playerId, type = _a.type;
    if (!playerId)
        return <></>;
    return (<div className={BuySellHold_module_css_1.default.buySellTile}>
            {type !== BuySellType.Hold && (<img src={mapToImgSrc(type)} className={BuySellHold_module_css_1.default.buySellImage}/>)}
            <PlayerBar_1.default playerId={playerId}/>
        </div>);
}
