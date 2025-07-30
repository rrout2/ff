"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAXI_SLOTS = exports.TE_BONUS = exports.PPR = exports.ALLOWED_POSITIONS = exports.WR_TE_FLEX = exports.WR_RB_FLEX = exports.SUPER_FLEX = exports.FLEX = exports.SUPER_FLEX_SET = exports.FLEX_SET = exports.FANTASY_POSITIONS = exports.KICKER = exports.DEFENSE = exports.BENCH = exports.TE = exports.WR = exports.RB = exports.QB = void 0;
exports.QB = 'QB';
exports.RB = 'RB';
exports.WR = 'WR';
exports.TE = 'TE';
exports.BENCH = 'BN';
exports.DEFENSE = 'DEF';
exports.KICKER = 'K';
exports.FANTASY_POSITIONS = [exports.QB, exports.RB, exports.WR, exports.TE];
exports.FLEX_SET = new Set([exports.RB, exports.WR, exports.TE]);
exports.SUPER_FLEX_SET = new Set(exports.FANTASY_POSITIONS);
exports.FLEX = 'FLEX';
exports.SUPER_FLEX = 'SUPER_FLEX';
exports.WR_RB_FLEX = 'WRRB_FLEX';
exports.WR_TE_FLEX = 'REC_FLEX';
exports.ALLOWED_POSITIONS = new Set([
    exports.QB,
    exports.RB,
    exports.WR,
    exports.TE,
    exports.FLEX,
    exports.SUPER_FLEX,
    exports.WR_RB_FLEX,
    exports.WR_TE_FLEX,
]);
exports.PPR = 'ppr';
exports.TE_BONUS = 'teBonus';
exports.TAXI_SLOTS = 'taxiSlots';
