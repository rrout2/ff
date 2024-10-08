import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useLeagueIdFromUrl,
    useParamFromUrl,
    usePlayerData,
    useTeamIdFromUrl,
} from '../../../hooks/hooks';
import {User, Roster, getAllUsers} from '../../../sleeper-api/sleeper-api';
import {teamSelectComponent} from '../../Team/TeamPage/TeamPage';
import {
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    TextField,
    Button,
} from '@mui/material';
import {LEAGUE_ID, NONE_TEAM_ID} from '../../../consts/urlParams';
import RosterModule from './modules/RosterModule/RosterModule';
import SettingsModule from './modules/SettingsModule/SettingsModule';
import CornerstonesModule from './modules/CornerstonesModule/CornerstonesModule';
import UnifiedModule from './modules/UnifiedModule/UnifiedModule';
import SuggestedMovesModule from './modules/SuggestedMovesModule/SuggestedMovesModule';
import HoldsModule from './modules/HoldsModule/HoldsModule';
import RisersFallersModule from './modules/RisersFallersModule/RisersFallersModule';
import PositionalGrades from './modules/PositionalGrades/PositionalGrades';
import ThreeYearOutlook from './modules/ThreeYearOutlook/ThreeYearOutlook';
import BigBoy from './modules/BigBoy/BigBoy';
import PlayerSelectComponent from '../shared/PlayerSelectComponent';
import {FLEX, QB, RB, SUPER_FLEX, TE, WR} from '../../../consts/fantasy';
import StyledNumberInput from '../shared/StyledNumberInput';
import {useSearchParams} from 'react-router-dom';

export enum Module {
    Unspecified = 'unspecified',
    Roster = 'roster',
    Settings = 'settings',
    Cornerstones = 'cornerstones',
    SuggestedMoves = 'suggestedmoves',
    Unified = 'unified',
    Holds = 'holds',
    RisersFallers = 'risersfallers',
    PositionalGrades = 'positionalgrades',
    ThreeYearOutlook = 'threeyearoutlook',
    BigBoy = 'bigboy',
}

