import {useSearchParams} from 'react-router-dom';
import {TextField, FormControl} from '@mui/material';
import {IconButton} from '@material-ui/core';
import {ArrowBack, ArrowForward} from '@material-ui/icons';
import './TeamPage.css';
import {useEffect, useState} from 'react';
import {
    League,
    Roster,
    getLeague,
    getRosters,
} from '../../../sleeper-api/sleeper-api';
import {usePlayerData} from '../../../hooks/hooks';

export default function TeamPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');
    const [teamId, setTeamId] = useState('');
    const [input, setInput] = useState('');
    const [league, setLeague] = useState<League>();
    const [roster, setRoster] = useState<Roster>();
    const [numRosters, setNumRosters] = useState(0);
    const playerData = usePlayerData();
    useEffect(() => {
        const teamIdFromUrl = searchParams.get('teamId');
        const leagueIdFromUrl = searchParams.get('leagueId');

        if (!teamIdFromUrl || !leagueIdFromUrl) return;

        setTeamId(teamIdFromUrl);
        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);

    useEffect(() => {
        if (!teamId) return;

        getLeague(leagueId).then(league => setLeague(league));
        getRosters(leagueId).then(rosters => {
            setRoster(rosters[+teamId]);
            setNumRosters(rosters.length);
        });
    }, [teamId, leagueId]);

    function inputComponent() {
        return (
            <FormControl>
                <TextField
                    label={'League ID'}
                    margin="normal"
                    onChange={event => setInput(event.target.value)}
                    onKeyUp={e => {
                        if (e.key !== 'Enter') return;

                        setSearchParams(searchParams => {
                            searchParams.set('leagueId', input);
                            searchParams.set('teamId', '0');
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
                <div key={player.player_id}>
                    {player.position} {player.first_name} {player.last_name}
                </div>
            ));
    }

    return (
        <div className="teamPage">
            {!teamId && inputComponent()}
            <div className="teamPageContent">
                <IconButton
                    onClick={() => {
                        setSearchParams(searchParams => {
                            searchParams.set(
                                'teamId',
                                (parseInt(teamId) - 1).toString()
                            );
                            return searchParams;
                        });
                    }}
                    disabled={teamId === '0'}
                    className="arrowButton"
                >
                    <ArrowBack />
                </IconButton>
                <div className="teamPageRoster">
                    {teamId && rosterComponent()}
                </div>
                <IconButton
                    onClick={() => {
                        setSearchParams(searchParams => {
                            searchParams.set(
                                'teamId',
                                (parseInt(teamId) + 1).toString()
                            );
                            return searchParams;
                        });
                    }}
                    disabled={parseInt(teamId) + 1 === numRosters}
                    className="arrowButton"
                >
                    <ArrowForward />
                </IconButton>
            </div>
        </div>
    );
}
