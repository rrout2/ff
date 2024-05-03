import {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {usePlayerData} from '../../hooks/hooks';
import {Player} from '../../sleeper-api/sleeper-api';
import PlayerPreview from '../Player/PlayerPreview/PlayerPreview';
import {LEAGUE_ID} from '../../consts/urlParams';

export default function NflTeam() {
    const [searchParams] = useSearchParams();
    const [teamCode, setTeamCode] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    const playerData = usePlayerData();

    useEffect(() => {
        setTeamCode(searchParams.get('team') ?? 'DAL');
        setLeagueId(searchParams.get(LEAGUE_ID) ?? '');
    }, [searchParams]);

    useEffect(() => {
        if (!teamCode) {
            setTeamPlayers([]);
            return;
        }
        const players: Player[] = [];
        for (const playerId in playerData) {
            const player = playerData[playerId];
            if (player.team === teamCode) {
                players.push(player);
            }
        }
        players.sort((playerA, playerB) => {
            const posSort = playerA.position.localeCompare(playerB.position);
            if (posSort) return posSort;

            if (playerB.depth_chart_order && playerA.depth_chart_order) {
                return playerA.depth_chart_order - playerB.depth_chart_order;
            }

            if (!playerB.depth_chart_order || !playerA.depth_chart_order) {
                if (playerA.depth_chart_order) return -1;

                if (playerB.depth_chart_order) return 1;
            }
            return 0;
        });
        setTeamPlayers(players);
    }, [playerData, teamCode]);

    function rosterComponent() {
        return teamPlayers.map(p => (
            <PlayerPreview player={p} leagueId={leagueId} />
        ));
    }

    return <>{rosterComponent()}</>;
}
