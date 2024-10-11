import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import adp from '../data/adp.json';
import playerValuesJson from '../data/player_values.json';
import nflScheduleJson from '../data/nfl_schedule.json';
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
import {LEAGUE_ID, MODULE, NONE_TEAM_ID, TEAM_ID} from '../consts/urlParams';
import {useSearchParams} from 'react-router-dom';
import {
    BENCH,
    FLEX,
    PPR,
    QB,
    RB,
    SUPER_FLEX,
    SUPER_FLEX_SET,
    TAXI_SLOTS,
    TE,
    TE_BONUS,
    WR,
    WR_RB_FLEX,
    WR_TE_FLEX,
} from '../consts/fantasy';
import {Module} from '../components/Blueprint/v1/BlueprintGenerator';
import {Lineup} from '../components/Blueprint/v1/modules/Starters/Starters';

type TeamSchedule = {
    [week: string]: string;
};

type NFLSeasonSchedule = {
    [team: string]: TeamSchedule;
};

export function useNflSchedule() {
    const [nflSchedule] = useState<NFLSeasonSchedule>(nflScheduleJson);

    return nflSchedule;
}

export interface PlayerData {
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
export type PlayerValue = {
    Player: string;
    Value: string;
    Position: string;
};

export function usePlayerValues() {
    const [playerValues] = useState<PlayerValue[]>(playerValuesJson.Sheet1);

    const getPlayerValue = (playerName: string) => {
        const playerValue = playerValues.find(pv => pv.Player === playerName);
        if (playerValue) return playerValue;

        if (playerName.includes("'")) {
            return playerValues.find(
                pv => pv.Player === playerName.replaceAll("'", '')
            );
        }

        return undefined;
    };

    return {playerValues, getPlayerValue};
}

type adpDatum = {
    player_name: string;
    Position: string;
};

export function useAdpData() {
    const [adpData] = useState(adp as adpDatum[]);
    const getAdp = (playerName: string): number => {
        const adp = adpData.findIndex(
            a =>
                a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase()
        );
        if (adp < 0) return Infinity;

        return adp + 1;
    };
    const getPositionalAdp = (playerName: string) => {
        const idx = getAdp(playerName) - 1;
        if (idx >= adpData.length) return Infinity;

        const adp = adpData
            .filter(player => player.Position === adpData[idx].Position)
            .findIndex(
                a =>
                    a.player_name.replace(/\W/g, '').toLowerCase() ===
                    playerName.replace(/\W/g, '').toLowerCase()
            );
        if (adp < 0) return Infinity;
        return adp + 1;
    };
    const sortByAdp = (a: Player, b: Player): number =>
        getAdp(`${a.first_name} ${a.last_name}`) -
        getAdp(`${b.first_name} ${b.last_name}`);

    return {adpData, getAdp, sortByAdp, getPositionalAdp};
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
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (!leagueId) {
            setLeague({
                settings: {
                    taxi_slots: +searchParams.get(TAXI_SLOTS)!,
                },
                scoring_settings: {
                    rec: +searchParams.get(PPR)!,
                    bonus_rec_te: +searchParams.get(TE_BONUS)!,
                },
            } as League);
            return;
        }
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

export function useParamFromUrl(
    param: string,
    defaultValue?: string
): [string, Dispatch<SetStateAction<string>>] {
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setValue] = useState('');

    useEffect(() => {
        const valueFromUrl = searchParams.get(param);
        if (!valueFromUrl) {
            setValue(defaultValue ?? '');
            return;
        }

        setValue(valueFromUrl);
    }, [searchParams, setValue]);

    useEffect(() => {
        if (value === searchParams.get(param) || value === '') return;

        setSearchParams(searchParams => {
            searchParams.set(param, value);
            return searchParams;
        });
    }, [value, setSearchParams]);

    return [value, setValue];
}

export function useTeamIdFromUrl(): [string, Dispatch<SetStateAction<string>>] {
    const [searchParams, setSearchParams] = useSearchParams();
    const [teamId, setTeamId] = useState('');

    useEffect(() => {
        const teamIdFromUrl = searchParams.get(TEAM_ID);
        if (!teamIdFromUrl) {
            setTeamId(NONE_TEAM_ID);
            return;
        }

        setTeamId(teamIdFromUrl);
    }, [searchParams, setTeamId]);

    useEffect(() => {
        if (teamId === searchParams.get(TEAM_ID) || teamId === '') return;

        setSearchParams(searchParams => {
            searchParams.set(TEAM_ID, teamId);
            return searchParams;
        });
    }, [teamId, setSearchParams]);

    return [teamId, setTeamId];
}

export function useModuleFromUrl(): [Module, Dispatch<SetStateAction<Module>>] {
    const [searchParams, setSearchParams] = useSearchParams();
    const [module, setModule] = useState(Module.Unspecified);

    useEffect(() => {
        const module = searchParams.get(MODULE);
        if (!module) {
            setModule(Module.Unspecified);
            return;
        }
        setModule(module as Module);
    }, [searchParams, setModule]);

    useEffect(() => {
        if (module === searchParams.get(MODULE) || !module) return;

        setSearchParams(searchParams => {
            searchParams.set(MODULE, module);
            return searchParams;
        });
    }, [module, setSearchParams]);

    return [module, setModule];
}

export function useRosterSettings(league?: League) {
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const settings = new Map<string, number>();
        if (!league) {
            settings.set(QB, +searchParams.get(QB)!);
            settings.set(RB, +searchParams.get(RB)!);
            settings.set(WR, +searchParams.get(WR)!);
            settings.set(TE, +searchParams.get(TE)!);
            settings.set(FLEX, +searchParams.get(FLEX)!);
            settings.set(SUPER_FLEX, +searchParams.get(SUPER_FLEX)!);
            settings.set(BENCH, +searchParams.get(BENCH)!);
        } else if (league?.roster_positions) {
            league?.roster_positions.forEach(pos => {
                if (!settings.has(pos)) {
                    settings.set(pos, 0);
                }
                settings.set(pos, settings.get(pos)! + 1);
            });
        }

        setRosterSettings(settings);
    }, [league, league?.roster_positions, searchParams]);
    return rosterSettings;
}

