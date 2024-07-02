import React from 'react';
import styles from './PositionalGrades.module.css';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import {usePlayerData, usePlayerValues} from '../../../../../hooks/hooks';
import {FANTASY_POSITIONS, SUPER_FLEX_SET} from '../../../../../consts/fantasy';

interface PositionalGradesProps {
    roster?: Roster;
    specifiedUser?: User;
}

const THRESHOLDS = new Map<string, number>([
    ['QB', 250],
    ['TE', 55],
    ['RB', 120],
    ['WR', 250],
]);

export default function PositionalGrades({
    roster,
    specifiedUser,
}: PositionalGradesProps) {
    const playerData = usePlayerData();
    const {getPlayerValue} = usePlayerValues();

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
        return Math.round((10 * score) / THRESHOLDS.get(pos)!);
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

    return <div>{sanityCheck()}</div>;
}
