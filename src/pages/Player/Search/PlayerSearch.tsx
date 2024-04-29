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
    const [searchOutput, setSearchOutput] = useState<Set<Player>>(new Set());
    const playerData = usePlayerData();
    const navigate = useNavigate();

    useEffect(() => {
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (!searchInput) setSearchOutput(new Set());
        const searchResults = new Set<Player>();
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (
                player.search_full_name &&
                player.search_full_name.includes(searchInput)
            ) {
                searchResults.add(player);
            }
        }
        setSearchOutput(searchResults);
    }, [searchInput]);

    function searchResults() {
        if (!playerData || !searchInput) return <>{searchInput}</>;
        return (
            <>
                {Array.from(searchOutput).map(player => {
                    return (
                        <div
                            onClick={() => {
                                navigate(
                                    `../player?${PLAYER_ID}=${player.player_id}&${LEAGUE_ID}=${leagueId}`
                                );
                            }}
                            key={player.player_id}
                            className={styles.searchResultRow}
                        >
                            {player.first_name} {player.last_name}
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
