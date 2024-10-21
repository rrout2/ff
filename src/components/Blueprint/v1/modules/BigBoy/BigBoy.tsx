import {useEffect, useState} from 'react';
import {
    blankRedraftBp,
    blankblueprint,
    circleSlider,
    draftCapitalBackground,
    draftCapitalScale,
    outlook1,
    outlook2,
    outlook3,
    rebuildContendScale,
    riskSafetyScale,
    silhouette,
} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    useFetchRosters,
    usePlayerData,
    useAdpData,
    useLeague,
    useProjectedLineup,
    useRosterSettingsFromId,
} from '../../../../../hooks/hooks';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../../shared/ExportButton';
import styles from './BigBoy.module.css';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
    TextField,
    Tooltip,
} from '@mui/material';
import {
    FLEX,
    WR_RB_FLEX,
    WR_TE_FLEX,
    QB,
    RB,
    WR,
    TE,
    BENCH,
    SUPER_FLEX,
    FANTASY_POSITIONS,
} from '../../../../../consts/fantasy';
import {
    GraphicComponent as PositionalGradesGraphic,
    OverrideComponent as PositionalGradesOverride,
} from '../PositionalGrades/PositionalGrades';
import {
    GraphicComponent as WaiverTargetsGraphic,
    InputComponent as WaiverTargetsInput,
} from '../WaiverTargets/WaiverTargets';
import {
    GraphicComponent as LookToTradeGraphic,
    InputComponent as LookToTradeInput,
} from '../looktotrade/LookToTradeModule';
import {
    GraphicComponent as CornerstoneGraphic,
    AllPositionalSelectors as CornerstoneSelectors,
} from '../cornerstone/CornerstoneModule';
import {
    StartersGraphic,
    InputComponent as StartersInput,
} from '../Starters/Starters';
import {
    GraphicComponent as DepthScoreGraphic,
    OverrideComponent as DepthScoreOverride,
} from '../DepthScore/DepthScore';
import {
    GraphicComponent as SettingsGraphic,
    InputComponent as SettingsInput,
} from '../settings/Settings';
import {
    GraphicComponent as PlayersToTargetGraphic,
    InputComponent as PlayersToTargetInput,
} from '../playerstotarget/PlayersToTargetModule';
import StyledNumberInput from '../../../shared/StyledNumberInput';
import {useSearchParams} from 'react-router-dom';
import {
    ARCHETYPE,
    COMMENTS,
    CORNERSTONES,
    DEPTH_SCORE_OVERRIDE,
    DRAFT_CAPITAL_NOTES,
    DRAFT_CAPITAL_VALUE,
    IN_RETURN,
    OTHER_SETTINGS,
    OUTLOOK,
    PLAYERS_TO_TARGET,
    PLAYERS_TO_TRADE,
    POSITIONAL_GRADE_OVERRIDES,
    REBUILD_CONTEND_VALUE,
    STARTING_LINEUP,
    WAIVER_TARGETS,
} from '../../../../../consts/urlParams';
enum Archetype {
    HardRebuild = 'HARD REBUILD',
    FutureValue = 'FUTURE VALUE',
    WellRounded = 'WELL ROUNDED',
    OneYearReload = 'ONE YEAR RELOAD',
    EliteValue = 'ELITE VALUE',
    WRFactory = 'WR FACTORY',
    DualEliteQB = 'DUAL ELITE QB',
    EliteQBTE = 'ELITE QB/TE',
    RBHeavy = 'RB HEAVY',
}

const ArchetypeDetails = {
    [Archetype.HardRebuild]: [['REBUILD', 'REBUILD', 'CONTEND']],
    [Archetype.FutureValue]: [['REBUILD', 'CONTEND', 'CONTEND']],
    [Archetype.WellRounded]: [['CONTEND', 'CONTEND', 'REBUILD']],
    [Archetype.OneYearReload]: [['RELOAD', 'CONTEND', 'CONTEND']],
    [Archetype.EliteValue]: [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['CONTEND', 'CONTEND', 'CONTEND'],
    ],
    [Archetype.WRFactory]: [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['CONTEND', 'CONTEND', 'REBUILD'],
    ],
    [Archetype.DualEliteQB]: [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['REBUILD', 'CONTEND', 'CONTEND'],
    ],
    [Archetype.EliteQBTE]: [
        ['CONTEND', 'CONTEND', 'RELOAD'],
        ['REBUILD', 'CONTEND', 'CONTEND'],
    ],
    [Archetype.RBHeavy]: [['CONTEND', 'CONTEND', 'REBUILD']],
};

