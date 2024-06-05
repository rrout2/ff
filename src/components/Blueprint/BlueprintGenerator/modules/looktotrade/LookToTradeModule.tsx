import {useEffect, useRef, useState} from 'react';
import styles from './LookToTradeModule.module.css';
import {usePlayerData, useTitle} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import {sortBySearchRank} from '../../../../Player/Search/PlayerSearch';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';

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

    function playerSelectComponent(
        players: string[],
        selectedPlayerIds: string[],
        onChange: (event: SelectChangeEvent<string[]>) => void
    ) {
        if (!playerData) return <></>;
        return (
            <FormControl
                style={{
                    margin: '4px',
                }}
            >
                <InputLabel>{'Player'}</InputLabel>
                <Select
                    value={selectedPlayerIds}
                    label={'Player'}
                    onChange={onChange}
                    multiple={true}
                >
                    {players
                        .map(playerId => playerData[playerId])
                        .sort(sortBySearchRank)
                        .map((player, idx) => (
                            <MenuItem value={player.player_id} key={idx}>
                                {player.first_name} {player.last_name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
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
                        {playerSelectComponent(
                            roster?.players ?? [],
                            playersToTrade[idx],
                            (e: SelectChangeEvent<string[]>) => {
                                const {
                                    target: {value},
                                } = e;
                                const newSelections = [...playersToTrade];
                                newSelections[idx] =
                                    typeof value === 'string'
                                        ? value.split(',')
                                        : value;
                                setPlayersToTrade(newSelections);
                            }
                        )}
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
