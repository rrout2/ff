import {useEffect, useState} from 'react';
import {User, getUser} from '../../../sleeper-api/sleeper-api';
import {ArrowDropUp, ArrowDropDown} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

import './TeamPreview.css';

export type TeamPreviewProps = {
    ownerId: string;
};

export default function TeamPreview({ownerId}: TeamPreviewProps) {
    const [user, setUser] = useState<User>();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    useEffect(() => {
        getUser(ownerId).then(user => setUser(user));
    }, [ownerId]);
    return (
        <>
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
        </>
    );
}
