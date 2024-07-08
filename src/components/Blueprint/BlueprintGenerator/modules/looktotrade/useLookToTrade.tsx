import {FormControl, Autocomplete, TextField} from '@mui/material';
import {useRef, useState, useEffect} from 'react';
import {usePlayerData, useTitle} from '../../../../../hooks/hooks';
import {Roster, User} from '../../../../../sleeper-api/sleeper-api';
import PlayerSelectComponent from '../../shared/PlayerSelectComponent';
import styles from './LookToTradeModule.module.css';
const COLORS = ['#3CB6E9', '#EC336D', '#8AC73E'];
const SUGGESTIONS = [
    'Bellcow',
    'Better DC',
    'Certainty',
    'Consistency',
    'Cornerstone Asset',
    'Developmental Asset',
    'Diversify Team Investment',
    'Downtier',
    'Downtier/Rushing QB',
    'Elite TE',
    'Higher Ceiling',
    'Higher Upside',
    'Other Position',
    'Pivot',
    'Proven Asset',
    'QB',
    'RB',
    'Rushing QB',
    'Safer Long-Term Asset',
    'Safer Situation',
    'Starting Asset',
    'WR',
    'WR1',
    'WR / RB',
    'Younger Asset',
];

export function useLookToTrade(
    roster?: Roster,
    graphicComponentClass?: string
) {
    const componentRef = useRef(null);
    const playerData = usePlayerData();
    const [playersToTrade, setPlayersToTrade] = useState<string[][]>([
        [],
        [],
        [],
    ]);
    const [inReturn, setInReturn] = useState<string[]>([
        'placeholder',
        'placeholder',
        'placeholder',
    ]);

    useEffect(() => {
        if (!roster) return;
        setPlayersToTrade([[], [], []]);
    }, [roster]);

    useTitle('Look to Trade - Blueprint Generator');

    const playerIdReducer = (
        acc: string,
        currPlayerId: string,
        idx: number,
        arr: string[]
    ) => {
        const player = playerData![currPlayerId];
        const displayValue = !player
            ? currPlayerId
            : `${player.first_name} ${player.last_name}`;
        if (idx + 1 !== arr.length) {
            return `${acc}${displayValue}/`;
        }
        return `${acc}${displayValue}`;
    };

    function graphicComponent() {
        if (!playerData) return <></>;
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                }`}
                ref={componentRef}
            >
                <div className={styles.title}>LOOK TO TRADE:</div>
                {[0, 1, 2].map(idx => {
                    return tradeSuggestion(
                        playersToTrade[idx].reduce(playerIdReducer, ''),
                        inReturn[idx].toLocaleUpperCase(),
                        COLORS[idx]
                    );
                })}
            </div>
        );
    }

    function inReturnComponent(idx: number) {
        return (
            <FormControl
                style={{
                    margin: '4px',
                }}
            >
                <Autocomplete
                    options={SUGGESTIONS}
                    inputValue={inReturn[idx]}
                    onInputChange={(_event, newInputValue) => {
                        const newInReturn = [...inReturn];
                        newInReturn[idx] = newInputValue;
                        setInReturn(newInReturn);
                    }}
                    renderInput={params => (
                        <TextField {...params} label="Suggestion" />
                    )}
                    freeSolo
                />
            </FormControl>
        );
    }

    function inputComponent() {
        const nonIdPlayerOptions: string[] = [];
        for (let i = 1; i < 15; i++) {
            nonIdPlayerOptions.push(
                `Rookie Pick 1.${i < 10 ? `0${i}` : `${i}`}`
            );
        }
        nonIdPlayerOptions.push('2025 1st');
        nonIdPlayerOptions.push('2026 1st');
        return (
            <div className={styles.inputComponent}>
                {playersToTrade.map((_, idx) => (
                    <>
                        <PlayerSelectComponent
                            playerIds={roster?.players ?? []}
                            selectedPlayerIds={playersToTrade[idx]}
                            onChange={(newPlayerIds: string[]) => {
                                const newSelections = [...playersToTrade];
                                newSelections[idx] = newPlayerIds;
                                setPlayersToTrade(newSelections);
                            }}
                            nonIdPlayerOptions={nonIdPlayerOptions}
                        />
                        {inReturnComponent(idx)}
                    </>
                ))}
            </div>
        );
    }

    function tradeSuggestion(send: string, receive: string, color: string) {
        return (
            <div className={styles.suggestion}>
                <div className={styles.send}>
                    <span className={styles.whiteBullet}>◦</span>
                    {send}
                </div>
                <div
                    className={styles.receive}
                    style={{backgroundColor: color}}
                >
                    {receive}
                </div>
            </div>
        );
    }

    return {
        graphicComponent: graphicComponent(),
        inputComponent: inputComponent(),
    };
}
