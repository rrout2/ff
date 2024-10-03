import {useEffect, useState} from 'react';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './UnifiedModule.module.css';
import {
    useAdpData,
    useLeagueIdFromUrl,
    usePlayerData,
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
import {Grid2, MenuItem, Select, SelectChangeEvent} from '@mui/material';
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
export type UnifiedModuleProps = {
    roster?: Roster;
    numRosters?: number;
    teamName?: string;
};

export default function UnifiedModule({
    roster,
    numRosters,
    teamName,
}: UnifiedModuleProps): JSX.Element {
    const {cornerstones, setCornerstones} = useCornerstones(roster);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
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
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    useEffect(() => {
        if (!roster || !playerData) return;
        setAllPlayers(
            roster.players
                .map(playerId => playerData[playerId])
                .filter(p => !!p)
                .sort(sortByAdp)
        );
    }, [roster, playerData]);

    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    return (
        <div>
            <ExportButton
                className={[
                    'rosterGraphic',
                    'settingsGraphic',
                    'cornerstonesGraphic',
                    'suggestedMovesGraphic',
                    'holdsGraphic',
                    'risersFallersGraphic',
                    'positionalGradesGraphic',
                    'threeYearOutlookGraphic',
                ]}
                zipName={`${teamName}_unified.zip`}
            />
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
            <CornerstonesGraphic
                cornerstones={cornerstones}
                graphicClassName="cornerstonesGraphic"
            />
            <RosterGraphic
                allPlayers={allPlayers}
                rankStateMap={rankStateMap}
                numRosters={numRosters ?? 0}
                graphicClassName="rosterGraphic"
            />
            <SettingsGraphic
                leagueId={leagueId}
                numRosters={numRosters ?? 0}
                graphicClassName="settingsGraphic"
            />
            <SuggestedMovesGraphic
                sells={sells}
                buys={buys}
                graphicClassName="suggestedMovesGraphic"
                plusMap={plusMap}
            />
            <HoldsGraphic
                holds={holds}
                comments={comments}
                graphicClassName="holdsGraphic"
            />
            <RisersFallersGraphic
                risers={risers}
                fallers={fallers}
                riserValues={riserValues}
                fallerValues={fallerValues}
                graphicClassName="risersFallersGraphic"
            />
            <PositionalGradesGraphic
                overall={overall}
                qb={qb}
                rb={rb}
                wr={wr}
                te={te}
                depth={depth}
                graphicClassName="positionalGradesGraphic"
            />
            <ThreeYearOutlookGraphic
                values={outlookValues}
                outlook={outlook}
                graphicClassName="threeYearOutlookGraphic"
            />
        </div>
    );
}

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
}

export const ALL_ARCHETYPES = Object.values(Archetype);

export type UnifiedInputsProps = {
    roster: Roster | undefined;
    cornerstones: string[];
    setCornerstones: (cornerstones: string[]) => void;
    sells: string[];
    setSells: (sells: string[]) => void;
    buys: string[];
    setBuys: (buys: string[]) => void;
    plusMap: Map<string, boolean>;
    setPlusMap: (plusMap: Map<string, boolean>) => void;
    holds: string[];
    setHolds: (holds: string[]) => void;
    comments: string[];
    setComments: (comments: string[]) => void;
    risers: string[];
    setRisers: (risers: string[]) => void;
    riserValues: number[];
    setRiserValues: (values: number[]) => void;
    fallers: string[];
    setFallers: (fallers: string[]) => void;
    fallerValues: number[];
    setFallerValues: (values: number[]) => void;
    rankStateMap: Map<
        string,
        [string, React.Dispatch<React.SetStateAction<string>>]
    >;
    overall: number;
    setOverall: (value: number) => void;
    qb: number;
    setQb: (value: number) => void;
    rb: number;
    setRb: (value: number) => void;
    wr: number;
    setWr: (value: number) => void;
    te: number;
    setTe: (value: number) => void;
    depth: number;
    setDepth: (value: number) => void;
    outlookValues: number[];
    setOutlookValues: (values: number[]) => void;
    outlook: Outlook;
    setOutlook: (outlook: Outlook) => void;
    archetype?: Archetype;
    setArchetype?: (archetype: Archetype) => void;
};

export function UnifiedInputs({
    roster,
    cornerstones,
    setCornerstones,
    sells,
    setSells,
    buys,
    setBuys,
    plusMap,
    setPlusMap,
    holds,
    setHolds,
    comments,
    setComments,
    risers,
    setRisers,
    riserValues,
    setRiserValues,
    fallers,
    setFallers,
    fallerValues,
    setFallerValues,
    rankStateMap,
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
    outlookValues,
    setOutlookValues,
    outlook,
    setOutlook,
    archetype,
    setArchetype,
}: UnifiedInputsProps) {
    return (
        <Grid2 container spacing={1} style={{width: '1000px'}}>
            <Grid2 size={8} className={styles.gridItem}>
                Cornerstones
                <CornerstonesInput
                    playerIds={roster?.players ?? []}
                    setCornerstones={setCornerstones}
                    cornerstones={cornerstones}
                />
            </Grid2>
            <Grid2 size={4} className={styles.gridItem}>
                Roster
                <div>
                    <RosterInput rankStateMap={rankStateMap} />
                </div>
            </Grid2>
            <Grid2 size={6} className={styles.gridItem}>
                Suggested Moves
                <SuggestedMovesInput
                    playerIds={roster?.players ?? []}
                    sells={sells}
                    setSells={setSells}
                    buys={buys}
                    setBuys={setBuys}
                    plusMap={plusMap}
                    setPlusMap={setPlusMap}
                />
            </Grid2>
            <Grid2 size={3.5} className={styles.gridItem}>
                Risers/Fallers
                <RisersFallersInput
                    playerIds={roster?.players ?? []}
                    risers={risers}
                    setRisers={setRisers}
                    riserValues={riserValues}
                    setRiserValues={setRiserValues}
                    fallers={fallers}
                    setFallers={setFallers}
                    fallerValues={fallerValues}
                    setFallerValues={setFallerValues}
                />
            </Grid2>
            <Grid2 size={2.5} className={styles.gridItem} style={{gap: '6px'}}>
                Positional Grades
                <PositionalGradesInput
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
                />
            </Grid2>
            <Grid2 size={4} className={styles.gridItem}>
                Holds
                <HoldsInput
                    playerIds={roster?.players ?? []}
                    holds={holds}
                    setHolds={setHolds}
                    comments={comments}
                    setComments={setComments}
                />
            </Grid2>
            {!archetype && (
                <Grid2 size={5.5} className={styles.gridItem}>
                    Three Year Outlook
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <ThreeYearOutlookInput
                            values={outlookValues}
                            setValues={setOutlookValues}
                            outlook={outlook}
                            setOutlook={setOutlook}
                        />
                    </div>
                </Grid2>
            )}
            {!!archetype && !!setArchetype && (
                <Grid2 size={2.5} className={styles.gridItem}>
                    Archetype
                    <Select
                        value={archetype}
                        onChange={(event: SelectChangeEvent) => {
                            setArchetype(event.target.value as Archetype);
                        }}
                    >
                        {ALL_ARCHETYPES.map((arch, idx) => (
                            <MenuItem value={arch} key={idx}>
                                {arch}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid2>
            )}
        </Grid2>
    );
}
