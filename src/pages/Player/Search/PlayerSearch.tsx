import {TextField} from '@mui/material';
import styles from './PlayerSearch.module.css';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {usePlayerData} from '../../../hooks/hooks';
import {Player} from '../../../sleeper-api/sleeper-api';
import {LEAGUE_ID, PLAYER_ID} from '../../../consts/urlParams';
export default function PlayerSearch() {
    const [searchInput, setSearchInput] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchOutput, setSearchOutput] = useState<Player[]>([]);
    const playerData = usePlayerData();
    const navigate = useNavigate();

    useEffect(() => {
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (!searchInput) setSearchOutput([]);
        const newPlayers: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (
                player.search_full_name &&
                player.search_full_name.includes(searchInput)
            ) {
                newPlayers.push(player);
            }
        }
        setSearchOutput(newPlayers);
    }, [searchInput]);

    function searchResults() {
        if (!playerData || !searchInput) return <>{searchInput}</>;
        return (
            <>
                {searchOutput.map(p => {
                    return (
                        <div
                            onClick={() => {
                                navigate(
                                    `../player?${PLAYER_ID}=${p.player_id}&${LEAGUE_ID}=${leagueId}`
                                );
                            }}
                        >
                            {p.first_name} {p.last_name}
                        </div>
                    );
                })}
            </>
        );
    }

    return (
        <div className={styles.playerSearch}>
            <TextField
                onChange={e => {
                    setSearchInput(
                        e.target.value.toLowerCase().replace(/\s/g, '')
                    );
                }}
                className={styles.input}
            ></TextField>
            {searchResults()}
        </div>
    );
}
