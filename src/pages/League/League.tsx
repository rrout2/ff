import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
    League,
    Roster,
    User,
    getLeague,
    getRosters,
    getUser,
} from '../../sleeper-api/sleeper-api';
import './League.css';

const DEFAULT_LEAGUE_ID = '1048770475687571456';

// accessed via /dynasty-ff/#league
export default function LeaguePage() {
    const [searchParams] = useSearchParams();
    const [leagueId, setLeagueId] = useState('');
    const [league, setLeague] = useState<League>();
    const [rosters, setRosters] = useState<Roster[]>([]);
    const [users, setUsers] = useState<Map<string, User>>(
        new Map<string, User>()
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLeagueId(searchParams.get('leagueId') ?? DEFAULT_LEAGUE_ID);
    }, [searchParams]);

    useEffect(() => {
        if (!leagueId) return;
        getLeague(leagueId).then(l => setLeague(l));
        getRosters(leagueId).then(rs => setRosters(rs));
    }, [leagueId]);

    useEffect(() => {
        if (!rosters) return;
        const loadUsers = async () => {
            const loadedUsers = new Map<string, User>();
            for (const roster of rosters) {
                const user = await getUser(roster.owner_id);
                loadedUsers.set(roster.owner_id, user);
            }
            setUsers(loadedUsers);
        };

        loadUsers().finally(() => {
            setLoading(false);
        });
    }, [rosters]);

    function teamPreviewComponent(ownerId: string, index: number) {
        const user = users.get(ownerId);
        const isEven = index % 2 === 0;
        return (
            <div
                key={ownerId}
                className={`teamPreview ${isEven ? 'even' : 'odd'}`}
            >
                <img
                    className="avatarThumbnail"
                    src={`https://sleepercdn.com/avatars/thumbs/${user?.avatar}`}
                />
                {user?.display_name}
            </div>
        );
    }

    function rostersComponent() {
        return (
            <div className="allRosters">
                {rosters?.map((roster, index) =>
                    teamPreviewComponent(roster.owner_id, index)
                )}
            </div>
        );
    }

    return (
        <div className="leaguePage">
            <h2>{league?.name}</h2>
            {!loading && rostersComponent()}
        </div>
    );
}
