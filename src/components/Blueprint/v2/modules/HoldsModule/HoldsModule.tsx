import React, {useEffect, useState} from 'react';
import styles from './HoldsModule.module.css';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import {TextField} from '@mui/material';
import {HoldTile} from '../SuggestedMovesModule/SuggestedMovesModule';
import ExportButton from '../../../shared/ExportButton';

export type HoldsModuleProps = {
    roster?: Roster;
    teamName?: string;
};

export function useHolds(roster: Roster | undefined) {
    const [holds, setHolds] = useState<string[]>([]);
    const [comments, setComments] = useState<string[]>([
        'comment 1',
        'comment 2',
    ]);
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

    return {holds, setHolds, comments, setComments};
}

export default function HoldsModule({roster, teamName}: HoldsModuleProps) {
    const {holds, setHolds, comments, setComments} = useHolds(roster);
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
                comments={comments}
                setComments={setComments}
            />
            <GraphicComponent holds={holds} comments={comments} />
        </>
    );
}

export type GraphicComponentProps = {
    holds: string[];
    comments: string[];
    graphicClassName?: string;
};
export function GraphicComponent({
    holds,
    comments,
    graphicClassName,
}: GraphicComponentProps) {
    return (
        <div className={`${styles.graphicComponent} ${graphicClassName ?? ''}`}>
            {holds.map((holdId, idx) => (
                <div key={idx} className={styles.holdColumn}>
                    <HoldTile playerId={holdId} />
                    <div className={styles.comment}>{comments[idx]}</div>
                </div>
            ))}
        </div>
    );
}

export type InputComponentProps = {
    playerIds: string[];
    holds: string[];
    setHolds: (holds: string[]) => void;
    comments: string[];
    setComments: (comments: string[]) => void;
};

export function InputComponent({
    playerIds,
    holds,
    setHolds,
    comments,
    setComments,
}: InputComponentProps) {
    const playerData = usePlayerData();
    if (!playerData) return <></>;
    const hold1 = playerData[holds[0]];
    const hold2 = playerData[holds[1]];
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
            <TextField
                label={
                    hold1
                        ? `${hold1.first_name} ${hold1.last_name} Comment`
                        : 'Comment 1'
                }
                value={comments[0]}
                onChange={e => setComments([e.target.value, comments[1]])}
            />
            <TextField
                label={
                    hold2
                        ? `${hold2.first_name} ${hold2.last_name} Comment`
                        : 'Comment 2'
                }
                value={comments[1]}
                onChange={e => setComments([comments[0], e.target.value])}
            />
        </div>
    );
}
