import React, {useRef, useState} from 'react';
import styles from './PositionalGrades.module.css';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import {usePlayerData, usePlayerValues} from '../../../../../hooks/hooks';
import {FANTASY_POSITIONS, SUPER_FLEX_SET} from '../../../../../consts/fantasy';
import {scale, slider} from '../../../../../consts/images';
import ExportButton from '../../shared/ExportButton';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';

interface PositionalGradesProps {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}

const THRESHOLDS = new Map<string, number>([
    ['QB', 200],
    ['TE', 55],
    ['RB', 108],
    ['WR', 250],
    ['DEPTH', 150],
]);

export default function PositionalGrades({
    roster,
    specifiedUser,
    graphicComponentClass,
}: PositionalGradesProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();
    const componentRef = useRef(null);
    const [overrides, setOverrides] = useState<Map<string, number>>(
        new Map(FANTASY_POSITIONS.map(pos => [pos, -1]))
    );

    function scoreByPosition(pos: string) {
        if (!SUPER_FLEX_SET.has(pos)) {
            throw new Error(`Unknown position '${pos}'`);
        }
        if (!playerData || !roster) return 0;

        return roster.players
            .map(playerId => playerData[playerId])
            .filter(
                player => !!player && player.fantasy_positions.includes(pos)
            )
            .reduce((acc: number, player: Player) => {
                const fullName = `${player.first_name} ${player.last_name}`;
                const playerValue = getPlayerValue(fullName);
                if (!playerValue) {
                    console.warn(
                        `cannot find PlayerValue for player with name = '${fullName}'`
                    );
                    return acc;
                }
                return acc + +playerValue.Value;
            }, 0);
    }

    function gradeByPosition(pos: string, score = scoreByPosition(pos)) {
        if (!SUPER_FLEX_SET.has(pos)) {
            throw new Error(`Unknown position '${pos}'`);
        }
        if (overrides.get(pos)! >= 0) {
            return overrides.get(pos)!;
        }
        return Math.min(Math.round((10 * score) / THRESHOLDS.get(pos)!), 10);
    }

    function gradeToSliderHeight(grade: number) {
        return grade * 27.5 - 25;
    }

    function scaleAndSliderColumn(grade: number, position: string) {
        if (grade < 0 || grade > 10) {
            console.error(`grade out of range [0, 10]: '${grade}'`);
        }
        return (
            <div className={styles.column} key={position}>
                <div className={styles.scaleAndSlider}>
                    <img src={scale} className={styles.scale} />
                    <img
                        src={slider}
                        className={`${styles.slider}`}
                        style={{
                            bottom: `${gradeToSliderHeight(grade)}px`,
                        }}
                    />
                </div>
                <div className={`${styles.chip} ${styles[position]}`}>
                    {position}
                </div>
                <div className={styles.grade}>
                    {grade}
                    <span className={styles.slash}>/</span>10
                </div>
            </div>
        );
    }

    function graphicComponent() {
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                }`}
                ref={componentRef}
            >
                {FANTASY_POSITIONS.map(position => {
                    const grade = gradeByPosition(position);
                    return scaleAndSliderColumn(grade, position);
                })}
            </div>
        );
    }

    function overrideSelector(pos: string) {
        if (!SUPER_FLEX_SET.has(pos)) {
            throw new Error(`Unknown position '${pos}'`);
        }
        return (
            <FormControl key={pos} style={{margin: '8px', width: '100px'}}>
                <InputLabel>{pos}</InputLabel>
                <Select
                    value={overrides.get(pos)!}
                    label={pos}
                    onChange={e => {
                        const newOverrides = new Map(overrides);
                        newOverrides.set(pos, +e.target.value);
                        setOverrides(newOverrides);
                    }}
                >
                    <MenuItem value={-1}>None</MenuItem>
                    {Array.from({length: 11}, (_, index) => (
                        <MenuItem key={index} value={index}>
                            {index}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    function overrideComponent() {
        return (
            <div>
                <div>Overrides:</div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    {FANTASY_POSITIONS.map(pos => overrideSelector(pos))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_positional_grades.png`}
                />
            )}
            {overrideComponent()}
            {graphicComponent()}
        </div>
    );
}
