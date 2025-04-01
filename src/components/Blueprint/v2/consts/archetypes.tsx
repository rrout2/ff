import {
    hardRebuildGraphRRC,
    hardRebuildGraphRRR,
    wellRoundedGraphCCR,
    wellRoundedGraphCCO,
    dualEliteGraphCCO,
    dualEliteGraphRCC,
    eliteValueGraphCCC,
    eliteValueGraphCCO,
    futureValueGraph,
    wrFactoryGraphCCO,
    wrFactorGraphCCR,
    oneYearReloadGraph,
    rbHeavyGraph,
    hardRebuildDVMRRC,
    hardRebuildDVMRRR,
    wellRoundedDVMCCR,
    wellRoundedDVMCCO,
    dualEliteDVMCCO,
    dualEliteDVMRCC,
    eliteValueDVMCCC,
    eliteValueDVMCCO,
    futureValueDVM,
    wrFactoryDVMCCO,
    wrFactoryDVMCCR,
    oneYearReloadDVM,
    rbHeavyDVM,
    eliteQbTeDVMCCO,
    eliteQbTeDVMRCC,
} from '../../../../consts/images';

import {Archetype as V1Archetype} from '../../v1/modules/BigBoy/BigBoy';

export enum Archetype {
    UNSPECIFIED = 'UNSPECIFIED',

    HardRebuild_RRC = 'HARD REBUILD - RRC',
    HardRebuild_RRR = 'HARD REBUILD - RRR',
    FutureValue = 'FUTURE VALUE',
    WellRounded_CCO = 'WELL ROUNDED - CCO',
    WellRounded_CCR = 'WELL ROUNDED - CCR',
    OneYearReload = 'ONE YEAR RELOAD',
    EliteValue_CCC = 'ELITE VALUE - CCC',
    EliteValue_CCO = 'ELITE VALUE - CCO',
    WRFactory_CCO = 'WR FACTORY - CCO',
    WRFactory_CCR = 'WR FACTORY - CCR',
    DualEliteQB_CCO = 'DUAL ELITE QB - CCO',
    DualEliteQB_RCC = 'DUAL ELITE QB - RCC',
    RBHeavy = 'RB HEAVY',
    EliteQBTE_RCC = 'ELITE QB/TE - RCC',
    EliteQBTE_CCO = 'ELITE QB/TE - CCO',
}

export const ALL_ARCHETYPES = Object.values(Archetype);

export function getV1ArchetypeFromArchetype(
    archetype: Archetype
): V1Archetype | '' {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
        case Archetype.HardRebuild_RRR:
            return V1Archetype.HardRebuild;
        case Archetype.WellRounded_CCR:
        case Archetype.WellRounded_CCO:
            return V1Archetype.WellRounded;
        case Archetype.DualEliteQB_CCO:
        case Archetype.DualEliteQB_RCC:
            return V1Archetype.DualEliteQB;
        case Archetype.EliteQBTE_CCO:
        case Archetype.EliteQBTE_RCC:
            return V1Archetype.EliteQBTE;
        case Archetype.EliteValue_CCC:
        case Archetype.EliteValue_CCO:
            return V1Archetype.EliteValue;
        case Archetype.FutureValue:
            return V1Archetype.FutureValue;
        case Archetype.WRFactory_CCO:
        case Archetype.WRFactory_CCR:
            return V1Archetype.WRFactory;
        case Archetype.OneYearReload:
            return V1Archetype.OneYearReload;
        case Archetype.RBHeavy:
            return V1Archetype.RBHeavy;
        default:
            return '';
    }
}

export function getGraphFromArchetype(archetype: Archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
            return hardRebuildGraphRRC;
        case Archetype.HardRebuild_RRR:
            return hardRebuildGraphRRR;
        case Archetype.WellRounded_CCR:
            return wellRoundedGraphCCR;
        case Archetype.WellRounded_CCO:
            return wellRoundedGraphCCO;
        case Archetype.DualEliteQB_CCO:
        case Archetype.EliteQBTE_CCO:
            return dualEliteGraphCCO;
        case Archetype.DualEliteQB_RCC:
        case Archetype.EliteQBTE_RCC:
            return dualEliteGraphRCC;
        case Archetype.EliteValue_CCC:
            return eliteValueGraphCCC;
        case Archetype.EliteValue_CCO:
            return eliteValueGraphCCO;
        case Archetype.FutureValue:
            return futureValueGraph;
        case Archetype.WRFactory_CCO:
            return wrFactoryGraphCCO;
        case Archetype.WRFactory_CCR:
            return wrFactorGraphCCR;
        case Archetype.OneYearReload:
            return oneYearReloadGraph;
        case Archetype.RBHeavy:
            return rbHeavyGraph;
        default:
            return Archetype.UNSPECIFIED;
    }
}

export function getDvmFromArchetype(archetype: Archetype) {
    switch (archetype) {
        case Archetype.HardRebuild_RRC:
            return hardRebuildDVMRRC;
        case Archetype.HardRebuild_RRR:
            return hardRebuildDVMRRR;
        case Archetype.WellRounded_CCR:
            return wellRoundedDVMCCR;
        case Archetype.WellRounded_CCO:
            return wellRoundedDVMCCO;
        case Archetype.DualEliteQB_CCO:
            return dualEliteDVMCCO;
        case Archetype.DualEliteQB_RCC:
            return dualEliteDVMRCC;
        case Archetype.EliteValue_CCC:
            return eliteValueDVMCCC;
        case Archetype.EliteValue_CCO:
            return eliteValueDVMCCO;
        case Archetype.FutureValue:
            return futureValueDVM;
        case Archetype.WRFactory_CCO:
            return wrFactoryDVMCCO;
        case Archetype.WRFactory_CCR:
            return wrFactoryDVMCCR;
        case Archetype.OneYearReload:
            return oneYearReloadDVM;
        case Archetype.RBHeavy:
            return rbHeavyDVM;
        case Archetype.EliteQBTE_CCO:
            return eliteQbTeDVMCCO;
        case Archetype.EliteQBTE_RCC:
            return eliteQbTeDVMRCC;
        default:
            return Archetype.UNSPECIFIED;
    }
}

export function getStartOfCode(archetype: Archetype) {
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
export function getLabelFromArchetype(archetype: Archetype) {
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
export function getColorFromArchetype(archetype: Archetype) {
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

export function getOutlookFromArchetype(archetype: Archetype) {
    const code = getStartOfCode(archetype).slice(3);
    const outlooks: ('REBUILD' | 'CONTEND' | 'RELOAD' | '')[] = [];
    for (let i = 0; i < code.length; i++) {
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
