import {useEffect, useState} from 'react';
import {
    useFetchRosters,
    useLeague,
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
} from '@mui/material';
import {NONE_TEAM_ID} from '../../../consts/urlParams';
import RosterModule from './modules/RosterModule/RosterModule';

export enum Module {
    Unspecified = 'unspecified',
    Roster = 'roster',
}

export default function NewGenerator() {
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useTeamIdFromUrl();
    const [module, setModule] = useParamFromUrl('module', Module.Unspecified);
    const {data: rosters} = useFetchRosters(leagueId);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [specifiedUser, setSpecifiedUser] = useState<User>();
    const [roster, setRoster] = useState<Roster>();
    const league = useLeague(leagueId);
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
                    <MenuItem value={Module.Roster} key={Module.Roster}>
                        Roster
                    </MenuItem>
                </Select>
            </FormControl>
        );
    }

    return (
        <div>
            {teamSelectComponent(teamId, setTeamId, allUsers, specifiedUser, {
                margin: '4px',
            })}
            {hasTeamId() && moduleSelectComponent()}
            {module === Module.Roster && !!roster && (
                <RosterModule roster={roster} />
            )}
        </div>
    );
}
