import {TextField} from '@mui/material';
import styles from './PlayerSearch.module.css';
import {useEffect, useState} from 'react';
import {usePlayerData} from '../../../hooks/hooks';
import {Player} from '../../../sleeper-api/sleeper-api';
export default function PlayerSearch() {
    const [searchInput, setSearchInput] = useState('');
    const [searchOutput, setSearchOutput] = useState<Player[]>([]);
    const playerData = usePlayerData();

    useEffect(() => {
        if (!searchInput) setSearchOutput([]);
        const newPlayers: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (
                player.first_name.toLowerCase().includes(searchInput) ||
                player.last_name.toLowerCase().includes(searchInput)
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
                        <div>
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
                    setSearchInput(e.target.value.toLowerCase());
                }}
                className={styles.input}
            ></TextField>
            {searchResults()}
        </div>
    );
}
