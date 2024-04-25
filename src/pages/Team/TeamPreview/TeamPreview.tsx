import {useEffect, useState} from 'react';
import {Player, Roster, User, getUser} from '../../../sleeper-api/sleeper-api';
import {ArrowDropUp, ArrowDropDown} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

import playersJson from '../../../data/players.json';
import './TeamPreview.css';

interface PlayerData {
    [key: string]: Player;
}

export type TeamPreviewProps = {
    roster: Roster;
    index: number;
};

export default function TeamPreview({roster, index}: TeamPreviewProps) {
    const ownerId = roster.owner_id;
    const isEven = index % 2 === 0;

    const [user, setUser] = useState<User>();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [playerData, setPlayerData] = useState<PlayerData>();

    useEffect(() => {
        setPlayerData(playersJson as unknown as PlayerData);
    }, [playerData]);

    useEffect(() => {
        getUser(ownerId).then(user => setUser(user));
    }, [ownerId]);

    function expandableContent() {
        if (!playerData) return <>Loading...</>;
        const players = roster.players;
        return players.map(player => (
            <div key={player}>
                {playerData[player].first_name} {playerData[player].last_name}
            </div>
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
