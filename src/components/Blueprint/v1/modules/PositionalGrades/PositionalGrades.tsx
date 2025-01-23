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
import {
    SUPER_FLEX_SET,
    FANTASY_POSITIONS,
    QB,
    TE,
    RB,
    WR,
} from '../../../../../consts/fantasy';
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
    leagueSize: number;
    isSuperFlex: boolean;
}

type Thresholds = {
    SF: Map<string, number>;
    ONE_QB: Map<string, number>;
};
// from google spreadsheet
const THRESHOLDS: Thresholds = {
    SF: new Map<string, number>([
        [QB, 200],
        [TE, 35],
        [RB, 144],
        [WR, 225],
    ]),
    ONE_QB: new Map<string, number>([
        [QB, 115 * 1.25], // 115 : 8 :: 115 * 1.25 : 10
        [TE, 35],
        [RB, 144],
        [WR, 225],
    ]),
};

/**
 * Given number starting players = num of teams * num of starters.
 * Small: <= 80
 * Medium: 81 - 119
 * Large: >= 120
 */
function getStarterPoolSizeMultiplier(
    numTeams: number,
    numStarters: number,
    pos: string,
    isSuperFlex: boolean
): number {
    const starterSize = numTeams * numStarters;
    if (isSuperFlex) {
        if (starterSize <= 80) {
            return LEAGUE_SIZE_MULTIPLIERS.SF.SMALL.get(pos)!;
        } else if (starterSize <= 119) {
            return LEAGUE_SIZE_MULTIPLIERS.SF.MEDIUM.get(pos)!;
        } else {
            return LEAGUE_SIZE_MULTIPLIERS.SF.LARGE.get(pos)!;
        }
    } else {
        if (starterSize <= 80) {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.SMALL.get(pos)!;
        } else if (starterSize <= 119) {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.MEDIUM.get(pos)!;
        } else {
            return LEAGUE_SIZE_MULTIPLIERS.ONE_QB.LARGE.get(pos)!;
        }
    }
}
const LEAGUE_SIZE_MULTIPLIERS = {
    SF: {
        SMALL: new Map<string, number>([
            [QB, 0.85],
            [TE, 1],
            [RB, 0.9],
            [WR, 0.9],
        ]),
        MEDIUM: new Map<string, number>([
            [QB, 0.95],
            [TE, 1],
            [RB, 0.95],
            [WR, 0.95],
        ]),
        LARGE: new Map<string, number>([
            [QB, 1],
            [TE, 1],
            [RB, 1],
            [WR, 1],
        ]),
    },
    ONE_QB: {
        SMALL: new Map<string, number>([
            [QB, 0.8],
            [TE, 1],
            [RB, 0.9],
            [WR, 0.9],
        ]),
        MEDIUM: new Map<string, number>([
            [QB, 0.85],
            [TE, 1],
            [RB, 0.95],
            [WR, 0.95],
        ]),
        LARGE: new Map<string, number>([
            [QB, 0.9],
            [TE, 1],
            [RB, 1],
            [WR, 1],
        ]),
    },
};

function PositionalGrades({
    roster,
    teamName,
    graphicComponentClass,
    transparent,
    isSuperFlex,
    leagueSize,
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
                isSuperFlex={isSuperFlex}
                leagueSize={leagueSize}
            />
            <GraphicComponent
                overrides={overrides}
                roster={roster}
                graphicComponentClass={graphicComponentClass}
                transparent={transparent}
                isSuperFlex={isSuperFlex}
                leagueSize={leagueSize}
            />
        </div>
    );
}

interface graphicProps {
    overrides?: Map<string, number>;
    roster?: Roster;
    graphicComponentClass?: string;
    transparent?: boolean;
    isSuperFlex: boolean;
    leagueSize: number;
}

function GraphicComponent({
    overrides,
    roster,
    graphicComponentClass,
    transparent,
    isSuperFlex,
    leagueSize,
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
                if (overrides && overrides.get(position)! >= 0) {
                    grade = overrides.get(position)!;
                } else {
                    grade = gradeByPosition(
                        position,
                        getPlayerValue,
                        isSuperFlex,
                        leagueSize,
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
    isSuperFlex: boolean;
    leagueSize: number;
    roster?: Roster;
}

function OverrideComponent({
    overrides,
    setOverrides,
    roster,
    isSuperFlex,
    leagueSize,
}: overrideProps) {
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
                            isSuperFlex,
                            leagueSize,
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

type scoreAndBump = {
    score: number;
    bump: number;
};

function scoreAndBumpByPosition(
    pos: string,
    getPlayerValue: (playerName: string) => PlayerValue | undefined,
    isSuperFlex: boolean,
    leagueSize: number,
    playerData?: PlayerData,
    roster?: Roster
): scoreAndBump {
    if (!SUPER_FLEX_SET.has(pos)) {
        throw new Error(`Unknown position '${pos}'`);
    }
    if (pos === TE) {
        throw new Error('Should use manual TE calculation');
    }
    if (!playerData || !roster || !roster.starters) return {score: 0, bump: 0};
    let totalBump = 0;

    const multiplier = getStarterPoolSizeMultiplier(
        leagueSize,
        roster.starters.length,
        pos,
        isSuperFlex
    );
    console.log({pos, multiplier});

    return {
        score:
            multiplier *
            roster.players
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
                    if (isSuperFlex) {
                        totalBump += +playerValue.sfBonus;
                    } else {
                        totalBump += +playerValue.oneQbBonus;
                    }
                    console.log({
                        fullName,
                        value: playerValue.Value,
                    });
                    return acc + +playerValue.Value;
                }, 0),
        bump: totalBump,
    };
}

export function gradeByPosition(
    pos: string,
    getPlayerValue: (playerName: string) => PlayerValue | undefined,
    isSuperFlex: boolean,
    leagueSize: number,
    playerData?: PlayerData,
    roster?: Roster
) {
    if (!playerData || !roster || !roster.starters) return 0;
    if (pos === TE) {
        return Math.max(
            ...roster.players
                .map(playerId => playerData[playerId])
                .filter(player => !!player)
                .map(
                    player =>
                        getPlayerValue(
                            `${player.first_name} ${player.last_name}`
                        )?.teValue || 0
                )
        );
    }
    const {score, bump} = scoreAndBumpByPosition(
        pos,
        getPlayerValue,
        !!isSuperFlex,
        leagueSize,
        playerData,
        roster
    );
    if (!SUPER_FLEX_SET.has(pos)) {
        throw new Error(`Unknown position '${pos}'`);
    }

    const threshold = isSuperFlex
        ? THRESHOLDS.SF.get(pos)!
        : THRESHOLDS.ONE_QB.get(pos)!;

    const rawGrade = (10 * score) / threshold;
    let unbumpedLimit = 10;
    if (pos === QB) {
        if (!isSuperFlex) {
            unbumpedLimit = 8;
        }
    } else if (pos === TE) {
        // may be able to remove this check
        unbumpedLimit = 8;
    }
    console.log({pos, score, threshold, rawGrade, bump});
    const cappedGrade = Math.round(Math.min(rawGrade, unbumpedLimit));
    return Math.min(cappedGrade + bump, 10);
}

export {PositionalGrades, GraphicComponent, OverrideComponent};
