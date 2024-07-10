import {useEffect, useState} from 'react';
import {
    useAdpData,
    useFetchRosters,
    useLeague,
    useLeagueIdFromUrl,
    useModuleFromUrl,
    usePlayerData,
    useRosterSettings,
    useTeamIdFromUrl,
    useTitle,
} from '../../../hooks/hooks';
import {Roster, User, getAllUsers} from '../../../sleeper-api/sleeper-api';
import styles from './BlueprintGenerator.module.css';
import {teamSelectComponent} from '../../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../../consts/urlParams';
import CornerstoneModule from './modules/cornerstone/CornerstoneModule';
import {
    InputLabel,
    SelectChangeEvent,
    FormControl,
    MenuItem,
    Select,
    Grid,
} from '@mui/material';
import LookToTradeModule from './modules/looktotrade/LookToTradeModule';
import PlayersToTargetModule from './modules/playerstotarget/PlayersToTargetModule';
import Settings from './modules/settings/Settings';
import Starters from './modules/Starters/Starters';
import PositionalGrades from './modules/PositionalGrades/PositionalGrades';
import DepthScore from './modules/DepthScore/DepthScore';
import ExportButton from './shared/ExportButton';
import {useCornerstone} from './modules/cornerstone/useCornerstone';
import {useLookToTrade} from './modules/looktotrade/useLookToTrade';
import {usePlayersToTarget} from './modules/playerstotarget/usePlayersToTarget';
import {useSettings} from './modules/settings/useSettings';
import {useStarters} from './modules/Starters/useStarters';
import {usePositionalGrades} from './modules/PositionalGrades/usePositionalGrades';
import {useDepthScore} from './modules/DepthScore/useDepthScore';
import {
    QB,
    RB,
    WR,
    TE,
    BENCH,
    FLEX,
    WR_RB_FLEX,
    WR_TE_FLEX,
    SUPER_FLEX,
} from '../../../consts/fantasy';
import BigBoy from './modules/BigBoy/BigBoy';

export enum Module {
    Unspecified = '',
    Cornerstone = 'cornerstones',
    LookToTrade = 'looktotrade',
    PlayersToTarget = 'playerstotarget',
    Settings = 'settings',
    Starters = 'starters',
    PositionalGrades = 'positionalgrades',
    DepthScore = 'depthscore',
    Unified = 'unified',
    BigBoy = 'bigboy',
}

