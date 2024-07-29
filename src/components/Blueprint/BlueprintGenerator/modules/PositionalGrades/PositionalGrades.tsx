import styles from './PositionalGrades.module.css';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import ExportButton from '../../../shared/ExportButton';
import {
    InputLabel,
    SelectChangeEvent,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import {SUPER_FLEX_SET, FANTASY_POSITIONS} from '../../../../../consts/fantasy';
import {scale, slider} from '../../../../../consts/images';
import {Dispatch, SetStateAction, useState} from 'react';
import {
    PlayerData,
    PlayerValue,
    usePlayerData,
    usePlayerValues,
} from '../../../../../hooks/hooks';

interface PositionalGradesProps {
    roster?: Roster;
    teamName?: string;
    graphicComponentClass?: string;
    transparent?: boolean;
}

const THRESHOLDS = new Map<string, number>([
    ['QB', 200],
    ['TE', 55],
    ['RB', 108],
    ['WR', 250],
    ['DEPTH', 150],
]);

function PositionalGrades({
    roster,
    teamName,
    graphicComponentClass,
    transparent,
}: PositionalGradesProps) {
    const [overrides, setOverrides] = useState<Map<string, number>>(
        new Map(FANTASY_POSITIONS.map(pos => [pos, -1]))
    );

    return (
        <div>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${teamName}_positional_grades.png`}
                />
            )}
            <OverrideComponent
                overrides={overrides}
                setOverrides={setOverrides}
                roster={roster}
            />
            <GraphicComponent
                overrides={overrides}
                roster={roster}
                graphicComponentClass={graphicComponentClass}
                transparent={transparent}
            />
        </div>
    );
}

interface graphicProps {
    overrides: Map<string, number>;
    roster?: Roster;
    graphicComponentClass?: string;
    transparent?: boolean;
}

function GraphicComponent({
    overrides,
    roster,
    graphicComponentClass,
    transparent,
}: graphicProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();

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

    return (
        <div
            className={`${styles.graphicComponent} ${
                graphicComponentClass ?? ''
            } ${transparent ? '' : styles.background}`}
        >
            {FANTASY_POSITIONS.map(position => {
                let grade = 0;
                if (overrides.get(position)! >= 0) {
                    grade = overrides.get(position)!;
                } else {
                    grade = gradeByPosition(
                        position,
                        getPlayerValue,
                        playerData,
                        roster
                    );
                }
                return scaleAndSliderColumn(grade, position);
            })}
        </div>
    );
}

interface overrideProps {
    overrides: Map<string, number>;
    setOverrides: Dispatch<SetStateAction<Map<string, number>>>;
    roster?: Roster;
}

function OverrideComponent({overrides, setOverrides, roster}: overrideProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();

    function overrideSelector(pos: string) {
        if (!SUPER_FLEX_SET.has(pos)) {
            throw new Error(`Unknown position '${pos}'`);
        }

        return (
            <FormControl key={pos} style={{margin: '4px'}}>
                <InputLabel>{pos}</InputLabel>
                <Select
                    value={overrides.get(pos)!}
                    label={pos}
                    onChange={(e: SelectChangeEvent<number>) => {
                        const newOverrides = new Map(overrides);
                        if (!e) return;
                        newOverrides.set(pos, +e.target.value);
                        setOverrides(newOverrides);
                    }}
                >
                    <MenuItem value={-1}>
                        None (
                        {gradeByPosition(
                            pos,
                            getPlayerValue,
                            playerData,
                            roster
                        )}
                        )
                    </MenuItem>
                    {Array.from({length: 11}, (_, index) => (
                        <MenuItem key={index} value={index}>
                            {index}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
    return <>{FANTASY_POSITIONS.map(pos => overrideSelector(pos))}</>;
}

function scoreByPosition(
    pos: string,
    getPlayerValue: (playerName: string) => PlayerValue | undefined,
    playerData?: PlayerData,
    roster?: Roster
) {
    if (!SUPER_FLEX_SET.has(pos)) {
        throw new Error(`Unknown position '${pos}'`);
    }
    if (!playerData || !roster) return 0;

    return roster.players
        .map(playerId => playerData[playerId])
        .filter(player => !!player && player.fantasy_positions.includes(pos))
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

function gradeByPosition(
    pos: string,
    getPlayerValue: (playerName: string) => PlayerValue | undefined,
    playerData?: PlayerData,
    roster?: Roster,
    score = scoreByPosition(pos, getPlayerValue, playerData, roster)
) {
    if (!SUPER_FLEX_SET.has(pos)) {
        throw new Error(`Unknown position '${pos}'`);
    }

    return Math.min(Math.round((10 * score) / THRESHOLDS.get(pos)!), 10);
}

export {PositionalGrades, GraphicComponent, OverrideComponent};
