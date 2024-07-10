import {useRef} from 'react';
import {
    useLeagueIdFromUrl,
    useRosterSettingsFromId,
    useProjectedLineup,
} from '../../../../../hooks/hooks';
import {Roster, Player} from '../../../../../sleeper-api/sleeper-api';
import {logoImage} from '../../shared/Utilities';
import styles from './Starters.module.css';

export function useStarters(
    roster?: Roster,
    graphicComponentClass?: string,
    transparent?: boolean
) {
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const [startingLineup] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    const componentRef = useRef(null);

    function playerTarget(player: Player, position: string) {
        let diplayPosition = position;
        if (position === 'WRRB_FLEX' || position === 'REC_FLEX') {
            diplayPosition = 'FLEX';
        }
        if (position === 'SUPER_FLEX') {
            diplayPosition = 'SF';
        }

        const fullName = `${player.first_name} ${player.last_name}`;
        const displayName =
            fullName.length >= 20
                ? `${player.first_name[0]}. ${player.last_name}`
                : fullName;
        const team = player.team ?? 'FA';

        return (
            <div className={styles.playerTargetBody}>
                <div
                    className={`${styles.positionChip} ${styles[diplayPosition]}`}
                >
                    {diplayPosition}
                </div>
                {logoImage(team, styles.teamLogo)}
                <div className={styles.targetName}>{displayName}</div>
                <div
                    className={styles.subtitle}
                >{`${player.position} - ${team}`}</div>
            </div>
        );
    }

    function graphicComponent() {
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                } ${transparent ? '' : styles.background}`}
                ref={componentRef}
            >
                {startingLineup.map(({player, position}) => {
                    return playerTarget(player, position);
                })}
            </div>
        );
    }

    return {graphicComponent: graphicComponent()};
}
