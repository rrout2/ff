import {useEffect, useRef, useState} from 'react';
import styles from './LookToTradeModule.module.css';
import {usePlayerData, useTitle} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {Autocomplete, FormControl, TextField} from '@mui/material';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import PlayerSelectComponent from '../../shared/PlayerSelectComponent';

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
export default function LookToTradeModule(props: {
    roster?: Roster;
    specifiedUser?: User;
}) {
    const {roster, specifiedUser} = props;
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

    const playerReducer = (
        acc: string,
        curr: Player,
        idx: number,
        arr: Player[]
    ) => {
        const fullName = `${curr.first_name} ${curr.last_name}`;
        if (idx + 1 !== arr.length) {
            return `${acc}${fullName}/`;
        }
        return `${acc}${fullName}`;
    };

    function graphicComponent() {
        if (!playerData) return <></>;
        return (
            <div className={styles.graphicComponent} ref={componentRef}>
                <div className={styles.title}>LOOK TO TRADE:</div>
                {[0, 1, 2].map(idx => {
                    return tradeSuggestion(
                        playersToTrade[idx]
                            .map(playerId => playerData[playerId])
                            .reduce(playerReducer, ''),
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

    return (
        <>
            <div className={styles.body}>
                {graphicComponent()}
                {inputComponent()}
            </div>
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_looktotrade.png`}
                />
            }
        </>
    );
}
