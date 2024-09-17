import {useEffect, useState} from 'react';
import styles from './RisersFallersModule.module.css';
import {Roster} from '../../../../../sleeper-api/sleeper-api';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import PlayerSelectComponent from '../../../shared/PlayerSelectComponent';
import StyledNumberInput from '../../../shared/StyledNumberInput';
export type RisersFallersModuleProps = {
    roster?: Roster;
    teamName?: string;
};
function useRisersFallers(roster?: Roster) {
    const [risers, setRisers] = useState<string[]>([]);
    const [riserValues, setRiserValues] = useState<number[]>([10, 20, 30]);
    const [fallers, setFallers] = useState<string[]>([]);
    const [fallerValues, setFallerValues] = useState<number[]>([-10, -20, -30]);
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    useEffect(() => {
        if (!roster || !playerData) return;
        const players = roster.players
            .map(p => playerData[p])
            .filter(p => !!p)
            .sort(sortByAdp)
            .map(p => p.player_id);
        setRisers(players.slice(0, 3));
        setFallers(players.slice(3, 6));
    }, [roster, playerData]);
    return {
        risers,
        setRisers,
        riserValues,
        setRiserValues,
        fallers,
        setFallers,
        fallerValues,
        setFallerValues,
    };
}
export default function RisersFallersModule({
    roster,
    teamName,
}: RisersFallersModuleProps) {
    const {
        risers,
        setRisers,
        riserValues,
        setRiserValues,
        fallers,
        setFallers,
        fallerValues,
        setFallerValues,
    } = useRisersFallers(roster);

    return (
        <div>
            <InputComponent
                playerIds={roster?.players || []}
                risers={risers}
                setRisers={setRisers}
                fallers={fallers}
                setFallers={setFallers}
                riserValues={riserValues}
                setRiserValues={setRiserValues}
                fallerValues={fallerValues}
                setFallerValues={setFallerValues}
            />
            <GraphicComponent
                risers={risers}
                fallers={fallers}
                riserValues={riserValues}
                fallerValues={fallerValues}
            />
        </div>
    );
}

type GraphicComponentProps = {
    risers: string[];
    fallers: string[];
    riserValues: number[];
    fallerValues: number[];
};
export function GraphicComponent({
    risers,
    fallers,
    riserValues,
    fallerValues,
}: GraphicComponentProps) {
    const playerData = usePlayerData();

    if (!playerData) return <></>;
    return (
        <div className={styles.graphicComponent}>
            <div className={`${styles.wholeColumn} ${styles.columnBorder}`}>
                <div className={`${styles.nameColumn} ${styles.risers}`}>
                    {risers.map(playerId => (
                        <div>
                            {playerData[playerId].first_name}{' '}
                            {playerData[playerId].last_name}
                        </div>
                    ))}
                </div>
                <div className={styles.arrowContainer}>
                    {fallerValues.map((value, idx) => (
                        <div key={idx}>+{value.toFixed(1)}%</div>
                    ))}
                </div>
            </div>
            <div className={styles.wholeColumn}>
                <div className={styles.arrowContainer}>
                    {riserValues.map((value, idx) => (
                        <div key={idx}>+{value}%</div>
                    ))}
                </div>
                <div className={styles.nameColumn}>
                    {fallers.map(playerId => (
                        <div>
                            {playerData[playerId].first_name}{' '}
                            {playerData[playerId].last_name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

type InputComponentProps = {
    playerIds: string[];
    risers: string[];
    setRisers: (risers: string[]) => void;
    fallers: string[];
    setFallers: (fallers: string[]) => void;
    riserValues: number[];
    setRiserValues: (riserValues: number[]) => void;
    fallerValues: number[];
    setFallerValues: (fallerValues: number[]) => void;
};

export function InputComponent({
    playerIds,
    risers,
    setRisers,
    fallers,
    setFallers,
    riserValues,
    setRiserValues,
    fallerValues,
    setFallerValues,
}: InputComponentProps) {
    return (
        <>
            {risers.map((riser, idx) => {
                return (
                    <div className={styles.inputRow}>
                        <StyledNumberInput
                            key={idx}
                            value={riserValues[idx]}
                            onChange={(_, value) => {
                                const newRiserValues = [...riserValues];
                                newRiserValues[idx] = value || 0;
                                setRiserValues(newRiserValues);
                            }}
                            min={0}
                            max={100}
                            step={0.1}
                        />
                        <PlayerSelectComponent
                            key={riser}
                            label={`Riser ${idx + 1}`}
                            playerIds={playerIds}
                            selectedPlayerIds={[riser]}
                            onChange={([riser]) => {
                                const newRisers = [...risers];
                                newRisers[idx] = riser;
                                setRisers(newRisers);
                            }}
                            multiple={false}
                        />
                    </div>
                );
            })}
            {fallers.map((faller, idx) => {
                return (
                    <div className={styles.inputRow}>
                        <StyledNumberInput
                            key={idx}
                            value={fallerValues[idx]}
                            onChange={(_, value) => {
                                const newFallerValues = [...fallerValues];
                                newFallerValues[idx] = value || 0;
                                setFallerValues(newFallerValues);
                            }}
                            min={-100}
                            max={0}
                            step={0.1}
                        />
                        <PlayerSelectComponent
                            key={faller}
                            label={`Faller ${idx + 1}`}
                            playerIds={playerIds}
                            selectedPlayerIds={[faller]}
                            onChange={([faller]) => {
                                const newFallers = [...fallers];
                                newFallers[idx] = faller;
                                setFallers(newFallers);
                            }}
                            multiple={false}
                        />
                    </div>
                );
            })}
        </>
    );
}
