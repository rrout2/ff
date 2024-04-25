import {useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import {Player} from '../sleeper-api/sleeper-api';

interface PlayerData {
    [key: string]: Player;
}

export function usePlayerData() {
    const [playerData, setPlayerData] = useState<PlayerData>();

    useEffect(() => {
        setPlayerData(playersJson as unknown as PlayerData);
    }, []);

    return playerData;
}
