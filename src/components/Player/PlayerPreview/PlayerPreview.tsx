import {LEAGUE_ID, PLAYER_ID} from '../../../consts/urlParams';
import {useNavigate} from 'react-router-dom';
import {Player} from '../../../sleeper-api/sleeper-api';
import styles from './PlayerPreview.module.css';
export type PlayerPreviewProps = {
    player: Player;
    leagueId: string;
    hideHeadshot?: boolean;
    clickable?: boolean;
};

export default function PlayerPreview({
    player,
    leagueId,
    hideHeadshot,
    clickable = true,
}: PlayerPreviewProps) {
    const navigate = useNavigate();

    const playerPath = `../player?${PLAYER_ID}=${player.player_id}&${LEAGUE_ID}=${leagueId}`;

    return (
        <div
            key={player.player_id}
            className={
                styles.playerRow +
                ' ' +
                styles[player.position] +
                (clickable ? ` ${styles.clickable}` : '')
            }
            onClick={
                clickable
                    ? () => {
                          navigate(playerPath);
                      }
                    : undefined
            }
            onKeyUp={event => {
                if (event.key !== 'Enter') return;
                navigate(playerPath);
            }}
            tabIndex={0}
        >
            {!hideHeadshot && (
                <img
                    className={styles.headshot}
                    src={`https://sleepercdn.com/content/nfl/players/thumb/${player.player_id}.jpg`}
                    onError={({currentTarget}) => {
                        currentTarget.onerror = null;
                        currentTarget.src =
                            'https://sleepercdn.com/images/v2/icons/player_default.webp';
                    }}
                />
            )}
            {player.position} {player.first_name} {player.last_name}
        </div>
    );
}
