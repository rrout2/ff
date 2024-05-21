import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useFetchUsers,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../hooks/hooks';
import {League, Roster, getLeague} from '../../sleeper-api/sleeper-api';
import styles from './Blueprint.module.css';
import {teamSelectComponent} from '../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../consts/urlParams';
import PlayerPreview from '../Player/PlayerPreview/PlayerPreview';
export default function Blueprint() {
    const [leagueId] = useLeagueIdFromUrl();
    const [league, setLeague] = useState<League>();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const {data: allUsers} = useFetchUsers(rosters);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const specifiedUser = allUsers?.[+teamId];
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
    }, [leagueId]);

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setRoster(rosters[+teamId]);
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

    function rosterComponent() {
        if (!hasTeamId()) return <></>;
        if (!playerData || !roster) return <>Loading...</>;
        return roster.players
            .map(p => playerData[p])
            .sort((a, b) => {
                const posComp = a.position.localeCompare(b.position);
                if (posComp) return posComp;
                return (
                    a.search_rank - b.search_rank ||
                    a.search_last_name.localeCompare(b.search_last_name)
                );
            })
            .map(player => (
                <PlayerPreview
                    player={player}
                    leagueId={leagueId}
                    clickable={false}
                />
            ));
    }

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function rosterSettingsComponent() {
        const wrtFlex = rosterSettings.get('FLEX') ?? 0;
        const wrFlex = rosterSettings.get('WRRB_FLEX') ?? 0;
        const wtFlex = rosterSettings.get('REC_FLEX') ?? 0;
        const totalFlexes = wrtFlex + wrFlex + wtFlex;
        const allowSet = new Set([
            'QB',
            'RB',
            'WR',
            'TE',
            'SUPER_FLEX',
            'FLEX',
            'BN',
        ]);
        return (
            <>
                {Array.from(rosterSettings)
                    .filter(([position]) => allowSet.has(position))
                    .map(([position, count]) => {
                        if (position !== 'FLEX') {
                            return (
                                <div
                                    key={position}
                                >{`${count} ${position}`}</div>
                            );
                        }
                        return (
                            <div key={'FLEX'}>
                                <div key={'FLEX'}>
                                    {totalFlexes} {position}
                                </div>
                                <div className={styles.subflex}>
                                    <div>{wrtFlex} W/R/T</div>
                                    <div>{wrFlex} W/R</div>
                                    <div>{wtFlex} W/T</div>
                                </div>
                            </div>
                        );
                    })}
            </>
        );
    }

    function otherSettingsComponent() {
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings || !rosters) return <></>;
        return (
            <div className={styles.otherSettings}>
                <div>{rosters.length} team league</div>
                <div>
                    Superflex: {rosterSettings.has('SUPER_FLEX').toString()}
                </div>
                <div>PPR: {scoringSettings.rec ?? 0}</div>
                <div className={styles.subflex}>
                    <div>RB Bonus: {scoringSettings.bonus_rec_rb ?? 0}</div>
                    <div>WR Bonus: {scoringSettings.bonus_rec_wr ?? 0}</div>
                    <div>TE Bonus: {scoringSettings.bonus_rec_te}</div>
                </div>

                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>
        );
    }

    return (
        <>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser)}
            {rosterSettingsComponent()}
            {otherSettingsComponent()}
            {rosterComponent()}
        </>
    );
}
