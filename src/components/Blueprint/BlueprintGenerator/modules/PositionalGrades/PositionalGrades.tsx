import React from 'react';
import styles from './PositionalGrades.module.css';
import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import {usePlayerData, usePlayerValues} from '../../../../../hooks/hooks';
import {sortBySearchRank} from '../../../../Player/Search/PlayerSearch';

interface PositionalGradesProps {
    roster?: Roster;
    specifiedUser?: User;
}

export default function PositionalGrades({
    roster,
    specifiedUser,
}: PositionalGradesProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();
    // roster => playerIds => players => filter by position =>
    //     get name => playerValues => sum => do calculation

    function something() {
        if (!playerData) return <></>;
        return roster?.players
            .map(playerId => playerData[playerId])
            .sort(sortBySearchRank)
            .map(player => {
                const fullName = `${player.first_name} ${player.last_name}`;
                return (
                    <div>
                        {fullName}: {getPlayerValue(fullName)?.Value}
                    </div>
                );
            });
    }

    return <div className={styles.PositionalGrades}>{something()}</div>;
}
