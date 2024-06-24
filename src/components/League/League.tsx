import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Roster, getRosters} from '../../sleeper-api/sleeper-api';
import styles from './League.module.css';
import TeamPreview from '../Team/TeamPreview/TeamPreview';
import {TextField, FormControl, Button} from '@mui/material';
import {LEAGUE_ID} from '../../consts/urlParams';
import Menu from '../Menu/Menu';
import {useLeague, useLeagueIdFromUrl} from '../../hooks/hooks';
import {OpenInNew} from '@mui/icons-material';

// dynasty-ff/#league?leagueId=...
export default function LeaguePage() {
    const setSearchParams = useSearchParams()[1];
    const [leagueId] = useLeagueIdFromUrl();
    const [input, setInput] = useState('');
    const league = useLeague(leagueId);
    const [rosters, setRosters] = useState<Roster[]>([]);

    useEffect(() => {
        if (!leagueId) return;
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
            <>
                <FormControl>
                    <TextField
                        label={'League ID'}
                        margin="normal"
                        onChange={event => setInput(event.target.value)}
                        onKeyUp={e => {
                            if (e.key !== 'Enter') return;

                            setSearchParams(searchParams => {
                                searchParams.set(LEAGUE_ID, input);
                                return searchParams;
                            });
                        }}
                        autoFocus
                    />
                </FormControl>
                <Button
                    variant="outlined"
                    endIcon={<OpenInNew />}
                    onClick={() => {
                        window.open(
                            'https://support.sleeper.com/en/articles/4121798-how-do-i-find-my-league-id',
                            '_blank'
                        );
                    }}
                >
                    How to Find Sleeper League ID
                </Button>
            </>
        );
    }

    function rostersComponent() {
        return (
            <div className={styles.allRosters}>
                {rosters?.map((roster, index) =>
                    teamPreviewComponent(roster, index)
                )}
            </div>
        );
    }

    return (
        <div className={styles.leaguePage}>
            {!leagueId && inputComponent()}
            <div className={styles.menuWrapper}>
                <div className={styles.flexSpace} />
                <div className={styles.leagueName}>{league?.name}</div>
                <div className={styles.flexSpace}>{!!leagueId && <Menu />}</div>
            </div>

            {rostersComponent()}
        </div>
    );
}
