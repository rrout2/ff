import {useEffect, useRef, useState} from 'react';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import {useAdpData, usePlayerData, useTitle} from '../../../../../hooks/hooks';
import styles from './CornerstoneModule.module.css';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../shared/ExportButton';
import PlayerSelectComponent from '../../shared/PlayerSelectComponent';

export default function CornerstoneModule(props: {
    roster?: Roster;
    specifiedUser?: User;
}) {
    const {roster, specifiedUser} = props;
    const playerData = usePlayerData();
    const componentRef = useRef(null);
    const {getAdp, sortByAdp} = useAdpData();
    const [cornerstones, setCornerstones] = useState(
        new Map<string, string[]>(FANTASY_POSITIONS.map(pos => [pos, []]))
    );

    useTitle('Cornerstones - Blueprint Generator');

    function isCornerstone(player?: Player) {
        if (!player) return false;
        // this is probably pretty brittle
        const adp = getAdp(`${player.first_name} ${player.last_name}`);
        return adp <= 75 && adp >= 0;
    }

    useEffect(() => {
        if (!roster || !playerData) return;

        const cornerstones = roster.players
            .map(playerId => playerData[playerId])
            .filter(isCornerstone)
            .sort(sortByAdp);

        setCornerstones(
            new Map<string, string[]>(
                FANTASY_POSITIONS.map(pos => [
                    pos,
                    cornerstones
                        .filter(player =>
                            player.fantasy_positions.includes(pos)
                        )
                        .map(player => player.player_id)
                        .slice(0, 3),
                ])
            )
        );
    }, [roster, playerData]);

    function graphicComponent() {
        if (!playerData) return <></>;
        return (
            <div className={styles.graphicComponent} ref={componentRef}>
                <div className={styles.positions}>
                    {FANTASY_POSITIONS.map(pos => (
                        <div className={styles.column}>
                            <div
                                className={`${styles.positionChip} ${styles[pos]}`}
                            >
                                {pos}
                            </div>
                            <div className={styles.cornerstoneList}>
                                {cornerstones
                                    .get(pos)!
                                    .map(playerId => playerData[playerId])
                                    .map(player => {
                                        return (
                                            <div>
                                                {`${player.first_name} ${player.last_name}`.toLocaleUpperCase()}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function allPositionalSelectors() {
        return FANTASY_POSITIONS.map(pos => (
            <PlayerSelectComponent
                playerIds={roster?.players ?? []}
                selectedPlayerIds={cornerstones.get(pos) ?? []}
                position={pos}
                onChange={(newPlayerIds: string[]) => {
                    cornerstones.set(pos, newPlayerIds);
                    setCornerstones(new Map(cornerstones));
                }}
            />
        ));
    }

    return (
        <>
            {graphicComponent()}
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_cornerstones.png`}
                />
            }
            {allPositionalSelectors()}
        </>
    );
}
