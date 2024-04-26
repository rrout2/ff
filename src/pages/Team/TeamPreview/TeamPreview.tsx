import {useEffect, useState} from 'react';
import {Roster, User, getUser} from '../../../sleeper-api/sleeper-api';
import {ArrowDropUp, ArrowDropDown, OpenInNew} from '@material-ui/icons';
import {useNavigate} from 'react-router-dom';
import {IconButton} from '@material-ui/core';
import './TeamPreview.css';
import {usePlayerData} from '../../../hooks/hooks';

export type TeamPreviewProps = {
    roster: Roster;
    index: number;
    leagueId: string;
};

export default function TeamPreview({
    roster,
    index,
    leagueId,
}: TeamPreviewProps) {
    const ownerId = roster.owner_id;
    const isEven = index % 2 === 0;

    const [user, setUser] = useState<User>();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const playerData = usePlayerData();
    const navigate = useNavigate();

    useEffect(() => {
        getUser(ownerId).then(user => setUser(user));
    }, [ownerId]);

    function expandableContent() {
        if (!playerData) return <>Loading...</>;

        const players = roster.players;
        return players
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
        <>
            <div className={`teamPreviewHeader ${isEven ? 'even' : 'odd'}`}>
                {user && (
                    <img
                        className="avatarThumbnail"
                        src={`https://sleepercdn.com/avatars/thumbs/${user.avatar}`}
                    />
                )}
                {user?.display_name}{' '}
                {
                    <IconButton
                        onClick={() => {
                            navigate(
                                `../team?leagueId=${leagueId}&teamId=${index}`
                            );
                        }}
                    >
                        <OpenInNew />
                    </IconButton>
                }
                <span className="dropdownArrow">
                    <IconButton
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded && <ArrowDropUp />}
                        {!isExpanded && <ArrowDropDown />}
                    </IconButton>
                </span>
            </div>
            {isExpanded && (
                <div className="expandableContent">{expandableContent()}</div>
            )}
        </>
    );
}
