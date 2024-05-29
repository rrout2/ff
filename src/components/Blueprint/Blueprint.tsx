import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useLeagueIdFromUrl,
    usePlayerData,
    useProjectedLineup,
} from '../../hooks/hooks';
import {
    League,
    Roster,
    User,
    getAllUsers,
    getLeague,
} from '../../sleeper-api/sleeper-api';
import styles from './Blueprint.module.css';
import {teamSelectComponent} from '../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../consts/urlParams';
import {IconButton} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';
import {
    BENCH,
    FLEX,
    FLEX_SET,
    SUPER_FLEX,
    SUPER_FLEX_SET,
    WR_RB_FLEX,
    WR_TE_FLEX,
} from '../../consts/fantasy';
export default function Blueprint() {
    const [leagueId] = useLeagueIdFromUrl();
    const [league, setLeague] = useState<League>();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const specifiedUser = allUsers?.[+teamId];
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );

    const [startingLineup, _, benchString] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );

    function getRosterFromTeamIdx(idx: number) {
        if (allUsers.length === 0 || !rosters) return;
        const ownerId = allUsers[idx].user_id;
        return rosters.find(r => r.owner_id === ownerId);
    }

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
        getAllUsers(leagueId).then(users => setAllUsers(users));
    }, [leagueId]);

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');
        setRoster(newRoster);
    }, [rosters, teamId]);

    useEffect(() => {
        const settings = new Map<string, number>();
        league?.roster_positions.forEach(pos => {
            if (!settings.has(pos)) {
                settings.set(pos, 0);
            }
            settings.set(pos, settings.get(pos)! + 1);
        });
        setRosterSettings(settings);
    }, [league?.roster_positions]);

    function humanReadablePosition(position: string) {
        switch (position) {
            case FLEX:
                return 'WR/RB/TE';
            case WR_RB_FLEX:
                return 'WR/RB';
            case WR_TE_FLEX:
                return 'WR/TE';
            case SUPER_FLEX:
                return 'QB/WR/RB/TE';
        }
        return position;
    }

    function rosterComponent() {
        if (!hasTeamId() || !playerData || !roster) return <></>;
        return (
            <>
                <div>
                    <h3>Projected Starters: </h3>
                    {startingLineup.map(({player, position}) => {
                        const starterString =
                            `${player.first_name} ${player.last_name}`.toLocaleUpperCase();
                        const posTeamString = `${player.position} - ${player.team}`;
                        return (
                            <div className={styles.playerRow}>
                                <div className={styles.column}>
                                    {humanReadablePosition(position)}
                                </div>
                                {copyWrapper(starterString, styles.column)}
                                {copyWrapper(posTeamString, styles.column)}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.bench}>
                    <h3>Bench: </h3>
                    {copyWrapper(benchString)}
                </div>
            </>
        );
    }

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function rosterSettingsComponent() {
        const wrtFlex = rosterSettings.get(FLEX) ?? 0;
        const wrFlex = rosterSettings.get(WR_RB_FLEX) ?? 0;
        const wtFlex = rosterSettings.get(WR_TE_FLEX) ?? 0;

        const rosterSettingsArray = Array.from(rosterSettings);
        const hasFlexes =
            rosterSettingsArray.filter(([position]) => FLEX_SET.has(position))
                .length > 0;
        const hasBench = !!rosterSettings.get(BENCH);
        return (
            <div className={styles.rosterSettings}>
                <h3>League Settings: </h3>

                {rosterSettingsArray
                    .filter(([position]) => SUPER_FLEX_SET.has(position))
                    .map(([position, count]) => (
                        <div key={position}>{`${count} ${position}`}</div>
                    ))}

                {hasFlexes && (
                    <div key={FLEX}>
                        <div key={FLEX}>{wrtFlex + wrFlex + wtFlex} FLEX</div>
                        <div className={styles.indented}>
                            <div>{wrtFlex} W/R/T</div>
                            <div>{wrFlex} W/R</div>
                            <div>{wtFlex} W/T</div>
                        </div>
                    </div>
                )}

                {hasBench && (
                    <div key={BENCH}>{rosterSettings.get(BENCH)} BN</div>
                )}
            </div>
        );
    }

    function otherSettingsComponent() {
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings || !rosters) return <></>;
        return (
            <div className={styles.otherSettings}>
                <div>{rosters.length} team league</div>
                <div>SF: {rosterSettings.has(SUPER_FLEX) ? 'YES' : 'NO'}</div>
                <div>PPR: {scoringSettings.rec ?? 0}</div>
                <div className={styles.indented}>
                    <div>RB Bonus: {scoringSettings.bonus_rec_rb ?? 0}</div>
                    <div>WR Bonus: {scoringSettings.bonus_rec_wr ?? 0}</div>
                    <div>TE Bonus: {scoringSettings.bonus_rec_te ?? 0}</div>
                </div>

                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>
        );
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser)}
            {rosterSettingsComponent()}
            {otherSettingsComponent()}
            {rosterComponent()}
        </div>
    );
}

function copyWrapper(text: string, className?: string) {
    return (
        <div className={styles.copyWrapper + (` ${className}` ?? '')}>
            <IconButton
                onClick={() => navigator.clipboard.writeText(text)}
                size="small"
            >
                <ContentCopy />
            </IconButton>
            {text}
        </div>
    );
}
