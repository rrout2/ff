import {useEffect, useRef, useState} from 'react';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import {
    PlayerData,
    useAdpData,
    usePlayerData,
} from '../../../../../hooks/hooks';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './CornerstoneModule.module.css';
import PlayerSelectComponent from '../../shared/PlayerSelectComponent';

export function useCornerstone(
    roster?: Roster,
    graphicComponentClass?: string
) {
    const playerData = usePlayerData();
    const {getAdp, sortByAdp} = useAdpData();
    const [cornerstones, setCornerstones] = useState(
        new Map<string, string[]>(FANTASY_POSITIONS.map(pos => [pos, []]))
    );
    function isCornerstone(player?: Player) {
        if (!player) return false;
        // this is probably pretty brittle
        const adp = getAdp(`${player.first_name} ${player.last_name}`);
        return adp <= 75 && adp >= 0;
    }

    const componentRef = useRef(null);

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

    function graphicComponent(
        cornerstones: Map<string, string[]>,
        playerData?: PlayerData,
        graphicComponentClass?: string
    ) {
        if (!playerData) return <></>;
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                }`}
                ref={componentRef}
            >
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
    return {
        graphicComponent: graphicComponent(
            cornerstones,
            playerData,
            graphicComponentClass
        ),
        allPositionalSelectors: allPositionalSelectors(),
    };
}
