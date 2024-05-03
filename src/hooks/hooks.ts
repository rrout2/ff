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
import {LEAGUE_ID} from '../consts/urlParams';
import {useSearchParams} from 'react-router-dom';

interface PlayerData {
    [key: string]: Player;
}

export function usePlayerData() {
    const [playerData, setPlayerData] = useState<PlayerData>();

    const preprocess = (pd: PlayerData) => {
        const fantasyPositions = new Set(['QB', 'WR', 'RB', 'TE']);
        for (const playerId in pd) {
            const player = pd[playerId];
            if (!fantasyPositions.has(player.position)) {
                delete pd[playerId];
            }
        }
        return pd;
    };

    useEffect(() => {
        setPlayerData(preprocess(playersJson as unknown as PlayerData));
    }, []);

    return playerData;
}

export function usePlayer(playerId: string) {
    const playerData = usePlayerData();
    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        if (!playerData) return;
        setPlayer(playerData[playerId]);
    }, [playerId, playerData]);

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

export function useLeagueIdFromUrl() {
    const [searchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');

    useEffect(() => {
        const leagueIdFromUrl = searchParams.get(LEAGUE_ID);
        if (!leagueIdFromUrl) return;

        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);
    return leagueId;
}
