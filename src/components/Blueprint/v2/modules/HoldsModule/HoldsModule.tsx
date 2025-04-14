import React, {useEffect, useState} from 'react';
import styles from './HoldsModule.module.css';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import {HoldTile} from '../SuggestedMovesModule/SuggestedMovesModule';
import ExportButton from '../../../shared/ExportButton';

export type HoldsModuleProps = {
    roster?: Roster;
    teamName?: string;
};

export function useHolds(roster: Roster | undefined) {
    const [holds, setHolds] = useState<string[]>([]);
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    useEffect(() => {
        if (!roster || !playerData) return;
        setHolds(
            roster.players
                .map(p => playerData[p])
                .filter(p => !!p)
                .sort(sortByAdp)
                .map(p => p.player_id)
                .slice(0, 2)
        );
    }, [roster, playerData]);

    return {holds, setHolds};
}

export default function HoldsModule({roster, teamName}: HoldsModuleProps) {
    const {holds, setHolds} = useHolds(roster);
    return (
        <>
            <ExportButton
                className={styles.graphicComponent}
                pngName={`${teamName}_holds.png`}
            />
            <InputComponent
                playerIds={roster?.players ?? []}
                holds={holds}
                setHolds={setHolds}
            />
            <GraphicComponent holds={holds} />
        </>
    );
}

export type GraphicComponentProps = {
    holds: string[];
    graphicClassName?: string;
};
export function GraphicComponent({
    holds,
    graphicClassName,
}: GraphicComponentProps) {
    return (
        <div className={`${styles.graphicComponent} ${graphicClassName ?? ''}`}>
            {holds.map((holdId, idx) => (
                <div key={idx} className={styles.holdColumn}>
                    <HoldTile playerId={holdId} />
                    {/* <div className={styles.comment}>{comments[idx]}</div> */}
                </div>
            ))}
        </div>
    );
}

export type InputComponentProps = {
    playerIds: string[];
    holds: string[];
    setHolds: (holds: string[]) => void;
};

export function InputComponent({
    playerIds,
    holds,
    setHolds,
}: InputComponentProps) {
    return (
        <div className={styles.inputComponent}>
            <PlayerSelectComponent
                label="Holds"
                playerIds={playerIds}
                selectedPlayerIds={holds}
                onChange={setHolds}
                nonIdPlayerOptions={[]}
                multiple={true}
                maxSelections={2}
            />
        </div>
    );
}
