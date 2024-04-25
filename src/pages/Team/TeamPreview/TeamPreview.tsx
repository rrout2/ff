import {useEffect, useState} from 'react';
import {Roster, User, getUser} from '../../../sleeper-api/sleeper-api';
import {ArrowDropUp, ArrowDropDown} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

import './TeamPreview.css';

export type TeamPreviewProps = {
    roster: Roster;
    index: number;
};

export default function TeamPreview({roster, index}: TeamPreviewProps) {
    const ownerId = roster.owner_id;
    const isEven = index % 2 === 0;

    const [user, setUser] = useState<User>();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        getUser(ownerId).then(user => setUser(user));
    }, [ownerId]);

    function expandableContent() {
        const players = roster.players;
        return players.map(player => (
            <div key={player}>Player with ID = {player}</div>
        ));
    }

    return (
        <>
            <div className={`teamPreviewHeader ${isEven ? 'even' : 'odd'}`}>
                <img
                    className="avatarThumbnail"
                    src={`https://sleepercdn.com/avatars/thumbs/${user?.avatar}`}
                />
                {user?.display_name}
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
            <div>{isExpanded && expandableContent()}</div>
        </>
    );
}
