import {useRef} from 'react';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import styles from './Starters.module.css';
import {
    useLeagueIdFromUrl,
    useProjectedLineup,
    useRosterSettingsFromId,
    useTitle,
} from '../../../../../hooks/hooks';
import {logoImage} from '../../shared/Utilities';
import ExportButton from '../../shared/ExportButton';

export default function Starters(props: {
    roster?: Roster;
    specifiedUser?: User;
}) {
    const {roster, specifiedUser} = props;
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const [startingLineup] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    const componentRef = useRef(null);
    useTitle('Starters - Blueprint Generator');

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
            <div className={styles.graphicComponent} ref={componentRef}>
                {startingLineup.map(({player, position}) => {
                    return playerTarget(player, position);
                })}
            </div>
        );
    }

    return (
        <>
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_starters.png`}
                />
            }
            {graphicComponent()}
        </>
    );
}
