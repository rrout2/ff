import {useRef} from 'react';
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
import {
    useLeague,
    useLeagueIdFromUrl,
    usePlayerData,
    useRosterSettings,
} from '../../../../../hooks/hooks';
import styles from './Settings.module.css';
export function useSettings(
    numRosters: number,
    graphicComponentClass?: string
) {
    const [leagueId] = useLeagueIdFromUrl();
    const league = useLeague(leagueId);
    const playerData = usePlayerData();
    const rosterSettings = useRosterSettings(league);
    const componentRef = useRef(null);
    function graphicComponent() {
        if (!playerData) return <></>;
        const scoringSettings = league?.scoring_settings;
        if (!scoringSettings) return <></>;
        const wrtFlex = rosterSettings.get(FLEX) ?? 0;
        const wrFlex = rosterSettings.get(WR_RB_FLEX) ?? 0;
        const wtFlex = rosterSettings.get(WR_TE_FLEX) ?? 0;
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                }`}
                ref={componentRef}
            >
                <div className={styles.row}>
                    <div className={`${styles.chip} ${styles.red}`}>
                        QB: {rosterSettings.get(QB)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        RB: {rosterSettings.get(RB)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        WR: {rosterSettings.get(WR)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        TE: {rosterSettings.get(TE)}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        FLEX: {wrtFlex + wrFlex + wtFlex}
                    </div>
                    <div className={`${styles.chip} ${styles.red}`}>
                        BN: {rosterSettings.get(BENCH)}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TEAMS: {numRosters}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        SF: {rosterSettings.has(SUPER_FLEX) ? 'YES' : 'NO'}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        PPR: {scoringSettings.rec ?? 0}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TEP: {scoringSettings.bonus_rec_te ?? 0}
                    </div>
                    <div className={`${styles.chip} ${styles.blue}`}>
                        TAXI: {league.settings.taxi_slots}
                    </div>
                </div>
            </div>
        );
    }
    return {graphicComponent: graphicComponent()};
}
