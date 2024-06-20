import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useLeagueIdFromUrl,
    usePlayerData,
    useTitle,
} from '../../../hooks/hooks';
import {Roster, User, getAllUsers} from '../../../sleeper-api/sleeper-api';
import styles from './BlueprintGenerator.module.css';
import {teamSelectComponent} from '../../Team/TeamPage/TeamPage';
import {NONE_TEAM_ID} from '../../../consts/urlParams';
import CornerstoneModule from './modules/cornerstone/CornerstoneModule';
import {
    InputLabel,
    SelectChangeEvent,
    FormControl,
    MenuItem,
    Select,
} from '@mui/material';
import LookToTradeModule from './modules/looktotrade/LookToTradeModule';
import PlayersToTargetModule from './modules/playerstotarget/PlayersToTargetModule';

enum Module {
    Unspecified = '',
    Cornerstone = 'cornerstones',
    LookToTrade = 'looktotrade',
    PlayersToTarget = 'playerstotarget',
}

export default function BlueprintGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useState(NONE_TEAM_ID);
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [module, setModule] = useState<Module>(Module.Unspecified);
    useEffect(() => {
        if (!allUsers.length || !hasTeamId()) return;
        setSpecifiedUser(allUsers?.[+teamId]);
    }, [allUsers, teamId]);

    function getRosterFromTeamIdx(idx: number) {
        if (allUsers.length === 0 || !rosters) return;
        const ownerId = allUsers[idx].user_id;
        return rosters.find(r => r.owner_id === ownerId);
    }

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId() || !playerData) {
            return;
        }

        const newRoster = getRosterFromTeamIdx(+teamId);
        if (!newRoster) throw new Error('roster not found');

        setRoster(newRoster);
    }, [rosters, teamId, playerData]);

    useEffect(() => {
        if (!leagueId) return;
        getAllUsers(leagueId).then(users => setAllUsers(users));
    }, [leagueId]);

    useTitle('Blueprint Generator');

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    function moduleSelectComponent() {
        return (
            <FormControl
                style={{
                    margin: '4px',
                }}
            >
                <InputLabel>Module</InputLabel>
                <Select
                    value={module}
                    label="Module"
                    onChange={(event: SelectChangeEvent) => {
                        setModule(event.target.value as Module);
                    }}
                >
                    <MenuItem value={''} key={'chooseamodule'}>
                        Choose a module:
                    </MenuItem>
                    <MenuItem value={Module.Cornerstone} key={'cornerstones'}>
                        Cornerstones
                    </MenuItem>
                    <MenuItem value={Module.LookToTrade} key={'looktotrade'}>
                        Look to Trade
                    </MenuItem>
                    <MenuItem
                        value={Module.PlayersToTarget}
                        key={'playerstotarget'}
                    >
                        Players to Target
                    </MenuItem>
                </Select>
            </FormControl>
        );
    }

    return (
        <div className={styles.blueprintPage}>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser, {
                margin: '4px',
            })}
            {hasTeamId() && moduleSelectComponent()}
            {hasTeamId() && module === Module.Cornerstone && (
                <CornerstoneModule
                    roster={roster}
                    specifiedUser={specifiedUser}
                />
            )}
            {hasTeamId() && module === Module.LookToTrade && (
                <LookToTradeModule
                    roster={roster}
                    specifiedUser={specifiedUser}
                />
            )}
            {hasTeamId() && module === Module.PlayersToTarget && (
                <PlayersToTargetModule specifiedUser={specifiedUser} />
            )}
        </div>
    );
}
