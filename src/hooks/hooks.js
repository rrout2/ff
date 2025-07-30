"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.useArchetype = useArchetype;
exports.usePositionalRanks = usePositionalRanks;
exports.usePositionalGrades = usePositionalGrades;
exports.useRookieRankings = useRookieRankings;
exports.usePickMoves = usePickMoves;
exports.useNflSchedule = useNflSchedule;
exports.useBuySellData = useBuySellData;
exports.usePlayerData = usePlayerData;
exports.usePlayerValues = usePlayerValues;
exports.useAdpData = useAdpData;
exports.usePlayer = usePlayer;
exports.useLeague = useLeague;
exports.useFetchUsers = useFetchUsers;
exports.useFetchUser = useFetchUser;
exports.useFetchLeague = useFetchLeague;
exports.useFetchRosters = useFetchRosters;
exports.useRoster = useRoster;
exports.useLeagueIdFromUrl = useLeagueIdFromUrl;
exports.useDisallowedBuysFromUrl = useDisallowedBuysFromUrl;
exports.useParamFromUrl = useParamFromUrl;
exports.useTeamIdFromUrl = useTeamIdFromUrl;
exports.useUserIdFromUrl = useUserIdFromUrl;
exports.useModuleFromUrl = useModuleFromUrl;
exports.useRosterSettings = useRosterSettings;
exports.useRosterSettingsFromId = useRosterSettingsFromId;
exports.useProjectedLineup = useProjectedLineup;
exports.useTitle = useTitle;
exports.useAllPlayers = useAllPlayers;
exports.useNonSleeper = useNonSleeper;
var react_1 = require("react");
var players_json_1 = require("../data/players.json");
var rankings_04292025_json_1 = require("../data/rankings_04292025.json");
var buyssellsholds_with_ids_050525_json_1 = require("../data/buyssellsholds_with_ids_050525.json");
var nfl_schedule_json_1 = require("../data/nfl_schedule.json");
var sf_pick_moves_json_1 = require("../data/rookieBP/sf_pick_moves.json");
var _1qb_pick_moves_json_1 = require("../data/rookieBP/1qb_pick_moves.json");
var sf_rookie_rankings_and_tiers_apr26_json_1 = require("../data/rookieBP/sf_rookie_rankings_and_tiers_apr26.json");
var _1qb_rookie_rankings_and_tiers_apr26_json_1 = require("../data/rookieBP/1qb_rookie_rankings_and_tiers_apr26.json");
var sleeper_api_1 = require("../sleeper-api/sleeper-api");
var react_query_1 = require("@tanstack/react-query");
var urlParams_1 = require("../consts/urlParams");
var react_router_dom_1 = require("react-router-dom");
var fantasy_1 = require("../consts/fantasy");
var BlueprintGenerator_1 = require("../components/Blueprint/v1/BlueprintGenerator");
var images_1 = require("../consts/images");
var PositionalGrades_1 = require("../components/Blueprint/v1/modules/PositionalGrades/PositionalGrades");
var DepthScore_1 = require("../components/Blueprint/v1/modules/DepthScore/DepthScore");
var BigBoy_1 = require("../components/Blueprint/v1/modules/BigBoy/BigBoy");
function useArchetype(qbScore, rbScore, wrScore, teScore, isSuperFlex) {
    var _a = (0, react_1.useState)(BigBoy_1.Archetype.HardRebuild), archetype = _a[0], setArchetype = _a[1];
    var calculateSuperflexArchetype = (0, react_1.useCallback)(function () {
        var totalScore = qbScore + rbScore + wrScore + teScore;
        if (qbScore >= 8 && rbScore >= 8 && wrScore >= 8 && teScore >= 8) {
            setArchetype(BigBoy_1.Archetype.EliteValue);
            return;
        }
        if (totalScore >= 26 &&
            qbScore >= 6 &&
            rbScore >= 6 &&
            wrScore >= 6 &&
            teScore >= 6) {
            setArchetype(BigBoy_1.Archetype.WellRounded);
            return;
        }
        if (totalScore >= 20 && qbScore >= 8) {
            setArchetype(BigBoy_1.Archetype.DualEliteQB);
            return;
        }
        if (totalScore >= 20 && wrScore >= 8) {
            setArchetype(BigBoy_1.Archetype.WRFactory);
            return;
        }
        if (totalScore >= 20 && rbScore >= 9) {
            setArchetype(BigBoy_1.Archetype.RBHeavy);
            return;
        }
        if (totalScore >= 15 &&
            qbScore >= 4 &&
            rbScore < 9 &&
            wrScore < 8 &&
            wrScore >= 3 &&
            teScore >= 3) {
            setArchetype(BigBoy_1.Archetype.OneYearReload);
            return;
        }
        if (totalScore >= 15) {
            setArchetype(BigBoy_1.Archetype.FutureValue);
            return;
        }
        setArchetype(BigBoy_1.Archetype.HardRebuild);
    }, [qbScore, rbScore, wrScore, teScore, setArchetype]);
    var calculateOneQbArchetype = (0, react_1.useCallback)(function () {
        var totalScore = qbScore + rbScore + wrScore + teScore;
        if (qbScore >= 8 && rbScore >= 8 && wrScore >= 8 && teScore >= 8) {
            setArchetype(BigBoy_1.Archetype.EliteValue);
            return;
        }
        if (totalScore >= 26 &&
            qbScore >= 6 &&
            rbScore >= 6 &&
            wrScore >= 6 &&
            teScore >= 6) {
            setArchetype(BigBoy_1.Archetype.WellRounded);
            return;
        }
        if (totalScore >= 20 && wrScore >= 8) {
            setArchetype(BigBoy_1.Archetype.WRFactory);
            return;
        }
        if (totalScore >= 20 && qbScore >= 8 && teScore >= 8) {
            setArchetype(BigBoy_1.Archetype.EliteQBTE);
            return;
        }
        if (totalScore >= 20 && rbScore >= 9) {
            setArchetype(BigBoy_1.Archetype.RBHeavy);
            return;
        }
        if (totalScore >= 15 &&
            qbScore >= 4 &&
            rbScore < 9 &&
            wrScore < 8 &&
            wrScore >= 3 &&
            teScore >= 3) {
            setArchetype(BigBoy_1.Archetype.OneYearReload);
            return;
        }
        if (totalScore >= 15) {
            setArchetype(BigBoy_1.Archetype.FutureValue);
            return;
        }
        setArchetype(BigBoy_1.Archetype.HardRebuild);
    }, [qbScore, rbScore, wrScore, teScore, setArchetype]);
    (0, react_1.useEffect)(function () {
        if (isSuperFlex) {
            calculateSuperflexArchetype();
        }
        else {
            calculateOneQbArchetype();
        }
    }, [isSuperFlex, calculateSuperflexArchetype, calculateOneQbArchetype]);
    return {
        archetype: archetype,
        setArchetype: setArchetype,
    };
}
/**
 * Calculates and returns the ranks of positional grades for a given roster
 * within a league. It computes grades for each position (QB, RB, WR, TE)
 * across all rosters and determines the rank of the specified roster's
 * grades among them.
 *
 * @param rosters - The list of all rosters in the league.
 * @param roster - The specific roster to calculate ranks for.
 * @returns An object containing the ranks for QB, RB, WR, and TE
 * positions.
 */
