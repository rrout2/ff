import styles from './RookieDraft.module.css';
import {
    blankRookie,
    horizontalScale,
    rookieMap,
} from '../../../../consts/images';
import {Fragment, SetStateAction, useEffect, useState} from 'react';
import {Archetype, ARCHETYPE_TO_IMAGE} from '../../v1/modules/BigBoy/BigBoy';
import {
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {
    useFetchRosters,
    useLeague,
    useLeagueIdFromUrl,
    usePickMoves,
    useRookieRankings,
    useRoster,
    useRosterSettings,
    useTeamIdFromUrl,
} from '../../../../hooks/hooks';
import {
    getAllUsers,
    getTeamName,
    User,
} from '../../../../sleeper-api/sleeper-api';
import {NONE_TEAM_ID} from '../../../../consts/urlParams';
import {TeamSelectComponent} from '../../../Team/TeamPage/TeamPage';
import {
    RosterTier,
    useRosterTierAndPosGrades,
} from '../../infinite/RosterTier/RosterTier';
import {SUPER_FLEX, QB} from '../../../../consts/fantasy';
import {getPositionalOrder} from '../../infinite/BuySellHold/BuySellHold';
import StyledNumberInput from '../../shared/StyledNumberInput';

enum Verdict {
    Downtier = 'Downtier',
    Hold = 'Hold',
    ProvenAsset = 'Proven Asset',
    ProvenVet = 'Proven Vet',
    Uptier = 'Uptier',
    None = '',
}
const VERDICT_OPTIONS = Object.values(Verdict);
type DraftPick = {
    round: number | '';
    pick: number | '';
    verdict: Verdict;
};

type DraftStrategy = {
    header: string;
    body: string;
}[];

const firstRoundDraftStrategy = {
    header: '1st Round Picks',
    body: 'Never let a value faller make it past you. If there are no fallers, plan to prioritize your team need within a value tier. Note that late 1sts don’t have a superior hit rate to the early 2nd range. ',
};

const secondRoundDraftStrategy = {
    header: '2nd Round Picks',
    body: 'Try taking mid 2nd round picks and either trading up into the early second or downtiering into the late 2nd. If there are high draft capital WRs, take them here. Don’t reach on day 3 RBs with enticing landing spots until later.',
};
const thirdRoundDraftStrategy = {
    header: '3rd Round Picks',
    body: 'Use these picks on RBs, we have found that the hit rates for RBs in the 3rd round is very comparable to that of the hit rates in the 2nd. Keep in mind WRs & TEs have very low hit rates in this range.',
};

export function useRookieDraft() {
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    const [teamId, setTeamId] = useTeamIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const {roster} = useRoster(rosters, teamId, leagueId);
    const [outlooks, setOutlooks] = useState<string[]>(['', '', '']);
    const [draftPicks, setDraftPicks] = useState<DraftPick[]>([
        {round: 1, pick: 1, verdict: Verdict.None},
        {round: 2, pick: 2, verdict: Verdict.None},
        {round: 3, pick: 3, verdict: Verdict.None},
        {round: 4, pick: 4, verdict: Verdict.None},
    ]);
    const isSuperFlex =
        rosterSettings.has(SUPER_FLEX) || (rosterSettings.get(QB) ?? 0) > 1;
    const {qbGrade, rbGrade, wrGrade, teGrade, tier} =
        useRosterTierAndPosGrades(isSuperFlex, rosters?.length ?? 0, roster);
    // 4 picks, 3 targets per pick
    const [rookieTargets, setRookieTargets] = useState<string[][]>([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    const [autoPopulatedDraftStrategy, setAutoPopulatedDraftStrategy] =
        useState<number[]>([0, 1]); // 0 = 1st round, 1 = 2nd round, 2 = 3rd round
    const [draftStrategy, setDraftStrategy] = useState<DraftStrategy>([
        {
            header: '2nd Round Picks',
            body: 'Draft Strategy Body',
        },
        {
            header: '3rd Round Picks',
            body: 'Draft Strategy Body',
        },
    ]);

    useEffect(() => {
        if (autoPopulatedDraftStrategy.length !== 2) {
            setDraftStrategy([
                firstRoundDraftStrategy,
                secondRoundDraftStrategy,
            ]);
            return;
        }
        const newDraftStrategy = autoPopulatedDraftStrategy.map(strategy => {
            switch (strategy) {
                case 0:
                    return firstRoundDraftStrategy;
                case 1:
                    return secondRoundDraftStrategy;
                case 2:
                    return thirdRoundDraftStrategy;
                default:
                    return {header: '', body: ''};
            }
        });
        setDraftStrategy(newDraftStrategy);
    }, [autoPopulatedDraftStrategy]);
    const {getRookieTier} = useRookieRankings(isSuperFlex);
    function resetRookieTargets(index: number) {
        setRookieTargets(oldRookieTargets => {
            const newRookieTargets = oldRookieTargets.slice();
            const dp = draftPicks[index];
            const pickNumber = getPickNumber(dp.round, dp.pick);
            const tier = getRookieTier(pickNumber);
            while (tier.length < 3) {
                tier.push('');
            }
            newRookieTargets[index] = tier;
            return newRookieTargets;
        });
    }
    const [draftCapitalScore, setDraftCapitalScore] = useState(0);
    const {pickMoves, getMove} = usePickMoves(isSuperFlex);
    function resetDraftPickVerdict(index: number) {
        if (index < 0 || index >= draftPicks.length) {
            return;
        }
        setDraftPicks(oldDraftPicks => {
            const newDraftPicks = oldDraftPicks.slice();
            const dp = draftPicks[index];
            const pickNumber = getPickNumber(dp.round, dp.pick);
            const verdict = getMove(pickNumber, tier);
            newDraftPicks[index] = {
                ...dp,
                verdict: verdict as Verdict,
            };
            return newDraftPicks;
        });
    }
    useEffect(() => {
        if (tier === RosterTier.Unknown) return;
        resetDraftPickVerdict(0);
        resetRookieTargets(0);
    }, [draftPicks[0].round, draftPicks[0].pick, pickMoves, tier]);
    useEffect(() => {
        if (tier === RosterTier.Unknown) return;
        resetDraftPickVerdict(1);
        resetRookieTargets(1);
    }, [draftPicks[1].round, draftPicks[1].pick, pickMoves, tier]);
    useEffect(() => {
        if (tier === RosterTier.Unknown) return;
        resetDraftPickVerdict(2);
        resetRookieTargets(2);
    }, [draftPicks[2].round, draftPicks[2].pick, pickMoves, tier]);
    useEffect(() => {
        if (tier === RosterTier.Unknown) return;
        resetDraftPickVerdict(3);
        resetRookieTargets(3);
    }, [draftPicks[3].round, draftPicks[3].pick, pickMoves, tier]);

    function getPickNumber(round: number | '', pick: number | '') {
        if (round === '' || pick === '') {
            return -1;
        }
        const leagueSize = rosters?.length ?? 0;
        return (round - 1) * leagueSize + pick;
    }
    useEffect(() => {
        if (!allUsers.length || !hasTeamId() || +teamId >= allUsers.length) {
            return;
        }
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) {
            return;
        }
        if (+teamId >= allUsers.length) {
            // if the teamId is out of bounds, reset it
            setTeamId('0');
        }
    }, [allUsers, teamId]);
    const [archetype, setArchetype] = useState<Archetype | ''>('');
    useEffect(() => {
        if (!leagueId || !rosters) return;
        const ownerIds = new Set(rosters.map(r => r.owner_id));
        getAllUsers(leagueId).then(users =>
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            setAllUsers(users.filter(u => ownerIds.has(u.user_id)))
        );
    }, [leagueId, rosters]);

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    return {
        leagueId,
        teamId,
        setTeamId,
        allUsers,
        specifiedUser,
        setSpecifiedUser,
        rosters,
        roster,
        outlooks,
        setOutlooks,
        draftPicks,
        setDraftPicks,
        rookieTargets,
        setRookieTargets,
        autoPopulatedDraftStrategy,
        setAutoPopulatedDraftStrategy,
        draftStrategy,
        setDraftStrategy,
        draftCapitalScore,
        setDraftCapitalScore,
        qbGrade,
        rbGrade,
        wrGrade,
        teGrade,
        archetype,
        setArchetype,
        isSuperFlex,
    };
}

export default function RookieDraft() {
    const {
        allUsers,
        specifiedUser,
        teamId,
        setTeamId,
        leagueId,
        archetype,
        setArchetype,
        outlooks,
        setOutlooks,
        draftPicks,
        setDraftPicks,
        rookieTargets,
        setRookieTargets,
        draftStrategy,
        setDraftStrategy,
        draftCapitalScore,
        setDraftCapitalScore,
        qbGrade,
        rbGrade,
        wrGrade,
        teGrade,
        autoPopulatedDraftStrategy,
        setAutoPopulatedDraftStrategy,
    } = useRookieDraft();

    return (
        <div>
            <RookieDraftInputs
                allUsers={allUsers}
                specifiedUser={specifiedUser}
                teamId={teamId}
                setTeamId={setTeamId}
                leagueId={leagueId}
                archetype={archetype}
                setArchetype={setArchetype}
                outlooks={outlooks}
                setOutlooks={setOutlooks}
                draftPicks={draftPicks}
                setDraftPicks={setDraftPicks}
                rookieTargets={rookieTargets}
                setRookieTargets={setRookieTargets}
                draftStrategy={draftStrategy}
                setDraftStrategy={setDraftStrategy}
                draftCapitalScore={draftCapitalScore}
                setDraftCapitalScore={setDraftCapitalScore}
                autoPopulatedDraftStrategy={autoPopulatedDraftStrategy}
                setAutoPopulatedDraftStrategy={setAutoPopulatedDraftStrategy}
            />
            <RookieDraftGraphic
                archetype={archetype}
                teamName={getTeamName(specifiedUser)}
                outlooks={outlooks}
                teamNeeds={getPositionalOrder({
                    qbGrade,
                    rbGrade,
                    wrGrade,
                    teGrade,
                })}
                draftPicks={draftPicks}
                rookieTargets={rookieTargets}
                draftStrategy={draftStrategy}
                draftCapitalScore={draftCapitalScore}
            />
        </div>
    );
}

type RookieDraftInputsProps = {
    allUsers?: User[];
    specifiedUser?: User;
    teamId?: string;
    setTeamId?: (value: SetStateAction<string>) => void;
    leagueId?: string;
    archetype?: Archetype | '';
    setArchetype?: (archetype: Archetype) => void;
    outlooks?: string[];
    setOutlooks?: (outlooks: string[]) => void;
    draftPicks: DraftPick[];
    setDraftPicks: (draftPicks: DraftPick[]) => void;
    rookieTargets: string[][];
    setRookieTargets: (rookieTargets: string[][]) => void;
    draftStrategy: DraftStrategy;
    setDraftStrategy: (draftStrategy: DraftStrategy) => void;
    draftCapitalScore?: number;
    setDraftCapitalScore?: (draftCapitalScore: number) => void;
    autoPopulatedDraftStrategy: number[];
    setAutoPopulatedDraftStrategy: (draftStrategy: number[]) => void;
};

export function RookieDraftInputs({
    allUsers,
    specifiedUser,
    teamId,
    setTeamId,
    leagueId,
    archetype,
    setArchetype,
    outlooks,
    setOutlooks,
    draftPicks,
    setDraftPicks,
    rookieTargets,
    setRookieTargets,
    draftStrategy,
    setDraftStrategy,
    draftCapitalScore,
    setDraftCapitalScore,
    autoPopulatedDraftStrategy,
    setAutoPopulatedDraftStrategy,
}: RookieDraftInputsProps) {
    const rounds = [...Array(5).keys()].map(x => x + 1);
    const picks = [...Array(allUsers?.length || 24).keys()].map(x => x + 1);
    const rookieOptions = Array.from(rookieMap.keys());
    return (
        <>
            {leagueId && allUsers && setTeamId && teamId !== undefined && (
                <TeamSelectComponent
                    teamId={teamId}
                    setTeamId={setTeamId}
                    allUsers={allUsers}
                    specifiedUser={specifiedUser}
                    style={{
                        margin: '4px',
                        maxWidth: '800px',
                    }}
                />
            )}
            {setArchetype && (
                <FormControl className={styles.formControlInput}>
                    <InputLabel>Archetype</InputLabel>
                    <Select
                        value={archetype}
                        label="Archetype"
                        onChange={(event: SelectChangeEvent) => {
                            setArchetype(event.target.value as Archetype);
                        }}
                    >
                        <MenuItem value={''} key={''}>
                            Choose an Archetype:
                        </MenuItem>
                        {Object.values(Archetype).map((arch, idx) => (
                            <MenuItem value={arch} key={idx}>
                                {arch}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {outlooks &&
                setOutlooks &&
                outlooks.map((_, idx) => (
                    <FormControl key={idx} className={styles.formControlInput}>
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
                            <MenuItem value={''} key={''}>
                                Choose an outlook:
                            </MenuItem>
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
            <div className={styles.draftPickInputColumn}>
                {draftPicks.map((_, idx) => (
                    <div key={idx} className={styles.draftPickInputRow}>
                        <Tooltip title="Clear Pick">
                            <IconButton
                                onClick={() => {
                                    const newDraftPicks = draftPicks.slice();
                                    newDraftPicks[idx] = {
                                        round: '',
                                        pick: '',
                                        verdict: Verdict.None,
                                    };
                                    setDraftPicks(newDraftPicks);
                                }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl
                            key={`${idx} round`}
                            style={{width: '120px'}}
                        >
                            <InputLabel>Round {idx + 1}</InputLabel>
                            <Select
                                label={`Round ${idx + 1}`}
                                value={draftPicks[idx].round.toString()}
                                onChange={(event: SelectChangeEvent) => {
                                    const newDraftPicks = draftPicks.slice();
                                    if (event.target.value === '') {
                                        newDraftPicks[idx].round = '';
                                    } else {
                                        newDraftPicks[idx].round =
                                            +event.target.value;
                                    }
                                    setDraftPicks(newDraftPicks);
                                }}
                            >
                                <MenuItem value={''} key={''}>
                                    Choose a round:
                                </MenuItem>
                                {rounds.map(round => (
                                    <MenuItem value={round} key={round}>
                                        {round}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl
                            key={`${idx} pick`}
                            style={{width: '120px'}}
                        >
                            <InputLabel>Pick {idx + 1}</InputLabel>
                            <Select
                                label={`Pick ${idx + 1}`}
                                value={draftPicks[idx].pick.toString()}
                                onChange={(event: SelectChangeEvent) => {
                                    const newDraftPicks = draftPicks.slice();
                                    if (event.target.value === '') {
                                        newDraftPicks[idx].pick = '';
                                    } else {
                                        newDraftPicks[idx].pick =
                                            +event.target.value;
                                    }
                                    setDraftPicks(newDraftPicks);
                                }}
                            >
                                <MenuItem value={''} key={''}>
                                    Choose a pick:
                                </MenuItem>
                                {picks.map(pick => (
                                    <MenuItem value={pick} key={pick}>
                                        {pick}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl
                            key={`${idx} verdict`}
                            style={{width: '140px'}}
                        >
                            <InputLabel>Verdict {idx + 1}</InputLabel>
                            <Select
                                label={`Verdict ${idx + 1}`}
                                value={draftPicks[idx].verdict}
                                onChange={(event: SelectChangeEvent) => {
                                    const newDraftPicks = draftPicks.slice();
                                    const newVerdict = event.target.value;
                                    if (
                                        newVerdict !== Verdict.Downtier &&
                                        newVerdict !== Verdict.Hold &&
                                        newVerdict !== Verdict.ProvenAsset &&
                                        newVerdict !== Verdict.ProvenVet &&
                                        newVerdict !== Verdict.Uptier
                                    ) {
                                        newDraftPicks[idx].verdict =
                                            Verdict.None;
                                    } else {
                                        newDraftPicks[idx].verdict = newVerdict;
                                    }
                                    setDraftPicks(newDraftPicks);
                                }}
                            >
                                <MenuItem value={''} key={''}>
                                    Choose a verdict:
                                </MenuItem>
                                {VERDICT_OPTIONS.filter(
                                    verdict => verdict !== Verdict.None
                                ).map(verdict => (
                                    <MenuItem value={verdict} key={verdict}>
                                        {verdict}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {[0, 1, 2].map(targetIdx => {
                            return (
                                <FormControl
                                    key={`${idx} rookie ${targetIdx}`}
                                    style={{width: '150px'}}
                                >
                                    <InputLabel>
                                        Pick {idx + 1} Target {targetIdx + 1}
                                    </InputLabel>
                                    <Select
                                        label={`Rookie ${idx + 1} Target ${
                                            targetIdx + 1
                                        }`}
                                        value={rookieTargets[idx][targetIdx]}
                                        onChange={(
                                            event: SelectChangeEvent
                                        ) => {
                                            const newRookieTargets =
                                                rookieTargets.slice();
                                            const newTarget =
                                                event.target.value;
                                            newRookieTargets[idx][targetIdx] =
                                                newTarget;
                                            setRookieTargets(newRookieTargets);
                                        }}
                                    >
                                        <MenuItem value={''} key={''}>
                                            Choose a target:
                                        </MenuItem>
                                        {rookieOptions.map(rookie => (
                                            <MenuItem
                                                value={rookie}
                                                key={rookie}
                                            >{`${rookie}`}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className={styles.draftStrategyInputs}>
                {draftStrategy.map((strategy, idx) => (
                    <div key={idx} className={styles.draftStrategyInputColumn}>
                        <FormControl key={`${idx} draft strategy Autofill`}>
                            <InputLabel>
                                Draft Strategy Autofill {idx + 1}
                            </InputLabel>
                            <Select
                                label={`Draft Strategy Autofill ${idx + 1}`}
                                value={`${autoPopulatedDraftStrategy[idx]}`}
                                onChange={(event: SelectChangeEvent) => {
                                    const newDraftStrategy =
                                        autoPopulatedDraftStrategy.slice();
                                    if (event.target.value === '') {
                                        newDraftStrategy[idx] = -1;
                                    } else {
                                        newDraftStrategy[idx] =
                                            +event.target.value;
                                    }
                                    setAutoPopulatedDraftStrategy(
                                        newDraftStrategy
                                    );
                                }}
                            >
                                <MenuItem value={''} key={''}>
                                    Choose a round draft strategy to autofill:
                                </MenuItem>
                                <MenuItem value={0} key={0}>
                                    {'1st'}
                                </MenuItem>
                                <MenuItem value={1} key={1}>
                                    {'2nd'}
                                </MenuItem>
                                <MenuItem value={2} key={2}>
                                    {'3rd'}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            value={strategy.header}
                            onChange={e => {
                                const newDraftStrategy = draftStrategy.slice();
                                newDraftStrategy[idx].header = e.target.value;
                                setDraftStrategy(newDraftStrategy);
                            }}
                            key={`${idx} header`}
                            label={`Draft Strategy Header ${idx + 1}`}
                        />
                        <TextField
                            value={strategy.body}
                            onChange={e => {
                                const newDraftStrategy = draftStrategy.slice();
                                newDraftStrategy[idx].body = e.target.value;
                                setDraftStrategy(newDraftStrategy);
                            }}
                            key={`${idx} body`}
                            label={`Draft Strategy Body ${idx + 1}`}
                        />
                    </div>
                ))}
            </div>
            {setDraftCapitalScore && (
                <div className={styles.draftCapitalScoreInput}>
                    <StyledNumberInput
                        value={draftCapitalScore}
                        label="Draft Capital Score"
                        min={0}
                        max={10}
                        step={1}
                        onChange={(_, value) => {
                            if (value === null) {
                                return;
                            }
                            setDraftCapitalScore(value);
                        }}
                        width={'140px'}
                    />
                </div>
            )}
        </>
    );
}

type RookieDraftGraphicProps = {
    archetype: Archetype | '';
    teamName: string;
    outlooks: string[];
    teamNeeds: ('QB' | 'RB' | 'WR' | 'TE')[];
    draftPicks: DraftPick[];
    rookieTargets: string[][];
    draftStrategy: DraftStrategy;
    draftCapitalScore: number;
};

export function RookieDraftGraphic({
    archetype,
    teamName,
    outlooks,
    teamNeeds,
    draftPicks,
    rookieTargets,
    draftStrategy,
    draftCapitalScore,
}: RookieDraftGraphicProps) {
    return (
        <div className={styles.rookieDraftGraphic}>
            <div className={styles.teamName}>{teamName}</div>
            {archetype && (
                <img
                    src={ARCHETYPE_TO_IMAGE.get(archetype)!}
                    className={styles.archetypeImage}
                />
            )}
            {outlooks.map((outlook, idx) => (
                <div
                    key={idx}
                    className={`${styles.outlook} ${styles[`year${idx + 1}`]}`}
                >
                    {outlook}
                </div>
            ))}
            {teamNeeds.map((pos, idx) => (
                <Fragment key={idx}>
                    <div
                        className={`${styles.teamNeed} ${
                            styles[`need${idx + 1}`]
                        }`}
                    >
                        {pos}
                    </div>
                    <div
                        className={`${styles.shadow} ${
                            styles[`shadow${idx + 1}`]
                        }`}
                    />
                </Fragment>
            ))}
            {draftPicks.map((draftPick, idx) => {
                const noPick =
                    !draftPick.round || !draftPick.pick || !draftPick.verdict;
                const pickDisplay = noPick
                    ? 'N/A'
                    : `${draftPick.round}.${
                          draftPick.pick && draftPick.pick < 10 ? '0' : ''
                      }${draftPick.pick}`;
                return (
                    <Fragment key={idx}>
                        <div
                            className={`${styles.draftPick} ${
                                styles[`draftPick${idx + 1}`]
                            }`}
                        >
                            {pickDisplay}
                        </div>
                        {!noPick && (
                            <div
                                className={`${styles.verdict} ${
                                    styles[`verdict${idx + 1}`]
                                } ${
                                    styles[
                                        draftPick.verdict
                                            .toLowerCase()
                                            .replace(' ', '')
                                    ]
                                }`}
                            >
                                {draftPick.verdict.toUpperCase()}
                            </div>
                        )}
                        <div
                            className={`${styles.target} ${
                                styles[`target${idx + 1}`]
                            }`}
                        >
                            {pickDisplay}
                        </div>
                    </Fragment>
                );
            })}
            {[0, 1, 2, 3].map(idx => {
                const numTargets = rookieTargets[idx].filter(
                    target => target !== ''
                ).length;
                return (
                    <div
                        key={`${idx} line`}
                        className={`${styles.line} ${
                            styles[`line${idx + 1}`]
                        } ${
                            numTargets === 2
                                ? styles.shorterLine
                                : numTargets <= 1
                                ? styles.shortestLine
                                : ''
                        }`}
                    />
                );
            })}
            {rookieTargets.map((pick, pickIdx) =>
                pick.map(
                    (target, targetIdx) =>
                        target &&
                        rookieMap.get(target) && (
                            <img
                                key={`${pickIdx} ${targetIdx}`}
                                className={`${styles.rookieTarget} ${
                                    styles[`rookieTarget${pickIdx + 1}`]
                                } ${
                                    styles[
                                        `rookieTargetRow${
                                            pickIdx < 2
                                                ? targetIdx + 1
                                                : targetIdx + 4
                                        }`
                                    ]
                                }`}
                                src={rookieMap.get(target)}
                            />
                        )
                )
            )}
            {draftStrategy.map((strategy, idx) => (
                <Fragment key={`${idx} draft strategy`}>
                    <div
                        className={`${styles.draftStrategyHeader} ${
                            styles[`draftStrategyHeader${idx + 1}`]
                        }`}
                    >
                        {strategy.header}
                    </div>
                    <div
                        className={`${styles.draftStrategyBody} ${
                            styles[`draftStrategyBody${idx + 1}`]
                        }`}
                    >
                        {strategy.body}
                    </div>
                </Fragment>
            ))}
            <div className={styles.draftCapitalScore}>
                {draftCapitalScore}/10
            </div>
            <div>
                <div className={styles.draftCapitalScaleBg} />
                <img
                    src={horizontalScale}
                    className={styles.draftCapitalScale}
                    style={{
                        width: `${(650 * draftCapitalScore) / 10}px`,
                    }}
                />
                <div
                    className={styles.draftCapitalSlider}
                    style={{
                        width: `${(650 * draftCapitalScore) / 10}px`,
                    }}
                />
            </div>
            <img src={blankRookie} />
        </div>
    );
}
