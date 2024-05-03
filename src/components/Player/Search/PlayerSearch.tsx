import {TextField} from '@mui/material';
import styles from './PlayerSearch.module.css';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {usePlayerData} from '../../../hooks/hooks';
import {Player} from '../../../sleeper-api/sleeper-api';
import {LEAGUE_ID, PLAYER_ID} from '../../../consts/urlParams';
import PlayerPreview from '../PlayerPreview/PlayerPreview';
import Menu from '../../Menu/Menu';

// dynasty-ff#/player/search?leagueId=...
export default function PlayerSearch() {
    const [searchInput, setSearchInput] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [searchParams] = useSearchParams();
    const [searchOutputList, setSearchOutputList] = useState<Player[]>([]);
    const playerData = usePlayerData();
    const navigate = useNavigate();

    useEffect(() => {
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (!searchInput) setSearchOutputList([]);
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
        setSearchOutputList(Array.from(searchResults));
    }, [searchInput]);

    function searchResults() {
        if (!playerData || !searchInput) return <>{searchInput}</>;
        return (
            <>
                {searchOutputList.map(player => {
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
            <div className={styles.menuWrapper}>
                <div className={styles.flexSpace} />
                <TextField
                    className={styles.input}
                    onChange={e => {
                        setSearchInput(
                            e.target.value.toLowerCase().replace(/\s/g, '')
                        );
                    }}
                    onKeyUp={event => {
                        if (event.key !== 'Enter') return;

                        if (searchOutputList.length === 0) return;
                        navigate(
                            `../player?${PLAYER_ID}=${searchOutputList[0].player_id}&${LEAGUE_ID}=${leagueId}`
                        );
                    }}
                    label={'Search for a player'}
                    autoFocus
                />
                <div className={styles.flexSpace}>
                    <Menu />
                </div>
            </div>

            {searchResults()}
        </div>
    );
}
