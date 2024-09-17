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
        const firstFew = roster.players
            .map(p => playerData[p])
            .filter(p => !!p)
            .sort(sortByAdp)
            .map(p => p.player_id)
            .slice(0, 3);
        setRisers(firstFew);
        setFallers([...firstFew]);
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
