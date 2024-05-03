import {useSearchParams, useNavigate} from 'react-router-dom';
import {TextField, FormControl, Button, IconButton} from '@mui/material';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
import styles from './TeamPage.module.css';
import {useEffect, useState} from 'react';
import {Roster} from '../../../sleeper-api/sleeper-api';
import {
    useFetchRosters,
    useFetchUser,
    usePlayerData,
} from '../../../hooks/hooks';
import {LEAGUE_ID, TEAM_ID} from '../../../consts/urlParams';
import PlayerPreview from '../../Player/PlayerPreview/PlayerPreview';

// dynasty-ff#/team?leagueId=...&teamId=...
export default function TeamPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [leagueId, setLeagueId] = useState('');
    const [teamId, setTeamId] = useState('');
    const [leagueIdInput, setLeagueIdInput] = useState('');
    const [teamIdInput, setTeamIdInput] = useState('');
    const [roster, setRoster] = useState<Roster>();
    const [numRosters, setNumRosters] = useState(0);
    const playerData = usePlayerData();

    useEffect(() => {
        const teamIdFromUrl = searchParams.get(TEAM_ID);
        const leagueIdFromUrl = searchParams.get(LEAGUE_ID);

        if (!teamIdFromUrl || !leagueIdFromUrl) return;

        setTeamId(teamIdFromUrl);
        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);

    const fetchRostersResponse = useFetchRosters(leagueId);
    const rosters = fetchRostersResponse.data;

    const fetchUserResponse = useFetchUser(teamId, rosters);
    const user = fetchUserResponse.data;

    useEffect(() => {
        if (!rosters || rosters.length === 0) return;
        setRoster(rosters[+teamId]);
        setNumRosters(rosters.length);
    }, [rosters, user, teamId]);

    function inputComponent() {
        return (
            <FormControl>
                <TextField
                    label={'League ID'}
                    margin="normal"
                    onChange={event => setLeagueIdInput(event.target.value)}
                    onKeyUp={event => {
                        if (event.key !== 'Enter') return;

                        setSearchParams(searchParams => {
                            searchParams.set(LEAGUE_ID, leagueIdInput);
                            searchParams.set(TEAM_ID, '0');
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
                            searchParams.set(LEAGUE_ID, leagueIdInput);
                            searchParams.set(TEAM_ID, teamIdInput);
                            return searchParams;
                        });
                    }}
                />
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

    return (
        <div className={styles.teamPage}>
            {!teamId && inputComponent()}
            {teamId && (
                <div className={styles.teamPageContent}>
                    <IconButton
                        className={styles.arrowButton}
                        onClick={() => {
                            setSearchParams(searchParams => {
                                searchParams.set(
                                    TEAM_ID,
                                    (parseInt(teamId) - 1).toString()
                                );
                                return searchParams;
                            });
                        }}
                        disabled={teamId === '0'}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div className={styles.teamPageRoster}>
                        {(!teamId || !user) && <>Loading...</>}
                        {user && (
                            <div className={styles.displayName}>
                                {user.display_name}
                            </div>
                        )}
                        {teamId && user && rosterComponent()}
                    </div>
                    <IconButton
                        className={styles.arrowButton}
                        onClick={() => {
                            setSearchParams(searchParams => {
                                searchParams.set(
                                    TEAM_ID,
                                    (parseInt(teamId) + 1).toString()
                                );
                                return searchParams;
                            });
                        }}
                        disabled={parseInt(teamId) + 1 === numRosters}
                    >
                        <ArrowForward />
                    </IconButton>
                </div>
            )}

            {returnToLeaguePageButton()}
        </div>
    );
}
