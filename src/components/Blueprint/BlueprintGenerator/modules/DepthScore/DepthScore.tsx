import {useRef, useState} from 'react';
import {Player, Roster, User} from '../../../../../sleeper-api/sleeper-api';
import styles from './DepthScore.module.css';
import {
    useLeagueIdFromUrl,
    usePlayerValues,
    useProjectedLineup,
    useRosterSettingsFromId,
} from '../../../../../hooks/hooks';
import ExportButton from '../../shared/ExportButton';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';

interface DepthScoreProps {
    roster?: Roster;
    specifiedUser?: User;
    graphicComponentClass?: string;
}
const THRESHOLD = 150;

export default function DepthScore({
    roster,
    specifiedUser,
    graphicComponentClass,
}: DepthScoreProps) {
    const [leagueId] = useLeagueIdFromUrl();
    const rosterSettings = useRosterSettingsFromId(leagueId);
    const [_, bench, benchString] = useProjectedLineup(
        rosterSettings,
        roster?.players
    );
    const {getPlayerValue} = usePlayerValues();
    const componentRef = useRef(null);
    const [override, setOverride] = useState(-1);

    function calculateDepthScore() {
        if (override >= 0) return override;
        const score = bench.reduce((acc: number, curr: Player) => {
            const playerValue = getPlayerValue(
                `${curr.first_name} ${curr.last_name}`
            );
            if (!playerValue) return acc;
            return acc + +playerValue.Value;
        }, 0);
        return Math.round((10 * score) / THRESHOLD);
    }

    function graphicComponent() {
        const score = calculateDepthScore();
        return (
            <div
                className={`${styles.graphicComponent} ${
                    graphicComponentClass ?? ''
                }`}
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
            <FormControl style={{margin: '8px', width: '100px'}}>
                <InputLabel>Override</InputLabel>
                <Select
                    value={override}
                    label={'Override'}
                    onChange={e => {
                        setOverride(+e.target.value);
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

    return (
        <>
            {!graphicComponentClass && (
                <ExportButton
                    className={styles.graphicComponent}
                    pngName={`${
                        specifiedUser?.metadata?.team_name ??
                        specifiedUser?.display_name
                    }_depth_score.png`}
                />
            )}
            {overrideComponent()}
            {graphicComponent()}
        </>
    );
}
