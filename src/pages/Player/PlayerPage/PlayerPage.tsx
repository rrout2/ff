import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useFetchRosters, useFetchUser, usePlayer} from '../../../hooks/hooks';
import styles from './PlayerPage.module.css';
import {Roster} from '../../../sleeper-api/sleeper-api';
import {Button, IconButton} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import {LEAGUE_ID, PLAYER_ID, TEAM_ID} from '../../../consts/urlParams';

export default function PlayerPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [playerId, setPlayerId] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [teamId, setTeamId] = useState('');
    const player = usePlayer(playerId);
    const fetchRostersResponse = useFetchRosters(leagueId);
    const rosters = fetchRostersResponse.data;
    const [roster, setRoster] = useState<Roster>();
    const fetchUserResponse = useFetchUser(teamId, rosters);
    const user = fetchUserResponse.data;

    // O(N * M)
    function findRoster() {
        if (!rosters) return -1;
        return rosters.findIndex(roster => {
            return roster.players.includes(player?.player_id ?? '');
        });
    }

    useEffect(() => {
        setPlayerId(searchParams.get(PLAYER_ID) ?? '');
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (teamId !== '' || !leagueId || !player) return;
        setTeamId(findRoster().toString());
    }, [leagueId, teamId, player?.player_id]);

    useEffect(() => {
        if (!rosters || rosters.length === 0) return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

    return (
        <div className={styles.playerPage}>
            <div className={styles.flexSpace}>
                <IconButton
                    onClick={() => {
                        navigate(`search?${LEAGUE_ID}=${leagueId}`);
                    }}
                >
                    <Search />
                </IconButton>
            </div>

            <div className={styles.playerProfile}>
                {player && (
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
                <div>
                    {player?.first_name} {player?.last_name}
                </div>
                <div>
                    {player?.position}
                    {player?.depth_chart_order} on {player?.team}
                </div>
                <div>{player?.status}</div>
                <div>Age: {player?.age}</div>
                <div>Year: {player?.years_exp}</div>
                <div>{player?.college}</div>
                {!!user && (
                    <Button
                        onClick={() => {
                            navigate(
                                `../team?${LEAGUE_ID}=${leagueId}&${TEAM_ID}=${teamId}`
                            );
                        }}
                        variant="outlined"
                    >
                        Return to {user?.display_name}
                    </Button>
                )}
            </div>
            <div className={styles.flexSpace}></div>
        </div>
    );
}
