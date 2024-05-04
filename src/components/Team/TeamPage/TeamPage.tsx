import {useSearchParams, useNavigate} from 'react-router-dom';
import {
    TextField,
    FormControl,
    Button,
    IconButton,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
} from '@mui/material';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
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
import {LEAGUE_ID, TEAM_ID} from '../../../consts/urlParams';
import PlayerPreview from '../../Player/PlayerPreview/PlayerPreview';
import Menu from '../../Menu/Menu';

// dynasty-ff#/team?leagueId=...&teamId=...
export default function TeamPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [leagueId, setLeagueId] = useLeagueIdFromUrl();
    const [teamId, setTeamId] = useState('');
    const [teamIdInput, setTeamIdInput] = useState('');
    const [roster, setRoster] = useState<Roster>();
    const playerData = usePlayerData();

    useEffect(() => {
        const teamIdFromUrl = searchParams.get(TEAM_ID);
        if (teamIdFromUrl) setTeamId(teamIdFromUrl);
    }, [searchParams]);

    const fetchRostersResponse = useFetchRosters(leagueId);
    const rosters = fetchRostersResponse.data;

    const fetchUsersResponse = useFetchUsers(rosters);
    const users = fetchUsersResponse.data;
    const user = users ? users[+teamId] : undefined;

    useEffect(() => {
        if (!rosters || rosters.length === 0 || !hasTeamId()) return;
        setRoster(rosters[+teamId]);
    }, [rosters, teamId]);

    function inputComponent() {
        return (
            <div className={styles.menuWrapper}>
                <div className={styles.flexSpace} />
                <FormControl>
                    <TextField
                        label={'League ID'}
                        margin="normal"
                        value={leagueId}
                        onChange={event => {
                            setLeagueId(event.target.value);
                        }}
                        onKeyUp={event => {
                            if (event.key !== 'Enter') return;

                            setSearchParams(searchParams => {
                                if (leagueId) {
                                    searchParams.set(LEAGUE_ID, leagueId);
                                }
                                if (teamIdInput) {
                                    searchParams.set(TEAM_ID, teamIdInput);
                                }
                                return searchParams;
                            });
                        }}
                    />
                    <TextField
                        label={'Team ID (optional)'}
                        margin="normal"
                        onChange={event => setTeamIdInput(event.target.value)}
                        onKeyUp={event => {
                            if (event.key !== 'Enter') return;

                            setSearchParams(searchParams => {
                                if (leagueId) {
                                    searchParams.set(LEAGUE_ID, leagueId);
                                }
                                if (teamIdInput) {
                                    searchParams.set(TEAM_ID, teamIdInput);
                                }
                                return searchParams;
                            });
                        }}
                    />
                </FormControl>
                <div className={styles.flexSpace}>
                    <Menu />
                </div>
            </div>
        );
    }

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
                    {users?.map((u, idx) => (
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

    function viewTeamButton() {
        return (
            <Button
                variant="outlined"
                onClick={() => {
                    const teamIdOrDefault = teamId ? teamId : '0';
                    navigate(
                        `../team?${LEAGUE_ID}=${leagueId}&${TEAM_ID}=${teamIdOrDefault}`
                    );
                }}
            >
                View Team
            </Button>
        );
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
        return teamId !== '';
    }

    return (
        <div className={styles.teamPage}>
            {!hasTeamId() && inputComponent()}
            {hasTeamId() && user && (
                <div className={styles.menuWrapper}>
                    <div className={styles.flexSpace} />
                    <div className={styles.teamPageContent}>
                        <div className={styles.teamPageRoster}>
                            {teamSelectComponent()}
                            {rosterComponent()}
                        </div>
                    </div>
                    <div className={styles.flexSpace}>
                        <Menu />
                    </div>
                </div>
            )}
            {!roster && viewTeamButton()}
            {returnToLeaguePageButton()}
        </div>
    );
}
