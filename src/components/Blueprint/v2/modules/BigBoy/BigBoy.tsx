import React, {useEffect, useState} from 'react';
import styles from './BigBoy.module.css';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import {blankBlueprintV2} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    usePlayerData,
    useAdpData,
} from '../../../../../hooks/hooks';
import {
    GraphicComponent as CornerstonesGraphic,
    InputComponent as CornerstonesInput,
    useCornerstones,
} from '../CornerstonesModule/CornerstonesModule';
import {
    GraphicComponent as RosterGraphic,
    InputComponent as RosterInput,
} from '../RosterModule/RosterModule';
import {GraphicComponent as SettingsGraphic} from '../SettingsModule/SettingsModule';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import ExportButton from '../../../shared/ExportButton';
import {
    GraphicComponent as SuggestedMovesGraphic,
    InputComponent as SuggestedMovesInput,
    useBuySells,
} from '../SuggestedMovesModule/SuggestedMovesModule';
import {
    GraphicComponent as HoldsGraphic,
    InputComponent as HoldsInput,
    useHolds,
} from '../HoldsModule/HoldsModule';
import {
    GraphicComponent as RisersFallersGraphic,
    InputComponent as RisersFallersInput,
    useRisersFallers,
} from '../RisersFallersModule/RisersFallersModule';
import {Grid2} from '@mui/material';
import {
    GraphicComponent as PositionalGradesGraphic,
    InputComponent as PositionalGradesInput,
    usePositionalGrades,
} from '../PositionalGrades/PositionalGrades';
import {
    Outlook,
    useThreeYearOutlook,
    InputComponent as ThreeYearOutlookInput,
    GraphicComponent as ThreeYearOutlookGraphic,
} from '../ThreeYearOutlook/ThreeYearOutlook';
import {UnifiedInputs} from '../UnifiedModule/UnifiedModule';

interface BigBoyProps {
    roster?: Roster;
    numRosters?: number;
}

export default function BigBoy({roster, numRosters}: BigBoyProps) {
    const {cornerstones, setCornerstones} = useCornerstones(roster);
    const [leagueId] = useLeagueIdFromUrl();
    const {sells, setSells, buys, setBuys, plusMap, setPlusMap} =
        useBuySells(roster);
    const {holds, setHolds, comments, setComments} = useHolds(roster);
    const {
        risers,
        setRisers,
        riserValues,
        setRiserValues,
        fallers,
        setFallers,
        fallerValues,
        setFallerValues,
    } = useRisersFallers(roster);
    const {
        overall,
        setOverall,
        qb,
        setQb,
        rb,
        setRb,
        wr,
        setWr,
        te,
        setTe,
        depth,
        setDepth,
    } = usePositionalGrades();
    const {
        values: outlookValues,
        setValues: setOutlookValues,
        outlook,
        setOutlook,
    } = useThreeYearOutlook();

    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    return (
        <div>
            <UnifiedInputs
                roster={roster}
                cornerstones={cornerstones}
                setCornerstones={setCornerstones}
                sells={sells}
                setSells={setSells}
                buys={buys}
                setBuys={setBuys}
                plusMap={plusMap}
                setPlusMap={setPlusMap}
                holds={holds}
                setHolds={setHolds}
                comments={comments}
                setComments={setComments}
                risers={risers}
                setRisers={setRisers}
                riserValues={riserValues}
                setRiserValues={setRiserValues}
                fallers={fallers}
                setFallers={setFallers}
                fallerValues={fallerValues}
                setFallerValues={setFallerValues}
                rankStateMap={rankStateMap}
                overall={overall}
                setOverall={setOverall}
                qb={qb}
                setQb={setQb}
                rb={rb}
                setRb={setRb}
                wr={wr}
                setWr={setWr}
                te={te}
                setTe={setTe}
                depth={depth}
                setDepth={setDepth}
                outlookValues={outlookValues}
                setOutlookValues={setOutlookValues}
                outlook={outlook}
                setOutlook={setOutlook}
            />
            <FullBlueprint
                roster={roster}
                cornerstones={cornerstones}
                sells={sells}
                buys={buys}
                plusMap={plusMap}
                holds={holds}
                comments={comments}
                risers={risers}
                riserValues={riserValues}
                fallers={fallers}
                fallerValues={fallerValues}
                rankStateMap={rankStateMap}
                overall={overall}
                qb={qb}
                rb={rb}
                wr={wr}
                te={te}
                depth={depth}
                outlookValues={outlookValues}
                outlook={outlook}
                numRosters={numRosters}
            />
        </div>
    );
}

interface FullBlueprintProps {
    roster?: Roster;
    cornerstones: string[];
    sells: string[];
    buys: string[];
    plusMap: Map<string, boolean>;
    holds: string[];
    comments: string[];
    risers: string[];
    riserValues: number[];
    fallers: string[];
    fallerValues: number[];
    rankStateMap: Map<
        string,
        [string, React.Dispatch<React.SetStateAction<string>>]
    >;
    overall: number;
    qb: number;
    rb: number;
    wr: number;
    te: number;
    depth: number;
    outlookValues: number[];
    outlook: Outlook;
    numRosters?: number;
}

function FullBlueprint({roster, numRosters, rankStateMap}: FullBlueprintProps) {
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    useEffect(() => {
        if (!roster || !playerData) return;
        setAllPlayers(
            roster.players
                .map(playerId => playerData[playerId])
                .filter(p => !!p)
                .sort(sortByAdp)
        );
    }, [roster, playerData]);
    return (
        <div className={styles.fullBlueprint}>
            <div className={styles.rosterGraphic}>
                <RosterGraphic
                    allPlayers={allPlayers}
                    numRosters={numRosters ?? 0}
                    rankStateMap={rankStateMap}
                    transparent={true}
                />
            </div>
            <img src={blankBlueprintV2} />
        </div>
    );
}
