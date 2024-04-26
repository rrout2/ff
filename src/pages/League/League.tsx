import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
    League,
    Roster,
    getLeague,
    getRosters,
} from '../../sleeper-api/sleeper-api';
import './League.css';
import TeamPreview from '../Team/TeamPreview/TeamPreview';
import {TextField, FormControl} from '@mui/material';

// accessed via /dynasty-ff/#league
export default function LeaguePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');
    const [input, setInput] = useState('');
    const [league, setLeague] = useState<League>();
    const [rosters, setRosters] = useState<Roster[]>([]);

    useEffect(() => {
        const leagueIdFromUrl = searchParams.get('leagueId');
        if (!leagueIdFromUrl) return;

        setLeagueId(leagueIdFromUrl);
    }, [searchParams]);

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(league => setLeague(league));
        getRosters(leagueId).then(rosters => setRosters(rosters));
    }, [leagueId]);

    function teamPreviewComponent(roster: Roster, index: number) {
        return (
            <div key={roster.owner_id}>
                <TeamPreview
                    roster={roster}
                    index={index}
                    leagueId={leagueId}
                />
            </div>
        );
    }

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
                            return searchParams;
                        });
                    }}
                />
            </FormControl>
        );
    }

    function rostersComponent() {
        return (
            <div className="allRosters">
                {rosters?.map((roster, index) =>
                    teamPreviewComponent(roster, index)
                )}
            </div>
        );
    }

    return (
        <div className="leaguePage">
            {!leagueId && inputComponent()}
            <h2>{league?.name}</h2>
            {rostersComponent()}
        </div>
    );
}
