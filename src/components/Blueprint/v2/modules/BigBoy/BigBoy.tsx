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
import {
    FANTASY_POSITIONS,
    QB,
    RB,
    SUPER_FLEX,
    TE,
    WR,
} from '../../../../../consts/fantasy';
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
import {
    FormGroup,
    FormControlLabel,
    Switch,
    Button,
    Tooltip,
} from '@mui/material';
import {
    Archetype,
    getStartOfCode,
    getGraphFromArchetype,
    getColorFromArchetype,
    getLabelFromArchetype,
    getDvmFromArchetype,
} from '../../consts/archetypes';
import {
    ARCHETYPE,
    BUYS,
    CORNERSTONES,
    FALLER_VALUES,
    FALLERS,
    HOLD_COMMENTS,
    HOLDS,
    OTHER_SETTINGS,
    PLUS_MAP,
    POSITIONAL_GRADES,
    QB_RANK,
    RB_RANK,
    RISER_VALUES,
    RISERS,
    ROOKIE_PICK_COMMENTS,
    SELLS,
    SUGGESTIONS_AND_COMMENTS,
    TE_RANK,
    WR_RANK,
} from '../../../../../consts/urlParams';
import {useSearchParams} from 'react-router-dom';

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

    const [searchParams, setSearchParams] = useSearchParams();

    const playerData = usePlayerData();

    useEffect(() => {
        if (!playerData || !searchParams.get(CORNERSTONES)) return;
        // not sure why this is necessary
        setTimeout(loadFromUrl, 200);
    }, [playerData, searchParams]);

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

    function saveToUrl() {
        setSearchParams(searchParams => {
            searchParams.set(CORNERSTONES, cornerstones.join('-'));
            searchParams.set(SELLS, sells.join('-'));
            searchParams.set(BUYS, buys.join('-'));
            searchParams.set(
                PLUS_MAP,
                buys.map(buy => (plusMap.get(buy) ? 'T' : 'F')).join('-')
            );
            searchParams.set(HOLDS, holds.join('-'));
            searchParams.set(HOLD_COMMENTS, comments.join('-'));
            searchParams.set(RISERS, risers.join('-'));
            searchParams.set(FALLERS, fallers.join('-'));
            searchParams.set(RISER_VALUES, riserValues.join('-'));
            searchParams.set(
                FALLER_VALUES,
                fallerValues.map(val => Math.abs(val)).join('-')
            );
            searchParams.set(
                POSITIONAL_GRADES,
                [overall, qb, rb, wr, te, depth].join('-')
            );
            searchParams.set(QB_RANK, rankStateMap.get(QB)![0]);
            searchParams.set(RB_RANK, rankStateMap.get(RB)![0]);
            searchParams.set(WR_RANK, rankStateMap.get(WR)![0]);
            searchParams.set(TE_RANK, rankStateMap.get(TE)![0]);
            searchParams.set(ARCHETYPE, archetype);
            searchParams.set(OTHER_SETTINGS, otherSettings);
            searchParams.set(
                ROOKIE_PICK_COMMENTS,
                rookiePickComments.join('-')
            );
            searchParams.set(
                SUGGESTIONS_AND_COMMENTS,
                suggestionsAndComments.join('-')
            );
            return searchParams;
        });
    }

    function loadFromUrl() {
        setCornerstones((searchParams.get(CORNERSTONES) || '').split('-'));
        setSells((searchParams.get(SELLS) || '').split('-'));

        const newBuys = (searchParams.get(BUYS) || '').split('-');
        setBuys(newBuys);

        const plusList = (searchParams.get(PLUS_MAP) || '')
            .split('-')
            .map(val => (val === 'T' ? true : false));
        const newPlusMap = new Map<string, boolean>();
        newBuys.forEach((buy, idx) => {
            newPlusMap.set(buy, plusList[idx]);
        });
        setPlusMap(newPlusMap);

        setHolds((searchParams.get(HOLDS) || '').split('-'));
        setComments((searchParams.get(HOLD_COMMENTS) || '').split('-'));
        setRisers((searchParams.get(RISERS) || '').split('-'));
        setFallers((searchParams.get(FALLERS) || '').split('-'));

        setRiserValues(
            (searchParams.get(RISER_VALUES) || '')
                .split('-')
                .map(val => Math.round(+val * 10) / 10)
        );

        setFallerValues(
            (searchParams.get(FALLER_VALUES) || '')
                .split('-')
                .map(val => Math.round(-val * 10) / 10)
        );

        const posGrades = (searchParams.get(POSITIONAL_GRADES) || '').split(
            '-'
        );
        setOverall(+posGrades[0]);
        setQb(+posGrades[1]);
        setRb(+posGrades[2]);
        setWr(+posGrades[3]);
        setTe(+posGrades[4]);
        setDepth(+posGrades[5]);

        rankStateMap.get(QB)![1](searchParams.get(QB_RANK) || '4th');
        rankStateMap.get(RB)![1](searchParams.get(RB_RANK) || '4th');
        rankStateMap.get(WR)![1](searchParams.get(WR_RANK) || '4th');
        rankStateMap.get(TE)![1](searchParams.get(TE_RANK) || '4th');

        setArchetype(searchParams.get(ARCHETYPE) as Archetype);

        setOtherSettings(searchParams.get(OTHER_SETTINGS) || '');

        const newRookiePickComments = searchParams.get(ROOKIE_PICK_COMMENTS);
        if (newRookiePickComments) {
            setRookiePickComments(newRookiePickComments.split('-'));
        }

        const newSuggestionsAndComments = searchParams.get(
            SUGGESTIONS_AND_COMMENTS
        );
        if (newSuggestionsAndComments) {
            setSuggestionsAndComments(newSuggestionsAndComments.split('-'));
        }
    }

    function clearUrlSave() {
        setSearchParams(searchParams => {
            searchParams.delete(CORNERSTONES);
            searchParams.delete(SELLS);
            searchParams.delete(BUYS);
            searchParams.delete(PLUS_MAP);
            searchParams.delete(HOLDS);
            searchParams.delete(HOLD_COMMENTS);
            searchParams.delete(RISERS);
            searchParams.delete(FALLERS);
            searchParams.delete(RISER_VALUES);
            searchParams.delete(FALLER_VALUES);
            searchParams.delete(POSITIONAL_GRADES);
            searchParams.delete(QB_RANK);
            searchParams.delete(RB_RANK);
            searchParams.delete(WR_RANK);
            searchParams.delete(TE_RANK);
            searchParams.delete(ARCHETYPE);
            searchParams.delete(OTHER_SETTINGS);
            searchParams.delete(ROOKIE_PICK_COMMENTS);
            searchParams.delete(SUGGESTIONS_AND_COMMENTS);
            return searchParams;
        });
    }

    return (
        <div>
            <ExportButton
                className={styles.exportableClass}
                pngName={`${teamName}_blueprint.png`}
                label="Download Blueprint"
            />
            <Tooltip title="Save to URL">
                <Button variant={'outlined'} onClick={saveToUrl}>
                    {'Save'}
                </Button>
            </Tooltip>
            <Tooltip title="Clear Save from URL">
                <Button
                    variant={'outlined'}
                    onClick={clearUrlSave}
                    disabled={!searchParams.get(CORNERSTONES)}
                >
                    {'Clear'}
                </Button>
            </Tooltip>
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