export function useRosterSettingsFromId(leagueId?: string) {
    const league = useLeague(leagueId === undefined ? '' : leagueId);
    const [rosterSettings, setRosterSettings] = useState(
        new Map<string, number>()
    );
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const settings = new Map<string, number>();
        if (!leagueId) {
            settings.set(QB, +searchParams.get(QB)!);
            settings.set(RB, +searchParams.get(RB)!);
            settings.set(WR, +searchParams.get(WR)!);
            settings.set(TE, +searchParams.get(TE)!);
            settings.set(FLEX, +searchParams.get(FLEX)!);
            settings.set(SUPER_FLEX, +searchParams.get(SUPER_FLEX)!);
            settings.set(BENCH, +searchParams.get(BENCH)!);
        } else if (league?.roster_positions) {
            league?.roster_positions.forEach(pos => {
                if (!settings.has(pos)) {
                    settings.set(pos, 0);
                }
                settings.set(pos, settings.get(pos)! + 1);
            });
        }
        setRosterSettings(settings);
    }, [leagueId, league, league?.roster_positions, searchParams]);
    return rosterSettings;
}

export function useProjectedLineup(
    rosterSettings: Map<string, number>,
    playerIds?: string[]
) {
    const playerData = usePlayerData();
    const [startingLineup, setStartingLineup] = useState<Lineup>([]);
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
    }, [playerData, playerIds, rosterSettings]);

    useEffect(() => {
        if (!playerData || !playerIds) return;
        const remainingPlayers = new Set(playerIds);

        startingLineup.forEach(p => {
            remainingPlayers.delete(p.player.player_id);
        });

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
    }, [startingLineup]);

    return {startingLineup, setStartingLineup, bench, benchString};
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

