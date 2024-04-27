import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {usePlayer, usePlayerData} from '../../hooks/hooks';

export default function PlayerPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [playerId, setPlayerId] = useState('');
    const player = usePlayer(playerId);
    useEffect(() => {
        setPlayerId(searchParams.get('playerId') ?? '');
    }, [searchParams]);
    return (
        <>
            {player?.first_name} {player?.last_name}
        </>
    );
}
