import React, {useRef} from 'react';
import styles from './PositionalGrades.module.css';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import {usePlayerData, usePlayerValues} from '../../../../../hooks/hooks';
import {FANTASY_POSITIONS, SUPER_FLEX_SET} from '../../../../../consts/fantasy';
import {scale, slider} from '../../../../../consts/images';
import ExportButton from '../../shared/ExportButton';

interface PositionalGradesProps {
    roster?: Roster;
    specifiedUser?: User;
}

const THRESHOLDS = new Map<string, number>([
    ['QB', 200],
    ['TE', 55],
    ['RB', 120],
    ['WR', 250],
    ['DEPTH', 150],
]);

export default function PositionalGrades({
    roster,
    specifiedUser,
}: PositionalGradesProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();
    const componentRef = useRef(null);

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
                    throw new Error(
                        `cannot find PlayerValue for player with name = '${fullName}'`
                    );
                }
                return acc + +playerValue.Value;
            }, 0);
    }

    function gradeByPosition(pos: string, score: number) {
        if (!SUPER_FLEX_SET.has(pos)) {
            throw new Error(`Unknown position '${pos}'`);
        }
        return Math.min(Math.round((10 * score) / THRESHOLDS.get(pos)!), 10);
    }

    function sanityCheck() {
        if (!playerData) return <></>;

        return FANTASY_POSITIONS.map(position => {
            const score = scoreByPosition(position);
            const grade = gradeByPosition(position, score);
            return (
                <div>
                    {position}: {score} - {grade}/10
                </div>
            );
        });
    }

    function scaleAndSlider(grade: number) {
        if (grade < 0 || grade > 10) {
            console.error(`grade out of range [0, 10]: '${grade}'`);
        }
        return (
            <div className={styles.scaleAndSlider}>
                <img src={scale} className={styles.scale} />
                <img
                    src={slider}
                    className={`${styles.slider}`}
                    style={{
                        bottom: `${grade * 27.5 - 25}px`,
                    }}
                />
            </div>
        );
    }

    function graphicComponent() {
        return (
            <div className={styles.graphicComponent} ref={componentRef}>
                {FANTASY_POSITIONS.map(position => {
                    const score = scoreByPosition(position);
                    const grade = gradeByPosition(position, score);
                    return scaleAndSlider(grade);
                })}
            </div>
        );
    }

    return (
        <div>
            {sanityCheck()}
            {graphicComponent()}
            {
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_positional_grades.png`}
                />
            }
        </div>
    );
}
