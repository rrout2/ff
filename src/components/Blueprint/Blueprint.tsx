import {useEffect, useState} from 'react';
import {useLeagueIdFromUrl} from '../../hooks/hooks';
import {
    League,
    Roster,
    getLeague,
    getRosters,
} from '../../sleeper-api/sleeper-api';
import styles from './Blueprint.module.css';
export default function Blueprint() {
    const [leagueId] = useLeagueIdFromUrl();
    const [league, setLeague] = useState<League>();
    const [rosters, setRosters] = useState<Roster[]>([]);
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
        getRosters(leagueId).then(rosters => setRosters(rosters));
    }, [leagueId]);

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

    function rosterSettingsComponent() {
        return (
            <>
                {Array.from(rosterSettings).map(([position, count]) => {
                    return <div key={position}>{`${count} ${position}`}</div>;
                })}
            </>
        );
    }

    function otherSettingsComponent() {
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings) return <></>;
        return (
            <div className={styles.otherSettings}>
                <div>{rosters.length} team league</div>
                <div>
                    Superflex: {rosterSettings.has('SUPER_FLEX').toString()}
                </div>
                <div>PPR: {scoringSettings.rec}</div>
                <div>WR Bonus: {scoringSettings.bonus_rec_wr ?? 0}</div>
                <div>RB Bonus: {scoringSettings.bonus_rec_rb ?? 0}</div>
                <div>TE Bonus: {scoringSettings.bonus_rec_te}</div>
                <div>Taxi #: {league.settings.taxi_slots}</div>
            </div>
        );
    }

    return (
        <>
            {rosterSettingsComponent()}
            {otherSettingsComponent()}
        </>
    );
}
