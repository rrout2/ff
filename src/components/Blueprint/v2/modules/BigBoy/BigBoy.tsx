import React, {useEffect, useState} from 'react';
import styles from './BigBoy.module.css';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import {blankBlueprintV2} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    usePlayerData,
    useAdpData,
    useLeague,
    useRosterSettings,
} from '../../../../../hooks/hooks';
import {
    GraphicComponent as CornerstonesGraphic,
    useCornerstones,
} from '../CornerstonesModule/CornerstonesModule';
import {GraphicComponent as RosterGraphic} from '../RosterModule/RosterModule';
import {GraphicComponent as SettingsGraphic} from '../SettingsModule/SettingsModule';
import {FANTASY_POSITIONS, SUPER_FLEX} from '../../../../../consts/fantasy';
import ExportButton from '../../../shared/ExportButton';
import {
    GraphicComponent as SuggestedMovesGraphic,
    useBuySells,
} from '../SuggestedMovesModule/SuggestedMovesModule';
import {
    GraphicComponent as HoldsGraphic,
    useHolds,
} from '../HoldsModule/HoldsModule';
import {
    GraphicComponent as RisersFallersGraphic,
    useRisersFallers,
} from '../RisersFallersModule/RisersFallersModule';
import {
    GraphicComponent as PositionalGradesGraphic,
    usePositionalGrades,
} from '../PositionalGrades/PositionalGrades';
import {UnifiedInputs} from '../UnifiedModule/UnifiedModule';
import {FormGroup, FormControlLabel, Switch} from '@mui/material';
import {
    Archetype,
    getStartOfCode,
    getGraphFromArchetype,
    getColorFromArchetype,
    getLabelFromArchetype,
    getDvmFromArchetype,
} from '../../consts/archetypes';

interface BigBoyProps {
    roster?: Roster;
    numRosters?: number;
    teamName?: string;
}

export default function BigBoy({roster, numRosters, teamName}: BigBoyProps) {
    const {cornerstones, setCornerstones} = useCornerstones(roster);
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
    } = usePositionalGrades(roster);

    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    const [archetype, setArchetype] = useState<Archetype>(
        Archetype.FutureValue
    );

    const [otherSettings, setOtherSettings] = useState<string>('');
    const [rookiePickComments, setRookiePickComments] = useState([
        'comment 1',
        'comment 2',
    ]);

    const [suggestionsAndComments, setSuggestionsAndComments] = useState([
        'suggestion 1',
        'suggestion 2',
        'suggestion 3',
        'suggestion 4',
        'suggestion 5',
        'suggestion 6',
    ]);

    const [showPreview, setShowPreview] = useState(false);

    const PreviewToggle = () => {
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showPreview}
                            onChange={e => setShowPreview(e.target.checked)}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    }
                    label="Show Preview"
                />
            </FormGroup>
        );
    };

    const FullBlueprintWithProps = ({isPreview}: {isPreview: boolean}) => (
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
            numRosters={numRosters}
            teamName={teamName}
            archetype={archetype}
            otherSettings={otherSettings}
            rookiePickComments={rookiePickComments}
            suggestionsAndComments={suggestionsAndComments}
            isPreview={isPreview}
        />
    );

    return (
        <div>
            <ExportButton
                className={styles.exportableClass}
                pngName={`${teamName}_blueprint.png`}
                label="Download Blueprint"
            />
            <PreviewToggle />
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
                archetype={archetype}
                setArchetype={setArchetype}
                otherSettings={otherSettings}
                setOtherSettings={setOtherSettings}
                rookiePickComments={rookiePickComments}
                setRookiePickComments={setRookiePickComments}
                suggestionsAndComments={suggestionsAndComments}
                setSuggestionsAndComments={setSuggestionsAndComments}
            />
            {showPreview && <FullBlueprintWithProps isPreview={true} />}
            <div className={styles.offScreen}>
                <FullBlueprintWithProps isPreview={false} />
            </div>
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
    archetype: Archetype;
    numRosters?: number;
    teamName?: string;
    otherSettings: string;
    rookiePickComments: string[];
    suggestionsAndComments: string[];
    isPreview: boolean;
}

