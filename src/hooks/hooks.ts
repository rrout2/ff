import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import adp from '../data/adp.json';
import {
    Player,
    Roster,
    User,
    getLeague,
    getRosters,
    getUser,
} from '../sleeper-api/sleeper-api';
import {useQuery} from '@tanstack/react-query';
import {LEAGUE_ID} from '../consts/urlParams';
import {useSearchParams} from 'react-router-dom';
import {sortBySearchRank} from '../components/Player/Search/PlayerSearch';

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

type adp = {
    player_name: string;
    position: string;
    average_pick: number | string;
};

export function useAdpData(): [adp[], (playerName: string) => number] {
    const [adpData] = useState(adp as adp[]);
    const getAdp = (playerName: string) => {
        return adpData.findIndex(
            a => a.player_name.toLowerCase() === playerName.toLowerCase()
        );
    };
    return [adpData, getAdp];
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

export function useFetchUsers(rosters?: Roster[]) {
    return useQuery({
        queryKey: [rosters],
        enabled: !!rosters && rosters.length > 0,
        queryFn: async () => {
            if (!rosters || rosters.length === 0) {
                throw new Error('rosters is undefined or empty');
            }
            const users: User[] = [];
            for (const rosterId in rosters) {
                const roster = rosters[rosterId];
                if (!roster.owner_id) continue;
                users.push(await getUser(roster.owner_id));
            }
            return users;
        },
        staleTime: 10000,
    });
}

export function useFetchUser(
    teamId: string,
    rosters?: Roster[],
    disabled?: boolean
) {
    return useQuery({
        queryKey: [rosters, teamId],
        enabled: !!rosters && rosters.length > 0 && !!teamId && !disabled,
        queryFn: async () => {
            if (!rosters || rosters.length === 0) {
                throw new Error('rosters is undefined or empty');
            }
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
            if (!leagueId) {
                throw new Error('leagueId is empty');
            }
            return await getLeague(leagueId);
        },
        staleTime: 10000,
    });
}

export function useFetchRosters(leagueIdNewName: string) {
    return useQuery({
        queryKey: [leagueIdNewName],
        queryFn: async () => {
            if (!leagueIdNewName) throw new Error('leagueId is empty');
            const huh = await getRosters(leagueIdNewName);
            return huh;
        },
        staleTime: 10000,
    });
}

export function useLeagueIdFromUrl(): [
    string,
    Dispatch<SetStateAction<string>>
] {
    const [searchParams, setSearchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');

    useEffect(() => {
        const leagueIdFromUrl = searchParams.get(LEAGUE_ID);
        if (!leagueIdFromUrl) return;

        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);

    useEffect(() => {
        if (leagueId === searchParams.get(LEAGUE_ID) || !leagueId) return;

        setSearchParams(searchParams => {
            searchParams.set(LEAGUE_ID, leagueId);
            return searchParams;
        });
    }, [leagueId]);

    return [leagueId, setLeagueId];
}

export function useProjectedLineup(
    rosterSettings: Map<string, number>,
    playerIds?: string[]
): [{player: Player; position: string}[], Player[], string] {
    const playerData = usePlayerData();
    const [startingLineup, setStartingLineup] = useState<
        {player: Player; position: string}[]
    >([]);
    const [bench, setBench] = useState<Player[]>([]);
    const [benchString, setBenchString] = useState('');

    useEffect(() => {
        if (!playerData || !playerIds) return;
        const remainingPlayers = new Set(playerIds);
        const starters: {player: Player; position: string}[] = [];
        Array.from(rosterSettings)
            .filter(([position]) => position !== 'BN')
            .forEach(([position, count]) => {
                const bestAtPosition = getBestNAtPosition(
                    position,
                    count,
                    remainingPlayers,
                    playerData,
                    playerIds
                );
                bestAtPosition.forEach(p => {
                    remainingPlayers.delete(p.player_id);
                    starters.push({
                        player: p,
                        position: position,
                    });
                });
            });

        setStartingLineup(starters);

        const benchPlayerList = Array.from(remainingPlayers)
            .map(p => playerData[p])
            .filter(p => !!p);

        setBench(benchPlayerList);

        setBenchString(
            benchPlayerList
                .sort(
                    (a, b) =>
                        a.position.localeCompare(b.position) ||
                        a.last_name.localeCompare(b.last_name)
                )
                .reduce((acc, player, idx) => {
                    const isLast = idx === remainingPlayers.size - 1;
                    const trailingText = isLast ? '' : ', ';
                    return `${acc}${player.first_name[0]}. ${player.last_name} (${player.position})${trailingText}`;
                }, '')
                .toLocaleUpperCase()
        );
    }, [playerData, playerIds, rosterSettings]);

    return [startingLineup, bench, benchString];
}

function getBestNAtPosition(
    position: string,
    count: number,
    remainingPlayers: Set<string>,
    playerData?: PlayerData,
    playerIds?: string[]
): Player[] {
    if (!playerData || !playerIds) return [];
    switch (position) {
        case 'FLEX':
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB') ||
                            p.fantasy_positions.includes('TE'))
                )
                .sort(sortBySearchRank)
                .slice(0, count);
        case 'WRRB_FLEX':
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB'))
                )
                .sort(sortBySearchRank)
                .slice(0, count);
        case 'REC_FLEX':
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('TE'))
                )
                .sort(sortBySearchRank)
                .slice(0, count);

        case 'SUPER_FLEX':
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes('WR') ||
                            p.fantasy_positions.includes('RB') ||
                            p.fantasy_positions.includes('TE') ||
                            p.fantasy_positions.includes('QB'))
                )
                .sort((a, b) => {
                    // manually prioritizing QBs for super flex
                    if (a.position === 'QB' && b.position !== 'QB') {
                        return -1;
                    }
                    if (a.position !== 'QB' && b.position === 'QB') {
                        return 1;
                    }
                    return sortBySearchRank(a, b);
                })
                .slice(0, count);
        default: // non-flex positions
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(p => !!p && p.fantasy_positions.includes(position))
                .sort(sortBySearchRank)
                .slice(0, count);
    }
}