export default function NewGenerator() {
    const [leagueId, setLeagueId] = useLeagueIdFromUrl();
    const [leagueIdWrapper, setLeagueIdWrapper] = useState(leagueId);
    const [teamId, setTeamId] = useTeamIdFromUrl();
    const [module, setModule] = useParamFromUrl('module', Module.Unspecified);
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();

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
        if (!allUsers.length || !hasTeamId()) return;
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    useEffect(() => {
        if (
            !rosters ||
            rosters.length === 0 ||
            !hasTeamId() ||
            !playerData ||
            allUsers.length === 0
        ) {
            return;
        }
        function getRosterFromTeamIdx(idx: number) {
            if (allUsers.length === 0 || !rosters) return;
            const ownerId = allUsers[idx].user_id;
            return rosters.find(r => r.owner_id === ownerId);
        }
        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');

        setRoster(newRoster);
    }, [rosters, teamId, playerData, allUsers]);

    const [allPlayers, setAllPlayers] = useState<string[]>([]);
    useEffect(() => {
        const players: string[] = [];
        for (const playerId in playerData) {
            players.push(playerId);
        }
        setAllPlayers(players);
    }, [playerData]);

    const [nonSleeperIds, setNonSleeperIds] = useState<string[]>([]);
    const [nonSleeperRosterSettings, setNonSleeperRosterSettings] = useState(
        new Map([
            [QB, 1],
            [RB, 2],
            [WR, 2],
            [TE, 1],
            [FLEX, 2],
            [SUPER_FLEX, 1],
        ])
    );

    const [_searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete(QB);
                searchParams.delete(RB);
                searchParams.delete(WR);
                searchParams.delete(TE);
                searchParams.delete(FLEX);
                searchParams.delete(SUPER_FLEX);
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
                return searchParams;
            });
        }
    }, [nonSleeperRosterSettings, leagueId]);

    useEffect(() => {
        if (leagueId) {
            setSearchParams(searchParams => {
                searchParams.delete('nonSleeperIds');
                return searchParams;
            });
            return;
        }
        setSearchParams(searchParams => {
            searchParams.set('nonSleeperIds', nonSleeperIds.join(','));
            return searchParams;
        });
    }, [nonSleeperIds, leagueId]);

    useEffect(() => {
        const customRoster = {
            players: nonSleeperIds,
        } as Roster;
        setRoster(customRoster);
    }, [nonSleeperIds]);

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function moduleSelectComponent() {
        return (
            <FormControl
                style={{
                    margin: '4px',
                    maxWidth: '800px',
                }}
            >
                <InputLabel>Module</InputLabel>
                <Select
                    value={module}
                    label="Module"
                    onChange={(event: SelectChangeEvent) => {
                        setModule(event.target.value);
                    }}
                >
                    <MenuItem value={Module.Unspecified} key={'chooseamodule'}>
                        Choose a module:
                    </MenuItem>
                    <MenuItem value={Module.Unified} key={Module.Unified}>
                        Unified
                    </MenuItem>
                    <MenuItem value={Module.Roster} key={Module.Roster}>
                        Roster
                    </MenuItem>
                    <MenuItem value={Module.Settings} key={Module.Settings}>
                        Settings
                    </MenuItem>
                    <MenuItem
                        value={Module.Cornerstones}
                        key={Module.Cornerstones}
                    >
                        Cornerstones
                    </MenuItem>

                    <MenuItem
                        value={Module.SuggestedMoves}
                        key={Module.SuggestedMoves}
                    >
                        Suggested Moves
                    </MenuItem>
                    <MenuItem value={Module.Holds} key={Module.Holds}>
                        Holds
                    </MenuItem>
                    <MenuItem
                        value={Module.RisersFallers}
                        key={Module.RisersFallers}
                    >
                        Risers/Fallers
                    </MenuItem>
                    <MenuItem
                        value={Module.PositionalGrades}
                        key={Module.PositionalGrades}
                    >
                        Positional Grades
                    </MenuItem>
                    <MenuItem
                        value={Module.ThreeYearOutlook}
                        key={Module.ThreeYearOutlook}
                    >
                        Three Year Outlook
                    </MenuItem>
                    <MenuItem value={Module.BigBoy} key={Module.BigBoy}>
                        Big Boy
                    </MenuItem>
                </Select>
            </FormControl>
        );
    }

    return (
        <div>
            {!leagueId && (
                <>
                    <TextField
                        value={leagueIdWrapper}
                        onChange={e => setLeagueIdWrapper(e.target.value)}
                        label="Sleeper ID"
                    />
                    <Button
                        variant="outlined"
                        onClick={() => setLeagueId(leagueIdWrapper)}
                        disabled={!leagueIdWrapper}
                    >
                        {'submit'}
                    </Button>
                    or
                    <div>
                        <PlayerSelectComponent
                            playerIds={allPlayers}
                            selectedPlayerIds={nonSleeperIds}
                            onChange={setNonSleeperIds}
                            multiple={true}
                            label="Roster"
                        />
                        {[QB, RB, WR, TE, FLEX, SUPER_FLEX].map(position => (
                            <StyledNumberInput
                                key={position}
                                value={nonSleeperRosterSettings.get(position)}
                                onChange={(_, value) => {
                                    const newMap = new Map(
                                        nonSleeperRosterSettings
                                    );
                                    newMap.set(position, value || 0);
                                    setNonSleeperRosterSettings(newMap);
                                }}
                                label={position}
                                min={0}
                                max={10}
                            />
                        ))}
                    </div>
                </>
            )}
            {!!leagueId && (
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchParams(searchParams => {
                            searchParams.delete(LEAGUE_ID);
                            return searchParams;
                        });
                        setLeagueIdWrapper('');
                        setLeagueId('');
                    }}
                >
                    {'New League'}
                </Button>
            )}
            {!!leagueId &&
                teamSelectComponent(
                    teamId,
                    setTeamId,
                    allUsers,
                    specifiedUser,
                    {
                        margin: '4px',
                    }
                )}
            {(hasTeamId() || nonSleeperIds.length > 0) &&
                moduleSelectComponent()}
            {module === Module.Roster && !!roster && (
                <RosterModule
                    roster={roster}
                    numRosters={rosters?.length}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.Settings && (
                <SettingsModule
                    leagueId={leagueId}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                    numRosters={rosters?.length}
                />
            )}
            {module === Module.Cornerstones && (
                <CornerstonesModule
                    roster={roster}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.Unified && (
                <UnifiedModule
                    roster={roster}
                    numRosters={rosters?.length}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.SuggestedMoves && (
                <SuggestedMovesModule
                    roster={roster}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.Holds && (
                <HoldsModule
                    roster={roster}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.RisersFallers && (
                <RisersFallersModule
                    roster={roster}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.PositionalGrades && (
                <PositionalGrades
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.ThreeYearOutlook && (
                <ThreeYearOutlook
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
            {module === Module.BigBoy && (
                <BigBoy
                    roster={roster}
                    numRosters={rosters?.length}
                    teamName={
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }
                />
            )}
        </div>
    );
}