function usePositionalRanks(rosters, roster) {
    var _a, _b;
    var playerData = usePlayerData();
    var getPlayerValue = usePlayerValues().getPlayerValue;
    var leagueId = useLeagueIdFromUrl()[0];
    var league = useLeague(leagueId);
    var rosterSettings = useRosterSettings(league);
    var leagueSize = (_a = rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _a !== void 0 ? _a : 0;
    var _c = (0, react_1.useState)([]), allQbGrades = _c[0], setAllQbGrades = _c[1];
    var _d = (0, react_1.useState)(-1), qbRank = _d[0], setQbRank = _d[1];
    var _e = (0, react_1.useState)([]), allRbGrades = _e[0], setAllRbGrades = _e[1];
    var _f = (0, react_1.useState)(-1), rbRank = _f[0], setRbRank = _f[1];
    var _g = (0, react_1.useState)([]), allWrGrades = _g[0], setAllWrGrades = _g[1];
    var _h = (0, react_1.useState)(-1), wrRank = _h[0], setWrRank = _h[1];
    var _j = (0, react_1.useState)([]), allTeGrades = _j[0], setAllTeGrades = _j[1];
    var _k = (0, react_1.useState)(-1), teRank = _k[0], setTeRank = _k[1];
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX) || ((_b = rosterSettings.get(fantasy_1.QB)) !== null && _b !== void 0 ? _b : 0) > 1;
    var _l = usePositionalGrades(roster, leagueSize), qbGrade = _l.qb, rbGrade = _l.rb, wrGrade = _l.wr, teGrade = _l.te;
    (0, react_1.useEffect)(function () {
        if (!playerData || !(rosters === null || rosters === void 0 ? void 0 : rosters.length))
            return;
        // Needed to force re-render to center grade values.
        var newQbList = [];
        var newRbList = [];
        var newWrList = [];
        var newTeList = [];
        rosters.forEach(function (r) {
            newQbList.push((0, PositionalGrades_1.gradeByPosition)(fantasy_1.QB, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, r));
            newRbList.push((0, PositionalGrades_1.gradeByPosition)(fantasy_1.RB, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, r));
            newWrList.push((0, PositionalGrades_1.gradeByPosition)(fantasy_1.WR, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, r));
            newTeList.push((0, PositionalGrades_1.gradeByPosition)(fantasy_1.TE, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, r));
        });
        setAllQbGrades(newQbList);
        setAllRbGrades(newRbList);
        setAllWrGrades(newWrList);
        setAllTeGrades(newTeList);
    }, [playerData, rosters, isSuperFlex]);
    (0, react_1.useEffect)(function () {
        if (allQbGrades.length === 0 || qbGrade === -1)
            return;
        var qbGradesCopy = __spreadArray([], allQbGrades, true);
        qbGradesCopy.sort(function (a, b) { return b - a; });
        var newQbRank = qbGradesCopy.indexOf(qbGrade);
        setQbRank(newQbRank);
    }, [allQbGrades, qbGrade]);
    (0, react_1.useEffect)(function () {
        if (allRbGrades.length === 0 || rbGrade === -1)
            return;
        var rbGradesCopy = __spreadArray([], allRbGrades, true);
        rbGradesCopy.sort(function (a, b) { return b - a; });
        var newRbRank = rbGradesCopy.indexOf(rbGrade);
        setRbRank(newRbRank);
    }, [allRbGrades, rbGrade]);
    (0, react_1.useEffect)(function () {
        if (allWrGrades.length === 0 || wrGrade === -1)
            return;
        var wrGradesCopy = __spreadArray([], allWrGrades, true);
        wrGradesCopy.sort(function (a, b) { return b - a; });
        var newWrRank = wrGradesCopy.indexOf(wrGrade);
        setWrRank(newWrRank);
    }, [allWrGrades, wrGrade]);
    (0, react_1.useEffect)(function () {
        if (allTeGrades.length === 0 || teGrade === -1)
            return;
        var teGradesCopy = __spreadArray([], allTeGrades, true);
        teGradesCopy.sort(function (a, b) { return b - a; });
        var newTeRank = teGradesCopy.indexOf(teGrade);
        setTeRank(newTeRank);
    }, [allTeGrades, teGrade]);
    return { qbRank: qbRank, rbRank: rbRank, wrRank: wrRank, teRank: teRank };
}
function usePositionalGrades(roster, leagueSize) {
    var _a;
    var playerData = usePlayerData();
    var getPlayerValue = usePlayerValues().getPlayerValue;
    var leagueId = useLeagueIdFromUrl()[0];
    var league = useLeague(leagueId);
    var rosterSettings = useRosterSettings(league);
    var bench = useProjectedLineup(rosterSettings, roster === null || roster === void 0 ? void 0 : roster.players).bench;
    var _b = (0, react_1.useState)(-1), overall = _b[0], setOverall = _b[1];
    var _c = (0, react_1.useState)(-1), qb = _c[0], setQb = _c[1];
    var _d = (0, react_1.useState)(-1), rb = _d[0], setRb = _d[1];
    var _e = (0, react_1.useState)(-1), wr = _e[0], setWr = _e[1];
    var _f = (0, react_1.useState)(-1), te = _f[0], setTe = _f[1];
    var _g = (0, react_1.useState)(-1), depth = _g[0], setDepth = _g[1];
    var isSuperFlex = rosterSettings.has(fantasy_1.SUPER_FLEX) || ((_a = rosterSettings.get(fantasy_1.QB)) !== null && _a !== void 0 ? _a : 0) > 1;
    (0, react_1.useEffect)(function () {
        if (!playerData || !roster || bench.length === 0)
            return;
        // Needed to force re-render to center grade values.
        var newQb = (0, PositionalGrades_1.gradeByPosition)(fantasy_1.QB, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, roster);
        var newRb = (0, PositionalGrades_1.gradeByPosition)(fantasy_1.RB, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, roster);
        var newWr = (0, PositionalGrades_1.gradeByPosition)(fantasy_1.WR, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, roster);
        var newTe = (0, PositionalGrades_1.gradeByPosition)(fantasy_1.TE, getPlayerValue, isSuperFlex, leagueSize !== null && leagueSize !== void 0 ? leagueSize : 0, playerData, roster);
        var newDepth = (0, DepthScore_1.calculateDepthScore)(bench, getPlayerValue);
        setQb(newQb);
        setRb(newRb);
        setWr(newWr);
        setTe(newTe);
        setDepth(newDepth);
        setOverall(Math.min(10, Math.round((newQb + newRb + newWr + newTe + newDepth) / 5) + 1));
    }, [playerData, roster, bench]);
    return {
        overall: overall,
        setOverall: setOverall,
        qb: qb,
        setQb: setQb,
        rb: rb,
        setRb: setRb,
        wr: wr,
        setWr: setWr,
        te: te,
        setTe: setTe,
        depth: depth,
        setDepth: setDepth,
    };
}
function useRookieRankings(isSuperFlex) {
    var sfRookieRankings = (0, react_1.useState)(sf_rookie_rankings_and_tiers_apr26_json_1.default)[0];
    var oneQbRookieRankings = (0, react_1.useState)(_1qb_rookie_rankings_and_tiers_apr26_json_1.default)[0];
    var rookieRankings = isSuperFlex ? sfRookieRankings : oneQbRookieRankings;
    function verifyRankings() {
        rookieRankings.forEach(function (r) {
            if (!images_1.rookieMap.has(r.Name)) {
                console.warn('missing rookie card', r.Name);
            }
        });
    }
    function getRookieRank(name) {
        var rookieRank = rookieRankings.find(function (r) {
            return r.Name.replace(/\W/g, '').toLowerCase() ===
                name.replace(/\W/g, '').toLowerCase();
        });
        if (!rookieRank) {
            return Infinity;
        }
        return rookieRank.Pick;
    }
    function sortByRookieRank(a, b) {
        return getRookieRank(a) - getRookieRank(b);
    }
    (0, react_1.useEffect)(function () {
        verifyRankings();
    }, [rookieRankings]);
    function getRookieTier(pick) {
        if (pick < 1 || pick > rookieRankings.length) {
            console.warn('invalid pick', pick);
            return ['', '', ''];
        }
        var tier = rookieRankings[pick - 1].Tier;
        return rookieRankings.filter(function (r) { return r.Tier === tier; }).map(function (r) { return r.Name; });
    }
    return { rookieRankings: rookieRankings, getRookieTier: getRookieTier, getRookieRank: getRookieRank, sortByRookieRank: sortByRookieRank };
}
function usePickMoves(isSuperFlex) {
    var sfPickMoves = (0, react_1.useState)(sf_pick_moves_json_1.default)[0];
    var oneQbPickMoves = (0, react_1.useState)(_1qb_pick_moves_json_1.default)[0];
    function getMove(pick, tier) {
        var pickMoves = isSuperFlex ? sfPickMoves : oneQbPickMoves;
        if (pick < 1 || pick > pickMoves.length) {
            console.warn('invalid pick', pick);
            return '';
        }
        var pickMove = pickMoves[pick - 1];
        switch (tier.toLowerCase()) {
            case 'elite':
                return pickMove.Elite;
            case 'championship':
                return pickMove.Championship;
            case 'contender':
            case 'competitive':
                return pickMove.Contender;
            case 'reload':
                return pickMove.Reload;
            case 'rebuild':
                return pickMove.Rebuild;
            default:
                console.warn('unknown tier', tier);
                return '';
        }
    }
    return { pickMoves: isSuperFlex ? sfPickMoves : oneQbPickMoves, getMove: getMove };
}
function useNflSchedule() {
    var nflSchedule = (0, react_1.useState)(nfl_schedule_json_1.default)[0];
    return nflSchedule;
}
function useBuySellData() {
    var buySells = (0, react_1.useState)(buyssellsholds_with_ids_050525_json_1.default)[0];
    var _a = (0, react_1.useState)([]), qbBuys = _a[0], setQbBuys = _a[1];
    var _b = (0, react_1.useState)([]), rbBuys = _b[0], setRbBuys = _b[1];
    var _c = (0, react_1.useState)([]), wrBuys = _c[0], setWrBuys = _c[1];
    var _d = (0, react_1.useState)([]), teBuys = _d[0], setTeBuys = _d[1];
    var _e = (0, react_1.useState)([]), sells = _e[0], setSells = _e[1];
    var _f = (0, react_1.useState)([]), holds = _f[0], setHolds = _f[1];
    var sortNamesByAdp = useAdpData().sortNamesByAdp;
    (0, react_1.useEffect)(function () {
        var qbBuys = buySells.filter(function (b) {
            return b.position === fantasy_1.QB &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy');
        });
        var rbBuys = buySells.filter(function (b) {
            return b.position === fantasy_1.RB &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy');
        });
        var wrBuys = buySells.filter(function (b) {
            return b.position === fantasy_1.WR &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy');
        });
        var teBuys = buySells.filter(function (b) {
            return b.position === fantasy_1.TE &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy');
        });
        var sells = buySells
            .filter(function (b) { return b.verdict === 'Soft Sell' || b.verdict === 'Hard Sell'; })
            .sort(function (a, b) { return sortNamesByAdp(a.name, b.name); });
        var holds = buySells
            .filter(function (b) {
            return b.verdict === 'Hold' ||
                b.verdict === 'Hard Buy' ||
                b.verdict === 'Soft Buy';
        })
            .sort(function (a, b) { return b.difference - a.difference; });
        shuffle(qbBuys);
        shuffle(rbBuys);
        shuffle(wrBuys);
        shuffle(teBuys);
        setQbBuys(qbBuys);
        setRbBuys(rbBuys);
        setWrBuys(wrBuys);
        setTeBuys(teBuys);
        setSells(sells);
        setHolds(holds);
    }, [buySells]);
    function shuffle(array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
        }
    }
    function getVerdict(playerName) {
        var playerNickname = checkForNickname(playerName);
        var verdict = buySells.find(function (b) {
            return b.name.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase() ||
                b.alt_name.replace(/\W/g, '').toLowerCase() ===
                    playerNickname.replace(/\W/g, '').toLowerCase() ||
                b.name.replace(/\W/g, '').toLowerCase() ===
                    playerNickname.replace(/\W/g, '').toLowerCase() ||
                b.alt_name.replace(/\W/g, '').toLowerCase() ===
                    playerName.replace(/\W/g, '').toLowerCase();
        });
        if (!verdict) {
            console.warn("cannot find verdict with name = '".concat(playerName, "' or alt_name = '").concat(playerNickname, "'"));
            return undefined;
        }
        return verdict;
    }
    return {
        buySells: buySells,
        qbBuys: qbBuys,
        rbBuys: rbBuys,
        wrBuys: wrBuys,
        teBuys: teBuys,
        sells: sells,
        holds: holds,
        getVerdict: getVerdict,
    };
}
function usePlayerData() {
    var _a = (0, react_1.useState)(), playerData = _a[0], setPlayerData = _a[1];
    var preprocess = function (pd) {
        for (var playerId in pd) {
            var player = pd[playerId];
            if (!fantasy_1.SUPER_FLEX_SET.has(player.position) ||
                player.last_name === 'Invalid' ||
                player.first_name === 'Duplicate') {
                delete pd[playerId];
            }
        }
        return pd;
    };
    (0, react_1.useEffect)(function () {
        setPlayerData(preprocess(players_json_1.default));
    }, []);
    return playerData;
}
// This is a set of players that get a bump in one QB leagues
var oneQbBump = new Set(['Josh Allen', 'Jayden Daniels', 'Jalen Hurts', 'Lamar Jackson'].map(function (n) {
    return n.toLowerCase();
}));
// Uses adp data to calculate player values
function usePlayerValues() {
    var _a = useAdpData(), adpData = _a.adpData, getAdp = _a.getAdp, getPositionalAdp = _a.getPositionalAdp;
    var getPlayerValue = function (playerName) {
        var rank = getAdp(playerName);
        var datum = adpData[rank - 1];
        if (!datum) {
            console.warn("cannot find player with name = '".concat(playerName, "' in adpData"));
            return {
                Player: playerName,
                Value: 0,
                Position: '',
                oneQbBonus: 0,
                sfBonus: 0,
            };
        }
        var positionalRank = getPositionalAdp(playerName);
        return {
            Player: datum.player_name,
            Position: datum.Position,
            Value: 1.0808218554 * Math.pow(0.97230651306, rank) * 100,
            oneQbBonus: oneQbBump.has(playerName) ? 1 : 0,
            sfBonus: 0,
            teValue: datum.Position === fantasy_1.TE
                ? Math.max(10 - positionalRank + 1, 1)
                : undefined,
        };
    };
    var getBump = function (playerName, superFlex) {
        var playerValue = getPlayerValue(playerName);
        if (playerValue) {
            if (superFlex) {
                return playerValue.sfBonus;
            }
            else {
                return playerValue.oneQbBonus;
            }
        }
        console.warn("cannot find PlayerValue for player with name = '".concat(playerName, "'"));
        return 0;
    };
    return { getPlayerValue: getPlayerValue, getBump: getBump };
}
function useAdpData() {
    var _a = (0, react_1.useState)([]), adpData = _a[0], setAdpData = _a[1];
    (0, react_1.useEffect)(function () {
        setAdpData(rankings_04292025_json_1.default.map(function (p) {
            return {
                player_name: p.Name,
                Position: p.Position,
            };
        }));
    }, [rankings_04292025_json_1.default]);
    var getAdp = function (playerName) {
        var playerNickname = checkForNickname(playerName);
        var adp = adpData.findIndex(function (a) {
            return a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase();
        });
        if (adp >= 0) {
            return adp + 1;
        }
        adp = adpData.findIndex(function (a) {
            return a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerNickname.replace(/\W/g, '').toLowerCase();
        });
        if (adp >= 0) {
            return adp + 1;
        }
        return Infinity;
    };
    var getPositionalAdp = function (playerName) {
        var playerNickname = checkForNickname(playerName);
        var idx = getAdp(playerName) - 1;
        if (idx >= adpData.length)
            return Infinity;
        var adp = adpData
            .filter(function (player) { return player.Position === adpData[idx].Position; })
            .findIndex(function (a) {
            return a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase();
        });
        if (adp >= 0) {
            return adp + 1;
        }
        adp = adpData
            .filter(function (player) { return player.Position === adpData[idx].Position; })
            .findIndex(function (a) {
            return a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerNickname.replace(/\W/g, '').toLowerCase();
        });
        if (adp >= 0) {
            return adp + 1;
        }
        return Infinity;
    };
    var sortByAdp = function (a, b) {
        return sortNamesByAdp("".concat(a.first_name, " ").concat(a.last_name), "".concat(b.first_name, " ").concat(b.last_name));
    };
    var sortNamesByAdp = function (a, b) {
        return getAdp(a) - getAdp(b);
    };
    return { adpData: adpData, getAdp: getAdp, sortByAdp: sortByAdp, getPositionalAdp: getPositionalAdp, sortNamesByAdp: sortNamesByAdp };
}
var checkForNickname = function (playerName) {
    switch (playerName) {
        case 'Tank Dell':
            return 'Nathaniel Dell';
        case 'Nathaniel Dell':
            return 'Tank Dell';
        case 'Chig Okonkwo':
            return 'Chigoziem Okonkwo';
        case 'Chigoziem Okonkwo':
            return 'Chig Okonkwo';
        case 'Hollywood Brown':
            return 'Marquise Brown';
        case 'Marquise Brown':
            return 'Hollywood Brown';
        case 'Tyrone Tracy':
            return 'Tyrone Tracy Jr';
        case 'Tyrone Tracy Jr':
            return 'Tyrone Tracy';
        case 'Kenneth Walker':
            return 'Kenneth Walker III';
        case 'Kenneth Walker III':
            return 'Kenneth Walker';
        case 'Michael Penix':
            return 'Michael Penix Jr.';
        case 'Michael Penix Jr.':
            return 'Michael Penix';
        case 'Marvin Harrison':
            return 'Marvin Harrison Jr.';
        case 'Marvin Harrison Jr.':
            return 'Marvin Harrison';
        case 'Brian Thomas':
            return 'Brian Thomas Jr.';
        case 'Brian Thomas Jr.':
            return 'Brian Thomas';
        default:
            return playerName;
    }
};
function usePlayer(playerId) {
    var playerData = usePlayerData();
    var _a = (0, react_1.useState)(), player = _a[0], setPlayer = _a[1];
    (0, react_1.useEffect)(function () {
        if (!playerData)
            return;
        setPlayer(playerData[playerId]);
    }, [playerId, playerData]);
    return player;
}
function useLeague(leagueId) {
    var _a = (0, react_1.useState)(), league = _a[0], setLeague = _a[1];
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    (0, react_1.useEffect)(function () {
        if (!leagueId) {
            setLeague({
                settings: {
                    taxi_slots: +searchParams.get(fantasy_1.TAXI_SLOTS),
                },
                scoring_settings: {
                    rec: +searchParams.get(fantasy_1.PPR),
                    bonus_rec_te: +searchParams.get(fantasy_1.TE_BONUS),
                },
            });
            return;
        }
        (0, sleeper_api_1.getLeague)(leagueId).then(function (l) { return setLeague(l); });
    }, [leagueId]);
    return league;
}
function useFetchUsers(rosters) {
    var _this = this;
    return (0, react_query_1.useQuery)({
        queryKey: [rosters],
        enabled: !!rosters && rosters.length > 0,
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var users, _a, _b, _c, _i, rosterId, roster, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!rosters || rosters.length === 0) {
                            throw new Error('rosters is undefined or empty');
                        }
                        users = [];
                        _a = rosters;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        rosterId = _c;
                        roster = rosters[rosterId];
                        if (!roster.owner_id)
                            return [3 /*break*/, 3];
                        _e = (_d = users).push;
                        return [4 /*yield*/, (0, sleeper_api_1.getUser)(roster.owner_id)];
                    case 2:
                        _e.apply(_d, [_f.sent()]);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, users];
                }
            });
        }); },
        staleTime: 10000,
    });
}
function useFetchUser(teamId, rosters, disabled) {
    var _this = this;
    return (0, react_query_1.useQuery)({
        queryKey: [rosters, teamId],
        enabled: !!rosters && rosters.length > 0 && !!teamId && !disabled,
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!rosters || rosters.length === 0) {
                            throw new Error('rosters is undefined or empty');
                        }
                        userId = rosters[+teamId].owner_id;
                        if (!userId)
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, sleeper_api_1.getUser)(userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        staleTime: 10000,
    });
}
function useFetchLeague(leagueId) {
    var _this = this;
    return (0, react_query_1.useQuery)({
        queryKey: [leagueId],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!leagueId) {
                            throw new Error('leagueId is empty');
                        }
                        return [4 /*yield*/, (0, sleeper_api_1.getLeague)(leagueId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        staleTime: 10000,
    });
}
function useFetchRosters(leagueIdNewName) {
    var _this = this;
    return (0, react_query_1.useQuery)({
        queryKey: [leagueIdNewName],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!leagueIdNewName)
                            throw new Error('leagueId is empty');
                        return [4 /*yield*/, (0, sleeper_api_1.getRosters)(leagueIdNewName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        staleTime: 10000,
    });
}
function useRoster(rosters, teamId, leagueId) {
    function hasTeamId() {
        return teamId !== '' && teamId !== urlParams_1.NONE_TEAM_ID;
    }
    var _a = (0, react_1.useState)([]), allUsers = _a[0], setAllUsers = _a[1];
    var _b = (0, react_1.useState)(), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(), roster = _c[0], setRoster = _c[1];
    (0, react_1.useEffect)(function () {
        if (!leagueId || !rosters)
            return;
        var ownerIds = new Set(rosters.map(function (r) { return r.owner_id; }));
        (0, sleeper_api_1.getAllUsers)(leagueId).then(function (users) {
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            return setAllUsers(users.filter(function (u) { return ownerIds.has(u.user_id); }));
        });
    }, [leagueId, rosters]);
    (0, react_1.useEffect)(function () {
        if (!rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !teamId ||
            allUsers.length === 0) {
            return;
        }
        function getRosterFromTeamIdx(idx) {
            if (allUsers.length === 0 || !rosters)
                return;
            var ownerId = allUsers[idx].user_id;
            return rosters.find(function (r) { return r.owner_id === ownerId; });
        }
        if (+teamId >= allUsers.length)
            return;
        var newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster)
            throw new Error('roster not found');
        setRoster(newRoster);
    }, [rosters, teamId, allUsers]);
    (0, react_1.useEffect)(function () {
        if (!allUsers.length ||
            !hasTeamId() ||
            !teamId ||
            +teamId >= allUsers.length) {
            return;
        }
        setUser(allUsers === null || allUsers === void 0 ? void 0 : allUsers[+teamId]);
    }, [allUsers, teamId]);
    return { roster: roster, user: user, setRoster: setRoster };
}
function useLeagueIdFromUrl() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(''), leagueId = _b[0], setLeagueId = _b[1];
    (0, react_1.useEffect)(function () {
        var leagueIdFromUrl = searchParams.get(urlParams_1.LEAGUE_ID);
        if (!leagueIdFromUrl)
            return;
        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);
    (0, react_1.useEffect)(function () {
        if (leagueId === searchParams.get(urlParams_1.LEAGUE_ID) || !leagueId)
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.LEAGUE_ID, leagueId);
            return searchParams;
        });
    }, [leagueId]);
    return [leagueId, setLeagueId];
}
function useDisallowedBuysFromUrl() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)([]), disallowedBuys = _b[0], setDisallowedBuys = _b[1];
    (0, react_1.useEffect)(function () {
        var disallowedBuysFromUrl = searchParams.get(urlParams_1.DISALLOWED_BUYS);
        if (!disallowedBuysFromUrl)
            return;
        setDisallowedBuys(disallowedBuysFromUrl.split(','));
    }, [searchParams]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (disallowedBuys === ((_a = searchParams.get(urlParams_1.DISALLOWED_BUYS)) === null || _a === void 0 ? void 0 : _a.split(',')) ||
            !disallowedBuys) {
            return;
        }
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.DISALLOWED_BUYS, disallowedBuys.join(','));
            return searchParams;
        });
    }, [disallowedBuys]);
    return [disallowedBuys, setDisallowedBuys];
}
function useParamFromUrl(param, defaultValue) {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(''), value = _b[0], setValue = _b[1];
    (0, react_1.useEffect)(function () {
        var valueFromUrl = searchParams.get(param);
        if (!valueFromUrl) {
            setValue(defaultValue !== null && defaultValue !== void 0 ? defaultValue : '');
            return;
        }
        setValue(valueFromUrl);
    }, [searchParams, setValue]);
    (0, react_1.useEffect)(function () {
        if (value === searchParams.get(param) || value === '')
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(param, value);
            return searchParams;
        });
    }, [value, setSearchParams]);
    return [value, setValue];
}
function useTeamIdFromUrl() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(''), teamId = _b[0], setTeamId = _b[1];
    (0, react_1.useEffect)(function () {
        var teamIdFromUrl = searchParams.get(urlParams_1.TEAM_ID);
        if (teamIdFromUrl === teamId)
            return;
        if (!teamIdFromUrl) {
            setTeamId(urlParams_1.NONE_TEAM_ID);
            return;
        }
        setTeamId(teamIdFromUrl);
    }, [searchParams, setTeamId]);
    (0, react_1.useEffect)(function () {
        if (teamId === searchParams.get(urlParams_1.TEAM_ID) || teamId === '')
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.TEAM_ID, teamId);
            return searchParams;
        });
    }, [teamId, setSearchParams]);
    return [teamId, setTeamId];
}
function useUserIdFromUrl() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(''), userId = _b[0], setUserId = _b[1];
    (0, react_1.useEffect)(function () {
        var userIdFromUrl = searchParams.get(urlParams_1.USER_ID);
        if (userIdFromUrl === userId)
            return;
        if (!userIdFromUrl) {
            return;
        }
        setUserId(userIdFromUrl);
    }, [searchParams, setUserId]);
    (0, react_1.useEffect)(function () {
        if (userId === searchParams.get(urlParams_1.USER_ID) || userId === '')
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.USER_ID, userId);
            return searchParams;
        });
    }, [userId, setSearchParams]);
    return [userId, setUserId];
}
function useModuleFromUrl() {
    var _a = (0, react_router_dom_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var _b = (0, react_1.useState)(BlueprintGenerator_1.Module.Unspecified), module = _b[0], setModule = _b[1];
    (0, react_1.useEffect)(function () {
        var module = searchParams.get(urlParams_1.MODULE);
        if (!module) {
            setModule(BlueprintGenerator_1.Module.Unspecified);
            return;
        }
        setModule(module);
    }, [searchParams, setModule]);
    (0, react_1.useEffect)(function () {
        if (module === searchParams.get(urlParams_1.MODULE) || !module)
            return;
        setSearchParams(function (searchParams) {
            searchParams.set(urlParams_1.MODULE, module);
            return searchParams;
        });
    }, [module, setSearchParams]);
    return [module, setModule];
}
function useRosterSettings(league) {
    var _a = (0, react_1.useState)(new Map()), rosterSettings = _a[0], setRosterSettings = _a[1];
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    (0, react_1.useEffect)(function () {
        var settings = new Map();
        if (!league) {
            settings.set(fantasy_1.QB, +searchParams.get(fantasy_1.QB));
            settings.set(fantasy_1.RB, +searchParams.get(fantasy_1.RB));
            settings.set(fantasy_1.WR, +searchParams.get(fantasy_1.WR));
            settings.set(fantasy_1.TE, +searchParams.get(fantasy_1.TE));
            settings.set(fantasy_1.FLEX, +searchParams.get(fantasy_1.FLEX));
            settings.set(fantasy_1.SUPER_FLEX, +searchParams.get(fantasy_1.SUPER_FLEX));
            settings.set(fantasy_1.BENCH, +searchParams.get(fantasy_1.BENCH));
        }
        else if (league === null || league === void 0 ? void 0 : league.roster_positions) {
            league === null || league === void 0 ? void 0 : league.roster_positions.forEach(function (pos) {
                if (!settings.has(pos)) {
                    settings.set(pos, 0);
                }
                settings.set(pos, settings.get(pos) + 1);
            });
        }
        setRosterSettings(settings);
    }, [league, league === null || league === void 0 ? void 0 : league.roster_positions, searchParams]);
    return rosterSettings;
}
function useRosterSettingsFromId(leagueId) {
    var league = useLeague(leagueId === undefined ? '' : leagueId);
    var _a = (0, react_1.useState)(new Map()), rosterSettings = _a[0], setRosterSettings = _a[1];
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    (0, react_1.useEffect)(function () {
        var settings = new Map();
        if (!leagueId) {
            settings.set(fantasy_1.QB, +searchParams.get(fantasy_1.QB));
            settings.set(fantasy_1.RB, +searchParams.get(fantasy_1.RB));
            settings.set(fantasy_1.WR, +searchParams.get(fantasy_1.WR));
            settings.set(fantasy_1.TE, +searchParams.get(fantasy_1.TE));
            settings.set(fantasy_1.FLEX, +searchParams.get(fantasy_1.FLEX));
            settings.set(fantasy_1.SUPER_FLEX, +searchParams.get(fantasy_1.SUPER_FLEX));
            settings.set(fantasy_1.BENCH, +searchParams.get(fantasy_1.BENCH));
        }
        else if (league === null || league === void 0 ? void 0 : league.roster_positions) {
            league === null || league === void 0 ? void 0 : league.roster_positions.forEach(function (pos) {
                if (!settings.has(pos)) {
                    settings.set(pos, 0);
                }
                settings.set(pos, settings.get(pos) + 1);
            });
        }
        setRosterSettings(settings);
    }, [leagueId, league, league === null || league === void 0 ? void 0 : league.roster_positions, searchParams]);
    return rosterSettings;
}
function useProjectedLineup(rosterSettings, playerIds) {
    var playerData = usePlayerData();
    var _a = (0, react_1.useState)([]), startingLineup = _a[0], setStartingLineup = _a[1];
    var _b = (0, react_1.useState)([]), bench = _b[0], setBench = _b[1];
    var _c = (0, react_1.useState)(''), benchString = _c[0], setBenchString = _c[1];
    var _d = useAdpData(), getAdp = _d.getAdp, sortByAdp = _d.sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!playerData || !playerIds)
            return;
        var remainingPlayers = new Set(playerIds);
        var starters = [];
        Array.from(rosterSettings)
            .filter(function (_a) {
            var position = _a[0];
            return fantasy_1.ALLOWED_POSITIONS.has(position);
        })
            .forEach(function (_a) {
            var position = _a[0], count = _a[1];
            var bestAtPosition = getBestNAtPosition(position, count, remainingPlayers, getAdp, sortByAdp, playerData, playerIds);
            for (var i = 0; i < count; i++) {
                if (i >= bestAtPosition.length) {
                    starters.push({
                        player: {
                            player_id: '',
                            first_name: '',
                            last_name: '',
                        },
                        position: position,
                    });
                    continue;
                }
                var p = bestAtPosition[i];
                remainingPlayers.delete(p.player_id);
                starters.push({
                    player: p,
                    position: position,
                });
            }
        });
        setStartingLineup(starters);
    }, [!!playerData, playerIds, rosterSettings]);
    (0, react_1.useEffect)(function () {
        if (!playerData || !playerIds)
            return;
        var remainingPlayers = new Set(playerIds);
        startingLineup.forEach(function (p) {
            remainingPlayers.delete(p.player.player_id);
        });
        var benchPlayerList = Array.from(remainingPlayers)
            .map(function (p) { return playerData[p]; })
            .filter(function (p) { return !!p; });
        setBench(benchPlayerList);
        setBenchString(benchPlayerList
            .sort(function (a, b) {
            return a.position.localeCompare(b.position) ||
                a.last_name.localeCompare(b.last_name);
        })
            .reduce(function (acc, player, idx) {
            var isLast = idx === remainingPlayers.size - 1;
            var trailingText = isLast ? '' : ', ';
            return "".concat(acc).concat(player.first_name[0], ". ").concat(player.last_name, " (").concat(player.position, ")").concat(trailingText);
        }, '')
            .toLocaleUpperCase());
    }, [startingLineup]);
    return { startingLineup: startingLineup, setStartingLineup: setStartingLineup, bench: bench, benchString: benchString };
}
function useTitle(title) {
    (0, react_1.useEffect)(function () {
        var oldTitle = document.title;
        document.title = title;
        return function () {
            document.title = oldTitle;
        };
    }, [title]);
}
function useAllPlayers() {
    var playerData = usePlayerData();
    var _a = (0, react_1.useState)([]), allPlayers = _a[0], setAllPlayers = _a[1];
    var _b = (0, react_1.useState)([]), allPlayersSorted = _b[0], setAllPlayersSorted = _b[1];
    var sortByAdp = useAdpData().sortByAdp;
    (0, react_1.useEffect)(function () {
        if (!playerData)
            return;
        var players = [];
        for (var playerId in playerData) {
            players.push(playerId);
        }
        setAllPlayers(players);
    }, [playerData]);
    (0, react_1.useEffect)(function () {
        if (!playerData || !allPlayers)
            return;
        setAllPlayersSorted(allPlayers
            .map(function (p) { return playerData[p]; })
            .sort(sortByAdp)
            .map(function (p) { return p.player_id; }));
    }, [allPlayers, playerData]);
    return allPlayersSorted;
}
function useNonSleeper(rosters, specifiedUser, setRoster) {
    var _a, _b, _c;
    var leagueId = useLeagueIdFromUrl()[0];
    var _d = (0, react_router_dom_1.useSearchParams)(), searchParams = _d[0], setSearchParams = _d[1];
    var _e = (0, react_1.useState)((searchParams.get(urlParams_1.NON_SLEEPER_IDS) || '').split('-')), nonSleeperIds = _e[0], setNonSleeperIds = _e[1];
    var _f = (0, react_1.useState)(new Map([
        [fantasy_1.QB, +(searchParams.get(fantasy_1.QB) || 1)],
        [fantasy_1.RB, +(searchParams.get(fantasy_1.RB) || 2)],
        [fantasy_1.WR, +(searchParams.get(fantasy_1.WR) || 3)],
        [fantasy_1.TE, +(searchParams.get(fantasy_1.TE) || 1)],
        [fantasy_1.FLEX, +(searchParams.get(fantasy_1.FLEX) || 2)],
        [fantasy_1.SUPER_FLEX, +(searchParams.get(fantasy_1.SUPER_FLEX) || 1)],
        [fantasy_1.BENCH, +(searchParams.get(fantasy_1.BENCH) || 6)],
    ])), nonSleeperRosterSettings = _f[0], setNonSleeperRosterSettings = _f[1];
    var _g = (0, react_1.useState)(+(searchParams.get(fantasy_1.PPR) || 1)), ppr = _g[0], setPpr = _g[1];
    var _h = (0, react_1.useState)(+(searchParams.get(fantasy_1.TE_BONUS) || 1)), teBonus = _h[0], setTeBonus = _h[1];
    var _j = (0, react_1.useState)(+((_b = (_a = searchParams.get(urlParams_1.LEAGUE_SIZE)) !== null && _a !== void 0 ? _a : rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _b !== void 0 ? _b : 12)), numRosters = _j[0], setNumRosters = _j[1];
    var _k = (0, react_1.useState)(+(searchParams.get(fantasy_1.TAXI_SLOTS) || 0)), taxiSlots = _k[0], setTaxiSlots = _k[1];
    var _l = (0, react_1.useState)(searchParams.get(urlParams_1.TEAM_NAME) ||
        ((_c = specifiedUser === null || specifiedUser === void 0 ? void 0 : specifiedUser.metadata) === null || _c === void 0 ? void 0 : _c.team_name) ||
        (specifiedUser === null || specifiedUser === void 0 ? void 0 : specifiedUser.display_name) ||
        ''), teamName = _l[0], setTeamName = _l[1];
    (0, react_1.useEffect)(function () {
        var _a;
        if (!leagueId)
            return;
        setTeamName(((_a = specifiedUser === null || specifiedUser === void 0 ? void 0 : specifiedUser.metadata) === null || _a === void 0 ? void 0 : _a.team_name) ||
            (specifiedUser === null || specifiedUser === void 0 ? void 0 : specifiedUser.display_name) ||
            '');
    }, [specifiedUser, leagueId]);
    (0, react_1.useEffect)(function () {
        if (leagueId) {
            setSearchParams(function (searchParams) {
                searchParams.delete(urlParams_1.TEAM_NAME);
                return searchParams;
            });
        }
        else {
            setSearchParams(function (searchParams) {
                searchParams.set(urlParams_1.TEAM_NAME, teamName);
                return searchParams;
            });
        }
    }, [teamName, leagueId]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        setNumRosters(+((_b = (_a = searchParams.get(urlParams_1.LEAGUE_SIZE)) !== null && _a !== void 0 ? _a : rosters === null || rosters === void 0 ? void 0 : rosters.length) !== null && _b !== void 0 ? _b : 12));
    }, [rosters]);
    (0, react_1.useEffect)(function () {
        if (leagueId) {
            setSearchParams(function (searchParams) {
                searchParams.delete(urlParams_1.LEAGUE_SIZE);
                return searchParams;
            });
        }
        else {
            setSearchParams(function (searchParams) {
                searchParams.set(urlParams_1.LEAGUE_SIZE, '' + numRosters);
                return searchParams;
            });
        }
    }, [numRosters, leagueId]);
    (0, react_1.useEffect)(function () {
        if (leagueId) {
            setSearchParams(function (searchParams) {
                searchParams.delete(fantasy_1.PPR);
                searchParams.delete(fantasy_1.TE_BONUS);
                searchParams.delete(fantasy_1.TAXI_SLOTS);
                return searchParams;
            });
        }
        else {
            setSearchParams(function (searchParams) {
                searchParams.set(fantasy_1.PPR, '' + ppr);
                searchParams.set(fantasy_1.TE_BONUS, '' + teBonus);
                searchParams.set(fantasy_1.TAXI_SLOTS, '' + taxiSlots);
                return searchParams;
            });
        }
    }, [ppr, teBonus, taxiSlots, leagueId]);
    (0, react_1.useEffect)(function () {
        if (leagueId) {
            setSearchParams(function (searchParams) {
                searchParams.delete(fantasy_1.QB);
                searchParams.delete(fantasy_1.RB);
                searchParams.delete(fantasy_1.WR);
                searchParams.delete(fantasy_1.TE);
                searchParams.delete(fantasy_1.FLEX);
                searchParams.delete(fantasy_1.SUPER_FLEX);
                searchParams.delete(fantasy_1.BENCH);
                return searchParams;
            });
        }
        else {
            setSearchParams(function (searchParams) {
                searchParams.set(fantasy_1.QB, '' + nonSleeperRosterSettings.get(fantasy_1.QB));
                searchParams.set(fantasy_1.RB, '' + nonSleeperRosterSettings.get(fantasy_1.RB));
                searchParams.set(fantasy_1.WR, '' + nonSleeperRosterSettings.get(fantasy_1.WR));
                searchParams.set(fantasy_1.TE, '' + nonSleeperRosterSettings.get(fantasy_1.TE));
                searchParams.set(fantasy_1.FLEX, '' + nonSleeperRosterSettings.get(fantasy_1.FLEX));
                searchParams.set(fantasy_1.SUPER_FLEX, '' + nonSleeperRosterSettings.get(fantasy_1.SUPER_FLEX));
                searchParams.set(fantasy_1.BENCH, '' + nonSleeperRosterSettings.get(fantasy_1.BENCH));
                return searchParams;
            });
        }
    }, [nonSleeperRosterSettings, leagueId]);
    (0, react_1.useEffect)(function () {
        if (!setRoster)
            return;
        setRoster({
            players: nonSleeperIds,
        });
    }, [nonSleeperIds, setRoster]);
    (0, react_1.useEffect)(function () {
        if (leagueId) {
            setSearchParams(function (searchParams) {
                searchParams.delete(urlParams_1.NON_SLEEPER_IDS);
                return searchParams;
            });
        }
        else {
            setSearchParams(function (searchParams) {
                searchParams.set(urlParams_1.NON_SLEEPER_IDS, nonSleeperIds.filter(function (id) { return !!id; }).join('-'));
                return searchParams;
            });
        }
    }, [nonSleeperIds, leagueId]);
    return {
        nonSleeperIds: nonSleeperIds,
        setNonSleeperIds: setNonSleeperIds,
        nonSleeperRosterSettings: nonSleeperRosterSettings,
        setNonSleeperRosterSettings: setNonSleeperRosterSettings,
        ppr: ppr,
        setPpr: setPpr,
        teBonus: teBonus,
        setTeBonus: setTeBonus,
        numRosters: numRosters,
        setNumRosters: setNumRosters,
        taxiSlots: taxiSlots,
        setTaxiSlots: setTaxiSlots,
        teamName: teamName,
        setTeamName: setTeamName,
        setSearchParams: setSearchParams,
    };
}
function getBestNAtPosition(position, count, remainingPlayers, getAdp, sortByAdp, playerData, playerIds) {
    switch (position) {
        case fantasy_1.FLEX:
            return playerIds
                .filter(function (p) { return remainingPlayers.has(p); })
                .map(function (p) { return playerData[p]; })
                .filter(function (p) {
                return !!p &&
                    (p.fantasy_positions.includes(fantasy_1.WR) ||
                        p.fantasy_positions.includes(fantasy_1.RB) ||
                        p.fantasy_positions.includes(fantasy_1.TE));
            })
                .sort(sortByAdp)
                .slice(0, count);
        case fantasy_1.WR_RB_FLEX:
            return playerIds
                .filter(function (p) { return remainingPlayers.has(p); })
                .map(function (p) { return playerData[p]; })
                .filter(function (p) {
                return !!p &&
                    (p.fantasy_positions.includes(fantasy_1.WR) ||
                        p.fantasy_positions.includes(fantasy_1.RB));
            })
                .sort(sortByAdp)
                .slice(0, count);
        case fantasy_1.WR_TE_FLEX:
            return playerIds
                .filter(function (p) { return remainingPlayers.has(p); })
                .map(function (p) { return playerData[p]; })
                .filter(function (p) {
                return !!p &&
                    (p.fantasy_positions.includes(fantasy_1.WR) ||
                        p.fantasy_positions.includes(fantasy_1.TE));
            })
                .sort(sortByAdp)
                .slice(0, count);
        case fantasy_1.SUPER_FLEX:
            return playerIds
                .filter(function (p) { return remainingPlayers.has(p); })
                .map(function (p) { return playerData[p]; })
                .filter(function (p) {
                return !!p &&
                    (p.fantasy_positions.includes(fantasy_1.WR) ||
                        p.fantasy_positions.includes(fantasy_1.RB) ||
                        p.fantasy_positions.includes(fantasy_1.TE) ||
                        p.fantasy_positions.includes(fantasy_1.QB));
            })
                .sort(sortByAdp)
                .sort(function (a, b) {
                // maybe adjust this
                var startingQbThreshold = 160;
                // manually prioritizing starting level QBs for super flex
                if (a.position === fantasy_1.QB && b.position !== fantasy_1.QB) {
                    if (getAdp("".concat(a.first_name, " ").concat(a.last_name)) <
                        startingQbThreshold) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
                if (a.position !== fantasy_1.QB && b.position === fantasy_1.QB) {
                    if (getAdp("".concat(b.first_name, " ").concat(b.last_name)) <
                        startingQbThreshold) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
                return sortByAdp(a, b);
            })
                .slice(0, count);
        default: // non-flex positions
            return playerIds
                .filter(function (p) { return remainingPlayers.has(p); })
                .map(function (p) { return playerData[p]; })
                .filter(function (p) { return !!p && p.fantasy_positions.includes(position); })
                .sort(sortByAdp)
                .slice(0, count);
    }
}
