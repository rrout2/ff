import {useEffect, useState} from 'react';
import {QB, RB, TE, WR} from '../../../../consts/fantasy';
import {usePlayerData, usePlayerValues} from '../../../../hooks/hooks';
import {Roster} from '../../../../sleeper-api/sleeper-api';
import {gradeByPosition} from '../../v1/modules/PositionalGrades/PositionalGrades';
import styles from './RosterTier.module.css';

function getTierColor(tier: RosterTier) {
    switch (tier) {
        case RosterTier.Rebuild:
            return '#ee2924';
        case RosterTier.Reload:
            return '#f15a29';
        case RosterTier.Competitive:
            return '#f1bb1f';
        case RosterTier.Championship:
            return '#8dc63f';
        case RosterTier.Elite:
            return '#009444';
        default:
            return '#000000';
    }
}

enum RosterTier {
    Unknown = 'UNKNOWN',
    Rebuild = 'REBUILD',
    Reload = 'RELOAD',
    Competitive = 'COMPETITIVE',
    Championship = 'CHAMPIONSHIP',
    Elite = 'ELITE',
}
type RosterTierComponentProps = {
    isSuperFlex: boolean;
    leagueSize: number;
    roster?: Roster;
};

const RosterTierComponent = ({
    isSuperFlex,
    leagueSize,
    roster,
}: RosterTierComponentProps) => {
    const {getPlayerValue} = usePlayerValues();
    const playerData = usePlayerData();
    const [tier, setTier] = useState<RosterTier>(RosterTier.Unknown);
    useEffect(() => {
        if (!playerData || !roster || !leagueSize) return;
        setTier(calculateRosterTier());
    }, [isSuperFlex, leagueSize, getPlayerValue, playerData, roster]);

    function calculateRosterTier(): RosterTier {
        const qbGrade = gradeByPosition(
            QB,
            getPlayerValue,
            isSuperFlex,
            leagueSize,
            playerData,
            roster
        );
        const teGrade = gradeByPosition(
            TE,
            getPlayerValue,
            isSuperFlex,
            leagueSize,
            playerData,
            roster
        );
        const wrGrade = gradeByPosition(
            WR,
            getPlayerValue,
            isSuperFlex,
            leagueSize,
            playerData,
            roster
        );
        const rbGrade = gradeByPosition(
            RB,
            getPlayerValue,
            isSuperFlex,
            leagueSize,
            playerData,
            roster
        );
        // Weighted average
        const rosterGrade = isSuperFlex
            ? (qbGrade + teGrade * 0.5 + wrGrade + rbGrade) / 3.5
            : (qbGrade * 0.5 + teGrade * 0.5 + wrGrade + rbGrade) / 3;
        if (rosterGrade <= 4) {
            return RosterTier.Rebuild;
        }
        if (rosterGrade <= 5) {
            return RosterTier.Reload;
        }
        if (rosterGrade <= 7) {
            return RosterTier.Competitive;
        }
        if (rosterGrade <= 8.5) {
            return RosterTier.Championship;
        }
        return RosterTier.Elite;
    }

    return (
        <div className={styles.rosterTier} style={{color: getTierColor(tier)}}>
            {tier}
        </div>
    );
};

export default RosterTierComponent;
