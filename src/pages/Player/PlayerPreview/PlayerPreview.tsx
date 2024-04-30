import {LEAGUE_ID, PLAYER_ID} from '../../../consts/urlParams';
import {useNavigate} from 'react-router-dom';
import {Player} from '../../../sleeper-api/sleeper-api';
import styles from './PlayerPreview.module.css';
export type PlayerPreviewProps = {
    player: Player;
    leagueId: string;
};

export default function PlayerPreview({player, leagueId}: PlayerPreviewProps) {
    const navigate = useNavigate();
    return (
        <div
            key={player.player_id}
            className={styles.playerRow + ' ' + styles[player.position]}
            onClick={() => {
                navigate(
                    `../player?${PLAYER_ID}=${player.player_id}&${LEAGUE_ID}=${leagueId}`
                );
            }}
        >
            <img
                className={styles.headshot}
                src={`https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`}
                onError={({currentTarget}) => {
                    currentTarget.onerror = null;
                    currentTarget.src =
                        'https://sleepercdn.com/images/v2/icons/player_default.webp';
                }}
            />
            {player.position} {player.first_name} {player.last_name}
        </div>
    );
}
