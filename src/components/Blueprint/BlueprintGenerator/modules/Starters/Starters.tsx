import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './Starters.module.css';
import {
    useLeagueIdFromUrl,
    useProjectedLineup,
    useRosterSettingsFromId,
    useTitle,
} from '../../../../../hooks/hooks';
import ExportButton from '../../../shared/ExportButton';
import {logoImage} from '../../../shared/Utilities';

function StartersModule(props: {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {roster, teamName, graphicComponentClass} = props;
    useTitle('Starters - Blueprint Generator');

    return (
        <>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_starters.png`}
                />
            )}
            <StartersGraphic
                roster={roster}
                transparent={false}
                graphicComponentClass={graphicComponentClass}
            />
        </>
    );
}

function StartersGraphic(props: {
    roster?: Roster;
    transparent?: boolean;
    graphicComponentClass?: string;
}) {
    const {roster, transparent, graphicComponentClass} = props;
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const [startingLineup] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );

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

    return (
        <div
            className={`${styles.graphicComponent} ${
                graphicComponentClass ?? ''
            } ${transparent ? '' : styles.background}`}
        >
            {startingLineup.map(({player, position}) => {
                return playerTarget(player, position);
            })}
        </div>
    );
}

export {StartersModule, StartersGraphic};
