import React from 'react';
import styles from './PlayerBar.module.css';
import {usePlayerData} from '../../../../hooks/hooks';
import {logoImage} from '../../shared/Utilities';
import {nflSilhouette} from '../../../../consts/images';
const NONE_PLAYER_ID = 'None';

interface PlayerTargetProps {
    playerId: string;
}
export default function PlayerBar({playerId}: PlayerTargetProps) {
    const playerData = usePlayerData();
    if (!playerData) {
        return <></>;
    }
    const player = playerData[playerId];
    const pos = player.position;
    const fullName = `${player.first_name} ${player.last_name}`;
    const longNameLimit = 15;

    const displayName =
        fullName.length >= longNameLimit
            ? `${player.first_name[0]}. ${player.last_name}`
            : fullName;
    return (
        <div className={styles.playerBar}>
            <img
                src={
                    player.player_id === NONE_PLAYER_ID
                        ? nflSilhouette
                        : `https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`
                }
                onError={({currentTarget}) => {
                    currentTarget.onerror = null;
                    currentTarget.src =
                        'https://sleepercdn.com/images/v2/icons/player_default.webp';
                }}
                className={styles.headshot}
            />
            <div className={styles.playerInfo}>
                <div className={styles.name}>{displayName}</div>
                <div className={styles.positionAndTeam}>
                    <div className={`${styles.positionChip} ${styles[pos]}`}>
                        {pos}
                    </div>
                    <div className={styles.team}>
                        {mapCityAbbreviationToFullName(player.team)}
                    </div>
                </div>
            </div>
            {logoImage(player.team, styles.teamLogo)}
        </div>
    );
}

function mapCityAbbreviationToFullName(cityAbbreviation: string): string {
    switch (cityAbbreviation.toUpperCase()) {
        case 'ARI':
            return 'ARIZONA';
        case 'ATL':
            return 'ATLANTA';
        case 'BAL':
            return 'BALTIMORE';
        case 'BUF':
            return 'BUFFALO';
        case 'CAR':
            return 'CAROLINA';
        case 'CHI':
            return 'CHICAGO';
        case 'CIN':
            return 'CINCINNATI';
        case 'CLE':
            return 'CLEVELAND';
        case 'DAL':
            return 'DALLAS';
        case 'DEN':
            return 'DENVER';
        case 'DET':
            return 'DETROIT';
        case 'GB':
            return 'GREEN BAY';
        case 'HOU':
            return 'HOUSTON';
        case 'IND':
            return 'INDIANAPOLIS';
        case 'JAC':
        case 'JAX':
            return 'JACKSONVILLE';
        case 'KC':
            return 'KANSAS CITY';
        case 'LAC':
            return 'LA CHARGERS';
        case 'LAR':
            return 'LA RAMS';
        case 'MIA':
            return 'MIAMI';
        case 'MIN':
            return 'MINNESOTA';
        case 'NE':
            return 'NEW ENGLAND';
        case 'NO':
            return 'NEW ORLEANS';
        case 'NYG':
            return 'NY GIANTS';
        case 'NYJ':
            return 'NY JETS';
        case 'PHI':
            return 'PHILADELPHIA';
        case 'PIT':
            return 'PITTSBURGH';
        case 'LV':
            return 'LAS VEGAS';
        case 'SF':
            return 'SAN FRANCISCO';
        case 'SEA':
            return 'SEATTLE';
        case 'TB':
            return 'TAMPA BAY';
        case 'TEN':
            return 'TENNESSEE';
        case 'WSH':
        case 'WAS':
            return 'WASHINGTON';
        default:
            return cityAbbreviation.toUpperCase();
    }
}
