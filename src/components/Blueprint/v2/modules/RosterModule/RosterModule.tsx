import {Dispatch, SetStateAction, useState} from 'react';
import {COLORS} from '../../../../../consts/colors';
import {FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import {useAdpData, usePlayerData} from '../../../../../hooks/hooks';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './RosterModule.module.css';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import ExportButton from '../../../shared/ExportButton';

export default function RosterModule({
    roster,
    numRosters,
    teamName,
}: {
    roster: Roster;
    numRosters: number;
    teamName?: string;
}) {
    const playerData = usePlayerData();
    const {sortByAdp} = useAdpData();
    const rankStateMap = new Map(
        FANTASY_POSITIONS.map(pos => [pos, useState('4th')])
    );

    if (!playerData) return <></>;
    const allPlayers = roster.players
        .map(playerId => playerData[playerId])
        .sort(sortByAdp);

    return (
        <>
            <InputComponent rankStateMap={rankStateMap} />
            <ExportButton
                className={styles.fullRoster}
                pngName={`${teamName}_roster.png`}
            />
            <GraphicComponent
                allPlayers={allPlayers}
                rankStateMap={rankStateMap}
                numRosters={numRosters}
            />
        </>
    );
}

interface GraphicComponentProps {
    graphicClassName?: string;
    allPlayers: Player[];
    rankStateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>;
    numRosters: number;
}

export function GraphicComponent({
    graphicClassName,
    allPlayers,
    rankStateMap,
    numRosters,
}: GraphicComponentProps) {
    const {getPositionalAdp} = useAdpData();

    function positionalAdpToColor(adp: number) {
        if (adp <= 20) {
            return '#39B54A';
        }
        if (adp <= 40) {
            return '#F5EE31';
        }
        if (adp <= 60) {
            return '#F7941D';
        }

        if (adp === Infinity) {
            return 'gray';
        }

        return '#D82A29';
    }

    return (
        <div className={`${styles.fullRoster} ${graphicClassName ?? ''}`}>
            {FANTASY_POSITIONS.map(pos => (
                <div className={styles.positionColumn}>
                    <div
                        className={styles.positionHeader}
                        style={{
                            color: COLORS.get(pos),
                        }}
                    >
                        <div>{pos}</div>
                        <div className={styles.postionalRank}>
                            {rankStateMap.get(pos)?.[0]} / {numRosters}
                        </div>
                    </div>
                    {allPlayers
                        .filter(player => !!player && player.position === pos)
                        .map(player => {
                            const fullName = `${player.first_name} ${player.last_name}`;
                            const positionalAdp = getPositionalAdp(fullName);
                            return (
                                <div className={styles.rosterPlayer}>
                                    <div>{fullName.toUpperCase()}</div>
                                    <div
                                        style={{
                                            color: positionalAdpToColor(
                                                positionalAdp
                                            ),
                                        }}
                                    >
                                        {positionalAdp === Infinity
                                            ? '-'
                                            : positionalAdp}
                                    </div>
                                </div>
                            );
                        })
                        .slice(0, 10)}
                </div>
            ))}
        </div>
    );
}

export function InputComponent({
    rankStateMap,
}: {
    rankStateMap: Map<string, [string, Dispatch<SetStateAction<string>>]>;
}) {
    return (
        <>
            {FANTASY_POSITIONS.map(pos => {
                return (
                    <FormControl style={{margin: '4px'}}>
                        <InputLabel>{pos}</InputLabel>
                        <Select
                            label={pos}
                            value={rankStateMap.get(pos)![0]}
                            onChange={e => {
                                rankStateMap.get(pos)![1](e.target.value);
                            }}
                        >
                            <MenuItem value={'1st'}>1st</MenuItem>
                            <MenuItem value={'2nd'}>2nd</MenuItem>
                            <MenuItem value={'3rd'}>3rd</MenuItem>
                            <MenuItem value={'4th'}>4th</MenuItem>
                            <MenuItem value={'5th'}>5th</MenuItem>
                            <MenuItem value={'6th'}>6th</MenuItem>
                            <MenuItem value={'7th'}>7th</MenuItem>
                            <MenuItem value={'8th'}>8th</MenuItem>
                            <MenuItem value={'9th'}>9th</MenuItem>
                            <MenuItem value={'10th'}>10th</MenuItem>
                            <MenuItem value={'11th'}>11th</MenuItem>
                            <MenuItem value={'12th'}>12th</MenuItem>
                            <MenuItem value={'13th'}>13th</MenuItem>
                            <MenuItem value={'14th'}>14th</MenuItem>
                            <MenuItem value={'15th'}>15th</MenuItem>
                            <MenuItem value={'16th'}>16th</MenuItem>
                        </Select>
                    </FormControl>
                );
            })}
        </>
    );
}
