import {TextField} from '@mui/material';
import styles from './PlayerSearch.module.css';
import {useSearchParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {usePlayerData} from '../../../hooks/hooks';
import {Player} from '../../../sleeper-api/sleeper-api';
import {LEAGUE_ID} from '../../../consts/urlParams';
import PlayerPreview from '../PlayerPreview/PlayerPreview';
export default function PlayerSearch() {
    const [searchInput, setSearchInput] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [searchParams] = useSearchParams();
    const [searchOutput, setSearchOutput] = useState<Set<Player>>(new Set());
    const playerData = usePlayerData();

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
                        <PlayerPreview
                            player={player}
                            leagueId={leagueId}
                            hideHeadshot={true}
                        />
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
