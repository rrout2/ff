import {useSearchParams, useNavigate} from 'react-router-dom';
import {
    FormControl,
    Button,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import styles from './TeamPage.module.css';
import {useEffect, useState} from 'react';
import {Roster} from '../../../sleeper-api/sleeper-api';
import {
    useFetchRosters,
    useFetchUser,
    useFetchUsers,
    useLeagueIdFromUrl,
    usePlayerData,
} from '../../../hooks/hooks';
import {LEAGUE_ID, NONE_TEAM_ID, TEAM_ID} from '../../../consts/urlParams';
import PlayerPreview from '../../Player/PlayerPreview/PlayerPreview';
import Menu from '../../Menu/Menu';

// dynasty-ff#/team?leagueId=...&teamId=...
export default function TeamPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [leagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useState('');
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();

    useEffect(() => {
        const teamIdFromUrl = searchParams.get(TEAM_ID);
        if (teamIdFromUrl) setTeamId(teamIdFromUrl);
    }, [searchParams]);

    const {data: rosters} = useFetchRosters(leagueId);

    // start fetching all users from league
    const {data: allUsers} = useFetchUsers(rosters);

    // fetch specified user, unless already have allUsers
    const {data: fetchedUser} = useFetchUser(
        teamId,
        rosters,
        /* disabled = */ !!allUsers
    );
    const specifiedUser = allUsers ? allUsers[+teamId] : fetchedUser;

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

    useEffect(() => {
        if (!teamId || searchParams.get(TEAM_ID) === teamId) return;

        setSearchParams(searchParams => {
            searchParams.set(TEAM_ID, teamId);
            return searchParams;
        });
    }, [teamId]);

    function teamSelectComponent() {
        return (
            <FormControl>
                <InputLabel>Team</InputLabel>
                <Select
                    value={teamId}
                    label="Team"
                    onChange={(event: SelectChangeEvent) => {
                        setTeamId(event.target.value);
                    }}
                >
                    <MenuItem value={NONE_TEAM_ID} key={'chooseateam'}>
                        Choose a team:
                    </MenuItem>
                    {!allUsers && specifiedUser && (
                        <MenuItem value={teamId} key={teamId}>
                            {specifiedUser?.display_name}
                        </MenuItem>
                    )}
                    {allUsers?.map((u, idx) => (
                        <MenuItem value={idx} key={idx}>
                            {u.display_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    function rosterComponent() {
        if (!playerData || !roster) return <>Loading...</>;
        return roster.players
            .map(p => playerData[p])
            .sort(
                (a, b) =>
                    a.position.localeCompare(b.position) ||
                    a.last_name.localeCompare(b.last_name)
            )
            .map(player => (
                <PlayerPreview player={player} leagueId={leagueId} />
            ));
    }

    function returnToLeaguePageButton() {
        return (
            <Button
                variant="outlined"
                onClick={() => {
                    navigate(`../league?${LEAGUE_ID}=${leagueId}`);
                }}
            >
                Return to League Page
            </Button>
        );
    }

    function hasTeamId() {
        return teamId !== '' && teamId !== NONE_TEAM_ID;
    }

    return (
        <div className={styles.teamPage}>
            {
                <div className={styles.menuWrapper}>
                    <div className={styles.flexSpace} />
                    <div className={styles.teamPageContent}>
                        <div className={styles.teamPageRoster}>
                            {(specifiedUser || allUsers) &&
                                teamSelectComponent()}
                            {hasTeamId() && specifiedUser && rosterComponent()}
                            {!specifiedUser && !allUsers && (
                                <CircularProgress />
                            )}
                        </div>
                    </div>
                    <div className={styles.flexSpace}>
                        <Menu />
                    </div>
                </div>
            }
            {returnToLeaguePageButton()}
        </div>
    );
}
