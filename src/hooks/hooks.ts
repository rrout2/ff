import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import playersJson from '../data/players.json';
import adp from '../data/adp.json';
import playerValuesJson from '../data/player_values_01232025.json';
import buySellsData from '../data/buys_sells_with_ids_01212025.json';
import nflScheduleJson from '../data/nfl_schedule.json';
import {
    League,
    Player,
    Roster,
    User,
    getAllUsers,
    getLeague,
    getRosters,
    getUser,
} from '../sleeper-api/sleeper-api';
import {useQuery} from '@tanstack/react-query';
import {
    LEAGUE_ID,
    LEAGUE_SIZE,
    MODULE,
    NON_SLEEPER_IDS,
    NONE_TEAM_ID,
    TEAM_ID,
    TEAM_NAME,
} from '../consts/urlParams';
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

type BuySellVerdict = {
    name: string;
    alt_name: string;
    position: string;
    team: string;
    adp: number;
    domain_rank: number;
    difference: number;
    verdict: string;
    explanation: string;
    player_id: string;
    age: number;
};

export function useBuySellData() {
    const [buySells] = useState(buySellsData as unknown as BuySellVerdict[]);
    const [qbBuys, setQbBuys] = useState<BuySellVerdict[]>([]);
    const [rbBuys, setRbBuys] = useState<BuySellVerdict[]>([]);
    const [wrBuys, setWrBuys] = useState<BuySellVerdict[]>([]);
    const [teBuys, setTeBuys] = useState<BuySellVerdict[]>([]);
    const [sells, setSells] = useState<BuySellVerdict[]>([]);
    const [holds, setHolds] = useState<BuySellVerdict[]>([]);
    useEffect(() => {
        const qbBuys = buySells.filter(
            b =>
                b.position === QB &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy')
        );

        const rbBuys = buySells.filter(
            b =>
                b.position === RB &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy')
        );

        const wrBuys = buySells.filter(
            b =>
                b.position === WR &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy')
        );

        const teBuys = buySells.filter(
            b =>
                b.position === TE &&
                (b.verdict === 'Soft Buy' || b.verdict === 'Hard Buy')
        );
        const sells = buySells
            .filter(b => b.verdict === 'Soft Sell' || b.verdict === 'Hard Sell')
            .sort((a, b) => a.difference - b.difference);

        const holds = buySells
            .filter(
                b =>
                    b.verdict === 'Hold' ||
                    b.verdict === 'Hard Buy' ||
                    b.verdict === 'Soft Buy'
            )
            .sort((a, b) => b.difference - a.difference);
        shuffle(qbBuys);
        shuffle(rbBuys);
        shuffle(wrBuys);
        shuffle(teBuys);
        setQbBuys(qbBuys);
        setRbBuys(rbBuys);
        setWrBuys(wrBuys);
        setTeBuys(teBuys);
        setSells(sells);
        setHolds(holds);
    }, [buySells]);

    function shuffle(array: BuySellVerdict[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    return {buySells, qbBuys, rbBuys, wrBuys, teBuys, sells, holds};
}

export interface PlayerData {
    [key: string]: Player;
}

export function usePlayerData() {
    const [playerData, setPlayerData] = useState<PlayerData>();

    const preprocess = (pd: PlayerData) => {
        for (const playerId in pd) {
            const player = pd[playerId];
            if (
                !SUPER_FLEX_SET.has(player.position) ||
                player.last_name === 'Invalid' ||
                player.first_name === 'Duplicate'
            ) {
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
    Value: number;
    Position: string;
    oneQbBonus: number;
    sfBonus: number;
    teValue?: number;
};

export function usePlayerValues() {
    const [playerValues] = useState<PlayerValue[]>(
        playerValuesJson as unknown as PlayerValue[]
    );

    const getPlayerValue = (playerName: string) => {
        let playerValue = playerValues.find(pv => pv.Player === playerName);
        if (playerValue) return playerValue;

        const playerNickname = checkForNickname(playerName);
        playerValue = playerValues.find(pv => pv.Player === playerNickname);
        if (playerValue) return playerValue;

        playerValue = playerValues.find(
            pv =>
                pv.Player.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase()
        );
        if (playerValue) return playerValue;

        return playerValues.find(
            pv =>
                pv.Player.replace(/\W/g, '').toLowerCase() ===
                playerNickname.replace(/\W/g, '').toLowerCase()
        );
    };

    const getBump = (playerName: string, superFlex: boolean) => {
        const playerValue = playerValues.find(pv => pv.Player === playerName);
        if (playerValue) {
            if (superFlex) {
                return playerValue.sfBonus;
            } else {
                return playerValue.oneQbBonus;
            }
        }
        console.warn(
            `cannot find PlayerValue for player with name = '${playerName}'`
        );
        return 0;
    };

    return {playerValues, getPlayerValue, getBump};
}

type adpDatum = {
    player_name: string;
    Position: string;
};

export function useAdpData() {
    const [adpData] = useState(adp as adpDatum[]);
    const getAdp = (playerName: string): number => {
        const playerNickname = checkForNickname(playerName);
        let adp = adpData.findIndex(
            a =>
                a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerName.replace(/\W/g, '').toLowerCase()
        );
        if (adp >= 0) {
            return adp + 1;
        }
        adp = adpData.findIndex(
            a =>
                a.player_name.replace(/\W/g, '').toLowerCase() ===
                playerNickname.replace(/\W/g, '').toLowerCase()
        );
        if (adp >= 0) {
            return adp + 1;
        }
        return Infinity;
    };
    const getPositionalAdp = (playerName: string) => {
        const playerNickname = checkForNickname(playerName);
        const idx = getAdp(playerName) - 1;
        if (idx >= adpData.length) return Infinity;

        let adp = adpData
            .filter(player => player.Position === adpData[idx].Position)
            .findIndex(
                a =>
                    a.player_name.replace(/\W/g, '').toLowerCase() ===
                    playerName.replace(/\W/g, '').toLowerCase()
            );
        if (adp >= 0) {
            return adp + 1;
        }
        adp = adpData
            .filter(player => player.Position === adpData[idx].Position)
            .findIndex(
                a =>
                    a.player_name.replace(/\W/g, '').toLowerCase() ===
                    playerNickname.replace(/\W/g, '').toLowerCase()
            );
        if (adp >= 0) {
            return adp + 1;
        }
        return Infinity;
    };
    const sortByAdp = (a: Player, b: Player): number =>
        getAdp(`${a.first_name} ${a.last_name}`) -
        getAdp(`${b.first_name} ${b.last_name}`);

    return {adpData, getAdp, sortByAdp, getPositionalAdp};
}

const checkForNickname = (playerName: string) => {
    switch (playerName) {
        case 'Tank Dell':
            return 'Nathaniel Dell';
        case 'Chig Okonkwo':
            return 'Chigoziem Okonkwo';
        case 'Hollywood Brown':
            return 'Marquise Brown';
        case 'Tyrone Tracy':
            return 'Tyrone Tracy Jr';
        default:
            return playerName;
    }
};

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

export function useRoster(
    rosters?: Roster[],
    teamId?: string,
    leagueId?: string
) {
    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>();
    const [roster, setRoster] = useState<Roster>();

    useEffect(() => {
        if (!leagueId || !rosters) return;
        const ownerIds = new Set(rosters.map(r => r.owner_id));
        getAllUsers(leagueId).then(users =>
            // filter to users included in owners.
            // some leagues have users with no associated owner I think.
            setAllUsers(users.filter(u => ownerIds.has(u.user_id)))
        );
    }, [leagueId, rosters]);

    useEffect(() => {
        if (
            !rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !teamId ||
            allUsers.length === 0
        ) {
            return;
        }
        function getRosterFromTeamIdx(idx: number) {
            if (allUsers.length === 0 || !rosters) return;
            const ownerId = allUsers[idx].user_id;
            return rosters.find(r => r.owner_id === ownerId);
        }
        if (+teamId >= allUsers.length) return;
        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');

        setRoster(newRoster);
    }, [rosters, teamId, allUsers]);

    useEffect(() => {
        if (
            !allUsers.length ||
            !hasTeamId() ||
            !teamId ||
            +teamId >= allUsers.length
        ) {
            return;
        }
        setUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    return {roster, user};
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
        if (teamIdFromUrl === teamId) return;
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
    }, [!!playerData, playerIds, rosterSettings]);

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
    const [allPlayersSorted, setAllPlayersSorted] = useState<string[]>([]);
    const {sortByAdp} = useAdpData();
    useEffect(() => {
        if (!playerData) return;
        const players: string[] = [];
        for (const playerId in playerData) {
            players.push(playerId);
        }
        setAllPlayers(players);
    }, [playerData]);

    useEffect(() => {
        if (!playerData || !allPlayers) return;
        setAllPlayersSorted(
            allPlayers
                .map(p => playerData[p])
                .sort(sortByAdp)
                .map(p => p.player_id)
        );
    }, [allPlayers, playerData]);

    return allPlayersSorted;
}

export function useNonSleeper(
    rosters?: Roster[],
    specifiedUser?: User,
    setRoster?: (roster: Roster) => void
) {
    const [leagueId] = useLeagueIdFromUrl();
    const [searchParams, setSearchParams] = useSearchParams();
    const [nonSleeperIds, setNonSleeperIds] = useState<string[]>(
        (searchParams.get(NON_SLEEPER_IDS) || '').split('-')
    );
    const [nonSleeperRosterSettings, setNonSleeperRosterSettings] = useState(
        new Map([
            [QB, +(searchParams.get(QB) || 1)],
            [RB, +(searchParams.get(RB) || 2)],
            [WR, +(searchParams.get(WR) || 3)],
            [TE, +(searchParams.get(TE) || 1)],
            [FLEX, +(searchParams.get(FLEX) || 2)],
            [SUPER_FLEX, +(searchParams.get(SUPER_FLEX) || 1)],
            [BENCH, +(searchParams.get(BENCH) || 6)],
        ])
    );
    const [ppr, setPpr] = useState(+(searchParams.get(PPR) || 1));
    const [teBonus, setTeBonus] = useState(+(searchParams.get(TE_BONUS) || 1));
    const [numRosters, setNumRosters] = useState(
        +(searchParams.get(LEAGUE_SIZE) ?? rosters?.length ?? 12)
    );
    const [taxiSlots, setTaxiSlots] = useState(
        +(searchParams.get(TAXI_SLOTS) || 0)
    );
    const [teamName, setTeamName] = useState(
        searchParams.get(TEAM_NAME) ||
            specifiedUser?.metadata?.team_name ||
            specifiedUser?.display_name ||
            ''
    );

    useEffect(() => {
        if (!leagueId) return;
        setTeamName(
            specifiedUser?.metadata?.team_name ||
                specifiedUser?.display_name ||
                ''
        );
    }, [specifiedUser, leagueId]);

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(TEAM_NAME);
                return searchParams;
            });
        } else {
            setSearchParams(searchParams => {
                searchParams.set(TEAM_NAME, teamName);
                return searchParams;
            });
        }
    }, [teamName, leagueId]);

    useEffect(() => {
        setNumRosters(
            +(searchParams.get(LEAGUE_SIZE) ?? rosters?.length ?? 12)
        );
    }, [rosters]);

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(LEAGUE_SIZE);
                return searchParams;
            });
        } else {
            setSearchParams(searchParams => {
                searchParams.set(LEAGUE_SIZE, '' + numRosters);
                return searchParams;
            });
        }
    }, [numRosters, leagueId]);

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

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(NON_SLEEPER_IDS);
                return searchParams;
            });
        } else {
            setSearchParams(searchParams => {
                searchParams.set(
                    NON_SLEEPER_IDS,
                    nonSleeperIds.filter(id => !!id).join('-')
                );
                return searchParams;
            });
        }
    }, [nonSleeperIds, leagueId]);

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
