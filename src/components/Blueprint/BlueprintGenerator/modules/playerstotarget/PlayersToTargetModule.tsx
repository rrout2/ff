import {useRef} from 'react';
import {usePlayerData, useTitle} from '../../../../../hooks/hooks';
import styles from './PlayersToTargetModule.module.css';
import ExportButton from '../../shared/ExportButton';

enum NFLTeam {
    ARI = 'ARI',
    ATL = 'ATL',
    BAL = 'BAL',
    BUF = 'BUF',
    CAR = 'CAR',
    CHI = 'CHI',
    CIN = 'CIN',
    CLE = 'CLE',
    DAL = 'DAL',
    DEN = 'DEN',
    DET = 'DET',
    GB = 'GB',
    HOU = 'HOU',
    IND = 'IND',
    JAX = 'JAX',
    KC = 'KC',
    LAC = 'LAC',
    LAR = 'LAR',
    LV = 'LV',
    MIA = 'MIA',
    MIN = 'MIN',
    NE = 'NE',
    NO = 'NO',
    NYG = 'NYG',
    NYJ = 'NYJ',
    PHI = 'PHI',
    PIT = 'PIT',
    SF = 'SF',
    SEA = 'SEA',
    TB = 'TB',
    TEN = 'TEN',
    WAS = 'WAS',
}

export default function PlayersToTargetModule() {
    const playerData = usePlayerData();
    const componentRef = useRef(null);

    useTitle('Players to Target - Blueprint Generator');

    function logoImage(team: NFLTeam) {
        return (
            <img
                src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${team}.png`}
                className={styles.teamLogo}
            />
        );
    }

    function playerTarget(pos: string, name: string, team: NFLTeam) {
        return (
            <div key={name}>
                <div className={styles.playerTargetBody}>
                    <div className={`${styles.positionChip} ${styles[pos]}`}>
                        {pos}
                    </div>
                    {logoImage(team)}
                    <div className={styles.targetName}>{name}</div>
                </div>
                <div className={styles.subtitle}>{`${pos} - ${team}`}</div>
            </div>
        );
    }

    function graphicComponent() {
        if (!playerData) return <></>;
        return (
            <div className={styles.graphicComponent} ref={componentRef}>
                {playerTarget('WR', 'Jayden Reed', NFLTeam.GB)}
                {playerTarget('WR', 'Rashee Rice', NFLTeam.KC)}
                {playerTarget('WR', 'Xavier Legette', NFLTeam.CAR)}
                {playerTarget('TE', 'Sam LaPorta', NFLTeam.DET)}
            </div>
        );
    }

    return (
        <>
            {graphicComponent()}
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={'looktotrade.png'}
                />
            }
        </>
    );
}
