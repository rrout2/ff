import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {League, getLeague} from '../../sleeper-api/sleeper-api';

export default function LeaguePage() {
    const [searchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');
    const [league, setLeague] = useState<League>();

    useEffect(() => {
        setLeagueId(searchParams.get('leagueId')!);
    }, [searchParams]);

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(l => setLeague(l));
    }, [leagueId]);

    return <>{league?.name}</>;
}
