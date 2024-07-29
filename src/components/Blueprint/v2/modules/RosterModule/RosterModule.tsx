import {COLORS} from '../../../../../consts/colors';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './RosterModule.module.css';

export default function RosterModule({roster}: {roster: Roster}) {
    const playerData = usePlayerData();
    const {sortByAdp, getAdp, getPositionalAdp} = useAdpData();

    if (!playerData) return <></>;
    const allPlayers = roster.players
        .map(playerId => playerData[playerId])
        .sort(sortByAdp);
    return (
        <div className={styles.fullRoster}>
            {FANTASY_POSITIONS.map(pos => (
                <div className={styles.positionColumn}>
                    <div
                        className={styles.positionHeader}
                        style={{
                            color: COLORS.get(pos),
                        }}
                    >
                        <div>{pos}</div>
                        <div className={styles.postionalRank}>4TH / 12</div>
                    </div>
                    {allPlayers
                        .filter(player => !!player && player.position === pos)
                        .map(player => {
                            const fullName = `${player.first_name} ${player.last_name}`;
                            const positionalAdp = getPositionalAdp(fullName);
                            return (
                                <div className={styles.rosterPlayer}>
                                    <div>{fullName.toUpperCase()}</div>
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