export function useAllPlayers() {
    const playerData = usePlayerData();
    const [allPlayers, setAllPlayers] = useState<string[]>([]);
    useEffect(() => {
        const players: string[] = [];
        for (const playerId in playerData) {
            players.push(playerId);
        }
        setAllPlayers(players);
    }, [playerData]);

    return allPlayers;
}

export function useNonSleeper(
    rosters?: Roster[],
    specifiedUser?: User,
    setRoster?: (roster: Roster) => void
) {
    const [leagueId] = useLeagueIdFromUrl();
    const [nonSleeperIds, setNonSleeperIds] = useState<string[]>([]);
    const [nonSleeperRosterSettings, setNonSleeperRosterSettings] = useState(
        new Map([
            [QB, 1],
            [RB, 2],
            [WR, 2],
            [TE, 1],
            [FLEX, 2],
            [SUPER_FLEX, 1],
            [BENCH, 6],
        ])
    );
    const [ppr, setPpr] = useState(1);
    const [teBonus, setTeBonus] = useState(0.5);
    const [numRosters, setNumRosters] = useState(rosters?.length ?? 12);
    const [taxiSlots, setTaxiSlots] = useState(0);
    const [teamName, setTeamName] = useState(
        specifiedUser?.metadata?.team_name || specifiedUser?.display_name || ''
    );
    const [_searchParams, setSearchParams] = useSearchParams();

    useEffect(
        () =>
            setTeamName(
                specifiedUser?.metadata?.team_name ||
                    specifiedUser?.display_name ||
                    ''
            ),
        [specifiedUser]
    );

    useEffect(() => setNumRosters(rosters?.length ?? 12), [rosters?.length]);

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(PPR);
                searchParams.delete(TE_BONUS);
                searchParams.delete(TAXI_SLOTS);
                return searchParams;
            });
        } else {
            setSearchParams(searchParams => {
                searchParams.set(PPR, '' + ppr);
                searchParams.set(TE_BONUS, '' + teBonus);
                searchParams.set(TAXI_SLOTS, '' + taxiSlots);
                return searchParams;
            });
        }
    }, [ppr, teBonus, taxiSlots, leagueId]);

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(QB);
                searchParams.delete(RB);
                searchParams.delete(WR);
                searchParams.delete(TE);
                searchParams.delete(FLEX);
                searchParams.delete(SUPER_FLEX);
                searchParams.delete(BENCH);
                return searchParams;
            });
        } else {
            setSearchParams(searchParams => {
                searchParams.set(QB, '' + nonSleeperRosterSettings.get(QB));
                searchParams.set(RB, '' + nonSleeperRosterSettings.get(RB));
                searchParams.set(WR, '' + nonSleeperRosterSettings.get(WR));
                searchParams.set(TE, '' + nonSleeperRosterSettings.get(TE));
                searchParams.set(FLEX, '' + nonSleeperRosterSettings.get(FLEX));
                searchParams.set(
                    SUPER_FLEX,
                    '' + nonSleeperRosterSettings.get(SUPER_FLEX)
                );
                searchParams.set(
                    BENCH,
                    '' + nonSleeperRosterSettings.get(BENCH)
                );
                return searchParams;
            });
        }
    }, [nonSleeperRosterSettings, leagueId]);

    useEffect(() => {
        if (!setRoster) return;

        setRoster({
            players: nonSleeperIds,
        } as Roster);
    }, [nonSleeperIds, setRoster]);

    return {
        nonSleeperIds,
        setNonSleeperIds,
        nonSleeperRosterSettings,
        setNonSleeperRosterSettings,
        ppr,
        setPpr,
        teBonus,
        setTeBonus,
        numRosters,
        setNumRosters,
        taxiSlots,
        setTaxiSlots,
        teamName,
        setTeamName,
        setSearchParams,
    };
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