function FullBlueprint({
    roster,
    numRosters,
    rankStateMap,
    cornerstones,
    risers,
    fallers,
    riserValues,
    fallerValues,
    sells,
    buys,
    plusMap,
    holds,
    comments,
    overall,
    qb,
    rb,
    wr,
    te,
    depth,
    teamName,
    archetype,
    otherSettings,
    rookiePickComments,
    suggestionsAndComments,
    isPreview,
}: FullBlueprintProps) {
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
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

    function getBlueprintCode() {
        const isSuperflex = rosterSettings.has(SUPER_FLEX);
        return `${getStartOfCode(archetype)}-${numRosters ?? 0}-${
            isSuperflex ? 'SF' : '1Q'
        }`;
    }

    return (
        <div className={isPreview ? undefined : styles.exportableClass}>
            <div
                className={`${styles.fullBlueprint} ${
                    isPreview ? styles.previewSize : styles.fullSize
                }`}
            >
                <div className={styles.teamName}>{teamName}</div>
                <div className={styles.otherSettings}>{otherSettings}</div>
                <div
                    className={styles.rookiePickComment1}
                    style={{
                        fontSize:
                            rookiePickComments[0].length > 60 ? '12px' : '16px',
                    }}
                >
                    {rookiePickComments[0]}
                </div>
                <div
                    className={styles.rookiePickComment2}
                    style={{
                        fontSize:
                            rookiePickComments[0].length > 60 ? '12px' : '16px',
                    }}
                >
                    {rookiePickComments[1]}
                </div>
                <div className={styles.suggestionsAndComments}>
                    <ul>
                        {suggestionsAndComments.map(
                            (suggestion, i) =>
                                !!suggestion && <li key={i}>{suggestion}</li>
                        )}
                    </ul>
                </div>
                <div className={styles.rosterGraphic}>
                    <RosterGraphic
                        allPlayers={allPlayers}
                        numRosters={numRosters ?? 0}
                        rankStateMap={rankStateMap}
                        transparent={true}
                    />
                </div>
                <div className={styles.settingsGraphic}>
                    <SettingsGraphic
                        leagueId={leagueId}
                        numRosters={numRosters ?? 0}
                        transparent={true}
                    />
                </div>
                <div className={styles.cornerstonesGraphic}>
                    <CornerstonesGraphic cornerstones={cornerstones} />
                </div>
                <div className={styles.risersFallersGraphic}>
                    <RisersFallersGraphic
                        risers={risers}
                        riserValues={riserValues}
                        fallers={fallers}
                        fallerValues={fallerValues}
                        transparent={true}
                    />
                </div>
                <div className={styles.suggestedMovesGraphic}>
                    <SuggestedMovesGraphic
                        transparent={true}
                        sells={sells}
                        buys={buys}
                        plusMap={plusMap}
                    />
                </div>
                <div className={styles.holdsGraphic}>
                    <HoldsGraphic holds={holds} comments={comments} />
                </div>
                <div className={styles.positionalGradesGraphic}>
                    <PositionalGradesGraphic
                        overall={overall}
                        qb={qb}
                        rb={rb}
                        wr={wr}
                        te={te}
                        depth={depth}
                        transparent={true}
                    />
                </div>
                <div className={styles.threeYearOutlook}>
                    <div className={styles.graphCrop}>
                        <img
                            src={getGraphFromArchetype(archetype)}
                            className={styles.graph}
                        />
                    </div>
                </div>
                <div
                    className={styles.archetypeGraphLabel}
                    style={{color: getColorFromArchetype(archetype)}}
                >
                    ⎯⎯&nbsp;&nbsp;
                    {getLabelFromArchetype(archetype).toUpperCase()}
                    &nbsp;&nbsp;⎯⎯
                </div>
                <div className={styles.dvm}>
                    <img src={getDvmFromArchetype(archetype)} />
                </div>
                <div className={styles.bpCode}>{getBlueprintCode()}</div>
                <img src={blankBlueprintV2} />
            </div>
        </div>
    );
}