export default function BlueprintGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useTeamIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [roster, setRoster] = useState<Roster>();
    const league = useLeague(leagueId);
    const playerData = usePlayerData();
    const rosterSettings = useRosterSettings(league);
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [module, setModule] = useModuleFromUrl();
    const {graphicComponent: cornerstoneGraphic, allPositionalSelectors} =
        useCornerstone(roster, 'cornerstoneGraphic');
    const {
        graphicComponent: lookToTradeGraphic,
        inputComponent: lookToTradeInput,
    } = useLookToTrade(roster, 'lookToTradeGraphic');
    const {
        graphicComponent: playersToTargetGraphic,
        inputComponent: playersToTargetInput,
    } = usePlayersToTarget('playersToTargetGraphic');
    const {graphicComponent: settingsGraphic} = useSettings(
        rosters?.length ?? 0,
        'settingsGraphic'
    );
    const {graphicComponent: startersGraphic} = useStarters(
        roster,
        'startersGraphic'
    );
    const {
        graphicComponent: depthScoreGraphic,
        overrideComponent: depthScoreOverride,
    } = useDepthScore(roster, 'depthScoreGraphic');
    const {
        graphicComponent: positionalGradesGraphic,
        overrideComponent: positionalGradesOverride,
    } = usePositionalGrades(roster, 'positionalGradesGraphic');
    const {sortByAdp} = useAdpData();

    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) return;
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    function getRosterFromTeamIdx(idx: number) {
        if (allUsers.length === 0 || !rosters) return;
        const ownerId = allUsers[idx].user_id;
        return rosters.find(r => r.owner_id === ownerId);
    }

    useEffect(() => {
        if (
            !rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !playerData ||
            allUsers.length === 0
        ) {
            return;
        }

        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');

        setRoster(newRoster);
    }, [rosters, teamId, playerData, allUsers]);

    useEffect(() => {
        if (!leagueId || !rosters) return;
        const ownerIds = new Set(rosters.map(r => r.owner_id));
        getAllUsers(leagueId).then(users =>
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            setAllUsers(users.filter(u => ownerIds.has(u.user_id)))
        );
    }, [leagueId, rosters]);

    useTitle('Blueprint Generator');

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function moduleSelectComponent() {
        return (
            <FormControl
                style={{
                    margin: '4px',
                }}
            >
                <InputLabel>Module</InputLabel>
                <Select
                    value={module}
                    label="Module"
                    onChange={(event: SelectChangeEvent) => {
                        setModule(event.target.value as Module);
                    }}
                >
                    <MenuItem value={''} key={'chooseamodule'}>
                        Choose a module:
                    </MenuItem>
                    <MenuItem value={Module.Unified} key={'unified'}>
                        Unified
                    </MenuItem>
                    <MenuItem value={Module.BigBoy} key={'bigboy'}>
                        Big Boy
                    </MenuItem>
                    <MenuItem value={Module.Cornerstone} key={'cornerstones'}>
                        Cornerstones
                    </MenuItem>
                    <MenuItem value={Module.LookToTrade} key={'looktotrade'}>
                        Look to Trade
                    </MenuItem>
                    <MenuItem
                        value={Module.PlayersToTarget}
                        key={'playerstotarget'}
                    >
                        Players to Target
                    </MenuItem>
                    <MenuItem value={Module.Settings} key={'settings'}>
                        Settings
                    </MenuItem>
                    <MenuItem value={Module.Starters} key={'starters'}>
                        Starters
                    </MenuItem>
                    <MenuItem
                        value={Module.PositionalGrades}
                        key={'positionalgrades'}
                    >
                        Positional Grades
                    </MenuItem>
                    <MenuItem value={Module.DepthScore} key={'depthscore'}>
                        Depth Score
                    </MenuItem>
                </Select>
            </FormControl>
        );
    }

    function rosterComponent() {
        if (!playerData) return <></>;
        return roster?.players
            .map(playerId => playerData[playerId])
            .filter(player => !!player)
            .sort(sortByAdp)
            .map(player => {
                return (
                    <div>{`${player.position} - ${player.first_name} ${player.last_name}`}</div>
                );
            });
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
            </div>
        );
    }

    const teamName =
        specifiedUser?.metadata?.team_name ?? specifiedUser?.display_name;

    function unifiedView() {
        const hasId = hasTeamId();
        if (!hasId) return <></>;
        return (
            <div className={styles.allModules}>
                <div className={styles.offScreen}>
                    {cornerstoneGraphic}
                    {lookToTradeGraphic}
                    {playersToTargetGraphic}
                    {settingsGraphic}
                    {startersGraphic}
                    {positionalGradesGraphic}
                    {depthScoreGraphic}
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <div className={styles.inputModule}>
                            Cornerstones:
                            {allPositionalSelectors}
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className={styles.inputModule}>
                            Players to Target:
                            {playersToTargetInput}
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className={styles.inputModule}>
                            Positional Grade Override:
                            {positionalGradesOverride}
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={styles.inputModule}>
                            Look to Trade:
                            {lookToTradeInput}
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div className={styles.inputModule}>
                            Depth Score Override:
                            {depthScoreOverride}
                        </div>
                    </Grid>
                    <Grid item xs={4} className={styles.extraInfo}>
                        <div>{rosterComponent()}</div>
                        <div style={{textAlign: 'end'}}>
                            {settingsComponent()}
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser, {
                margin: '4px',
            })}
            {hasTeamId() && moduleSelectComponent()}
            {module === Module.Unified && (
                <ExportButton
                    className={[
                        'cornerstoneGraphic',
                        'lookToTradeGraphic',
                        'playersToTargetGraphic',
                        'settingsGraphic',
                        'startersGraphic',
                        'positionalGradesGraphic',
                        'depthScoreGraphic',
                    ]}
                    zipName={teamName}
                />
            )}
            {module === Module.Unified && unifiedView()}
            {hasTeamId() && module === Module.Cornerstone && (
                <CornerstoneModule roster={roster} teamName={teamName} />
            )}
            {hasTeamId() && module === Module.LookToTrade && (
                <LookToTradeModule roster={roster} teamName={teamName} />
            )}
            {hasTeamId() && module === Module.PlayersToTarget && (
                <PlayersToTargetModule teamName={teamName} />
            )}
            {hasTeamId() && module === Module.Settings && (
                <Settings
                    roster={roster}
                    leagueId={leagueId}
                    numRosters={rosters?.length ?? 0}
                    teamName={teamName}
                />
            )}
            {hasTeamId() && module === Module.Starters && (
                <Starters roster={roster} teamName={teamName} />
            )}
            {hasTeamId() && module === Module.PositionalGrades && (
                <PositionalGrades roster={roster} teamName={teamName} />
            )}
            {hasTeamId() && module === Module.DepthScore && (
                <DepthScore roster={roster} teamName={teamName} />
            )}
            {hasTeamId() && module === Module.BigBoy && <BigBoy />}
        </div>
    );
}
