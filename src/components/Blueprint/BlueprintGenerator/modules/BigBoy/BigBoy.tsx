import {useEffect, useState} from 'react';
import {blankblueprint} from '../../../../../consts/images';
import {
    useLeagueIdFromUrl,
    useFetchRosters,
    usePlayerData,
    useTeamIdFromUrl,
    useAdpData,
    useLeague,
    useRosterSettings,
} from '../../../../../hooks/hooks';
import {
    Roster,
    User,
    getAllUsers,
} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import {useStarters} from '../Starters/useStarters';
import {useSettings} from '../settings/useSettings';
import styles from './BigBoy.module.css';
import {NONE_TEAM_ID} from '../../../../../consts/urlParams';
import {useCornerstone} from '../cornerstone/useCornerstone';
import {useDepthScore} from '../DepthScore/useDepthScore';
import {usePlayersToTarget} from '../playerstotarget/usePlayersToTarget';
import {usePositionalGrades} from '../PositionalGrades/usePositionalGrades';
import {useLookToTrade} from '../looktotrade/useLookToTrade';
import {FormControlLabel, FormGroup, Grid, Switch} from '@mui/material';
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
} from '../../../../../consts/fantasy';

export default function BigBoy() {
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const rosterSettings = useRosterSettings(league);
    const {sortByAdp} = useAdpData();
    const [teamId] = useTeamIdFromUrl();
    const {data: rosters} = useFetchRosters(leagueId);
    const playerData = usePlayerData();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [roster, setRoster] = useState<Roster>();
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [showPreview, setShowPreview] = useState(false);

    const teamName =
        specifiedUser?.metadata?.team_name ?? specifiedUser?.display_name;

    const {graphicComponent: settingsGraphic} = useSettings(
        rosters?.length ?? 0,
        undefined,
        true
    );
    const {graphicComponent: startersGraphic} = useStarters(
        roster,
        undefined,
        true
    );

    const {graphicComponent: cornerstoneGraphic, allPositionalSelectors} =
        useCornerstone(roster, undefined, true);

    const {
        graphicComponent: depthScoreGraphic,
        overrideComponent: depthScoreOverride,
    } = useDepthScore(roster, undefined, true);

    const {
        graphicComponent: playersToTargetGraphic,
        inputComponent: playersToTargetInput,
    } = usePlayersToTarget(undefined, true);

    const {
        graphicComponent: positionalGradesGraphic,
        overrideComponent: positionalGradesOverride,
    } = usePositionalGrades(roster, undefined, true);

    const {
        graphicComponent: lookToTradeGraphic,
        inputComponent: lookToTradeInput,
    } = useLookToTrade(roster, undefined, true);

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
        function getRosterFromTeamIdx(idx: number) {
            if (allUsers.length === 0 || !rosters) return;
            const ownerId = allUsers[idx].user_id;
            return rosters.find(r => r.owner_id === ownerId);
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
    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) return;
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
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
                <img src={blankblueprint} className={styles.base} />;
            </div>
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

    function settingsGraphicComponent() {
        return <div className={styles.settingsGraphic}>{settingsGraphic}</div>;
    }

    function startersGraphicComponent() {
        return <div className={styles.startersGraphic}>{startersGraphic}</div>;
    }

    function cornerstoneGraphicComponent() {
        return (
            <div className={styles.cornerstoneGraphic}>
                {cornerstoneGraphic}
            </div>
        );
    }

    function depthScoreGraphicComponent() {
        return (
            <div className={styles.depthScoreGraphic}>{depthScoreGraphic}</div>
        );
    }

    function playersToTargetGraphicComponent() {
        return (
            <div className={styles.playersToTargetGraphic}>
                {playersToTargetGraphic}
            </div>
        );
    }

    function positionalGradesGraphicComponent() {
        return (
            <div className={styles.positionalGradesGraphic}>
                {positionalGradesGraphic}
            </div>
        );
    }

    function lookToTradeGraphicComponent() {
        return (
            <div className={styles.lookToTradeGraphic}>
                {lookToTradeGraphic}
            </div>
        );
    }

    function teamNameComponent() {
        return <div className={styles.teamNameGraphic}>{teamName}</div>;
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

    function inputsComponent() {
        return (
            <>
                <Grid container spacing={1} className={styles.inputGrid}>
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
                {togglePreview()}
            </>
        );
    }

    return (
        <div className={styles.BigBoy}>
            <ExportButton
                className={styles.fullBlueprint}
                pngName={`${teamName}_blueprint.png`}
                label="Download Blueprint"
            />
            {inputsComponent()}
            <div className={!showPreview ? styles.offScreen : ''}>
                {fullBlueprint()}
            </div>
        </div>
    );
}
