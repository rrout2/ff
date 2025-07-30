"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_ARCHETYPES = exports.Archetype = void 0;
exports.getV1ArchetypeFromArchetype = getV1ArchetypeFromArchetype;
exports.getArchetypeFromV1Archetype = getArchetypeFromV1Archetype;
exports.getGraphFromArchetype = getGraphFromArchetype;
exports.getDvmFromArchetype = getDvmFromArchetype;
exports.getStartOfCode = getStartOfCode;
exports.getLabelFromArchetype = getLabelFromArchetype;
exports.getColorFromArchetype = getColorFromArchetype;
exports.getOutlookFromArchetype = getOutlookFromArchetype;
var images_1 = require("../../../../consts/images");
var BigBoy_1 = require("../../v1/modules/BigBoy/BigBoy");
var Archetype;
(function (Archetype) {
    Archetype["UNSPECIFIED"] = "UNSPECIFIED";
    Archetype["HardRebuild_RRC"] = "HARD REBUILD - RRC";
    Archetype["HardRebuild_RRR"] = "HARD REBUILD - RRR";
    Archetype["FutureValue"] = "FUTURE VALUE";
    Archetype["WellRounded_CCO"] = "WELL ROUNDED - CCO";
    Archetype["WellRounded_CCR"] = "WELL ROUNDED - CCR";
    Archetype["OneYearReload"] = "ONE YEAR RELOAD";
    Archetype["EliteValue_CCC"] = "ELITE VALUE - CCC";
    Archetype["EliteValue_CCO"] = "ELITE VALUE - CCO";
    Archetype["WRFactory_CCO"] = "WR FACTORY - CCO";
    Archetype["WRFactory_CCR"] = "WR FACTORY - CCR";
    Archetype["DualEliteQB_CCO"] = "DUAL ELITE QB - CCO";
    Archetype["DualEliteQB_RCC"] = "DUAL ELITE QB - RCC";
    Archetype["RBHeavy"] = "RB HEAVY";
    Archetype["EliteQBTE_RCC"] = "ELITE QB/TE - RCC";
    Archetype["EliteQBTE_CCO"] = "ELITE QB/TE - CCO";
})(Archetype || (exports.Archetype = Archetype = {}));
exports.ALL_ARCHETYPES = Object.values(Archetype);
function getV1ArchetypeFromArchetype(archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
        case Archetype.HardRebuild_RRR:
            return BigBoy_1.Archetype.HardRebuild;
        case Archetype.WellRounded_CCR:
        case Archetype.WellRounded_CCO:
            return BigBoy_1.Archetype.WellRounded;
        case Archetype.DualEliteQB_CCO:
        case Archetype.DualEliteQB_RCC:
            return BigBoy_1.Archetype.DualEliteQB;
        case Archetype.EliteQBTE_CCO:
        case Archetype.EliteQBTE_RCC:
            return BigBoy_1.Archetype.EliteQBTE;
        case Archetype.EliteValue_CCC:
        case Archetype.EliteValue_CCO:
            return BigBoy_1.Archetype.EliteValue;
        case Archetype.FutureValue:
            return BigBoy_1.Archetype.FutureValue;
        case Archetype.WRFactory_CCO:
        case Archetype.WRFactory_CCR:
            return BigBoy_1.Archetype.WRFactory;
        case Archetype.OneYearReload:
            return BigBoy_1.Archetype.OneYearReload;
        case Archetype.RBHeavy:
            return BigBoy_1.Archetype.RBHeavy;
        default:
            return '';
    }
}
function getArchetypeFromV1Archetype(archetype) {
    switch (archetype) {
        case BigBoy_1.Archetype.HardRebuild:
            return Archetype.HardRebuild_RRC;
        case BigBoy_1.Archetype.WellRounded:
            return Archetype.WellRounded_CCR;
        case BigBoy_1.Archetype.DualEliteQB:
            return Archetype.DualEliteQB_CCO;
        case BigBoy_1.Archetype.EliteQBTE:
            return Archetype.EliteQBTE_CCO;
        case BigBoy_1.Archetype.EliteValue:
            return Archetype.EliteValue_CCC;
        case BigBoy_1.Archetype.FutureValue:
            return Archetype.FutureValue;
        case BigBoy_1.Archetype.WRFactory:
            return Archetype.WRFactory_CCR;
        case BigBoy_1.Archetype.OneYearReload:
            return Archetype.OneYearReload;
        case BigBoy_1.Archetype.RBHeavy:
            return Archetype.RBHeavy;
        default:
            return Archetype.UNSPECIFIED;
    }
}
function getGraphFromArchetype(archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
            return images_1.hardRebuildGraphRRC;
        case Archetype.HardRebuild_RRR:
            return images_1.hardRebuildGraphRRR;
        case Archetype.WellRounded_CCR:
            return images_1.wellRoundedGraphCCR;
        case Archetype.WellRounded_CCO:
            return images_1.wellRoundedGraphCCO;
        case Archetype.DualEliteQB_CCO:
        case Archetype.EliteQBTE_CCO:
            return images_1.dualEliteGraphCCO;
        case Archetype.DualEliteQB_RCC:
        case Archetype.EliteQBTE_RCC:
            return images_1.dualEliteGraphRCC;
        case Archetype.EliteValue_CCC:
            return images_1.eliteValueGraphCCC;
        case Archetype.EliteValue_CCO:
            return images_1.eliteValueGraphCCO;
        case Archetype.FutureValue:
            return images_1.futureValueGraph;
        case Archetype.WRFactory_CCO:
            return images_1.wrFactoryGraphCCO;
        case Archetype.WRFactory_CCR:
            return images_1.wrFactorGraphCCR;
        case Archetype.OneYearReload:
            return images_1.oneYearReloadGraph;
        case Archetype.RBHeavy:
            return images_1.rbHeavyGraph;
        default:
            return Archetype.UNSPECIFIED;
    }
}
function getDvmFromArchetype(archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
            return images_1.hardRebuildDVMRRC;
        case Archetype.HardRebuild_RRR:
            return images_1.hardRebuildDVMRRR;
        case Archetype.WellRounded_CCR:
            return images_1.wellRoundedDVMCCR;
        case Archetype.WellRounded_CCO:
            return images_1.wellRoundedDVMCCO;
        case Archetype.DualEliteQB_CCO:
            return images_1.dualEliteDVMCCO;
        case Archetype.DualEliteQB_RCC:
            return images_1.dualEliteDVMRCC;
        case Archetype.EliteValue_CCC:
            return images_1.eliteValueDVMCCC;
        case Archetype.EliteValue_CCO:
            return images_1.eliteValueDVMCCO;
        case Archetype.FutureValue:
            return images_1.futureValueDVM;
        case Archetype.WRFactory_CCO:
            return images_1.wrFactoryDVMCCO;
        case Archetype.WRFactory_CCR:
            return images_1.wrFactoryDVMCCR;
        case Archetype.OneYearReload:
            return images_1.oneYearReloadDVM;
        case Archetype.RBHeavy:
            return images_1.rbHeavyDVM;
        case Archetype.EliteQBTE_CCO:
            return images_1.eliteQbTeDVMCCO;
        case Archetype.EliteQBTE_RCC:
            return images_1.eliteQbTeDVMRCC;
        default:
            return Archetype.UNSPECIFIED;
    }
}
function getStartOfCode(archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
            return 'HR-RRC';
        case Archetype.HardRebuild_RRR:
            return 'HR-RRR';
        case Archetype.WellRounded_CCR:
            return 'WR-CCR';
        case Archetype.WellRounded_CCO:
            return 'WR-CCO';
        case Archetype.DualEliteQB_CCO:
            return 'DQ-CCO';
        case Archetype.DualEliteQB_RCC:
            return 'DQ-RCC';
        case Archetype.EliteValue_CCC:
            return 'EV-CCC';
        case Archetype.EliteValue_CCO:
            return 'EV-CCO';
        case Archetype.FutureValue:
            return 'FV-RCC';
        case Archetype.WRFactory_CCO:
            return 'WF-CCO';
        case Archetype.WRFactory_CCR:
            return 'WF-CCR';
        case Archetype.OneYearReload:
            return '1R-OCC';
        case Archetype.RBHeavy:
            return 'RH-CCR';
        case Archetype.EliteQBTE_CCO:
            return 'QT-CCO';
        case Archetype.EliteQBTE_RCC:
            return 'QT-RCC';
        default:
            return '??-???';
    }
}
function getLabelFromArchetype(archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
        case Archetype.HardRebuild_RRR:
            return 'Hard Rebuild';
        case Archetype.WellRounded_CCR:
        case Archetype.WellRounded_CCO:
            return 'Well Rounded';
        case Archetype.DualEliteQB_CCO:
        case Archetype.DualEliteQB_RCC:
            return 'Dual Elite QB';
        case Archetype.EliteValue_CCC:
        case Archetype.EliteValue_CCO:
            return 'Elite Value';
        case Archetype.FutureValue:
            return 'Future Value';
        case Archetype.WRFactory_CCO:
        case Archetype.WRFactory_CCR:
            return 'WR Factory';
        case Archetype.OneYearReload:
            return 'One Year Reload';
        case Archetype.RBHeavy:
            return 'RB Heavy';
        case Archetype.EliteQBTE_CCO:
        case Archetype.EliteQBTE_RCC:
            return 'Elite QB/TE';
        default:
            return 'Unspecified';
    }
}
function getColorFromArchetype(archetype) {
    switch (archetype) {
        case Archetype.WellRounded_CCR:
        case Archetype.WellRounded_CCO:
        case Archetype.WRFactory_CCR:
        case Archetype.RBHeavy:
            return '#FAB03F'; // orange
        case Archetype.FutureValue:
        case Archetype.DualEliteQB_RCC:
        case Archetype.OneYearReload:
        case Archetype.EliteQBTE_RCC:
            return '#31C4F3'; // blue
        case Archetype.HardRebuild_RRC:
        case Archetype.HardRebuild_RRR:
            return '#D25354'; // red
        case Archetype.WRFactory_CCO:
        case Archetype.EliteValue_CCC:
        case Archetype.EliteValue_CCO:
        case Archetype.DualEliteQB_CCO:
        case Archetype.EliteQBTE_CCO:
            return '#8DC53E'; // green
        default:
            return 'white';
    }
}
function getOutlookFromArchetype(archetype) {
    var code = getStartOfCode(archetype).slice(3);
    var outlooks = [];
    for (var i = 0; i < code.length; i++) {
        switch (code[i]) {
            case 'R':
                outlooks.push('REBUILD');
                break;
            case 'C':
                outlooks.push('CONTEND');
                break;
            case 'O':
                outlooks.push('RELOAD');
                break;
            default:
                outlooks.push('');
        }
    }
    return outlooks;
}
