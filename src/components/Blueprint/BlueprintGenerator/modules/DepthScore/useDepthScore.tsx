import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {
    useLeagueIdFromUrl,
    useRosterSettingsFromId,
    useProjectedLineup,
    usePlayerValues,
} from '../../../../../hooks/hooks';
import {Player, Roster} from '../../../../../sleeper-api/sleeper-api';
import styles from './DepthScore.module.css';
const THRESHOLD = 150;
export function useDepthScore(
    roster?: Roster,
    graphicComponentClass?: string,
    transparent?: boolean
) {
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const [_, bench, benchString] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    const {getPlayerValue} = usePlayerValues();
    const componentRef = useRef(null);
    const [override, setOverride] = useState(-1);
    const [score, setScore] = useState(-1);
    const [initialScore, setInitialScore] = useState(-1);

    useEffect(() => {
        if (!bench.length) return;
        setScore(calculateDepthScoreOrOverride());
    }, [bench, override]);

    useEffect(() => {
        if (!bench.length) return;
        setInitialScore(calculateDepthScore());
    }, [bench]);

    function calculateDepthScoreOrOverride() {
        if (override >= 0) return override;
        return calculateDepthScore();
    }

    function calculateDepthScore() {
        const score = bench.reduce((acc: number, curr: Player) => {
            const playerValue = getPlayerValue(
                `${curr.first_name} ${curr.last_name}`
            );
            if (!playerValue) return acc;
            return acc + +playerValue.Value;
        }, 0);
        return Math.min(Math.round((10 * score) / THRESHOLD), 10);
    }

    function graphicComponent() {
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                } ${transparent ? '' : styles.background}`}
                ref={componentRef}
            >
                <div className={styles.title}>DEPTH SCORE:</div>
                <div className={styles.scoreSection}>
                    <div className={styles.scoreBar}>
                        <div
                            className={styles.scoreFill}
                            style={{width: `${score}0%`}}
                        />
                    </div>
                    <div className={styles.score}>{score}/10</div>
                </div>
                <div className={styles.benchString}>{benchString}</div>
            </div>
        );
    }

    function overrideComponent() {
        return (
            <FormControl style={{margin: '8px'}}>
                <InputLabel>Override</InputLabel>
                <Select
                    value={override}
                    label={'Override'}
                    onChange={e => {
                        setOverride(+e.target.value);
                    }}
                >
                    <MenuItem value={-1}>None ({initialScore})</MenuItem>
                    {Array.from({length: 11}, (_, index) => (
                        <MenuItem key={index} value={index}>
                            {index}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    return {
        graphicComponent: graphicComponent(),
        overrideComponent: overrideComponent(),
    };
}
