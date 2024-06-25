import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import adp from '../data/adp.json';
import {
    League,
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
import {
    BENCH,
    FLEX,
    QB,
    RB,
    SUPER_FLEX,
    SUPER_FLEX_SET,
    TE,
    WR,
    WR_RB_FLEX,
    WR_TE_FLEX,
} from '../consts/fantasy';

interface PlayerData {
    [key: string]: Player;
}

export function usePlayerData() {
    const [playerData, setPlayerData] = useState<PlayerData>();

    const preprocess = (pd: PlayerData) => {
        for (const playerId in pd) {
            const player = pd[playerId];
            if (!SUPER_FLEX_SET.has(player.position)) {
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

type adpDatum = {
    player_name: string;
};

export function useAdpData() {
    const [adpData] = useState(adp as adpDatum[]);
    const getAdp = (playerName: string) => {
        const adp = adpData.findIndex(
            a => a.player_name.toLowerCase() === playerName.toLowerCase()
        );
        if (adp < 0) return Infinity;

        return adp;
    };
    const sortByAdp = (a: Player, b: Player) =>
        getAdp(`${a.first_name} ${a.last_name}`) -
        getAdp(`${b.first_name} ${b.last_name}`);

    return {adpData, getAdp, sortByAdp};
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

export function useLeague(leagueId?: string) {
    const [league, setLeague] = useState<League>();
    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(l => setLeague(l));
    }, [leagueId]);
    return league;
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
            return await getRosters(leagueIdNewName);
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

export function useRosterSettings(league?: League) {
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    useEffect(() => {
        const settings = new Map<string, number>();
        league?.roster_positions.forEach(pos => {
            if (!settings.has(pos)) {
                settings.set(pos, 0);
            }
            settings.set(pos, settings.get(pos)! + 1);
        });
        setRosterSettings(settings);
    }, [league, league?.roster_positions]);
    return rosterSettings;
}

export function useRosterSettingsFromId(leagueId?: string) {
    const league = useLeague(leagueId === undefined ? '' : leagueId);
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    useEffect(() => {
        const settings = new Map<string, number>();
        league?.roster_positions?.forEach(pos => {
            if (!settings.has(pos)) {
                settings.set(pos, 0);
            }
            settings.set(pos, settings.get(pos)! + 1);
        });
        setRosterSettings(settings);
    }, [league, league?.roster_positions]);
    return rosterSettings;
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
    const {getAdp, sortByAdp} = useAdpData();

    useEffect(() => {
        if (!playerData || !playerIds) return;
        const remainingPlayers = new Set(playerIds);
        const starters: {player: Player; position: string}[] = [];
        Array.from(rosterSettings)
            .filter(([position]) => position !== BENCH)
            .forEach(([position, count]) => {
                const bestAtPosition = getBestNAtPosition(
                    position,
                    count,
                    remainingPlayers,
                    getAdp,
                    sortByAdp,
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

export function useTitle(title: string) {
    useEffect(() => {
        const oldTitle = document.title;
        document.title = title;
        return () => {
            document.title = oldTitle;
        };
    }, [title]);
}

function getBestNAtPosition(
    position: string,
    count: number,
    remainingPlayers: Set<string>,
    getAdp: (playerName: string) => number,
    sortByAdp: (a: Player, b: Player) => number,
    playerData: PlayerData,
    playerIds: string[]
): Player[] {
    switch (position) {
        case FLEX:
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes(WR) ||
                            p.fantasy_positions.includes(RB) ||
                            p.fantasy_positions.includes(TE))
                )
                .sort(sortByAdp)
                .slice(0, count);
        case WR_RB_FLEX:
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes(WR) ||
                            p.fantasy_positions.includes(RB))
                )
                .sort(sortByAdp)
                .slice(0, count);
        case WR_TE_FLEX:
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes(WR) ||
                            p.fantasy_positions.includes(TE))
                )
                .sort(sortByAdp)
                .slice(0, count);

        case SUPER_FLEX:
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(
                    p =>
                        !!p &&
                        (p.fantasy_positions.includes(WR) ||
                            p.fantasy_positions.includes(RB) ||
                            p.fantasy_positions.includes(TE) ||
                            p.fantasy_positions.includes(QB))
                )
                .sort(sortByAdp)
                .sort((a, b) => {
                    // maybe adjust this
                    const startingQbThreshold = 160;

                    // manually prioritizing starting level QBs for super flex
                    if (a.position === QB && b.position !== QB) {
                        if (
                            getAdp(`${a.first_name} ${a.last_name}`) <
                            startingQbThreshold
                        ) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    if (a.position !== QB && b.position === QB) {
                        if (
                            getAdp(`${b.first_name} ${b.last_name}`) <
                            startingQbThreshold
                        ) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                    return sortByAdp(a, b);
                })
                .slice(0, count);
        default: // non-flex positions
            return playerIds
                .filter(p => remainingPlayers.has(p))
                .map(p => playerData[p])
                .filter(p => !!p && p.fantasy_positions.includes(position))
                .sort(sortByAdp)
                .slice(0, count);
    }
}
