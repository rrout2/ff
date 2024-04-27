import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useFetchRosters, usePlayer} from '../../hooks/hooks';

export default function PlayerPage() {
    const [searchParams] = useSearchParams();
    const [playerId, setPlayerId] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [teamId, setTeamId] = useState('');
    const player = usePlayer(playerId);
    const fetchRostersResponse = useFetchRosters(leagueId);
    const rosters = fetchRostersResponse.data;

    // O(N * M)
    function findRoster() {
        if (!rosters) return -1;
        return rosters.findIndex(roster => {
            return roster.players.includes(player?.player_id ?? '');
        });
    }

    useEffect(() => {
        setPlayerId(searchParams.get('playerId') ?? '');
        setLeagueId(searchParams.get('leagueId') ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (teamId !== '' || !leagueId || !player) return;
        setTeamId(findRoster().toString());
    }, [leagueId, teamId, player?.player_id]);

    return (
        <>
            {player?.first_name} {player?.last_name} {teamId}
        </>
    );
}
