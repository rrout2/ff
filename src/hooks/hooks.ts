import {useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import {
    Player,
    Roster,
    getLeague,
    getRosters,
    getUser,
} from '../sleeper-api/sleeper-api';
import {useQuery} from 'react-query';

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

export function usePlayer(playerId: string) {
    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        setPlayer((playersJson as unknown as PlayerData)[playerId]);
    }, [playerId]);

    return player;
}

export function useFetchUser(teamId: string, rosters?: Roster[]) {
    return useQuery({
        queryKey: [rosters, teamId],
        queryFn: async () => {
            if (!rosters || rosters.length === 0) return;
            const userId = rosters[+teamId].owner_id;
            if (!userId) return;
            return await getUser(userId);
        },
        staleTime: 10000,
    });
}

export function useFetchLeague(leagueId: string) {
    return useQuery({
        queryKey: [leagueId],
        queryFn: async () => {
            if (!leagueId) return;
            return await getLeague(leagueId);
        },
        staleTime: 10000,
    });
}

export function useFetchRosters(leagueIdNewName: string) {
    return useQuery({
        queryKey: [leagueIdNewName],
        queryFn: async () => {
            if (!leagueIdNewName) return;
            const huh = await getRosters(leagueIdNewName);
            return huh;
        },
        staleTime: 10000,
    });
}
