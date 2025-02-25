import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './Starters.module.css';
import {
    useBuySellData,
    useLeagueIdFromUrl,
    usePlayerData,
    useProjectedLineup,
    useRosterSettingsFromId,
    useTitle,
} from '../../../../../hooks/hooks';
import ExportButton from '../../../shared/ExportButton';
import {logoImage} from '../../../shared/Utilities';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import {
    RB,
    TE,
    WR,
    WR_RB_FLEX,
    WR_TE_FLEX,
    SUPER_FLEX,
    FLEX,
    FLEX_SET,
    SUPER_FLEX_SET,
} from '../../../../../consts/fantasy';

function StartersModule(props: {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
}) {
    const {roster, teamName, graphicComponentClass} = props;
    useTitle('Starters - Blueprint Generator');
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const {startingLineup, setStartingLineup} = useProjectedLineup(
        rosterSettings,
        roster?.players
    );

    return (
        <>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_starters.png`}
                />
            )}
            <InputComponent
                startingLineup={startingLineup}
                setStartingLineup={setStartingLineup}
                roster={roster}
            />
            <StartersGraphic
                startingLineup={startingLineup}
                transparent={false}
                graphicComponentClass={graphicComponentClass}
            />
        </>
    );
}

function InputComponent(props: {
    startingLineup: Lineup;
    setStartingLineup: React.Dispatch<React.SetStateAction<Lineup>>;
    roster?: Roster;
}) {
    const {startingLineup, setStartingLineup, roster} = props;
    const playerData = usePlayerData();

    if (!playerData) return <></>;

    function isPlayerInPosition(player: Player, position: string) {
        switch (position) {
            case WR_RB_FLEX:
                return player.position === WR || player.position === RB;
            case WR_TE_FLEX:
                return player.position === WR || player.position === TE;
            case FLEX:
                return FLEX_SET.has(player.position);
            case SUPER_FLEX:
                return SUPER_FLEX_SET.has(player.position);
            default:
                return !!player && player.position === position;
        }
    }

    return (
        <>
            {startingLineup.map(({player, position}, idx) => {
                return (
                    <PlayerSelectComponent
                        key={idx}
                        playerIds={(roster?.players ?? [])
                            .map(p => playerData[p])
                            .filter(p => !!p)
                            .filter(p => isPlayerInPosition(p, position))
                            .map(p => p.player_id)}
                        selectedPlayerIds={[player.player_id]}
                        onChange={([newPlayerId]: string[]) => {
                            setStartingLineup((oldLineup: Lineup) => {
                                const newLineup = [...oldLineup];
                                newLineup[idx] = {
                                    player: playerData[newPlayerId],
                                    position: position,
                                };
                                return newLineup;
                            });
                        }}
                        multiple={false}
                        maxSelections={1}
                        label={position}
                    />
                );
            })}
        </>
    );
}

export type Lineup = {
    player: Player;
    position: string;
}[];

function StartersGraphic(props: {
    startingLineup?: Lineup;
    transparent?: boolean;
    graphicComponentClass?: string;
    infinite?: boolean;
}) {
    const {startingLineup, transparent, graphicComponentClass, infinite} =
        props;
    const {getVerdict} = useBuySellData();

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
            <div className={styles.playerTargetBody} key={player.player_id}>
                <div
                    className={`${styles.positionChip} ${styles[diplayPosition]}`}
                >
                    {diplayPosition}
                </div>
                {logoImage(team, styles.teamLogo)}
                <div className={styles.targetName}>{displayName}</div>
                {!infinite && (
                    <div
                        className={styles.subtitle}
                    >{`${player.position} - ${team}`}</div>
                )}
                {infinite && (
                    <DifferenceChip
                        difference={getVerdict(fullName)?.difference ?? 0}
                    />
                )}
            </div>
        );
    }

    return (
        <div
            className={`${styles.graphicComponent} ${
                graphicComponentClass ?? ''
            } ${transparent ? '' : styles.background}`}
        >
            {startingLineup?.map(({player, position}) => {
                return playerTarget(player, position);
            })}
        </div>
    );
}

function DifferenceChip({difference}: {difference: number}) {
    let color = 'gray';
    let displayDifference = '';
    if (difference > 3) {
        color = '#8DC63F';
        displayDifference = ` + ${difference}`;
    } else if (difference < -3) {
        color = '#EF4136';
        displayDifference = ` - ${Math.abs(difference)}`;
    } else {
        color = '#F3C01D';
        displayDifference = '=';
    }
    return (
        <div className={styles.differenceChip} style={{color: color}}>
            <div className={styles.difference}>{displayDifference}</div>
        </div>
    );
}

export {StartersModule, StartersGraphic, InputComponent};