const ALL_ARCHETYPES = Object.values(Archetype);

interface BigBoyProps {
    roster?: Roster;
    teamName?: string;
    numRosters?: number;
}

export default function BigBoy({roster, teamName, numRosters}: BigBoyProps) {
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const {sortByAdp, getAdp, getPositionalAdp} = useAdpData();
    const {data: rosters} = useFetchRosters(leagueId);
    const playerData = usePlayerData();
    const {startingLineup, setStartingLineup, bench, benchString} =
        useProjectedLineup(rosterSettings, roster?.players);
    const [showPreview, setShowPreview] = useState(false);
    const [isRedraft, setIsRedraft] = useState(false);
    const [rebuildContendValue, setRebuildContendValue] = useState(50);
    const [draftCapitalValue, setDraftCapitalValue] = useState(50);
    const [draftCapitalNotes, setDraftCapitalNotes] = useState('placeholder');
    const [comments, setComments] = useState<string[]>([
        'comment 1',
        'comment 2',
        'comment 3',
    ]);
    const [positionalGradeOverrides, setPositionalGradeOverrides] = useState<
        Map<string, number>
    >(new Map(FANTASY_POSITIONS.map(pos => [pos, -1])));
    const [playersToTrade, setPlayersToTrade] = useState<string[][]>([
        [],
        [],
        [],
    ]);
    const [inReturn, setInReturn] = useState<string[]>([
        'placeholder',
        'placeholder',
        'placeholder',
    ]);
    const [cornerstones, setCornerstones] = useState(
        new Map<string, string[]>(FANTASY_POSITIONS.map(pos => [pos, []]))
    );
    function isCornerstone(player?: Player) {
        if (!player) return false;
        // this is probably pretty brittle
        const adp = getAdp(`${player.first_name} ${player.last_name}`);
        return adp <= 75 && adp >= 0;
    }

    useEffect(() => {
        if (!roster || !playerData) return;

        const cornerstones = roster.players
            .map(playerId => playerData[playerId])
            .filter(isCornerstone)
            .sort(sortByAdp);

        setCornerstones(
            new Map<string, string[]>(
                FANTASY_POSITIONS.map(pos => [
                    pos,
                    cornerstones
                        .filter(player =>
                            player.fantasy_positions.includes(pos)
                        )
                        .map(player => player.player_id)
                        .slice(0, 3),
                ])
            )
        );
    }, [roster, playerData]);
    const [depthScoreOverride, setDepthScoreOverride] = useState(-1);

    const [outlooks, setOutlooks] = useState<string[]>([]);
    const [archetype, setArchetype] = useState(Archetype.HardRebuild);
    useEffect(() => {
        setOutlooks(ArchetypeDetails[archetype][0]);
    }, [archetype]);
    const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([
        '10229',
        '5849',
        '4866',
        '10859',
    ]);

    const [otherSettings, setOtherSettings] = useState('');
    const [waiverTarget, setWaiverTarget] = useState<string>('');

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!playerData || !searchParams.get(STARTING_LINEUP)) return;
        // not sure why this is necessary
        setTimeout(load, 200);
    }, [playerData, searchParams]);

    function save() {
        setSearchParams(searchParams => {
            searchParams.set(OTHER_SETTINGS, otherSettings);
            searchParams.set(PLAYERS_TO_TARGET, playerSuggestions.join(','));
            searchParams.set(ARCHETYPE, archetype);
            searchParams.set(OUTLOOK, outlooks.join(','));
            searchParams.set(
                DEPTH_SCORE_OVERRIDE,
                depthScoreOverride.toString()
            );
            searchParams.set(
                CORNERSTONES,
                JSON.stringify(Array.from(cornerstones.entries()))
            );
            searchParams.set(PLAYERS_TO_TRADE, JSON.stringify(playersToTrade));
            searchParams.set(IN_RETURN, inReturn.join(','));
            searchParams.set(DRAFT_CAPITAL_NOTES, draftCapitalNotes);
            searchParams.set(DRAFT_CAPITAL_VALUE, draftCapitalValue.toString());
            searchParams.set(
                REBUILD_CONTEND_VALUE,
                rebuildContendValue.toString()
            );
            searchParams.set(
                POSITIONAL_GRADE_OVERRIDES,
                JSON.stringify(Array.from(positionalGradeOverrides.entries()))
            );
            searchParams.set(
                STARTING_LINEUP,
                JSON.stringify(
                    startingLineup.map(p => {
                        return {id: p.player.player_id, pos: p.position};
                    })
                )
            );

            searchParams.set(WAIVER_TARGETS, waiverTarget);

            searchParams.set(COMMENTS, comments.join(','));

            return searchParams;
        });
    }

    function clearUrlSave() {
        setSearchParams(searchParams => {
            searchParams.delete(OTHER_SETTINGS);
            searchParams.delete(PLAYERS_TO_TARGET);
            searchParams.delete(ARCHETYPE);
            searchParams.delete(OUTLOOK);
            searchParams.delete(DEPTH_SCORE_OVERRIDE);
            searchParams.delete(CORNERSTONES);
            searchParams.delete(PLAYERS_TO_TRADE);
            searchParams.delete(IN_RETURN);
            searchParams.delete(DRAFT_CAPITAL_NOTES);
            searchParams.delete(DRAFT_CAPITAL_VALUE);
            searchParams.delete(REBUILD_CONTEND_VALUE);
            searchParams.delete(POSITIONAL_GRADE_OVERRIDES);
            searchParams.delete(STARTING_LINEUP);
            searchParams.delete(WAIVER_TARGETS);
            searchParams.delete(COMMENTS);
            return searchParams;
        });
    }

    function load() {
        setOtherSettings(searchParams.get(OTHER_SETTINGS) || '');
        setPlayerSuggestions(
            (searchParams.get(PLAYERS_TO_TARGET) || '').split(',')
        );
        setArchetype(
            (searchParams.get(ARCHETYPE) as Archetype) || Archetype.HardRebuild
        );
        setOutlooks((searchParams.get(OUTLOOK) || '').split(','));
        setDepthScoreOverride(
            parseInt(searchParams.get(DEPTH_SCORE_OVERRIDE) || '0')
        );
        const cornerstonesEntries = JSON.parse(
            searchParams.get(CORNERSTONES) || '{}'
        );
        setCornerstones(new Map(cornerstonesEntries));
        setPlayersToTrade(
            JSON.parse(searchParams.get(PLAYERS_TO_TRADE) || '{}')
        );
        setInReturn((searchParams.get(IN_RETURN) || '').split(','));
        setDraftCapitalNotes(searchParams.get(DRAFT_CAPITAL_NOTES) || '');
        setDraftCapitalValue(
            parseInt(searchParams.get(DRAFT_CAPITAL_VALUE) || '0')
        );
        setRebuildContendValue(
            parseInt(searchParams.get(REBUILD_CONTEND_VALUE) || '0')
        );
        const positionalGradeOverridesEntries = JSON.parse(
            searchParams.get(POSITIONAL_GRADE_OVERRIDES) || '{}'
        );
        setPositionalGradeOverrides(new Map(positionalGradeOverridesEntries));
        const startingLineup = JSON.parse(
            searchParams.get(STARTING_LINEUP) || '[]'
        ) as {id: string; pos: string}[];
        if (startingLineup.length > 0) {
            setStartingLineup(
                startingLineup.map(p => {
                    return {
                        player: playerData![p.id],
                        position: p.pos,
                    };
                })
            );
        }

        setWaiverTarget(searchParams.get(WAIVER_TARGETS) || '');
        setComments((searchParams.get(COMMENTS) || '').split(','));
    }

    function fullBlueprint() {
        return (
            <div className={styles.fullBlueprint}>
                {settingsGraphicComponent()}
                {startersGraphicComponent()}
                {cornerstoneGraphicComponent()}
                {depthScoreGraphicComponent()}
                {playersToTargetGraphicComponent()}
                {positionalGradesGraphicComponent()}
                {lookToTradeGraphicComponent()}
                {teamNameComponent()}
                {archetypeComponent()}
                {isRedraft ? (
                    <div className={styles.waiverTargetsGraphic}>
                        <WaiverTargetsGraphic target={waiverTarget} />
                    </div>
                ) : (
                    threeYearOutlookComponent()
                )}
                {contendRebuildScaleComponent()}
                {draftCapitalGradeComponent()}
                {commentsComponent()}
                <img
                    src={isRedraft ? blankRedraftBp : blankblueprint}
                    className={styles.base}
                />
            </div>
        );
    }

    function commentsInput() {
        return (
            <div className={styles.inputModule}>
                Suggestions/Comments:
                {comments.map((comment, idx) => {
                    return (
                        <TextField
                            style={{margin: '4px'}}
                            key={idx}
                            value={comment}
                            onChange={e => {
                                const newComments = comments.slice();
                                newComments[idx] = e.target.value;
                                setComments(newComments);
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    function commentsComponent() {
        return (
            <ul className={styles.commentsGraphic}>
                {comments.map((c, idx) => {
                    return <li key={idx}>{c}</li>;
                })}
            </ul>
        );
    }

    function draftCapitalGradeComponent() {
        return (
            <div className={styles.draftCapitalGradeGraphic}>
                <div className={styles.scaleAndSlider}>
                    <img src={draftCapitalScale} />
                    <img
                        src={circleSlider}
                        className={styles.otherSlider}
                        style={{left: `${draftCapitalValue * 7.8}px`}}
                    />
                </div>
                <div className={styles.draftCapitalBackground}>
                    <img src={draftCapitalBackground} />
                </div>
                <div className={styles.draftCapitalText}>
                    {draftCapitalNotes.toUpperCase()}
                </div>
            </div>
        );
    }

    function draftCapitalGradeInput() {
        return (
            <StyledNumberInput
                value={draftCapitalValue}
                onChange={(_, value) => {
                    setDraftCapitalValue(value || 0);
                }}
                min={0}
                max={100}
            />
        );
    }

    function draftCapitalNotesInput() {
        return (
            <TextField
                style={{margin: '4px'}}
                label={'Draft Capital Notes'}
                value={draftCapitalNotes}
                onChange={e => setDraftCapitalNotes(e.target.value)}
            />
        );
    }

    function contendRebuildScaleComponent() {
        return (
            <div className={styles.rebuildContendScaleGraphic}>
                <div className={styles.scaleAndSlider}>
                    <img
                        src={isRedraft ? riskSafetyScale : rebuildContendScale}
                    />
                    <img
                        src={circleSlider}
                        className={styles.slider}
                        style={{left: `${rebuildContendValue * 5.45}px`}}
                    />
                </div>
            </div>
        );
    }

    function contendRebuildScaleInput() {
        return (
            <StyledNumberInput
                value={rebuildContendValue}
                onChange={(_, value) => {
                    setRebuildContendValue(value || 0);
                }}
                min={0}
                max={100}
            />
        );
    }

    function togglePreview() {
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
    }
    function toggleRedraft() {
        return (
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isRedraft}
                            onChange={e => setIsRedraft(e.target.checked)}
                            inputProps={{'aria-label': 'controlled'}}
                        />
                    }
                    label="Redraft?"
                />
            </FormGroup>
        );
    }

    function settingsGraphicComponent() {
        return (
            <div className={styles.settingsGraphic}>
                <SettingsGraphic
                    numRosters={numRosters ?? 0}
                    otherSettings={otherSettings}
                    transparent={true}
                />
            </div>
        );
    }

    function startersGraphicComponent() {
        return (
            <div className={styles.startersGraphic}>
                <StartersGraphic
                    startingLineup={startingLineup}
                    transparent={true}
                />
            </div>
        );
    }

    function cornerstoneGraphicComponent() {
        return (
            <div className={styles.cornerstoneGraphic}>
                <CornerstoneGraphic
                    cornerstones={cornerstones}
                    transparent={true}
                />
            </div>
        );
    }

    function depthScoreGraphicComponent() {
        return (
            <div className={styles.depthScoreGraphic}>
                <DepthScoreGraphic
                    override={depthScoreOverride}
                    transparent={true}
                    bench={bench}
                    benchString={benchString}
                />
            </div>
        );
    }

    function playersToTargetGraphicComponent() {
        return (
            <div className={styles.playersToTargetGraphic}>
                <PlayersToTargetGraphic
                    playerSuggestions={playerSuggestions}
                    transparent={true}
                />
            </div>
        );
    }

    function positionalGradesGraphicComponent() {
        return (
            <div className={styles.positionalGradesGraphic}>
                <PositionalGradesGraphic
                    overrides={positionalGradeOverrides}
                    roster={roster}
                    transparent={true}
                />
            </div>
        );
    }

    function lookToTradeGraphicComponent() {
        return (
            <div className={styles.lookToTradeGraphic}>
                <LookToTradeGraphic
                    inReturn={inReturn}
                    playersToTrade={playersToTrade}
                    transparent={true}
                />
            </div>
        );
    }

    function archetypeComponent() {
        return (
            <div>
                {!isRedraft && (
                    <div className={styles.archetypeTitle}>
                        {'TEAM ARCHETYPE:'}
                    </div>
                )}
                <div className={styles.archetype}>{archetype}</div>
                <img src={silhouette} className={styles.archetypeSilhouette} />
            </div>
        );
    }

    function threeYearOutlookComponent() {
        return (
            <div>
                <div className={styles.outlookTitle}>3-YEAR OUTLOOK:</div>
                <div className={styles.outlookImages}>
                    <img src={outlook1} />
                    <img src={outlook2} />
                    <img src={outlook3} />
                </div>
                <div className={styles.outlookChips}>
                    <div className={styles.outlookChip}>
                        <div className={styles.outlookYear}>YR 1</div>
                        <div className={styles.outlookLabel}>{outlooks[0]}</div>
                    </div>
                    <div className={styles.outlookChip}>
                        <div className={styles.outlookYear}>YR 2</div>
                        <div className={styles.outlookLabel}>{outlooks[1]}</div>
                    </div>
                    <div className={styles.outlookChip}>
                        <div className={styles.outlookYear}>YR 3</div>
                        <div className={styles.outlookLabel}>{outlooks[2]}</div>
                    </div>
                </div>
            </div>
        );
    }

    function teamNameComponent() {
        if (!teamName) return <></>;
        const longName = teamName.length >= 16;
        const veryLongName = teamName.length >= 24;
        return (
            <div
                className={`${styles.teamNameGraphic} ${
                    longName ? styles.smallerTeamName : ''
                } ${veryLongName ? styles.smallestTeamName : ''}`}
            >
                {teamName}
            </div>
        );
    }

    function rosterComponent() {
        if (!playerData) return <></>;
        const allPlayers = roster?.players
            .map(playerId => playerData[playerId])
            .sort(sortByAdp);
        if (!allPlayers) return <></>;

        return (
            <div className={styles.fullRoster}>
                {FANTASY_POSITIONS.map(pos => (
                    <div className={styles.positionColumn} key={pos}>
                        <b>{pos}</b>
                        {allPlayers
                            .filter(
                                player => !!player && player.position === pos
                            )
                            .map(player => {
                                const fullName = `${player.first_name} ${player.last_name}`;
                                const positionalAdp =
                                    getPositionalAdp(fullName);
                                return (
                                    <div className={styles.rosterPlayer}>
                                        <div>{fullName}</div>
                                        <div>
                                            {positionalAdp === Infinity
                                                ? '∞'
                                                : positionalAdp}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>
        );
    }

    function settingsComponent() {
        if (!playerData) return <></>;
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings) return <></>;
        const wrtFlex = rosterSettings.get(FLEX) ?? 0;
        const wrFlex = rosterSettings.get(WR_RB_FLEX) ?? 0;
        const wtFlex = rosterSettings.get(WR_TE_FLEX) ?? 0;
        return (
            <div>
                <div>QB: {rosterSettings.get(QB)}</div>
                <div>RB: {rosterSettings.get(RB)}</div>
                <div>WR: {rosterSettings.get(WR)}</div>
                <div>TE: {rosterSettings.get(TE)}</div>
                <div>FLEX: {wrtFlex + wrFlex + wtFlex}</div>
                <div>BN: {rosterSettings.get(BENCH)}</div>
                <div>TEAMS: {rosters?.length ?? 0}</div>
                <div>SF: {rosterSettings.has(SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {scoringSettings.rec ?? 0}</div>
                <div>TEP: {scoringSettings.bonus_rec_te ?? 0}</div>
                <div>TAXI: {league.settings.taxi_slots}</div>
                <SettingsInput
                    otherSettings={otherSettings}
                    setOtherSettings={setOtherSettings}
                />
            </div>
        );
    }

    function inputsComponent() {
        return (
            <>
                <Grid2 container spacing={1} className={styles.inputGrid}>
                    <Grid2 size={8}>
                        <div>{rosterComponent()}</div>
                    </Grid2>
                    <Grid2 size={2.5}>
                        <div className={styles.inputModule}>
                            Positional Grade Override:
                            <PositionalGradesOverride
                                overrides={positionalGradeOverrides}
                                setOverrides={setPositionalGradeOverrides}
                                roster={roster}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={1.5} className={styles.extraInfo}>
                        <div style={{textAlign: 'end', maxWidth: '120px'}}>
                            {settingsComponent()}
                        </div>
                    </Grid2>
                    <Grid2 size={6}>
                        <div className={styles.inputModule}>
                            Cornerstones:
                            <CornerstoneSelectors
                                cornerstones={cornerstones}
                                setCornerstones={setCornerstones}
                                roster={roster}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={2}>
                        <div className={styles.inputModule}>
                            Depth Score Override:
                            <DepthScoreOverride
                                override={depthScoreOverride}
                                setOverride={setDepthScoreOverride}
                                roster={roster}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={4}>
                        <div>{archetypeSelector()}</div>
                    </Grid2>
                    <Grid2 size={4}>
                        <div className={styles.inputModule}>
                            Look to Trade:
                            <LookToTradeInput
                                playersToTrade={playersToTrade}
                                setPlayersToTrade={setPlayersToTrade}
                                inReturn={inReturn}
                                setInReturn={setInReturn}
                                roster={roster}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={3}>
                        <div className={styles.inputModule}>
                            Players to Target:
                            <PlayersToTargetInput
                                playerSuggestions={playerSuggestions}
                                setPlayerSuggestions={setPlayerSuggestions}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={2.5}>
                        {isRedraft
                            ? 'Risk(0) - Safety(100)'
                            : 'Rebuild(0) - Contend(100)'}
                        <div>{contendRebuildScaleInput()}</div>
                        {isRedraft
                            ? 'Overall Team Grade'
                            : 'Draft Capital Grade'}
                        <div>{draftCapitalGradeInput()}</div>
                        {draftCapitalNotesInput()}
                        {commentsInput()}
                    </Grid2>
                    <Grid2 size={2.5}>
                        <div className={styles.inputModule}>
                            Starters:
                            <StartersInput
                                startingLineup={startingLineup}
                                setStartingLineup={setStartingLineup}
                                roster={roster}
                            />
                        </div>
                    </Grid2>
                </Grid2>
            </>
        );
    }

    function archetypeSelector() {
        if (outlooks.length === 0) return <></>;
        return (
            <div className={styles.inputModule}>
                <FormControl style={{margin: '4px'}}>
                    <InputLabel>
                        {isRedraft ? 'Team Build' : 'Archetype'}
                    </InputLabel>
                    <Select
                        value={archetype}
                        label="Archetype"
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
                </FormControl>
                {!isRedraft &&
                    [0, 1, 2].map(idx => (
                        <FormControl style={{margin: '4px'}} key={idx}>
                            <InputLabel>Year {idx + 1}</InputLabel>
                            <Select
                                label={`Year ${idx + 1}`}
                                value={outlooks[idx]}
                                onChange={(event: SelectChangeEvent) => {
                                    const newOutlooks = outlooks.slice();
                                    newOutlooks[idx] = event.target.value;
                                    setOutlooks(newOutlooks);
                                }}
                            >
                                <MenuItem value={'CONTEND'} key={'CONTEND'}>
                                    {'CONTEND'}
                                </MenuItem>
                                <MenuItem value={'REBUILD'} key={'REBUILD'}>
                                    {'REBUILD'}
                                </MenuItem>

                                <MenuItem value={'RELOAD'} key={'RELOAD'}>
                                    {'RELOAD'}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    ))}
                {isRedraft && (
                    <WaiverTargetsInput
                        target={waiverTarget}
                        setTarget={setWaiverTarget}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={styles.BigBoy}>
            <ExportButton
                className={styles.fullBlueprint}
                pngName={`${teamName}_blueprint.png`}
                label="Download Blueprint"
            />
            <Tooltip title="Save to URL">
                <Button variant={'outlined'} onClick={save}>
                    {'Save'}
                </Button>
            </Tooltip>
            <Tooltip title="Clear Save from URL">
                <Button
                    variant={'outlined'}
                    onClick={clearUrlSave}
                    disabled={!searchParams.get(STARTING_LINEUP)}
                >
                    {'Clear'}
                </Button>
            </Tooltip>
            {togglePreview()}
            {toggleRedraft()}
            <div className={styles.inputsAndPreview}>
                {inputsComponent()}
                {showPreview && (
                    <div className={styles.smaller}>{fullBlueprint()}</div>
                )}
            </div>
            <div className={styles.offScreen}>{fullBlueprint()}</div>
        </div>
    );
}
